"use client"

import React, { useEffect, useState } from 'react'
import { getCategoryData } from '@/services/categoryService'
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
import { useErrorLoadingWithUI } from '@/hooks/useErrorLoading'

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<number>(-1)
  const [dialogOpen, setDialogOpen] = useState(false)

  const {
    loading,
    error,
    startLoading,
    stopLoading,
    setErrorMessage,
    renderStatus,
  } = useErrorLoadingWithUI()

  const fetchCategories = () => {
    startLoading()
    getCategoryData()
      .then(setCategories)
      .catch((err) => {
        console.error(err)
        setErrorMessage('Không thể tải danh mục')
      })
      .finally(stopLoading)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (dialogOpen) {
      fetchCategories()
    }
  }, [dialogOpen])

  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === -1 || category.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
              onCreated={fetchCategories}
              onClose={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {renderStatus({ onRetry: fetchCategories })}

      {!loading && !error && (
        <>
          <CategoryStats categories={filteredCategories} />

          <CategoryFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <CategoryList categories={filteredCategories} />
        </>
      )}
    </div>
  )
}
