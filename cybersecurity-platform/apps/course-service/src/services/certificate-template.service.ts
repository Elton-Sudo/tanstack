import { DatabaseService } from '@app/database';
import { LoggerService } from '@app/logging';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

interface CreateTemplateDto {
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

interface UpdateTemplateDto {
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
 * Certificate Template Service
 * Manages certificate template operations
 * Only accessible by Super Admins
 */
@Injectable()
export class CertificateTemplateService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Create a new certificate template
   */
  async createTemplate(createdBy: string, dto: CreateTemplateDto) {
    // If this is marked as default, unset other defaults
    if (dto.isDefault) {
      if (dto.tenantId) {
        // Unset default for tenant-specific templates
        await this.prisma.certificateTemplate.updateMany({
          where: {
            tenantId: dto.tenantId,
            isDefault: true,
          },
          data: {
            isDefault: false,
          },
        });
      } else {
        // Unset global default templates
        await this.prisma.certificateTemplate.updateMany({
          where: {
            tenantId: null,
            isDefault: true,
          },
          data: {
            isDefault: false,
          },
        });
      }
    }

    const template = await this.prisma.certificateTemplate.create({
      data: {
        name: dto.name,
        description: dto.description,
        tenantId: dto.tenantId,
        isDefault: dto.isDefault || false,
        isActive: true,
        configuration: {
          orientation: dto.orientation,
          colors: {
            background: dto.backgroundColor,
            primary: dto.primaryColor,
            secondary: dto.secondaryColor,
            text: dto.textColor,
          },
          assets: {
            logo: dto.logoUrl,
            signature: dto.signatureUrl,
          },
          template: dto.template,
        },
        createdBy,
      },
    });

    this.logger.log(
      `Certificate template created: ${template.name} (${template.id})`,
      'CertificateTemplateService',
    );

    return template;
  }

  /**
   * Get all certificate templates
   */
  async getAllTemplates() {
    return await this.prisma.certificateTemplate.findMany({
      orderBy: [{ isDefault: 'desc' }, { isActive: 'desc' }, { createdAt: 'desc' }],
    });
  }

  /**
   * Get template by ID
   */
  async getTemplateById(id: string) {
    const template = await this.prisma.certificateTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Certificate template not found');
    }

    return template;
  }

  /**
   * Get default template (global or tenant-specific)
   */
  async getDefaultTemplate(tenantId?: string) {
    // Try to get tenant-specific default first
    if (tenantId) {
      const tenantTemplate = await this.prisma.certificateTemplate.findFirst({
        where: {
          tenantId,
          isDefault: true,
          isActive: true,
        },
      });

      if (tenantTemplate) {
        return tenantTemplate;
      }
    }

    // Fall back to global default
    const globalTemplate = await this.prisma.certificateTemplate.findFirst({
      where: {
        tenantId: null,
        isDefault: true,
        isActive: true,
      },
    });

    if (!globalTemplate) {
      // Return SWIIFF default template configuration
      return this.getSwiiffDefaultTemplate();
    }

    return globalTemplate;
  }

  /**
   * Update certificate template
   */
  async updateTemplate(id: string, updatedBy: string, dto: UpdateTemplateDto) {
    const existing = await this.getTemplateById(id);

    const configuration = existing.configuration as any;

    const updatedTemplate = await this.prisma.certificateTemplate.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        isActive: dto.isActive,
        configuration: {
          orientation: dto.orientation || configuration.orientation,
          colors: {
            background: dto.backgroundColor || configuration.colors?.background,
            primary: dto.primaryColor || configuration.colors?.primary,
            secondary: dto.secondaryColor || configuration.colors?.secondary,
            text: dto.textColor || configuration.colors?.text,
          },
          assets: {
            logo: dto.logoUrl || configuration.assets?.logo,
            signature: dto.signatureUrl || configuration.assets?.signature,
          },
          template: dto.template || configuration.template,
        },
        updatedAt: new Date(),
      },
    });

    this.logger.log(
      `Certificate template updated: ${updatedTemplate.name} (${id}) by ${updatedBy}`,
      'CertificateTemplateService',
    );

    return updatedTemplate;
  }

  /**
   * Delete certificate template
   */
  async deleteTemplate(id: string, deletedBy: string) {
    const template = await this.getTemplateById(id);

    if (template.isDefault) {
      throw new BadRequestException('Cannot delete the default certificate template');
    }

    await this.prisma.certificateTemplate.delete({
      where: { id },
    });

    this.logger.log(
      `Certificate template deleted: ${template.name} (${id}) by ${deletedBy}`,
      'CertificateTemplateService',
    );

    return { success: true, message: 'Template deleted successfully' };
  }

  /**
   * Set template as default
   */
  async setAsDefault(id: string, updatedBy: string) {
    const template = await this.getTemplateById(id);

    // Unset other defaults
    if (template.tenantId) {
      await this.prisma.certificateTemplate.updateMany({
        where: {
          tenantId: template.tenantId,
          isDefault: true,
          id: { not: id },
        },
        data: { isDefault: false },
      });
    } else {
      await this.prisma.certificateTemplate.updateMany({
        where: {
          tenantId: null,
          isDefault: true,
          id: { not: id },
        },
        data: { isDefault: false },
      });
    }

    const updated = await this.prisma.certificateTemplate.update({
      where: { id },
      data: { isDefault: true },
    });

    this.logger.log(
      `Certificate template set as default: ${updated.name} (${id}) by ${updatedBy}`,
      'CertificateTemplateService',
    );

    return updated;
  }

  /**
   * Clone template
   */
  async cloneTemplate(id: string, clonedBy: string, newName?: string) {
    const original = await this.getTemplateById(id);

    const cloned = await this.prisma.certificateTemplate.create({
      data: {
        name: newName || `${original.name} (Copy)`,
        description: original.description,
        tenantId: original.tenantId,
        isDefault: false,
        isActive: true,
        configuration: original.configuration,
        createdBy: clonedBy,
      },
    });

    this.logger.log(
      `Certificate template cloned: ${original.name} -> ${cloned.name} by ${clonedBy}`,
      'CertificateTemplateService',
    );

    return cloned;
  }

  /**
   * Get SWIIFF default template configuration
   */
  private getSwiiffDefaultTemplate() {
    return {
      id: 'swiiff-default',
      name: 'SWIIFF Default Certificate',
      description: 'Default SWIIFF-branded certificate template',
      isDefault: true,
      isActive: true,
      tenantId: null,
      configuration: {
        orientation: 'landscape',
        colors: {
          background: '#FFFFFF',
          primary: '#3B82F6',
          secondary: '#8CB841',
          text: '#1F2937',
        },
        assets: {
          logo: '/images/swiiff-logo.png',
          signature: null,
        },
        template: {
          type: 'swiiff-branded',
          version: '1.0',
          fields: [
            'recipientName',
            'courseName',
            'completionDate',
            'score',
            'certificateNumber',
            'instructor',
            'duration',
          ],
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
