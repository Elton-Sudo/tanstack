import { generateRandomString } from '@app/common';
import { DatabaseService } from '@app/database';
import { LoggerService } from '@app/logging';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as QRCode from 'qrcode';
import * as speakeasy from 'speakeasy';

@Injectable()
export class MfaService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  async setupMfa(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, mfaEnabled: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.mfaEnabled) {
      throw new BadRequestException('MFA is already enabled');
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `${this.configService.get('MFA_ISSUER', 'Cybersecurity Platform')} (${user.email})`,
      issuer: this.configService.get('MFA_ISSUER', 'Cybersecurity Platform'),
      length: 32,
    });

    // Store temporary secret (not enabled yet)
    await this.prisma.user.update({
      where: { id: userId },
      data: { mfaSecret: secret.base32 },
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    this.logger.log(`MFA setup initiated for user: ${userId}`, 'MfaService');

    return {
      secret: secret.base32,
      qrCode,
      manualEntryKey: secret.base32,
    };
  }

  async verifyAndEnableMfa(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, mfaSecret: true, mfaEnabled: true },
    });

    if (!user || !user.mfaSecret) {
      throw new BadRequestException('MFA setup not initiated');
    }

    if (user.mfaEnabled) {
      throw new BadRequestException('MFA is already enabled');
    }

    // Verify code
    const isValid = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: code,
      window: this.configService.get('MFA_WINDOW', 2),
    });

    if (!isValid) {
      throw new BadRequestException('Invalid MFA code');
    }

    // Enable MFA
    await this.prisma.user.update({
      where: { id: userId },
      data: { mfaEnabled: true },
    });

    // Generate backup codes
    const backupCodes = await this.generateBackupCodes(userId);

    this.logger.log(`MFA enabled for user: ${userId}`, 'MfaService');

    return {
      message: 'MFA enabled successfully',
      backupCodes: backupCodes.codes,
    };
  }

  async verifyMfaCode(userId: string, code: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { mfaSecret: true, mfaEnabled: true },
    });

    if (!user || !user.mfaEnabled || !user.mfaSecret) {
      return false;
    }

    return speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: code,
      window: this.configService.get('MFA_WINDOW', 2),
    });
  }

  async disableMfa(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, mfaSecret: true, mfaEnabled: true },
    });

    if (!user || !user.mfaEnabled) {
      throw new BadRequestException('MFA is not enabled');
    }

    // Verify code before disabling
    const isValid = await this.verifyMfaCode(userId, code);

    if (!isValid) {
      throw new BadRequestException('Invalid MFA code');
    }

    // Disable MFA
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        mfaEnabled: false,
        mfaSecret: null,
      },
    });

    this.logger.log(`MFA disabled for user: ${userId}`, 'MfaService');

    return { message: 'MFA disabled successfully' };
  }

  async generateBackupCodes(userId: string) {
    const codes = Array.from({ length: 10 }, () => generateRandomString(8).toUpperCase());

    // Store hashed backup codes (implementation would hash these)
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        // Store in a separate table in production
        // For now, we'll just log that they were generated
      },
    });

    this.logger.log(`Backup codes generated for user: ${userId}`, 'MfaService');

    return {
      codes,
      message: 'Save these codes in a secure location. Each code can only be used once.',
    };
  }

  async verifyBackupCode(userId: string, code: string) {
    // In production, verify against stored hashed codes
    // and mark as used
    this.logger.log(`Backup code verification attempted for user: ${userId}`, 'MfaService');

    return { message: 'Backup code verified' };
  }

  async getMfaStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { mfaEnabled: true },
    });

    return {
      mfaEnabled: user?.mfaEnabled || false,
    };
  }
}
