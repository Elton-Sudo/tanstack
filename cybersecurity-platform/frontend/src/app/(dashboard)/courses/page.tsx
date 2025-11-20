'use client';

import { Clock, Star, Users } from 'lucide-react';

export default function CoursesPage() {
  // Mock data
  const courses = [
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
  ];

  const categories = ['All', 'Email Security', 'Authentication', 'Compliance', 'Incident Response'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Course Catalog</h1>
          <p className="text-muted-foreground">
            Explore our comprehensive cybersecurity training courses
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="search"
            placeholder="Search courses..."
            className="w-full md:w-64 rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            className="whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="group rounded-lg border bg-card hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="aspect-video bg-gradient-to-br from-brand-blue to-brand-green rounded-t-lg" />
            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-brand-blue bg-brand-blue/10 px-2 py-1 rounded">
                    {course.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{course.level}</span>
                </div>
                <h3 className="text-lg font-semibold group-hover:text-brand-blue transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">{course.description}</p>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
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

              <button className="w-full rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-brand-blue/90">
                Enroll Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
