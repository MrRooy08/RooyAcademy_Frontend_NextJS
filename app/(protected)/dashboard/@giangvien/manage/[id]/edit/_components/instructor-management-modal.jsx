"use client"

import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, X, AlertCircle } from "lucide-react"
import { useAddInstructorMutation } from '@/app/features/courses/courseApi';
import { toast } from "sonner"

export function InstructorManagementModal({ isOpen, onClose, courseData, setCourseData }) {
  const [addInstructor] = useAddInstructorMutation()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newInstructorName, setNewInstructorName] = useState("")

  // LOCAL STATE - chỉ sync với courseData khi Save
  const [localInstructors, setLocalInstructors] = useState([])
  const [originalInstructors, setOriginalInstructors] = useState([])

  const [errorInstructorIds, setErrorInstructorIds] = useState([])
  const [isSaving, setIsSaving] = useState(false)

  // Initialize local state khi modal mở
  useEffect(() => {
    if (isOpen && courseData?.instructorCourse) {
      const currentInstructors = JSON.parse(JSON.stringify(courseData.instructorCourse))
      setLocalInstructors(currentInstructors)
      setOriginalInstructors(JSON.parse(JSON.stringify(currentInstructors)))
      setErrorInstructorIds([])
    }
  }, [isOpen, courseData])

  // Reset states khi đóng modal
  useEffect(() => {
    if (!isOpen) {
      setShowAddForm(false)
      setNewInstructorName("")
      setLocalInstructors([])
      setOriginalInstructors([])
      setErrorInstructorIds([])
    }
  }, [isOpen])

  // Check có thay đổi gì không dựa trên local state
  const hasChanges = useMemo(() => {
    if (localInstructors.length !== originalInstructors.length) {
      return true
    }

    // Check instructor changes
    const hasInstructorChanges = localInstructors.some((local, index) => {
      const original = originalInstructors[index]
      if (!original || local.instructor !== original.instructor || local.name !== original.name) {
        return true
      }

      // Check permission changes
      const localPerms = [...(local.permissions || [])].sort()
      const originalPerms = [...(original.permissions || [])].sort()
      return JSON.stringify(localPerms) !== JSON.stringify(originalPerms)
    })

    return hasInstructorChanges
  }, [localInstructors, originalInstructors])

  const handleAddInstructor = () => {
    if (!newInstructorName.trim()) {
      return
    }

    const newInstructor = {
      instructor: newInstructorName.trim() || `temp-${Date.now()}`,
      name: newInstructorName.trim(),
      isOwner: false,
      permissions: [],
    }

    // Chỉ update local state
    setLocalInstructors(prev => [...prev, newInstructor])
    setNewInstructorName("")
    setShowAddForm(false)

    console.log(`Added new instructor to local state: ${newInstructor.name}`)
  }

  const handlePermissionChange = (instructorId, permission, checked) => {
    setLocalInstructors(prev => prev.map(instructor => {
      if (instructor.instructor === instructorId && instructor.isOwner !== "true") {
        const currentPermissions = instructor.permissions || []
        let newPermissions

        if (checked) {
          newPermissions = currentPermissions.includes(permission)
            ? [...currentPermissions]
            : [...currentPermissions, permission]
        } else {
          newPermissions = currentPermissions.filter(p => p !== permission)
        }

        return {
          ...instructor,
          permissions: newPermissions
        }
      }
      return instructor
    }))
  }

  const handleRemoveInstructor = (instructorId) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xoá giảng viên này không?. Khi xoá rồi sẽ không thể thêm vào lại nữa nhé");
  
    if (!confirm) return;
  
    setLocalInstructors(prev =>
      prev.filter(instructor => instructor.instructor !== instructorId)
    );
  
    setErrorInstructorIds(prev => prev.filter(id => id !== instructorId));
  
    console.log(`Removed instructor from local state: ${instructorId}`);
  }

  const handleSave = async () => {
    if (isSaving || !hasChanges) return

    try {
      setIsSaving(true)
      const newlyAdded = localInstructors.filter(
        (ins) => !originalInstructors.some(orig => orig.instructor === ins.instructor)
      )

      const invalid = newlyAdded.filter((ins) => !ins.name.includes("@"))

      if (invalid.length > 0) {
        setErrorInstructorIds(invalid.map((ins) => ins.instructor))
        return
      }
      const removed = originalInstructors.filter((orig) =>
        !localInstructors.some((local) => local.instructor === orig.instructor)
      )

      const permissionChanged = localInstructors.filter((local) => {
        const orig = originalInstructors.find((o) => o.instructor === local.instructor)
        if (!orig) return false

        const localPerms = [...(local.permissions || [])].sort()
        const originalPerms = [...(orig.permissions || [])].sort()
        return JSON.stringify(localPerms) !== JSON.stringify(originalPerms)
      })

      const body = {}
      if (newlyAdded.length) body.added = newlyAdded
      if (removed.length) body.removed = removed
      if (permissionChanged.length) body.permissionChanged = permissionChanged

      if (Object.keys(body).length === 0) {
        console.log("Không có thay đổi để gửi")
        return
      }

      console.log("Instructor changes payload", body)
      await new Promise(resolve => setTimeout(resolve, 1000))
      const response = await addInstructor({ courseId: courseData.id, body }).unwrap();
      console.log("🚀 ~ handleSave ~ response:", response)

      setCourseData(prevCourseData => ({
        ...prevCourseData,
        instructorCourse: [...localInstructors]
      }))
      toast.success("Lưu thành công!")
      console.log("Successfully saved and updated courseData")
      onClose()

    } catch (error) {
      const errorCode = error?.data?.code;

      if (errorCode === 1036) {
        toast.error("Ê!!! Đừng có tự mời bản thân bạn trong khoá học như vậy chứ (-__-) 😑 ");
      } else {
        toast.error("Lưu thất bại!");
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (hasChanges) {
      setLocalInstructors([...originalInstructors])
    }
    onClose()
  }

  const getInstructorPermission = (instructor, permissionType) => {
    const permissions = instructor.permissions || []
    return permissions.includes(permissionType)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quản lý các quyền của giảng viên</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Quản lý các quyền của giảng viên</span>
              <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">
                ?
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm trợ giảng
            </Button>
          </div>

          {showAddForm && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="instructor-name">Tên trợ giảng</Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="instructor-name"
                  placeholder="Vui lòng nhập địa chỉ email của trợ giảng"
                  value={newInstructorName}
                  onChange={(e) => setNewInstructorName(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddInstructor()}
                />
                <Button onClick={handleAddInstructor} disabled={!newInstructorName.trim()}>
                  Thêm
                </Button>
                <Button variant="ghost" onClick={() => {
                  setShowAddForm(false)
                  setNewInstructorName("")
                }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium">Giảng viên</th>
                  <th className="text-center p-3 font-medium">Quản lý</th>
                  <th className="text-center p-3 font-medium">Hỏi đáp</th>
                  <th className="text-center p-3 font-medium">Đánh giá</th>
                  <th className="text-center p-3 font-medium">Bài tập</th>
                  <th className="text-center p-3 font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {localInstructors?.map((instructor, index) => (
                  <tr key={instructor.instructor || index} className="border-t border-gray-200">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span>{instructor.name}</span>
                        {errorInstructorIds.includes(instructor.instructor) && (
                          <span className="text-xs text-red-600 ml-2 flex items-center gap-1">
                            <AlertCircle size={12} />
                            Không tìm thấy giảng viên
                          </span>
                        )}

                        {instructor.isOwner === "true" ? (
                          <div className="flex justify-between gap-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Chủ sở hữu</span>
                            <span className={`px-2 py-1 text-xs rounded ${instructor.isActive === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                              }`}>
                              {instructor.isActive === "Active" ? "Còn hoạt động" : "Hết hoạt động"}
                            </span>
                          </div>
                        ) : (
                          <div className="flex justify-between gap-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Đồng giảng viên</span>
                            <span className={`px-2 py-1 text-xs rounded ${instructor.isActive === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                              }`}>
                              {instructor.isActive === "Active" ? "Còn hoạt động" : "Hết hoạt động"}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="text-center p-3">
                      <Checkbox
                        checked={instructor.isOwner === "true" || getInstructorPermission(instructor, "QL")}
                        disabled={instructor.isOwner === "true"}
                        onCheckedChange={(checked) => handlePermissionChange(instructor.instructor, "QL", checked)}
                      />
                    </td>
                    <td className="text-center p-3">
                      <Checkbox
                        checked={instructor.isOwner === "true" || getInstructorPermission(instructor, "HD")}
                        disabled={instructor.isOwner === "true"}
                        onCheckedChange={(checked) => handlePermissionChange(instructor.instructor, "HD", checked)}
                      />
                    </td>
                    <td className="text-center p-3">
                      <Checkbox
                        checked={instructor.isOwner === "true" || getInstructorPermission(instructor, "DG")}
                        disabled={instructor.isOwner === "true"}
                        onCheckedChange={(checked) => handlePermissionChange(instructor.instructor, "DG", checked)}
                      />
                    </td>
                    <td className="text-center p-3">
                      <Checkbox
                        checked={instructor.isOwner === "true" || getInstructorPermission(instructor, "BT")}
                        disabled={instructor.isOwner === "true"}
                        onCheckedChange={(checked) => handlePermissionChange(instructor.instructor, "BT", checked)}
                      />
                    </td>
                    <td className="text-center p-3">
                      {instructor.isOwner !== "true" && instructor.isActive === "Active" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveInstructor(instructor.instructor)}
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-sm text-gray-600">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: "75%" }}></div>
            </div>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
              Has Changes: {hasChanges.toString()} |
              Local: {localInstructors?.length || 0} |
              Original: {originalInstructors?.length || 0}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}