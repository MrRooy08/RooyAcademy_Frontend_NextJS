"use client"

import { Check, BookOpen, Play, Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

import { CircularProgress } from "./CircularProcess"


const calculateSectionProgress = (section) => {
  const totalItems = section?.lessons?.length + section?.assignments?.length
  if (totalItems === 0) return 0

  const completedLessons = section?.lessons?.filter((lesson) => lesson.completed).length
  const completedAssignments = section?.assignments?.filter((assignment) => assignment.completed).length
  const completedItems = completedLessons + completedAssignments

  return (completedItems / totalItems) * 100
}

export function LessonSidebar({
  sections,
  currentLessonId,
  currentAssignmentId,
  onLessonSelect,
  onAssignmentSelect,
  isOpen,
  onToggle,
}) {

  const [openSections, setOpenSections] = useState(
    new Set(
      sections
        .filter((s) => (s.lessons?.length || s.assignments?.length) > 0)
        .map((s) => s.id)
    )
  )
  
  const toggleSection = (id) => {
    const section = sections.find((s) => s.id === id)
    if (!section || (!(section.lessons?.length) && !(section.assignments?.length))) return
  
    setOpenSections((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  
    const firstLesson = section.lessons?.[0]
    const firstAssignment = section.assignments?.[0]
    if (firstLesson) {
      onLessonSelect(firstLesson.id)
    } else if (firstAssignment) {
      onAssignmentSelect(firstAssignment.id)
    }
  }

  const handleAssignmentSelect = (assignmentId) => {
    onAssignmentSelect(assignmentId)
  }

  const handleLessonSelect = (lessonId) => {
    onLessonSelect(lessonId)
  }

  const getLessonIcon = (lesson) => {
    if (lesson.completed) {
      return <Check className="w-5 h-5 text-white bg-green-500 rounded-full p-1" />
    }

    switch (lesson.type) {
      case "video":
        return <Play className="w-5 h-5 text-gray-600" />
      case "reading+video":
        return (
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4 text-gray-600" />
            <Play className="w-4 h-4 text-gray-600" />
          </div>
        )
      default:
        return <BookOpen className="w-5 h-5 text-gray-600" />
    }
  }

  const getTypeLabel = (lesson) => {
    switch (lesson.type) {
      case "reading+video":
        return "Reading + Video"
      case "video":
        return "Video"
      default:
        return "Reading"
    }
  }

  return (
    <>      {/* Sidebar */}
      <div
        className={cn(
          "h-full bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300",
          isOpen ? "w-80" : "w-0",
          "md:relative",
          "fixed left-0 top-0 z-40 md:static",
        )}
      >
        <div className={cn("p-6", !isOpen && "hidden")}>
          <Button variant="ghost" size="sm" onClick={onToggle} className="text-blue-600 hover:text-blue-700 mb-4">
            <Menu className="w-4 h-4 mr-2" />
          </Button>
          {sections.map((section) => (
            <div key={section.id} className="mb-8 p-2">
              {section.lessons?.length ? (
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="flex items-center w-full mb-4 focus:outline-none"
                >
                  <ChevronDown className={`w-4 h-4  text-gray-600 transition-transform ${openSections.has(section.id) ? 'rotate-180' : ''}`} />
                  <h3 className="flex-1 font-semibold text-gray-900">{section.title}</h3>
                  <CircularProgress percentage={calculateSectionProgress(section)} size={40} strokeWidth={3} />
                </button>
              ) : (
                <div className="flex items-center w-full mb-4">
                  <h3 className="flex-1 font-semibold text-gray-900 pl-6">{section.title}</h3>
                  <CircularProgress percentage={calculateSectionProgress(section)} size={40} strokeWidth={3} />
                </div>
              )}
              {openSections.has(section.id) && (
                <div className="space-y-2">
                  {section.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      onClick={() => handleLessonSelect(lesson.id)}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                        currentLessonId === lesson.id ? "bg-blue-50 border-l-4 border-blue-500" : "hover:bg-gray-50",
                      )}
                    >
                      <div className="flex-shrink-0 mt-0.5">{getLessonIcon(lesson)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <span className="font-medium text-sm text-gray-900">{getTypeLabel(lesson)}:</span>
                          <span className="text-sm text-gray-900 flex-1">{lesson.name}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{lesson.duration} min</div>
                      </div>
                    </div>
                  ))}
                  {section?.assignments?.map((assignment) => (
                    <div
                      key={assignment.id}
                      onClick={() => handleAssignmentSelect(assignment.id)}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                        currentAssignmentId === assignment.id
                          ? "bg-purple-50 border-l-4 border-purple-500"
                          : "hover:bg-gray-50",
                      )}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <div
                          className={cn(
                            "w-5 h-5 rounded flex items-center justify-center",
                            assignment.completed ? "bg-green-500" : "bg-purple-100",
                          )}
                        >
                          {assignment.completed ? (
                            <Check className="w-3 h-3 text-white" />
                          ) : (
                            <span className="text-xs font-bold text-purple-600">
                              {assignment.type === "quiz" ? "Q" : "A"}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <div className="font-medium text-sm text-gray-900">
                            {assignment.type === "quiz" ? "Quiz" : "Assignment"}:
                          </div>
                          <div className="text-sm font-medium text-gray-900 break-words line-clamp-3">{assignment.name}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
