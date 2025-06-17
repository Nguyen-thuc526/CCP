import { Card, CardContent } from '@/components/ui/card'
import { Category } from '@/types/category'
import React from 'react'

interface CategoryStatsProps {
    categories: Category[]
}
export default function CategoryStats({ categories }: CategoryStatsProps) {
    const getStats = () => {
        const totalCategories = categories.length
        const categoriesWithSub = categories.filter((cat) => cat.subCategories.length > 0).length
        const totalSubCategories = categories.reduce(
            (acc, cat) => acc + cat.subCategories.length,
            0
        )
        const activeCategories = categories.filter((cat) => cat.status === 1).length
        const activeSubCategories = categories.reduce(
            (acc, cat) =>
                acc + cat.subCategories.filter((sub) => sub.status === 1).length,
            0
        )

        return {
            totalCategories,
            categoriesWithSub,
            totalSubCategories,
            activeCategories,
            activeSubCategories,
        }
    }

    const stats = getStats()

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
                <CardContent className="p-4">
                    <div className="text-2xl font-bold">{stats.totalCategories}</div>
                    <div className="text-sm text-muted-foreground">Tổng danh mục</div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">{stats.activeCategories}</div>
                    <div className="text-sm text-muted-foreground">Danh mục đang hoạt động</div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalSubCategories}</div>
                    <div className="text-sm text-muted-foreground">Tổng danh mục con</div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4">
                    <div className="text-2xl font-bold text-purple-600">{stats.activeSubCategories}</div>
                    <div className="text-sm text-muted-foreground">Danh mục con hoạt động</div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4">
                    <div className="text-2xl font-bold text-orange-600">{stats.categoriesWithSub}</div>
                    <div className="text-sm text-muted-foreground">Danh mục có danh mục con</div>
                </CardContent>
            </Card>
        </div>
    )
}
