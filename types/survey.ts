export interface Survey {
  id: string;
  name: string;
  descriptione: string;
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
  surveyId: string;
  description: string;
  answers: SurveyAnswer[];
}

export interface PagingResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
  };
  error: string | null;
}


const surveyData: SurveyResponse = {
  success: true,
  data: [
    {
      id: 'SV001',
      name: 'MBTI',
      descriptione: 'Đây là Test tính cách MBTI',
      image: 'https://hris.emsc.vn/wp-content/uploads/2024/06/1704856642750.jpg',
      createAt: '2025-06-23T21:00:00',
      status: 1,
    },
    {
      id: 'SV002',
      name: 'DISC',
      descriptione: 'Chỉ đơn giản là disc',
      image: 'content/uploads/2024/06/1704856642750.jpg',
      createAt: '2025-06-23T21:00:00',
      status: 1,
    },
    {
      id: 'SV003',
      name: 'Love Languages',
      descriptione: 'Chỉ đơn giản là Love Language',
      image: 'content/uploads/2024/06/1704856642750.jpg',
      createAt: '2025-06-23T21:00:00',
      status: 1,
    },
    {
      id: 'SV004',
      name: 'Big Five',
      descriptione: 'Big 5 thôi mờ',
      image: 'content/uploads/2024/06/1704856642750.jpg',
      createAt: '2025-06-23T21:00:00',
      status: 1,
    },
  ],
  error: null,
};