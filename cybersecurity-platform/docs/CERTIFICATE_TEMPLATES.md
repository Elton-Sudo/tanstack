# SWIIFF Certificate Template System

## Overview
The SWIIFF Certificate Template System provides a professional, branded certificate generation system with super admin-only management capabilities.

## Features

### 🎨 SWIIFF Branding
- Official SWIIFF logo integration
- Brand colors: Blue (#3B82F6) and Green (#8CB841)
- Professional gradient borders and decorative elements
- Security-themed corner decorations
- Responsive landscape/portrait orientations

### 🔐 Security & Access Control
- **Super Admin Only**: Certificate template management restricted to SUPER_ADMIN role
- JWT authentication required for all API endpoints
- Role-based access control (RBAC) at both backend and frontend
- Audit trail for all template changes

### 📄 Certificate Template Features
- Default SWIIFF-branded template (cannot be deleted)
- Support for custom tenant-specific templates
- Template cloning and duplication
- Live preview functionality
- Dynamic field mapping

## Architecture

### Backend Components

#### 1. **Super Admin Guard**
```typescript
// libs/common/src/guards/super-admin.guard.ts
@UseGuards(JwtAuthGuard, SuperAdminGuard)
```
Ensures only users with `role: 'SUPER_ADMIN'` can access template management endpoints.

#### 2. **Certificate Template Service**
```typescript
// apps/course-service/src/services/certificate-template.service.ts
```
Handles all template CRUD operations:
- Create, read, update, delete templates
- Set default templates (global or tenant-specific)
- Clone templates
- Manage template configurations

#### 3. **Certificate Template Controller**
```typescript
// apps/course-service/src/controllers/certificate-template.controller.ts
```
RESTful API endpoints for template management.

#### 4. **Database Model**
```prisma
model CertificateTemplate {
  id            String   @id @default(uuid())
  name          String
  description   String?
  tenantId      String?  // null = global template
  isDefault     Boolean  @default(false)
  isActive      Boolean  @default(true)
  configuration Json     // Design config
  createdBy     String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### Frontend Components

#### 1. **SWIIFF Certificate Template**
```typescript
// frontend/src/components/certificates/SwiiffCertificateTemplate.tsx
```
Reusable React component that renders the actual certificate with SWIIFF branding.

**Props**:
```typescript
interface CertificateData {
  recipientName: string;
  courseName: string;
  completionDate: string;
  score?: number;
  certificateNumber: string;
  instructor?: string;
  tenantName?: string;
  duration?: string;
}

variant?: 'default' | 'print' | 'preview'
```

#### 2. **SWIIFF Template Card**
```typescript
// frontend/src/app/(dashboard)/admin/certificate-templates/SwiiffTemplateCard.tsx
```
Displays the SWIIFF template in the admin templates list with:
- Live scaled preview
- Template information
- Edit, duplicate, delete actions
- Full-screen preview modal

#### 3. **Certificate Templates Page**
```typescript
// frontend/src/app/(dashboard)/admin/certificate-templates/page.tsx
```
Admin interface for managing all certificate templates.

## API Endpoints

All endpoints require Super Admin authentication:

### Create Template
```http
POST /certificate-templates
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "Custom Certificate",
  "description": "Custom template description",
  "tenantId": "optional-tenant-id",
  "isDefault": false,
  "orientation": "landscape",
  "backgroundColor": "#FFFFFF",
  "primaryColor": "#3B82F6",
  "secondaryColor": "#8CB841",
  "textColor": "#1F2937",
  "logoUrl": "/images/logo.png",
  "template": { /* template config */ }
}
```

### Get All Templates
```http
GET /certificate-templates
Authorization: Bearer {jwt_token}
```

### Get Template by ID
```http
GET /certificate-templates/:id
Authorization: Bearer {jwt_token}
```

### Get Default Template
```http
GET /certificate-templates/default/template
Authorization: Bearer {jwt_token}
```

### Update Template
```http
PATCH /certificate-templates/:id
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "Updated Name",
  "backgroundColor": "#F0F0F0"
}
```

### Delete Template
```http
DELETE /certificate-templates/:id
Authorization: Bearer {jwt_token}
```

### Set as Default
```http
POST /certificate-templates/:id/set-default
Authorization: Bearer {jwt_token}
```

### Clone Template
```http
POST /certificate-templates/:id/clone
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "Cloned Template Name"
}
```

## Usage Examples

### Generating a Certificate

```typescript
import SwiiffCertificateTemplate from '@/components/certificates/SwiiffCertificateTemplate';

