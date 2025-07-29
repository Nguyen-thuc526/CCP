'use client'

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { TiptapEditor } from './tiptap-editor'

export interface UpdatePersonTypePayload {
    id: string
    categoryId: string
    description: string
    detail: string
    compatibility: number
    image: string
}

interface EditResultPersonTypeModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (data: UpdatePersonTypePayload) => void
    isSaving: boolean
    formValues: UpdatePersonTypePayload
    onChange: (field: keyof UpdatePersonTypePayload, value: string | number) => void
}

export default function EditResultPersonTypeModal({
    open,
    onClose,
    onSubmit,
    isSaving,
    formValues,
    onChange,
}: EditResultPersonTypeModalProps) {
    console.log('EditResultPersonTypeModal rendered with values:', formValues)
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa kết quả tính cách</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Mô tả */}
                    <div className="grid gap-2">
                        <Label>Mô tả</Label>
                        <Input
                            value={formValues.description}
                            onChange={(e) => onChange('description', e.target.value)}
                            placeholder="Nhập mô tả ngắn..."
                        />
                    </div>

                    {/* Chi tiết với Tiptap */}
                    <div className="grid gap-2">
                        <Label>Chi tiết</Label>
                        <TiptapEditor
                            content={formValues.detail}
                            onChange={(html) => onChange('detail', html)}
                            placeholder="Nhập nội dung chi tiết..."
                        />
                    </div>

                    {/* Hình ảnh */}
                    <div className="grid gap-2">
                        <Label>Hình ảnh</Label>
                        <Input
                            value={formValues.image}
                            onChange={(e) => onChange('image', e.target.value)}
                            placeholder="URL hình ảnh"
                        />
                    </div>

                    {/* Độ tương thích */}
                    <div className="grid gap-2">
                        <Label>Độ tương thích (%)</Label>
                        <Input
                            type="number"
                            min={0}
                            max={100}
                            value={formValues.compatibility}
                            onChange={(e) => onChange('compatibility', Number(e.target.value))}
                        />
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button onClick={() => onSubmit(formValues)} disabled={isSaving}>
                        {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
