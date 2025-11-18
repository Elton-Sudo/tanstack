# Notification Service API Documentation

## Overview

The Notification Service provides comprehensive notification capabilities including email, SMS with OTP, in-app notifications, push notifications, template management, and user preferences.

**Base URL**: `http://localhost:3007`
**Authentication**: Bearer Token (JWT)

## Endpoints

### Email Notifications

#### Send Email

```http
POST /notifications/email/send
```

**Request Body** (SendEmailDto):

```json
{
  "to": ["user@example.com", "admin@example.com"],
  "cc": ["manager@example.com"],
  "bcc": ["archive@example.com"],
  "subject": "Course Completion Certificate",
  "body": "Congratulations! You have completed the Security Awareness training.",
  "htmlBody": "<h1>Congratulations!</h1><p>You have completed the Security Awareness training.</p>",
  "attachments": [],
  "priority": "HIGH",
  "metadata": {
    "courseId": "uuid",
    "certificateId": "uuid"
  }
}
```

**Priorities**: `LOW` | `MEDIUM` | `HIGH` | `URGENT`

**Response** (200 OK):

```json
{
  "success": true
}
```

#### Send Batch Emails

```http
POST /notifications/email/send-batch
```

**Request Body** (SendBatchEmailDto):

```json
{
  "emails": [
    {
      "to": ["user1@example.com"],
      "subject": "Training Reminder",
      "body": "Your training is due soon."
    },
    {
      "to": ["user2@example.com"],
      "subject": "Training Reminder",
      "body": "Your training is due soon."
    }
  ]
}
```

**Response** (200 OK):

```json
{
  "results": [true, true]
}
```

### SMS Notifications

#### Send SMS

```http
POST /notifications/sms/send
```

**Request Body** (SendSmsDto):

```json
{
  "to": "+27821234567",
  "message": "Your verification code is: 123456",
  "priority": "HIGH",
  "metadata": {}
}
```

**Phone Format**: E.164 format (e.g., +27821234567)

**Response** (200 OK):

```json
{
  "success": true
}
```

#### Send Batch SMS

```http
POST /notifications/sms/send-batch
```

**Request Body** (SendBatchSmsDto):

```json
{
  "messages": [
    {
      "to": "+27821234567",
      "message": "Your training is overdue."
    },
    {
      "to": "+27829876543",
      "message": "Your training is overdue."
    }
  ]
}
```

**Response** (200 OK):

```json
{
  "results": [true, true]
}
```

### OTP (One-Time Password)

#### Send OTP

```http
POST /notifications/sms/send-otp
```

**Request Body** (SendOtpDto):

```json
{
  "phoneNumber": "+27821234567",
  "purpose": "account_verification"
}
```

**Response** (200 OK):

```json
{
  "id": "uuid",
  "phoneNumber": "+27821234567",
  "expiresAt": "2025-11-18T12:10:00Z",
  "verified": false
}
```

**Features**:

- 6-digit numeric code
- 10-minute expiry
- Single-use verification

#### Verify OTP

```http
POST /notifications/sms/verify-otp
```

**Request Body** (VerifyOtpDto):

```json
{
  "phoneNumber": "+27821234567",
  "code": "123456"
}
```

**Response** (200 OK):

```json
{
  "verified": true
}
```

**Error** (400 Bad Request):

```json
{
  "statusCode": 400,
  "message": "Invalid or expired OTP code"
}
```

### In-App Notifications

#### Send In-App Notification

```http
POST /notifications/in-app/send
```

**Request Body** (SendInAppNotificationDto):

```json
{
  "userId": "uuid",
  "title": "New Course Available",
  "message": "A new cybersecurity course has been added to your curriculum.",
  "category": "COURSE_ENROLLMENT",
  "priority": "MEDIUM",
  "actionUrl": "/courses/uuid",
  "metadata": {
    "courseId": "uuid",
    "courseName": "Advanced Threat Detection"
  }
}
```

**Categories**:

- `COURSE_ENROLLMENT`
- `COURSE_COMPLETION`
- `CERTIFICATE_ISSUED`
- `TRAINING_REMINDER`
- `TRAINING_OVERDUE`
- `PHISHING_SIMULATION`
- `RISK_ALERT`
- `COMPLIANCE_ALERT`
- `REPORT_READY`
- `SYSTEM_ALERT`
- `CUSTOM`

