import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function UpcomingTasks() {
   const tasks = [
      {
         id: 1,
         title: 'Xem xét đơn đăng ký chuyên viên tư vấn mới',
         priority: 'Cao',
         dueDate: 'Hôm nay',
      },
      {
         id: 2,
         title: 'Phê duyệt bài viết blog mới',
         priority: 'Trung bình',
         dueDate: 'Ngày mai',
      },
      {
         id: 3,
         title: 'Cập nhật câu hỏi khảo sát MBTI',
         priority: 'Trung bình',
         dueDate: '18/05',
      },
      {
         id: 4,
         title: 'Xem xét báo cáo phân tích hàng tháng',
         priority: 'Thấp',
         dueDate: '20/05',
      },
   ];

   return (
      <Card>
         <CardHeader>
            <CardTitle>Nhiệm vụ sắp tới</CardTitle>
            <CardDescription>Nhiệm vụ cần sự chú ý của bạn</CardDescription>
         </CardHeader>
         <CardContent>
            <div className="space-y-4">
               {tasks.map((task) => (
                  <div
                     key={task.id}
                     className="flex items-start justify-between"
                  >
                     <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">
                           Hạn: {task.dueDate}
                        </p>
                     </div>
                     <Badge
                        variant={
                           task.priority === 'Cao'
                              ? 'destructive'
                              : task.priority === 'Trung bình'
                                ? 'default'
                                : 'secondary'
                        }
                     >
                        {task.priority}
                     </Badge>
                  </div>
               ))}
            </div>
         </CardContent>
      </Card>
   );
}
