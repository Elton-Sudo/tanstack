import { analyticsService } from '@/services/analytics.service';
import { GenerateReportRequest } from '@/types/analytics';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useReports = () => {
  const queryClient = useQueryClient();

  return {
    // Get all reports
    useGetReports: () => {
      return useQuery({
        queryKey: ['reports'],
        queryFn: analyticsService.getReports,
        staleTime: 2 * 60 * 1000, // 2 minutes
      });
    },

    // Get single report
    useGetReport: (id: string, enabled = true) => {
      return useQuery({
        queryKey: ['report', id],
        queryFn: () => analyticsService.getReport(id),
        enabled: !!id && enabled,
      });
    },

    // Generate report mutation
    useGenerateReport: () => {
      return useMutation({
        mutationFn: (data: GenerateReportRequest) => analyticsService.generateReport(data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
      });
    },

    // Download report
    useDownloadReport: () => {
      return useMutation({
        mutationFn: async (id: string) => {
          const blob = await analyticsService.downloadReport(id);
          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `report-${id}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          return blob;
        },
      });
    },

    // Delete report mutation
    useDeleteReport: () => {
      return useMutation({
        mutationFn: (id: string) => analyticsService.deleteReport(id),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
      });
    },
  };
};
