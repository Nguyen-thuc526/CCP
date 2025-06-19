import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function SurveyList() {
   const surveys = [
      {
         id: 1,
         title: 'Đánh giá tính cách MBTI',
         questions: 93,
         completions: 856,
         status: 'Hoạt động',
      },
      {
         id: 2,
         title: 'Đánh giá ngôn ngữ tình yêu',
         questions: 30,
         completions: 1248,
         status: 'Hoạt động',
      },
      {
         id: 3,
         title: 'Hồ sơ tính cách DISC',
         questions: 60,
         completions: 723,
         status: 'Hoạt động',
      },
      {
         id: 4,
         title: 'Kiểm tra tính cách Big Five',
         questions: 50,
         completions: 512,
         status: 'Hoạt động',
      },
      {
         id: 5,
         title: 'Đánh giá tương thích tài chính',
         questions: 25,
         completions: 489,
         status: 'Bản nháp',
      },
   ];

   return (
      <Card>
         <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
               <table className="w-full caption-bottom text-sm">
                  <thead className="border-b">
                     <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">
                           Tiêu đề
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                           Câu hỏi
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                           Lượt hoàn thành
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                           Trạng thái
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                           Thao tác
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {surveys.map((survey) => (
                        <tr
                           key={survey.id}
                           className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                           <td className="p-4 align-middle">{survey.title}</td>
                           <td className="p-4 align-middle">
                              {survey.questions}
                           </td>
                           <td className="p-4 align-middle">
                              {survey.completions}
                           </td>
                           <td className="p-4 align-middle">
                              <Badge
                                 variant={
                                    survey.status === 'Hoạt động'
                                       ? 'default'
                                       : 'secondary'
                                 }
                              >
                                 {survey.status}
                              </Badge>
                           </td>
                           <td className="p-4 align-middle">
                              <div className="flex gap-2">
                                 <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Chỉnh sửa</span>
                                 </Button>
                                 <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Xóa</span>
                                 </Button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </CardContent>
      </Card>
   );
}
