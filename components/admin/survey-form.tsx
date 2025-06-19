'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export function SurveyForm() {
   const router = useRouter();
   const [questions, setQuestions] = useState([
      { id: 1, text: '', type: 'multiple-choice', options: ['', ''] },
   ]);

   const addQuestion = () => {
      const newId =
         questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1;
      setQuestions([
         ...questions,
         { id: newId, text: '', type: 'multiple-choice', options: ['', ''] },
      ]);
   };

   const removeQuestion = (id: number) => {
      setQuestions(questions.filter((q) => q.id !== id));
   };

   const updateQuestion = (id: number, field: string, value: any) => {
      setQuestions(
         questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
      );
   };

   const addOption = (questionId: number) => {
      setQuestions(
         questions.map((q) => {
            if (q.id === questionId) {
               return { ...q, options: [...q.options, ''] };
            }
            return q;
         })
      );
   };

   const updateOption = (
      questionId: number,
      optionIndex: number,
      value: string
   ) => {
      setQuestions(
         questions.map((q) => {
            if (q.id === questionId) {
               const newOptions = [...q.options];
               newOptions[optionIndex] = value;
               return { ...q, options: newOptions };
            }
            return q;
         })
      );
   };

   const removeOption = (questionId: number, optionIndex: number) => {
      setQuestions(
         questions.map((q) => {
            if (q.id === questionId && q.options.length > 2) {
               const newOptions = [...q.options];
               newOptions.splice(optionIndex, 1);
               return { ...q, options: newOptions };
            }
            return q;
         })
      );
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Xử lý lưu khảo sát
      router.push('/admin/surveys');
   };

   return (
      <form onSubmit={handleSubmit}>
         <div className="space-y-6">
            <Card>
               <CardHeader>
                  <CardTitle>Thông tin khảo sát</CardTitle>
                  <CardDescription>
                     Nhập thông tin cơ bản về khảo sát
                  </CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor="title">Tiêu đề khảo sát</Label>
                     <Input
                        id="title"
                        placeholder="Nhập tiêu đề khảo sát"
                        required
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="description">Mô tả</Label>
                     <Textarea
                        id="description"
                        placeholder="Mô tả ngắn về khảo sát này"
                        rows={3}
                     />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                     <div className="space-y-2">
                        <Label htmlFor="category">Danh mục</Label>
                        <Select>
                           <SelectTrigger id="category">
                              <SelectValue placeholder="Chọn danh mục" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="personality">
                                 Tính cách
                              </SelectItem>
                              <SelectItem value="relationship">
                                 Mối quan hệ
                              </SelectItem>
                              <SelectItem value="communication">
                                 Giao tiếp
                              </SelectItem>
                              <SelectItem value="financial">
                                 Tài chính
                              </SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="status">Trạng thái</Label>
                        <div className="flex items-center space-x-2 pt-2">
                           <Switch id="status" defaultChecked />
                           <Label htmlFor="status">Hoạt động</Label>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                     <CardTitle>Câu hỏi khảo sát</CardTitle>
                     <CardDescription>
                        Thêm các câu hỏi cho khảo sát của bạn
                     </CardDescription>
                  </div>
                  <Button type="button" onClick={addQuestion}>
                     <PlusCircle className="mr-2 h-4 w-4" />
                     Thêm câu hỏi
                  </Button>
               </CardHeader>
               <CardContent className="space-y-6">
                  {questions.map((question, index) => (
                     <Card key={question.id} className="border border-dashed">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                           <div className="space-y-1">
                              <CardTitle className="text-base">
                                 Câu hỏi {index + 1}
                              </CardTitle>
                           </div>
                           <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeQuestion(question.id)}
                              disabled={questions.length <= 1}
                           >
                              <Trash2 className="h-4 w-4" />
                           </Button>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-0">
                           <div className="space-y-2">
                              <Label htmlFor={`question-${question.id}`}>
                                 Nội dung câu hỏi
                              </Label>
                              <Textarea
                                 id={`question-${question.id}`}
                                 placeholder="Nhập nội dung câu hỏi"
                                 value={question.text}
                                 onChange={(e) =>
                                    updateQuestion(
                                       question.id,
                                       'text',
                                       e.target.value
                                    )
                                 }
                                 required
                              />
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor={`question-type-${question.id}`}>
                                 Loại câu hỏi
                              </Label>
                              <Select
                                 value={question.type}
                                 onValueChange={(value) =>
                                    updateQuestion(question.id, 'type', value)
                                 }
                              >
                                 <SelectTrigger
                                    id={`question-type-${question.id}`}
                                 >
                                    <SelectValue placeholder="Chọn loại câu hỏi" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="multiple-choice">
                                       Trắc nghiệm
                                    </SelectItem>
                                    <SelectItem value="single-choice">
                                       Một lựa chọn
                                    </SelectItem>
                                    <SelectItem value="text">
                                       Văn bản
                                    </SelectItem>
                                    <SelectItem value="scale">
                                       Thang điểm
                                    </SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>

                           {(question.type === 'multiple-choice' ||
                              question.type === 'single-choice') && (
                              <div className="space-y-3">
                                 <Label>Các lựa chọn</Label>
                                 {question.options.map(
                                    (option, optionIndex) => (
                                       <div
                                          key={optionIndex}
                                          className="flex items-center gap-2"
                                       >
                                          <Input
                                             placeholder={`Lựa chọn ${optionIndex + 1}`}
                                             value={option}
                                             onChange={(e) =>
                                                updateOption(
                                                   question.id,
                                                   optionIndex,
                                                   e.target.value
                                                )
                                             }
                                             required
                                          />
                                          <Button
                                             type="button"
                                             variant="ghost"
                                             size="icon"
                                             onClick={() =>
                                                removeOption(
                                                   question.id,
                                                   optionIndex
                                                )
                                             }
                                             disabled={
                                                question.options.length <= 2
                                             }
                                          >
                                             <Trash2 className="h-4 w-4" />
                                          </Button>
                                       </div>
                                    )
                                 )}
                                 <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addOption(question.id)}
                                    className="mt-2"
                                 >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Thêm lựa chọn
                                 </Button>
                              </div>
                           )}
                        </CardContent>
                     </Card>
                  ))}
               </CardContent>
            </Card>

            <div className="flex justify-end space-x-2">
               <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.push('/admin/surveys')}
               >
                  Hủy
               </Button>
               <Button type="submit">Lưu khảo sát</Button>
            </div>
         </div>
      </form>
   );
}
