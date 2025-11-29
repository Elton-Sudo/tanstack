'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Award, CheckCircle2, Clock, Home, RefreshCw, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

type QuizState = 'taking' | 'review' | 'results';

interface Answer {
  questionId: number;
  selectedOption: number;
  isCorrect: boolean;
}

export default function CourseQuizPage() {
  const [quizState, setQuizState] = useState<QuizState>('taking');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes in seconds
  const [showExplanation, setShowExplanation] = useState(false);

  // Mock quiz data
  const quiz = {
    title: 'Phishing Awareness Assessment',
    description: 'Test your knowledge of phishing attacks and email security',
    timeLimit: 1800, // 30 minutes
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: 'What is the primary goal of a phishing attack?',
        options: [
          'To steal personal information or credentials',
          'To improve email security systems',
          'To test network connection speed',
          'To automatically update software',
        ],
        correctAnswer: 0,
        explanation:
          'Phishing attacks aim to trick victims into revealing sensitive information such as passwords, credit card numbers, or personal data.',
      },
      {
        id: 2,
        question: 'Which of the following is a common sign of a phishing email?',
        options: [
          'Professional formatting and company branding',
          'Urgent requests for immediate action',
          'Personalized greeting with your name',
          'Links to official company websites',
        ],
        correctAnswer: 1,
        explanation:
          'Phishing emails often create a sense of urgency to pressure victims into acting quickly without thinking carefully.',
      },
      {
        id: 3,
        question: 'What should you do if you receive a suspicious email?',
        options: [
          'Click the link to verify it',
          'Reply asking if it is legitimate',
          'Report it to your IT security team',
          'Forward it to your colleagues',
        ],
        correctAnswer: 2,
        explanation:
          'Always report suspicious emails to your IT security team. Never click links or reply to potential phishing attempts.',
      },
      {
        id: 4,
        question: 'What is spear phishing?',
        options: [
          'A type of fishing sport',
          'Phishing targeting specific individuals or organizations',
          'Phishing using voice calls only',
          'Automated mass email campaigns',
        ],
        correctAnswer: 1,
        explanation:
          'Spear phishing is a targeted attack aimed at specific individuals or organizations, often using personalized information.',
      },
      {
        id: 5,
        question: 'Which domain is most likely to be legitimate for a bank email?',
        options: [
          'secure-bank-verify.com',
          'bank-security-alert.net',
          'officialbank.com',
          'www.bankname.com',
        ],
        correctAnswer: 3,
        explanation:
          'Legitimate organizations use their official domain names. Be wary of similar-looking domains with extra words or different extensions.',
      },
    ],
  };

  // Timer countdown
  useEffect(() => {
    if (quizState !== 'taking') return;

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
  }, [quizState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionIndex: number) => {
    const question = quiz.questions[currentQuestion];
    const isCorrect = optionIndex === question.correctAnswer;

    const newAnswer: Answer = {
      questionId: question.id,
      selectedOption: optionIndex,
      isCorrect,
    };

    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== question.id);
      return [...filtered, newAnswer];
    });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmitQuiz = () => {
    setQuizState('results');
  };

  const handleReviewAnswers = () => {
    setQuizState('review');
    setCurrentQuestion(0);
    setShowExplanation(true);
  };

  const handleRetakeQuiz = () => {
    setQuizState('taking');
    setCurrentQuestion(0);
    setAnswers([]);
    setTimeRemaining(quiz.timeLimit);
    setShowExplanation(false);
  };

  const question = quiz.questions[currentQuestion];
  const currentAnswer = answers.find((a) => a.questionId === question.id);
  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const scorePercentage = Math.round((correctAnswers / quiz.questions.length) * 100);
  const passed = scorePercentage >= quiz.passingScore;

  // Results Page
  if (quizState === 'results') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
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
                  <div className="h-24 w-24 rounded-full bg-brand-orangeRed/10 flex items-center justify-center">
                    <AlertCircle className="h-12 w-12 text-brand-orangeRed" />
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
                  <XCircle className="h-5 w-5 text-brand-red" />
                  <span className="font-semibold">Incorrect</span>
                </div>
                <p className="text-2xl font-bold">{quiz.questions.length - correctAnswers}</p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-brand-blue" />
                  <span className="font-semibold">Time Taken</span>
                </div>
                <p className="text-2xl font-bold">{formatTime(quiz.timeLimit - timeRemaining)}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Passing Score: {quiz.passingScore}%</span>
                <span className={passed ? 'text-brand-green font-medium' : 'text-brand-red'}>
                  {passed ? 'Passed' : 'Failed'}
                </span>
              </div>
              <Progress value={scorePercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => (window.location.href = '/courses')}>
            <Home className="mr-2 h-4 w-4" />
            Back to Courses
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
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
          <p className="text-muted-foreground">{quiz.description}</p>
        </div>
        {quizState === 'taking' && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-card">
            <Clock
              className={`h-5 w-5 ${timeRemaining < 300 ? 'text-brand-red' : 'text-brand-blue'}`}
            />
            <span
              className={`font-mono text-lg font-semibold ${timeRemaining < 300 ? 'text-brand-red' : ''}`}
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
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl">
              {currentQuestion + 1}. {question.question}
            </CardTitle>
            {currentAnswer && quizState === 'review' && (
              <Badge
                className={
                  currentAnswer.isCorrect
                    ? 'bg-brand-green/10 text-brand-green-700'
                    : 'bg-brand-red/10 text-brand-red-700'
                }
              >
                {currentAnswer.isCorrect ? 'Correct' : 'Incorrect'}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Answer Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = currentAnswer?.selectedOption === index;
              const isCorrect = index === question.correctAnswer;
              const showFeedback = quizState === 'review';

              let buttonClass = 'w-full text-left p-4 rounded-lg border-2 transition-all ';
              if (showFeedback) {
                if (isCorrect) {
                  buttonClass += 'border-brand-green bg-brand-green/5 ';
                } else if (isSelected && !isCorrect) {
                  buttonClass += 'border-brand-red bg-brand-red/5 ';
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
                  onClick={() => quizState === 'taking' && handleAnswerSelect(index)}
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
                              ? 'border-brand-red bg-brand-red'
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
                      <XCircle className="h-5 w-5 text-brand-red" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation (Review Mode) */}
          {quizState === 'review' && showExplanation && (
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
                  disabled={answers.length !== quiz.questions.length}
                  className="bg-brand-blue hover:bg-brand-blue/90"
                >
                  Submit Quiz
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
                            ? 'border-brand-red bg-brand-red/10 text-brand-red'
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
