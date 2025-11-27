import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateWebhookDto {
  @ApiProperty({ example: 'https://example.com/hooks/reports' })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty({ example: ['REPORT_GENERATED', 'CERTIFICATE_ISSUED'] })
  @IsArray()
  @IsNotEmpty()
  events: string[];

  @ApiPropertyOptional({ example: 'secret-token' })
  @IsOptional()
  @IsString()
  secret?: string;
}

export class WebhookResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tenantId: string;

  @ApiProperty()
  url: string;

  @ApiProperty({ example: ['REPORT_GENERATED'] })
  events: string[];

  @ApiPropertyOptional()
  lastTriggeredAt?: Date;
}
