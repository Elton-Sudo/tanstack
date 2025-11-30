'use client';

import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { CoursePlayerSkeleton } from '@/components/skeletons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useCourses } from '@/hooks/use-courses';
import { Chapter, Module } from '@/types/course';
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  FileText,
  List,
  PlayCircle,
  StickyNote,
  X,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { use, useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

interface CoursePlayerPageProps {
  params: Promise<{ id: string }>;
}

interface ExtendedChapter extends Chapter {
  moduleId: string;
  type: 'video' | 'reading' | 'quiz';
  isCompleted: boolean;
}

export default function CoursePlayerPage({ params }: CoursePlayerPageProps) {
  const { id: courseId } = use(params);

  // State management
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [showOutline, setShowOutline] = useState(true);
  const [notes, setNotes] = useState('');
  const [videoProgress, setVideoProgress] = useState(0);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [completedChapters, setCompletedChapters] = useState<Set<string>>(new Set());

  // API hooks
  const { useGetCourse, useGetModules, useMyEnrollments, useUpdateProgress } = useCourses();
  const { data: course, isLoading: courseLoading, isError: courseError } = useGetCourse(courseId);
  const {
    data: modules,
    isLoading: modulesLoading,
    isError: modulesError,
  } = useGetModules(courseId);
  const { data: enrollments } = useMyEnrollments();
  const updateProgressMutation = useUpdateProgress();

  // Find user's enrollment for this course
  const enrollment = useMemo(
    () => enrollments?.find((e) => e.courseId === courseId),
    [enrollments, courseId],
  );

  // Transform modules and chapters
  const transformedModules = useMemo(() => {
    if (!modules) return [];

    return modules.map((module) => ({
      ...module,
      chapters:
        module.chapters?.map((chapter) => ({
          ...chapter,
          moduleId: module.id,
          type: chapter.videoUrl ? 'video' : ('reading' as 'video' | 'reading' | 'quiz'),
          isCompleted: completedChapters.has(chapter.id),
        })) || [],
    }));
  }, [modules, completedChapters]);

  // Get all chapters in a flat list
  const allChapters = useMemo(
    () => transformedModules.flatMap((m) => m.chapters),
    [transformedModules],
  );

  // Find selected chapter
  const selectedChapter = useMemo(
    () => allChapters.find((c) => c.id === selectedChapterId),
    [allChapters, selectedChapterId],
  );

  // Navigation helpers
  const currentChapterIndex = useMemo(
    () => allChapters.findIndex((c) => c.id === selectedChapterId),
    [allChapters, selectedChapterId],
  );
  const hasNext = currentChapterIndex < allChapters.length - 1;
  const hasPrevious = currentChapterIndex > 0;

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    if (allChapters.length === 0) return 0;
    const completed = allChapters.filter((c) => c.isCompleted).length;
    return Math.round((completed / allChapters.length) * 100);
  }, [allChapters]);

  // Load notes from localStorage
  useEffect(() => {
    if (selectedChapterId) {
      const savedNotes = localStorage.getItem(`notes-${courseId}-${selectedChapterId}`);
      setNotes(savedNotes || '');
    }
  }, [selectedChapterId, courseId]);

  // Save notes to localStorage
  useEffect(() => {
    if (selectedChapterId && notes) {
      localStorage.setItem(`notes-${courseId}-${selectedChapterId}`, notes);
    }
  }, [notes, selectedChapterId, courseId]);

  // Load completed chapters from localStorage
  useEffect(() => {
    const savedCompleted = localStorage.getItem(`completed-${courseId}`);
    if (savedCompleted) {
      setCompletedChapters(new Set(JSON.parse(savedCompleted)));
    }
  }, [courseId]);

  // Save completed chapters to localStorage
  useEffect(() => {
    localStorage.setItem(`completed-${courseId}`, JSON.stringify([...completedChapters]));
  }, [completedChapters, courseId]);

  // Auto-select first chapter on load
  useEffect(() => {
    if (allChapters.length > 0 && !selectedChapterId) {
      setSelectedChapterId(allChapters[0].id);
      // Expand first module
      if (transformedModules[0]) {
        setExpandedModules(new Set([transformedModules[0].id]));
      }
    }
  }, [allChapters, selectedChapterId, transformedModules]);

  // Auto-save progress to backend
  useEffect(() => {
    if (enrollment && overallProgress > enrollment.progress) {
      const timeoutId = setTimeout(() => {
        updateProgressMutation.mutate({
          enrollmentId: enrollment.id,
          progress: overallProgress,
        });
      }, 2000); // Debounce by 2 seconds

      return () => clearTimeout(timeoutId);
    }
  }, [overallProgress, enrollment, updateProgressMutation]);

  const toggleModule = useCallback((moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  }, []);

  const markChapterComplete = useCallback((chapterId: string) => {
    setCompletedChapters((prev) => new Set([...prev, chapterId]));
    toast.success('Chapter marked as complete!');
  }, []);

  const handleNextChapter = useCallback(() => {
    if (hasNext) {
      const nextChapter = allChapters[currentChapterIndex + 1];
      setSelectedChapterId(nextChapter.id);
      // Mark current chapter as complete
      if (selectedChapterId) {
        markChapterComplete(selectedChapterId);
      }
      // Expand the module containing the next chapter
      setExpandedModules((prev) => new Set([...prev, nextChapter.moduleId]));
      // Reset video progress
      setVideoProgress(0);
    }
  }, [hasNext, allChapters, currentChapterIndex, selectedChapterId, markChapterComplete]);

  const handlePreviousChapter = useCallback(() => {
    if (hasPrevious) {
      const previousChapter = allChapters[currentChapterIndex - 1];
      setSelectedChapterId(previousChapter.id);
      // Expand the module containing the previous chapter
      setExpandedModules((prev) => new Set([...prev, previousChapter.moduleId]));
      // Reset video progress
      setVideoProgress(0);
    }
  }, [hasPrevious, allChapters, currentChapterIndex]);

  const getLessonIcon = (type: 'video' | 'reading' | 'quiz') => {
    switch (type) {
      case 'video':
        return <PlayCircle className="h-4 w-4" />;
      case 'reading':
        return <FileText className="h-4 w-4" />;
      case 'quiz':
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const renderChapterContent = () => {
    if (!selectedChapter) return null;

    switch (selectedChapter.type) {
      case 'video':
        return (
          <div className="space-y-4">
            {/* Video Player Placeholder */}
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 to-purple-600/20" />
              {selectedChapter.videoUrl ? (
                <video
                  className="w-full h-full"
                  controls
                  src={selectedChapter.videoUrl}
                  onTimeUpdate={(e) => {
                    const video = e.currentTarget;
                    const progress = (video.currentTime / video.duration) * 100;
                    setVideoProgress(Math.round(progress));
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="relative z-10 text-center text-white">
                  <PlayCircle className="h-24 w-24 mx-auto mb-4 opacity-80" />
                  <p className="text-lg font-medium mb-2">Video Player</p>
                  <p className="text-sm opacity-80">No video URL available</p>
                  <div className="mt-6">
                    <div className="w-96 mx-auto bg-white/20 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all"
                        style={{ width: `${videoProgress}%` }}
                      />
                    </div>
                    <p className="text-xs mt-2 opacity-60">
                      {videoProgress}% completed • {selectedChapter.duration || 0} min
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {selectedChapter.duration || 0} minutes
                </span>
              </div>
              <div className="flex gap-2">
                {!selectedChapter.videoUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setVideoProgress(Math.min(100, videoProgress + 10))}
                  >
                    Simulate Progress +10%
                  </Button>
                )}
                {!selectedChapter.isCompleted && videoProgress >= 90 && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => markChapterComplete(selectedChapter.id)}
                    className="bg-brand-green hover:bg-brand-green/90"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          </div>
        );

      case 'reading':
        return (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                {selectedChapter.content ? (
                  <div
                    className="prose prose-slate dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedChapter.content }}
                  />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No content available for this chapter</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {selectedChapter.duration || 0} min read
                </span>
              </div>
              {!selectedChapter.isCompleted && (
                <Button
                  onClick={() => markChapterComplete(selectedChapter.id)}
                  className="bg-brand-green hover:bg-brand-green/90"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Mark as Read
                </Button>
              )}
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-brand-blue" />
                <h3 className="text-xl font-bold mb-2">Assessment Quiz</h3>
                <p className="text-muted-foreground mb-4">Test your knowledge from this module</p>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{selectedChapter.duration || 15} minutes</span>
                  </div>
                </div>
                <Button size="lg" className="bg-brand-blue hover:bg-brand-blue/90">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  if (courseLoading || modulesLoading) {
    return <CoursePlayerSkeleton />;
  }

  if (courseError || modulesError || !course) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Courses', href: '/courses' },
            { label: 'Player', href: `/courses/${courseId}/player` },
          ]}
        />
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load course</h3>
            <p className="text-muted-foreground mb-4">
              There was an error loading the course content. Please try again later.
            </p>
            <Button asChild>
              <Link href="/courses">Back to Courses</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Courses', href: '/courses' },
            { label: course.title, href: `/courses/${courseId}` },
          ]}
        />
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Not Enrolled</h3>
            <p className="text-muted-foreground mb-4">
              You need to enroll in this course before accessing the player.
            </p>
            <Button asChild>
              <Link href={`/courses/${courseId}`}>View Course Details</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: 'Courses', href: '/courses' },
          { label: course.title, href: `/courses/${courseId}` },
          { label: 'Player', href: `/courses/${courseId}/player` },
        ]}
      />

      <div className="flex h-[calc(100vh-8rem)] gap-6">
        {/* Course Outline Sidebar */}
        {showOutline && (
          <div className="w-96 flex-shrink-0 border-r pr-6 overflow-y-auto">
            <div className="sticky top-0 bg-background pb-4 mb-4 border-b">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h2 className="font-bold text-lg line-clamp-2">{course.title}</h2>
                  <p className="text-sm text-muted-foreground">{course.category}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowOutline(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Course Progress</span>
                  <span className="font-medium">{overallProgress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-blue rounded-full transition-all"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {allChapters.filter((c) => c.isCompleted).length} of {allChapters.length} chapters
                  completed
                </p>
              </div>
            </div>

            {/* Modules and Chapters */}
            <div className="space-y-2">
              {transformedModules.map((module, index) => (
                <div key={module.id} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full flex items-center justify-between p-3 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        Module {index + 1}
                      </span>
                      <span className="font-medium text-sm">{module.title}</span>
                    </div>
                    {expandedModules.has(module.id) ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>

                  {expandedModules.has(module.id) && (
                    <div className="border-t">
                      {module.chapters.map((chapter, chapterIndex) => (
                        <button
                          key={chapter.id}
                          onClick={() => setSelectedChapterId(chapter.id)}
                          className={`w-full flex items-start gap-3 p-3 hover:bg-accent transition-colors ${
                            selectedChapterId === chapter.id ? 'bg-accent' : ''
                          }`}
                        >
                          <div
                            className={`mt-0.5 flex-shrink-0 ${
                              chapter.isCompleted ? 'text-brand-green' : 'text-muted-foreground'
                            }`}
                          >
                            {chapter.isCompleted ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              getLessonIcon(chapter.type)
                            )}
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium line-clamp-2">{chapter.title}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <Clock className="h-3 w-3" />
                              <span>{chapter.duration || 0} min</span>
                              {chapter.isCompleted && (
                                <Badge variant="success" className="text-xs">
                                  Completed
                                </Badge>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chapter Header */}
          <div className="flex items-start justify-between pb-4 mb-4 border-b">
            <div className="flex-1">
              {!showOutline && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOutline(true)}
                  className="mb-2"
                >
                  <List className="mr-2 h-4 w-4" />
                  Show Outline
                </Button>
              )}
              <div className="flex items-center gap-3 mb-2">
                {selectedChapter && getLessonIcon(selectedChapter.type)}
                <h1 className="text-2xl font-bold">{selectedChapter?.title}</h1>
              </div>
              {selectedChapter?.isCompleted && (
                <Badge variant="success">
                  <Check className="mr-1 h-3 w-3" />
                  Completed
                </Badge>
              )}
            </div>
            <Button variant="outline" onClick={() => setShowNotes(!showNotes)}>
              <StickyNote className="mr-2 h-4 w-4" />
              {showNotes ? 'Hide Notes' : 'Take Notes'}
            </Button>
          </div>

          {/* Chapter Content */}
          <div className="flex-1 overflow-y-auto">
            <div className={`grid gap-6 ${showNotes ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
              <div>{renderChapterContent()}</div>

              {/* Notes Panel */}
              {showNotes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <StickyNote className="h-5 w-5" />
                      Chapter Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Take notes while learning..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={20}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Notes are automatically saved locally
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t">
            <Button variant="outline" onClick={handlePreviousChapter} disabled={!hasPrevious}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous Chapter
            </Button>

            <div className="text-sm text-muted-foreground">
              Chapter {currentChapterIndex + 1} of {allChapters.length}
            </div>

            <Button
              onClick={handleNextChapter}
              disabled={!hasNext}
              className="bg-brand-blue hover:bg-brand-blue/90"
            >
              Next Chapter
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
