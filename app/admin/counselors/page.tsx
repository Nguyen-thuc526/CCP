import { CounselorManagement } from '@/components/admin/counselors/counselor-management'
import React from 'react'

export default function page() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Quản lý chuyên viên tư vấn</h1>
            <CounselorManagement/>
        </div>
    )
}
