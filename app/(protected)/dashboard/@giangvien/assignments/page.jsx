"use client"

import { useState, useEffect, useCallback } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {toast} from "sonner"
// import { useFeedback } from "@/hooks/use-feedback"
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Search,
  Send,
  Star,
  Users,
} from "lucide-react"
// import { useCourses } from "@/hooks/use-courses"
import { useGetCoursesByStatusQuery} from "@/app/features/courses/courseApi"

// Assignment data structure
// id: number
// title: string
// course: string
// courseName: string
// student: {
//   name: string
//   avatar: string
//   initials: string
// }
// submittedAt: string
// status: string
// content: Array of { question: string, answer: string }
// feedback: Array of {
//   id?: number
//   author: string
//   avatar: string
//   content: string
//   timestamp: string
// }
// hasTeacherResponse: boolean

// State will be filled from API
const initialAssignments = [];

export default function HomeworkManagement() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("all")
  const [assignments, setAssignments] = useState(initialAssignments)
  const [courses, setCourses] = useState([]) // fetched courses list
  const [feedbackTexts, setFeedbackTexts] = useState({})

  // Fetch approved courses list (paginated)
  const { data: approvedCoursesData, isLoading: coursesLoading } = useGetCoursesByStatusQuery({ status: "APPROVED", page: 0, size: 5 })

  // Update local courses state when the API returns data
  useEffect(() => {
    if (approvedCoursesData?.result?.content?.length) {
      setCourses(
        approvedCoursesData.result.content.map((c) => ({
          id: c.id,
          name: c.name,
          color: "blue", // default color; adjust if API provides one
          category: c.category,
          topic: c.topic
        }))
      )
      setSelectedCourse(approvedCoursesData.result.content[0].id)
    }
  }, [approvedCoursesData])

  const [isLoading, setIsLoading] = useState(false)
  
  // Calculate stats for all assignments
  const totalPendingCount = assignments.filter(a => !a.hasTeacherResponse).length
  const totalReviewedCount = assignments.filter(a => a.hasTeacherResponse).length
  
  // Calculate stats for filtered assignments (by selected course)
  const courseAssignments = selectedCourse === "all" ? assignments : assignments.filter(a => a.course === selectedCourse)
  const filteredPendingCount = courseAssignments.filter(a => !a.hasTeacherResponse).length
  const filteredReviewedCount = courseAssignments.filter(a => a.hasTeacherResponse).length
  
  // Get selected course info
  const selectedCourseInfo = courses.find(c => c.id === selectedCourse)
  
  // Hàm lấy bài tập theo khóa học
  const fetchAssignments = useCallback(async () => {
    if (selectedCourse === "all") return;
      try {
        setIsLoading(true)
        const res = await fetch(`http://localhost:8080/assignments/course/${selectedCourse}/student-submissions`, {
          credentials: "include"
        })
        // adjust endpoint to real one
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        // Parse API response to flat assignment list similar to previous structure
        if (data?.result?.length) {
          const courseObjs = data.result


          const allAssignments = courseObjs.flatMap(course =>
            course.assignments.map(as => ({
              id: as.assignmentId,
              title: as.assignmentName,
              course: course.courseId,
              courseName: course.courseName,
              student: {
                name: course.studentName?.trim() || "Học viên",
                avatar: "/placeholder.svg?height=40&width=40",
                initials: course.studentName?.trim().split(" ").map(w=>w[0]).join("") || "HV",
              },
              submittedAt: new Date(as.submittedAt).toLocaleString(),
              status: as.status === "SUBMITTED" ? "submitted" : (as.overallFeedback ? "evaluated" : "reviewed"),
              content: as.studentAnswers.map((ans, idx) => ({
                question: `${idx + 1}. ${ans.questionContent.replace(/<[^>]+>/g, '')}`,
                questionId: ans.questionId,
                answer: ans.answerContent.replace(/<[^>]+>/g, ''),
                correctAnswer: ans.correctAnswerContent?.replace(/<[^>]+>/g, '') || null
              })),
              feedback: as.overallFeedback ? [{
                id: 1,
                author: "Giảng viên",
                avatar: "/placeholder.svg?height=40&width=40",
                content: as.overallFeedback.replace(/<[^>]+>/g, ''),
                timestamp: new Date(as.submittedAt).toLocaleString()
              }] : [],
              hasTeacherResponse: as.overallFeedback ? true : false,
              canProvideFeedback: !as.overallFeedback, // Can only provide feedback if no overallFeedback exists
              overallFeedback: as.overallFeedback
            }))
          )
          setAssignments(allAssignments)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }, [selectedCourse]);

  // Gọi khi thay đổi hoặc lần đầu để tải bài tập
  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments])

  

  // Mock teacher data - trong thực tế sẽ lấy từ authentication
  const currentTeacher = {
    id: "teacher_1",
    name: "Giáo viên Nguyễn Văn A",
    avatar: "/placeholder.svg?height=32&width=32",
  }

  // Cập nhật logic lọc để bao gồm khóa học
  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.courseName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCourse = selectedCourse === "all" || assignment.course === selectedCourse

    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "pending" && !assignment.hasTeacherResponse) ||
      (selectedTab === "reviewed" && assignment.hasTeacherResponse)

    return matchesSearch && matchesCourse && matchesTab
  })

  const handleFeedbackTextChange = (assignmentId, text) => {
    setFeedbackTexts((prev) => ({
      ...prev,
      [assignmentId]: text,
    }))
  }

  const handleSendFeedback = async (assignmentId) => {
    const feedbackText = feedbackTexts[assignmentId]

    if (!feedbackText?.trim()) return

    try {
      setIsLoading(true)

      const res = await fetch(`http://localhost:8080/assignments/${assignmentId}/evaluate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          "feedback": feedbackText.trim(),
        }),
      })
      const data = await res.json()
      // Giả sử API trả về đối tượng feedback đã lưu
      const savedFeedback = {
        id: data.id || Date.now(),
        author: currentTeacher.name,
        avatar: currentTeacher.avatar,
        content: feedbackText.trim(),
        timestamp: new Date().toLocaleString(),
      }

      // Cập nhật UI
      setAssignments((prev) =>
        prev.map((assignment) => {
          if (assignment.id === assignmentId) {
            return {
              ...assignment,
              feedback: [...assignment.feedback, savedFeedback],
              hasTeacherResponse: true,
              status: "evaluated",
              canProvideFeedback: false,
              overallFeedback: feedbackText.trim(),
            }
          }
          return assignment
        }),
      )
      toast.success("Đánh giá đã được gửi!")
      // Xóa nội dung ô input
      setFeedbackTexts((prev) => ({ ...prev, [assignmentId]: "" }))
      setIsLoading(false)
    } catch (error) {
      toast.error("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.")
      setIsLoading(false)
    } 
  }


  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Quản lý Bài tập</h1>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm bài tập, học viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Khóa học</Label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse} disabled={coursesLoading}>
              <SelectTrigger>
                <SelectValue placeholder={coursesLoading ? "Đang tải..." : "Chọn khóa học"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                    <span>Tất cả khóa học</span>
                  </div>
                </SelectItem>
                {courses?.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full bg-${course.color}-500`} />
                      <div className="flex flex-col">
                        <span className="font-medium">{course.name}</span>
                        <span className="text-xs text-gray-500">{course.category} • {course.topic}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200">
          {selectedCourse !== "all" && selectedCourseInfo && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900">{selectedCourseInfo.name}</h3>
                  <p className="text-sm text-blue-700">{selectedCourseInfo.category} • {selectedCourseInfo.topic}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {selectedCourse === "all" ? totalPendingCount : filteredPendingCount}
              </div>
              <div className="text-sm text-gray-500">Chờ phản hồi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {selectedCourse === "all" ? totalReviewedCount : filteredReviewedCount}
              </div>
              <div className="text-sm text-gray-500">Đã phản hồi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {selectedCourse === "all" ? assignments.length : courseAssignments.length}
              </div>
              <div className="text-sm text-gray-500">Tổng bài tập</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {selectedCourse === "all" 
                ? `Hiển thị tất cả ${assignments.length} bài tập từ ${courses.length} khóa học`
                : `Hiển thị ${courseAssignments.length} bài tập từ khóa học "${selectedCourseInfo?.name}"`
              }
            </p>
          </div>
        </div>
        <div className="flex-1 p-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="text-xs">
                <Users className="h-4 w-4 mr-1" />
                Tất cả
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs bg-red-400">
                <Clock className="h-4 w-4 mr-1" />
                Chờ ({selectedCourse === "all" ? totalPendingCount : filteredPendingCount})
              </TabsTrigger>
              <TabsTrigger value="reviewed" className="text-xs bg-green-400">
                <CheckCircle className="h-4 w-4 mr-1" />
                Xong ({selectedCourse === "all" ? totalReviewedCount : filteredReviewedCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mt-6 space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <BookOpen className="h-4 w-4 mr-2" />
              Tất cả bài tập
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Star className="h-4 w-4 mr-2" />
              Bài tập quan trọng
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Hạn nộp hôm nay
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Danh sách bài tập ({filteredAssignments.length})</h2>
              <p className="text-sm text-gray-500 mt-1">Quản lý và phản hồi bài tập của học viên</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Lọc
              </Button>
              <Select defaultValue="newest">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="oldest">Cũ nhất</SelectItem>
                  <SelectItem value="priority">Ưu tiên</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {filteredAssignments.map((assignment) => (
              <Card key={assignment.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={assignment.student.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{assignment.student.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{assignment.student.name}</h3>
                        <p className="text-sm text-gray-500">{assignment.submittedAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        assignment.status === "evaluated" ? "default" : 
                        assignment.status === "reviewed" ? "outline" : "secondary"
                      }>
                        {assignment.status === "evaluated" ? "Đã đánh giá" : 
                         assignment.status === "reviewed" ? "Đã phản hồi" : "Chờ phản hồi"}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {assignment.courseName}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-3">Bài làm của học viên:</h5>
                    <div className="space-y-3">
                      {assignment.content.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">{item.question}</p>
                          <div className="bg-white p-2 rounded border">
                            <p className="text-sm text-gray-600 mb-2">
                              <span className="font-medium text-gray-700">Câu trả lời:</span> {item.answer}
                            </p>
                            {item.correctAnswer && (
                              <p className="text-sm text-green-700 bg-green-50 p-2 rounded border border-green-200">
                                <span className="font-medium">Đáp án đúng:</span> {item.correctAnswer}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {assignment.feedback.length > 0 && (
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-900 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Phản hồi của bạn:
                      </h5>
                      {assignment.feedback.map((feedback, index) => (
                        <div key={feedback.id || index} className="flex space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={feedback.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {feedback.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 bg-blue-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-gray-900">{feedback.author}</p>
                              <p className="text-xs text-gray-500">{feedback.timestamp}</p>
                            </div>
                            <p className="text-sm text-gray-700">{feedback.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t pt-4">
                    {assignment.canProvideFeedback ? (
                      <>
                        <Label htmlFor={`feedback-${assignment.id}`} className="text-sm font-medium text-gray-700">
                          Gửi phản hồi:
                        </Label>
                        <div className="mt-2 flex space-x-2">
                          <Textarea
                            id={`feedback-${assignment.id}`}
                            placeholder="Nhập phản hồi cho học viên..."
                            value={feedbackTexts[assignment.id] || ""}
                            onChange={(e) => handleFeedbackTextChange(assignment.id, e.target.value)}
                            className="flex-1 min-h-[80px]"
                            disabled={isLoading}
                          />
                          <Button
                            onClick={() => handleSendFeedback(assignment.id)}
                            disabled={!feedbackTexts[assignment.id]?.trim() || isLoading}
                            className="self-end"
                          >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <h6 className="font-medium text-green-900">Bài tập đã được đánh giá</h6>
                        </div>
                        <p className="text-sm text-green-700">
                          Bạn đã hoàn thành việc đánh giá bài tập này. Học viên có thể xem phản hồi của bạn.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