**Response** (201 Created):

```json
{
  "id": "uuid",
  "tenantId": "uuid",
  "userId": "uuid",
  "type": "IN_APP",
  "status": "DELIVERED",
  "title": "New Course Available",
  "message": "A new cybersecurity course has been added to your curriculum.",
  "category": "COURSE_ENROLLMENT",
  "priority": "MEDIUM",
  "read": false,
  "readAt": null,
  "actionUrl": "/courses/uuid",
  "metadata": {},
  "sentAt": "2025-11-18T12:00:00Z",
  "deliveredAt": "2025-11-18T12:00:00Z",
  "createdAt": "2025-11-18T12:00:00Z"
}
```

#### Get User Notifications

```http
GET /notifications/in-app?type=IN_APP&status=DELIVERED&unreadOnly=true
```

**Query Parameters** (QueryNotificationsDto):

- `type`: IN_APP | EMAIL | SMS | PUSH
- `status`: PENDING | SENT | DELIVERED | FAILED | READ
- `category`: COURSE_ENROLLMENT | TRAINING_REMINDER | etc.
- `unreadOnly`: boolean
- `startDate`: ISO 8601 date
- `endDate`: ISO 8601 date

**Response** (200 OK):

```json
[
  {
    "id": "uuid",
    "tenantId": "uuid",
    "userId": "uuid",
    "type": "IN_APP",
    "status": "DELIVERED",
    "title": "Training Reminder",
    "message": "Your Security Awareness training is due in 3 days.",
    "category": "TRAINING_REMINDER",
    "priority": "HIGH",
    "read": false,
    "readAt": null,
    "actionUrl": "/courses/uuid",
    "metadata": {},
    "sentAt": "2025-11-18T12:00:00Z",
    "deliveredAt": "2025-11-18T12:00:00Z",
    "createdAt": "2025-11-18T12:00:00Z"
  }
]
```

#### Get Specific Notification

```http
GET /notifications/in-app/:notificationId
```

**Response** (200 OK): Single notification object

#### Mark Notifications as Read

```http
POST /notifications/in-app/mark-read
```

**Request Body** (MarkAsReadDto):

```json
{
  "notificationIds": ["uuid1", "uuid2", "uuid3"]
}
```

**Response** (204 No Content)

#### Mark All as Read

```http
POST /notifications/in-app/mark-all-read
```

**Response** (204 No Content)

#### Delete Notification

```http
DELETE /notifications/in-app/:notificationId
```

**Response** (204 No Content)

#### Get Notification Statistics

```http
GET /notifications/in-app/stats
```

**Response** (200 OK):

```json
{
  "totalSent": 1250,
  "totalDelivered": 1200,
  "totalFailed": 50,
  "totalRead": 987,
  "unreadCount": 213,
  "deliveryRate": 96.0,
  "readRate": 82.25,
  "byType": {
    "IN_APP": 450,
    "EMAIL": 500,
    "SMS": 200,
    "PUSH": 100
  },
  "byCategory": {
    "COURSE_ENROLLMENT": 300,
    "TRAINING_REMINDER": 400,
    "CERTIFICATE_ISSUED": 250,
    "RISK_ALERT": 100,
    "CUSTOM": 200
  },
  "byStatus": {
    "DELIVERED": 1200,
    "FAILED": 50
  }
}
```

### Push Notifications

#### Send Push Notification

```http
POST /notifications/push/send
```

**Request Body** (SendPushNotificationDto):

```json
{
  "userIds": ["uuid1", "uuid2"],
  "title": "Training Overdue",
  "body": "Your mandatory security training is now overdue. Complete it immediately.",
  "imageUrl": "https://cdn.example.com/alert-icon.png",
  "actionUrl": "/courses/uuid",
  "priority": "URGENT",
  "data": {
    "courseId": "uuid",
    "dueDate": "2025-11-15"
  }
}
```

**Response** (201 Created):

