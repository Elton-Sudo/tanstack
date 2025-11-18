import { LoggerService } from '@app/logging';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendEmailDto } from '../dto/notification.dto';

@Injectable()
export class EmailService {
  private readonly fromEmail: string;
  private readonly emailProvider: string;

  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.fromEmail = this.config.get('EMAIL_FROM') || 'noreply@cybersecurity-platform.com';
    this.emailProvider = this.config.get('EMAIL_PROVIDER') || 'mock';
  }

  async sendEmail(dto: SendEmailDto): Promise<boolean> {
    try {
      this.logger.log(`Sending email to ${dto.to.join(', ')}`);

      // Mock implementation - in production, integrate with SendGrid, AWS SES, etc.
      if (this.emailProvider === 'mock') {
        this.logger.log('Mock email sent successfully');
        this.logger.log(`Subject: ${dto.subject}`);
        this.logger.log(`Body: ${dto.body.substring(0, 100)}...`);
        return true;
      }

      // Integration with real email providers would go here
      // Example: SendGrid
      // const sgMail = require('@sendgrid/mail');
      // sgMail.setApiKey(this.config.get('SENDGRID_API_KEY'));
      // await sgMail.send({
      //   to: dto.to,
      //   from: this.fromEmail,
      //   subject: dto.subject,
      //   text: dto.body,
      //   html: dto.htmlBody || dto.body,
      // });

      return true;
    } catch (error) {
      this.logger.error('Failed to send email', error);
      return false;
    }
  }

  async sendBatchEmails(emails: SendEmailDto[]): Promise<boolean[]> {
    const results = await Promise.all(emails.map((email) => this.sendEmail(email)));
    return results;
  }
}
