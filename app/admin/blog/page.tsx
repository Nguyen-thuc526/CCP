"use client"

import { useState } from "react"
import { BlogForm } from "@/components/admin/blog/blog-form"
import { BlogList } from "@/components/admin/blog/blog-list"

export default function BlogPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleFormSuccess = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blog & Tin tức</h1>
        <BlogForm onSuccess={handleFormSuccess} />
      </div>
      <BlogList refreshTrigger={refreshTrigger} />
    </div>
  )
}
