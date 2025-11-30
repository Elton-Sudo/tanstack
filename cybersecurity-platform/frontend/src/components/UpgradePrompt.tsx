'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { ArrowUpRight, Crown, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface UpgradePromptProps {
  feature: string;
  title?: string;
  description?: string;
  compact?: boolean;
}

/**
 * UpgradePrompt Component
 * Displays a message prompting users to upgrade their subscription
 *
 * Usage:
 * <UpgradePrompt
 *   feature="gamification"
 *   title="Unlock Gamification Features"
 *   description="Engage your team with achievements, leaderboards, and points"
 * />
 */
export function UpgradePrompt({ feature, title, description, compact = false }: UpgradePromptProps) {
  const { getRequiredTier, currentPlan } = useFeatureAccess();
  const requiredTier = getRequiredTier(feature);

  const featureDescriptions: Record<string, { title: string; description: string; icon: any }> = {
    gamification: {
      title: 'Unlock Gamification Features',
      description: 'Engage your team with achievements, badges, leaderboards, and point systems',
      icon: Sparkles,
    },
    aiRecommendations: {
      title: 'AI-Powered Course Recommendations',
      description: 'Get personalized learning paths based on user behavior and skill gaps',
      icon: Sparkles,
    },
    customRoles: {
      title: 'Custom Roles & Permissions',
      description: 'Create custom roles with granular permission control for your organization',
      icon: Crown,
    },
    sso: {
      title: 'Single Sign-On (SSO)',
      description: 'Integrate with your identity provider for seamless authentication',
      icon: Crown,
    },
    whiteLabel: {
      title: 'White Label Capabilities',
      description: 'Fully customize the platform with your branding and domain',
      icon: Crown,
    },
    advancedReporting: {
      title: 'Advanced Reporting',
      description: 'Access comprehensive analytics and customizable reports',
      icon: Crown,
    },
    leaderboard: {
      title: 'Leaderboard Access',
      description: 'View team rankings and compete on daily, weekly, and monthly leaderboards',
      icon: Sparkles,
    },
    achievements: {
      title: 'Achievement System',
      description: 'Unlock badges and achievements for completing courses and milestones',
      icon: Sparkles,
    },
  };

  const featureInfo = featureDescriptions[feature] || {
    title: title || 'Upgrade Required',
    description: description || `This feature is available on ${requiredTier} plan and above`,
    icon: Crown,
  };

  const Icon = featureInfo.icon;

  if (compact) {
    return (
      <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <div className="mb-1 text-sm font-medium">{featureInfo.title}</div>
            <p className="mb-2 text-xs text-muted-foreground">{featureInfo.description}</p>
            <Link href="/settings/subscription">
              <Button size="sm" variant="outline" className="h-7 text-xs">
                Upgrade to {requiredTier} <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-dashed border-primary/30 bg-gradient-to-br from-background to-primary/5">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <CardTitle>{title || featureInfo.title}</CardTitle>
        <CardDescription>{description || featureInfo.description}</CardDescription>
        <div className="mt-2 flex items-center justify-center gap-2 text-sm">
          <span className="text-muted-foreground">Current plan:</span>
          <span className="font-medium">{currentPlan}</span>
          <span className="text-muted-foreground">→</span>
          <span className="font-medium text-primary">{requiredTier}</span>
        </div>
      </CardHeader>
      <CardContent className="text-center">
        <Link href="/settings/subscription">
          <Button className="w-full">
            Upgrade to {requiredTier} <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <p className="mt-3 text-xs text-muted-foreground">
          Unlock this feature and more with {requiredTier} plan
        </p>
      </CardContent>
    </Card>
  );
}
