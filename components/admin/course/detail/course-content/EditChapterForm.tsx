"use client";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { VideoUploader } from "./VideoUploader";
import { ArticleEditor } from "./ArticleEditor";
import { QuizCreator } from "./QuizCreator";
import { ToastType, useToast } from "@/hooks/useToast";
import type { Chapter, ChapterDetail, QuizBasicInfo } from "@/types/course";
import { useState, useEffect, useMemo } from "react";

interface EditChapterFormProps {
  chapter: Chapter;
  onSave: () => void;
  onCancel: () => void;
  onChapterChange: (chapter: Chapter) => void;
  videoInputRef: React.RefObject<HTMLInputElement>;
  detail?: ChapterDetail;
}

export function EditChapterForm({
  chapter,
  onSave,
  onCancel,
  onChapterChange,
  videoInputRef,
  detail,
}: EditChapterFormProps) {
  const { showToast } = useToast();

  // Merge dữ liệu fallback một lần duy nhất
  const mergedChapter: Chapter = useMemo(() => {
    return {
      ...chapter,
      title: chapter.title || detail?.name || "",
      description: chapter.description || detail?.description || "",
      content: chapter.content || detail?.lecture?.lectureMetadata || "",
      videoUrl: chapter.videoUrl || detail?.video?.videoUrl || "",
      duration: chapter.duration || detail?.video?.timeVideo || "",
    };
  }, [chapter, detail]);

  const [localChapter, setLocalChapter] = useState<Chapter>(mergedChapter);

  const [quizBasicInfo, setQuizBasicInfo] = useState<QuizBasicInfo>({
    name: mergedChapter.title,
    description: mergedChapter.description,
  });

  // Nếu chapter thay đổi từ bên ngoài, sync lại local state
  useEffect(() => {
    setLocalChapter(mergedChapter);
    if (chapter.type === "quiz") {
      setQuizBasicInfo({
        name: mergedChapter.title,
        description: mergedChapter.description,
      });
    }
  }, [mergedChapter, chapter.type]);

  const updateChapter = (updates: Partial<Chapter>) => {
    setLocalChapter((prev) => {
      const updated = { ...prev, ...updates };
      onChapterChange(updated); // thông báo ngược ra ngoài mỗi khi thay đổi
      return updated;
    });
  };

  const handleQuizBasicInfoChange = (info: QuizBasicInfo) => {
    setQuizBasicInfo(info);
    updateChapter({
      title: info.name,
      description: info.description,
    });
  };

  const handleSave = () => {
    onChapterChange(localChapter); // đảm bảo gửi bản đã merge đầy đủ
    onSave();
  };

  return (
    <div className="p-4 border rounded-lg space-y-4 bg-muted/20">
      <h3 className="font-semibold">Chỉnh sửa chương: {localChapter.title}</h3>

      {localChapter.type === "video" && (
        <VideoUploader
          videoUrl={localChapter.videoUrl}
          duration={localChapter.duration}
          uploadProgress={localChapter.uploadProgress}
          title={localChapter.title}
          description={localChapter.description}
          onTitleChange={(title) => updateChapter({ title })}
          onDescriptionChange={(desc) => updateChapter({ description: desc })}
          onUploadComplete={(videoUrl, duration) => {
            updateChapter({
              videoUrl,
              content: videoUrl,
              duration,
              uploadProgress: undefined,
            });
            showToast("Video đã được tải lên.", ToastType.Success);
          }}
          id={`edit-${localChapter.id}`}
        />
      )}

      {localChapter.type === "article" && (
        <ArticleEditor
          title={localChapter.title}
          description={localChapter.description}
          content={localChapter.content}
          onTitleChange={(title) => updateChapter({ title })}
          onDescriptionChange={(description) =>
            updateChapter({ description })
          }
          onContentChange={(content) => updateChapter({ content })}
          id={`edit-${localChapter.id}`}
        />
      )}

      {localChapter.type === "quiz" && (
        <div className="space-y-6">
          <QuizCreator
            onTitleChange={(title) => updateChapter({ title })}
            onDescriptionChange={(description) =>
              updateChapter({ description })
            }
            basicInfo={quizBasicInfo}
            onBasicInfoChange={handleQuizBasicInfoChange}
            id={`edit-quiz-${localChapter.id}`}
          />
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" /> Hủy
        </Button>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" /> Lưu chương
        </Button>
      </div>
    </div>
  );
}
