'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CourseService } from '@/services/courseService';
import { categoryService } from '@/services/categoryService';

import { ToastType, useToast } from '@/hooks/useToast';
import type React from 'react';
import type {
   CourseItem,
   SubCategory,
   ChapterItem,
   UpdateCourseRequest,
} from '@/types/course';
import type { Membership } from '@/types/membership';
import { CourseHeader } from './detail/CourseHeader';
import { CourseBasicInfo } from './detail/CourseBasicInfo';
import { CourseContentTab } from './detail/course-content/CourseContentTab';
import { CourseCategories } from './detail/CourseCategories';
import { getAllMembership } from '@/services/membership';
import { useUploadImage } from '@/hooks/upload-image';

// Internal types
interface Question {
   id: string;
   question: string;
   answers: { id: string; text: string; isCorrect: boolean }[];
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
   quiz?: Question[];
}

interface Course {
   id: string;
   title: string;
   description: string;
   price: number;
   membershipRequired: string[];
   subCategories: string[];
   status: 'public' | 'hidden';
   createdAt: string;
   chapters: Chapter[];
   enrollments: number;
   thumbnail: string;
   thumbnailFile?: File | null;
   rank: number;
}

interface Category {
   id: string;
   name: string;
   subCategories: SubCategoryItem[];
}

interface SubCategoryItem {
   id: string;
   name: string;
   categoryId: string;
}

interface AdminCourseDetailProps {
   courseId: string;
}

