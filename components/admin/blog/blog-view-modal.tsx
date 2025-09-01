'use client';
import { useEffect, useState } from 'react';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Eye, Calendar, Loader2 } from 'lucide-react';
import type { PostItem } from '@/types/post';
import { PostService } from '@/services/postService';
import { useToast, ToastType } from '@/hooks/useToast';

interface BlogViewModalProps {
   postId: string;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

export function BlogViewModal({
   postId,
   open,
   onOpenChange,
}: BlogViewModalProps) {
   const [post, setPost] = useState<PostItem | null>(null);
   const [loading, setLoading] = useState(false);
   const { showToast } = useToast();

   useEffect(() => {
      if (open && postId) {
         fetchPostDetails();
      }
   }, [open, postId]);

   const fetchPostDetails = async () => {
      try {
         setLoading(true);
         const postData = await PostService.getPostById(postId);
         setPost(postData);
      } catch (error) {
         console.error(error);
         showToast('Tải chi tiết bài viết thất bại!', ToastType.Error);
         onOpenChange(false);
      } finally {
         setLoading(false);
      }
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            {loading ? (
               <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Đang tải...</span>
               </div>
            ) : post ? (
               <>
                  <DialogHeader>
                     <DialogTitle className="text-xl font-bold">
                        {post.title}
                     </DialogTitle>
                     <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                           <Calendar className="h-4 w-4" />
                           {new Date(post.createAt).toLocaleDateString('vi-VN')}
                        </div>
                        <Badge
                           variant={post.status === 1 ? 'default' : 'secondary'}
                        >
                           {post.status === 1 ? 'Công khai' : 'Ẩn'}
                        </Badge>
                     </div>
                  </DialogHeader>
                  <div className="mt-4">
                     <img
                        src={
                           post.image ||
                           '/placeholder.svg?height=400&width=800&query=blog post article content'
                        }
                        alt={post.title}
                        className="w-full h-auto max-h-80 object-cover rounded-md"
                     />
                  </div>
                  <div className="mt-6">
                     <div
                        className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.description }}
                     />
                  </div>
               </>
            ) : (
               <div className="flex items-center justify-center py-8">
                  <span>Không thể tải bài viết</span>
               </div>
            )}
         </DialogContent>
      </Dialog>
   );
}
