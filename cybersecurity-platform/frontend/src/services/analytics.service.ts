import { analyticsServiceClient, reportingServiceClient } from '@/lib/api-client';
import {
  ComplianceMetrics,
  DashboardMetrics,
  GenerateReportRequest,
  Report,
  RiskScore,
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
};
