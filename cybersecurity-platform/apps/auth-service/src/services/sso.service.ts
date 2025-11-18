import { DatabaseService } from '@app/database';
import { LoggerService } from '@app/logging';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SsoService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  async getSsoConfig(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        name: true,
        // In production, add ssoEnabled, ssoProvider, ssoConfig fields
      },
    });

    if (!tenant) {
      throw new BadRequestException('Tenant not found');
    }

    // Return SSO configuration for this tenant
    return {
      ssoEnabled: false, // Would come from tenant.ssoEnabled
      providers: [],
      message: 'SSO not configured for this tenant',
    };
  }

  async initiateOAuthLogin(tenantId: string, provider: 'google' | 'microsoft' | 'github') {
    // Validate tenant has OAuth configured
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new BadRequestException('Tenant not found');
    }

    // Generate state token for CSRF protection
    const state = this.jwtService.sign(
      { tenantId, provider, timestamp: Date.now() },
      { expiresIn: '10m' },
    );

    // Build OAuth URL based on provider
    const redirectUri = this.configService.get(
      'OAUTH_REDIRECT_URI',
      'http://localhost:3001/api/v1/auth/sso/oauth/callback',
    );

    let authUrl = '';
    switch (provider) {
      case 'google':
        authUrl =
          `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${this.configService.get('GOOGLE_CLIENT_ID')}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `response_type=code&` +
          `scope=openid%20email%20profile&` +
          `state=${state}`;
        break;
      case 'microsoft':
        authUrl =
          `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
          `client_id=${this.configService.get('MICROSOFT_CLIENT_ID')}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `response_type=code&` +
          `scope=openid%20email%20profile&` +
          `state=${state}`;
        break;
      case 'github':
        authUrl =
          `https://github.com/login/oauth/authorize?` +
          `client_id=${this.configService.get('GITHUB_CLIENT_ID')}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `scope=user:email&` +
          `state=${state}`;
        break;
      default:
        throw new BadRequestException('Unsupported OAuth provider');
    }

    this.logger.log(`OAuth login initiated: ${provider} for tenant ${tenantId}`, 'SsoService');

    return {
      authUrl,
      state,
      provider,
    };
  }

  async handleOAuthCallback(code: string, state: string) {
    try {
      // Verify state token
      const statePayload = this.jwtService.verify(state);
      const { tenantId, provider } = statePayload;

      // Exchange code for access token (simplified - would use actual OAuth flow)
      // In production, make HTTP request to provider's token endpoint
      const userInfo = await this.fetchUserInfoFromProvider(provider, code);

      // Find or create user
      let user = await this.prisma.user.findFirst({
        where: {
          email: userInfo.email,
          tenantId,
        },
      });

      if (!user) {
        // Auto-provision user from SSO
        user = await this.prisma.user.create({
          data: {
            email: userInfo.email,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            tenantId,
            passwordHash: '', // No password for SSO users
            role: 'USER',
          },
        });

        this.logger.log(`SSO user auto-provisioned: ${user.email}`, 'SsoService');
      }

      // Generate JWT tokens
      const tokens = await this.generateTokens(user);

      // Create session
      await this.prisma.session.create({
        data: {
          userId: user.id,
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          ipAddress: 'unknown',
          userAgent: 'unknown',
        },
      });

      this.logger.log(`OAuth callback successful for user: ${user.email}`, 'SsoService');

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    } catch (error) {
      this.logger.error(`OAuth callback failed: ${error.message}`, error.stack, 'SsoService');
      throw new UnauthorizedException('OAuth authentication failed');
    }
  }

  async initiateSamlLogin(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new BadRequestException('Tenant not found');
    }

    // Generate SAML request
    // In production, use a SAML library like passport-saml or @node-saml/node-saml
    const samlRequest = this.generateSamlRequest(tenantId);

    this.logger.log(`SAML login initiated for tenant: ${tenantId}`, 'SsoService');

    return {
      samlRequest,
      redirectUrl: this.configService.get('SAML_IDP_URL', 'https://idp.example.com/saml/login'),
      message: 'SAML authentication initiated',
    };
  }

  async handleSamlCallback(samlResponse: string) {
    try {
      // Parse and validate SAML response
      // In production, use a SAML library to validate signature, assertions, etc.
      const userInfo = this.parseSamlResponse(samlResponse);

      // Find or create user
      let user = await this.prisma.user.findFirst({
        where: {
          email: userInfo.email,
          tenantId: userInfo.tenantId,
        },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email: userInfo.email,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            tenantId: userInfo.tenantId,
            passwordHash: '',
            role: 'USER',
          },
        });

        this.logger.log(`SAML user auto-provisioned: ${user.email}`, 'SsoService');
      }

      // Generate tokens
      const tokens = await this.generateTokens(user);

      // Create session
      await this.prisma.session.create({
        data: {
          userId: user.id,
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          ipAddress: 'unknown',
          userAgent: 'unknown',
        },
      });

      this.logger.log(`SAML callback successful for user: ${user.email}`, 'SsoService');

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    } catch (error) {
      this.logger.error(`SAML callback failed: ${error.message}`, error.stack, 'SsoService');
      throw new UnauthorizedException('SAML authentication failed');
    }
  }

  private async fetchUserInfoFromProvider(provider: string, code: string): Promise<any> {
    // In production, make HTTP request to provider's userinfo endpoint
    // This is a placeholder implementation
    return {
      email: 'sso.user@example.com',
      firstName: 'SSO',
      lastName: 'User',
    };
  }

  private generateSamlRequest(tenantId: string): string {
    // In production, generate proper SAML AuthnRequest XML
    // Using a library like @node-saml/node-saml
    return '<samlp:AuthnRequest>...</samlp:AuthnRequest>';
  }

  private parseSamlResponse(samlResponse: string): any {
    // In production, parse and validate SAML response
    // Using a library like @node-saml/node-saml
    return {
      email: 'saml.user@example.com',
      firstName: 'SAML',
      lastName: 'User',
      tenantId: 'default-tenant-id',
    };
  }

  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRES_IN', '15m'),
      secret: this.configService.get('JWT_SECRET'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    return { accessToken, refreshToken };
  }
}
