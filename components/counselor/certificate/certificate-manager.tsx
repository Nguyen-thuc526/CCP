"use client"
import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FilePlus, Award, Clock, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import SubmitCertificateModal from "./submit-certificate-modal"
import RejectedCertificates from "./rejected-certificates"
import PendingCertificates from "./pending-certificates"
import CertificateList from "./certificate-list"
import { certificationService } from "@/services/certificationService"
import { useToast, ToastType } from "@/hooks/useToast"
import type { Certification, MyCertificationsResponse } from "@/types/certification"
import { CertificateStatus } from "@/utils/enum"

export default function CertificateManager() {
  const [activeTab, setActiveTab] = useState("approved")
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [certificationCounts, setCertificationCounts] = useState({
    approved: 0,
    pending: 0,
    rejected: 0,
  })
  const { showToast } = useToast()

  const fetchCertifications = async () => {
    try {
      console.log("Fetching certifications at", new Date().toLocaleString())
      const response = await certificationService.getMyCertifications()
      if (response.success) {
        setCertifications(response.data)
        const counts = response.data.reduce(
          (acc, cert) => {
            if (cert.status === CertificateStatus.Active) acc.approved++
            else if (cert.status === CertificateStatus.Pending) acc.pending++
            else if (cert.status === CertificateStatus.NeedEdit) acc.rejected++
            return acc
          },
          { approved: 0, pending: 0, rejected: 0 }
        )
        setCertificationCounts(counts)
        console.log("Certification counts:", counts)
      } else {
        showToast("Lỗi khi tải danh sách chứng chỉ.", ToastType.Error)
        console.log("API response indicated failure:", response)
      }
    } catch (error: any) {
      showToast(error.message || "Không thể tải danh sách chứng chỉ.", ToastType.Error)
      console.log("API call failed:", error.message, error.response?.data)
    }
  }

  useEffect(() => {
    let isMounted = true
    fetchCertifications()
    return () => {
      isMounted = false
    }
  }, [])

  const handleSubmitSuccess = () => {
    setShowSubmitModal(false)
    setActiveTab("pending")
    fetchCertifications() // Refetch after submitting a new certificate
  }

  // Filter certifications by status
  const approvedCerts = certifications.filter((cert) => cert.status === CertificateStatus.Active)
  const pendingCerts = certifications.filter((cert) => cert.status === CertificateStatus.Pending)
  const rejectedCerts = certifications.filter((cert) => cert.status === CertificateStatus.NeedEdit)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Quản lý chứng chỉ</h2>
          <p className="text-muted-foreground">Quản lý và theo dõi các chứng chỉ của bạn</p>
        </div>
        <Button onClick={() => setShowSubmitModal(true)} className="flex items-center gap-2">
          <FilePlus className="w-4 h-4" />
          Tạo chứng chỉ mới
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Đã duyệt
            <Badge variant="secondary" className="ml-1">
              {certificationCounts.approved}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Đang chờ duyệt
            <Badge variant="outline" className="ml-1">
              {certificationCounts.pending}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Cần chỉnh sửa
            <Badge variant="destructive" className="ml-1">
              {certificationCounts.rejected}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approved" className="mt-6">
          <CertificateList certifications={approvedCerts} />
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <PendingCertificates certifications={pendingCerts} onUpdate={fetchCertifications} />
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          <RejectedCertificates
            certifications={rejectedCerts}
            onEditSuccess={() => {
              setActiveTab("pending")
              fetchCertifications()
            }}
          />
        </TabsContent>

        <SubmitCertificateModal
          open={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          onSuccess={handleSubmitSuccess}
        />
      </Tabs>
    </div>
  )
}