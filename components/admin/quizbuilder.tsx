 "use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus } from "lucide-react";

// Type definitions ngay tại đây
type Answer = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type Question = {
  id: string;
  text: string;
  answers: Answer[];
};

type QuizBuilderProps = {
  quiz: Question[];
  setQuiz: (quiz: Question[]) => void;
};

export default function QuizBuilder({ quiz, setQuiz }: QuizBuilderProps) {
  const addQuestion = () => {
    setQuiz([
      ...quiz,
      {
        id: uuidv4(),
        text: "",
        answers: [{ id: uuidv4(), text: "", isCorrect: false }],
      },
    ]);
  };

  const updateQuestion = (index: number, updated: Question) => {
    const updatedQuiz = [...quiz];
    updatedQuiz[index] = updated;
    setQuiz(updatedQuiz);
  };

  const removeQuestion = (index: number) => {
    const updatedQuiz = [...quiz];
    updatedQuiz.splice(index, 1);
    setQuiz(updatedQuiz);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bộ câu hỏi (Quiz)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {quiz.map((question, qIdx) => (
          <div key={question.id} className="space-y-4 border p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <Label htmlFor={`question-${question.id}`}>Câu hỏi {qIdx + 1}</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeQuestion(qIdx)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <Input
              id={`question-${question.id}`}
              placeholder="Nhập nội dung câu hỏi"
              value={question.text}
              onChange={(e) =>
                updateQuestion(qIdx, { ...question, text: e.target.value })
              }
            />

            <div className="space-y-2">
              {question.answers.map((answer, aIdx) => (
                <div key={answer.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={answer.isCorrect}
                    onCheckedChange={(val) => {
                      const updatedAnswers = [...question.answers];
                      updatedAnswers[aIdx] = {
                        ...updatedAnswers[aIdx],
                        isCorrect: !!val,
                      };
                      updateQuestion(qIdx, { ...question, answers: updatedAnswers });
                    }}
                  />
                  <Input
                    placeholder={`Nhập đáp án ${aIdx + 1}`}
                    value={answer.text}
                    onChange={(e) => {
                      const updatedAnswers = [...question.answers];
                      updatedAnswers[aIdx] = {
                        ...updatedAnswers[aIdx],
                        text: e.target.value,
                      };
                      updateQuestion(qIdx, { ...question, answers: updatedAnswers });
                    }}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => {
                      if (question.answers.length > 1) {
                        const updatedAnswers = [...question.answers];
                        updatedAnswers.splice(aIdx, 1);
                        updateQuestion(qIdx, { ...question, answers: updatedAnswers });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateQuestion(qIdx, {
                    ...question,
                    answers: [
                      ...question.answers,
                      { id: uuidv4(), text: "", isCorrect: false },
                    ],
                  })
                }
              >
                <Plus className="w-4 h-4 mr-1" />
                Thêm đáp án
              </Button>
            </div>
          </div>
        ))}

        <Button onClick={addQuestion}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm câu hỏi
        </Button>
      </CardContent>
    </Card>
  );
}

// Hàm validate quiz
export const isQuizValid = (quiz: Question[]) =>
  quiz.every(
    (q) =>
      q.text.trim() &&
      q.answers.length > 0 &&
      q.answers.some((a) => a.isCorrect)
  );
