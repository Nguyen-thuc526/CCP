"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Eye, Trash2, FileText } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { PostItem } from "@/types/post"
import { PostService } from "@/services/postService"
import { BlogViewModal } from "./blog-view-modal"
import { BlogEditModal } from "./blog-edit-modal"
import { useToast, ToastType } from "@/hooks/useToast"

interface BlogListProps {
  refreshTrigger?: number
}

export function BlogList({ refreshTrigger }: BlogListProps) {
  const [posts, setPosts] = useState<PostItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [viewPostId, setViewPostId] = useState<string | null>(null)
  const [editPost, setEditPost] = useState<PostItem | null>(null)
  const { showToast } = useToast()

  useEffect(() => {
    loadPosts()
  }, [refreshTrigger])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const data = await PostService.getPosts()
      setPosts(data)
    } catch (error) {
      console.error(error)
      showToast("Tải danh sách bài viết thất bại!", ToastType.Error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedId) return
    try {
      const result = await PostService.deletePost(selectedId)
      if (result.success) {
        setPosts((prev) => prev.filter((post) => post.id !== selectedId))
        showToast("Xoá bài viết thành công!", ToastType.Success)
      } else {
        showToast("Xoá bài viết thất bại!", ToastType.Error)
      }
    } catch (error) {
      console.error(error)
      showToast("Xoá bài viết thất bại!", ToastType.Error)
    } finally {
      setSelectedId(null)
    }
  }

  const handleEditSuccess = () => {
    setEditPost(null)
    loadPosts()
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium">Ảnh Thumbnail</th> {/* New column header */}
                  <th className="h-12 px-4 text-left align-middle font-medium">Tiêu đề</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Ngày</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Lượt xem</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Trạng thái</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4"> {/* Updated colspan */}
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4"> {/* Updated colspan */}
                      Không có bài viết nào.
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle"> {/* New column for thumbnail */}
                        <img
                          src={post.image || "/placeholder.svg?height=64&width=64&query=blog post thumbnail"}
                          alt={post.title}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </td>
                      <td className="p-4 align-middle">
                        <div className="max-w-[300px] truncate font-medium">{post.title}</div>
                      </td>
                      <td className="p-4 align-middle">{new Date(post.createAt).toLocaleDateString("vi-VN")}</td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          {post.views ?? 0}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge variant={post.status === 1 ? "default" : "secondary"}>
                          {post.status === 1 ? "Công khai" : "Ẩn"}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setViewPostId(post.id)}
                            title="Xem chi tiết"
                          >
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">Xem chi tiết</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setEditPost(post)} title="Chỉnh sửa">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Chỉnh sửa</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedId(post.id)} title="Xoá">
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Xoá</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {/* Delete Confirmation Dialog */}
      <Dialog open={selectedId !== null} onOpenChange={() => setSelectedId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bạn có chắc muốn xoá bài viết này?</DialogTitle>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setSelectedId(null)}>
              Huỷ
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Xoá
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* View Post Modal */}
      {viewPostId && <BlogViewModal postId={viewPostId} open={!!viewPostId} onOpenChange={() => setViewPostId(null)} />}
      {/* Edit Post Modal */}
      {editPost && (
        <BlogEditModal
          post={editPost}
          open={!!editPost}
          onOpenChange={() => setEditPost(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  )
}
