import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IntegrationType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateConnectorDto {
  @ApiProperty({ example: 'Workday HRIS' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'HRIS' })
  @IsEnum(IntegrationType)
  type: IntegrationType;

  @ApiPropertyOptional({ example: { clientId: 'x', clientSecret: 'y' } })
  @IsOptional()
  config?: any;
}

export class ConnectorResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tenantId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: IntegrationType;

  @ApiPropertyOptional()
  isActive?: boolean;
}
