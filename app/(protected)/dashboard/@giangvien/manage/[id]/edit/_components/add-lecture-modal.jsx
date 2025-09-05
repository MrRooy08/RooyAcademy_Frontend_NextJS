"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Upload, Plus, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCreateLessonBySectionMutation, useUpdateLessonBySectionMutation } from "@/app/features/courses/courseApi"
import { toast } from "sonner"
import { chunkFile } from "@/lib/media"
import ReactQuill from "react-quill-new"
import "react-quill-new/dist/quill.snow.css"




export function AddLectureModal({ isOpen, onClose,
  sectionId,
  editingLesson, mode = "add", position, onUploadSuccess }) {
  const [createLessonBySection] = useCreateLessonBySectionMutation()
  const [updateLessonBySection] = useUpdateLessonBySectionMutation()
  const videoUrlRef = useRef(null)
  const [index, setIndex] = useState(0);
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [video, setVideo] = useState(null)
  const [resources, setResources] = useState([])
  const [isPreviewable, setIsPreviewable] = useState("")
  const [showResourceModal, setShowResourceModal] = useState(false)

  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");

  console.log("sectionId", sectionId)


  // Safe cleanup video URL
  const cleanupVideoUrl = useCallback(() => {
    if (videoUrlRef.current) {
      try {
        URL.revokeObjectURL(videoUrlRef.current)
      } catch (error) {
        // Ignore errors if URL is already revoked
        console.warn("Video URL cleanup warning:", error)
      }
      videoUrlRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      cleanupVideoUrl();
      setVideoPreviewUrl("");
    };
  }, [cleanupVideoUrl]);


  // Reset form function
  const resetForm = useCallback(() => {
    setTitle("")
    setDescription("")
    cleanupVideoUrl()
    setVideo(null)
    setResources([])
    setIsPreviewable(false)
  }, [cleanupVideoUrl])

  // Populate form khi modal mở
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && editingLesson) {
        setTitle(editingLesson.title || "")
        setDescription(editingLesson.description || "")
        setContent(editingLesson.content || "")
        setVideo(editingLesson.videoUrl || null)
        if (typeof editingLesson.videoUrl === "string") {
          const previewUrl = editingLesson.videoUrl.startsWith("http")
            ? editingLesson.videoUrl
            : `${process.env.NEXT_PUBLIC_API_URL_VIDEO_LESSON}${editingLesson.id}/${editingLesson.videoUrl}`;
          setVideoPreviewUrl(previewUrl); // giữ URL cố định
        }
        setResources(
          Object.entries(editingLesson.mediaList || {}).map(([id, name]) => ({
            id: id,
            type: "file",
            title: name,
            file: name,
          }))
        )
        setIsPreviewable(String(editingLesson?.isPreviewable).toLowerCase() === "true");
        console.log("editingLesson", editingLesson);
      }
    }
  }, [isOpen, mode, editingLesson])

  const handleClose = useCallback(() => {
    setShowResourceModal(false)
    onClose()
  }, [onClose])



  const handleSubmit = async () => {
    if (!title.trim()) return
    const mediaKept = resources
      .filter(r => r.type === "file" && typeof r.file !== "object") // file không phải là File object (tức là cũ)
      .map(r => r.id); // dùng id để gửi về mediaKept

    const lesson = {
      name: title,
      description: description,
      content: content,
      isPreviewable: isPreviewable.toString(),
      mediaKept: mediaKept,
      index: position + 1,
    }

    const files = resources.filter((r) => r.type === "file" && r.file instanceof File).map((r) => r.file)
    try {
      if (mode === "edit") {
        console.log("🚀 ~ handleSubmit ~ video:", video)
        if (video instanceof File) {
          onUploadSuccess(video);
        }
        await updateLessonBySection({
          lessonId: 0,
          lesson: lesson,
          files: files,
          videoFile: video,
        }).unwrap()
        toast.success("Chỉnh sửa thành công !", {
          description: Date.now().toString(),
          action: {
            label: "Undo",
          },
          duration: 3000,
          position: "top-right",
          style: {
            backgroundColor: '#4caf50',
            color: 'white',
            borderRadius: '10px',
          },
        })
        // resetForm()
        onClose();
      } else {
        await createLessonBySection({
          sectionId,
          lesson: lesson,
          files: files,
          videoFile: video,
        }).unwrap()
        toast.success("Thêm thành công !", {
          description: Date.now().toString(),
          action: {
            label: "Undo",
          },
          duration: 3000,
          position: "top-right",
          style: {
            backgroundColor: '#4caf50',
            color: 'white',
            borderRadius: '10px',
          },
        })
        // resetForm()
        onClose();
      }
      handleClose()
    } catch (error) {
      toast.error("Có lỗi xảy ra!", {
        description: `Chi tiết: ${Date.now().toString()}`,
        action: {
          label: "Undo",
        },
        duration: 2000,
        position: "top-right",
        style: {
          backgroundColor: '#f44336',
          color: 'white',
          borderRadius: '10px',
          fontWeight: 'bold',
        },
      });
      onClose();
    }
  }

  const addResource = useCallback((resource) => {
    setResources((prev) => [...prev, resource])
    setShowResourceModal(false)
  }, [])

  const removeResource = useCallback((id) => {
    setResources((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const handleVideoUpload = (event) => {
    console.log("🚀 ~ handleVideoUpload ~ event:", event)
    const file = event.target.files?.[0];
    if (file) {
      cleanupVideoUrl(); // clear cái cũ
      const url = URL.createObjectURL(file);
      videoUrlRef.current = url;
      setVideo(file);
      setVideoPreviewUrl(url); // lưu URL ra state
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{mode === "edit" ? "Chỉnh sửa bài giảng" : "Thêm bài giảng"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="lecture-title">Tiêu đề bài giảng</Label>
              <Input
                required
                id="lecture-title"
                placeholder="Nhập tiêu đề bài giảng"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="lecture-description">Mô tả bài giảng</Label>
              <Textarea
                id="lecture-description"
                placeholder="Nhập mô tả bài giảng (tùy chọn)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="lecture-content">Nội dung bài giảng</Label>
              <ReactQuill
                value={content}
                onChange={(value) => setContent(value)}
                placeholder="Nhập nội dung bài giảng (tùy chọn)"
                theme="snow"
                modules={{
                  toolbar: [
                    ["bold", "italic", "underline"],
                    [{ list: "ordered" }],
                    ["link"]
                  ]
                }}
              />
            </div>

            <div>
              <Label className="text-base font-medium">Video bài giảng</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg text-center">
                {video ? (
                  <div className="space-y-4">
                    <video
                      controls
                      src={videoPreviewUrl}
                      className="w-full h-auto max-h-64 object-cover rounded-lg"
                    />
                    <p className="text-sm font-medium">{typeof video === "string" ? "Video hiện tại" : video.name}</p>
                    {typeof video !== "string" && (
                      <p className="text-xs text-gray-500">{(video.size / 1024 / 1024).toFixed(2)} MB</p>
                    )}

                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      id="video-upload-replace"
                    />
                    <Button variant="outline" asChild>
                      <label htmlFor="video-upload-replace" className="cursor-pointer">
                        Thay đổi video
                      </label>
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      Tải lên video bài giảng của bạn. Định dạng hỗ trợ: .mp4, .mov, .avi
                    </p>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      id="video-upload"
                    />
                    <Button variant="outline" asChild>
                      <label htmlFor="video-upload" className="cursor-pointer">
                        Tải lên video
                      </label>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {video && (
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    i
                  </div>
                  <div>
                    <Label htmlFor="preview-toggle" className="text-sm font-medium">
                      Cho phép học viên xem trước bài giảng này
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">
                      Bài giảng có thể xem trước sẽ giúp thu hút học viên đăng ký khóa học
                    </p>
                  </div>
                </div>
                <Switch id="preview-toggle" checked={isPreviewable} onCheckedChange={setIsPreviewable} />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Tài nguyên</Label>
                <Button variant="outline" size="sm" onClick={() => setShowResourceModal(true)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm tài nguyên
                </Button>
              </div>

              {resources.length > 0 && (
                <div className="space-y-2 border rounded-lg p-3">
                  {resources.map((resource, index) => (
                    <div key={resource.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">{resource.title} </span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({resource.type === "file" ? "File" : "Liên kết ngoài"})
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeResource(resource.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={!title.trim()}>
              {mode === "edit" ? "Cập nhật bài giảng" : "Thêm bài giảng"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resource Modal - chỉ render khi cần */}
      {showResourceModal && (
        <ResourceModal isOpen={showResourceModal} onClose={() => setShowResourceModal(false)} onAdd={addResource} />
      )}
    </>
  )
}

function ResourceModal({ isOpen, onClose, onAdd }) {
  const [activeTab, setActiveTab] = useState("downloadable")
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    if (!isOpen) {
      setTitle("")
      setUrl("")
      setSelectedFile(null)
      setActiveTab("downloadable")
    }
  }, [isOpen])

  const handleAddResource = () => {
    if (activeTab === "downloadable" && selectedFile && title) {
      onAdd({
        id: Date.now().toString(),
        type: "file",
        title,
        file: selectedFile,
      })
    } else if (activeTab === "external" && title && url) {
      onAdd({
        id: Date.now().toString(),
        type: "external",
        title,
        url,
      })
    }

    setTitle("")
    setUrl("")
    setSelectedFile(null)
    onClose()
  }

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (!title) {
        setTitle(file.name)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Thêm tài nguyên</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="downloadable">File có thể tải xuống</TabsTrigger>
            <TabsTrigger value="library">Thêm từ thư viện</TabsTrigger>
            <TabsTrigger value="external">Tài nguyên bên ngoài</TabsTrigger>
            <TabsTrigger value="source">Mã nguồn</TabsTrigger>
          </TabsList>

          <TabsContent value="downloadable" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {selectedFile ? (
                <div className="space-y-2">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <input type="file" onChange={handleFileSelect} className="hidden" id="file-upload-replace" />
                  <Button variant="outline" asChild>
                    <label htmlFor="file-upload-replace" className="cursor-pointer">
                      Thay đổi file
                    </label>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-500">Không có file nào được chọn</p>
                  <input type="file" onChange={handleFileSelect} className="hidden" id="file-upload" />
                  <Button variant="outline" asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Chọn file
                    </label>
                  </Button>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="file-title">Tiêu đề</Label>
              <Input
                id="file-title"
                placeholder="Tiêu đề mô tả"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <Button onClick={handleAddResource} disabled={!selectedFile || !title} className="w-full">
              Thêm tài nguyên
            </Button>
          </TabsContent>

          <TabsContent value="external" className="space-y-4">
            <div>
              <Label htmlFor="external-title">Tiêu đề</Label>
              <Input
                id="external-title"
                placeholder="Tiêu đề mô tả"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="external-url">URL</Label>
              <Input
                id="external-url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <Button
              onClick={handleAddResource}
              disabled={!title || !url}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Thêm đường liên kết
            </Button>
          </TabsContent>

          <TabsContent value="library">
            <div className="text-center py-8 text-gray-500">Tính năng thư viện sẽ sớm được cập nhật</div>
          </TabsContent>

          <TabsContent value="source">
            <div className="text-center py-8 text-gray-500">Tính năng mã nguồn sẽ sớm được cập nhật</div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
