'use client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { ImageIcon, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PersonType } from '@/types/person-type';
import { Button } from '@/components/ui/button';

interface ViewPersonalityModalProps {
   personType: PersonType;
   isOpen: boolean;
   onClose: () => void;
}

const ViewPersonalityModal = ({
   personType,
   isOpen,
   onClose,
}: ViewPersonalityModalProps) => {
   const { toast } = useToast();
   const [open, setOpen] = useState(false);

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="max-w-4xl max-h-[85vh] p-0 overflow-hidden">
            <ScrollArea className="h-[85vh]">
               <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
                  {personType.image ? (
                     <img
                        src={personType.image || '/placeholder.svg'}
                        alt={personType.name}
                        className="w-full h-full object-cover"
                     />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <ImageIcon className="h-20 w-20 text-gray-400" />
                     </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute top-4 right-4">
                     <Badge
                        variant="secondary"
                        className="bg-white/90 text-gray-800 backdrop-blur-sm"
                     >
                        {personType.category?.name}
                     </Badge>
                  </div>
                  <Button
                     onClick={onClose}
                     className="absolute top-4 left-4 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                  >
                     <X className="h-4 w-4 text-white" />
                  </Button>
               </div>

               <div className="relative px-6 pt-4 pb-2">
                  <div className="absolute -top-10 left-6">
                     <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                        <AvatarImage
                           src={personType.image || '/placeholder.svg'}
                           alt={personType.name}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-semibold">
                           {personType.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                     </Avatar>
                  </div>

                  <div className="pt-12">
                     <DialogTitle className="text-2xl font-bold text-gray-900">
                        {personType.name}
                     </DialogTitle>
                  </div>
               </div>

               <div className="space-y-6 px-6 pb-6">
                  <div>
                     <h4 className="font-semibold mb-3 text-lg text-gray-800">
                        Mô Tả
                     </h4>
                     <p className="text-gray-600 leading-relaxed">
                        {personType.description}
                     </p>
                  </div>

                  <Separator />

                  <div>
                     <h4 className="font-semibold mb-3 text-lg text-gray-800">
                        Nội Dung Chi Tiết
                     </h4>
                     <div
                        className="prose prose-sm max-w-none text-gray-600"
                        dangerouslySetInnerHTML={{ __html: personType.detail }}
                     />
                  </div>
               </div>
            </ScrollArea>
         </DialogContent>
      </Dialog>
   );
};

export default ViewPersonalityModal;
