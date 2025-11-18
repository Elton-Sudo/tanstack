import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class ReportSecurityEventDto {
  @ApiProperty({ example: 'uuid-tenant-id' })
  @IsUUID()
  tenantId: string;

  @ApiProperty({ example: 'SUSPICIOUS_LOGIN' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'Unusual login location detected' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '192.168.1.1', required: false })
  @IsString()
  @IsOptional()
  ipAddress?: string;
}
