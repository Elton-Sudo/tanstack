'use client';

import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useCourses } from '@/hooks/use-courses';
import { LearningPath } from '@/types/course';
import { BookOpen, Clock, Route, AlertCircle, Award } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

interface ExtendedLearningPath extends LearningPath {
  progress: number;
  completedCourses: number;
}

export default function LearningPathsPage() {
  // API hooks
  const { useGetLearningPaths, useMyEnrollments } = useCourses();
  const { data: learningPaths, isLoading, isError } = useGetLearningPaths();
  const { data: enrollments } = useMyEnrollments();

  // Calculate progress for each learning path
  const pathsWithProgress = useMemo((): ExtendedLearningPath[] => {
    if (!learningPaths || !enrollments)
      return learningPaths?.map((p) => ({ ...p, progress: 0, completedCourses: 0 })) || [];

    return learningPaths.map((path) => {
      if (!path.courses || path.courses.length === 0) {
        return { ...path, progress: 0, completedCourses: 0 };
      }

      // Find enrollments for courses in this path
      const pathCourseIds = path.courses.map((c) => c.id);
      const pathEnrollments = enrollments.filter((e) => pathCourseIds.includes(e.courseId));

      // Calculate average progress
      const totalProgress = pathEnrollments.reduce((sum, e) => sum + e.progress, 0);
      const progress =
        pathEnrollments.length > 0 ? Math.round(totalProgress / path.courses.length) : 0;

      // Count completed courses
      const completedCourses = pathEnrollments.filter((e) => e.progress === 100).length;

      return { ...path, progress, completedCourses };
    });
  }, [learningPaths, enrollments]);

  // Calculate total duration for each path
  const getTotalDuration = (path: any) => {
    if (!path.courses || path.courses.length === 0) return '0 hours';
    const totalMinutes = path.courses.reduce(
      (sum: number, course: any) => sum + (course.duration || 0),
      0,
    );
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours} hours`;
  };

  const getDifficultyVariant = (difficulty?: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'success';
      case 'INTERMEDIATE':
        return 'warning';
      case 'ADVANCED':
        return 'error';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" width="30%" height={36} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton variant="circular" width={48} height={48} className="mb-4" />
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="text" width="100%" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton variant="rectangular" height={40} className="rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !learningPaths) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Learning Paths', href: '/learning-paths' }]} />
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load learning paths</h3>
            <p className="text-muted-foreground mb-4">
              There was an error loading the learning paths. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (pathsWithProgress.length === 0) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Learning Paths', href: '/learning-paths' }]} />
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Route className="h-8 w-8 text-brand-blue" />
            Learning Paths
          </h1>
          <p className="text-muted-foreground mt-1">
            Follow structured learning paths to build your cybersecurity expertise
          </p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <Route className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Learning Paths Available</h3>
            <p className="text-muted-foreground mb-4">
              There are no learning paths available at this time.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Learning Paths', href: '/learning-paths' }]} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Route className="h-8 w-8 text-brand-blue" />
          Learning Paths
        </h1>
        <p className="text-muted-foreground mt-1">
          Follow structured learning paths to build your cybersecurity expertise
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paths</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pathsWithProgress.length}</div>
            <p className="text-xs text-muted-foreground">Available learning paths</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {pathsWithProgress.filter((p) => p.progress > 0 && p.progress < 100).length}
            </div>
            <p className="text-xs text-muted-foreground">Currently learning</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {pathsWithProgress.filter((p) => p.progress === 100).length}
            </div>
            <p className="text-xs text-muted-foreground">Finished paths</p>
          </CardContent>
        </Card>
      </div>

      {/* Learning Paths Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pathsWithProgress.map((path) => (
          <Card key={path.id} className="hover:shadow-lg transition-shadow overflow-hidden">
            {/* Thumbnail or gradient */}
            {path.thumbnail ? (
              <div className="relative h-32 bg-gradient-to-br from-brand-blue to-brand-green overflow-hidden">
                <img src={path.thumbnail} alt={path.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20" />
              </div>
            ) : (
              <div className="relative h-32 bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center">
                <Route className="h-16 w-16 text-white/80" />
              </div>
            )}

            <CardHeader>
              <div className="flex items-start justify-between gap-2 mb-2">
                {path.isRequired && (
                  <Badge variant="error" className="shrink-0">
                    Required
                  </Badge>
                )}
                {path.courses && path.courses.length > 0 && (
                  <Badge variant={getDifficultyVariant(path.courses[0]?.difficulty)}>
                    {path.courses[0]?.difficulty || 'Mixed'}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg line-clamp-2">{path.title}</CardTitle>
              {path.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{path.description}</p>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>
                    {path.courses?.length || 0} course{path.courses?.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{getTotalDuration(path)}</span>
                </div>
              </div>

              {path.progress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{path.progress}%</span>
                  </div>
                  <Progress value={path.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {path.completedCourses || 0} of {path.courses?.length || 0} courses completed
                  </p>
                </div>
              )}

              <Link
                href={`/learning-paths/${path.id}`}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-brand-blue-500 text-white shadow-sm hover:bg-brand-blue-600 active:bg-brand-blue-700 focus-visible:ring-brand-blue-500/50 h-10 px-4 text-sm"
              >
                {path.progress > 0
                  ? path.progress === 100
                    ? 'Review Path'
                    : 'Continue Learning'
                  : 'Start Path'}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
