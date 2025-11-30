'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MetricCard } from '@/components/visualizations';
import {
  BookOpen,
  Calendar,
  Clock,
  Edit,
  Eye,
  MoreVertical,
  Plus,
  Search,
  TrendingUp,
  UserPlus,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type CourseCategory = 'Security Fundamentals' | 'Compliance' | 'Advanced Security' | 'Leadership';
type CourseStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';

interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  status: CourseStatus;
  duration: number; // in hours
  enrolledUsers: number;
  completedUsers: number;
  averageScore: number;
  completionRate: number;
  isMandatory: boolean;
  deadline?: string;
  createdAt: string;
}

export default function TenantCourseManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  // Mock data - will be replaced with API calls
  const courses: Course[] = [
    {
      id: '1',
      title: 'Cybersecurity Fundamentals',
      description: 'Essential cybersecurity concepts and best practices for all employees',
      category: 'Security Fundamentals',
      status: 'ACTIVE',
      duration: 2.5,
      enrolledUsers: 142,
      completedUsers: 118,
      averageScore: 87.3,
      completionRate: 83.1,
      isMandatory: true,
      deadline: '2024-12-31',
      createdAt: '2023-01-15',
    },
    {
      id: '2',
      title: 'Phishing Detection & Prevention',
      description: 'Learn to identify and prevent phishing attacks',
      category: 'Security Fundamentals',
      status: 'ACTIVE',
      duration: 1.5,
      enrolledUsers: 135,
      completedUsers: 102,
      averageScore: 91.2,
      completionRate: 75.6,
      isMandatory: true,
      deadline: '2024-12-15',
      createdAt: '2023-02-20',
    },
    {
      id: '3',
      title: 'GDPR Compliance Training',
      description: 'Understanding GDPR requirements and implementation',
      category: 'Compliance',
      status: 'ACTIVE',
      duration: 3,
      enrolledUsers: 45,
      completedUsers: 32,
      averageScore: 85.7,
      completionRate: 71.1,
      isMandatory: false,
      createdAt: '2023-03-10',
    },
    {
      id: '4',
      title: 'Advanced Threat Detection',
      description: 'Deep dive into identifying sophisticated cyber threats',
      category: 'Advanced Security',
      status: 'ACTIVE',
      duration: 4,
      enrolledUsers: 28,
      completedUsers: 18,
      averageScore: 92.5,
      completionRate: 64.3,
      isMandatory: false,
      createdAt: '2023-04-05',
    },
    {
      id: '5',
      title: 'Security Leadership',
      description: 'Building and leading effective security teams',
      category: 'Leadership',
      status: 'ACTIVE',
      duration: 5,
      enrolledUsers: 12,
      completedUsers: 9,
      averageScore: 94.1,
      completionRate: 75.0,
      isMandatory: false,
      createdAt: '2023-05-12',
    },
    {
      id: '6',
      title: 'Incident Response Basics',
      description: 'First responder training for security incidents',
      category: 'Security Fundamentals',
      status: 'DRAFT',
      duration: 2,
      enrolledUsers: 0,
      completedUsers: 0,
      averageScore: 0,
      completionRate: 0,
      isMandatory: false,
      createdAt: '2024-11-01',
    },
  ];

  const categories = ['All', ...new Set(courses.map((c) => c.category))];

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      searchQuery === '' ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || course.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || course.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate stats
  const totalCourses = courses.filter((c) => c.status === 'ACTIVE').length;
  const totalEnrollments = courses.reduce((sum, c) => sum + c.enrolledUsers, 0);
  const avgCompletionRate =
    courses.filter((c) => c.status === 'ACTIVE').reduce((sum, c) => sum + c.completionRate, 0) /
    totalCourses;
  const mandatoryCourses = courses.filter((c) => c.isMandatory && c.status === 'ACTIVE').length;

  // Handle course selection
  const toggleCourseSelection = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId],
    );
  };

  const toggleSelectAll = () => {
    if (selectedCourses.length === filteredCourses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(filteredCourses.map((c) => c.id));
    }
  };

  const getStatusColor = (status: CourseStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-brand-green/10 text-brand-green-700 dark:text-brand-green-400';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getCategoryColor = (category: CourseCategory) => {
    switch (category) {
      case 'Security Fundamentals':
        return 'bg-brand-blue/10 text-brand-blue-700 dark:text-brand-blue-400';
      case 'Compliance':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Advanced Security':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'Leadership':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-8 w-8 text-brand-blue" />
            <h1 className="text-3xl font-bold">Course Management</h1>
          </div>
          <p className="text-muted-foreground">
            Manage courses, assign to users, and track learning progress
          </p>
        </div>
        <Button className="bg-brand-blue hover:bg-brand-blue/90">
          <Plus className="mr-2 h-4 w-4" />
          Create Course
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Courses"
          value={totalCourses}
          subtitle={`${mandatoryCourses} mandatory`}
          icon={BookOpen}
          variant="primary"
          animate
        />
        <MetricCard
          title="Total Enrollments"
          value={totalEnrollments}
          subtitle="Across all courses"
          trend={{
            value: 12.5,
            isPositive: true,
            label: 'vs last month',
          }}
          icon={Users}
          variant="success"
          animate
        />
        <MetricCard
          title="Avg Completion"
          value={`${avgCompletionRate.toFixed(1)}%`}
          subtitle="Course completion rate"
          icon={TrendingUp}
          variant="neutral"
          animate
        />
        <MetricCard
          title="Learning Hours"
          value={courses.reduce((sum, c) => sum + c.duration * c.completedUsers, 0).toFixed(0)}
          subtitle="Total hours completed"
          icon={Clock}
          variant="warning"
          animate
        />
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">Category:</Label>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={categoryFilter === category ? 'primary' : 'default'}
                    badgeStyle={categoryFilter === category ? 'solid' : 'outline'}
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => setCategoryFilter(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground">Status:</Label>
            <div className="flex gap-2">
              {['All', 'ACTIVE', 'DRAFT', 'ARCHIVED'].map((status) => (
                <Badge
                  key={status}
                  variant={statusFilter === status ? 'primary' : 'default'}
                  badgeStyle={statusFilter === status ? 'solid' : 'outline'}
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {selectedCourses.length > 0 && (
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground">
                {selectedCourses.length} course(s) selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Assign to Users
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Set Deadline
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className={`hover:shadow-lg transition-shadow ${selectedCourses.includes(course.id) ? 'ring-2 ring-brand-blue' : ''}`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getCategoryColor(course.category)} badgeStyle="outline">
                      {course.category}
                    </Badge>
                    <Badge className={getStatusColor(course.status)} badgeStyle="solid">
                      {course.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                </div>
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(course.id)}
                  onChange={() => toggleCourseSelection(course.id)}
                  className="rounded border-gray-300 mt-1"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>

              {course.isMandatory && (
                <Badge variant="error" badgeStyle="solid">
                  Mandatory
                </Badge>
              )}

              {course.deadline && (
                <div className="flex items-center gap-2 text-sm text-yellow-600">
                  <Calendar className="h-4 w-4" />
                  <span>Deadline: {new Date(course.deadline).toLocaleDateString()}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 py-3 border-y">
                <div>
                  <p className="text-2xl font-bold">{course.enrolledUsers}</p>
                  <p className="text-xs text-muted-foreground">Enrolled</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{course.completedUsers}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completion Rate</span>
                  <span className="font-medium">{course.completionRate.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-blue rounded-full transition-all"
                    style={{ width: `${course.completionRate}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration} hours</span>
                </div>
                {course.status === 'ACTIVE' && (
                  <span className="font-medium">Avg: {course.averageScore.toFixed(1)}%</span>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/manage/courses/${course.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Assign
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold">No courses found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
