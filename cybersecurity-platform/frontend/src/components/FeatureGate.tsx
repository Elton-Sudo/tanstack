'use client';

import { useFeatureAccess } from '@/hooks/use-feature-access';
import { ReactNode } from 'react';

interface FeatureGateProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgrade?: boolean;
}

/**
 * FeatureGate Component
 * Conditionally renders content based on subscription plan feature access
 *
 * Usage:
 * <FeatureGate feature="gamification" fallback={<UpgradePrompt feature="Gamification" />}>
 *   <LeaderboardWidget />
 * </FeatureGate>
 */
export function FeatureGate({ feature, children, fallback = null, showUpgrade = false }: FeatureGateProps) {
  const { hasFeature, requiresUpgrade, getRequiredTier, isLoading } = useFeatureAccess();

  if (isLoading) {
    return null; // or a loading skeleton
  }

  if (!hasFeature(feature)) {
    if (showUpgrade || fallback) {
      return (
        <>
          {fallback || (
            <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/10 p-6 text-center">
              <div className="mb-2 text-sm font-medium text-muted-foreground">
                Upgrade to {getRequiredTier(feature)} Plan
              </div>
              <p className="text-xs text-muted-foreground">
                This feature is available on {getRequiredTier(feature)} plan and above
              </p>
            </div>
          )}
        </>
      );
    }
    return null;
  }

  return <>{children}</>;
}
