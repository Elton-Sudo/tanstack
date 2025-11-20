'use client';

import { BookOpen, CheckCircle2, Clock, PlayCircle } from 'lucide-react';

export default function MyCoursesPage() {
  // Mock data
  const enrolledCourses = [
    {
      id: 1,
      title: 'Phishing Awareness Training',
      progress: 75,
      lastAccessed: '2 hours ago',
      status: 'In Progress',
      duration: '2 hours',
      completed: 6,
      total: 8,
    },
    {
      id: 2,
      title: 'Password Security Best Practices',
      progress: 100,
      lastAccessed: '1 day ago',
      status: 'Completed',
      duration: '1.5 hours',
      completed: 5,
      total: 5,
    },
    {
      id: 3,
      title: 'Data Protection & Privacy',
      progress: 30,
      lastAccessed: '3 days ago',
      status: 'In Progress',
      duration: '3 hours',
      completed: 3,
      total: 10,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Courses</h1>
        <p className="text-muted-foreground">
          Track your learning progress and continue where you left off
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold">2</p>
            </div>
            <div className="rounded-full bg-brand-blue/10 p-3">
              <PlayCircle className="h-6 w-6 text-brand-blue" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">1</p>
            </div>
            <div className="rounded-full bg-brand-green/10 p-3">
              <CheckCircle2 className="h-6 w-6 text-brand-green" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Hours</p>
              <p className="text-2xl font-bold">4.5</p>
            </div>
            <div className="rounded-full bg-brand-orange/10 p-3">
              <Clock className="h-6 w-6 text-brand-orange" />
            </div>
          </div>
        </div>
      </div>

      {/* Course List */}
      <div className="space-y-4">
        {enrolledCourses.map((course) => (
          <div
            key={course.id}
            className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{course.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>
                          {course.completed}/{course.total} lessons
                        </span>
                      </div>
                      <span>Last accessed {course.lastAccessed}</span>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      course.status === 'Completed'
                        ? 'bg-brand-green/10 text-brand-green'
                        : 'bg-brand-blue/10 text-brand-blue'
                    }`}
                  >
                    {course.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-brand-blue transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <button className="rounded-lg bg-brand-blue px-6 py-2 font-medium text-white hover:bg-brand-blue/90 whitespace-nowrap">
                {course.status === 'Completed' ? 'Review' : 'Continue'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
