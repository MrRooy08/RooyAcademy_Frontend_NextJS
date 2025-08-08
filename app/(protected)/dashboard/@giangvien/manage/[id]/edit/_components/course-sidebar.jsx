"use client"
import { Check, Circle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
import { useSubmitCourseMutation, useCheckCourseProcessingQuery } from "@/app/features/courses/courseApi"
import { toast } from "sonner"
import LoadingOverlay from "@/app/_components/LoadingOverlay";
import { useState } from "react";

export function CourseSidebar({ activeSection, onSectionChange, onPreview }) {
  const params = useParams()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCourse] = useSubmitCourseMutation();
  const { data } = useCheckCourseProcessingQuery(params.id);
  const checkCourseProcessing = data?.result;
  const sections = [
    {
      id: "target-students",
      title: "Học viên mục tiêu",
      completed: false,
      group: "Lên kế hoạch cho khóa học của bạn",
    },
    {
      id: "course-structure",
      title: "Cấu trúc khóa học",
      completed: true,
      group: "Lên kế hoạch cho khóa học của bạn",
    },
    {
      id: "setup-studio",
      title: "Thiết lập studio và tạo video thử nghiệm",
      completed: true,
      group: "Lên kế hoạch cho khóa học của bạn",
    },
    {
      id: "filming-editing",
      title: "Quay phim & chỉnh sửa",
      completed: false,
      group: "Tạo nội dung của bạn",
    },
    {
      id: "curriculum",
      title: "Chương trình giảng dạy",
      completed: false,
      group: "Tạo nội dung của bạn",
      hasPreview: true,
    },
    {
      id: "captions",
      title: "Phụ đề (tùy chọn)",
      completed: false,
      group: "Tạo nội dung của bạn",
    },
    {
      id: "accessibility",
      title: "Khả năng truy cập (tùy chọn)",
      completed: false,
      group: "Tạo nội dung của bạn",
    },
    {
      id: "course-overview",
      title: "Trang tổng quan khóa học",
      completed: false,
      group: "Xuất bản khóa học của bạn",
      hasPreview: true,
    },
    {
      id: "pricing",
      title: "Định giá",
      completed: true,
      group: "Xuất bản khóa học của bạn",
    },
    {
      id: "promotions",
      title: "Khuyến mãi",
      completed: true,
      group: "Xuất bản khóa học của bạn",
    },
  ]

  const groupedSections = sections.reduce((acc, section) => {
    if (!acc[section.group]) {
      acc[section.group] = []
    }
    acc[section.group].push(section)
    return acc
  }, {})

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(3000);
    try {
      const response = await submitCourse(params.id).unwrap();
      console.log("🚀 ~ handleSubmit bài tập ~ response:", response)
      toast.success("Gửi thành công !", {
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
      setIsSubmitting(false)
      router.push(`/dashboard?role=INSTRUCTOR`)
    } catch (err) {
      toast.error("Hãy hoàn thành các mục còn lại");
      setIsSubmitting(false)
    }
  };


  return (
    <div className="left-0 right-0 h-screen w-80 bg-white border-r border-gray-200 overflow-y-auto z-10">
      <div className="p-4">
        {Object.entries(groupedSections).map(([groupName, groupSections]) => (
          <div key={groupName} className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">{groupName}</h3>
            <div className="space-y-1">
              {groupSections.map((section) => (
                <div key={section.id} className="flex items-center">
                  <button
                    onClick={() => onSectionChange(section.id)}
                    className={`flex-1 flex items-center gap-2 p-3 rounded-lg text-left text-sm transition-colors ${activeSection === section.id
                        ? "bg-purple-50 text-purple-700 border border-purple-200"
                        : "hover:bg-gray-50"
                      }`}
                  >
                    {section.completed ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400" />
                    )}
                    <span>{section.title}</span>
                  </button>
                  {section.hasPreview && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onPreview(section.id)
                      }}
                      className="ml-2 p-2 hover:bg-gray-100"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 mt-auto border-t border-gray-200">
        {checkCourseProcessing?.courseStatus === "PROCESSING" ? (
          <Button
            className="w-full bg-purple-300 text-white cursor-not-allowed hover:bg-purple-300 hover:text-black"
            variant="outline"
          >
            Đang đợi xem xét
          </Button>
        ) : checkCourseProcessing?.courseStatus === "APPROVED" ? (
          <Button
            className="w-full bg-green-500 hover:bg-green-600 text-white cursor-not-allowed"
          >
            Đã được phê duyệt
          </Button>
        ) : (
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting && <LoadingOverlay />}
            Gửi đi để xem xét
          </Button>
        )}

      </div>
    </div>
  )
}
