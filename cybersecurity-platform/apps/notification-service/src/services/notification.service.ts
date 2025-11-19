import { DatabaseService } from '@app/database';
import { LoggerService } from '@app/logging';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationCategory, NotificationStatus, NotificationType } from '@prisma/client';
import {
  BulkNotificationDto,
  CreateTemplateDto,
  MarkAsReadDto,
  NotificationChannel,
  NotificationPreferenceDto,
  NotificationPreferenceResponseDto,
  NotificationResponseDto,
  NotificationStatsDto,
  QueryNotificationsDto,
  SendFromTemplateDto,
  SendInAppNotificationDto,
  SendPushNotificationDto,
  TemplateResponseDto,
  UpdateNotificationPreferenceDto,
  UpdateTemplateDto,
} from '../dto/notification.dto';
import { EmailService } from './email.service';
import { PushNotificationService } from './push-notification.service';
import { SmsService } from './sms.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly database: DatabaseService,
    private readonly logger: LoggerService,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
    private readonly pushService: PushNotificationService,
  ) {}

  // In-App Notifications
  async sendInAppNotification(
    tenantId: string,
    dto: SendInAppNotificationDto,
  ): Promise<NotificationResponseDto> {
    try {
      // Check user preferences
      const preferences = await this.getUserPreferences(tenantId, dto.userId);
      if (!preferences.inAppEnabled) {
        throw new BadRequestException('In-app notifications are disabled for this user');
      }

      const notification = await this.database.notification.create({
        data: {
          tenantId,
          userId: dto.userId,
          type: NotificationType.IN_APP,
          status: 'DELIVERED',
          title: dto.title,
          message: dto.message,
          category: dto.category || NotificationCategory.CUSTOM,
          read: false,
          metadata: dto.metadata || {},
          sentAt: new Date(),
        },
      });

      return this.mapNotificationToResponse(notification);
    } catch (error) {
      this.logger.error('Failed to send in-app notification', error);
      throw error;
    }
  }

  async sendPushNotification(
    tenantId: string,
    dto: SendPushNotificationDto,
  ): Promise<NotificationResponseDto[]> {
    try {
      const results: NotificationResponseDto[] = [];

      for (const userId of dto.userIds) {
        // Check user preferences
        const preferences = await this.getUserPreferences(tenantId, userId);
        if (!preferences.pushEnabled) {
          continue;
        }

        // Get user device tokens
        const tokens = await this.database.deviceToken.findMany({
          where: { userId, tenantId },
          select: { token: true },
        });

        if (tokens.length === 0) {
          continue;
        }

        // Send push notification
        const success = await this.pushService.sendPush({
          tokens: tokens.map((t) => t.token),
          title: dto.title,
          body: dto.body,
          imageUrl: dto.imageUrl,
          data: dto.data || {},
        });

        // Create notification record
        const notification = await this.database.notification.create({
          data: {
            tenantId,
            userId,
            type: NotificationType.PUSH,
            status: success ? 'DELIVERED' : 'FAILED',
            title: dto.title,
            message: dto.body,
            category: NotificationCategory.CUSTOM,
            read: false,
            metadata: dto.data || {},
            sentAt: new Date(),
          },
        });

        results.push(this.mapNotificationToResponse(notification));
      }

      return results;
    } catch (error) {
      this.logger.error('Failed to send push notifications', error);
      throw error;
    }
  }

  async sendBulkNotification(
    tenantId: string,
    dto: BulkNotificationDto,
  ): Promise<NotificationResponseDto[]> {
    try {
      const results: NotificationResponseDto[] = [];

      for (const userId of dto.userIds) {
        const preferences = await this.getUserPreferences(tenantId, userId);

        // Send to each enabled channel
        for (const channel of dto.channels) {
          if (channel === NotificationChannel.IN_APP && preferences.inAppEnabled) {
            const notification = await this.sendInAppNotification(tenantId, {
              userId,
              title: dto.title,
              message: dto.message,
              category: dto.category,
              priority: dto.priority,
              metadata: dto.metadata,
            });
            results.push(notification);
          } else if (channel === NotificationChannel.EMAIL && preferences.emailEnabled) {
            const user = await this.database.user.findUnique({
              where: { id: userId },
              select: { email: true },
            });
            if (user?.email) {
              await this.emailService.sendEmail({
                to: [user.email],
                subject: dto.title,
                body: dto.message,
                priority: dto.priority,
                metadata: dto.metadata,
              });
            }
          } else if (channel === NotificationChannel.SMS && preferences.smsEnabled) {
            const user = await this.database.user.findUnique({
              where: { id: userId },
              select: { phoneNumber: true },
            });
            if (user?.phoneNumber) {
              await this.smsService.sendSms({
                to: user.phoneNumber,
                message: dto.message,
                priority: dto.priority,
                metadata: dto.metadata,
              });
            }
          } else if (channel === NotificationChannel.PUSH && preferences.pushEnabled) {
            const pushResults = await this.sendPushNotification(tenantId, {
              userIds: [userId],
              title: dto.title,
              body: dto.message,
              priority: dto.priority,
              data: dto.metadata,
            });
            results.push(...pushResults);
          }
        }
      }

      return results;
    } catch (error) {
      this.logger.error('Failed to send bulk notifications', error);
      throw error;
    }
  }

  // Notification Management
  async getUserNotifications(
    tenantId: string,
    userId: string,
    query: QueryNotificationsDto,
  ): Promise<NotificationResponseDto[]> {
    const where: any = {
      tenantId,
      userId,
    };

    if (query.type) {
      where.type = query.type;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.unreadOnly) {
      where.read = false;
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) {
        where.createdAt.gte = query.startDate;
      }
      if (query.endDate) {
        where.createdAt.lte = query.endDate;
      }
    }

    const notifications = await this.database.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return notifications.map((n) => this.mapNotificationToResponse(n));
  }

  async getNotification(
    tenantId: string,
    userId: string,
    notificationId: string,
  ): Promise<NotificationResponseDto> {
    const notification = await this.database.notification.findUnique({
      where: { id: notificationId, tenantId, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return this.mapNotificationToResponse(notification);
  }

  async markAsRead(tenantId: string, userId: string, dto: MarkAsReadDto): Promise<void> {
    await this.database.notification.updateMany({
      where: {
        id: { in: dto.notificationIds },
        tenantId,
        userId,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(tenantId: string, userId: string): Promise<void> {
    await this.database.notification.updateMany({
      where: {
        tenantId,
        userId,
        read: false,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  }

  async deleteNotification(
    tenantId: string,
    userId: string,
    notificationId: string,
  ): Promise<void> {
    const notification = await this.database.notification.findUnique({
      where: { id: notificationId, tenantId, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await this.database.notification.delete({
      where: { id: notificationId },
    });
  }

  async getNotificationStats(tenantId: string, userId: string): Promise<NotificationStatsDto> {
    const notifications = await this.database.notification.findMany({
      where: { tenantId, userId },
    });

    const totalSent = notifications.length;
    const totalDelivered = notifications.filter(
      (n) => n.status === NotificationStatus.DELIVERED,
    ).length;
    const totalFailed = notifications.filter((n) => n.status === NotificationStatus.FAILED).length;
    const totalRead = notifications.filter((n) => n.read).length;
    const unreadCount = notifications.filter((n) => !n.read).length;

    const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;
    const readRate = totalDelivered > 0 ? (totalRead / totalDelivered) * 100 : 0;

    const byType: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    for (const notification of notifications) {
      byType[notification.type] = (byType[notification.type] || 0) + 1;
      byCategory[notification.category] = (byCategory[notification.category] || 0) + 1;
      byStatus[notification.status] = (byStatus[notification.status] || 0) + 1;
    }

    return {
      totalSent,
      totalDelivered,
      totalFailed,
      totalRead,
      unreadCount,
      deliveryRate: Math.round(deliveryRate * 100) / 100,
      readRate: Math.round(readRate * 100) / 100,
      byType,
      byCategory,
      byStatus,
    };
  }

  // Templates
  async createTemplate(
    tenantId: string,
    userId: string,
    dto: CreateTemplateDto,
  ): Promise<TemplateResponseDto> {
    const template = await this.database.notificationTemplate.create({
      data: {
        tenantId,
        name: dto.name,
        description: dto.description || '',
        type: dto.type,
        category: dto.category || NotificationCategory.CUSTOM,
        subject: dto.subject || '',
        template: dto.body,
        variables: dto.variables || [],
        isActive: dto.isDefault || false,
      },
    });

    return this.mapTemplateToResponse(template);
  }

  async getTemplates(tenantId: string): Promise<TemplateResponseDto[]> {
    const templates = await this.database.notificationTemplate.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    return templates.map((t) => this.mapTemplateToResponse(t));
  }

  async getTemplate(tenantId: string, templateId: string): Promise<TemplateResponseDto> {
    const template = await this.database.notificationTemplate.findUnique({
      where: { id: templateId, tenantId },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return this.mapTemplateToResponse(template);
  }

  async updateTemplate(
    tenantId: string,
    templateId: string,
    dto: UpdateTemplateDto,
  ): Promise<TemplateResponseDto> {
    const template = await this.database.notificationTemplate.findUnique({
      where: { id: templateId, tenantId },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    const updated = await this.database.notificationTemplate.update({
      where: { id: templateId },
      data: dto,
    });

    return this.mapTemplateToResponse(updated);
  }

  async deleteTemplate(tenantId: string, templateId: string): Promise<void> {
    const template = await this.database.notificationTemplate.findUnique({
      where: { id: templateId, tenantId },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    await this.database.notificationTemplate.delete({
      where: { id: templateId },
    });
  }

  async sendFromTemplate(
    tenantId: string,
    dto: SendFromTemplateDto,
  ): Promise<NotificationResponseDto[]> {
    const template = await this.getTemplate(tenantId, dto.templateId);

    // Replace variables in template
    let body = template.body;
    let htmlBody = template.htmlBody;
    let subject = template.subject;

    if (dto.variables) {
      for (const [key, value] of Object.entries(dto.variables)) {
        const placeholder = `{{${key}}}`;
        body = body.replace(new RegExp(placeholder, 'g'), String(value));
        htmlBody = htmlBody.replace(new RegExp(placeholder, 'g'), String(value));
        subject = subject.replace(new RegExp(placeholder, 'g'), String(value));
      }
    }

    const results: NotificationResponseDto[] = [];

    // Send based on template type
    for (const recipient of dto.recipients) {
      if (template.type === 'EMAIL') {
        await this.emailService.sendEmail({
          to: [recipient],
          subject,
          body,
          htmlBody,
          priority: dto.priority,
        });
      } else if (template.type === 'SMS') {
        await this.smsService.sendSms({
          to: recipient,
          message: body,
          priority: dto.priority,
        });
      } else if (template.type === 'IN_APP') {
        const notification = await this.sendInAppNotification(tenantId, {
          userId: recipient,
          title: subject,
          message: body,
          priority: dto.priority,
        });
        results.push(notification);
      } else if (template.type === 'PUSH') {
        const pushResults = await this.sendPushNotification(tenantId, {
          userIds: [recipient],
          title: subject,
          body,
          priority: dto.priority,
        });
        results.push(...pushResults);
      }
    }

    return results;
  }

  // User Preferences
  async getUserPreferences(
    tenantId: string,
    userId: string,
  ): Promise<NotificationPreferenceResponseDto> {
    let preferences = await this.database.notificationPreference.findUnique({
      where: { userId_tenantId: { userId, tenantId } },
    });

    if (!preferences) {
      // Create default preferences
      preferences = await this.database.notificationPreference.create({
        data: {
          userId,
          tenantId,
          emailEnabled: true,
          smsEnabled: true,
          inAppEnabled: true,
          pushEnabled: true,
        },
      });
    }

    return this.mapPreferencesToResponse(preferences);
  }

  async updateUserPreferences(
    tenantId: string,
    userId: string,
    dto: UpdateNotificationPreferenceDto,
  ): Promise<NotificationPreferenceResponseDto> {
    const existing = await this.database.notificationPreference.findUnique({
      where: { userId_tenantId: { userId, tenantId } },
    });

    let preferences;
    if (existing) {
      preferences = await this.database.notificationPreference.update({
        where: { userId_tenantId: { userId, tenantId } },
        data: dto,
      });
    } else {
      preferences = await this.database.notificationPreference.create({
        data: {
          userId,
          tenantId,
          emailEnabled: dto.emailEnabled ?? true,
          smsEnabled: dto.smsEnabled ?? true,
          inAppEnabled: dto.inAppEnabled ?? true,
          pushEnabled: dto.pushEnabled ?? true,
        },
      });
    }

    return this.mapPreferencesToResponse(preferences);
  }

  async setUserPreferences(
    tenantId: string,
    userId: string,
    dto: NotificationPreferenceDto,
  ): Promise<NotificationPreferenceResponseDto> {
    const preferences = await this.database.notificationPreference.upsert({
      where: { userId_tenantId: { userId, tenantId } },
      create: {
        userId,
        tenantId,
        ...dto,
      },
      update: dto,
    });

    return this.mapPreferencesToResponse(preferences);
  }

  // Device Tokens
  async registerDeviceToken(
    tenantId: string,
    userId: string,
    token: string,
    platform: string,
    deviceId?: string,
  ): Promise<void> {
    await this.database.deviceToken.upsert({
      where: { token },
      create: {
        userId,
        tenantId,
        token,
        platform,
        deviceId: deviceId || '',
      },
      update: {
        userId,
        platform,
        deviceId: deviceId || '',
      },
    });
  }

  async unregisterDeviceToken(tenantId: string, userId: string, token: string): Promise<void> {
    await this.database.deviceToken.deleteMany({
      where: { token, userId, tenantId },
    });
  }

  // Helper methods
  private mapNotificationToResponse(notification: any): NotificationResponseDto {
    return {
      id: notification.id,
      tenantId: notification.tenantId,
      userId: notification.userId,
      type: notification.type,
      status: notification.status,
      title: notification.title,
      message: notification.message,
      category: notification.category,
      priority: notification.priority,
      read: notification.read,
      readAt: notification.readAt,
      actionUrl: notification.actionUrl,
      metadata: notification.metadata,
      sentAt: notification.sentAt,
      deliveredAt: notification.sentAt, // Use sentAt as fallback
      createdAt: notification.createdAt,
    };
  }

  private mapTemplateToResponse(template: any): TemplateResponseDto {
    return {
      id: template.id,
      tenantId: template.tenantId,
      name: template.name,
      description: template.description || '',
      type: template.type,
      category: template.category,
      subject: template.subject || '',
      body: template.template,
      htmlBody: '', // Not in schema
      variables: template.variables,
      isDefault: template.isActive,
      createdBy: '', // Not in schema
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }

  private mapPreferencesToResponse(preferences: any): NotificationPreferenceResponseDto {
    return {
      id: preferences.id,
      userId: preferences.userId,
      tenantId: preferences.tenantId,
      emailEnabled: preferences.emailEnabled,
      smsEnabled: preferences.smsEnabled,
      inAppEnabled: preferences.inAppEnabled,
      pushEnabled: preferences.pushEnabled,
      categoryPreferences: {}, // Not in schema, return empty object
      createdAt: preferences.createdAt,
      updatedAt: preferences.updatedAt,
    };
  }
}
