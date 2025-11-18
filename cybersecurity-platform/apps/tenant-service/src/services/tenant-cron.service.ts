import { LoggerService } from '@app/logging';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TenantService } from './tenant.service';

@Injectable()
export class TenantCronService {
  constructor(
    private readonly tenantService: TenantService,
    private readonly logger: LoggerService,
  ) {}

  // Run every day at 2:00 AM
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async checkExpiredSubscriptions() {
    this.logger.log('Running subscription expiration check...', 'TenantCronService');

    try {
      const expiredCount = await this.tenantService.checkExpiredSubscriptions();

      if (expiredCount > 0) {
        this.logger.warn(`Found ${expiredCount} expired subscriptions`, 'TenantCronService');
      } else {
        this.logger.log('No expired subscriptions found', 'TenantCronService');
      }
    } catch (error) {
      this.logger.error('Error checking expired subscriptions', error.stack, 'TenantCronService');
    }
  }

  // Run every hour to check subscriptions expiring within 7 days
  @Cron(CronExpression.EVERY_HOUR)
  async checkUpcomingExpirations() {
    this.logger.log('Checking for upcoming subscription expirations...', 'TenantCronService');

    try {
      const upcomingExpirations = await this.tenantService.getUpcomingExpirations(7);

      if (upcomingExpirations.length > 0) {
        this.logger.log(
          `Found ${upcomingExpirations.length} subscriptions expiring within 7 days`,
          'TenantCronService',
        );
        // Emit events for notification service to send reminders
      }
    } catch (error) {
      this.logger.error('Error checking upcoming expirations', error.stack, 'TenantCronService');
    }
  }
}
