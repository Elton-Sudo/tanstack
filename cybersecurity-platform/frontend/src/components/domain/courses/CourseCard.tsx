/**
 * CourseCard Component
 * Reusable card for displaying course information in grid or list view
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { BookOpen, Clock, Star, TrendingUp, Users } from 'lucide-react';
import { FC } from 'react';

export interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  enrolled?: number;
  rating?: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  thumbnail?: string;
  progress?: number;
  instructor?: string;
  tags?: string[];
}

export interface CourseCardProps {
  course: Course;
  variant?: 'grid' | 'list';
  showProgress?: boolean;
  onEnroll?: (courseId: number) => void;
  onView?: (courseId: number) => void;
  className?: string;
}

const levelColors = {
  Beginner: 'bg-brand-green/10 text-brand-green-700 dark:text-brand-green-400',
  Intermediate: 'bg-brand-blue/10 text-brand-blue-700 dark:text-brand-blue-400',
  Advanced: 'bg-brand-orangeRed/10 text-brand-orangeRed-700 dark:text-brand-orangeRed-400',
} as const;

export const CourseCard: FC<CourseCardProps> = ({
  course,
  variant = 'grid',
  showProgress = false,
  onEnroll,
  onView,
  className,
}) => {
  const handleClick = () => {
    if (onView) {
      onView(course.id);
    }
  };

  const handleEnroll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEnroll) {
      onEnroll(course.id);
    }
  };

  if (variant === 'list') {
    return (
      <Card
        className={cn('hover:shadow-lg transition-all cursor-pointer group', className)}
        onClick={handleClick}
      >
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* Thumbnail */}
            <div className="relative flex-shrink-0">
              <div className="w-48 h-32 rounded-lg bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
              {showProgress && course.progress !== undefined && (
                <div className="absolute bottom-2 left-2 right-2">
                  <Progress value={course.progress} className="h-1.5" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="text-xs font-medium bg-brand-blue/10 text-brand-blue-700 dark:text-brand-blue-400">
                      {course.category}
                    </Badge>
                    <Badge className={cn('text-xs font-medium', levelColors[course.level])}>
                      {course.level}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-brand-blue transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {course.description}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                {course.enrolled !== undefined && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.enrolled} enrolled</span>
                  </div>
                )}
                {course.rating !== undefined && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-brand-yellowGold text-brand-yellowGold" />
                    <span>{course.rating}</span>
                  </div>
                )}
                {showProgress && course.progress !== undefined && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>{course.progress}% complete</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {showProgress ? (
                  <Button onClick={handleClick} className="bg-brand-blue hover:bg-brand-blue/90">
                    Continue Learning
                  </Button>
                ) : (
                  <Button onClick={handleEnroll} className="bg-brand-blue hover:bg-brand-blue/90">
                    Enroll Now
                  </Button>
                )}
                <Button variant="outline" onClick={handleClick}>
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid variant (default)
  return (
    <Card
      className={cn(
        'group hover:shadow-lg transition-all cursor-pointer overflow-hidden',
        className,
      )}
      onClick={handleClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center">
        <BookOpen className="h-16 w-16 text-white opacity-80" />
        {showProgress && course.progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0">
            <Progress value={course.progress} className="h-1.5 rounded-none" />
          </div>
        )}
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Badge className="text-xs font-medium bg-brand-blue/10 text-brand-blue-700 dark:text-brand-blue-400">
              {course.category}
            </Badge>
            <Badge className={cn('text-xs font-medium', levelColors[course.level])}>
              {course.level}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold group-hover:text-brand-blue transition-colors line-clamp-2">
            {course.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{course.description}</p>
        </div>

        {/* Progress (if enrolled) */}
        {showProgress && course.progress !== undefined && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          {course.enrolled !== undefined && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{course.enrolled}</span>
            </div>
          )}
          {course.rating !== undefined && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-brand-yellowGold text-brand-yellowGold" />
              <span>{course.rating}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        {showProgress ? (
          <Button onClick={handleClick} className="w-full bg-brand-blue hover:bg-brand-blue/90">
            Continue Learning
          </Button>
        ) : (
          <Button onClick={handleEnroll} className="w-full bg-brand-blue hover:bg-brand-blue/90">
            Enroll Now
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseCard;
