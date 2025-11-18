import { DatabaseService } from '@app/database';
import { LoggerService } from '@app/logging';
import { EventBusService, EVENTS } from '@app/messaging';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class PasswordService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
    private readonly eventBus: EventBusService,
  ) {}

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    // Don't reveal if user exists
    if (!user) {
      this.logger.warn(
        `Password reset requested for non-existent email: ${email}`,
        'PasswordService',
      );
      return { message: 'If the email exists, a reset link has been sent' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Store token with expiration (1 hour)
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: hashedToken,
        // In production, add passwordResetExpires field
      },
    });

    // Emit event for email notification
    await this.eventBus.publish(EVENTS.PASSWORD_RESET_REQUESTED, {
      userId: user.id,
      email: user.email,
      resetToken,
    });

    this.logger.log(`Password reset requested for user: ${user.id}`, 'PasswordService');

    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.prisma.user.findFirst({
      where: {
        verificationToken: hashedToken,
        // Add check for passwordResetExpires
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Validate password strength
    const validation = this.validatePasswordStrength(newPassword);
    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(', '));
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password and clear token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        verificationToken: null,
      },
    });

    // Revoke all sessions
    await this.prisma.session.updateMany({
      where: { userId: user.id },
      data: { isRevoked: true },
    });

    // Emit event
    await this.eventBus.publish(EVENTS.PASSWORD_CHANGED, {
      userId: user.id,
    });

    this.logger.log(`Password reset completed for user: ${user.id}`, 'PasswordService');

    return { message: 'Password reset successful' };
  }

  validatePasswordStrength(password: string) {
    const errors: string[] = [];
    const minLength = this.configService.get('PASSWORD_MIN_LENGTH', 8);

    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check for common passwords
    const commonPasswords = ['password', '12345678', 'qwerty', 'abc123'];
    if (commonPasswords.some((common) => password.toLowerCase().includes(common))) {
      errors.push('Password is too common');
    }

    const score = this.calculatePasswordScore(password);

    return {
      isValid: errors.length === 0,
      score,
      strength: this.getStrengthLabel(score),
      errors,
    };
  }

  private calculatePasswordScore(password: string): number {
    let score = 0;

    // Length
    score += Math.min(password.length * 4, 40);

    // Character variety
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/[0-9]/.test(password)) score += 10;
    if (/[^a-zA-Z0-9]/.test(password)) score += 20;

    // Patterns
    if (/(.)\1{2,}/.test(password)) score -= 10; // Repeated characters
    if (/^[a-zA-Z]+$|^[0-9]+$/.test(password)) score -= 10; // Only letters or numbers

    return Math.max(0, Math.min(100, score));
  }

  private getStrengthLabel(score: number): string {
    if (score < 30) return 'weak';
    if (score < 60) return 'fair';
    if (score < 80) return 'good';
    return 'strong';
  }
}
