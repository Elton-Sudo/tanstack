import { DatabaseService } from '@app/database';
import { LoggerService } from '@app/logging';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OtpResponseDto, SendSmsDto } from '../dto/notification.dto';

@Injectable()
export class SmsService {
  private readonly smsProvider: string;
  private readonly otpLength: number = 6;
  private readonly otpExpiryMinutes: number = 10;

  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly database: DatabaseService,
  ) {
    this.smsProvider = this.config.get('SMS_PROVIDER') || 'mock';
  }

  async sendSms(dto: SendSmsDto): Promise<boolean> {
    try {
      this.logger.log(`Sending SMS to ${dto.to}`);

      // Mock implementation - in production, integrate with Twilio, AWS SNS, etc.
      if (this.smsProvider === 'mock') {
        this.logger.log('Mock SMS sent successfully');
        this.logger.log(`Message: ${dto.message}`);
        return true;
      }

      // Integration with real SMS providers would go here
      // Example: Twilio
      // const twilio = require('twilio');
      // const client = twilio(
      //   this.config.get('TWILIO_ACCOUNT_SID'),
      //   this.config.get('TWILIO_AUTH_TOKEN')
      // );
      // await client.messages.create({
      //   body: dto.message,
      //   to: dto.to,
      //   from: this.config.get('TWILIO_PHONE_NUMBER'),
      // });

      return true;
    } catch (error) {
      this.logger.error('Failed to send SMS', error);
      return false;
    }
  }

  async sendBatchSms(messages: SendSmsDto[]): Promise<boolean[]> {
    const results = await Promise.all(messages.map((msg) => this.sendSms(msg)));
    return results;
  }

  async sendOtp(phoneNumber: string, purpose: string = 'verification'): Promise<OtpResponseDto> {
    try {
      // Generate OTP code
      const code = this.generateOtpCode();
      const expiresAt = new Date(Date.now() + this.otpExpiryMinutes * 60 * 1000);

      // Store OTP in database
      const otp = await this.database.otp.create({
        data: {
          phoneNumber,
          code,
          expiresAt,
          verified: false,
        },
      });

      // Send OTP via SMS
      await this.sendSms({
        to: phoneNumber,
        message: `Your verification code is: ${code}. Valid for ${this.otpExpiryMinutes} minutes.`,
      });

      return {
        id: otp.id,
        phoneNumber: otp.phoneNumber,
        expiresAt: otp.expiresAt,
        verified: otp.verified,
      };
    } catch (error) {
      this.logger.error('Failed to send OTP', error);
      throw error;
    }
  }

  async verifyOtp(phoneNumber: string, code: string): Promise<boolean> {
    try {
      const otp = await this.database.otp.findFirst({
        where: {
          phoneNumber,
          code,
          verified: false,
          expiresAt: { gte: new Date() },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!otp) {
        throw new BadRequestException('Invalid or expired OTP code');
      }

      // Mark OTP as verified
      await this.database.otp.update({
        where: { id: otp.id },
        data: { verified: true },
      });

      return true;
    } catch (error) {
      this.logger.error('Failed to verify OTP', error);
      throw error;
    }
  }

  private generateOtpCode(): string {
    const digits = '0123456789';
    let code = '';
    for (let i = 0; i < this.otpLength; i++) {
      code += digits[Math.floor(Math.random() * digits.length)];
    }
    return code;
  }
}
