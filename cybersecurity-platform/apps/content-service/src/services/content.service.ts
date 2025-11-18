import { PrismaService } from '@app/database';
import { LoggerService } from '@app/logging';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  CompleteMultipartUploadDto,
  FileType,
  ListMediaDto,
  MediaResponseDto,
  MultipartUploadInitDto,
  MultipartUploadInitResponseDto,
  MultipartUploadPartDto,
  MultipartUploadPartResponseDto,
  ParseScormManifestDto,
  ScormPackageResponseDto,
  TranscodeJobResponseDto,
  TranscodeVideoDto,
  TranscodingStatus,
  UpdateMediaDto,
  UploadFileDto,
  UploadScormPackageDto,
  VideoQuality,
} from '../dto/content.dto';
import { StorageService } from './storage.service';

@Injectable()
export class ContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext('ContentService');
  }

  /**
   * Upload a single file
   */
  async uploadFile(file: Express.Multer.File, dto: UploadFileDto): Promise<MediaResponseDto> {
    this.logger.log(`Uploading file: ${file.originalname} for tenant: ${dto.tenantId}`);

    try {
      // Upload to storage
      const storageResult = await this.storage.uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype,
        dto.tenantId,
      );

      // Save to database
      const media = await this.prisma.media.create({
        data: {
          tenantId: dto.tenantId,
          filename: storageResult.key,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          url: storageResult.url,
          cdnUrl: storageResult.cdnUrl,
          type: dto.type,
          uploadedBy: dto.uploadedBy || 'system',
          metadata: dto.metadata || {},
        },
      });

      this.logger.log(`File uploaded successfully: ${media.id}`);
      return this.mapMediaToResponse(media);
    } catch (error) {
      this.logger.error('File upload failed', error);
      throw new BadRequestException('File upload failed');
    }
  }

  /**
   * Initialize multipart upload for large files
   */
  async initializeMultipartUpload(
    dto: MultipartUploadInitDto,
  ): Promise<MultipartUploadInitResponseDto> {
    this.logger.log(`Initializing multipart upload for: ${dto.filename}`);

    try {
      // Create media record in pending state
      const media = await this.prisma.media.create({
        data: {
          tenantId: dto.tenantId,
          filename: `pending/${dto.filename}`,
          originalName: dto.filename,
          mimeType: dto.mimeType,
          size: dto.totalSize,
          url: 'pending',
          type: dto.type,
          uploadedBy: 'system',
          metadata: { uploadStatus: 'initializing' },
        },
      });

      // Initialize multipart upload in storage
      const uploadId = await this.storage.initializeMultipartUpload(
        dto.filename,
        dto.mimeType,
        dto.tenantId,
      );

      // Update media with upload ID
      await this.prisma.media.update({
        where: { id: media.id },
        data: {
          metadata: {
            uploadStatus: 'initialized',
            uploadId,
            totalSize: dto.totalSize,
          },
        },
      });

      this.logger.log(`Multipart upload initialized: ${uploadId}`);
      return {
        uploadId,
        mediaId: media.id,
        key: `${dto.tenantId}/${dto.filename}`,
      };
    } catch (error) {
      this.logger.error('Failed to initialize multipart upload', error);
      throw new BadRequestException('Failed to initialize multipart upload');
    }
  }

  /**
   * Upload a single part of a multipart upload
   */
  async uploadPart(
    dto: MultipartUploadPartDto,
    file: Express.Multer.File,
  ): Promise<MultipartUploadPartResponseDto> {
    this.logger.log(`Uploading part ${dto.partNumber} for upload: ${dto.uploadId}`);

    try {
      const result = await this.storage.uploadPart(dto.uploadId, dto.partNumber, file.buffer);

      return {
        partNumber: dto.partNumber,
        etag: result.etag,
        uploadUrl: result.uploadUrl,
      };
    } catch (error) {
      this.logger.error('Failed to upload part', error);
      throw new BadRequestException('Failed to upload part');
    }
  }

  /**
   * Complete multipart upload
   */
  async completeMultipartUpload(dto: CompleteMultipartUploadDto): Promise<MediaResponseDto> {
    this.logger.log(`Completing multipart upload: ${dto.uploadId}`);

    try {
      // Find media by upload ID
      const media = await this.prisma.media.findFirst({
        where: {
          metadata: {
            path: ['uploadId'],
            equals: dto.uploadId,
          },
        },
      });

      if (!media) {
        throw new NotFoundException('Upload not found');
      }

      // Complete upload in storage
      const storageResult = await this.storage.completeMultipartUpload(dto.uploadId, dto.parts);

      // Update media record
      const updatedMedia = await this.prisma.media.update({
        where: { id: media.id },
        data: {
          url: storageResult.url,
          cdnUrl: storageResult.cdnUrl,
          filename: storageResult.key,
          metadata: {
            ...((media.metadata as any) || {}),
            uploadStatus: 'completed',
          },
        },
      });

      this.logger.log(`Multipart upload completed: ${media.id}`);
      return this.mapMediaToResponse(updatedMedia);
    } catch (error) {
      this.logger.error('Failed to complete multipart upload', error);
      throw new BadRequestException('Failed to complete multipart upload');
    }
  }

  /**
   * Abort multipart upload
   */
  async abortMultipartUpload(uploadId: string): Promise<void> {
    this.logger.log(`Aborting multipart upload: ${uploadId}`);

    try {
      await this.storage.abortMultipartUpload(uploadId);

      // Delete media record
      await this.prisma.media.deleteMany({
        where: {
          metadata: {
            path: ['uploadId'],
            equals: uploadId,
          },
        },
      });

      this.logger.log(`Multipart upload aborted: ${uploadId}`);
    } catch (error) {
      this.logger.error('Failed to abort multipart upload', error);
      throw new BadRequestException('Failed to abort multipart upload');
    }
  }

  /**
   * Upload SCORM package
   */
  async uploadScormPackage(
    file: Express.Multer.File,
    dto: UploadScormPackageDto,
  ): Promise<ScormPackageResponseDto> {
    this.logger.log(`Uploading SCORM package for course: ${dto.courseId}`);

    try {
      // Upload file
      const media = await this.uploadFile(file, {
        tenantId: dto.tenantId,
        type: FileType.SCORM,
        uploadedBy: 'system',
        metadata: { courseId: dto.courseId },
      });

      // Extract and parse SCORM package
      const extractPath = await this.storage.extractZip(media.filename, dto.tenantId);
      const manifest = await this.storage.parseScormManifest(extractPath);

      // Save SCORM package info
      const scormPackage = await this.prisma.scormPackage.create({
        data: {
          courseId: dto.courseId,
          version: dto.version || '1.2',
          manifest,
          extractPath,
        },
      });

      this.logger.log(`SCORM package uploaded: ${scormPackage.id}`);
      return scormPackage as ScormPackageResponseDto;
    } catch (error) {
      this.logger.error('Failed to upload SCORM package', error);
      throw new BadRequestException('Failed to upload SCORM package');
    }
  }

  /**
   * Parse SCORM manifest from uploaded package
   */
  async parseScormManifest(dto: ParseScormManifestDto): Promise<ScormPackageResponseDto> {
    this.logger.log(`Parsing SCORM manifest for media: ${dto.mediaId}`);

    try {
      const media = await this.prisma.media.findUnique({
        where: { id: dto.mediaId },
      });

      if (!media || media.type !== FileType.SCORM) {
        throw new NotFoundException('SCORM package not found');
      }

      const extractPath = await this.storage.extractZip(media.filename, media.tenantId);
      const manifest = await this.storage.parseScormManifest(extractPath);

      const courseId = (media.metadata as any)?.courseId;
      if (!courseId) {
        throw new BadRequestException('Course ID not found in metadata');
      }

      // Check if SCORM package already exists
      const existing = await this.prisma.scormPackage.findFirst({
        where: { courseId },
      });

      let scormPackage;
      if (existing) {
        scormPackage = await this.prisma.scormPackage.update({
          where: { id: existing.id },
          data: { manifest, extractPath },
        });
      } else {
        scormPackage = await this.prisma.scormPackage.create({
          data: {
            courseId,
            version: '1.2',
            manifest,
            extractPath,
          },
        });
      }

      this.logger.log(`SCORM manifest parsed: ${scormPackage.id}`);
      return scormPackage as ScormPackageResponseDto;
    } catch (error) {
      this.logger.error('Failed to parse SCORM manifest', error);
      throw new BadRequestException('Failed to parse SCORM manifest');
    }
  }

  /**
   * Transcode video to multiple qualities
   */
  async transcodeVideo(dto: TranscodeVideoDto): Promise<TranscodeJobResponseDto> {
    this.logger.log(`Transcoding video: ${dto.mediaId}`);

    try {
      const media = await this.prisma.media.findUnique({
        where: { id: dto.mediaId },
      });

      if (!media || media.type !== FileType.VIDEO) {
        throw new NotFoundException('Video not found');
      }

      // Update status to processing
      await this.prisma.media.update({
        where: { id: dto.mediaId },
        data: { transcodingStatus: TranscodingStatus.PROCESSING },
      });

      // Start transcoding job (this would typically be queued)
      const jobId = await this.storage.transcodeVideo(
        media.filename,
        dto.qualities,
        dto.generateHls ?? true,
        dto.generateDash ?? false,
      );

      this.logger.log(`Transcoding job started: ${jobId}`);
      return {
        jobId,
        mediaId: dto.mediaId,
        status: TranscodingStatus.PROCESSING,
        qualities: dto.qualities,
        progress: 0,
      };
    } catch (error) {
      this.logger.error('Failed to start transcoding', error);
      throw new BadRequestException('Failed to start transcoding');
    }
  }

  /**
   * Get transcoding job status
   */
  async getTranscodingStatus(jobId: string): Promise<TranscodeJobResponseDto> {
    this.logger.log(`Getting transcoding status: ${jobId}`);

    try {
      const status = await this.storage.getTranscodingStatus(jobId);
      return status;
    } catch (error) {
      this.logger.error('Failed to get transcoding status', error);
      throw new NotFoundException('Transcoding job not found');
    }
  }

  /**
   * Get streaming URL for video
   */
  async getStreamingUrl(
    mediaId: string,
    protocol: 'HLS' | 'DASH',
    quality?: VideoQuality,
  ): Promise<{ url: string; expiresAt: Date }> {
    this.logger.log(`Getting streaming URL for media: ${mediaId}`);

    try {
      const media = await this.prisma.media.findUnique({
        where: { id: mediaId },
      });

      if (!media || media.type !== FileType.VIDEO) {
        throw new NotFoundException('Video not found');
      }

      if (media.transcodingStatus !== TranscodingStatus.COMPLETED) {
        throw new BadRequestException('Video transcoding not completed');
      }

      const url = await this.storage.getStreamingUrl(media.filename, protocol, quality);
      const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour

      return { url, expiresAt };
    } catch (error) {
      this.logger.error('Failed to get streaming URL', error);
      throw new BadRequestException('Failed to get streaming URL');
    }
  }

  /**
   * List media files with filters
   */
  async listMedia(dto: ListMediaDto): Promise<{
    data: MediaResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 20, tenantId, type, transcodingStatus, search } = dto;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (type) where.type = type;
    if (transcodingStatus) where.transcodingStatus = transcodingStatus;
    if (search) {
      where.OR = [
        { filename: { contains: search, mode: 'insensitive' } },
        { originalName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [media, total] = await Promise.all([
      this.prisma.media.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.media.count({ where }),
    ]);

    return {
      data: media.map((m) => this.mapMediaToResponse(m)),
      total,
      page,
      limit,
    };
  }

  /**
   * Get media by ID
   */
  async getMedia(id: string): Promise<MediaResponseDto> {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    return this.mapMediaToResponse(media);
  }

  /**
   * Update media metadata
   */
  async updateMedia(id: string, dto: UpdateMediaDto): Promise<MediaResponseDto> {
    const media = await this.prisma.media.update({
      where: { id },
      data: {
        ...(dto.originalName && { originalName: dto.originalName }),
        ...(dto.metadata && { metadata: dto.metadata }),
      },
    });

    return this.mapMediaToResponse(media);
  }

  /**
   * Delete media
   */
  async deleteMedia(id: string, deleteFromStorage = true): Promise<void> {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    // Delete from storage
    if (deleteFromStorage) {
      await this.storage.deleteFile(media.filename);
    }

    // Delete from database
    await this.prisma.media.delete({
      where: { id },
    });

    this.logger.log(`Media deleted: ${id}`);
  }

  /**
   * Generate CDN URL with expiration
   */
  async generateCdnUrl(
    mediaId: string,
    expiresIn = 3600,
  ): Promise<{ url: string; expiresAt: Date }> {
    const media = await this.prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    const url = await this.storage.generateSignedUrl(media.filename, expiresIn);
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    return { url, expiresAt };
  }

  /**
   * Map database media to response DTO
   */
  private mapMediaToResponse(media: any): MediaResponseDto {
    return {
      id: media.id,
      tenantId: media.tenantId,
      filename: media.filename,
      originalName: media.originalName,
      mimeType: media.mimeType,
      size: media.size,
      url: media.url,
      cdnUrl: media.cdnUrl,
      type: media.type,
      metadata: media.metadata,
      uploadedBy: media.uploadedBy,
      transcodingStatus: media.transcodingStatus,
      createdAt: media.createdAt,
    };
  }
}
