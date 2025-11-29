'use client';

import { CourseCard } from '@/components/domain/courses/CourseCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChartCard, MetricCard, PieChartCard } from '@/components/visualizations';
import { BookOpen, Grid, List, Search, Star, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

type Course = {
  id: number;
  title: string;
  description: string;
  duration: string;
  enrolled: number;
  rating: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
};

export default function CoursesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const courses: Course[] = [
    {
      id: 1,
      title: 'Phishing Awareness Training',
      description: 'Learn to identify and prevent phishing attacks',
      duration: '2 hours',
      enrolled: 245,
      rating: 4.8,
      level: 'Beginner',
      category: 'Email Security',
    },
    {
      id: 2,
      title: 'Password Security Best Practices',
      description: 'Master the art of creating and managing secure passwords',
      duration: '1.5 hours',
      enrolled: 189,
      rating: 4.6,
      level: 'Beginner',
      category: 'Authentication',
    },
    {
      id: 3,
      title: 'Data Protection & Privacy',
      description: 'Understanding GDPR, CCPA and data protection regulations',
      duration: '3 hours',
      enrolled: 156,
      rating: 4.9,
      level: 'Intermediate',
      category: 'Compliance',
    },
    {
      id: 4,
      title: 'Incident Response Fundamentals',
      description: 'Learn how to respond to security incidents effectively',
      duration: '4 hours',
      enrolled: 98,
      rating: 4.7,
      level: 'Advanced',
      category: 'Incident Response',
    },
    {
      id: 5,
      title: 'Social Engineering Defense',
      description: 'Protect yourself and your organization from social engineering tactics',
      duration: '2.5 hours',
      enrolled: 178,
      rating: 4.5,
      level: 'Intermediate',
      category: 'Social Engineering',
    },
    {
      id: 6,
      title: 'Secure Coding Practices',
      description: 'Write secure code and prevent common vulnerabilities',
      duration: '5 hours',
      enrolled: 67,
      rating: 4.8,
      level: 'Advanced',
      category: 'Development',
    },
  ];

  const categories = [
    'All',
    'Email Security',
    'Authentication',
    'Compliance',
    'Incident Response',
    'Social Engineering',
    'Development',
  ];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    const matchesSearch =
      searchQuery === '' ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  });

  // Analytics data
  const totalEnrollments = courses.reduce((sum, course) => sum + course.enrolled, 0);
  const averageRating = (
    courses.reduce((sum, course) => sum + course.rating, 0) / courses.length
  ).toFixed(1);

  const categoryDistribution = [
    { name: 'Email Security', value: 35, color: '#3B8EDE' },
    { name: 'Authentication', value: 25, color: '#8CB841' },
    { name: 'Compliance', value: 20, color: '#F5C242' },
    { name: 'Incident Response', value: 15, color: '#E86A33' },
    { name: 'Social Engineering', value: 3, color: '#F5C242' },
    { name: 'Development', value: 2, color: '#8CB841' },
  ];

  const enrollmentByLevel = [
    { level: 'Beginner', enrollments: 434 },
    { level: 'Intermediate', enrollments: 334 },
    { level: 'Advanced', enrollments: 165 },
  ];

  const handleEnroll = (courseId: number) => {
    alert(`Enrolling in course ${courseId}`);
    // In production, this would call an API
  };

  const handleViewCourse = (courseId: number) => {
    // In production, navigate to course detail page
    window.location.href = `/courses/${courseId}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Course Catalog</h1>
          <p className="text-muted-foreground">
            Explore our comprehensive cybersecurity training courses
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
        </div>
      </div>

      {/* Course Analytics Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Courses"
          value={courses.length}
          subtitle="Available for enrollment"
          icon={BookOpen}
          variant="primary"
          animate
        />
        <MetricCard
          title="Total Enrollments"
          value={totalEnrollments}
          subtitle="Across all courses"
          trend={{ value: 18.2, isPositive: true, label: 'vs last month' }}
          icon={Users}
          variant="success"
          animate
        />
        <MetricCard
          title="Average Rating"
          value={averageRating}
          subtitle="Student satisfaction score"
          trend={{ value: 0.3, isPositive: true, label: 'improvement' }}
          icon={Star}
          variant="warning"
          animate
        />
        <MetricCard
          title="Completion Rate"
          value="87%"
          subtitle="Students completing courses"
          trend={{ value: 5.4, isPositive: true, label: 'vs last month' }}
          icon={TrendingUp}
          variant="neutral"
          animate
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Distribution */}
        <PieChartCard
          title="Course Distribution"
          description="Courses by category"
          data={categoryDistribution}
          height={300}
        />

        {/* Enrollment by Level */}
        <BarChartCard
          title="Enrollments by Level"
          description="Student distribution across course difficulty"
          data={enrollmentByLevel}
          xAxisKey="level"
          dataKeys={[{ key: 'enrollments', name: 'Enrollments', color: '#3B8EDE' }]}
          height={300}
        />
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-1 items-center text-sm text-muted-foreground mr-2">
            <span>Category:</span>
          </div>
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-accent"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Level Filter */}
      <div className="flex gap-2 items-center">
        <span className="text-sm text-muted-foreground">Level:</span>
        {levels.map((level) => (
          <Badge
            key={level}
            variant={selectedLevel === level ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-accent"
            onClick={() => setSelectedLevel(level)}
          >
            {level}
          </Badge>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredCourses.length} of {courses.length} courses
      </div>

      {/* Course Grid/List */}
      {filteredCourses.length > 0 ? (
        <div
          className={
            viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'flex flex-col gap-4'
          }
        >
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              variant={viewMode}
              onEnroll={handleEnroll}
              onView={handleViewCourse}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-semibold">No courses found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
}
