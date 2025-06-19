'use client';

import type React from 'react';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Upload, Video, FileText, ImageIcon } from 'lucide-react';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import QuizBuilder from './quizbuilder';

interface Question {
   question: string;
   answers: { text: string; isCorrect: boolean }[];
}

interface Chapter {
   id: string;
   title: string;
   type: 'video' | 'article' | 'quiz';
   content: string;
   videoFile?: File;
   videoUrl?: string;
   duration?: string;
   readTime?: string;
   uploadProgress?: number;
   quiz?: Question[]; // Add this
}
interface CourseFormProps {
   courseId?: string;
}

export function CourseForm({ courseId }: CourseFormProps) {
   const [formData, setFormData] = useState({
      title: '',
      description: '',
      thumbnail: '',
      thumbnailFile: null as File | null,
      price: 0,
      isFree: false,
      membershipRequired: [] as string[],
   });

   const [chapters, setChapters] = useState<Chapter[]>([]);
   const [newChapter, setNewChapter] = useState({
      title: '',
      type: 'video' as 'video' | 'article' | 'quiz',
      content: '',
      videoFile: null as File | null,
      duration: '',
      readTime: '',
      quiz: [] as Question[], // Add this
   });

   const thumbnailInputRef = useRef<HTMLInputElement>(null);
   const videoInputRef = useRef<HTMLInputElement>(null);

   const membershipOptions = [
      { id: 'basic', label: 'Basic' },
      { id: 'premium', label: 'Premium' },
      { id: 'vip', label: 'VIP' },
   ];

   const handleMembershipChange = (membershipId: string, checked: boolean) => {
      if (checked) {
         setFormData((prev) => ({
            ...prev,
            membershipRequired: [...prev.membershipRequired, membershipId],
         }));
      } else {
         setFormData((prev) => ({
            ...prev,
            membershipRequired: prev.membershipRequired.filter(
               (id) => id !== membershipId
            ),
         }));
      }
   };

   const handleThumbnailUpload = (
      event: React.ChangeEvent<HTMLInputElement>
   ) => {
      const file = event.target.files?.[0];
      if (file) {
         setFormData((prev) => ({
            ...prev,
            thumbnailFile: file,
            thumbnail: URL.createObjectURL(file),
         }));
      }
   };

   const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
         setNewChapter((prev) => ({
            ...prev,
            videoFile: file,
         }));

         // Simulate upload progress
         simulateUpload(file);
      }
   };

   const simulateUpload = (file: File) => {
      // In real app, this would be actual upload to cloud storage
      let progress = 0;
      const interval = setInterval(() => {
         progress += 10;
         setNewChapter((prev) => ({
            ...prev,
            uploadProgress: progress,
         }));

         if (progress >= 100) {
            clearInterval(interval);
            // Set video URL after upload completes
            setNewChapter((prev) => ({
               ...prev,
               content: URL.createObjectURL(file),
               uploadProgress: undefined,
            }));
         }
      }, 200);
   };

   const addChapter = () => {
      if (
         newChapter.title &&
         ((newChapter.type === 'article' && newChapter.content) ||
            (newChapter.type === 'video' && newChapter.videoFile) ||
            (newChapter.type === 'quiz' && newChapter.quiz.length > 0))
      ) {
         const chapter: Chapter = {
            id: Date.now().toString(),
            title: newChapter.title,
            type: newChapter.type,
            content: newChapter.content,
            videoFile: newChapter.videoFile || undefined,
            videoUrl: newChapter.videoFile
               ? URL.createObjectURL(newChapter.videoFile)
               : undefined,
            ...(newChapter.type === 'video'
               ? { duration: newChapter.duration }
               : newChapter.type === 'article'
                 ? { readTime: newChapter.readTime }
                 : {}),
            ...(newChapter.type === 'quiz' ? { quiz: newChapter.quiz } : {}),
         };

         setChapters([...chapters, chapter]);

         // Reset state
         setNewChapter({
            title: '',
            type: 'video',
            content: '',
            videoFile: null,
            duration: '',
            readTime: '',
            quiz: [],
         });

         // Reset video input
         if (videoInputRef.current) {
            videoInputRef.current.value = '';
         }
      }
   };

   const removeChapter = (chapterId: string) => {
      setChapters(chapters.filter((chapter) => chapter.id !== chapterId));
   };

   const handleSubmit = (status: 'draft' | 'pending') => {
      const courseData = {
         ...formData,
         chapters,
         status,
      };
      console.log('Submit course:', courseData);
      // Here you would upload files and save to database
   };

   return (
      <div className="space-y-6">
         <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
               <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
               <TabsTrigger value="pricing">Giá & Membership</TabsTrigger>
               <TabsTrigger value="content">Nội dung khóa học</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
               <Card>
                  <CardHeader>
                     <CardTitle>Thông tin cơ bản</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <Label htmlFor="title">Tên khóa học</Label>
                        <Input
                           id="title"
                           value={formData.title}
                           onChange={(e) =>
                              setFormData((prev) => ({
                                 ...prev,
                                 title: e.target.value,
                              }))
                           }
                           placeholder="Nhập tên khóa học"
                        />
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="description">Mô tả khóa học</Label>
                        <Textarea
                           id="description"
                           value={formData.description}
                           onChange={(e) =>
                              setFormData((prev) => ({
                                 ...prev,
                                 description: e.target.value,
                              }))
                           }
                           placeholder="Mô tả chi tiết về khóa học"
                           rows={4}
                        />
                     </div>

                     <div className="space-y-2">
                        <Label>Ảnh thumbnail</Label>
                        <div className="space-y-4">
                           {formData.thumbnail && (
                              <div className="relative w-full max-w-md">
                                 <img
                                    src={
                                       formData.thumbnail || '/placeholder.svg'
                                    }
                                    alt="Thumbnail preview"
                                    className="w-full h-48 object-cover rounded-lg border"
                                 />
                              </div>
                           )}

                           <div className="flex items-center gap-4">
                              <input
                                 ref={thumbnailInputRef}
                                 type="file"
                                 accept="image/*"
                                 onChange={handleThumbnailUpload}
                                 className="hidden"
                              />
                              <Button
                                 type="button"
                                 variant="outline"
                                 onClick={() =>
                                    thumbnailInputRef.current?.click()
                                 }
                              >
                                 <ImageIcon className="mr-2 h-4 w-4" />
                                 {formData.thumbnail
                                    ? 'Thay đổi ảnh'
                                    : 'Chọn ảnh'}
                              </Button>
                           </div>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="pricing">
               <Card>
                  <CardHeader>
                     <CardTitle>Giá & Membership</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     <div className="flex items-center space-x-2">
                        <Switch
                           id="is-free"
                           checked={formData.isFree}
                           onCheckedChange={(checked) =>
                              setFormData((prev) => ({
                                 ...prev,
                                 isFree: checked,
                              }))
                           }
                        />
                        <Label htmlFor="is-free">Khóa học miễn phí</Label>
                     </div>

                     {!formData.isFree && (
                        <div className="space-y-2">
                           <Label htmlFor="price">Giá khóa học (VNĐ)</Label>
                           <Input
                              id="price"
                              type="number"
                              value={formData.price}
                              onChange={(e) =>
                                 setFormData((prev) => ({
                                    ...prev,
                                    price: Number(e.target.value),
                                 }))
                              }
                              placeholder="0"
                           />
                        </div>
                     )}

                     <div className="space-y-4">
                        <Label>Yêu cầu membership</Label>
                        <div className="space-y-2">
                           {membershipOptions.map((option) => (
                              <div
                                 key={option.id}
                                 className="flex items-center space-x-2"
                              >
                                 <Checkbox
                                    id={option.id}
                                    checked={formData.membershipRequired.includes(
                                       option.id
                                    )}
                                    onCheckedChange={(checked) =>
                                       handleMembershipChange(
                                          option.id,
                                          checked as boolean
                                       )
                                    }
                                 />
                                 <Label htmlFor={option.id}>
                                    {option.label}
                                 </Label>
                              </div>
                           ))}
                        </div>

                        {formData.membershipRequired.length > 0 && (
                           <div className="flex gap-2">
                              {formData.membershipRequired.map((membership) => (
                                 <Badge key={membership} variant="outline">
                                    {
                                       membershipOptions.find(
                                          (opt) => opt.id === membership
                                       )?.label
                                    }
                                 </Badge>
                              ))}
                           </div>
                        )}
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="content">
               <div className="space-y-6">
                  <Card>
                     <CardHeader>
                        <CardTitle>Thêm chương mới</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                           <div className="space-y-2">
                              <Label htmlFor="chapter-title">Tên chương</Label>
                              <Input
                                 id="chapter-title"
                                 value={newChapter.title}
                                 onChange={(e) =>
                                    setNewChapter((prev) => ({
                                       ...prev,
                                       title: e.target.value,
                                    }))
                                 }
                                 placeholder="Nhập tên chương"
                              />
                           </div>

                           <div className="space-y-2">
                              <Label htmlFor="chapter-type">
                                 Loại nội dung
                              </Label>
                              <Select
                                 value={newChapter.type}
                                 onValueChange={(
                                    value: 'video' | 'article' | 'quiz'
                                 ) =>
                                    setNewChapter((prev) => ({
                                       ...prev,
                                       type: value,
                                       videoFile: null,
                                       content: '',
                                       quiz: value === 'quiz' ? prev.quiz : [], // reset quiz nếu không chọn quiz
                                    }))
                                 }
                              >
                                 <SelectTrigger>
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="video">Video</SelectItem>
                                    <SelectItem value="article">
                                       Bài viết
                                    </SelectItem>
                                    <SelectItem value="quiz">Quiz</SelectItem>{' '}
                                    {/* Thêm lựa chọn Quiz */}
                                 </SelectContent>
                              </Select>
                           </div>
                        </div>

                        {newChapter.type === 'video' ? (
                           <div className="space-y-4">
                              <div className="space-y-2">
                                 <Label>Video</Label>
                                 <div className="space-y-4">
                                    {newChapter.videoFile && (
                                       <div className="relative">
                                          <video
                                             src={URL.createObjectURL(
                                                newChapter.videoFile
                                             )}
                                             controls
                                             className="w-full max-w-md h-48 rounded-lg border"
                                          />
                                          {newChapter.uploadProgress !==
                                             undefined && (
                                             <div className="mt-2">
                                                <div className="flex items-center justify-between text-sm mb-1">
                                                   <span>Đang tải lên...</span>
                                                   <span>
                                                      {
                                                         newChapter.uploadProgress
                                                      }
                                                      %
                                                   </span>
                                                </div>
                                                <Progress
                                                   value={
                                                      newChapter.uploadProgress
                                                   }
                                                   className="w-full"
                                                />
                                             </div>
                                          )}
                                       </div>
                                    )}

                                    <div className="flex items-center gap-4">
                                       <input
                                          ref={videoInputRef}
                                          type="file"
                                          accept="video/*"
                                          onChange={handleVideoUpload}
                                          className="hidden"
                                       />
                                       <Button
                                          type="button"
                                          variant="outline"
                                          onClick={() =>
                                             videoInputRef.current?.click()
                                          }
                                       >
                                          <Upload className="mr-2 h-4 w-4" />
                                          {newChapter.videoFile
                                             ? 'Thay đổi video'
                                             : 'Chọn video'}
                                       </Button>
                                    </div>
                                 </div>
                              </div>

                              <div className="space-y-2">
                                 <Label htmlFor="duration">
                                    Thời lượng (phút:giây)
                                 </Label>
                                 <Input
                                    id="duration"
                                    value={newChapter.duration}
                                    onChange={(e) =>
                                       setNewChapter((prev) => ({
                                          ...prev,
                                          duration: e.target.value,
                                       }))
                                    }
                                    placeholder="15:30"
                                 />
                              </div>
                           </div>
                        ) : newChapter.type === 'article' ? (
                           <div className="space-y-4">
                              <div className="space-y-2">
                                 <Label htmlFor="chapter-content">
                                    Nội dung bài viết
                                 </Label>
                                 <Textarea
                                    id="chapter-content"
                                    value={newChapter.content}
                                    onChange={(e) =>
                                       setNewChapter((prev) => ({
                                          ...prev,
                                          content: e.target.value,
                                       }))
                                    }
                                    placeholder="Nhập nội dung bài viết"
                                    rows={6}
                                 />
                              </div>

                              <div className="space-y-2">
                                 <Label htmlFor="read-time">
                                    Thời gian đọc (phút)
                                 </Label>
                                 <Input
                                    id="read-time"
                                    value={newChapter.readTime}
                                    onChange={(e) =>
                                       setNewChapter((prev) => ({
                                          ...prev,
                                          readTime: e.target.value,
                                       }))
                                    }
                                    placeholder="10"
                                 />
                              </div>
                           </div>
                        ) : (
                           <div className="space-y-4">
                              <Label>Quiz câu hỏi</Label>
                              <QuizBuilder
                                 quiz={newChapter.quiz}
                                 setQuiz={(quiz) =>
                                    setNewChapter((prev) => ({ ...prev, quiz }))
                                 }
                              />
                              {newChapter.quiz.length === 0 && (
                                 <p className="text-sm text-muted-foreground">
                                    Chưa có câu hỏi nào được thêm
                                 </p>
                              )}
                           </div>
                        )}

                        <Button
                           onClick={addChapter}
                           className="w-full"
                           disabled={
                              !newChapter.title ||
                              (newChapter.type === 'article' &&
                                 !newChapter.content) ||
                              (newChapter.type === 'video' &&
                                 !newChapter.videoFile) ||
                              (newChapter.type === 'quiz' &&
                                 newChapter.quiz.length === 0)
                           }
                        >
                           <Plus className="mr-2 h-4 w-4" />
                           Thêm chương
                        </Button>
                     </CardContent>
                  </Card>

                  {chapters.length > 0 && (
                     <Card>
                        <CardHeader>
                           <CardTitle>
                              Danh sách chương ({chapters.length})
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {chapters.map((chapter, index) => (
                              <div
                                 key={chapter.id}
                                 className="flex items-start gap-4 p-4 border rounded-lg"
                              >
                                 <div className="flex-shrink-0 mt-1">
                                    {chapter.type === 'video' ? (
                                       <Video className="h-6 w-6 text-blue-500" />
                                    ) : (
                                       <FileText className="h-6 w-6 text-green-500" />
                                    )}
                                 </div>

                                 <div className="flex-1 space-y-2">
                                    <h4 className="font-medium">
                                       Chương {index + 1}: {chapter.title}
                                    </h4>

                                    {chapter.type === 'video' &&
                                       chapter.videoUrl && (
                                          <div className="relative">
                                             <video
                                                src={chapter.videoUrl}
                                                controls
                                                className="w-full max-w-sm h-32 rounded border"
                                             />
                                          </div>
                                       )}

                                    {chapter.type === 'article' && (
                                       <p className="text-sm text-muted-foreground line-clamp-3">
                                          {chapter.content}
                                       </p>
                                    )}

                                    <div className="text-sm text-muted-foreground">
                                       {chapter.type === 'video'
                                          ? chapter.duration
                                          : `${chapter.readTime} phút`}
                                    </div>
                                 </div>

                                 <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeChapter(chapter.id)}
                                    className="text-destructive"
                                 >
                                    <Trash2 className="h-4 w-4" />
                                 </Button>
                              </div>
                           ))}
                        </CardContent>
                     </Card>
                  )}
               </div>
            </TabsContent>
         </Tabs>

         <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={() => handleSubmit('draft')}>
               Lưu bản nháp
            </Button>
            <Button onClick={() => handleSubmit('pending')}>Gửi duyệt</Button>
         </div>
      </div>
   );
}
