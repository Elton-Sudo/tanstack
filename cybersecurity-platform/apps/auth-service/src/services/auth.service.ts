import { DatabaseService } from '@app/database';
import { LoggerService } from '@app/logging';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto, LoginDto, RegisterDto } from '../dto/auth.dto';
import { MfaService } from './mfa.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
    private readonly mfaService: MfaService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, tenantId } = registerDto;

    // Check if user exists
    const existingUser = await this.prisma.user.findFirst({
      where: { email, tenantId },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        tenantId,
        role: 'USER',
      },
    });

    this.logger.log(`User registered: ${email}`, 'AuthService');

    return {
      message: 'User registered successfully',
      userId: user.id,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password, tenantId } = loginDto;

    // Find user - if tenantId not provided, search by email only
    const user = await this.prisma.user.findFirst({
      where: tenantId ? { email, tenantId } : { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException('Account is locked');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      // Increment failed attempts
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          failedAttempts: user.failedAttempts + 1,
          lockedUntil:
            user.failedAttempts + 1 >= 5
              ? new Date(Date.now() + 15 * 60 * 1000) // Lock for 15 minutes
              : null,
        },
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if MFA is enabled
    if (user.mfaEnabled) {
      // Return partial token requiring MFA verification
      const partialToken = this.jwtService.sign(
        { userId: user.id, mfaRequired: true },
        { expiresIn: '5m', secret: this.configService.get('JWT_SECRET') },
      );

      return {
        mfaRequired: true,
        partialToken,
        message: 'MFA verification required',
      };
    }

    // Reset failed attempts and update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failedAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Create session
    await this.prisma.session.create({
      data: {
        userId: user.id,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        ipAddress: 'unknown', // Should get from request
        userAgent: 'unknown', // Should get from request
      },
    });

    this.logger.log(`User logged in: ${email}`, 'AuthService');

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async logout(userId: string) {
    // Revoke all sessions
    await this.prisma.session.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });

    this.logger.log(`User logged out: ${userId}`, 'AuthService');

    return { message: 'Logged out successfully' };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const session = await this.prisma.session.findFirst({
        where: {
          refreshToken,
          isRevoked: false,
        },
        include: { user: true },
      });

      if (!session) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(session.user);

      // Update session
      await this.prisma.session.update({
        where: { id: session.id },
        data: {
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      });

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        department: true,
        position: true,
        avatar: true,
        mfaEnabled: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    this.logger.log(`Password changed for user: ${userId}`, 'AuthService');

    return { message: 'Password changed successfully' };
  }

  async verifyMfaLogin(partialToken: string, mfaCode: string) {
    try {
      // Verify partial token
      const payload = this.jwtService.verify(partialToken, {
        secret: this.configService.get('JWT_SECRET'),
      });

      if (!payload.mfaRequired) {
        throw new UnauthorizedException('Invalid token');
      }

      // Verify MFA code
      const isValid = await this.mfaService.verifyMfaCode(payload.userId, mfaCode);

      if (!isValid) {
        throw new UnauthorizedException('Invalid MFA code');
      }

      // Get user
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Reset failed attempts and update last login
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          failedAttempts: 0,
          lockedUntil: null,
          lastLoginAt: new Date(),
        },
      });

      // Generate tokens
      const tokens = await this.generateTokens(user);

      // Create session
      await this.prisma.session.create({
        data: {
          userId: user.id,
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          ipAddress: 'unknown', // Should get from request
          userAgent: 'unknown', // Should get from request
        },
      });

      this.logger.log(`User completed MFA login: ${user.email}`, 'AuthService');

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN', '15m'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    return { accessToken, refreshToken };
  }
}
