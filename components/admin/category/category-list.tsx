"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Category } from "@/types/category"
import { ChevronDown, Folder, FolderOpen, Tag } from "lucide-react"

interface CategoryListProps {
  categories: Category[]
}

export default function CategoryList({ categories }: CategoryListProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full flex items-center justify-center mb-6">
          <Folder className="w-12 h-12 text-rose-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có danh mục nào</h3>
        <p className="text-gray-500 text-center max-w-md">Không có danh mục phù hợp với tiêu chí tìm kiếm của bạn.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {categories.map((category) => {
        const isOpen = expanded[category.id]
        const isActive = category.status === 1

        return (
          <Card
            key={category.id}
            className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
          >
            <CardHeader
              className="flex flex-row justify-between items-center cursor-pointer p-6 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 transition-all duration-300"
              onClick={() => toggleExpand(category.id)}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    isOpen
                      ? "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg"
                      : "bg-gradient-to-br from-rose-100 to-pink-100 text-rose-600 group-hover:from-rose-200 group-hover:to-pink-200"
                  }`}
                >
                  {isOpen ? <FolderOpen className="w-6 h-6" /> : <Folder className="w-6 h-6" />}
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-rose-700 transition-colors">
                    {category.name}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge
                      variant={isActive ? "default" : "secondary"}
                      className={`text-xs font-medium ${
                        isActive
                          ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0"
                          : "bg-gray-100 text-gray-600 border-0"
                      }`}
                    >
                      {isActive ? "Hoạt động" : "Ẩn"}
                    </Badge>
                    {category.subCategories.length > 0 && (
                      <Badge variant="outline" className="text-xs text-rose-600 border-rose-200">
                        {category.subCategories.length} chủ đề con
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-rose-100 hover:text-rose-600 transition-all duration-300"
              >
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
              </Button>
            </CardHeader>

            {isOpen && (
              <CardContent className="pt-0 pb-6 px-6">
                <div className="border-t border-gray-100 pt-6">
                  {category.subCategories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.subCategories.map((sub) => {
                        const subIsActive = sub.status === 1
                        return (
                          <Card
                            key={sub.id}
                            className="group/sub border-0 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-rose-50 hover:to-pink-50 transition-all duration-300 hover:shadow-md hover:scale-105"
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-lg bg-white shadow-sm group-hover/sub:bg-rose-100 transition-colors">
                                  <Tag className="w-4 h-4 text-rose-500" />
                                </div>
                                <CardTitle className="text-base font-semibold text-gray-800 group-hover/sub:text-rose-700 transition-colors">
                                  {sub.name}
                                </CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <Badge
                                variant={subIsActive ? "default" : "secondary"}
                                className={`text-xs font-medium ${
                                  subIsActive
                                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0"
                                    : "bg-gray-200 text-gray-600 border-0"
                                }`}
                              >
                                {subIsActive ? "Hoạt động" : "Ẩn"}
                              </Badge>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                        <Tag className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-center font-medium">Chưa có chủ đề con nào</p>
                      <p className="text-gray-400 text-sm text-center mt-1">Danh mục này hiện tại chưa có chủ đề con</p>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}
