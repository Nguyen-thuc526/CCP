import AppointmentDetail from "@/components/counselor/appointment/appointment-detail"


interface AppointmentDetailPageProps {
  params: Promise<{ id: string }> // Xác định params là Promise
}

export default async function AppointmentDetailPage({ params }: AppointmentDetailPageProps) {
  // Await params để lấy giá trị id
  const resolvedParams = await params
  const { id } = resolvedParams

  return (
    <div className="space-y-6">
      <AppointmentDetail appointmentId={id} />
    </div>
  )
}