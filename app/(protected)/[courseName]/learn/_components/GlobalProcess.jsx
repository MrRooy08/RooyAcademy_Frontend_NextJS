"use client"

import { useState, useRef, useCallback } from "react"
import { ChevronDown, Clock, Award } from "lucide-react"
import { CircularProgress } from "./CircularProcess"

const calculateGlobalProgress = (sections) => {
  let totalLessons = 0
  let completedLessons = 0
  let totalAssignments = 0
  let completedAssignments = 0

  sections.forEach((section) => {
    totalLessons += section?.lessons?.length
    completedLessons += section?.lessons?.filter((lesson) => lesson.completed).length

    totalAssignments += section?.assignments?.length
    completedAssignments += section?.assignments?.filter((assignment) => assignment.completed).length
  })

  const totalItems = totalLessons + totalAssignments
  const completedItems = completedLessons + completedAssignments
  const percentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

  return {
    totalLessons,
    completedLessons,
    totalAssignments,
    completedAssignments,
    totalItems,
    completedItems,
    percentage,
  }
}

export function GlobalProgress({ sections, progressData }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const timeoutRef = useRef(null)

  // 🔥 Improved hover handlers với timeout để tránh flicker
  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setShowTooltip(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(false)
    }, 150) // Delay ngắn để tránh flicker khi move mouse
  }, [])

  // 🔥 Sử dụng data từ API detailed nếu có, fallback về tính toán cũ
  const stats = progressData?.result ? {
    totalLessons: progressData.result.totalLessons || 0,
    completedLessons: progressData.result.completedLessons || 0,
    totalAssignments: 0, // API chưa có assignments
    completedAssignments: 0,
    totalItems: progressData.result.totalLessons || 0,
    completedItems: progressData.result.completedLessons || 0,
    percentage: progressData.result.completionPercentage || 0,
    nextLesson: progressData.result.nextLesson,
    startedAt: progressData.result.startedAt,
    lastActivityAt: progressData.result.lastActivityAt
  } : calculateGlobalProgress(sections)

  return (
    <div className="relative">
      <div
        className="flex items-center gap-3 px-4 py-2 bg-pink-gradient text-white rounded-lg cursor-pointer hover:bg-pink-gradient transition-all duration-200 hover:scale-105 hover:shadow-lg"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CircularProgress percentage={stats.percentage} size={32} strokeWidth={3} className="text-red" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Your progress</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showTooltip ? 'rotate-180' : ''}`} />
        </div>
      </div>

      <div
        className={`absolute top-full right-1 mt-3 bg-white border border-gray-200 rounded-xl shadow-2xl p-5 min-w-[340px] z-50 transition-all duration-300 ease-out ${showTooltip
            ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
            : 'opacity-0 -translate-y-3 pointer-events-none scale-95'
          }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute bottom-full right-16 mb-1">
          <div className="w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45 shadow-sm"></div>
        </div>

        <div className="space-y-4">
          
          <div className="border-b border-gray-100 pb-3">
            <div className="text-sm font-semibold text-gray-900">
              {stats.completedItems} of {stats.totalItems} complete.
            </div>
            <div className="text-xs text-gray-500 mt-1">Overall Course Progress</div>
          </div>

          {progressData?.result && (
            <div className="border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                <Clock className="w-3 h-3" />
                <span>Bắt đầu học: {new Date(stats.startedAt).toLocaleDateString('vi-VN')}</span>
              </div>
              {stats.nextLesson && (
                <div className="flex items-center gap-2 text-xs text-blue-600">
                  <Award className="w-3 h-3" />
                  <span>Bài tiếp theo: {stats.nextLesson.lessonId}</span>
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Lessons:</span>
              <span className="text-sm font-medium text-gray-900">
                {stats.completedLessons}/{stats.totalLessons}
              </span>
            </div>

            {stats.totalAssignments > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Assignments:</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.completedAssignments}/{stats.totalAssignments}
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-3">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center font-medium">
              {Math.round(stats.percentage)}% Complete
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <div className="text-xs font-medium text-gray-700 mb-3">Section Progress:</div>
            <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
              {sections.map((section) => {
                const sectionTotal = section?.lessons?.length + section?.assignments?.length
                const sectionCompleted =
                  section?.lessons?.filter((l) => l.completed).length +
                  section?.assignments?.filter((a) => a.completed).length
                const sectionPercentage = sectionTotal > 0 ? (sectionCompleted / sectionTotal) * 100 : 0

                return (
                  <div key={section.id} className="flex justify-between items-center text-xs">
                    <span className="text-gray-600 truncate flex-1 mr-2">{section.title}:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 font-medium">
                        {sectionCompleted}/{sectionTotal}
                      </span>
                      <div className="w-10 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                          style={{ width: `${sectionPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  )
}