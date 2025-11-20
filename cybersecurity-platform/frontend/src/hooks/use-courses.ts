import { courseService } from '@/services/course.service';
import { Course } from '@/types/course';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCourses = () => {
  const queryClient = useQueryClient();

  return {
    // Get all courses with optional filters
    useGetCourses: (filters?: {
      category?: string;
      difficulty?: string;
      status?: string;
      search?: string;
      page?: number;
      limit?: number;
    }) => {
      return useQuery({
        queryKey: ['courses', filters],
        queryFn: () => courseService.getCourses(filters),
        staleTime: 2 * 60 * 1000, // 2 minutes
      });
    },

    // Get single course by ID
    useGetCourse: (id: string, enabled = true) => {
      return useQuery({
        queryKey: ['course', id],
        queryFn: () => courseService.getCourse(id),
        enabled: !!id && enabled,
        staleTime: 5 * 60 * 1000,
      });
    },

    // Get modules for a course
    useGetModules: (courseId: string, enabled = true) => {
      return useQuery({
        queryKey: ['modules', courseId],
        queryFn: () => courseService.getModules(courseId),
        enabled: !!courseId && enabled,
        staleTime: 5 * 60 * 1000,
      });
    },

    // Create course mutation (admin/instructor only)
    useCreateCourse: () => {
      return useMutation({
        mutationFn: (data: Partial<Course>) => courseService.createCourse(data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['courses'] });
        },
      });
    },

    // Update course mutation
    useUpdateCourse: () => {
      return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Course> }) =>
          courseService.updateCourse(id, data),
        onSuccess: (_, variables) => {
          queryClient.invalidateQueries({ queryKey: ['course', variables.id] });
          queryClient.invalidateQueries({ queryKey: ['courses'] });
        },
      });
    },

    // Delete course mutation
    useDeleteCourse: () => {
      return useMutation({
        mutationFn: (id: string) => courseService.deleteCourse(id),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['courses'] });
        },
      });
    },

    // Get my enrollments
    useMyEnrollments: (filters?: { status?: string }) => {
      return useQuery({
        queryKey: ['my-enrollments', filters],
        queryFn: () => courseService.getMyEnrollments(filters),
        staleTime: 1 * 60 * 1000, // 1 minute
      });
    },

    // Get specific enrollment
    useGetEnrollment: (id: string, enabled = true) => {
      return useQuery({
        queryKey: ['enrollment', id],
        queryFn: () => courseService.getEnrollment(id),
        enabled: !!id && enabled,
      });
    },

    // Enroll in course mutation
    useEnrollCourse: () => {
      return useMutation({
        mutationFn: (courseId: string) => courseService.enrollCourse(courseId),
        onSuccess: (_, courseId) => {
          queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
          queryClient.invalidateQueries({ queryKey: ['course', courseId] });
        },
      });
    },

    // Update progress mutation
    useUpdateProgress: () => {
      return useMutation({
        mutationFn: ({ enrollmentId, progress }: { enrollmentId: string; progress: number }) =>
          courseService.updateProgress(enrollmentId, progress),
        onSuccess: (_, variables) => {
          queryClient.invalidateQueries({ queryKey: ['enrollment', variables.enrollmentId] });
          queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
        },
      });
    },

    // Get quizzes for a course
    useGetQuizzes: (courseId: string, enabled = true) => {
      return useQuery({
        queryKey: ['quizzes', courseId],
        queryFn: () => courseService.getQuizzes(courseId),
        enabled: !!courseId && enabled,
      });
    },

    // Get single quiz
    useGetQuiz: (id: string, enabled = true) => {
      return useQuery({
        queryKey: ['quiz', id],
        queryFn: () => courseService.getQuiz(id),
        enabled: !!id && enabled,
      });
    },

    // Submit quiz mutation
    useSubmitQuiz: () => {
      return useMutation({
        mutationFn: ({ quizId, answers }: { quizId: string; answers: Record<string, any> }) =>
          courseService.submitQuiz(quizId, answers),
        onSuccess: (_, variables) => {
          queryClient.invalidateQueries({ queryKey: ['quiz-attempts', variables.quizId] });
        },
      });
    },

    // Get quiz attempts
    useGetQuizAttempts: (quizId: string, enabled = true) => {
      return useQuery({
        queryKey: ['quiz-attempts', quizId],
        queryFn: () => courseService.getQuizAttempts(quizId),
        enabled: !!quizId && enabled,
      });
    },

    // Get learning paths
    useGetLearningPaths: () => {
      return useQuery({
        queryKey: ['learning-paths'],
        queryFn: courseService.getLearningPaths,
        staleTime: 5 * 60 * 1000,
      });
    },

    // Get single learning path
    useGetLearningPath: (id: string, enabled = true) => {
      return useQuery({
        queryKey: ['learning-path', id],
        queryFn: () => courseService.getLearningPath(id),
        enabled: !!id && enabled,
      });
    },
  };
};
