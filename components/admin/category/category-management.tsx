"use client"

import React, { useEffect, useState } from 'react'
import { getCategoryData } from '@/services/categoryService'
import { Category as CategoryEnum } from '@/utils/enum' // assuming enum is here
import { Category } from '@/types/category'
import CategoryStats from './category-stats'
import CategoryFilters from './category-filters'
import CategoryList from './category-list'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import CreateCategoryForm from '@/components/admin/category/create-category-form'
export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<number>(-1) // -1 = all
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    if (dialogOpen) {
      getCategoryData().then(setCategories)
    }
  }, [dialogOpen])
  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === -1 || category.status === statusFilter
    return matchesSearch && matchesStatus
  })

  useEffect(() => {
    getCategoryData()
      .then((data) => {
        setCategories(data)
        setError(null)
      })
      .catch((err) => {
        setError('Không thể tải danh mục')
        console.error(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản lý Category</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>Tạo danh mục</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo danh mục mới</DialogTitle>
            </DialogHeader>
            <CreateCategoryForm
              categories={categories}
              onCreated={() => {
                getCategoryData().then(setCategories)
              }}
              onClose={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

      </div>

      {error && <div className="text-red-500">{error}</div>}

      {isLoading ? (
        <div className="text-center">Đang tải...</div>
      ) : (
        <>
          <CategoryStats categories={filteredCategories} />

          <CategoryFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <CategoryList
            categories={filteredCategories}
          />
        </>
      )}
    </div>
  )
}
