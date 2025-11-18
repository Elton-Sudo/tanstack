import { JwtAuthGuard } from '@app/auth';
import { TenantGuard } from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  BulkNotificationDto,
  CreateTemplateDto,
  DeviceTokenDto,
  MarkAsReadDto,
  NotificationPreferenceDto,
  NotificationPreferenceResponseDto,
  NotificationResponseDto,
  NotificationStatsDto,
  OtpResponseDto,
  QueryNotificationsDto,
  SendBatchEmailDto,
  SendBatchSmsDto,
  SendEmailDto,
  SendFromTemplateDto,
  SendInAppNotificationDto,
  SendOtpDto,
  SendPushNotificationDto,
  SendSmsDto,
  TemplateResponseDto,
  UnregisterDeviceDto,
  UpdateNotificationPreferenceDto,
  UpdateTemplateDto,
  VerifyOtpDto,
} from '../dto/notification.dto';
import { EmailService } from '../services/email.service';
import { NotificationService } from '../services/notification.service';
import { SmsService } from '../services/sms.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard, TenantGuard)
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
  ) {}

  // Email
  @Post('email/send')
  @ApiOperation({ summary: 'Send an email' })
  @ApiResponse({ status: 200, type: Boolean })
  async sendEmail(@Body() dto: SendEmailDto): Promise<{ success: boolean }> {
    const success = await this.emailService.sendEmail(dto);
    return { success };
  }

  @Post('email/send-batch')
  @ApiOperation({ summary: 'Send multiple emails' })
  @ApiResponse({ status: 200 })
  async sendBatchEmails(@Body() dto: SendBatchEmailDto): Promise<{ results: boolean[] }> {
    const results = await this.emailService.sendBatchEmails(dto.emails);
    return { results };
  }

  // SMS
  @Post('sms/send')
  @ApiOperation({ summary: 'Send an SMS' })
  @ApiResponse({ status: 200, type: Boolean })
  async sendSms(@Body() dto: SendSmsDto): Promise<{ success: boolean }> {
    const success = await this.smsService.sendSms(dto);
    return { success };
  }

  @Post('sms/send-batch')
  @ApiOperation({ summary: 'Send multiple SMS messages' })
  @ApiResponse({ status: 200 })
  async sendBatchSms(@Body() dto: SendBatchSmsDto): Promise<{ results: boolean[] }> {
    const results = await this.smsService.sendBatchSms(dto.messages);
    return { results };
  }

  // OTP
  @Post('sms/send-otp')
  @ApiOperation({ summary: 'Send OTP code via SMS' })
  @ApiResponse({ status: 200, type: OtpResponseDto })
  async sendOtp(@Body() dto: SendOtpDto): Promise<OtpResponseDto> {
    return this.smsService.sendOtp(dto.phoneNumber, dto.purpose);
  }

  @Post('sms/verify-otp')
  @ApiOperation({ summary: 'Verify OTP code' })
  @ApiResponse({ status: 200, type: Boolean })
  async verifyOtp(@Body() dto: VerifyOtpDto): Promise<{ verified: boolean }> {
    const verified = await this.smsService.verifyOtp(dto.phoneNumber, dto.code);
    return { verified };
  }

  // In-App Notifications
  @Post('in-app/send')
  @ApiOperation({ summary: 'Send in-app notification' })
  @ApiResponse({ status: 201, type: NotificationResponseDto })
  async sendInAppNotification(
    @Request() req,
    @Body() dto: SendInAppNotificationDto,
  ): Promise<NotificationResponseDto> {
    return this.notificationService.sendInAppNotification(req.user.tenantId, dto);
  }

  @Get('in-app')
  @ApiOperation({ summary: 'Get user in-app notifications' })
  @ApiResponse({ status: 200, type: [NotificationResponseDto] })
  async getUserNotifications(
    @Request() req,
    @Query() query: QueryNotificationsDto,
  ): Promise<NotificationResponseDto[]> {
    return this.notificationService.getUserNotifications(req.user.tenantId, req.user.sub, query);
  }

  @Get('in-app/:notificationId')
  @ApiOperation({ summary: 'Get specific notification' })
  @ApiResponse({ status: 200, type: NotificationResponseDto })
  async getNotification(
    @Request() req,
    @Param('notificationId') notificationId: string,
  ): Promise<NotificationResponseDto> {
    return this.notificationService.getNotification(
      req.user.tenantId,
      req.user.sub,
      notificationId,
    );
  }

  @Post('in-app/mark-read')
  @ApiOperation({ summary: 'Mark notifications as read' })
  @ApiResponse({ status: 204 })
  async markAsRead(@Request() req, @Body() dto: MarkAsReadDto): Promise<void> {
    return this.notificationService.markAsRead(req.user.tenantId, req.user.sub, dto);
  }

  @Post('in-app/mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 204 })
  async markAllAsRead(@Request() req): Promise<void> {
    return this.notificationService.markAllAsRead(req.user.tenantId, req.user.sub);
  }

  @Delete('in-app/:notificationId')
  @ApiOperation({ summary: 'Delete notification' })
  @ApiResponse({ status: 204 })
  async deleteNotification(
    @Request() req,
    @Param('notificationId') notificationId: string,
  ): Promise<void> {
    return this.notificationService.deleteNotification(
      req.user.tenantId,
      req.user.sub,
      notificationId,
    );
  }

  @Get('in-app/stats')
  @ApiOperation({ summary: 'Get notification statistics' })
  @ApiResponse({ status: 200, type: NotificationStatsDto })
  async getNotificationStats(@Request() req): Promise<NotificationStatsDto> {
    return this.notificationService.getNotificationStats(req.user.tenantId, req.user.sub);
  }

  // Push Notifications
  @Post('push/send')
  @ApiOperation({ summary: 'Send push notification' })
  @ApiResponse({ status: 201, type: [NotificationResponseDto] })
  async sendPushNotification(
    @Request() req,
    @Body() dto: SendPushNotificationDto,
  ): Promise<NotificationResponseDto[]> {
    return this.notificationService.sendPushNotification(req.user.tenantId, dto);
  }

  @Post('push/register-device')
  @ApiOperation({ summary: 'Register device for push notifications' })
  @ApiResponse({ status: 204 })
  async registerDevice(@Request() req, @Body() dto: DeviceTokenDto): Promise<void> {
    return this.notificationService.registerDeviceToken(
      req.user.tenantId,
      req.user.sub,
      dto.token,
      dto.platform,
      dto.deviceId,
    );
  }

  @Post('push/unregister-device')
  @ApiOperation({ summary: 'Unregister device from push notifications' })
  @ApiResponse({ status: 204 })
  async unregisterDevice(@Request() req, @Body() dto: UnregisterDeviceDto): Promise<void> {
    return this.notificationService.unregisterDeviceToken(
      req.user.tenantId,
      req.user.sub,
      dto.token,
    );
  }

  // Bulk Notifications
  @Post('bulk/send')
  @ApiOperation({ summary: 'Send bulk notifications across multiple channels' })
  @ApiResponse({ status: 201, type: [NotificationResponseDto] })
  async sendBulkNotification(
    @Request() req,
    @Body() dto: BulkNotificationDto,
  ): Promise<NotificationResponseDto[]> {
    return this.notificationService.sendBulkNotification(req.user.tenantId, dto);
  }

  // Templates
  @Post('templates')
  @ApiOperation({ summary: 'Create notification template' })
  @ApiResponse({ status: 201, type: TemplateResponseDto })
  async createTemplate(
    @Request() req,
    @Body() dto: CreateTemplateDto,
  ): Promise<TemplateResponseDto> {
    return this.notificationService.createTemplate(req.user.tenantId, req.user.sub, dto);
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get all templates' })
  @ApiResponse({ status: 200, type: [TemplateResponseDto] })
  async getTemplates(@Request() req): Promise<TemplateResponseDto[]> {
    return this.notificationService.getTemplates(req.user.tenantId);
  }

  @Get('templates/:templateId')
  @ApiOperation({ summary: 'Get specific template' })
  @ApiResponse({ status: 200, type: TemplateResponseDto })
  async getTemplate(
    @Request() req,
    @Param('templateId') templateId: string,
  ): Promise<TemplateResponseDto> {
    return this.notificationService.getTemplate(req.user.tenantId, templateId);
  }

  @Put('templates/:templateId')
  @ApiOperation({ summary: 'Update template' })
  @ApiResponse({ status: 200, type: TemplateResponseDto })
  async updateTemplate(
    @Request() req,
    @Param('templateId') templateId: string,
    @Body() dto: UpdateTemplateDto,
  ): Promise<TemplateResponseDto> {
    return this.notificationService.updateTemplate(req.user.tenantId, templateId, dto);
  }

  @Delete('templates/:templateId')
  @ApiOperation({ summary: 'Delete template' })
  @ApiResponse({ status: 204 })
  async deleteTemplate(@Request() req, @Param('templateId') templateId: string): Promise<void> {
    return this.notificationService.deleteTemplate(req.user.tenantId, templateId);
  }

  @Post('templates/send')
  @ApiOperation({ summary: 'Send notification from template' })
  @ApiResponse({ status: 201, type: [NotificationResponseDto] })
  async sendFromTemplate(
    @Request() req,
    @Body() dto: SendFromTemplateDto,
  ): Promise<NotificationResponseDto[]> {
    return this.notificationService.sendFromTemplate(req.user.tenantId, dto);
  }

  // User Preferences
  @Get('preferences')
  @ApiOperation({ summary: 'Get user notification preferences' })
  @ApiResponse({ status: 200, type: NotificationPreferenceResponseDto })
  async getUserPreferences(@Request() req): Promise<NotificationPreferenceResponseDto> {
    return this.notificationService.getUserPreferences(req.user.tenantId, req.user.sub);
  }

  @Put('preferences')
  @ApiOperation({ summary: 'Update user notification preferences' })
  @ApiResponse({ status: 200, type: NotificationPreferenceResponseDto })
  async updateUserPreferences(
    @Request() req,
    @Body() dto: UpdateNotificationPreferenceDto,
  ): Promise<NotificationPreferenceResponseDto> {
    return this.notificationService.updateUserPreferences(req.user.tenantId, req.user.sub, dto);
  }

  @Post('preferences')
  @ApiOperation({ summary: 'Set user notification preferences' })
  @ApiResponse({ status: 200, type: NotificationPreferenceResponseDto })
  async setUserPreferences(
    @Request() req,
    @Body() dto: NotificationPreferenceDto,
  ): Promise<NotificationPreferenceResponseDto> {
    return this.notificationService.setUserPreferences(req.user.tenantId, req.user.sub, dto);
  }
}
