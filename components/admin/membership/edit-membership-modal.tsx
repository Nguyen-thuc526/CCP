"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useFormik } from "formik"
import { membershipEditSchema } from "@/lib/schemas/membershipSchema"
import { Membership } from "@/types/membership"
import { updateMembership } from "@/services/membership"
import { useToast, ToastType } from "@/hooks/useToast"

interface EditMembershipModalProps {
    open: boolean
    onClose: () => void
    membership: Membership | null
    onUpdated: () => void
}
export default function EditMembershipModal({
    open,
    onClose,
    membership,
    onUpdated,
}: EditMembershipModalProps) {
    const { showToast } = useToast()
    const formik = useFormik({
        initialValues: {
            id: membership?.id ?? "",
            memberShipName: membership?.memberShipName ?? "",
            price: membership?.price ?? 0,
            expiryDate: membership?.expiryDate ?? 30,
            discountCourse: membership?.discountCourse ?? 0,
            discountBooking: membership?.discountBooking ?? 0,
            rank: membership?.rank ?? 0,
        },
        enableReinitialize: true,
        validationSchema: membershipEditSchema,
        onSubmit: async (values) => {
            try {
                await updateMembership(values)
                showToast("Cập nhật thành công!", ToastType.Success)
                onUpdated()
                onClose()
            } catch (error) {
                showToast("Cập nhật thất bại!", ToastType.Error)
            }
        },
    })

    return (
        <Dialog open={open}  onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa gói Membership</DialogTitle>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <Label>Tên gói</Label>
                        <Input
                            name="memberShipName"
                            value={formik.values.memberShipName}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Giá (VNĐ)</Label>
                            <Input
                                type="number"
                                name="price"
                                value={formik.values.price}
                                onChange={formik.handleChange}
                            />
                        </div>
                        <div>
                            <Label>Số ngày hiệu lực</Label>
                            <Input
                                type="number"
                                name="expiryDate"
                                value={formik.values.expiryDate}
                                onChange={formik.handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Giảm giá khóa học (%)</Label>
                            <Input
                                type="number"
                                name="discountCourse"
                                value={formik.values.discountCourse}
                                onChange={formik.handleChange}
                            />
                        </div>
                        <div>
                            <Label>Giảm giá đặt lịch (%)</Label>
                            <Input
                                type="number"
                                name="discountBooking"
                                value={formik.values.discountBooking}
                                onChange={formik.handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Hạng (Rank)</Label>
                        <Input
                            type="number"
                            name="rank"
                            value={formik.values.rank}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="flex justify-end pt-4 gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button type="submit">Lưu</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}