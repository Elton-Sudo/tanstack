'use client';

import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useCourses } from '@/hooks/use-courses';
import { Question, Quiz } from '@/types/course';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Clock,
  FileText,
  Home,
  RefreshCw,
  XCircle,
  BookOpen,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { use, useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

type QuizState = 'taking' | 'review' | 'results';

interface Answer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
}

interface CourseQuizPageProps {
  params: Promise<{ id: string }>;
}

export default function CourseQuizPage({ params }: CourseQuizPageProps) {
  const { id: courseId } = use(params);

  // State management
  const [quizState, setQuizState] = useState<QuizState>('taking');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

  // API hooks
  const { useGetCourse, useGetQuizzes, useGetQuiz, useSubmitQuiz, useGetQuizAttempts } =
    useCourses();
  const { data: course } = useGetCourse(courseId);
  const {
    data: quizzes,
    isLoading: quizzesLoading,
    isError: quizzesError,
  } = useGetQuizzes(courseId);
  const { data: quiz, isLoading: quizLoading } = useGetQuiz(selectedQuizId || '', !!selectedQuizId);
  const { data: attempts } = useGetQuizAttempts(selectedQuizId || '', !!selectedQuizId);
  const submitQuizMutation = useSubmitQuiz();

  // Auto-select first quiz if available
  useEffect(() => {
    if (quizzes && quizzes.length > 0 && !selectedQuizId) {
      setSelectedQuizId(quizzes[0].id);
    }
  }, [quizzes, selectedQuizId]);

  // Initialize timer when quiz loads
  useEffect(() => {
    if (quiz?.timeLimit && timeRemaining === 0 && quizState === 'taking') {
      setTimeRemaining(quiz.timeLimit * 60); // Convert minutes to seconds
    }
  }, [quiz, timeRemaining, quizState]);

  // Timer countdown
  useEffect(() => {
    if (quizState !== 'taking' || !quiz) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState, quiz]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = useCallback(
    (answer: string) => {
      if (!quiz?.questions) return;

      const question = quiz.questions[currentQuestion];
      const isCorrect = answer === question.correctAnswer;

      const newAnswer: Answer = {
        questionId: question.id,
        selectedAnswer: answer,
        isCorrect,
      };

      setAnswers((prev) => {
        const filtered = prev.filter((a) => a.questionId !== question.id);
        return [...filtered, newAnswer];
      });
    },
    [quiz, currentQuestion],
  );

  const handleNext = useCallback(() => {
    if (quiz && currentQuestion < quiz.questions!.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setShowExplanation(false);
    }
  }, [quiz, currentQuestion]);

  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setShowExplanation(false);
    }
  }, [currentQuestion]);

  const handleSubmitQuiz = useCallback(async () => {
    if (!quiz) return;

    // Prepare answers in the format expected by the API
    const formattedAnswers = answers.reduce(
      (acc, answer) => {
        acc[answer.questionId] = answer.selectedAnswer;
        return acc;
      },
      {} as Record<string, string>,
    );

    try {
      await submitQuizMutation.mutateAsync({
        quizId: quiz.id,
        answers: formattedAnswers,
      });
      setQuizState('results');
      toast.success('Quiz submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit quiz. Please try again.');
    }
  }, [quiz, answers, submitQuizMutation]);

  const handleReviewAnswers = useCallback(() => {
    setQuizState('review');
    setCurrentQuestion(0);
    setShowExplanation(true);
  }, []);

  const handleRetakeQuiz = useCallback(() => {
    setQuizState('taking');
    setCurrentQuestion(0);
    setAnswers([]);
    setTimeRemaining(quiz?.timeLimit ? quiz.timeLimit * 60 : 0);
    setShowExplanation(false);
  }, [quiz]);

  // Computed values
  const question = quiz?.questions?.[currentQuestion];
  const currentAnswer = question ? answers.find((a) => a.questionId === question.id) : undefined;
  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const scorePercentage = quiz?.questions
    ? Math.round((correctAnswers / quiz.questions.length) * 100)
    : 0;
  const passed = quiz ? scorePercentage >= quiz.passingScore : false;
  const timeTaken = quiz?.timeLimit ? quiz.timeLimit * 60 - timeRemaining : 0;

  // Get answer options for current question
  const getQuestionOptions = (q: Question): string[] => {
    if (!q.options) return [];
    return Object.values(q.options);
  };

  // Loading state
  if (quizzesLoading || quizLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton variant="text" width="30%" height={36} />
        <Card>
          <CardHeader>
            <Skeleton variant="text" width="60%" height={24} />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rectangular" height={60} className="rounded-lg" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (quizzesError || !quizzes || quizzes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Courses', href: '/courses' },
            { label: course?.title || 'Course', href: `/courses/${courseId}` },
            { label: 'Quiz', href: `/courses/${courseId}/quiz` },
          ]}
        />
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Quiz Available</h3>
            <p className="text-muted-foreground mb-4">
              There are no quizzes available for this course yet.
            </p>
            <Button asChild>
              <Link href={`/courses/${courseId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Course
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quiz || !quiz.questions) {
    return null;
  }

  // Results Page
  if (quizState === 'results') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Courses', href: '/courses' },
            { label: course?.title || 'Course', href: `/courses/${courseId}` },
            { label: quiz.title, href: `/courses/${courseId}/quiz` },
          ]}
        />

        {/* Results Header */}
        <Card className="border-2">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                {passed ? (
                  <div className="h-24 w-24 rounded-full bg-brand-green/10 flex items-center justify-center">
                    <Award className="h-12 w-12 text-brand-green" />
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertCircle className="h-12 w-12 text-red-500" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {passed ? 'Congratulations!' : 'Assessment Complete'}
                </h1>
                <p className="text-muted-foreground">
                  {passed
                    ? "You've successfully passed the assessment!"
                    : 'You need to retake the assessment to pass.'}
                </p>
              </div>
              <div className="flex justify-center gap-8 pt-4">
                <div className="text-center">
                  <p className="text-4xl font-bold text-brand-blue">{scorePercentage}%</p>
                  <p className="text-sm text-muted-foreground">Your Score</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold">
                    {correctAnswers}/{quiz.questions.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Correct Answers</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-brand-green" />
                  <span className="font-semibold">Correct</span>
                </div>
                <p className="text-2xl font-bold">{correctAnswers}</p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="font-semibold">Incorrect</span>
                </div>
                <p className="text-2xl font-bold">{quiz.questions.length - correctAnswers}</p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-brand-blue" />
                  <span className="font-semibold">Time Taken</span>
                </div>
                <p className="text-2xl font-bold">{formatTime(timeTaken)}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Passing Score: {quiz.passingScore}%</span>
                <span className={passed ? 'text-brand-green font-medium' : 'text-red-500'}>
                  {passed ? 'Passed' : 'Failed'}
                </span>
              </div>
              <Progress value={scorePercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Attempt History */}
        {attempts && attempts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Previous Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {attempts.slice(0, 5).map((attempt, index) => (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        Attempt {attempts.length - index}
                      </span>
                      <Badge variant={attempt.isPassing ? 'success' : 'error'}>
                        {attempt.isPassing ? 'Passed' : 'Failed'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">{attempt.score}%</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(attempt.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href={`/courses/${courseId}`}>
              <Home className="mr-2 h-4 w-4" />
              Back to Course
            </Link>
          </Button>
          <Button onClick={handleReviewAnswers}>
            <FileText className="mr-2 h-4 w-4" />
            Review Answers
          </Button>
          {!passed && (
            <Button onClick={handleRetakeQuiz} className="bg-brand-blue hover:bg-brand-blue/90">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retake Quiz
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Quiz Taking/Review Page
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Courses', href: '/courses' },
          { label: course?.title || 'Course', href: `/courses/${courseId}` },
          { label: quiz.title, href: `/courses/${courseId}/quiz` },
        ]}
      />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
          <p className="text-muted-foreground">{quiz.description}</p>
        </div>
        {quizState === 'taking' && quiz.timeLimit && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-card">
            <Clock
              className={`h-5 w-5 ${timeRemaining < 300 ? 'text-red-500' : 'text-brand-blue'}`}
            />
            <span
              className={`font-mono text-lg font-semibold ${timeRemaining < 300 ? 'text-red-500' : ''}`}
            >
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
          <span className="text-muted-foreground">
            {answers.length} of {quiz.questions.length} answered
          </span>
        </div>
        <Progress value={((currentQuestion + 1) / quiz.questions.length) * 100} className="h-2" />
      </div>

      {/* Question Card */}
      {question && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-xl">
                {currentQuestion + 1}. {question.question}
              </CardTitle>
              {currentAnswer && quizState === 'review' && (
                <Badge variant={currentAnswer.isCorrect ? 'success' : 'error'}>
                  {currentAnswer.isCorrect ? 'Correct' : 'Incorrect'}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Answer Options */}
            <div className="space-y-3">
              {getQuestionOptions(question).map((option, index) => {
                const isSelected = currentAnswer?.selectedAnswer === option;
                const isCorrect = option === question.correctAnswer;
                const showFeedback = quizState === 'review';

                let buttonClass = 'w-full text-left p-4 rounded-lg border-2 transition-all ';
                if (showFeedback) {
                  if (isCorrect) {
                    buttonClass += 'border-brand-green bg-brand-green/5 ';
                  } else if (isSelected && !isCorrect) {
                    buttonClass += 'border-red-500 bg-red-50 dark:bg-red-950/20 ';
                  } else {
                    buttonClass += 'border-border ';
                  }
                } else {
                  if (isSelected) {
                    buttonClass += 'border-brand-blue bg-brand-blue/10 ';
                  } else {
                    buttonClass += 'border-border hover:border-brand-blue/50 hover:bg-accent ';
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => quizState === 'taking' && handleAnswerSelect(option)}
                    disabled={quizState === 'review'}
                    className={buttonClass}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={`h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            showFeedback && isCorrect
                              ? 'border-brand-green bg-brand-green'
                              : showFeedback && isSelected && !isCorrect
                                ? 'border-red-500 bg-red-500'
                                : isSelected
                                  ? 'border-brand-blue bg-brand-blue'
                                  : 'border-muted-foreground'
                          }`}
                        >
                          {showFeedback && isCorrect ? (
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          ) : showFeedback && isSelected && !isCorrect ? (
                            <XCircle className="h-4 w-4 text-white" />
                          ) : isSelected ? (
                            <div className="h-3 w-3 rounded-full bg-white" />
                          ) : null}
                        </div>
                        <span className="text-sm">{option}</span>
                      </div>
                      {showFeedback && isCorrect && (
                        <CheckCircle2 className="h-5 w-5 text-brand-green" />
                      )}
                      {showFeedback && isSelected && !isCorrect && (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation (Review Mode) */}
            {quizState === 'review' && showExplanation && question.explanation && (
              <div className="rounded-lg border-2 border-brand-blue/20 bg-brand-blue/5 p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-brand-blue flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm mb-1">Explanation</p>
                    <p className="text-sm text-muted-foreground">{question.explanation}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                Previous
              </Button>

              <div className="flex gap-2">
                {quizState === 'review' && (
                  <Button variant="outline" onClick={() => setQuizState('results')}>
                    Back to Results
                  </Button>
                )}
                {quizState === 'taking' && currentQuestion === quiz.questions.length - 1 ? (
                  <Button
                    onClick={handleSubmitQuiz}
                    disabled={
                      answers.length !== quiz.questions.length || submitQuizMutation.isPending
                    }
                    className="bg-brand-blue hover:bg-brand-blue/90"
                  >
                    {submitQuizMutation.isPending ? 'Submitting...' : 'Submit Quiz'}
                  </Button>
                ) : (
                  <Button onClick={handleNext} disabled={quizState === 'taking' && !currentAnswer}>
                    Next Question
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Question Navigator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Question Navigator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {quiz.questions.map((q, index) => {
              const answer = answers.find((a) => a.questionId === q.id);
              const isAnswered = !!answer;
              const isCurrent = index === currentQuestion;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(index)}
                  className={`h-10 w-10 rounded-lg border-2 font-semibold text-sm transition-all ${
                    isCurrent
                      ? 'border-brand-blue bg-brand-blue text-white'
                      : isAnswered
                        ? quizState === 'review' && answer.isCorrect
                          ? 'border-brand-green bg-brand-green/10 text-brand-green'
                          : quizState === 'review' && !answer.isCorrect
                            ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-500'
                            : 'border-brand-blue/50 bg-brand-blue/10'
                        : 'border-border hover:border-brand-blue/50'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
