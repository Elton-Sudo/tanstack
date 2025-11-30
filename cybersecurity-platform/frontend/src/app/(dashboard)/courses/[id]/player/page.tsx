'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
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
} from 'lucide-react';
import { use, useState } from 'react';

interface Lesson {
  id: string;
  title: string;
  duration: number; // in minutes
  type: 'video' | 'reading' | 'quiz';
  isCompleted: boolean;
  content?: {
    videoUrl?: string;
    readingContent?: string;
    quizQuestions?: number;
  };
}

interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
  isExpanded: boolean;
}

interface CoursePlayerPageProps {
  params: Promise<{ id: string }>;
}

export default function CoursePlayerPage({ params }: CoursePlayerPageProps) {
  const { id: courseId } = use(params);
  const [selectedLessonId, setSelectedLessonId] = useState('1-1');
  const [showNotes, setShowNotes] = useState(false);
  const [showOutline, setShowOutline] = useState(true);
  const [notes, setNotes] = useState('');
  const [videoProgress, setVideoProgress] = useState(0);

  // Mock course data - will be replaced with API calls
  const courseData = {
    id: courseId,
    title: 'Advanced Threat Detection',
    description: 'Deep dive into identifying sophisticated cyber threats',
    instructor: 'Dr. Sarah Chen',
    totalLessons: 12,
    completedLessons: 8,
    progress: 67,
  };

  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: '1',
      title: 'Introduction to Threat Detection',
      isExpanded: true,
      lessons: [
        {
          id: '1-1',
          title: 'What is Threat Detection?',
          duration: 12,
          type: 'video',
          isCompleted: true,
          content: {
            videoUrl: 'https://example.com/video1.mp4',
          },
        },
        {
          id: '1-2',
          title: 'Types of Cyber Threats',
          duration: 15,
          type: 'video',
          isCompleted: true,
          content: {
            videoUrl: 'https://example.com/video2.mp4',
          },
        },
        {
          id: '1-3',
          title: 'Reading: Threat Landscape Overview',
          duration: 10,
          type: 'reading',
          isCompleted: true,
          content: {
            readingContent: `
# Threat Landscape Overview

The modern threat landscape is constantly evolving. Understanding the various types of threats is crucial for effective detection and prevention.

## Key Threat Categories

1. **Malware**: Malicious software designed to damage or gain unauthorized access
2. **Phishing**: Social engineering attacks via email or messaging
3. **Ransomware**: Malware that encrypts data and demands payment
4. **Advanced Persistent Threats (APTs)**: Long-term targeted attacks
5. **Zero-day Exploits**: Attacks on previously unknown vulnerabilities

## Emerging Threats

- AI-powered attacks
- Supply chain compromises
- IoT vulnerabilities
- Cloud security challenges

Understanding these threats is the first step in building an effective detection strategy.
            `,
          },
        },
        {
          id: '1-4',
          title: 'Quiz: Introduction Assessment',
          duration: 5,
          type: 'quiz',
          isCompleted: false,
          content: {
            quizQuestions: 10,
          },
        },
      ],
    },
    {
      id: '2',
      title: 'Detection Techniques',
      isExpanded: true,
      lessons: [
        {
          id: '2-1',
          title: 'Signature-based Detection',
          duration: 18,
          type: 'video',
          isCompleted: true,
          content: {
            videoUrl: 'https://example.com/video3.mp4',
          },
        },
        {
          id: '2-2',
          title: 'Anomaly-based Detection',
          duration: 20,
          type: 'video',
          isCompleted: true,
          content: {
            videoUrl: 'https://example.com/video4.mp4',
          },
        },
        {
          id: '2-3',
          title: 'Behavioral Analysis Techniques',
          duration: 22,
          type: 'video',
          isCompleted: false,
          content: {
            videoUrl: 'https://example.com/video5.mp4',
          },
        },
      ],
    },
    {
      id: '3',
      title: 'Advanced Topics',
      isExpanded: false,
      lessons: [
        {
          id: '3-1',
          title: 'Machine Learning in Threat Detection',
          duration: 25,
          type: 'video',
          isCompleted: false,
          content: {
            videoUrl: 'https://example.com/video6.mp4',
          },
        },
        {
          id: '3-2',
          title: 'Real-time Threat Intelligence',
          duration: 20,
          type: 'video',
          isCompleted: false,
          content: {
            videoUrl: 'https://example.com/video7.mp4',
          },
        },
      ],
    },
  ]);

  const selectedLesson = chapters.flatMap((c) => c.lessons).find((l) => l.id === selectedLessonId);

  const allLessons = chapters.flatMap((c) => c.lessons);
  const currentLessonIndex = allLessons.findIndex((l) => l.id === selectedLessonId);
  const hasNext = currentLessonIndex < allLessons.length - 1;
  const hasPrevious = currentLessonIndex > 0;

  const toggleChapter = (chapterId: string) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === chapterId ? { ...chapter, isExpanded: !chapter.isExpanded } : chapter,
      ),
    );
  };

  const markLessonComplete = (lessonId: string) => {
    setChapters((prev) =>
      prev.map((chapter) => ({
        ...chapter,
        lessons: chapter.lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, isCompleted: true } : lesson,
        ),
      })),
    );
  };

  const handleNextLesson = () => {
    if (hasNext) {
      const nextLesson = allLessons[currentLessonIndex + 1];
      setSelectedLessonId(nextLesson.id);
      // Mark current lesson as complete
      markLessonComplete(selectedLessonId);
    }
  };

  const handlePreviousLesson = () => {
    if (hasPrevious) {
      const previousLesson = allLessons[currentLessonIndex - 1];
      setSelectedLessonId(previousLesson.id);
    }
  };

  const getLessonIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="h-4 w-4" />;
      case 'reading':
        return <FileText className="h-4 w-4" />;
      case 'quiz':
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const renderLessonContent = () => {
    if (!selectedLesson) return null;

    switch (selectedLesson.type) {
      case 'video':
        return (
          <div className="space-y-4">
            {/* Video Player Placeholder */}
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 to-purple-600/20" />
              <div className="relative z-10 text-center text-white">
                <PlayCircle className="h-24 w-24 mx-auto mb-4 opacity-80" />
                <p className="text-lg font-medium mb-2">Video Player</p>
                <p className="text-sm opacity-80">
                  {selectedLesson.content?.videoUrl || 'No video URL'}
                </p>
                <div className="mt-6">
                  <div className="w-96 mx-auto bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>
                  <p className="text-xs mt-2 opacity-60">
                    {videoProgress}% completed " {selectedLesson.duration} min
                  </p>
                </div>
              </div>
            </div>

            {/* Video Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {selectedLesson.duration} minutes
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVideoProgress(Math.min(100, videoProgress + 10))}
                >
                  Simulate Progress +10%
                </Button>
                {!selectedLesson.isCompleted && videoProgress >= 90 && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => markLessonComplete(selectedLessonId)}
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
                <div
                  className="prose prose-slate dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: selectedLesson.content?.readingContent || 'No content available',
                  }}
                />
              </CardContent>
            </Card>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {selectedLesson.duration} min read
                </span>
              </div>
              {!selectedLesson.isCompleted && (
                <Button
                  onClick={() => markLessonComplete(selectedLessonId)}
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
                <p className="text-muted-foreground mb-4">
                  Test your knowledge with {selectedLesson.content?.quizQuestions} questions
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{selectedLesson.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{selectedLesson.content?.quizQuestions} questions</span>
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

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-6">
      {/* Course Outline Sidebar */}
      {showOutline && (
        <div className="w-96 flex-shrink-0 border-r pr-6 overflow-y-auto">
          <div className="sticky top-0 bg-background pb-4 mb-4 border-b">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h2 className="font-bold text-lg line-clamp-2">{courseData.title}</h2>
                <p className="text-sm text-muted-foreground">{courseData.instructor}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowOutline(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Course Progress</span>
                <span className="font-medium">{courseData.progress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-blue rounded-full transition-all"
                  style={{ width: `${courseData.progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {courseData.completedLessons} of {courseData.totalLessons} lessons completed
              </p>
            </div>
          </div>

          {/* Chapters and Lessons */}
          <div className="space-y-2">
            {chapters.map((chapter) => (
              <div key={chapter.id} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleChapter(chapter.id)}
                  className="w-full flex items-center justify-between p-3 hover:bg-accent transition-colors"
                >
                  <span className="font-medium text-sm">{chapter.title}</span>
                  {chapter.isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {chapter.isExpanded && (
                  <div className="border-t">
                    {chapter.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => setSelectedLessonId(lesson.id)}
                        className={`w-full flex items-start gap-3 p-3 hover:bg-accent transition-colors ${
                          selectedLessonId === lesson.id ? 'bg-accent' : ''
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex-shrink-0 ${
                            lesson.isCompleted ? 'text-brand-green' : 'text-muted-foreground'
                          }`}
                        >
                          {lesson.isCompleted ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            getLessonIcon(lesson.type)
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium line-clamp-2">{lesson.title}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            <span>{lesson.duration} min</span>
                            {lesson.isCompleted && (
                              <Badge variant="success" badgeStyle="outline">
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
        {/* Lesson Header */}
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
              {selectedLesson && getLessonIcon(selectedLesson.type)}
              <h1 className="text-2xl font-bold">{selectedLesson?.title}</h1>
            </div>
            {selectedLesson?.isCompleted && (
              <Badge variant="success" badgeStyle="solid">
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

        {/* Lesson Content */}
        <div className="flex-1 overflow-y-auto">
          <div className={`grid gap-6 ${showNotes ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
            <div>{renderLessonContent()}</div>

            {/* Notes Panel */}
            {showNotes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <StickyNote className="h-5 w-5" />
                    Lesson Notes
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
                    Notes are automatically saved
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t">
          <Button variant="outline" onClick={handlePreviousLesson} disabled={!hasPrevious}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous Lesson
          </Button>

          <div className="text-sm text-muted-foreground">
            Lesson {currentLessonIndex + 1} of {allLessons.length}
          </div>

          <Button
            onClick={handleNextLesson}
            disabled={!hasNext}
            className="bg-brand-blue hover:bg-brand-blue/90"
          >
            Next Lesson
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
