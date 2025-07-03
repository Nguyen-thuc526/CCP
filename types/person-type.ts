import { Category } from './category';

export interface PersonType {
   id: string;
   name: string;
   description: string;
   detail: string;
   image: string;
   surveyId: string;
   categoryId: string;
   category: Category;
}

export interface UpdatePersonTypePayload {
   id: string;
   description: string;
   detail: string;
   image: string;
   categoryId: string;
}

export interface CreatePersonTypePayload {
   name: string;
   description: string;
   detail: string;
   image: string;
   surveyId: string;
   categoryId: string;
}
