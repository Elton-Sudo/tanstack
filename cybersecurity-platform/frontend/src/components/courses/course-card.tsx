import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Star } from 'lucide-react';
import Link from 'next/link';

export interface CourseCardData {
  id: string | number;
  title: string;
  description: string;
  duration: string;
  enrolled: number;
  rating: number;
  level: string;
  category: string;
  imageUrl?: string;
}

interface CourseCardProps {
  course: CourseCardData;
  onEnroll?: (courseId: string | number) => void;
}

export function CourseCard({ course, onEnroll }: CourseCardProps) {
  const handleEnroll = (e: React.MouseEvent) => {
    e.preventDefault();
    onEnroll?.(course.id);
  };

  return (
    <Link href={`/courses/${course.id}`}>
      <Card className="group hover:shadow-lg transition-all cursor-pointer h-full flex flex-col">
        <div
          className="aspect-video bg-gradient-to-br from-brand-blue to-brand-green rounded-t-lg"
          style={
            course.imageUrl
              ? { backgroundImage: `url(${course.imageUrl})`, backgroundSize: 'cover' }
              : {}
          }
        />
        <div className="p-6 space-y-4 flex-1 flex flex-col">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="info">{course.category}</Badge>
              <span className="text-xs text-muted-foreground">{course.level}</span>
            </div>
            <h3 className="text-lg font-semibold group-hover:text-brand-blue transition-colors">
              {course.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {course.description}
            </p>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{course.enrolled}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-brand-orange text-brand-orange" />
              <span>{course.rating}</span>
            </div>
          </div>

          <button
            onClick={handleEnroll}
            className="w-full rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-brand-blue/90"
          >
            Enroll Now
          </button>
        </div>
      </Card>
    </Link>
  );
}
