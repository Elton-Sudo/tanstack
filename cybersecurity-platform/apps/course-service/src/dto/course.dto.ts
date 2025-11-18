import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  UNDER_REVIEW = 'UNDER_REVIEW',
}

export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

export enum CourseCategory {
  PHISHING = 'PHISHING',
  PASSWORD_SECURITY = 'PASSWORD_SECURITY',
  DATA_PROTECTION = 'DATA_PROTECTION',
  SOCIAL_ENGINEERING = 'SOCIAL_ENGINEERING',
  MALWARE = 'MALWARE',
  NETWORK_SECURITY = 'NETWORK_SECURITY',
  COMPLIANCE = 'COMPLIANCE',
  INCIDENT_RESPONSE = 'INCIDENT_RESPONSE',
  SECURITY_AWARENESS = 'SECURITY_AWARENESS',
  CLOUD_SECURITY = 'CLOUD_SECURITY',
  APPLICATION_SECURITY = 'APPLICATION_SECURITY',
  CRYPTOGRAPHY = 'CRYPTOGRAPHY',
}

export class CreateModuleDto {
  @ApiProperty({ example: 'Introduction to Phishing' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({ example: 'Learn to identify phishing emails' })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  order: number;
}

export class CreateChapterDto {
  @ApiProperty({ example: 'What is Phishing?' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({ example: '<h1>Chapter Content</h1>' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  order: number;

  @ApiPropertyOptional({ example: 15 })
  @IsInt()
  @IsOptional()
  @Min(1)
  duration?: number;

  @ApiPropertyOptional({ example: 'https://example.com/video.mp4' })
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;
}

export class CreateCourseDto {
  @ApiProperty({ example: 'Advanced Phishing Prevention' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({
    example: 'Learn advanced techniques to identify and prevent phishing attacks',
  })
  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ example: 'tenant-uuid' })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({ enum: CourseCategory })
  @IsEnum(CourseCategory)
  @IsNotEmpty()
  category: CourseCategory;

  @ApiProperty({ enum: Difficulty, default: Difficulty.BEGINNER })
  @IsEnum(Difficulty)
  @IsNotEmpty()
  difficulty: Difficulty;

  @ApiProperty({ example: 120 })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiPropertyOptional({ example: 'https://example.com/thumbnail.jpg' })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiPropertyOptional({ example: 'path/to/scorm.zip' })
  @IsString()
  @IsOptional()
  scormPackage?: string;

  @ApiPropertyOptional({ example: ['prerequisite-course-id'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  prerequisites?: string[];

  @ApiPropertyOptional({ example: 'template-id' })
  @IsString()
  @IsOptional()
  certificateTemplate?: string;

  @ApiProperty({ example: 'creator-user-id' })
  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @ApiPropertyOptional({ example: ['security', 'phishing', 'email'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ example: 80 })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(100)
  passingScore?: number;

  @ApiPropertyOptional({ type: [CreateModuleDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateModuleDto)
  @IsOptional()
  modules?: CreateModuleDto[];
}

export class UpdateCourseDto {
  @ApiPropertyOptional({ example: 'Updated Course Title' })
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ enum: CourseCategory })
  @IsEnum(CourseCategory)
  @IsOptional()
  category?: CourseCategory;

  @ApiPropertyOptional({ enum: Difficulty })
  @IsEnum(Difficulty)
  @IsOptional()
  difficulty?: Difficulty;

  @ApiPropertyOptional({ example: 120 })
  @IsInt()
  @IsOptional()
  @Min(1)
  duration?: number;

  @ApiPropertyOptional({ example: 'https://example.com/thumbnail.jpg' })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiPropertyOptional({ example: ['security', 'phishing'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ example: 80 })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(100)
  passingScore?: number;
}

export class UpdateModuleDto {
  @ApiPropertyOptional({ example: 'Updated Module Title' })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  @Min(1)
  order?: number;
}

export class UpdateChapterDto {
  @ApiPropertyOptional({ example: 'Updated Chapter Title' })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ example: '<h1>Updated Content</h1>' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  @Min(1)
  order?: number;

  @ApiPropertyOptional({ example: 15 })
  @IsInt()
  @IsOptional()
  @Min(1)
  duration?: number;

  @ApiPropertyOptional({ example: 'https://example.com/video.mp4' })
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;
}

export class PublishCourseDto {
  @ApiPropertyOptional({ example: 'Ready for production' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  publishNotes?: string;
}

export class AssignInstructorDto {
  @ApiProperty({ example: 'instructor-user-uuid' })
  @IsUUID()
  @IsNotEmpty()
  instructorId: string;

  @ApiPropertyOptional({ example: 'Primary instructor' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  role?: string;
}

export class CourseSearchDto {
  @ApiPropertyOptional({ example: 'phishing' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: CourseCategory })
  @IsEnum(CourseCategory)
  @IsOptional()
  category?: CourseCategory;

  @ApiPropertyOptional({ enum: Difficulty })
  @IsEnum(Difficulty)
  @IsOptional()
  difficulty?: Difficulty;

  @ApiPropertyOptional({ enum: CourseStatus })
  @IsEnum(CourseStatus)
  @IsOptional()
  status?: CourseStatus;

  @ApiPropertyOptional({ example: 'security' })
  @IsString()
  @IsOptional()
  tag?: string;
}

export class DuplicateCourseDto {
  @ApiProperty({ example: 'Copy of Advanced Phishing Prevention' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(200)
  newTitle: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  includeModules?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  includeChapters?: boolean;
}

export class CourseStatsDto {
  @ApiPropertyOptional({ example: '2025-01-01' })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ example: '2025-12-31' })
  @IsString()
  @IsOptional()
  endDate?: string;
}
