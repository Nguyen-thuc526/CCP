import { PaymentList } from "@/components/counselor/payment-list"
import { PaymentFilters } from "@/components/counselor/payment-filters"

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Chính sách thanh toán</h1>
      <PaymentFilters />
      <PaymentList />
    </div>
  )
}
