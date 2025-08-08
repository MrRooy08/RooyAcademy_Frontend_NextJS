"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function AddCurriculumItemModal({ isOpen, onClose, onSelectType }) {
  const itemTypes = [
    { id: "lecture", label: "Bài giảng", badge: "Có lab", color: "bg-blue-100 text-blue-800" },
    { id: "quiz", label: "Trắc nghiệm", badge: "", color: "bg-green-100 text-green-800" },
    { id: "assignment", label: "Bài tập tự luận", badge: "", color: "bg-red-100 text-red-800" },
    { id: "coding", label: "Bài tập coding", badge: "", color: "bg-purple-100 text-purple-800" },
    { id: "practice-test", label: "Bài kiểm tra thực hành", badge: "", color: "bg-orange-100 text-orange-800" },
    { id: "role-play", label: "Học tập nhập vai", badge: "Beta", color: "bg-gray-100 text-gray-800" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Mục trong khung chương trình</DialogTitle>
          </div>
        </DialogHeader>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="flex flex-wrap gap-3">
            {itemTypes.map((type) => (
              <Button
                key={type.id}
                variant="outline"
                onClick={() => {
                  onSelectType(type.id)
                  onClose()
                }}
                className="flex items-center gap-2 h-auto py-2 px-3"
              >
                <span className="text-green-600">+</span>
                <span>{type.label}</span>
                {type.badge && (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${type.color}`}>{type.badge}</span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
