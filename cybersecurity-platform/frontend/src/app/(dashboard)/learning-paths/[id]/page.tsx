'use client';

import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useCourses } from '@/hooks/use-courses';
import { BookOpen, CheckCircle2, Clock, Route, AlertCircle, Lock, Play, Award } from 'lucide-react';
import Link from 'next/link';
import { use, useMemo } from 'react';
import toast from 'react-hot-toast';

interface LearningPathDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function LearningPathDetailPage({ params }: LearningPathDetailPageProps) {
  const { id: pathId } = use(params);

  // API hooks
  const { useGetLearningPath, useMyEnrollments, useEnrollCourse } = useCourses();
  const { data: path, isLoading, isError } = useGetLearningPath(pathId);
  const { data: enrollments } = useMyEnrollments();
  const enrollMutation = useEnrollCourse();

  // Calculate course progress and completion
  const coursesWithStatus = useMemo(() => {
    if (!path?.courses || !enrollments) return [];

    return path.courses.map((course) => {
      const enrollment = enrollments.find((e) => e.courseId === course.id);
      return {
        ...course,
        enrollment,
        isCompleted: enrollment?.progress === 100,
        isEnrolled: !!enrollment,
        progress: enrollment?.progress || 0,
      };
    });
  }, [path, enrollments]);

  // Calculate overall path progress
  const pathProgress = useMemo(() => {
    if (!coursesWithStatus.length) return 0;
    const totalProgress = coursesWithStatus.reduce((sum, course) => sum + course.progress, 0);
    return Math.round(totalProgress / coursesWithStatus.length);
  }, [coursesWithStatus]);

  const completedCourses = coursesWithStatus.filter((c) => c.isCompleted).length;
  const totalDuration = path?.courses?.reduce((sum, c) => sum + (c.duration || 0), 0) || 0;
  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;
  const durationText = minutes > 0 ? `${hours}h ${minutes}m` : `${hours} hours`;
  const hasLockedCourses = coursesWithStatus.some(
    (course, index) => index > 0 && !coursesWithStatus[index - 1].isCompleted,
  );

  const handleEnroll = async (courseId: string) => {
    try {
      await enrollMutation.mutateAsync(courseId);
      toast.success('Successfully enrolled in course!');
    } catch (error) {
      toast.error('Failed to enroll in course');
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'ADVANCED':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" width="40%" height={36} />
        <Card>
          <CardHeader>
            <Skeleton variant="text" width="60%" height={32} />
            <Skeleton variant="text" width="80%" />
          </CardHeader>
          <CardContent>
            <Skeleton variant="rectangular" height={100} className="rounded-md" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton variant="text" width="30%" height={24} />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rectangular" height={80} className="rounded-lg" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !path) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Learning Paths', href: '/learning-paths' },
            { label: 'Path Details', href: `/learning-paths/${pathId}` },
          ]}
        />
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load learning path</h3>
            <p className="text-muted-foreground mb-4">
              There was an error loading this learning path. Please try again later.
            </p>
            <Link
              href="/learning-paths"
              className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative bg-brand-blue-500 text-white shadow-sm hover:bg-brand-blue-600 active:bg-brand-blue-700 focus-visible:ring-brand-blue-500/50 h-10 px-4 text-sm"
            >
              Back to Learning Paths
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Learning Paths', href: '/learning-paths' },
          { label: path.title, href: `/learning-paths/${pathId}` },
        ]}
      />

      {/* Path Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-brand-blue/10 p-4 shrink-0">
              <Route className="h-8 w-8 text-brand-blue" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-3xl font-bold">{path.title}</h1>
                {path.isRequired && (
                  <Badge variant="error" className="shrink-0">
                    Required
                  </Badge>
                )}
                {pathProgress === 100 && (
                  <Badge variant="success" className="shrink-0">
                    <Award className="mr-1 h-3 w-3" />
                    Completed
                  </Badge>
                )}
              </div>
              {path.description && <p className="text-muted-foreground">{path.description}</p>}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>
                    {path.courses?.length || 0} course{path.courses?.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{durationText}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{pathProgress}%</span>
            </div>
            <Progress value={pathProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {completedCourses} of {coursesWithStatus.length} courses completed
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Courses in Path */}
      <Card>
        <CardHeader>
          <CardTitle>Courses in this Path</CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete all courses in sequence to finish this learning path
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {coursesWithStatus.map((course, index) => {
              const isLocked = index > 0 && !coursesWithStatus[index - 1].isCompleted;

              return (
                <div
                  key={course.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    isLocked
                      ? 'bg-muted/50 opacity-60'
                      : 'hover:bg-accent hover:shadow-md cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Number/Status Icon */}
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full shrink-0 ${
                        course.isCompleted
                          ? 'bg-brand-green/10'
                          : isLocked
                            ? 'bg-muted'
                            : 'bg-brand-blue/10'
                      }`}
                    >
                      {course.isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-brand-green" />
                      ) : isLocked ? (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <span className="font-medium text-brand-blue">{index + 1}</span>
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{course.title}</p>
                        {course.difficulty && (
                          <Badge className={getDifficultyColor(course.difficulty)}>
                            {course.difficulty}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{course.duration || 0} min</span>
                        </div>
                        {course.progress > 0 && (
                          <span className="text-brand-blue font-medium">
                            {course.progress}% complete
                          </span>
                        )}
                      </div>
                      {course.progress > 0 && course.progress < 100 && (
                        <Progress value={course.progress} className="h-1 mt-2" />
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {course.isCompleted && (
                        <Badge variant="success" className="hidden sm:flex">
                          Completed
                        </Badge>
                      )}
                      {isLocked ? (
                        <Button variant="outline" size="sm" disabled>
                          <Lock className="mr-2 h-4 w-4" />
                          Locked
                        </Button>
                      ) : course.isEnrolled ? (
                        <Link
                          href={`/courses/${course.id}/player`}
                          className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-brand-blue-500 text-white shadow-sm hover:bg-brand-blue-600 active:bg-brand-blue-700 focus-visible:ring-brand-blue-500/50 h-8 px-3 text-sm rounded-md"
                        >
                          <Play className="mr-2 h-4 w-4" />
                          {course.progress === 0
                            ? 'Start'
                            : course.isCompleted
                              ? 'Review'
                              : 'Continue'}
                        </Link>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEnroll(course.id)}
                          disabled={enrollMutation.isPending}
                        >
                          {enrollMutation.isPending ? 'Enrolling...' : 'Enroll'}
                        </Button>
                      )}
                      <Link
                        href={`/courses/${course.id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 border-2 border-brand-blue-500 text-brand-blue-600 bg-transparent hover:bg-brand-blue-50 active:bg-brand-blue-100 focus-visible:ring-brand-blue-500/50 dark:hover:bg-brand-blue-950 dark:text-brand-blue-400 h-8 px-3 text-sm rounded-md"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {hasLockedCourses && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                    Sequential Learning
                  </p>
                  <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
                    Complete courses in order to unlock the next one. This ensures you build
                    knowledge progressively.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completion Badge */}
      {pathProgress === 100 && (
        <Card className="border-brand-green bg-brand-green/5">
          <CardContent className="py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-brand-green/10 flex items-center justify-center">
                <Award className="h-8 w-8 text-brand-green" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Learning Path Completed!</h3>
            <p className="text-muted-foreground mb-4">
              Congratulations! You've completed all courses in this learning path.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
