import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CourseReviewsTabProps {
   reviews: any[];
}

export function CourseReviewsTab({ reviews }: CourseReviewsTabProps) {
   return (
      <Card>
         <CardHeader>
            <CardTitle>Đánh giá từ học viên</CardTitle>
         </CardHeader>
         <CardContent>
            <p className="text-muted-foreground">Chưa có đánh giá nào.</p>
         </CardContent>
      </Card>
   );
}
