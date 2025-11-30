'use client';

import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { CourseCatalogSkeleton } from '@/components/skeletons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCourses } from '@/hooks/use-courses';
import { Difficulty } from '@/types/enums';
import {
  BookOpen,
  Clock,
  Grid,
  List,
  Search,
  Star,
  TrendingUp,
  Users,
  Filter,
  Play,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const categories = [
  'All',
  'Email Security',
  'Authentication',
  'Compliance',
  'Incident Response',
  'Social Engineering',
  'Data Protection',
  'Network Security',
];

const difficulties = ['All', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

export default function CoursesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Build filters for API
  const filters = useMemo(
    () => ({
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
      difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
      search: searchQuery || undefined,
      status: 'PUBLISHED', // Only show published courses
    }),
    [selectedCategory, selectedDifficulty, searchQuery],
  );

  // Fetch courses with filters
  const { useGetCourses, useEnrollCourse } = useCourses();
  const { data: courses, isLoading, isError } = useGetCourses(filters);
  const enrollMutation = useEnrollCourse();

  // Filter courses client-side for search
  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    let filtered = courses;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query) ||
          course.category.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [courses, searchQuery]);

  const handleEnroll = async (courseId: string) => {
    try {
      await enrollMutation.mutateAsync(courseId);
      toast.success('Successfully enrolled in course!');
    } catch (error) {
      toast.error('Failed to enroll in course');
    }
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'ADVANCED':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
    }
  };

  const getDifficultyLabel = (difficulty: Difficulty) => {
    return difficulty.charAt(0) + difficulty.slice(1).toLowerCase();
  };

  if (isLoading) {
    return <CourseCatalogSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground">Browse our comprehensive course catalog</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Failed to load courses. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Courses', href: '/courses' }]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-brand-blue" />
            Course Catalog
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse {filteredCourses.length} available courses
          </p>
        </div>

        {/* View Toggle */}
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

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Filter className="h-5 w-5 text-muted-foreground self-center" />

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex gap-2">
            {difficulties.map((difficulty) => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty(difficulty)}
              >
                {difficulty === 'All' ? 'All Levels' : getDifficultyLabel(difficulty as Difficulty)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Grid/List */}
      {filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory('All');
                setSelectedDifficulty('All');
                setSearchQuery('');
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div
          className={
            viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'flex flex-col gap-4'
          }
        >
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="hover:shadow-lg transition-shadow overflow-hidden group"
            >
              {/* Course Thumbnail */}
              {course.thumbnail ? (
                <div className="relative h-48 bg-gradient-to-br from-brand-blue to-brand-green overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              ) : (
                <div className="relative h-48 bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center">
                  <BookOpen className="h-20 w-20 text-white/80" />
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant="default" className="shrink-0">
                    {course.category}
                  </Badge>
                  <Badge className={getDifficultyColor(course.difficulty)}>
                    {getDifficultyLabel(course.difficulty)}
                  </Badge>
                </div>
                <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Course Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>4.8</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>245</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href={`/courses/${course.id}`}>
                      <Play className="mr-2 h-4 w-4" />
                      View Course
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrollMutation.isPending}
                  >
                    {enrollMutation.isPending ? 'Enrolling...' : 'Enroll'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      {filteredCourses.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredCourses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(filteredCourses.map((c) => c.category)).size}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  filteredCourses.reduce((acc, c) => acc + c.duration, 0) / filteredCourses.length,
                )}{' '}
                min
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
