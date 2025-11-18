import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AbortMultipartUploadDto,
  CompleteMultipartUploadDto,
  GenerateCdnUrlDto,
  GetStreamingUrlDto,
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
  UpdateMediaDto,
  UploadFileDto,
  UploadScormPackageDto,
} from '../dto/content.dto';
import { ContentService } from '../services/content.service';

@ApiTags('content')
@Controller('content')
@ApiBearerAuth()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  // ======================== FILE UPLOAD ========================

  @Post('upload')
  @ApiOperation({ summary: 'Upload a single file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        tenantId: { type: 'string' },
        type: { type: 'string', enum: ['IMAGE', 'VIDEO', 'DOCUMENT', 'SCORM', 'OTHER'] },
        uploadedBy: { type: 'string' },
      },
      required: ['file', 'tenantId', 'type'],
    },
  })
  @ApiResponse({ status: 201, type: MediaResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadFileDto,
  ): Promise<MediaResponseDto> {
    return this.contentService.uploadFile(file, dto);
  }

  @Post('upload/multipart/init')
  @ApiOperation({ summary: 'Initialize multipart upload for large files' })
  @ApiResponse({ status: 201, type: MultipartUploadInitResponseDto })
  async initializeMultipartUpload(
    @Body() dto: MultipartUploadInitDto,
  ): Promise<MultipartUploadInitResponseDto> {
    return this.contentService.initializeMultipartUpload(dto);
  }

  @Post('upload/multipart/part')
  @ApiOperation({ summary: 'Upload a part of multipart upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        uploadId: { type: 'string' },
        partNumber: { type: 'number' },
      },
      required: ['file', 'uploadId', 'partNumber'],
    },
  })
  @ApiResponse({ status: 201, type: MultipartUploadPartResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadPart(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: MultipartUploadPartDto,
  ): Promise<MultipartUploadPartResponseDto> {
    return this.contentService.uploadPart(dto, file);
  }

  @Post('upload/multipart/complete')
  @ApiOperation({ summary: 'Complete multipart upload' })
  @ApiResponse({ status: 200, type: MediaResponseDto })
  async completeMultipartUpload(
    @Body() dto: CompleteMultipartUploadDto,
  ): Promise<MediaResponseDto> {
    return this.contentService.completeMultipartUpload(dto);
  }

  @Post('upload/multipart/abort')
  @ApiOperation({ summary: 'Abort multipart upload' })
  @ApiResponse({ status: 200 })
  async abortMultipartUpload(@Body() dto: AbortMultipartUploadDto): Promise<void> {
    await this.contentService.abortMultipartUpload(dto.uploadId);
  }

  // ======================== SCORM ========================

  @Post('scorm/upload')
  @ApiOperation({ summary: 'Upload SCORM package' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        courseId: { type: 'string' },
        tenantId: { type: 'string' },
        version: { type: 'string' },
      },
      required: ['file', 'courseId', 'tenantId'],
    },
  })
  @ApiResponse({ status: 201, type: ScormPackageResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadScormPackage(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadScormPackageDto,
  ): Promise<ScormPackageResponseDto> {
    return this.contentService.uploadScormPackage(file, dto);
  }

  @Post('scorm/parse')
  @ApiOperation({ summary: 'Parse SCORM manifest from uploaded package' })
  @ApiResponse({ status: 200, type: ScormPackageResponseDto })
  async parseScormManifest(@Body() dto: ParseScormManifestDto): Promise<ScormPackageResponseDto> {
    return this.contentService.parseScormManifest(dto);
  }

  // ======================== VIDEO TRANSCODING ========================

  @Post('video/transcode')
  @ApiOperation({ summary: 'Transcode video to multiple qualities' })
  @ApiResponse({ status: 201, type: TranscodeJobResponseDto })
  async transcodeVideo(@Body() dto: TranscodeVideoDto): Promise<TranscodeJobResponseDto> {
    return this.contentService.transcodeVideo(dto);
  }

  @Get('video/transcode/:jobId')
  @ApiOperation({ summary: 'Get transcoding job status' })
  @ApiParam({ name: 'jobId', description: 'Transcoding job ID' })
  @ApiResponse({ status: 200, type: TranscodeJobResponseDto })
  async getTranscodingStatus(@Param('jobId') jobId: string): Promise<TranscodeJobResponseDto> {
    return this.contentService.getTranscodingStatus(jobId);
  }

  @Post('video/streaming-url')
  @ApiOperation({ summary: 'Get streaming URL for video (HLS/DASH)' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
        expiresAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  async getStreamingUrl(@Body() dto: GetStreamingUrlDto) {
    return this.contentService.getStreamingUrl(dto.mediaId, dto.protocol, dto.quality);
  }

  // ======================== MEDIA MANAGEMENT ========================

  @Get('media')
  @ApiOperation({ summary: 'List all media files with filters' })
  @ApiQuery({ name: 'tenantId', required: false })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['IMAGE', 'VIDEO', 'DOCUMENT', 'SCORM', 'OTHER'],
  })
  @ApiQuery({
    name: 'transcodingStatus',
    required: false,
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
  })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { type: 'object' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async listMedia(@Query() dto: ListMediaDto) {
    return this.contentService.listMedia(dto);
  }

  @Get('media/:id')
  @ApiOperation({ summary: 'Get media by ID' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiResponse({ status: 200, type: MediaResponseDto })
  async getMedia(@Param('id') id: string): Promise<MediaResponseDto> {
    return this.contentService.getMedia(id);
  }

  @Put('media/:id')
  @ApiOperation({ summary: 'Update media metadata' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiResponse({ status: 200, type: MediaResponseDto })
  async updateMedia(
    @Param('id') id: string,
    @Body() dto: UpdateMediaDto,
  ): Promise<MediaResponseDto> {
    return this.contentService.updateMedia(id, dto);
  }

  @Delete('media/:id')
  @ApiOperation({ summary: 'Delete media' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiQuery({ name: 'deleteFromStorage', required: false, type: Boolean })
  @ApiResponse({ status: 200 })
  async deleteMedia(
    @Param('id') id: string,
    @Query('deleteFromStorage') deleteFromStorage?: boolean,
  ): Promise<void> {
    await this.contentService.deleteMedia(id, deleteFromStorage);
  }

  @Post('media/cdn-url')
  @ApiOperation({ summary: 'Generate CDN URL with expiration' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
        expiresAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  async generateCdnUrl(@Body() dto: GenerateCdnUrlDto) {
    return this.contentService.generateCdnUrl(dto.mediaId, dto.expiresIn);
  }
}
