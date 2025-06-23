'use client';

import { Button } from '@/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function ExpertiseTab() {
   return (
      <Card>
         <CardHeader>
            <CardTitle>Chuyên môn & Bằng cấp</CardTitle>
            <CardDescription>
               Cập nhật chuyên môn và bằng cấp chuyên nghiệp của bạn
            </CardDescription>
         </CardHeader>
         <CardContent className="space-y-6">
            <div className="space-y-2">
               <Label htmlFor="specialties">Chuyên môn chính</Label>
               <Select defaultValue="communication">
                  <SelectTrigger id="specialties">
                     <SelectValue placeholder="Chọn chuyên môn" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="communication">Giao tiếp</SelectItem>
                     <SelectItem value="conflict">
                        Giải quyết xung đột
                     </SelectItem>
                     <SelectItem value="parenting">Nuôi dạy con</SelectItem>
                     <SelectItem value="financial">
                        Lập kế hoạch tài chính
                     </SelectItem>
                     <SelectItem value="intimacy">
                        Sự thân mật & Lòng tin
                     </SelectItem>
                  </SelectContent>
               </Select>
            </div>
            <div className="space-y-2">
               <Label htmlFor="education">Học vấn</Label>
               <Textarea
                  id="education"
                  defaultValue="Tiến sĩ Tâm lý học lâm sàng, Đại học Quốc gia Hà Nội, 2015
Thạc sĩ Tâm lý học tư vấn, Đại học Khoa học Xã hội và Nhân văn, 2011
Cử nhân Tâm lý học, Đại học Khoa học Xã hội và Nhân văn, 2009"
                  rows={4}
               />
            </div>
            <div className="space-y-2">
               <Label htmlFor="certifications">Chứng chỉ</Label>
               <Textarea
                  id="certifications"
                  defaultValue="Chuyên viên tư vấn hôn nhân và gia đình được cấp phép
Chuyên viên trị liệu theo phương pháp Gottman (Cấp độ 3)
Chứng chỉ Trị liệu tập trung vào cảm xúc (EFT)"
                  rows={4}
               />
            </div>
            <div className="space-y-2">
               <Label htmlFor="experience">Năm kinh nghiệm</Label>
               <Select defaultValue="10">
                  <SelectTrigger id="experience">
                     <SelectValue placeholder="Chọn số năm" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="1">1-2 năm</SelectItem>
                     <SelectItem value="3">3-5 năm</SelectItem>
                     <SelectItem value="6">6-9 năm</SelectItem>
                     <SelectItem value="10">10+ năm</SelectItem>
                  </SelectContent>
               </Select>
            </div>
         </CardContent>
         <CardFooter className="justify-end space-x-2">
            <Button variant="outline">Hủy</Button>
            <Button>Lưu thay đổi</Button>
         </CardFooter>
      </Card>
   );
}
