'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

export default function CourseQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Mock quiz data
  const quiz = {
    title: 'Phishing Awareness Quiz',
    questions: [
      {
        id: 1,
        question: 'What is the primary goal of a phishing attack?',
        options: [
          'To steal personal information',
          'To improve email security',
          'To test network speed',
          'To update software',
        ],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: 'Which of the following is a common sign of a phishing email?',
        options: [
          'Professional formatting',
          'Urgent requests for action',
          'Company logo',
          'Proper grammar',
        ],
        correctAnswer: 1,
      },
    ],
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
    }
  };

  const question = quiz.questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
        <div className="flex items-center gap-2">
          <Badge variant="info">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  selectedAnswer === index
                    ? 'border-brand-blue bg-brand-blue/10'
                    : 'border-border hover:border-brand-blue/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index
                        ? 'border-brand-blue bg-brand-blue'
                        : 'border-muted-foreground'
                    }`}
                  >
                    {selectedAnswer === index && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
              Previous
            </Button>
            <Button onClick={handleNext} disabled={selectedAnswer === null}>
              {currentQuestion === quiz.questions.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
