'use client';

import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { MyCoursesSkeletonLoader } from '@/components/skeletons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCourses } from '@/hooks/use-courses';
import { Enrollment } from '@/types/course';
import { EnrollmentStatus } from '@/types/enums';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Play,
  Target,
  TrendingUp,
  Trophy,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

export default function MyCoursesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'in_progress' | 'completed'>('all');

  // Fetch user's enrollments
  const { useMyEnrollments } = useCourses();
  const { data: enrollments, isLoading, isError } = useMyEnrollments();

  // Filter enrollments by status
  const filteredEnrollments = useMemo(() => {
    if (!enrollments) return [];

    switch (activeTab) {
      case 'in_progress':
        return enrollments.filter((e) => e.status === EnrollmentStatus.IN_PROGRESS);
      case 'completed':
        return enrollments.filter((e) => e.status === EnrollmentStatus.COMPLETED);
      default:
        return enrollments;
    }
  }, [enrollments, activeTab]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!enrollments) return { total: 0, inProgress: 0, completed: 0, avgProgress: 0 };

    const inProgress = enrollments.filter((e) => e.status === EnrollmentStatus.IN_PROGRESS).length;
    const completed = enrollments.filter((e) => e.status === EnrollmentStatus.COMPLETED).length;
    const avgProgress =
      enrollments.reduce((acc, e) => acc + e.progress, 0) / (enrollments.length || 1);

    return {
      total: enrollments.length,
      inProgress,
      completed,
      avgProgress: Math.round(avgProgress),
    };
  }, [enrollments]);

  const getDaysUntilDue = (dueDate?: Date) => {
    if (!dueDate) return null;
    const days = Math.ceil(
      (new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    );
    return days;
  };

  const getStatusBadge = (status: EnrollmentStatus) => {
    switch (status) {
      case EnrollmentStatus.IN_PROGRESS:
        return <Badge variant="primary">In Progress</Badge>;
      case EnrollmentStatus.COMPLETED:
        return <Badge variant="success">Completed</Badge>;
      case EnrollmentStatus.NOT_STARTED:
        return <Badge variant="default">Not Started</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return <MyCoursesSkeletonLoader />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="text-muted-foreground">View your enrolled courses and progress</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Failed to load your courses. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'My Courses', href: '/my-courses' }]} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-brand-blue" />
          My Courses
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your learning progress and continue where you left off
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Enrolled courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Currently learning</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Finished courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgProgress}%</div>
            <p className="text-xs text-muted-foreground">Overall completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList>
          <TabsTrigger value="all">All Courses ({enrollments?.length || 0})</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress ({stats.inProgress})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredEnrollments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {activeTab === 'completed' ? 'No completed courses yet' : 'No courses found'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === 'all'
                    ? "You haven't enrolled in any courses yet"
                    : activeTab === 'completed'
                      ? 'Complete a course to see it here'
                      : "You don't have any courses in progress"}
                </p>
                <Button asChild>
                  <Link href="/courses">Browse Courses</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredEnrollments.map((enrollment) => (
                <Card
                  key={enrollment.id}
                  className="hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {/* Course Thumbnail */}
                  {enrollment.course?.thumbnail ? (
                    <div className="relative h-32 bg-gradient-to-br from-brand-blue to-brand-green overflow-hidden">
                      <img
                        src={enrollment.course.thumbnail}
                        alt={enrollment.course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                    </div>
                  ) : (
                    <div className="relative h-32 bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-white/80" />
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      {getStatusBadge(enrollment.status)}
                      {enrollment.dueDate && getDaysUntilDue(enrollment.dueDate) !== null && (
                        <Badge
                          variant={getDaysUntilDue(enrollment.dueDate)! <= 7 ? 'error' : 'warning'}
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          {getDaysUntilDue(enrollment.dueDate)} days left
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      {enrollment.course?.title || 'Untitled Course'}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {enrollment.course?.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{enrollment.progress}%</span>
                      </div>
                      <Progress value={enrollment.progress} className="h-2" />
                    </div>

                    {/* Course Info */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{enrollment.course?.duration || 0} min</span>
                      </div>
                      {enrollment.score !== null && enrollment.score !== undefined && (
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          <span>{enrollment.score}%</span>
                        </div>
                      )}
                      {enrollment.status === EnrollmentStatus.COMPLETED &&
                        enrollment.certificateUrl && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Certified</span>
                          </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      {enrollment.status === EnrollmentStatus.COMPLETED ? (
                        <>
                          <Button asChild variant="outline" className="flex-1">
                            <Link href={`/courses/${enrollment.courseId}`}>View Course</Link>
                          </Button>
                          {enrollment.certificateUrl && (
                            <Button asChild className="flex-1">
                              <Link href={`/certificates/${enrollment.id}`}>
                                <Trophy className="mr-2 h-4 w-4" />
                                Certificate
                              </Link>
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button asChild className="w-full">
                          <Link href={`/courses/${enrollment.courseId}/player`}>
                            <Play className="mr-2 h-4 w-4" />
                            {enrollment.progress === 0 ? 'Start Course' : 'Continue Learning'}
                          </Link>
                        </Button>
                      )}
                    </div>

                    {/* Due Date Warning */}
                    {enrollment.dueDate &&
                      getDaysUntilDue(enrollment.dueDate) !== null &&
                      getDaysUntilDue(enrollment.dueDate)! <= 3 &&
                      enrollment.status !== EnrollmentStatus.COMPLETED && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
                          <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                          <p className="text-xs text-red-900 dark:text-red-100">
                            This course is due in {getDaysUntilDue(enrollment.dueDate)} day(s).
                            Complete it soon!
                          </p>
                        </div>
                      )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
