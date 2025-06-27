export interface Survey {
  id: string;
  name: string;
  description: string;
  image: string;
  createAt: string;
  status: number;
}

export interface SurveyResponse {
  success: boolean;
  data: Survey[];
  error: string | null;
}

export interface SurveyAnswer {
  text: string;
  score: number;
  tag: string;
}
export interface SurveyQuestionWithAnswers {
  surveyId: string;
  questions: {
    description: string;
    answers: SurveyAnswer[];
  }[];
}
export interface SurveyQuestion {
  id?: string;
  surveyId: string;
  description: string;
  answers: SurveyAnswer[];
}

export interface PagingResponse<T> {
  success: boolean;
  data: {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
  error: string | null;
}
