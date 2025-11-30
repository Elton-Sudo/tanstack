import { useAuthStore } from '@/store/auth.store';
import { useTenant } from './useTenant';

/**
 * Feature Access Hook
 * Checks if the current tenant has access to specific features based on subscription plan
 */
export function useFeatureAccess() {
  const { user } = useAuthStore();
  const { data: tenant, isLoading } = useTenant(user?.tenantId);

  /**
   * Feature matrix defining which plans have access to which features
   */
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
    leaderboard: ['PROFESSIONAL', 'ENTERPRISE'],
    achievements: ['STARTER', 'PROFESSIONAL', 'ENTERPRISE'],
    dataExport: ['STARTER', 'PROFESSIONAL', 'ENTERPRISE'],
  };

  /**
   * Check if tenant has access to a specific feature
   */
  const hasFeature = (feature: string): boolean => {
    // Super admin has access to all features
    if (user?.role === 'SUPER_ADMIN') {
      return true;
    }

    if (!tenant) {
      return false;
    }

    // Check if feature is explicitly enabled in tenant features JSON
    if (tenant.features && typeof tenant.features === 'object') {
      const features = tenant.features as Record<string, boolean>;
      if (features[feature] === true) {
        return true;
      }
    }

    // Check subscription plan
    const allowedPlans = featureMatrix[feature];

    if (!allowedPlans) {
      // Feature not in matrix - allow by default
      return true;
    }

    const subscriptionPlan = tenant.subscriptionPlan || 'TRIAL';
    return allowedPlans.includes(subscriptionPlan);
  };

  /**
   * Check if tenant needs to upgrade to access a feature
   */
  const requiresUpgrade = (feature: string): boolean => {
    return !hasFeature(feature);
  };

  /**
   * Get the minimum required tier for a feature
   */
  const getRequiredTier = (feature: string): string => {
    const allowedPlans = featureMatrix[feature];
    return allowedPlans?.[0] || 'PROFESSIONAL';
  };

  /**
   * Get the current subscription plan
   */
  const currentPlan = tenant?.subscriptionPlan || 'TRIAL';

  /**
   * Check if current plan is one of the specified plans
   */
  const isPlan = (...plans: string[]): boolean => {
    return plans.includes(currentPlan);
  };

  /**
   * Get feature limits based on subscription plan
   */
  const getFeatureLimits = () => {
    const limits: Record<string, { users?: number; storage?: number; apiCalls?: number }> = {
      TRIAL: { users: 5, storage: 1, apiCalls: 0 },
      FREE: { users: 5, storage: 1, apiCalls: 0 },
      STARTER: { users: 50, storage: 10, apiCalls: 0 },
      PROFESSIONAL: { users: 500, storage: 100, apiCalls: 10000 },
      ENTERPRISE: { users: -1, storage: 1000, apiCalls: -1 }, // -1 = unlimited
    };

    return limits[currentPlan] || limits.TRIAL;
  };

  return {
    hasFeature,
    requiresUpgrade,
    getRequiredTier,
    currentPlan,
    isPlan,
    getFeatureLimits,
    isLoading,
  };
}
