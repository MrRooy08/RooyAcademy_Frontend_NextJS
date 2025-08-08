"use client"

import { useState } from "react"
import {
  ArrowLeft,
  CheckCircle,
  Calendar,
  Tag,
  DollarSign,
  Target,
  Users,
  BookOpen,
  Play,
  Video,
  ImageIcon,
  FileText,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useGetCourseByCourseIdQuery, useGetCourseMetaQuery, useGetSectionByCourseQuery } from "@/app/features/courses/courseApi"
import { motion } from "framer-motion"
import LoadingSpinner from "@/app/_components/LoadingSpinner"
import { toast } from "sonner"

const getMediaIcon = (filename) => {
  const extension = filename.split(".").pop()?.toLowerCase()
  switch (extension) {
    case "mp4":
    case "avi":
    case "mov":
      return <Video className="w-4 h-4" />
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <ImageIcon className="w-4 h-4" />
    case "pdf":
    case "doc":
    case "docx":
      return <FileText className="w-4 h-4" />
    default:
      return <ImageIcon className="w-4 h-4" />
  }
}

const formatPrice = (price) => {
  return price !== null ? `${price} VND` : "Miễn phí"
}

const getLevelText = (level) => {
  switch (level) {
    case "TD01":
      return "Cơ bản"
    case "TD02":
      return "Trung cấp"
    case "TD03":
      return "Nâng cao"
    default:
      return "Không xác định"
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

export function PreviewPage({ courseId, onExit }) {
  const { data: courseDetailData, error: courseError } = useGetCourseByCourseIdQuery(courseId);
  const { data: courseMetaData, error: metaError } = useGetCourseMetaQuery(courseId);
  const { data: courseSectionData, error: sectionError } = useGetSectionByCourseQuery(courseId);
  const course = courseDetailData?.result;
  const courseMeta = courseMetaData?.result?.meta;
  const courseSections = courseSectionData?.result;
  console.log("coursesection", courseSections);


  const [previewVideo, setPreviewVideo] = useState({
    isOpen: false,
    videoUrl: "",
    lessonId: "",
  })

  const handlePreviewVideo = (videoUrl, lessonId) => {
    setPreviewVideo({
      isOpen: true,
      videoUrl,
      lessonId,
    })
  }

  const closePreviewVideo = () => {
    setPreviewVideo({
      isOpen: false,
      videoUrl: "",
      lessonId: "",
    })
  }


  const getLessonVideoUrl = (fileOrString, lessonId, baseUrl) => {
    if (fileOrString instanceof File || fileOrString instanceof Blob) {
      return URL.createObjectURL(fileOrString);
    }

    if (typeof fileOrString === "string") {
      return fileOrString.startsWith("http")
        ? fileOrString
        : `${baseUrl}${lessonId}/${fileOrString}`;
    }

    return "";
  };

  const ResourceDropdown = ({ mediaList = [] }) => {
    if (!mediaList.length) return null

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="xs" className="bg-transparent">
            <Download className="w-4 h-4 mr-1" />
            Tài nguyên
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {mediaList.map((file, idx) => (
            <DropdownMenuItem
              key={file.id}
              onClick={() => {
                const link = document.createElement("a");
                link.href = `/uploads/${file.name}`;
                link.download = file.name;
                link.click();
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              {file.name.length > 30 ? file.name.slice(0, 30) + "..." : file.name}
            </DropdownMenuItem>
          ))}

        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Show a spinner while data is loading
  if (!course || !courseMeta || !courseSections) {
    return <LoadingSpinner />
  }


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex-1 flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={onExit}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold text-gray-900">Chi tiết khóa học</h1>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Course Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{course.name}</CardTitle>
                    <CardDescription className="text-base">{course.subtitle}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    {course?.videoUrl ? (
                      <video
                        controls
                        src={`http://localhost:8080/files/courses/videos/${course.id}/${course.videoUrl}`}
                        type="video/mp4"
                        style={{ width: '100%', height: '100%' }}
                      />
                    ) : (
                      <p className="text-sm text-gray-500">Không có video hoặc ảnh preview</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-xs text-gray-500">Danh mục cha </div>
                      <div className="text-sm font-medium">{course.parentcategory}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-xs text-gray-500">Danh mục</div>
                      <div className="text-sm font-medium">{course.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-xs text-gray-500">Giá</div>
                      <div className="text-sm font-medium">{formatPrice(course.price)}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-xs text-gray-500">Chủ đề</div>
                      <div className="text-sm font-medium">{course.topic}</div>

                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-xs text-gray-500">Cấp độ</div>
                      <div className="text-sm font-medium">{getLevelText(course.levelCourse)}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Mục tiêu khóa học</span>
                </CardTitle>
                <CardDescription>Những gì học viên sẽ đạt được sau khi hoàn thành khóa học</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 max-w-1xl">
                  {courseMeta?.GOAL?.map((goal, index) => (
                    <li key={goal.id} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm break-words max-w-2xl">{goal.content}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Target Audience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Đối tượng học viên</span>
                </CardTitle>
                <CardDescription>Khóa học này phù hợp với những ai</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {courseMeta?.AUDIENCE?.map((audience, index) => (
                    <li key={audience.id} className="flex items-start space-x-2">
                      <Users className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm break-words max-w-2xl">{audience.content}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Yêu cầu trước khi học</span>
                </CardTitle>
                <CardDescription>Kiến thức và công cụ cần thiết</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {courseMeta?.REQUIREMENT?.map((requirement, index) => (
                    <li key={requirement.id} className="flex items-start space-x-2">
                      <div className="w-4 h-4 border-2 border-orange-500 rounded-full mt-0.5 flex-shrink-0" />
                      <span className="text-sm break-words max-w-2xl">{requirement.content}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Mô tả khoá học</span>
                </CardTitle>
                <CardDescription>Thông tin chi tiết </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="ql-editor leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: course.description }}
                />
              </CardContent>
            </Card>

            {/* Course Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Nội dung khóa học</span>
                </CardTitle>
                <CardDescription>Chi tiết các phần học và bài giảng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courseSections?.map((section, sectionIndex) => (
                    <div key={section.id} className="border rounded-lg p-4 hover:border-blue-500">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-lg">
                          Phần {section.index}: {section.title}
                        </h4>
                        <Badge variant="outline">{section.lessons.length} bài học</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{section.description}</p>

                      <div className="space-y-3">
                        {section?.lessons?.map((lesson, lessonIndex) => (
                          <div key={lessonIndex} className="bg-gray-50 rounded-lg p-3 ">
                            <div className="flex items-start justify-between mb-2 gap-2">
                              <div className="flex-1">
                                <h5 className="font-bold text-md text-white bg-wine-gradient border rounded-lg p-2">
                                  {lesson.name}
                                </h5>
                                <p className="text-xs text-gray-600 mt-1 break-words max-w-2xl">{lesson.description}</p>
                              </div>
                              {lesson.isPreviewable === "true" && (
                                <Button
                                  size="xs"
                                  className="text-blue-500 hover:text-blue-600"
                                  variant="ghost"
                                  onClick={() => handlePreviewVideo(lesson.video_url, lesson.id)}
                                >
                                  <Play className="w-3 h-3 mr-1" /> Xem trước
                                </Button>
                              )}
                              <ResourceDropdown mediaList={
                                Array.isArray(lesson.mediaList)
                                  ? lesson.mediaList
                                  : Object.entries(lesson.mediaList || {}).map(([id, name]) => ({ id, name }))
                              } />
                            </div>

                            {lesson.content && (
                              <div className="mb-2"> Nội dung
                                <div
                                  className="ql-editor leading-relaxed font-medium"
                                  dangerouslySetInnerHTML={{ __html: lesson.content }}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instructors */}
            <Card>
              <CardHeader>
                <CardTitle>Giảng viên</CardTitle>
                <CardDescription>Thông tin về các giảng viên của khóa học</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course?.instructorCourse?.map((instructor, index) => (
                    <div
                      key={instructor.instructor}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback>
                            {instructor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{instructor.name}</div>
                          <div className="text-sm text-gray-500">
                            {instructor.isOwner === "true" ? "Giảng viên chính" : "Giảng viên phụ"}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={instructor.isActive === "Active" ? "default" : "secondary"}>
                          {instructor.isActive}
                        </Badge>
                        {instructor.permissions.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">{instructor.permissions.join(", ")}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Sticky Course Info & Actions */}
            <div className="sticky top-6 space-y-6">
              {/* Course Info */}
              <Card className="shadow-lg border-2">
                <CardHeader>
                  <CardTitle>Thông tin khóa học</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-xs text-gray-500">Ngày tạo</div>
                      <div className="text-sm">{formatDate(course.createdAt)}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-xs text-gray-500">Cập nhật lần cuối</div>
                      <div className="text-sm">{formatDate(course.updatedAt)}</div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-xs text-gray-500 mb-1">ID khóa học</div>
                    <div className="text-xs font-mono bg-gray-100 p-2 rounded">{course.id}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
        <Dialog open={previewVideo.isOpen} onOpenChange={closePreviewVideo}>
          <DialogContent className="max-w-4xl w-full">
            <DialogHeader>
              <DialogTitle>Xem trước Video</DialogTitle>
              <DialogDescription>Video bài học từ server localhost:8080</DialogDescription>
            </DialogHeader>
            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
              {previewVideo.videoUrl && (
                <video
                  controls
                  className="w-full h-full"
                  src={getLessonVideoUrl(previewVideo.videoUrl, previewVideo.lessonId, `${process.env.NEXT_PUBLIC_API_URL_VIDEO_LESSON}`)}
                  onError={(e) => {
                    const mediaError = e?.target?.error;
                    console.error("Video load error:", mediaError);
                    toast.error("Không thể tải video xem trước");
                  }}
                >

                  Trình duyệt của bạn không hỗ trợ video HTML5. Hello
                </video>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closePreviewVideo}>
                Đóng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
