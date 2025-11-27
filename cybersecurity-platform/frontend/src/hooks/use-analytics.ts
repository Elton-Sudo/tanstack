import { analyticsService } from '@/services/analytics.service';
import { ComplianceFramework } from '@/types/enums';
import { useQuery } from '@tanstack/react-query';

export const useAnalytics = () => {
  return {
    // Get dashboard metrics
    useDashboardMetrics: (
      params?: {
        dateRange?: { startDate: Date; endDate: Date };
        departmentIds?: string[];
      },
      enabled = true,
    ) => {
      return useQuery({
        queryKey: ['dashboard-metrics', params],
        queryFn: () => analyticsService.getDashboardMetrics(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled,
      });
    },

    // Get my risk score
    useMyRiskScore: () => {
      return useQuery({
        queryKey: ['my-risk-score'],
        queryFn: analyticsService.getMyRiskScore,
        staleTime: 10 * 60 * 1000, // 10 minutes
      });
    },

    // Get risk scores (admin/manager view)
    useRiskScores: (params?: { departmentId?: string }, enabled = true) => {
      return useQuery({
        queryKey: ['risk-scores', params],
        queryFn: () => analyticsService.getRiskScores(params),
        staleTime: 5 * 60 * 1000,
        enabled,
      });
    },

    // Get compliance metrics for a framework
    useComplianceMetrics: (framework: ComplianceFramework, enabled = true) => {
      return useQuery({
        queryKey: ['compliance-metrics', framework],
        queryFn: () => analyticsService.getComplianceMetrics(framework),
        enabled: !!framework && enabled,
        staleTime: 10 * 60 * 1000,
      });
    },

    // Phishing Simulations
    usePhishingTenantStats: (enabled = true) => {
      return useQuery({
        queryKey: ['phishing-tenant-stats'],
        queryFn: analyticsService.getPhishingTenantStats,
        staleTime: 5 * 60 * 1000,
        enabled,
      });
    },

    usePhishingUserHistory: (userId?: string, enabled = true) => {
      return useQuery({
        queryKey: ['phishing-user-history', userId],
        queryFn: () => analyticsService.getPhishingUserHistory(userId),
        staleTime: 5 * 60 * 1000,
        enabled,
      });
    },

    useVulnerableUsers: (
      params?: {
        minClickRate?: number;
        departmentId?: string;
      },
      enabled = true,
    ) => {
      return useQuery({
        queryKey: ['vulnerable-users', params],
        queryFn: () => analyticsService.getVulnerableUsers(params),
        staleTime: 5 * 60 * 1000,
        enabled,
      });
    },

    // Enhanced Risk Scoring
    useRiskScoresWithUsers: (
      params?: {
        departmentId?: string;
        riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      },
      enabled = true,
    ) => {
      return useQuery({
        queryKey: ['risk-scores-with-users', params],
        queryFn: () => analyticsService.getRiskScoresWithUsers(params),
        staleTime: 5 * 60 * 1000,
        enabled,
      });
    },

    useTenantRiskStats: (enabled = true) => {
      return useQuery({
        queryKey: ['tenant-risk-stats'],
        queryFn: analyticsService.getTenantRiskStats,
        staleTime: 5 * 60 * 1000,
        enabled,
        refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time feel
      });
    },

    useHighRiskUsers: (params?: { departmentId?: string }, enabled = true) => {
      return useQuery({
        queryKey: ['high-risk-users', params],
        queryFn: () => analyticsService.getHighRiskUsers(params),
        staleTime: 5 * 60 * 1000,
        enabled,
      });
    },
  };
};
