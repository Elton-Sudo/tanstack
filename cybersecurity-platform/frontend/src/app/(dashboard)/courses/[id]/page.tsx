'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award, BookOpen, Clock, FileText, Play, Star, Users } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id;

  // Mock data - will be replaced with API call
  const course = {
    id: courseId,
    title: 'Phishing Awareness Training',
    description:
      'Learn to identify and prevent phishing attacks. This comprehensive course covers the latest phishing techniques, red flags to watch for, and best practices for staying safe online.',
    duration: '2 hours',
    enrolled: 245,
    rating: 4.8,
    level: 'Beginner',
    category: 'Email Security',
    instructor: 'Dr. Sarah Johnson',
    modules: [
      { id: 1, title: 'Introduction to Phishing', duration: '15 min', completed: true },
      { id: 2, title: 'Types of Phishing Attacks', duration: '25 min', completed: true },
      { id: 3, title: 'Identifying Phishing Emails', duration: '30 min', completed: false },
      { id: 4, title: 'Best Practices', duration: '20 min', completed: false },
      { id: 5, title: 'Quiz & Assessment', duration: '30 min', completed: false },
    ],
    progress: 40,
  };

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="aspect-video w-full lg:w-1/3 rounded-lg bg-gradient-to-br from-brand-blue to-brand-green" />

          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="info">{course.category}</Badge>
                <Badge variant="default">{course.level}</Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-muted-foreground">{course.description}</p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{course.enrolled} enrolled</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-brand-orange text-brand-orange" />
                <span>{course.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="h-4 w-4" />
                <span>{course.modules.length} modules</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Your Progress</span>
                <span className="font-medium">{course.progress}%</span>
              </div>
              <Progress value={course.progress} />
            </div>

            <Button className="w-full lg:w-auto">
              <Play className="mr-2 h-4 w-4" />
              Continue Learning
            </Button>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {course.modules.map((module, index) => (
                  <div
                    key={module.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        {module.completed ? (
                          <Award className="h-4 w-4 text-brand-green" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{module.title}</p>
                        <p className="text-sm text-muted-foreground">{module.duration}</p>
                      </div>
                    </div>
                    {module.completed && <Badge variant="success">Completed</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold">
                  SJ
                </div>
                <div>
                  <p className="font-medium">{course.instructor}</p>
                  <p className="text-sm text-muted-foreground">Security Expert</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Certificate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Complete all modules and pass the quiz to earn your certificate.
              </p>
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                View Certificate Requirements
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
