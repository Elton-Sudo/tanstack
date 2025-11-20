import { DatabaseService } from '@app/database';
import { LoggerService } from '@app/logging';
import { EventBusService, EVENTS } from '@app/messaging';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Certificate, Course, Enrollment } from '@prisma/client';

export interface GenerateCertificateDto {
  enrollmentId: string;
  templateId?: string;
}

export interface CertificateDataDto {
  userName: string;
  courseName: string;
  completionDate: Date;
  score?: number;
  duration: number;
  certificateNumber: string;
  issuerName: string;
  issuerTitle: string;
}

/**
 * Service for generating and managing training certificates
 * Generates certificates upon course completion with passing score
 */
@Injectable()
export class CertificateService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly logger: LoggerService,
    private readonly eventBus: EventBusService,
  ) {}

  /**
   * Generate certificate for completed enrollment
   */
  async generateCertificate(
    tenantId: string,
    userId: string,
    dto: GenerateCertificateDto,
  ): Promise<Certificate> {
    // Verify enrollment and completion
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        id: dto.enrollmentId,
        userId,
        tenantId,
        status: 'COMPLETED',
      },
      include: {
        course: true,
        user: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Completed enrollment not found');
    }

    // Check if certificate already exists
    const existing = await this.prisma.certificate.findFirst({
      where: {
        userId,
        courseId: enrollment.courseId,
        tenantId,
      },
    });

    if (existing) {
      this.logger.log(
        `Certificate already exists for user ${userId} and course ${enrollment.courseId}`,
        'CertificateService',
      );
      return existing;
    }

    // Generate certificate number
    const certificateNumber = this.generateCertificateNumber(enrollment.course.id, userId);

    // Generate certificate URL (in production, this would call a PDF generation service)
    const certificateUrl = await this.generateCertificateUrl(
      tenantId,
      enrollment,
      certificateNumber,
    );

    // Calculate expiry date (1 year for cybersecurity training)
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    // Create certificate record
    const certificate = await this.prisma.certificate.create({
      data: {
        tenantId,
        userId,
        courseId: enrollment.courseId,
        title: `Certificate of Completion - ${enrollment.course.title}`,
        description: `This certificate verifies that ${enrollment.user.firstName} ${enrollment.user.lastName} has successfully completed ${enrollment.course.title}`,
        certificateUrl,
        expiresAt,
        metadata: {
          certificateNumber,
          completionDate: enrollment.completedAt,
          score: enrollment.score,
          courseDuration: enrollment.course.duration,
          complianceFrameworks: enrollment.course.complianceFrameworks,
        },
      },
    });

    // Update enrollment with certificate URL
    await this.prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { certificateUrl },
    });

    // Publish event
    await this.eventBus.publish(EVENTS.CERTIFICATE_ISSUED, {
      certificateId: certificate.id,
      userId,
      courseId: enrollment.courseId,
      courseName: enrollment.course.title,
      certificateNumber,
      tenantId,
    });

    this.logger.log(
      `Certificate generated for user ${userId}, course ${enrollment.courseId}: ${certificateNumber}`,
      'CertificateService',
    );

    return certificate;
  }

  /**
   * Get user's certificates
   */
  async getUserCertificates(
    tenantId: string,
    userId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const skip = (page - 1) * limit;

    const [certificates, total] = await Promise.all([
      this.prisma.certificate.findMany({
        where: { tenantId, userId },
        skip,
        take: limit,
        orderBy: { issuedAt: 'desc' },
      }),
      this.prisma.certificate.count({
        where: { tenantId, userId },
      }),
    ]);

    return {
      data: certificates,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get certificate by ID
   */
  async getCertificate(
    tenantId: string,
    userId: string,
    certificateId: string,
  ): Promise<Certificate> {
    const certificate = await this.prisma.certificate.findFirst({
      where: {
        id: certificateId,
        userId,
        tenantId,
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return certificate;
  }

  /**
   * Verify certificate by certificate number
   */
  async verifyCertificate(certificateNumber: string) {
    const certificates = await this.prisma.certificate.findMany({
      where: {
        metadata: {
          path: ['certificateNumber'],
          equals: certificateNumber,
        },
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (certificates.length === 0) {
      throw new NotFoundException('Certificate not found');
    }

    const certificate = certificates[0];

    return {
      valid: true,
      expired: certificate.expiresAt ? new Date() > certificate.expiresAt : false,
      certificateNumber,
      userName: `${certificate.user.firstName} ${certificate.user.lastName}`,
      courseName: certificate.title,
      issuedAt: certificate.issuedAt,
      expiresAt: certificate.expiresAt,
      metadata: certificate.metadata,
    };
  }

  /**
   * Get expiring certificates (within 30 days)
   */
  async getExpiringCertificates(tenantId: string, daysBeforeExpiry: number = 30) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysBeforeExpiry);

    return await this.prisma.certificate.findMany({
      where: {
        tenantId,
        expiresAt: {
          lte: expiryDate,
          gte: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        expiresAt: 'asc',
      },
    });
  }

  /**
   * Revoke certificate
   */
  async revokeCertificate(
    tenantId: string,
    certificateId: string,
    revokedBy: string,
    reason: string,
  ): Promise<void> {
    const certificate = await this.prisma.certificate.findFirst({
      where: {
        id: certificateId,
        tenantId,
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    await this.prisma.certificate.update({
      where: { id: certificateId },
      data: {
        metadata: {
          ...(certificate.metadata as object),
          revoked: true,
          revokedAt: new Date(),
          revokedBy,
          revocationReason: reason,
        },
      },
    });

    this.logger.log(
      `Certificate ${certificateId} revoked by ${revokedBy}: ${reason}`,
      'CertificateService',
    );

    await this.eventBus.publish('certificate.revoked', {
      certificateId,
      userId: certificate.userId,
      revokedBy,
      reason,
      tenantId,
    });
  }

  /**
   * Generate unique certificate number
   */
  private generateCertificateNumber(courseId: string, userId: string): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const coursePrefix = courseId.substring(0, 4).toUpperCase();
    const userPrefix = userId.substring(0, 4).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();

    return `CERT-${coursePrefix}-${userPrefix}-${timestamp}-${random}`;
  }

  /**
   * Generate certificate URL
   * In production, this would call a PDF generation service (e.g., PDFKit, Puppeteer)
   */
  private async generateCertificateUrl(
    tenantId: string,
    enrollment: any,
    certificateNumber: string,
  ): Promise<string> {
    // Mock URL for development
    // In production, this would:
    // 1. Generate PDF using template
    // 2. Upload to S3/MinIO
    // 3. Return signed URL

    const baseUrl = process.env.CDN_URL || 'https://certificates.example.com';
    const fileName = `${certificateNumber}.pdf`;

    this.logger.log(
      `Certificate URL generated (mock): ${baseUrl}/certificates/${tenantId}/${fileName}`,
      'CertificateService',
    );

    return `${baseUrl}/certificates/${tenantId}/${fileName}`;
  }

  /**
   * Generate certificate data for PDF template
   */
  private prepareCertificateData(
    enrollment: Enrollment & { course: Course; user: any },
    certificateNumber: string,
  ): CertificateDataDto {
    return {
      userName: `${enrollment.user.firstName} ${enrollment.user.lastName}`,
      courseName: enrollment.course.title,
      completionDate: enrollment.completedAt || new Date(),
      score: enrollment.score || undefined,
      duration: enrollment.course.duration,
      certificateNumber,
      issuerName: 'Cybersecurity Training Platform',
      issuerTitle: 'Chief Information Security Officer',
    };
  }

  /**
   * Bulk generate certificates for completed enrollments
   */
  async bulkGenerateCertificates(tenantId: string, courseId?: string): Promise<number> {
    const where: any = {
      tenantId,
      status: 'COMPLETED',
      certificateUrl: null,
    };

    if (courseId) {
      where.courseId = courseId;
    }

    const completedEnrollments = await this.prisma.enrollment.findMany({
      where,
      include: {
        course: true,
        user: true,
      },
    });

    let generatedCount = 0;

    for (const enrollment of completedEnrollments) {
      try {
        await this.generateCertificate(tenantId, enrollment.userId, {
          enrollmentId: enrollment.id,
        });
        generatedCount++;
      } catch (error) {
        this.logger.error(
          `Failed to generate certificate for enrollment ${enrollment.id}: ${error.message}`,
          error.stack,
          'CertificateService',
        );
      }
    }

    this.logger.log(
      `Bulk certificate generation completed: ${generatedCount}/${completedEnrollments.length}`,
      'CertificateService',
    );

    return generatedCount;
  }

  /**
   * Get certificate statistics for tenant
   */
  async getCertificateStats(tenantId: string) {
    const [total, expired, expiringSoon, active] = await Promise.all([
      this.prisma.certificate.count({
        where: { tenantId },
      }),
      this.prisma.certificate.count({
        where: {
          tenantId,
          expiresAt: { lt: new Date() },
        },
      }),
      this.prisma.certificate.count({
        where: {
          tenantId,
          expiresAt: {
            gte: new Date(),
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        },
      }),
      this.prisma.certificate.count({
        where: {
          tenantId,
          expiresAt: { gte: new Date() },
        },
      }),
    ]);

    return {
      total,
      active,
      expired,
      expiringSoon,
    };
  }
}
