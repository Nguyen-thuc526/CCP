import { CounselorStats } from "@/components/counselor/counselor-stats"
import { UpcomingAppointments } from "@/components/counselor/upcoming-appointments"
import { RecentConsultations } from "@/components/counselor/recent-consultations"
import { ClientOverview } from "@/components/counselor/client-overview"
import { WalletOverview } from "@/components/counselor/wallet/wallet-overview"
import { RecentTransactions } from "@/components/counselor/transactions/recent-transactions"


export default function CounselorDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tổng quan</h1>
      <CounselorStats />

      {/* Wallet Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WalletOverview />
        </div>
        <div>
          <RecentTransactions />
        </div>
      </div>
        <RecentConsultations />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* <ClientOverview /> */}
      </div>
      {/* <UpcomingAppointments /> */}
    </div>
  )
}