const certificateData = {
  recipientName: 'John Doe',
  courseName: 'Cybersecurity Fundamentals',
  completionDate: new Date().toISOString(),
  score: 95,
  certificateNumber: 'CERT-SWIIFF-2024-001',
  instructor: 'Dr. Sarah Chen',
  duration: '2.5 hours',
};

<SwiiffCertificateTemplate
  data={certificateData}
  variant="default"
/>
```

### For PDF Generation
```typescript
<SwiiffCertificateTemplate
  data={certificateData}
  variant="print"
/>
```

### For Preview
```typescript
<SwiiffCertificateTemplate
  data={certificateData}
  variant="preview"
/>
```

## Setup Instructions

### 1. Database Migration
```bash
# Run Prisma migration to create CertificateTemplate table
npm run prisma:migrate

# Regenerate Prisma client
npx prisma generate
```

### 2. Register Backend Services
In `apps/course-service/src/course.module.ts`:

```typescript
import { CertificateTemplateController } from './controllers/certificate-template.controller';
import { CertificateTemplateService } from './services/certificate-template.service';

@Module({
  controllers: [
    // ... existing
    CertificateTemplateController,
  ],
  providers: [
    // ... existing
    CertificateTemplateService,
  ],
})
export class CourseModule {}
```

### 3. Verify Logo File
Ensure the SWIIFF logo exists at:
```
frontend/public/images/swiiff-logo.png
```

### 4. Test Super Admin Access
Login with super admin credentials:
```
Email: superadmin@platform.com
Password: Password123!
```

Navigate to: `/admin/certificate-templates`

## Template Configuration Structure

```json
{
  "orientation": "landscape",
  "colors": {
    "background": "#FFFFFF",
    "primary": "#3B82F6",
    "secondary": "#8CB841",
    "text": "#1F2937"
  },
  "assets": {
    "logo": "/images/swiiff-logo.png",
    "signature": null
  },
  "template": {
    "type": "swiiff-branded",
    "version": "1.0",
    "fields": [
      "recipientName",
      "courseName",
      "completionDate",
      "score",
      "certificateNumber",
      "instructor",
      "duration"
    ]
  }
}
```

## Testing

### Test Certificate Preview
1. Login as super admin
2. Navigate to `/admin/certificate-templates`
3. Click "Full Preview" on the SWIIFF Default Certificate card
4. Verify all branding elements appear correctly

### Test API Access
```bash
# Get JWT token by logging in as super admin
# Then test endpoints

curl -X GET http://localhost:3000/certificate-templates \
  -H "Authorization: Bearer {your-super-admin-jwt}"
```

### Test Access Control
1. Login as regular user (user1@acme.com)
2. Try to access `/admin/certificate-templates`
3. Should be denied or show "Super Admin Only" warnings

## Troubleshooting

### Issue: `Property 'certificateTemplate' does not exist`
**Solution**: Run `npx prisma generate` to regenerate Prisma client

### Issue: Logo not displaying
**Solution**: Verify logo file exists at `/frontend/public/images/swiiff-logo.png`

### Issue: Access denied errors
**Solution**: Ensure user has `role: 'SUPER_ADMIN'` in database

### Issue: Preview not showing
**Solution**: Check browser console for errors, verify Next.js Image component configuration

## Future Enhancements

- [ ] PDF generation service integration (Puppeteer/PDFKit)
- [ ] Certificate signing with digital signatures
- [ ] Bulk certificate generation
- [ ] Multi-language certificate support
- [ ] QR code verification
- [ ] Email delivery service integration
- [ ] Certificate revocation system
- [ ] Template version history
- [ ] Custom font upload support
- [ ] Background image/watermark support

## Support

For issues or questions:
1. Check logs: `npm run dev` and check console
2. Verify database migrations: `npx prisma studio`
3. Check authentication: Verify JWT token in browser DevTools
4. Review audit logs in database for template changes

## Security Considerations

- All template modifications are logged with user ID
- Default SWIIFF template cannot be deleted
- Only super admins can modify templates
- API endpoints are protected by JWT + role guards
- Template configurations are stored as JSON (sanitized on input)
- Certificate numbers are unique and verifiable
