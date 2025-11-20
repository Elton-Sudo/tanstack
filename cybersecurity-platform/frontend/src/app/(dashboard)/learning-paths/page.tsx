'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, MapPin, Route } from 'lucide-react';

export default function LearningPathsPage() {
  // Mock data
  const learningPaths = [
    {
      id: 1,
      title: 'Security Fundamentals',
      description: 'Master the basics of cybersecurity',
      courses: 5,
      duration: '10 hours',
      progress: 60,
      level: 'Beginner',
    },
    {
      id: 2,
      title: 'Advanced Threat Detection',
      description: 'Learn advanced security monitoring techniques',
      courses: 7,
      duration: '15 hours',
      progress: 30,
      level: 'Advanced',
    },
    {
      id: 3,
      title: 'Compliance & Governance',
      description: 'Understand regulatory requirements',
      courses: 4,
      duration: '8 hours',
      progress: 0,
      level: 'Intermediate',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Learning Paths</h1>
        <p className="text-muted-foreground">
          Follow structured learning paths to build your cybersecurity expertise
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {learningPaths.map((path) => (
          <Card key={path.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <div className="rounded-full bg-brand-blue/10 p-3">
                  <Route className="h-6 w-6 text-brand-blue" />
                </div>
                <Badge variant="default">{path.level}</Badge>
              </div>
              <CardTitle>{path.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{path.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{path.courses} courses</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{path.duration}</span>
                </div>
              </div>

              {path.progress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{path.progress}%</span>
                  </div>
                  <Progress value={path.progress} />
                </div>
              )}

              <Button className="w-full">
                {path.progress > 0 ? 'Continue' : 'Start Learning'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
