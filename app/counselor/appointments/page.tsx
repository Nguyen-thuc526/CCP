import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppointmentList } from "@/components/counselor/appointment/appointment-list"

import { Calendar, ClipboardList, Clock, History } from "lucide-react"
import { AppointmentRequests } from "@/components/counselor/appointment/appointment-requests"
import { AppointmentHistory } from "@/components/counselor/appointment/appointment-history"

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Lịch hẹn tư vấn</h1>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Yêu cầu lịch hẹn
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Lịch hẹn sắp tới
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Lịch sử
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <AppointmentRequests />
        </TabsContent>

        <TabsContent value="upcoming">
          <AppointmentList />
        </TabsContent>

        <TabsContent value="history">
          <AppointmentHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}