```json
[
  {
    "id": "uuid",
    "tenantId": "uuid",
    "userId": "uuid1",
    "type": "PUSH",
    "status": "DELIVERED",
    "title": "Training Overdue",
    "message": "Your mandatory security training is now overdue.",
    "category": "CUSTOM",
    "priority": "URGENT",
    "read": false,
    "readAt": null,
    "actionUrl": "/courses/uuid",
    "metadata": {},
    "sentAt": "2025-11-18T12:00:00Z",
    "deliveredAt": "2025-11-18T12:00:00Z",
    "createdAt": "2025-11-18T12:00:00Z"
  }
]
```

#### Register Device for Push

```http
POST /notifications/push/register-device
```

**Request Body** (DeviceTokenDto):

```json
{
  "token": "firebase-cloud-messaging-token",
  "platform": "ios",
  "deviceId": "iPhone-12345"
}
```

**Platforms**: `ios` | `android` | `web`

**Response** (204 No Content)

#### Unregister Device

```http
POST /notifications/push/unregister-device
```

**Request Body** (UnregisterDeviceDto):

```json
{
  "token": "firebase-cloud-messaging-token"
}
```

**Response** (204 No Content)

### Bulk Notifications

#### Send Bulk Notification

```http
POST /notifications/bulk/send
```

**Request Body** (BulkNotificationDto):

```json
{
  "userIds": ["uuid1", "uuid2", "uuid3"],
  "channels": ["EMAIL", "IN_APP", "PUSH"],
  "title": "System Maintenance",
  "message": "The platform will undergo scheduled maintenance on Nov 20, 2025.",
  "category": "SYSTEM_ALERT",
  "priority": "HIGH",
  "metadata": {
    "maintenanceStart": "2025-11-20T02:00:00Z",
    "maintenanceEnd": "2025-11-20T04:00:00Z"
  }
}
```

**Channels**: `EMAIL` | `SMS` | `IN_APP` | `PUSH` | `ALL`

**Response** (201 Created): Array of notification objects

**Features**:

- Send to multiple users simultaneously
- Multiple channels (email, SMS, in-app, push)
- Respects user preferences per channel
- Automatic user data lookup (email, phone)

### Templates

#### Create Template

```http
POST /notifications/templates
```

**Request Body** (CreateTemplateDto):

```json
{
  "name": "Course Completion",
  "description": "Template for course completion notifications",
  "type": "EMAIL",
  "category": "COURSE_COMPLETION",
  "subject": "Congratulations on completing {{courseName}}!",
  "body": "Hi {{userName}}, you have successfully completed {{courseName}} on {{completionDate}}.",
  "htmlBody": "<h1>Congratulations {{userName}}!</h1><p>You completed {{courseName}}.</p>",
  "variables": ["userName", "courseName", "completionDate"],
  "isDefault": false
}
```

**Template Types**: `EMAIL` | `SMS` | `IN_APP` | `PUSH`

**Response** (201 Created):

```json
{
  "id": "uuid",
  "tenantId": "uuid",
  "name": "Course Completion",
  "description": "Template for course completion notifications",
  "type": "EMAIL",
  "category": "COURSE_COMPLETION",
  "subject": "Congratulations on completing {{courseName}}!",
  "body": "Hi {{userName}}, you have successfully completed {{courseName}}.",
  "htmlBody": "<h1>Congratulations {{userName}}!</h1>",
  "variables": ["userName", "courseName", "completionDate"],
  "isDefault": false,
  "createdBy": "uuid",
  "createdAt": "2025-11-18T12:00:00Z",
  "updatedAt": "2025-11-18T12:00:00Z"
}
```

#### Get All Templates

```http
GET /notifications/templates
```

**Response** (200 OK): Array of template objects

#### Get Template by ID

```http
GET /notifications/templates/:templateId
```

**Response** (200 OK): Single template object

#### Update Template

```http
PUT /notifications/templates/:templateId
```

**Request Body** (UpdateTemplateDto):

```json
{
  "subject": "Updated subject with {{variable}}",
  "body": "Updated body content",
  "variables": ["variable", "userName"]
}
```

**Response** (200 OK): Updated template object

#### Delete Template

```http
DELETE /notifications/templates/:templateId
```

**Response** (204 No Content)

#### Send from Template

```http
POST /notifications/templates/send
```

**Request Body** (SendFromTemplateDto):

```json
{
  "templateId": "uuid",
  "recipients": ["user@example.com", "admin@example.com"],
  "variables": {
    "userName": "John Doe",
    "courseName": "Security Awareness",
    "completionDate": "2025-11-18"
  },
  "priority": "MEDIUM"
}
```

