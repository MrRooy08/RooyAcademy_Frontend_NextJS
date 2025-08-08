"use client"

import { GlobalProgress } from "./GlobalProcess"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"


export function CourseHeader({
  sections,
  progressData,
  sidebarOpen,
  onSidebarToggle,
}) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!sidebarOpen && (
            <Button variant="ghost" size="sm" onClick={onSidebarToggle} className="text-blue-600 hover:text-blue-700">
              <Menu className="w-4 h-4 mr-2" />
            </Button>
          )}
          <div>
            <div>
              <a href="/courses">
                <img
                  src="/minhrom.png"
                  alt="mylogo"
                  width={100}
                  height={100}
                />
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <GlobalProgress sections={sections} progressData={progressData} />
        </div>
      </div>
    </header>
  )
}
