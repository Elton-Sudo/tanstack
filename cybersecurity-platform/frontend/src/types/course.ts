import { CourseStatus, Difficulty, EnrollmentStatus } from './enums';

export interface Course {
  id: string;
  tenantId: string;
  title: string;
  description?: string;
  category: string;
  difficulty: Difficulty;
  duration: number;
  thumbnail?: string;
  status: CourseStatus;
  tags: string[];
  passingScore: number;
  createdBy: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  chapters?: Chapter[];
}

export interface Chapter {
  id: string;
  moduleId: string;
  title: string;
  content?: string;
  videoUrl?: string;
  duration?: number;
  order: number;
  isRequired: boolean;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  status: EnrollmentStatus;
  startedAt: Date;
  completedAt?: Date;
  dueDate?: Date;
  score?: number;
  certificateUrl?: string;
  course?: Course;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  passingScore: number;
  timeLimit?: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  showResults: boolean;
  questions?: Question[];
}

export interface Question {
  id: string;
  quizId: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY';
  question: string;
  options?: Record<string, string>;
  correctAnswer: string;
  points: number;
  explanation?: string;
  order: number;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  answers: Record<string, any>;
  isPassing: boolean;
  completedAt: Date;
}

export interface LearningPath {
  id: string;
  tenantId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  isRequired: boolean;
  courses?: Course[];
  createdAt: Date;
  updatedAt: Date;
}
