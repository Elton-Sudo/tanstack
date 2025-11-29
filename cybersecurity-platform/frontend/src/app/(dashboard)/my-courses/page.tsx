'use client';

import { CourseCard } from '@/components/domain/courses/CourseCard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AreaChartCard, MetricCard, ProgressRing } from '@/components/visualizations';
import { Award, BookOpen, CheckCircle2, Clock, PlayCircle } from 'lucide-react';
import { useState } from 'react';

type EnrolledCourse = {
  id: number;
  title: string;
  description: string;
  progress: number;
  lastAccessed: string;
  status: 'In Progress' | 'Completed' | 'Not Started';
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  enrolled: number;
  rating: number;
};

export default function MyCoursesPage() {
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Mock data
  const enrolledCourses: EnrolledCourse[] = [
    {
      id: 1,
      title: 'Phishing Awareness Training',
      description: 'Learn to identify and prevent phishing attacks',
      progress: 75,
      lastAccessed: '2 hours ago',
      status: 'In Progress',
      duration: '2 hours',
      level: 'Beginner',
      category: 'Email Security',
      enrolled: 245,
      rating: 4.8,
    },
    {
      id: 2,
      title: 'Password Security Best Practices',
      description: 'Master the art of creating and managing secure passwords',
      progress: 100,
      lastAccessed: '1 day ago',
      status: 'Completed',
      duration: '1.5 hours',
      level: 'Beginner',
      category: 'Authentication',
      enrolled: 189,
      rating: 4.6,
    },
    {
      id: 3,
      title: 'Data Protection & Privacy',
      description: 'Understanding GDPR, CCPA and data protection regulations',
      progress: 30,
      lastAccessed: '3 days ago',
      status: 'In Progress',
      duration: '3 hours',
      level: 'Intermediate',
      category: 'Compliance',
      enrolled: 156,
      rating: 4.9,
    },
    {
      id: 4,
      title: 'Social Engineering Defense',
      description: 'Protect yourself and your organization from social engineering',
      progress: 0,
      lastAccessed: 'Never',
      status: 'Not Started',
      duration: '2.5 hours',
      level: 'Intermediate',
      category: 'Social Engineering',
      enrolled: 178,
      rating: 4.5,
    },
  ];

  // Filter courses by status
  const filteredCourses =
    statusFilter === 'All'
      ? enrolledCourses
      : enrolledCourses.filter((course) => course.status === statusFilter);

  const inProgressCount = enrolledCourses.filter((c) => c.status === 'In Progress').length;
  const completedCount = enrolledCourses.filter((c) => c.status === 'Completed').length;
  const totalHours = enrolledCourses.reduce((sum, course) => {
    const hours = parseFloat(course.duration.split(' ')[0]);
    return sum + hours * (course.progress / 100);
  }, 0);

  // Study time trend data
  const studyTimeTrend = [
    { week: 'Week 1', hours: 2.5 },
    { week: 'Week 2', hours: 3.2 },
    { week: 'Week 3', hours: 4.1 },
    { week: 'Week 4', hours: 3.8 },
    { week: 'Week 5', hours: 5.2 },
    { week: 'Week 6', hours: 4.5 },
  ];

  const handleContinueCourse = (courseId: number) => {
    window.location.href = `/courses/${courseId}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Learning Journey</h1>
        <p className="text-muted-foreground">Track your progress and continue where you left off</p>
      </div>

      {/* Progress Overview with MetricCards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Enrolled Courses"
          value={enrolledCourses.length}
          subtitle="Total courses"
          icon={BookOpen}
          variant="primary"
          animate
        />
        <MetricCard
          title="In Progress"
          value={inProgressCount}
          subtitle="Currently learning"
          icon={PlayCircle}
          variant="warning"
          animate
        />
        <MetricCard
          title="Completed"
          value={completedCount}
          subtitle="Courses finished"
          trend={{
            value: 20,
            isPositive: true,
            label: 'this month',
          }}
          icon={CheckCircle2}
          variant="success"
          animate
        />
        <MetricCard
          title="Study Time"
          value={`${totalHours.toFixed(1)}h`}
          subtitle="Total hours logged"
          trend={{
            value: 15,
            isPositive: true,
            label: 'vs last week',
          }}
          icon={Clock}
          variant="neutral"
          animate
        />
      </div>

      {/* Study Time Trend & Overall Progress */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Study Time Chart */}
        <div className="lg:col-span-2">
          <AreaChartCard
            title="Study Time Trend"
            description="Weekly study hours over the last 6 weeks"
            data={studyTimeTrend}
            xAxisKey="week"
            dataKeys={[{ key: 'hours', name: 'Study Hours', color: '#3B8EDE' }]}
            height={280}
          />
        </div>

        {/* Overall Progress Ring */}
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center h-full space-y-4">
            <h3 className="text-sm font-semibold text-center">Overall Progress</h3>
            <ProgressRing
              progress={Math.round(
                (enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length) *
                  100,
              )}
              size={160}
              strokeWidth={12}
              showLabel
            />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {completedCount} of {enrolledCourses.length} courses completed
              </p>
              {completedCount === enrolledCourses.length && (
                <div className="mt-2 flex items-center gap-1 text-brand-green justify-center">
                  <Award className="h-4 w-4" />
                  <span className="text-xs font-medium">All courses completed!</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 items-center">
        <span className="text-sm text-muted-foreground">Filter:</span>
        {['All', 'In Progress', 'Completed', 'Not Started'].map((status) => (
          <Badge
            key={status}
            variant={statusFilter === status ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-accent"
            onClick={() => setStatusFilter(status)}
          >
            {status}
          </Badge>
        ))}
      </div>

      {/* Course Cards */}
      {filteredCourses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              variant="grid"
              showProgress
              onView={handleContinueCourse}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-semibold">No courses found</p>
          <p className="text-sm text-muted-foreground mt-2">
            {statusFilter === 'All'
              ? 'Enroll in courses from the catalog to start learning'
              : `No courses with status: ${statusFilter}`}
          </p>
        </div>
      )}
    </div>
  );
}
