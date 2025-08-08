"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useCreateCourseSectionMutation } from '@/app/features/courses/courseApi';
import { toast } from "sonner"

export function AddSectionModal ({ isOpen, onClose, courseId, position }) {
  const [createCourseSection, { isLoading }] = useCreateCourseSectionMutation();
  const [section, setSection] = useState ({
    name: 'Phần',
    index: position + 1,
    description: '',
    title: '',
  });
  console.log(position, "vị trí nè ");

  useEffect(() => {
    setSection(prev => ({
      ...prev,
      index: position + 1
    }));
  }, [position]);

  const handleSubmit = async () => {
    if (section.title.trim()) {
      try {
        const response = await createCourseSection({courseId, section}).unwrap();
        console.log("Response from backend:", response);
        onClose()
      } catch (err) {
        const errorCode = err?.data?.code;
        if (errorCode === 1007) {
          toast.error("Lỗi khi lưu!", {
            description: "Bạn không có quyền thêm mới",
            action: {
              label: "Undo",
            },
            duration: 2000,
            position: "top-right",
          })
        } else {
          toast.error("Lỗi khi lưu!", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
              label: "Undo",
            },
            duration: 2000,
            position: "top-right",
          })
        }
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm phần mới {section.index}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="section-title">Tiêu đề phần</Label>
            <Input
              id="section-title"
              type="text"
              placeholder={`Nhập tiêu đề phần ${section.index}`}
              value={section.title}
              onChange={(e) => setSection(
                prev => ({
                  ...prev, title: e.target.value
                }))}
            />
          </div>

          <div>
            <Label htmlFor="section-description">Học viên có thể làm những gì khi phần này kết thúc?</Label>
            <Textarea
              id="section-description"
              placeholder="Nhập mục tiêu học tập"
              value={section.description}
              onChange={(e) => setSection(
                prev => ({
                  ...prev, description: e.target.value
                }))}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={!section.title.trim()}>
            Thêm phần
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
