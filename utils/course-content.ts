import { Chapter } from "@/types/course"


export const getChapterIcon = (type: string) => {
  switch (type) {
    case "video":
      return "PlayCircle"
    case "article":
      return "FileText"
    case "quiz":
      return "HelpCircle"
    default:
      return "FileText"
  }
}

export const getChapterTypeLabel = (chapter: Chapter) => {
  switch (chapter.type) {
    case "video":
      return `Video • ${chapter.duration || "Chưa có thời lượng"}`
    case "article":
      return "Bài viết"
    case "quiz":
      return `Quiz • ${chapter.quiz?.length || 0} câu hỏi`
    default:
      return "Không xác định"
  }
}

export const validateChapter = (chapter: Partial<Chapter>): boolean => {
  if (!chapter.title?.trim()) return false

  switch (chapter.type) {
    case "article":
      return !!chapter.content?.trim()
    case "video":
      return !!(chapter.videoFile || chapter.videoUrl || chapter.content)
    case "quiz":
      return !!(chapter.quiz && chapter.quiz.length > 0)
    default:
      return false
  }
}

export const createEmptyChapter = (): Omit<Chapter, "id"> => ({
  title: "",
  type: "article",
  content: "",
  description: "",
  videoFile: undefined,
  videoUrl: undefined,
  duration: "",
  uploadProgress: undefined,
  quiz: [],
})

export const simulateVideoUpload = (
  file: File,
  onProgress: (progress: number) => void,
  onComplete: (videoUrl: string) => void,
) => {
  let progress = 0
  const interval = setInterval(() => {
    progress += 10
    onProgress(progress)

    if (progress >= 100) {
      clearInterval(interval)
      const videoUrl = URL.createObjectURL(file)
      onComplete(videoUrl)
    }
  }, 200)

  return interval
}
