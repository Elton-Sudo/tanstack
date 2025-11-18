import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export enum FileType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  SCORM = 'SCORM',
  OTHER = 'OTHER',
}

export enum TranscodingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum VideoQuality {
  SD_360P = '360p',
  SD_480P = '480p',
  HD_720P = '720p',
  HD_1080P = '1080p',
  HD_1440P = '1440p',
  UHD_4K = '4k',
}

// ======================== UPLOAD DTOS ========================

export class UploadFileDto {
  @ApiProperty({ description: 'Tenant ID' })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({ enum: FileType, description: 'Type of file' })
  @IsEnum(FileType)
  @IsNotEmpty()
  type: FileType;

  @ApiPropertyOptional({ description: 'Uploaded by user ID' })
  @IsUUID()
  @IsOptional()
  uploadedBy?: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class MultipartUploadInitDto {
  @ApiProperty({ description: 'File name' })
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty({ description: 'Tenant ID' })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({ description: 'MIME type' })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiProperty({ description: 'Total file size in bytes' })
  @IsInt()
  @Min(1)
  totalSize: number;

  @ApiProperty({ enum: FileType, description: 'Type of file' })
  @IsEnum(FileType)
  @IsNotEmpty()
  type: FileType;
}

export class MultipartUploadPartDto {
  @ApiProperty({ description: 'Upload ID from initialization' })
  @IsString()
  @IsNotEmpty()
  uploadId: string;

  @ApiProperty({ description: 'Part number (1-indexed)' })
  @IsInt()
  @Min(1)
  @Max(10000)
  partNumber: number;
}

export class CompleteMultipartUploadDto {
  @ApiProperty({ description: 'Upload ID from initialization' })
  @IsString()
  @IsNotEmpty()
  uploadId: string;

  @ApiProperty({
    description: 'Array of part ETags in order',
    type: [String],
  })
  @IsString({ each: true })
  @IsNotEmpty()
  parts: string[];
}

export class AbortMultipartUploadDto {
  @ApiProperty({ description: 'Upload ID to abort' })
  @IsString()
  @IsNotEmpty()
  uploadId: string;
}

// ======================== SCORM DTOS ========================

export class UploadScormPackageDto {
  @ApiProperty({ description: 'Course ID to associate with' })
  @IsUUID()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({ description: 'Tenant ID' })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @ApiPropertyOptional({ description: 'SCORM version (1.2 or 2004)', default: '1.2' })
  @IsString()
  @IsOptional()
  version?: string;
}

export class ParseScormManifestDto {
  @ApiProperty({ description: 'Media ID of uploaded SCORM package' })
  @IsUUID()
  @IsNotEmpty()
  mediaId: string;
}

// ======================== VIDEO DTOS ========================

export class TranscodeVideoDto {
  @ApiProperty({ description: 'Media ID of video to transcode' })
  @IsUUID()
  @IsNotEmpty()
  mediaId: string;

  @ApiProperty({
    enum: VideoQuality,
    isArray: true,
    description: 'Target video qualities',
    example: [VideoQuality.HD_720P, VideoQuality.HD_1080P],
  })
  @IsEnum(VideoQuality, { each: true })
  @IsNotEmpty()
  qualities: VideoQuality[];

  @ApiPropertyOptional({ description: 'Generate HLS playlist', default: true })
  @IsBoolean()
  @IsOptional()
  generateHls?: boolean;

  @ApiPropertyOptional({ description: 'Generate DASH manifest', default: false })
  @IsBoolean()
  @IsOptional()
  generateDash?: boolean;
}

export class GetStreamingUrlDto {
  @ApiProperty({ description: 'Media ID of video' })
  @IsUUID()
  @IsNotEmpty()
  mediaId: string;

  @ApiProperty({ enum: ['HLS', 'DASH'], description: 'Streaming protocol' })
  @IsEnum(['HLS', 'DASH'])
  @IsNotEmpty()
  protocol: 'HLS' | 'DASH';

  @ApiPropertyOptional({ enum: VideoQuality, description: 'Preferred quality' })
  @IsEnum(VideoQuality)
  @IsOptional()
  quality?: VideoQuality;
}

// ======================== MEDIA DTOS ========================

export class ListMediaDto {
  @ApiPropertyOptional({ description: 'Filter by tenant ID' })
  @IsUUID()
  @IsOptional()
  tenantId?: string;

  @ApiPropertyOptional({ enum: FileType, description: 'Filter by file type' })
  @IsEnum(FileType)
  @IsOptional()
  type?: FileType;

  @ApiPropertyOptional({
    enum: TranscodingStatus,
    description: 'Filter by transcoding status',
  })
  @IsEnum(TranscodingStatus)
  @IsOptional()
  transcodingStatus?: TranscodingStatus;

  @ApiPropertyOptional({ description: 'Search by filename', example: 'video' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;
}

export class GetMediaDto {
  @ApiProperty({ description: 'Media ID' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class UpdateMediaDto {
  @ApiPropertyOptional({ description: 'Original filename' })
  @IsString()
  @IsOptional()
  originalName?: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class DeleteMediaDto {
  @ApiProperty({ description: 'Media ID to delete' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({
    description: 'Also delete from storage (default: true)',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  deleteFromStorage?: boolean = true;
}

export class GenerateCdnUrlDto {
  @ApiProperty({ description: 'Media ID' })
  @IsUUID()
  @IsNotEmpty()
  mediaId: string;

  @ApiPropertyOptional({ description: 'URL expiration in seconds', default: 3600 })
  @IsInt()
  @Min(60)
  @Max(86400)
  @IsOptional()
  expiresIn?: number = 3600;
}

// ======================== RESPONSE DTOS ========================

export class MediaResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tenantId: string;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  originalName: string;

  @ApiProperty()
  mimeType: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  url: string;

  @ApiProperty({ required: false })
  cdnUrl?: string;

  @ApiProperty({ enum: FileType })
  type: FileType;

  @ApiProperty({ required: false })
  metadata?: any;

  @ApiProperty()
  uploadedBy: string;

  @ApiProperty({ enum: TranscodingStatus, required: false })
  transcodingStatus?: TranscodingStatus;

  @ApiProperty()
  createdAt: Date;
}

export class MultipartUploadInitResponseDto {
  @ApiProperty()
  uploadId: string;

  @ApiProperty()
  mediaId: string;

  @ApiProperty()
  key: string;
}

export class MultipartUploadPartResponseDto {
  @ApiProperty()
  partNumber: number;

  @ApiProperty()
  etag: string;

  @ApiProperty()
  uploadUrl: string;
}

export class ScormPackageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  courseId: string;

  @ApiProperty()
  version: string;

  @ApiProperty()
  manifest: any;

  @ApiProperty()
  extractPath: string;

  @ApiProperty()
  createdAt: Date;
}

export class TranscodeJobResponseDto {
  @ApiProperty()
  jobId: string;

  @ApiProperty()
  mediaId: string;

  @ApiProperty({ enum: TranscodingStatus })
  status: TranscodingStatus;

  @ApiProperty()
  qualities: VideoQuality[];

  @ApiProperty()
  progress: number;
}

export class StreamingUrlResponseDto {
  @ApiProperty()
  mediaId: string;

  @ApiProperty()
  protocol: 'HLS' | 'DASH';

  @ApiProperty()
  url: string;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty({ required: false })
  qualities?: VideoQuality[];
}
