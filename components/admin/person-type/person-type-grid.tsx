import { PersonType } from '@/types/person-type';
import { PersonalityCard } from './person-type-card';

interface PersonalityGridProps {
   personTypes: PersonType[];
   onView: (personType: PersonType) => void;
   onEdit: (personType: PersonType) => void;
   onCompare: (personTypeId: string) => void;
}
export function PersonalityGrid({
   personTypes,
   onView,
   onEdit,
   onCompare,
}: PersonalityGridProps) {
   return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         {personTypes.map((personType) => (
            <PersonalityCard
               key={personType.id}
               personType={personType}
               onView={() => onView(personType)}
               onEdit={() => onEdit(personType)}
               onCompare={() => onCompare(personType.id)}
            />
         ))}
      </div>
   );
}
