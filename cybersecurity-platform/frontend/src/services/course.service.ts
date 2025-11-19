import { courseServiceClient } from '@/lib/api-client';
import { Course, Enrollment, Module, Quiz, QuizAttempt, LearningPath } from '@/types/course';

export const courseService = {
  // Courses
  async getCourses(params?: { category?: string; difficulty?: string; status?: string }): Promise<Course[]> {
    const response = await courseServiceClient.get<Course[]>('/courses', { params });
    return response.data;
  },

  async getCourse(id: string): Promise<Course> {
    const response = await courseServiceClient.get<Course>(`/courses/${id}`);
    return response.data;
  },

  async createCourse(data: Partial<Course>): Promise<Course> {
    const response = await courseServiceClient.post<Course>('/courses', data);
    return response.data;
  },

  async updateCourse(id: string, data: Partial<Course>): Promise<Course> {
    const response = await courseServiceClient.put<Course>(`/courses/${id}`, data);
    return response.data;
  },

  async deleteCourse(id: string): Promise<void> {
    await courseServiceClient.delete(`/courses/${id}`);
  },

  // Modules
  async getModules(courseId: string): Promise<Module[]> {
    const response = await courseServiceClient.get<Module[]>(`/courses/${courseId}/modules`);
    return response.data;
  },

  async createModule(courseId: string, data: Partial<Module>): Promise<Module> {
    const response = await courseServiceClient.post<Module>(`/courses/${courseId}/modules`, data);
    return response.data;
  },

  // Enrollments
  async getMyEnrollments(params?: { status?: string }): Promise<Enrollment[]> {
    const response = await courseServiceClient.get<Enrollment[]>('/enrollments/my', { params });
    return response.data;
  },

  async getEnrollment(id: string): Promise<Enrollment> {
    const response = await courseServiceClient.get<Enrollment>(`/enrollments/${id}`);
    return response.data;
  },

  async enrollCourse(courseId: string): Promise<Enrollment> {
    const response = await courseServiceClient.post<Enrollment>(`/courses/${courseId}/enroll`);
    return response.data;
  },

  async updateProgress(enrollmentId: string, progress: number): Promise<Enrollment> {
    const response = await courseServiceClient.put<Enrollment>(`/enrollments/${enrollmentId}/progress`, {
      progress,
    });
    return response.data;
  },

  // Quizzes
  async getQuizzes(courseId: string): Promise<Quiz[]> {
    const response = await courseServiceClient.get<Quiz[]>(`/courses/${courseId}/quizzes`);
    return response.data;
  },

  async getQuiz(id: string): Promise<Quiz> {
    const response = await courseServiceClient.get<Quiz>(`/quizzes/${id}`);
    return response.data;
  },

  async submitQuiz(quizId: string, answers: Record<string, any>): Promise<QuizAttempt> {
    const response = await courseServiceClient.post<QuizAttempt>(`/quizzes/${quizId}/submit`, {
      answers,
    });
    return response.data;
  },

  async getQuizAttempts(quizId: string): Promise<QuizAttempt[]> {
    const response = await courseServiceClient.get<QuizAttempt[]>(`/quizzes/${quizId}/attempts`);
    return response.data;
  },

  // Learning Paths
  async getLearningPaths(): Promise<LearningPath[]> {
    const response = await courseServiceClient.get<LearningPath[]>('/learning-paths');
    return response.data;
  },

  async getLearningPath(id: string): Promise<LearningPath> {
    const response = await courseServiceClient.get<LearningPath>(`/learning-paths/${id}`);
    return response.data;
  },
};
