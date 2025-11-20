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
  };
};
