"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Calendar,
  Tag,
  DollarSign,
  Play,
  Target,
  Users,
  BookOpen,
  FileText,
  Video,
  ImageIcon,
  Clock,
  ChevronDown,
  ChevronRight,
  Download,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import LoadingSpinner from "@/app/_components/LoadingSpinner";
import clsx from "clsx";
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { getVideoURL, getCourseVideoURL } from "@/lib/media"
import { useGetCourseByCourseIdQuery, useGetSectionByCourseQuery, useGetCourseMetaQuery } from "@/app/features/courses/courseApi"
import { useApproveCourseMutation } from "@/app/features/admin/adminApi"

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

const getStatusBadge = (status) => {
  switch (status) {
    case "PROCESSING":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Đang xử lý
        </Badge>
      )
    case "PENDING":
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <Clock className="w-3 h-3 mr-1" />
          Chờ duyệt
        </Badge>
      )
    case "APPROVED":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Đã duyệt
        </Badge>
      )
    case "REJECTED":
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Từ chối
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
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

export default function CourseDetailPage() {
  const params = useParams();
  const { data: courseSectionData, error: sectionError } = useGetSectionByCourseQuery(params.id, { pollingInterval: 3000, refetchOnMountOrArgChange: true });
  const { data: courseDetailData, error: courseError } = useGetCourseByCourseIdQuery(params.id, { pollingInterval: 3000, refetchOnMountOrArgChange: true });
  const { data: courseMetaData, error: metaError } = useGetCourseMetaQuery(params.id, { pollingInterval: 3000, refetchOnMountOrArgChange: true });
  const [approveCourse, { isLoading }] = useApproveCourseMutation();
  console.log(courseDetailData, courseDetailData?.result)
  console.log(courseSectionData, courseSectionData?.result)
  console.log(courseMetaData, courseMetaData?.result)

  const router = useRouter();


  const handleApprove = async () => {
    try {
      const data = await approveCourse(params.id).unwrap();
      console.log("🚀 ~ handleApprove ~ data:", data)
      toast.success("Phê duyệt thành công!", {
        description: "Sunday, December 03, 2023 at 9:00 AM",
        action: {
          label: "Undo",
          onClick: () => router.push(`/dashboard?role=ADMIN`),
        },
        duration: 2000,
        position: "top-right",
      })
      router.push(`/dashboard?role=ADMIN`)
    } catch (error) {
      toast.error("Có lỗi xảy ra khi phê duyệt!", {
        description: "Sunday, December 03, 2023 at 9:00 AM",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
        duration: 4000,
        position: "top-right",
      })
      console.error("Approve error:", error);
    }
  };

  const [previewVideo, setPreviewVideo] = useState({
    isOpen: false,
    videoUrl: "",
    lessonName: "",
  })

  const handlePreviewVideo = (videoUrl, lessonName) => {
    setPreviewVideo({
      isOpen: true,
      videoUrl: getVideoURL(videoUrl, lessonName),
      lessonName,
    })
  }

  const closePreviewVideo = () => {
    setPreviewVideo({
      isOpen: false,
      videoUrl: "",
      lessonName: "",
    })
  }

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

  if (!courseDetailData || !courseMetaData || !courseSectionData) {
    return <LoadingSpinner />
  }

  if (sectionError || courseError || metaError) {
    return <LoadingSpinner />
  }

  const course = courseDetailData?.result;
  const courseMeta = courseMetaData?.result?.meta;
  const courseSections = courseSectionData?.result;

  console.log(course);



  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex-1 flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
            </Link>
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold text-gray-900">Chi tiết khóa học</h1>
              <p className="text-gray-600">Xem xét và duyệt khóa học</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">{getStatusBadge(course.approveStatus)}</div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
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
                        src={getCourseVideoURL(course.videoUrl, course.id)}
                        type="video/mp4"
                        style={{ width: '100%', height: '100%' }}
                      />
                    ) : (
                      <p className="text-sm text-gray-500">Không có video hoặc ảnh preview</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Mô tả khóa học</h3>
                  <div
                    className="ql-editor leading-relaxed line-clamp-10 break-words"
                    dangerouslySetInnerHTML={{ __html: course.description }}
                  />
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Mục tiêu khóa học</span>
                </CardTitle>
                <CardDescription>Những gì học viên sẽ đạt được sau khi hoàn thành khóa học</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {courseMeta.GOAL.map((goal, index) => (
                    <li key={goal.id} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm break-words max-w-full">{goal.content}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

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
                  {courseMeta.AUDIENCE.map((audience, index) => (
                    <li key={audience.id} className="flex items-start space-x-2">
                      <Users className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm break-words max-w-full">{audience.content}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

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
                  {courseMeta.REQUIREMENT.map((requirement, index) => (
                    <li key={requirement.id} className="flex items-start space-x-2">
                      <div className="w-4 h-4 border-2 border-orange-500 rounded-full mt-0.5 flex-shrink-0" />
                      <span className="text-sm break-words max-w-full">{requirement.content}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
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
                  {courseSections.map((section, sectionIndex) => (
                    <div key={section.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-lg">
                          Phần {section.index}: {section.title}
                        </h4>
                        <Badge variant="outline">{section.lessons.length} bài học</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{section.description}</p>

                      <div className="space-y-3">
                        {section.lessons.map((lesson, lessonIndex) => {
                          const resources = Array.isArray(lesson.mediaList)
                            ? lesson.mediaList
                            : Object.entries(lesson.mediaList || {}).map(([id, name]) => ({ id, name }));
                          return (
                            <div key={lessonIndex} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-start justify-between mb-2 gap-2">
                                <div className="flex-1">
                                  <h5 className="font-medium text-sm">
                                    Bài {lesson.index}: {lesson.name}
                                  </h5>
                                  <p className="text-xs text-gray-600 mt-1 break-words max-w-full">{lesson.description}</p>
                                </div>
                                {
                                  lesson.isPreviewable === "true" ? (
                                    <Button size="xs" className="text-blue-500 hover:text-blue-600" variant="ghost"
                                      onClick={() => handlePreviewVideo(lesson.video_url, lesson.id)}
                                    > <Play className="w-3 h-3 mr-1" /> Xem trước</Button>
                                  ) : (
                                    <></>
                                  )
                                }
                                <div className="flex flex-wrap gap-2">
                                  <ResourceDropdown mediaList={resources} />
                                </div>
                              </div>

                              {lesson.content && (
                                <div className="mb-2">
                                  <div
                                    className="ql-editor leading-relaxed line-clamp-10 break-words"
                                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                                  />  
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Giảng viên</CardTitle>
                <CardDescription>Thông tin về các giảng viên của khóa học</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.instructorCourse.map((instructor, index) => (
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

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="sticky top-6 space-y-6">
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

              {course.approveStatus === "PROCESSING" && (
                <Card className="shadow-lg border-2">
                  <CardHeader>
                    <CardTitle>Thao tác duyệt</CardTitle>
                    <CardDescription>Phê duyệt hoặc từ chối khóa học này</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full" onClick={handleApprove} disabled={isLoading}>
                      {isLoading ? (
                        <LoadingSpinner variant="dots" size="xs" className={clsx("text-cyan-500 flex-col ")} text={"Đang xử lý"} />
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Phê duyệt
                        </>
                      )}
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          <XCircle className="w-4 h-4 mr-2" />
                          Từ chối
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Từ chối khóa học</DialogTitle>
                          <DialogDescription>
                            Vui lòng nhập lý do từ chối khóa học này. Thông tin này sẽ được gửi đến giảng viên.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="reason">Lý do từ chối</Label>
                            <Textarea
                              id="reason"
                              placeholder="Nhập lý do từ chối..."
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">
                            Hủy
                          </Button>
                          <Button
                            variant="destructive"
                          >
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        </div>
        <Dialog open={previewVideo.isOpen} onOpenChange={closePreviewVideo}>
          <DialogContent className="max-w-4xl w-full">
            <DialogHeader>
              <DialogTitle>Xem trước: {previewVideo.lessonName}</DialogTitle>
              <DialogDescription>Video bài học từ server localhost:8080</DialogDescription>
            </DialogHeader>
            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
              {previewVideo.videoUrl && (
                <video
                  controls
                  className="w-full h-full"
                  src={previewVideo.videoUrl}
                  onError={(e) => {
                    console.error("Video load error:", e)
                  }}
                >
                  <source src={previewVideo.videoUrl} type="video/mp4" />
                  Trình duyệt của bạn không hỗ trợ video HTML5.
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
