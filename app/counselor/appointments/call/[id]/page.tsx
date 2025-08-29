import VideoManage from "@/components/counselor/appointment/call/VideoManage"


interface CallPageProps {
  params: Promise<{ id: string }>
}

export default async function CallPage({ params }: CallPageProps) {
  const { id } = await params

  return <VideoManage appointmentId={id} />
}
