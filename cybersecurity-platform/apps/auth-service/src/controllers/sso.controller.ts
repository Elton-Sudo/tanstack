import { Public } from '@app/common';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SsoService } from '../services/sso.service';

@ApiTags('sso')
@Controller('auth/sso')
export class SsoController {
  constructor(private readonly ssoService: SsoService) {}

  @Get('config/:tenantId')
  @Public()
  @ApiOperation({ summary: 'Get SSO configuration for tenant' })
  @ApiResponse({ status: 200, description: 'Returns SSO config' })
  async getSsoConfig(@Param('tenantId') tenantId: string) {
    return this.ssoService.getSsoConfig(tenantId);
  }

  @Post('oauth/initiate')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Initiate OAuth login' })
  @ApiResponse({ status: 200, description: 'Returns OAuth authorization URL' })
  async initiateOAuth(
    @Body() body: { tenantId: string; provider: 'google' | 'microsoft' | 'github' },
  ) {
    return this.ssoService.initiateOAuthLogin(body.tenantId, body.provider);
  }

  @Get('oauth/callback')
  @Public()
  @ApiOperation({ summary: 'OAuth callback endpoint' })
  @ApiResponse({ status: 200, description: 'Authentication successful' })
  async oauthCallback(@Query('code') code: string, @Query('state') state: string) {
    return this.ssoService.handleOAuthCallback(code, state);
  }

  @Post('saml/initiate')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Initiate SAML login' })
  @ApiResponse({ status: 200, description: 'Returns SAML request' })
  async initiateSaml(@Body() body: { tenantId: string }) {
    return this.ssoService.initiateSamlLogin(body.tenantId);
  }

  @Post('saml/callback')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'SAML callback endpoint (ACS)' })
  @ApiResponse({ status: 200, description: 'Authentication successful' })
  async samlCallback(@Body() body: { SAMLResponse: string }) {
    return this.ssoService.handleSamlCallback(body.SAMLResponse);
  }
}
