import { analyticsServiceClient, reportingServiceClient } from '@/lib/api-client';
import {
  ComplianceMetrics,
  DashboardMetrics,
  GenerateReportRequest,
  PhishingCampaignStats,
  PhishingTenantStats,
  PhishingUserHistory,
  Report,
  RiskScore,
  RiskScoreWithUser,
  TenantRiskStats,
  VulnerableUser,
} from '@/types/analytics';
import { ComplianceFramework } from '@/types/enums';

export const analyticsService = {
  // Dashboard
  async getDashboardMetrics(params?: {
    dateRange?: { startDate: Date; endDate: Date };
    departmentIds?: string[];
  }): Promise<DashboardMetrics> {
    const response = await reportingServiceClient.post<DashboardMetrics>(
      '/reports/dashboard/executive',
      params,
    );
    return response.data;
  },

  // Risk Scores
  async getMyRiskScore(): Promise<RiskScore> {
    const response = await analyticsServiceClient.get<RiskScore>('/risk-scores/my');
    return response.data;
  },

  async getRiskScores(params?: { departmentId?: string }): Promise<RiskScore[]> {
    const response = await analyticsServiceClient.get<RiskScore[]>('/risk-scores', { params });
    return response.data;
  },

  // Compliance
  async getComplianceMetrics(framework: ComplianceFramework): Promise<ComplianceMetrics> {
    const response = await reportingServiceClient.get<ComplianceMetrics>(
      `/reports/compliance/${framework}`,
    );
    return response.data;
  },

  // Reports
  async getReports(): Promise<Report[]> {
    const response = await reportingServiceClient.get<Report[]>('/reports');
    return response.data;
  },

  async getReport(id: string): Promise<Report> {
    const response = await reportingServiceClient.get<Report>(`/reports/${id}`);
    return response.data;
  },

  async generateReport(data: GenerateReportRequest): Promise<Report> {
    const response = await reportingServiceClient.post<Report>('/reports/generate', data);
    return response.data;
  },

  async downloadReport(id: string): Promise<Blob> {
    const response = await reportingServiceClient.get(`/reports/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  async deleteReport(id: string): Promise<void> {
    await reportingServiceClient.delete(`/reports/${id}`);
  },

  // Phishing Simulations
  async getPhishingCampaignStats(campaignId: string): Promise<PhishingCampaignStats> {
    const response = await analyticsServiceClient.get<PhishingCampaignStats>(
      `/phishing/campaigns/${campaignId}/stats`,
    );
    return response.data;
  },

  async getPhishingUserHistory(userId?: string): Promise<PhishingUserHistory> {
    const endpoint = userId ? `/phishing/users/${userId}/history` : '/phishing/users/my/history';
    const response = await analyticsServiceClient.get<PhishingUserHistory>(endpoint);
    return response.data;
  },

  async getPhishingTenantStats(): Promise<PhishingTenantStats> {
    const response =
      await analyticsServiceClient.get<PhishingTenantStats>('/phishing/tenant/stats');
    return response.data;
  },

  async getVulnerableUsers(params?: {
    minClickRate?: number;
    departmentId?: string;
  }): Promise<VulnerableUser[]> {
    const response = await analyticsServiceClient.get<VulnerableUser[]>(
      '/phishing/vulnerable-users',
      { params },
    );
    return response.data;
  },

  // Enhanced Risk Scoring
  async getRiskScoresWithUsers(params?: {
    departmentId?: string;
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }): Promise<RiskScoreWithUser[]> {
    const response = await analyticsServiceClient.get<RiskScoreWithUser[]>(
      '/risk-scores/detailed',
      { params },
    );
    return response.data;
  },

  async getTenantRiskStats(): Promise<TenantRiskStats> {
    const response = await analyticsServiceClient.get<TenantRiskStats>('/risk/tenant/stats');
    return response.data;
  },

  async calculateMyRiskScore(): Promise<RiskScore> {
    const response = await analyticsServiceClient.post<RiskScore>('/risk/calculate/my');
    return response.data;
  },

  async getHighRiskUsers(params?: { departmentId?: string }): Promise<RiskScoreWithUser[]> {
    const response = await analyticsServiceClient.get<RiskScoreWithUser[]>(
      '/risk/high-risk-users',
      { params },
    );
    return response.data;
  },
};
