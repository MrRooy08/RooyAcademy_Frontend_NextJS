"use client"

import { useState } from "react"
import { CourseSidebar } from "./_components/course-sidebar"
import { TargetStudentsContent } from "./_components/target-students-content"
import { CurriculumContent } from "./_components/CurriculumContent"
import { CourseOverviewContent } from "./_components/course-overview-content"
import { PricingContent } from "./_components/PricingContent"
// import { PromotionsContent } from "./components/promotions-content"
import { PreviewPage } from "./_components/preview-page"
import { useParams } from "next/navigation"

export default function CourseManagement() {
  const params = useParams()
  const [activeSection, setActiveSection] = useState("target-students")
  const [previewSection, setPreviewSection] = useState(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const renderContent = () => {
    switch (activeSection) {
      case "target-students":
        return <TargetStudentsContent courseId={params.id} />
      case "curriculum":
        return (
          <CurriculumContent
            courseId={params.id}
            onPreview={() => handlePreview("curriculum")}
          />
        )
      case "course-overview":
        return (
          <CourseOverviewContent
            courseId={params.id}
            onPreview={() => handlePreview("course-overview")}
          />
        )
      case "pricing":
        return (
          <PricingContent />
        )
      case "promotions":
        return "";
      // return <PromotionsContent />
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Chọn một mục từ sidebar để bắt đầu</p>
          </div>
        )
    }
  }

  const handlePreview = (section) => {
    setPreviewSection(section)
    setIsPreviewMode(true)
  }

  const handleExitPreview = () => {
    setIsPreviewMode(false)
    setPreviewSection(null)
  }

  if (isPreviewMode) {
    return <PreviewPage  courseId={params.id} onExit={handleExitPreview} />
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex w-full ">
        <CourseSidebar activeSection={activeSection} onSectionChange={setActiveSection} onPreview={handlePreview} />
        {renderContent()}
      </div>
    </div>
  )
}
