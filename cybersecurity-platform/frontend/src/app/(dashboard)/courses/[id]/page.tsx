'use client';

import { CourseCard } from '@/components/domain/courses/CourseCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Play,
  Star,
  Target,
  Users,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

type Tab = 'overview' | 'curriculum' | 'reviews' | 'resources';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id;
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Mock data - will be replaced with API call
  const course = {
    id: courseId,
    title: 'Phishing Awareness Training',
    description:
      'Learn to identify and prevent phishing attacks. This comprehensive course covers the latest phishing techniques, red flags to watch for, and best practices for staying safe online.',
    duration: '2 hours',
    enrolled: 245,
    rating: 4.8,
    level: 'Beginner' as const,
    category: 'Email Security',
    instructor: {
      name: 'Dr. Sarah Johnson',
      title: 'Security Expert & Certified Ethical Hacker',
      bio: '15+ years of experience in cybersecurity training and awareness. Former CISO at Fortune 500 companies.',
      courses: 12,
      students: 15000,
    },
    modules: [
      { id: 1, title: 'Introduction to Phishing', duration: '15 min', completed: true },
      { id: 2, title: 'Types of Phishing Attacks', duration: '25 min', completed: true },
      { id: 3, title: 'Identifying Phishing Emails', duration: '30 min', completed: false },
      { id: 4, title: 'Best Practices', duration: '20 min', completed: false },
      { id: 5, title: 'Quiz & Assessment', duration: '30 min', completed: false },
    ],
    progress: 40,
    prerequisites: [
      'Basic understanding of email systems',
      'Familiarity with web browsers',
      'No prior security knowledge required',
    ],
    learningObjectives: [
      'Identify different types of phishing attacks',
      'Recognize red flags in suspicious emails',
      'Implement best practices for email security',
      'Report phishing attempts effectively',
      'Protect personal and organizational data',
    ],
    reviews: [
      {
        id: 1,
        author: 'John Doe',
        rating: 5,
        date: '2024-01-15',
        comment: 'Excellent course! Very practical and easy to understand.',
      },
      {
        id: 2,
        author: 'Jane Smith',
        rating: 4,
        date: '2024-01-10',
        comment: 'Great content, would love more real-world examples.',
      },
      {
        id: 3,
        author: 'Mike Johnson',
        rating: 5,
        date: '2024-01-05',
        comment: 'Must-take course for anyone handling sensitive information.',
      },
    ],
    resources: [
      { id: 1, title: 'Phishing Examples PDF', type: 'PDF', size: '2.5 MB' },
      { id: 2, title: 'Email Security Checklist', type: 'PDF', size: '500 KB' },
      { id: 3, title: 'Reporting Template', type: 'DOCX', size: '120 KB' },
    ],
  };

  const relatedCourses = [
    {
      id: 2,
      title: 'Password Security Best Practices',
      description: 'Master the art of creating and managing secure passwords',
      duration: '1.5 hours',
      enrolled: 189,
      rating: 4.6,
      level: 'Beginner' as const,
      category: 'Authentication',
    },
    {
      id: 3,
      title: 'Social Engineering Defense',
      description: 'Protect yourself and your organization from social engineering',
      duration: '2.5 hours',
      enrolled: 178,
      rating: 4.5,
      level: 'Intermediate' as const,
      category: 'Social Engineering',
    },
  ];

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'curriculum' as const, label: 'Curriculum' },
    { id: 'reviews' as const, label: 'Reviews' },
    { id: 'resources' as const, label: 'Resources' },
  ];

  return (
    <div className="space-y-6">
      {/* Course Hero Section */}
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-6 lg:flex-row p-6">
          <div className="aspect-video w-full lg:w-2/5 rounded-lg bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center">
            <Play className="h-24 w-24 text-white opacity-80" />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-brand-blue/10 text-brand-blue-700 dark:text-brand-blue-400">
                  {course.category}
                </Badge>
                <Badge variant="outline">{course.level}</Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-muted-foreground">{course.description}</p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{course.enrolled} students</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-brand-yellowGold text-brand-yellowGold" />
                <span>{course.rating} rating</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{course.modules.length} modules</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Your Progress</span>
                <span className="font-medium">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>

            <div className="flex gap-2">
              <Button className="bg-brand-blue hover:bg-brand-blue/90">
                <Play className="mr-2 h-4 w-4" />
                Continue Learning
              </Button>
              <Button variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Course Materials
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <div className="border-b">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* What You'll Learn */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-brand-blue" />
                    What You'll Learn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-3 md:grid-cols-2">
                    {course.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-brand-green flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Prerequisites */}
              <Card>
                <CardHeader>
                  <CardTitle>Prerequisites</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {course.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-brand-blue">•</span>
                        <span>{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Description</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <p className="text-sm text-muted-foreground">
                    This comprehensive course provides essential knowledge about phishing attacks
                    and how to protect yourself and your organization. You'll learn to identify
                    various types of phishing attempts, understand the psychology behind social
                    engineering, and implement best practices for email security.
                  </p>
                  <p className="text-sm text-muted-foreground mt-4">
                    Through practical examples and real-world scenarios, you'll develop the skills
                    needed to recognize and respond to phishing threats effectively. The course
                    includes interactive quizzes and assessments to reinforce your learning.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <Card>
              <CardHeader>
                <CardTitle>Course Curriculum</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {course.modules.map((module, index) => (
                    <div
                      key={module.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          {module.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-brand-green" />
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{module.title}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {module.duration}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {module.completed && (
                          <Badge className="bg-brand-green/10 text-brand-green-700 dark:text-brand-green-400">
                            Completed
                          </Badge>
                        )}
                        <Play className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'reviews' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Student Reviews</CardTitle>
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-brand-yellowGold text-brand-yellowGold" />
                    <span className="font-semibold">{course.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({course.reviews.length} reviews)
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {course.reviews.map((review) => (
                  <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{review.author}</p>
                        <p className="text-xs text-muted-foreground">{review.date}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-brand-yellowGold text-brand-yellowGold"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === 'resources' && (
            <Card>
              <CardHeader>
                <CardTitle>Course Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {course.resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-brand-blue" />
                        <div>
                          <p className="font-medium text-sm">{resource.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {resource.type} • {resource.size}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Instructor Card */}
          <Card>
            <CardHeader>
              <CardTitle>Instructor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold text-xl">
                  {course.instructor.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <p className="font-semibold">{course.instructor.name}</p>
                  <p className="text-xs text-muted-foreground">{course.instructor.title}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{course.instructor.bio}</p>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <p className="text-2xl font-bold">{course.instructor.courses}</p>
                  <p className="text-xs text-muted-foreground">Courses</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {(course.instructor.students / 1000).toFixed(1)}K
                  </p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certificate Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-brand-yellowGold" />
                Certificate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Complete all modules and pass the quiz to earn your certificate of completion.
              </p>
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                View Requirements
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Courses */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Related Courses</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {relatedCourses.map((relatedCourse) => (
            <CourseCard
              key={relatedCourse.id}
              course={relatedCourse}
              variant="grid"
              onView={() => (window.location.href = `/courses/${relatedCourse.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
