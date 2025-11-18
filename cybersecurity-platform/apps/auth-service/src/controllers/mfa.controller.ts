import { CurrentUser } from '@app/common';
import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VerifyBackupCodeDto, VerifyMfaDto } from '../dto/mfa.dto';
import { MfaService } from '../services/mfa.service';

@ApiTags('mfa')
@ApiBearerAuth()
@Controller('auth/mfa')
export class MfaController {
  constructor(private readonly mfaService: MfaService) {}

  @Post('setup')
  @ApiOperation({ summary: 'Initialize MFA setup' })
  @ApiResponse({ status: 200, description: 'Returns QR code and secret' })
  async setupMfa(@CurrentUser('id') userId: string) {
    return this.mfaService.setupMfa(userId);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify MFA code and enable MFA' })
  @ApiResponse({ status: 200, description: 'MFA enabled successfully' })
  async verifyMfa(@CurrentUser('id') userId: string, @Body() verifyMfaDto: VerifyMfaDto) {
    return this.mfaService.verifyAndEnableMfa(userId, verifyMfaDto.code);
  }

  @Post('disable')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Disable MFA' })
  async disableMfa(@CurrentUser('id') userId: string, @Body() verifyMfaDto: VerifyMfaDto) {
    return this.mfaService.disableMfa(userId, verifyMfaDto.code);
  }

  @Post('backup-codes')
  @ApiOperation({ summary: 'Generate backup codes' })
  async generateBackupCodes(@CurrentUser('id') userId: string) {
    return this.mfaService.generateBackupCodes(userId);
  }

  @Post('backup-codes/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify backup code' })
  async verifyBackupCode(
    @CurrentUser('id') userId: string,
    @Body() verifyBackupCodeDto: VerifyBackupCodeDto,
  ) {
    return this.mfaService.verifyBackupCode(userId, verifyBackupCodeDto.code);
  }

  @Get('status')
  @ApiOperation({ summary: 'Check MFA status' })
  async getMfaStatus(@CurrentUser('id') userId: string) {
    return this.mfaService.getMfaStatus(userId);
  }
}
