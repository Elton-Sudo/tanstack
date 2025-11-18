import { LoggerService } from '@app/logging';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { TranscodeJobResponseDto, TranscodingStatus, VideoQuality } from '../dto/content.dto';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucket: string;
  private cdnUrl: string;
  private useLocalStorage: boolean;
  private localStoragePath: string;

  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.bucket = this.config.get('S3_BUCKET') || 'cybersec-content';
    this.cdnUrl = this.config.get('CDN_URL') || '';
    this.useLocalStorage = this.config.get('USE_LOCAL_STORAGE') === 'true';
    this.localStoragePath = this.config.get('LOCAL_STORAGE_PATH') || './storage';

    if (!this.useLocalStorage) {
      this.s3Client = new S3Client({
        region: this.config.get('AWS_REGION') || 'us-east-1',
        endpoint: this.config.get('S3_ENDPOINT') || 'http://localhost:9000',
        credentials: {
          accessKeyId: this.config.get('AWS_ACCESS_KEY_ID') || 'minioadmin',
          secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY') || 'minioadmin',
        },
        forcePathStyle: true,
      });
    } else {
      // Create local storage directory
      if (!fs.existsSync(this.localStoragePath)) {
        fs.mkdirSync(this.localStoragePath, { recursive: true });
      }
    }
  }

  /**
   * Upload file to storage
   */
  async uploadFile(
    buffer: Buffer,
    filename: string,
    mimeType: string,
    tenantId: string,
  ): Promise<{ url: string; cdnUrl?: string; key: string }> {
    const key = `${tenantId}/${randomUUID()}-${filename}`;

    if (this.useLocalStorage) {
      return this.uploadToLocal(buffer, key, mimeType);
    } else {
      return this.uploadToS3(buffer, key, mimeType);
    }
  }

  /**
   * Upload to local filesystem
   */
  private async uploadToLocal(
    buffer: Buffer,
    key: string,
    _mimeType: string,
  ): Promise<{ url: string; cdnUrl?: string; key: string }> {
    const filePath = path.join(this.localStoragePath, key);
    const dir = path.dirname(filePath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(filePath, buffer);

    const url = `file://${filePath}`;
    this.logger.log(`File uploaded to local storage: ${key}`);

    return { url, key };
  }

  /**
   * Upload to S3/MinIO
   */
  private async uploadToS3(
    buffer: Buffer,
    key: string,
    mimeType: string,
  ): Promise<{ url: string; cdnUrl?: string; key: string }> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    });

    await this.s3Client.send(command);

    const url = `https://${this.bucket}.s3.amazonaws.com/${key}`;
    const cdnUrl = this.cdnUrl ? `${this.cdnUrl}/${key}` : undefined;

    this.logger.log(`File uploaded to S3: ${key}`);
    return { url, cdnUrl, key };
  }

  /**
   * Initialize multipart upload
   */
  async initializeMultipartUpload(
    _filename: string,
    _mimeType: string,
    _tenantId: string,
  ): Promise<string> {
    const uploadId = randomUUID();
    this.logger.log(`Multipart upload initialized: ${uploadId}`);
    return uploadId;
  }

  /**
   * Upload part of multipart upload
   */
  async uploadPart(
    uploadId: string,
    partNumber: number,
    _buffer: Buffer,
  ): Promise<{ etag: string; uploadUrl: string }> {
    const etag = randomUUID();
    const uploadUrl = `pending/${uploadId}/${partNumber}`;

    // In production, this would upload to S3 multipart
    this.logger.log(`Part ${partNumber} uploaded for: ${uploadId}`);
    return { etag, uploadUrl };
  }

  /**
   * Complete multipart upload
   */
  async completeMultipartUpload(
    uploadId: string,
    _parts: string[],
  ): Promise<{ url: string; cdnUrl?: string; key: string }> {
    const key = `uploads/${uploadId}`;
    const url = this.useLocalStorage
      ? `file://${this.localStoragePath}/${key}`
      : `https://${this.bucket}.s3.amazonaws.com/${key}`;

    this.logger.log(`Multipart upload completed: ${uploadId}`);
    return { url, key };
  }

  /**
   * Abort multipart upload
   */
  async abortMultipartUpload(uploadId: string): Promise<void> {
    this.logger.log(`Multipart upload aborted: ${uploadId}`);
  }

  /**
   * Delete file from storage
   */
  async deleteFile(key: string): Promise<void> {
    if (this.useLocalStorage) {
      const filePath = path.join(this.localStoragePath, key);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } else {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      await this.s3Client.send(command);
    }

    this.logger.log(`File deleted: ${key}`);
  }

  /**
   * Generate signed URL for private file access
   */
  async generateSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    if (this.useLocalStorage) {
      return `file://${this.localStoragePath}/${key}`;
    }

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const url = await getSignedUrl(this.s3Client, command, { expiresIn });
    return url;
  }

  /**
   * Extract ZIP file (SCORM packages)
   */
  async extractZip(key: string, tenantId: string): Promise<string> {
    const extractPath = `${tenantId}/scorm/${randomUUID()}`;
    this.logger.log(`Extracting ZIP to: ${extractPath}`);

    // In production, this would actually extract the ZIP
    // For now, return mock path
    return extractPath;
  }

  /**
   * Parse SCORM manifest (imsmanifest.xml)
   */
  async parseScormManifest(extractPath: string): Promise<any> {
    this.logger.log(`Parsing SCORM manifest at: ${extractPath}`);

    // Mock SCORM manifest structure
    return {
      identifier: randomUUID(),
      version: '1.2',
      metadata: {
        schema: 'ADL SCORM',
        schemaversion: '1.2',
      },
      organizations: [
        {
          identifier: 'ORG-001',
          title: 'Course Organization',
          items: [],
        },
      ],
      resources: [],
    };
  }

  /**
   * Transcode video to multiple qualities
   */
  async transcodeVideo(
    key: string,
    qualities: VideoQuality[],
    _generateHls: boolean,
    _generateDash: boolean,
  ): Promise<string> {
    const jobId = randomUUID();
    this.logger.log(`Transcoding video: ${key} to qualities: ${qualities.join(', ')}`);

    // In production, this would submit job to transcoding service (e.g., AWS MediaConvert)
    // For now, return mock job ID
    return jobId;
  }

  /**
   * Get transcoding job status
   */
  async getTranscodingStatus(jobId: string): Promise<TranscodeJobResponseDto> {
    this.logger.log(`Getting transcoding status: ${jobId}`);

    // Mock status - in production, query actual transcoding service
    return {
      jobId,
      mediaId: randomUUID(),
      status: TranscodingStatus.COMPLETED,
      qualities: [VideoQuality.HD_720P, VideoQuality.HD_1080P],
      progress: 100,
    };
  }

  /**
   * Get streaming URL (HLS/DASH)
   */
  async getStreamingUrl(
    key: string,
    protocol: 'HLS' | 'DASH',
    quality?: VideoQuality,
  ): Promise<string> {
    const extension = protocol === 'HLS' ? 'm3u8' : 'mpd';
    const qualityPath = quality ? `/${quality}` : '';
    const url = this.cdnUrl
      ? `${this.cdnUrl}/${key}${qualityPath}/playlist.${extension}`
      : `https://${this.bucket}.s3.amazonaws.com/${key}${qualityPath}/playlist.${extension}`;

    this.logger.log(`Generated streaming URL: ${url}`);
    return url;
  }
}
