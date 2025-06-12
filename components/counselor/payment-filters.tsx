import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PaymentFilters() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm font-medium">
                Trạng thái
              </label>
              <Select defaultValue="all">
                <SelectTrigger id="status" className="w-[180px]">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả chính sách</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="duration" className="text-sm font-medium">
                Thời lượng
              </label>
              <Select defaultValue="all">
                <SelectTrigger id="duration" className="w-[180px]">
                  <SelectValue placeholder="Chọn thời lượng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thời lượng</SelectItem>
                  <SelectItem value="45">45 phút</SelectItem>
                  <SelectItem value="60">60 phút</SelectItem>
                  <SelectItem value="90">90 phút</SelectItem>
                  <SelectItem value="120">120 phút</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm chính sách mới
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
