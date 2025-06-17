'use client'

import { useState } from 'react'
import { createCategory } from '@/services/categoryService'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast, ToastType } from '@/hooks/useToast'
interface Props {
    onCreated: () => void
    onClose: () => void
    categories: { name: string }[]
}

export default function CreateCategoryForm({ onCreated, onClose, categories }: Props) {
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const { showToast } = useToast()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const trimmedName = name.trim()

        if (trimmedName.length < 2) {
            return showToast('Tên danh mục phải có ít nhất 2 ký tự', ToastType.Error)
        }
        const isDuplicate = categories.some(
            (category) => category.name.trim().toLowerCase() === trimmedName.toLowerCase()
        )

        if (isDuplicate) {
            return showToast('Tên danh mục đã tồn tại', ToastType.Error)
        }

        try {
            setLoading(true)
            await createCategory(trimmedName)
            toast.success('Tạo danh mục thành công')
            setName('')
            onCreated()
            onClose()
        } catch (err) {
            toast.error('Tạo danh mục thất bại')
        } finally {
            setLoading(false)
        }
    }


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm mb-1">Tên danh mục</label>
                <Input
                    placeholder="Nhập tên danh mục..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={onClose}>
                    Hủy
                </Button>
                <Button type="submit" disabled={loading || name.trim().length < 2}>
                    {loading ? 'Đang tạo...' : 'Tạo'}
                </Button>
            </div>
        </form>
    )
}
