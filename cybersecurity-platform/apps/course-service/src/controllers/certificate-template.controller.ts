import { JwtAuthGuard } from '@app/auth';
import { CurrentUser, SuperAdminGuard } from '@app/common';
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CertificateTemplateService } from '../services/certificate-template.service';

export interface CreateCertificateTemplateDto {
  name: string;
  description?: string;
  tenantId?: string;
  isDefault?: boolean;
  orientation: 'landscape' | 'portrait';
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  logoUrl?: string;
  signatureUrl?: string;
  template: Record<string, any>;
}

export interface UpdateCertificateTemplateDto {
  name?: string;
  description?: string;
  orientation?: 'landscape' | 'portrait';
  backgroundColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  logoUrl?: string;
  signatureUrl?: string;
  template?: Record<string, any>;
  isActive?: boolean;
}

/**
 * Certificate Template Controller
 * Manages certificate template CRUD operations
 * Only accessible by Super Admins
 */
@Controller('certificate-templates')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class CertificateTemplateController {
  constructor(private readonly certificateTemplateService: CertificateTemplateService) {}

  /**
   * Create a new certificate template
   * POST /certificate-templates
   */
  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateCertificateTemplateDto) {
    return this.certificateTemplateService.createTemplate(user.id, dto);
  }

  /**
   * Get all certificate templates
   * GET /certificate-templates
   */
  @Get()
  async findAll() {
    return this.certificateTemplateService.getAllTemplates();
  }

  /**
   * Get certificate template by ID
   * GET /certificate-templates/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.certificateTemplateService.getTemplateById(id);
  }

  /**
   * Get default certificate template
   * GET /certificate-templates/default/template
   */
  @Get('default/template')
  async getDefault() {
    return this.certificateTemplateService.getDefaultTemplate();
  }

  /**
   * Update certificate template
   * PATCH /certificate-templates/:id
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateCertificateTemplateDto,
  ) {
    return this.certificateTemplateService.updateTemplate(id, user.id, dto);
  }

  /**
   * Delete certificate template
   * DELETE /certificate-templates/:id
   */
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.certificateTemplateService.deleteTemplate(id, user.id);
  }

  /**
   * Set template as default
   * POST /certificate-templates/:id/set-default
   */
  @Post(':id/set-default')
  async setAsDefault(@Param('id') id: string, @CurrentUser() user: any) {
    return this.certificateTemplateService.setAsDefault(id, user.id);
  }

  /**
   * Clone template
   * POST /certificate-templates/:id/clone
   */
  @Post(':id/clone')
  async clone(@Param('id') id: string, @CurrentUser() user: any, @Body() data?: { name?: string }) {
    return this.certificateTemplateService.cloneTemplate(id, user.id, data?.name);
  }
}
