import { Category } from './category';
import { PersonType } from './person-type';

export interface ResultPersonType {
   id: string;
   surveyId: string;
   categoryId: string;
   personTypeId: string;
   personType2Id: string;
   description: string | null;
   detail: string | null;
   compatibility: number;
   weaknesses: null;
   strongPoints: null;
   image: string | null;
   createAt: string;
   status: number;
   category: Category;
   personType: PersonType;
   personType2: PersonType;
}
export interface UpdatePersonTypePayload {
   id: string;
   categoryId: string;
   description: string;
   detail: string;
   compatibility: number;
   image: string;
   weaknesses: string;
   strongPoints: string;
}
