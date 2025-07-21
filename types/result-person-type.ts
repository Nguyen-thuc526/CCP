import { Category } from "./category";
import { PersonType } from "./person-type";

export interface ResultPersonType {
    id: string;
    surveyId: string;
    categoryId: string;
    personTypeId: string;
    personType2Id: string;
    description: string | null;
    detail: string | null;
    compatibility: number;
    image: string | null;
    createAt: string; 
    status: number;
    category: Category;
    personType: PersonType;
    personType2: PersonType;
}