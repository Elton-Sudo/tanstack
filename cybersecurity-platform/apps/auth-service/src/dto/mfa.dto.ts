import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SetupMfaDto {
  // No fields needed - uses current user from token
}

export class VerifyMfaDto {
  @ApiProperty({ example: '123456', description: 'MFA code from authenticator app' })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class VerifyBackupCodeDto {
  @ApiProperty({ example: 'ABCD1234', description: 'Backup code' })
  @IsString()
  @IsNotEmpty()
  code: string;
}
