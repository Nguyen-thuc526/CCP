import { WalletDashboard } from "@/components/counselor/wallet/wallet-dashboard";


export default function WalletPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Quản lý ví</h1>
      <WalletDashboard />
    </div>
  )
}
