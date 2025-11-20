'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CheckCircle2, Clock, Route } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function LearningPathDetailPage() {
  const params = useParams();
  const pathId = params.id;

  // Mock data
  const path = {
    id: pathId,
    title: 'Security Fundamentals',
    description: 'Master the basics of cybersecurity with this comprehensive learning path',
    level: 'Beginner',
    duration: '10 hours',
    progress: 60,
    courses: [
      {
        id: 1,
        title: 'Introduction to Cybersecurity',
        duration: '2 hours',
        completed: true,
      },
      {
        id: 2,
        title: 'Password Security',
        duration: '1.5 hours',
        completed: true,
      },
      {
        id: 3,
        title: 'Phishing Awareness',
        duration: '2 hours',
        completed: true,
      },
      {
        id: 4,
        title: 'Data Protection',
        duration: '2.5 hours',
        completed: false,
      },
      {
        id: 5,
        title: 'Security Best Practices',
        duration: '2 hours',
        completed: false,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="rounded-full bg-brand-blue/10 p-4">
                <Route className="h-8 w-8 text-brand-blue" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{path.title}</h1>
                  <Badge variant="default">{path.level}</Badge>
                </div>
                <p className="text-muted-foreground">{path.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{path.courses.length} courses</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{path.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{path.progress}%</span>
            </div>
            <Progress value={path.progress} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Courses in this Path</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {path.courses.map((course, index) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    {course.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-brand-green" />
                    ) : (
                      <span className="font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-muted-foreground">{course.duration}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {course.completed && <Badge variant="success">Completed</Badge>}
                  <Button variant={course.completed ? 'outline' : 'default'} size="sm">
                    {course.completed ? 'Review' : 'Start'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