export function AdminCourseDetail({ courseId }: AdminCourseDetailProps) {
   const [course, setCourse] = useState<Course | null>(null);
   const [categories, setCategories] = useState<Category[]>([]);
   const [memberships, setMemberships] = useState<Membership[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isLoadingCategories, setIsLoadingCategories] = useState(false);
   const [isLoadingMemberships, setIsLoadingMemberships] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const {
      uploadImage,
      loading: uploadingImage,
      error: uploadError,
   } = useUploadImage();
   // Separate editing states for each section
   const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
   const [isEditingCategories, setIsEditingCategories] = useState(false);
   const [isEditingContent, setIsEditingContent] = useState(false);

   // Temp states for basic info & pricing
   const [tempTitle, setTempTitle] = useState('');
   const [tempDescription, setTempDescription] = useState('');
   const [tempThumbnail, setTempThumbnail] = useState('');
   const [tempThumbnailFile, setTempThumbnailFile] = useState<File | null>(
      null
   );
   const [tempPrice, setTempPrice] = useState(0);
   const [tempMembershipRequired, setTempMembershipRequired] = useState<
      string[]
   >([]);
   const [tempRank, setTempRank] = useState<number>(1);

   // Temp states for categories
   const [tempSubCategories, setTempSubCategories] = useState<string[]>([]);

   // Temp states for content
   const [tempChapters, setTempChapters] = useState<Chapter[]>([]);

   const { showToast } = useToast();

   const fetchCategories = useCallback(async () => {
      setIsLoadingCategories(true);
      try {
         const response = await categoryService.getActiveCategoriesWithSub();
         if (response.success) {
            setCategories(response.data);
         } else {
            showToast('Lỗi khi tải danh mục.', ToastType.Error);
         }
      } catch (error: any) {
         showToast(error.message || 'Không thể tải danh mục.', ToastType.Error);
      } finally {
         setIsLoadingCategories(false);
      }
   }, []);

   const fetchMemberships = useCallback(async () => {
      setIsLoadingMemberships(true);
      try {
         const membershipsData = await getAllMembership();
         setMemberships(membershipsData);
      } catch (error: any) {
         showToast(
            error.message || 'Không thể tải danh sách membership.',
            ToastType.Error
         );
      } finally {
         setIsLoadingMemberships(false);
      }
   }, []);

   const fetchCourseData = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
         const response: CourseItem =
            await CourseService.getCourseById(courseId);
         const transformed: Course = {
            id: response.id,
            title: response.name,
            description: response.description ?? 'Chưa có mô tả',
            price: response.price ?? 0,
            membershipRequired: [], // Will be set based on rank
            subCategories:
               response.subCategories?.map((sc: SubCategory) => sc.id) ?? [],
            status: response.status === 1 ? 'public' : 'hidden',
            createdAt:
               response.chapters?.[0]?.createAt ??
               new Date().toISOString().split('T')[0],
            chapters:
               response.chapters?.map((chap: ChapterItem) => ({
                  id: chap.id,
                  title: chap.name,
                  type:
                     chap.chapterType.toLowerCase() === 'lecture'
                        ? 'article'
                        : chap.chapterType.toLowerCase() === 'quiz'
                          ? 'quiz'
                          : chap.chapterType.toLowerCase() === 'video'
                            ? 'video'
                            : 'article',
                  content: chap.description ?? '',
                  videoFile: undefined,
                  videoUrl: undefined,
                  duration: '',
                  readTime: '',
                  uploadProgress: undefined,
                  quiz: [],
               })) ?? [],
            enrollments: 0,
            thumbnail:
               response.thumble ?? '/placeholder.svg?height=200&width=300',
            thumbnailFile: null,
            rank: response.rank ?? 1,
         };

         setCourse(transformed);
         resetTempStates(transformed);
      } catch (err) {
         setError('Không thể tải chi tiết khóa học.');
         showToast('Lỗi khi tải dữ liệu.', ToastType.Error);
      } finally {
         setIsLoading(false);
      }
   }, [courseId]);

   const resetTempStates = (courseData: Course) => {
      setTempTitle(courseData.title);
      setTempDescription(courseData.description);
      setTempThumbnail(courseData.thumbnail);
      setTempThumbnailFile(null);
      setTempPrice(courseData.price);
      setTempMembershipRequired(courseData.membershipRequired);
      setTempSubCategories(courseData.subCategories);
      setTempChapters([...courseData.chapters]);
      setTempRank(courseData.rank);
   };

   useEffect(() => {
      fetchCourseData();
      fetchCategories();
      fetchMemberships();
   }, [fetchCourseData, fetchCategories, fetchMemberships]);

   // Combined save handler for basic info and pricing
   const handleSaveBasicInfo = async () => {
      if (!course) return;
      setIsLoading(true);
      try {
         const updatedData: UpdateCourseRequest = {
            courseId: course.id,
            name: tempTitle,
            thumble: tempThumbnail,
            description: tempDescription,
            price: tempPrice,
            rank: tempRank,
         };

         const response = await CourseService.updateCourse(updatedData);

         if (response.success) {
            setCourse({
               ...course,
               title: tempTitle,
               description: tempDescription,
               thumbnail: tempThumbnail,
               price: tempPrice,
               membershipRequired: tempMembershipRequired,
               rank: tempRank,
            });
            setIsEditingBasicInfo(false);
            showToast(
               'Thông tin khóa học đã được cập nhật.',
               ToastType.Success
            );
         } else {
            throw new Error(
               response.error || 'Lỗi khi cập nhật thông tin khóa học.'
            );
         }
      } catch (err: any) {
         showToast(
            err.message || 'Lỗi khi cập nhật thông tin khóa học.',
            ToastType.Error
         );
      } finally {
         setIsLoading(false);
      }
   };

   const handleSaveCategories = async () => {
      if (!course) return;
      setIsLoading(true);
      try {
         const addedSubCategories = tempSubCategories.filter(
            (id) => !course.subCategories.includes(id)
         );
         await Promise.all(
            addedSubCategories.map((subCategoryId) =>
               CourseService.addSubCategoryToCourse({
                  courseID: courseId,
                  subCategoryID: subCategoryId,
               })
            )
         );

         setCourse((prev) =>
            prev ? { ...prev, subCategories: tempSubCategories } : prev
         );
         setIsEditingCategories(false);
         showToast('Danh mục đã được cập nhật.', ToastType.Success);
      } catch (err) {
         showToast('Lỗi khi cập nhật danh mục.', ToastType.Error);
      } finally {
         setIsLoading(false);
      }
   };

   const handleSaveContent = async () => {
      if (!course) return;
      setIsEditingContent(false);
      setCourse({ ...course, chapters: tempChapters });
      showToast('Nội dung khóa học đã được cập nhật.', ToastType.Success);
   };

   const handleCancelBasicInfo = () => {
      if (!course) return;
      setTempTitle(course.title);
      setTempDescription(course.description);
      setTempThumbnail(course.thumbnail);
      setTempThumbnailFile(null);
      setTempPrice(course.price);
      setTempMembershipRequired(course.membershipRequired);
      setTempRank(course.rank);
      setIsEditingBasicInfo(false);
   };

   const handleCancelCategories = () => {
      if (!course) return;
      setTempSubCategories(course.subCategories);
      setIsEditingCategories(false);
   };

   const handleCancelContent = () => {
      if (!course) return;
      setTempChapters([...course.chapters]);
      setIsEditingContent(false);
   };

  const handleToggleStatus = async (newStatus: "public" | "hidden") => {
  if (!course) return;
  try {
    const response = await CourseService.changeCourseStatus({
      courseId: course.id,
      newStatus: newStatus === "public" ? 1 : 0,
    });

    if (response.success) {
      setCourse({ ...course, status: newStatus });
      showToast(
        `Khóa học đã được ${newStatus === "public" ? "công khai" : "ẩn"}.`,
        ToastType.Success
      );
    } else {
      throw new Error(response.error || "Lỗi khi cập nhật trạng thái.");
    }
  } catch (err) {
    showToast("Lỗi khi cập nhật trạng thái.", ToastType.Error);
  }
};

   const handleThumbnailUpload = async (
      event: React.ChangeEvent<HTMLInputElement>
   ) => {
      const file = event.target.files?.[0];
      if (file) {
         setTempThumbnailFile(file);
         // Optional: show preview while uploading
         setTempThumbnail(URL.createObjectURL(file));

         await uploadImage({
            file,
            onSuccess: (imageUrl) => {
               setTempThumbnail(imageUrl);
               showToast('Ảnh đã được tải lên thành công.', ToastType.Success);
            },
            onError: (message) => {
               showToast(message, ToastType.Error);
            },
         });
      }
   };
   const handleMembershipChange = (membershipId: string, checked: boolean) => {
      setTempMembershipRequired((prev) =>
         checked
            ? [...prev, membershipId]
            : prev.filter((id) => id !== membershipId)
      );
   };

   const handleRankChange = (rank: number) => {
      setTempRank(rank);
      // Update membershipRequired based on rank
      const matchingMembership = memberships.find((m) => m.rank === rank);
      if (matchingMembership) {
         setTempMembershipRequired([matchingMembership.id]);
      } else {
         setTempMembershipRequired([]);
      }
   };

   const handleSubCategoryChange = (
      subCategoryId: string,
      checked: boolean
   ) => {
      setTempSubCategories((prev) =>
         checked
            ? [...prev, subCategoryId]
            : prev.filter((id) => id !== subCategoryId)
      );
   };

   if (isLoading || isLoadingMemberships) return <div>Đang tải...</div>;
   if (error) return <div>{error}</div>;
   if (!course) return <div>Không tìm thấy khóa học.</div>;

   // Map memberships to options for CourseBasicInfo
   const membershipOptions = memberships
      .filter((m) => m.status === 1)
      .map((m) => ({
         id: m.id,
         label: m.memberShipName,
      }));

   return (
      <div className="space-y-6">
         <CourseHeader
            courseId={course.id}
            title={course.title}
            status={course.status}
            onToggleStatus={handleToggleStatus}
         />

         <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
               <CourseBasicInfo
                  isEditingMode={isEditingBasicInfo}
                  tempTitle={tempTitle}
                  setTempTitle={setTempTitle}
                  tempDescription={tempDescription}
                  setTempDescription={setTempDescription}
                  tempThumbnail={tempThumbnail}
                  tempThumbnailFile={tempThumbnailFile}
                  setTempThumbnailFile={setTempThumbnailFile}
                  onThumbnailUpload={handleThumbnailUpload}
                  tempPrice={tempPrice}
                  setTempPrice={setTempPrice}
                  tempMembershipRequired={tempMembershipRequired}
                  onMembershipChange={handleMembershipChange}
                  membershipOptions={membershipOptions}
                  tempRank={tempRank}
                  onRankChange={handleRankChange}
                  memberships={memberships}
                  course={{
                     title: course.title,
                     description: course.description,
                     thumbnail: course.thumbnail,
                     price: course.price,
                     membershipRequired: course.membershipRequired,
                     rank: course.rank,
                  }}
                  onEdit={() => setIsEditingBasicInfo(true)}
                  onSave={handleSaveBasicInfo}
                  onCancel={handleCancelBasicInfo}
               />

               <Tabs defaultValue="content" className="space-y-4">
                  <TabsList>
                     <TabsTrigger value="content">
                        Nội dung khóa học
                     </TabsTrigger>
                  </TabsList>
                  <TabsContent value="content">
                     <CourseContentTab
                        isEditingMode={isEditingContent}
                        tempChapters={tempChapters}
                        setTempChapters={setTempChapters}
                        courseChapters={course.chapters}
                        courseId={courseId}
                        onEdit={() => setIsEditingContent(true)}
                        onSave={handleSaveContent}
                        onCancel={handleCancelContent}
                        onRefreshCourse={fetchCourseData}
                     />
                  </TabsContent>
               </Tabs>
            </div>

            <div className="space-y-6">
               <CourseCategories
                  isEditingMode={isEditingCategories}
                  tempSubCategories={tempSubCategories}
                  onSubCategoryChange={handleSubCategoryChange}
                  categories={categories}
                  isLoadingCategories={isLoadingCategories}
                  course={course}
                  onEdit={() => setIsEditingCategories(true)}
                  onSave={handleSaveCategories}
                  onCancel={handleCancelCategories}
               />
            </div>
         </div>
      </div>
   );
}
