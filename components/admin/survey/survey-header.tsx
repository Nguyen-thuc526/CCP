import { Survey, SurveyQuestionWithAnswers } from "@/types/survey";

interface SurveyHeaderProps {
  surveyData: Survey[];
  surveyQuestions: SurveyQuestionWithAnswers[];
}

export function SurveyHeader({ surveyData, surveyQuestions }: SurveyHeaderProps) {
  const totalQuestions = surveyQuestions.reduce(
    (acc, survey) => acc + survey.questions.length,
    0
  );

  const totalAnswers = surveyQuestions.reduce(
    (acc, survey) =>
      acc + survey.questions.reduce((qAcc, q) => qAcc + q.answers.length, 0),
    0
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hệ Thống Quản Lý Khảo Sát</h1>
          <p className="text-gray-600">
            Quản lý câu hỏi và câu trả lời cho các bài đánh giá tính cách
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{surveyData.length}</div>
            <div className="text-sm text-gray-500">Loại khảo sát</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalQuestions}</div>
            <div className="text-sm text-gray-500">Tổng câu hỏi</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalAnswers}</div>
            <div className="text-sm text-gray-500">Tổng câu trả lời</div>
          </div>
        </div>
      </div>
    </div>
  );
}
