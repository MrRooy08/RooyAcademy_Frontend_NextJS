"use client"

import React, { useState } from "react"
import { useRouter, usePathname, useParams } from "next/navigation"
import { LessonSidebar } from "./_components/Sidebar"
import { SectionsContext } from "./SectionsContext"
import { CourseHeader } from "./_components/Header"
import { useGetSectionByCourseQuery, useGetProgressQuery } from "@/app/features/courses/courseApi"
import { useAuth } from "@/app/Context/AuthContext"
import CenterErrorPage from "@/app/_components/Error"
import LoadingSpinner from "@/app/_components/LoadingSpinner"

export default function Layout({ children }) {
  const { user } = useAuth();
  const { courseName } = useParams()
  const courseId = courseName
  
  const enrollmentId = user?.result?.enrolledCourses?.find(
    (en) => en.courseId === courseId
  )?.enrollmentId || null;
  
  const { data, isLoading, isError } = useGetSectionByCourseQuery(courseId)
  const sectionsRaw = data?.result || []
  
  const { data: progressData = {} } = useGetProgressQuery(enrollmentId);
  
  const completedLessonIds = React.useMemo(() => {
    if (!progressData?.result?.sectionProgress) return [];
    
    const completedLessons = [];
    const completedAssignments = [];
    progressData.result.sectionProgress.forEach(section => {
      section.lessons?.forEach(lesson => {
        if (lesson.isCompleted) {
          completedLessons.push(lesson.lessonId);
        }
      });
      section.assignments?.forEach(assignment => {
        if (assignment.isCompleted) {
          completedAssignments.push(assignment.assignmentId);
        }
      });
    });
    return [...completedLessons, ...completedAssignments];
  }, [progressData]);
  
  const completedSet = new Set(completedLessonIds);

  const sections = sectionsRaw.map((sec) => ({
    ...sec,
    lessons: sec.lessons?.map((ls) => ({ ...ls, completed: completedSet.has(ls.id) })) || [],
    assignments: sec.assignments?.map((as) => ({ ...as, completed: completedSet.has(as.id) })) || [],
  }))

  console.log(sections, "sections")

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const paramsAll = useParams()

  const isLecture = pathname.includes("/lecture/")
  const isPractice = pathname.includes("/practice/")
  const currentLessonId = paramsAll?.id && isLecture ? paramsAll.id : sections?.[0]?.lessons?.[0]?.id || null
  console.log(currentLessonId, "currentLessonId")
  const currentAssignmentId = paramsAll?.id && isPractice ? paramsAll.id : sections?.[0]?.assignments?.[0]?.id || null

  if (isLoading) return <LoadingSpinner />
  if (isError)
    return (
      <CenterErrorPage
        errorCode="404"
        title="Khóa học không tìm thấy rồiiiiiiii"
        message="Xin lỗi, khóa học bạn đang tìm kiếm không tồn tại."
      />
    )

  const buildPath = (slug) => `/${courseName}/learn/${slug}`

  const handleLessonSelect = (id) => {
    const targetPath = buildPath(`lecture/${id}`)
    if (pathname !== targetPath) {
      router.push(targetPath)
    }
  }

  const handleAssignmentSelect = (id) => {
    const targetPath = buildPath(`practice/${id}`)
    if (pathname !== targetPath) {
      router.push(targetPath)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <LessonSidebar
        sections={sections}
        currentLessonId={currentLessonId}
        currentAssignmentId={currentAssignmentId}
        onLessonSelect={handleLessonSelect} 
        onAssignmentSelect={handleAssignmentSelect}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((p) => !p)}
      />

      <div className="flex flex-col flex-1">
        <SectionsContext.Provider value={sections}>
          <CourseHeader
            sections={sections}
            progressData={progressData}
            sidebarOpen={sidebarOpen}
            onSidebarToggle={() => setSidebarOpen((p) => !p)}
          />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">{children}</main>
        </SectionsContext.Provider>
      </div>
    </div>
  )
}
