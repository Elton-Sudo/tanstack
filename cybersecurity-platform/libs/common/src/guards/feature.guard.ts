import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DatabaseService } from '@app/database';

/**
 * Feature Guard
 * Restricts access to endpoints based on subscription plan features
 */
@Injectable()
export class FeatureGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get required feature from decorator metadata
    const requiredFeature = this.reflector.get<string>('feature', context.getHandler());

    // If no feature requirement, allow access
    if (!requiredFeature) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.tenantId) {
      throw new ForbiddenException('User not authenticated');
    }

    // Super admin has access to all features
    if (user.role === 'SUPER_ADMIN') {
      return true;
    }

    // Fetch tenant subscription details
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: user.tenantId },
      select: {
        subscriptionPlan: true,
        features: true,
      },
    });

    if (!tenant) {
      throw new ForbiddenException('Tenant not found');
    }

    // Check if feature is enabled for this tenant
    const hasFeature = this.checkFeatureAccess(
      tenant.subscriptionPlan,
      tenant.features as Record<string, boolean> | null,
      requiredFeature,
    );

    if (!hasFeature) {
      throw new ForbiddenException(
        `This feature requires ${this.getRequiredTier(requiredFeature)} plan or higher`,
      );
    }

    return true;
  }

  /**
   * Check if tenant has access to a specific feature
   */
  private checkFeatureAccess(
    subscriptionPlan: string | null,
    features: Record<string, boolean> | null,
    featureKey: string,
  ): boolean {
    // Check if feature is explicitly enabled in tenant features JSON
    if (features && features[featureKey] === true) {
      return true;
    }

    // Check feature matrix based on subscription plan
    const featureMatrix: Record<string, string[]> = {
      gamification: ['STARTER', 'PROFESSIONAL', 'ENTERPRISE'],
      aiRecommendations: ['PROFESSIONAL', 'ENTERPRISE'],
      sso: ['PROFESSIONAL', 'ENTERPRISE'],
      whiteLabel: ['ENTERPRISE'],
      customRoles: ['PROFESSIONAL', 'ENTERPRISE'],
      advancedReporting: ['PROFESSIONAL', 'ENTERPRISE'],
      apiAccess: ['PROFESSIONAL', 'ENTERPRISE'],
      unlimitedApi: ['ENTERPRISE'],
      customFeatures: ['ENTERPRISE'],
      prioritySupport: ['ENTERPRISE'],
      auditLogs: ['PROFESSIONAL', 'ENTERPRISE'],
      bulkOperations: ['STARTER', 'PROFESSIONAL', 'ENTERPRISE'],
    };

    const allowedPlans = featureMatrix[featureKey];

    if (!allowedPlans) {
      // Feature not in matrix - allow by default
      return true;
    }

    return allowedPlans.includes(subscriptionPlan || 'TRIAL');
  }

  /**
   * Get the minimum required tier for a feature
   */
  private getRequiredTier(featureKey: string): string {
    const featureMatrix: Record<string, string[]> = {
      gamification: ['STARTER', 'PROFESSIONAL', 'ENTERPRISE'],
      aiRecommendations: ['PROFESSIONAL', 'ENTERPRISE'],
      sso: ['PROFESSIONAL', 'ENTERPRISE'],
      whiteLabel: ['ENTERPRISE'],
      customRoles: ['PROFESSIONAL', 'ENTERPRISE'],
      advancedReporting: ['PROFESSIONAL', 'ENTERPRISE'],
      apiAccess: ['PROFESSIONAL', 'ENTERPRISE'],
      unlimitedApi: ['ENTERPRISE'],
      customFeatures: ['ENTERPRISE'],
      prioritySupport: ['ENTERPRISE'],
      auditLogs: ['PROFESSIONAL', 'ENTERPRISE'],
      bulkOperations: ['STARTER', 'PROFESSIONAL', 'ENTERPRISE'],
    };

    const allowedPlans = featureMatrix[featureKey];
    return allowedPlans?.[0] || 'PROFESSIONAL';
  }
}