**Response** (201 Created): Array of notification objects

**Features**:

- Variable substitution with `{{variableName}}`
- Multiple recipients
- Template reusability
- Category-based organization

### User Preferences

#### Get User Preferences

```http
GET /notifications/preferences
```

**Response** (200 OK):

```json
{
  "id": "uuid",
  "userId": "uuid",
  "tenantId": "uuid",
  "emailEnabled": true,
  "smsEnabled": true,
  "inAppEnabled": true,
  "pushEnabled": false,
  "categoryPreferences": {
    "COURSE_ENROLLMENT": true,
    "TRAINING_REMINDER": true,
    "PHISHING_SIMULATION": false,
    "RISK_ALERT": true,
    "SYSTEM_ALERT": true
  },
  "createdAt": "2025-11-18T12:00:00Z",
  "updatedAt": "2025-11-18T12:00:00Z"
}
```

#### Update User Preferences

```http
PUT /notifications/preferences
```

**Request Body** (UpdateNotificationPreferenceDto):

```json
{
  "emailEnabled": true,
  "pushEnabled": false,
  "categoryPreferences": {
    "PHISHING_SIMULATION": false
  }
}
```

**Response** (200 OK): Updated preferences object

#### Set User Preferences

```http
POST /notifications/preferences
```

**Request Body** (NotificationPreferenceDto):

```json
{
  "emailEnabled": true,
  "smsEnabled": true,
  "inAppEnabled": true,
  "pushEnabled": true,
  "categoryPreferences": {
    "COURSE_ENROLLMENT": true,
    "TRAINING_REMINDER": true,
    "CERTIFICATE_ISSUED": true,
    "PHISHING_SIMULATION": false,
    "RISK_ALERT": true
  }
}
```

**Response** (200 OK): Preferences object

**Features**:

- Channel-level preferences (email, SMS, in-app, push)
- Category-level granularity
- Default preferences on first access
- Automatic preference checking before sending

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request**:

```json
{
  "statusCode": 400,
  "message": "In-app notifications are disabled for this user",
  "error": "Bad Request"
}
```

**401 Unauthorized**:

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**404 Not Found**:

```json
{
  "statusCode": 404,
  "message": "Notification not found",
  "error": "Not Found"
}
```

**500 Internal Server Error**:

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

## Notification Status Flow

```
PENDING → SENT → DELIVERED → READ
              ↓
            FAILED
```

- `PENDING`: Notification queued for sending
- `SENT`: Notification sent to provider
- `DELIVERED`: Notification successfully delivered
- `FAILED`: Delivery failed
- `READ`: User has read the notification (in-app only)

## Integration Notes

### Email Providers

- **Mock**: Development/testing (default)
- **SendGrid**: Production email delivery
- **AWS SES**: Amazon email service
- **Mailgun**: Email API service

### SMS Providers

- **Mock**: Development/testing (default)
- **Twilio**: Production SMS delivery
- **AWS SNS**: Amazon SMS service
- **Africa's Talking**: Africa-focused SMS

### Push Notification Providers

- **Mock**: Development/testing (default)
- **Firebase Cloud Messaging (FCM)**: Android, iOS, Web
- **OneSignal**: Multi-platform push
- **Apple Push Notification Service (APNS)**: iOS native

## Best Practices

1. **Respect User Preferences**: Always check preferences before sending
2. **Use Templates**: Create reusable templates for common notifications
3. **Batch Operations**: Use batch endpoints for multiple recipients
4. **Priority Levels**: Set appropriate priorities (URGENT for critical alerts)
5. **Categories**: Use proper categories for preference management
6. **Error Handling**: Handle delivery failures gracefully
7. **Rate Limiting**: Implement rate limits to prevent spam
8. **Unsubscribe**: Provide clear unsubscribe/preference options

## Notes

1. **Tenant Isolation**: All notifications are tenant-scoped
2. **User Preferences**: Automatically checked before sending
3. **Device Tokens**: Register devices for push notifications
4. **OTP Security**: 10-minute expiry, single-use codes
5. **Template Variables**: Use `{{variableName}}` syntax
6. **Batch Processing**: Efficient multi-recipient delivery
7. **Statistics**: Real-time delivery and read metrics
