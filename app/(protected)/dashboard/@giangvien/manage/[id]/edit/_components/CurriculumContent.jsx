"use client"

import { ChevronDown, ChevronRight, Download, Plus, MoreHorizontal, Edit, Trash2, BookOpen, BookHeart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState, useEffect, useCallback } from "react"
import { AddSectionModal } from "./add-section-modal"
import { AddCurriculumItemModal } from "./add-curriculum-modal"
import { AddLectureModal } from "./add-lecture-modal"
import { AssignmentModal } from "./AssignmentModal"
import { useGetSectionByCourseQuery, useUpdateSectionBySectionMutation } from "@/app/features/courses/courseApi"
import LoadingSpinner from "@/app/_components/LoadingSpinner"
import { toast } from "sonner"


export function CurriculumContent({ courseId, onPreview }) {
  const { data, error } = useGetSectionByCourseQuery(courseId)
  const [updateSectionBySection, { isLoading }] = useUpdateSectionBySectionMutation();
  const courseSection = data?.result

  const [courseData, setCourseData] = useState([])
  const [showAddSectionModal, setShowAddSectionModal] = useState(false)
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false)
  const [currentSectionId, setCurrentSectionId] = useState(null)
  const [editingLesson, setEditingLesson] = useState(null)
  const [sectionEditingId, setSectionEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false)

  const [modalMode, setModalMode] = useState("add")

  useEffect(() => {
    if (!courseSection) return

    const mappedData = courseSection.map((section) => ({
      ...section,
      isOpen: false,
      lessons:
        section.lessons?.map((lesson, index) => ({
          id: lesson.id,
          title: lesson.name,
          description: lesson.description,
          content: lesson.content,
          isPreviewable: String(lesson?.isPreviewable).toLowerCase() === "true",
          duration: lesson.duration || "0:00",
          hasResources: lesson.mediaList?.length > 0,
          mediaList: lesson.mediaList || [],
          videoUrl: lesson.video_url,
        })) || [],
      assignments:
        section.assignments?.map((assignment, index) => ({
          id: assignment.id,
          name: assignment.name,
          description: assignment.description,
          instructions: assignment.instructions,
          estimatedTime: String(assignment.estimatedTime),
          questions: assignment.questions || [],
        })) || [],
    }))

    setCourseData(mappedData)
  }, [courseSection])

  useEffect(() => {
    console.log("currentSectionId", currentSectionId)
  }, [currentSectionId])

  const toggleSection = (sectionId) => {
    setCourseData((prev) =>
      prev.map((section) => (section.id === sectionId ? { ...section, isOpen: !section.isOpen } : section)),
    )
  }
  const restoreBodyScroll = useCallback(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = ""
      document.body.style.paddingRight = ""
    }
  }, [])

  const openAddLectureModal = useCallback((currentSectionId) => {
    setShowAddItemModal(false)
    setEditingLesson(null)
    setTimeout(() => {
      setModalMode("add")
      setIsLectureModalOpen(true)
      setCurrentSectionId(currentSectionId)
      console.log("sectionId trong openAddLectureModal", currentSectionId)
    }, 100)
  }, [])

  const openEditLectureModal = useCallback((lesson) => {
    console.log("lesson", lesson)
    setShowAddItemModal(false)
    setTimeout(() => {
      setModalMode("edit")
      setEditingLesson(lesson)
      setIsLectureModalOpen(true)
    }, 100)
  }, [])

  const handleAddCurriculumItem = useCallback((sectionId) => {
    setIsLectureModalOpen(false)
    setEditingLesson(null)
    setTimeout(() => {
      setCurrentSectionId(sectionId)
      setShowAddItemModal(true)
      console.log("sectionId trong handleAddCurriculumItem", sectionId)
    }, 100)
  }, [])

  const openAddAssignmentModal = useCallback((sectionId) => {
    setModalMode("add")
    setCurrentSectionId(sectionId)
    setIsAssignmentModalOpen(true)
  }, [])

  const openEditAssignmentModal = useCallback((assignment) => {
    setModalMode("edit")
    setEditingLesson(assignment)
    setCurrentSectionId(assignment.sectionId)
    setIsAssignmentModalOpen(true)
  }, [])

  const handleSelectItemType = (type) => {
    setShowAddItemModal(false)

    if (type === "lecture") {
      setTimeout(() => {
        openAddLectureModal(currentSectionId)
        console.log("currentSectionId trong handleSelectItemType", currentSectionId)
      }, 150)
    } else if (type === "assignment") {
      setTimeout(() => {
        openAddAssignmentModal(currentSectionId)
        console.log("currentSectionId trong handleSelectItemType", currentSectionId)
      }, 150)
    }
  }

  const handleLectureModalClose = useCallback(() => {
    setIsLectureModalOpen(false)
    setTimeout(() => {
      setEditingLesson(null)
      setModalMode("add")
      restoreBodyScroll()
    }, 200)
  }, [restoreBodyScroll])

  const handleAssignmentModalClose = useCallback(() => {
    setIsAssignmentModalOpen(false)
    setTimeout(() => {
      setEditingLesson(null)
      setModalMode("add")
      restoreBodyScroll()
    }, 200)
  }, [restoreBodyScroll])

  const handleAddSectionModalClose = useCallback(() => {
    setShowAddSectionModal(false)
    setTimeout(() => {
      restoreBodyScroll()
    }, 200)
  }, [restoreBodyScroll])

  const handleAddItemModalClose = useCallback(() => {
    setShowAddItemModal(false)
    setTimeout(() => {
      setCurrentSectionId(null)
      restoreBodyScroll()
    }, 200)
  }, [restoreBodyScroll])

  const handleUpdateSection = async (sectionId, updateData) => {
    try {
      await updateSectionBySection({
        sectionId: sectionId,
        section: updateData,
      }).unwrap()
      toast.success("Chỉnh sửa thành công !", {
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
    } catch (error) {
      toast.error("Có lỗi xảy ra!", {
        description: `Chi tiết: ${Date.now().toString()}`,
        action: {
          label: "Undo",
        },
        duration: 2000,
        position: "top-right",
        style: {
          backgroundColor: '#f44336',
          color: 'white',
          borderRadius: '10px',
          fontWeight: 'bold',
        },
      });
    } finally {
      setSectionEditingId(null);
    }
  };

  const handleSave = (section) => {
    const hasTitleChanged = editedTitle !== section.title;
    const hasDescChanged = editedDescription !== section.description;

    if (hasTitleChanged || hasDescChanged) {
      handleUpdateSection(section.id, {
        ...(hasTitleChanged && { title: editedTitle }),
        ...(hasDescChanged && { description: editedDescription }),
      });
    }
    setSectionEditingId(null);
  };



  const ResourceDropdown = ({ mediaList = [] }) => {
    if (!mediaList.length) return null

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="ml-2 bg-transparent">
            <Download className="w-4 h-4 mr-1" />
            Tài nguyên
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {mediaList.map((file, idx) => (
            <DropdownMenuItem
              key={file.id}
              onClick={() => {
                const link = document.createElement("a");
                link.href = `/uploads/${file.name}`;
                link.download = file.name;
                link.click();
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              {file.name.length > 30 ? file.name.slice(0, 30) + "..." : file.name}
            </DropdownMenuItem>
          ))}

        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Chương trình giảng dạy</h1>
        <Button variant="outline" onClick={onPreview}>
          Xem trước khóa học
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            i
          </div>
          <p className="text-sm text-blue-800">
            Bắt đầu tạo nội dung khóa học của bạn bằng cách tạo các phần và bài giảng. Sử dụng{" "}
            <span className="font-semibold">Trang tổng quan khóa học</span> để thêm tên và mô tả khóa học, đăng tải hình
            ảnh và video giới thiệu.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {courseData.map((section, index) => (
          <div key={section.id} className="border border-gray-200 rounded-lg">
            <Collapsible open={section.isOpen} onOpenChange={() => toggleSection(section.id)}>
              <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center gap-3 flex-1">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center gap-3 cursor-pointer">
                      {section.isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </CollapsibleTrigger>

                  {/* Phần title + description */}
                  <div className="flex-1 font-medium tracking-wide space-y-1">
                    {isLoading && <LoadingSpinner />}
                    {sectionEditingId === section.id ? (
                      <>
                        <input
                          type="text"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          onClick={(e) => e.stopPropagation()}

                          onKeyDown={(e) => e.key === "Enter" && handleSave(section)}
                          className="border px-2 py-1 text-sm rounded w-full"
                          placeholder="Tiêu đề phần"
                          autoFocus
                        />
                        <input
                          type="text"
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.key === "Enter" && handleSave(section)}
                          className="border px-2 py-1 text-sm rounded w-full mt-1"
                          placeholder="Mô tả phần"
                        />
                      </>
                    ) : (
                      <>
                        <p>{section.name} {index + 1}: {section.title}</p>
                        {section.description && <p className="text-sm text-gray-500">{section.description}</p>}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{section.lessons.length} bài giảng • 1 phút</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          setSectionEditingId(section.id);
                          setEditedTitle(section.title || "");
                          setEditedDescription(section.description || "");
                        }}
                      >
                        Sửa phần
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Xóa phần
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CollapsibleContent>
                <div className="border-t border-gray-200 rounded-md">
                  {section.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-4 m-4 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="bg-gray-100 rounded p-2">
                          <span className="text-sm font-medium flex items-center">
                            <BookHeart className="w-8 h-6 mr-2 text-cyan-500" />
                            Bài giảng {lessonIndex + 1}: {lesson.title}
                          </span>
                        </div>
                        {lesson.description && (
                          <span className="text-sm text-gray-600 ml-2">- {lesson.description}</span>
                        )}
                        {lesson.content && (
                          <div className="text-sm text-gray-500 ml-2">
                            <div
                              className="ql-editor leading-relaxed line-clamp-10 break-words overflow-hidden"
                              dangerouslySetInnerHTML={{ __html: lesson.content }}
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          {lesson.isPreviewable && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Xem trước</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <span className="text-sm text-gray-500">{lesson.duration}</span>
                        <ResourceDropdown mediaList={
                          Array.isArray(lesson.mediaList)
                            ? lesson.mediaList
                            : Object.entries(lesson.mediaList || {}).map(([id, name]) => ({ id, name }))
                        } />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => openEditLectureModal(lesson)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Chỉnh sửa</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Xóa bài giảng</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}

                  {section.assignments.map((assignment, assignmentIndex) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-4 m-4 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="bg-gray-100 rounded p-2">
                          <span className="text-sm font-medium flex items-center">
                            <BookOpen className="w-8 h-6 mr-2 text-pink-500" />
                            Bài tập tự luận {index + 1}: {assignment.name}
                          </span>
                        </div>
                        {assignment.description && (
                          <div
                            className="ql-editor leading-relaxed line-clamp-10 break-words overflow-hidden"
                            dangerouslySetInnerHTML={{ __html: assignment.description }}
                          />
                        )}
                        {assignment.questions && (
                          <div>
                            <span className="text-sm text-cyan-600 ml-2">- {assignment.questions.length} Câu hỏi</span>
                            <div
                              className="ql-editor leading-relaxed line-clamp-10 break-words overflow-hidden"
                              dangerouslySetInnerHTML={{
                                __html: assignment.questions
                                  .map((q, index) => `<p><strong style="color:rgb(90, 30, 255);">Câu hỏi ${index + 1}:</strong> ${q.questionContent}</p>`)
                                  .join("\n"),
                              }}
                            />
                            <span className="text-sm font-bold text-green-600 ml-2">- Câu trả lời</span>
                            <div
                              className="ql-editor leading-relaxed line-clamp-10 break-words overflow-hidden"
                              dangerouslySetInnerHTML={{
                                __html: assignment.questions
                                  .map((q, index) => `<p><strong style="color: #1E90FF;">Trả lời ${index + 1}:</strong> ${q.answerContent || "Chưa có câu trả lời"}</p>`)
                                  .join("\n"),
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">{`${assignment.estimatedTime}`}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => openEditAssignmentModal(assignment)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Chỉnh sửa</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Xóa bài tập</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}

                  <div className="p-4 bg-gray-50">
                    <Button
                      variant="ghost"
                      className="text-purple-600 hover:text-purple-700"
                      onClick={() => handleAddCurriculumItem(section.id)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Thêm mục trong chương trình
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

        ))}
      </div>

      <div className="mt-6">
        <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowAddSectionModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm phần
        </Button>
      </div>
      {showAddSectionModal && (
        <AddSectionModal
          isOpen={showAddSectionModal}
          onClose={handleAddSectionModalClose}
          courseId={courseId}
          position={courseData.length}
        />
      )}

      {showAddItemModal && (
        <AddCurriculumItemModal
          isOpen={showAddItemModal}
          onClose={handleAddItemModalClose}
          onSelectType={handleSelectItemType}
        />
      )}

      {isLectureModalOpen && (
        <AddLectureModal
          isOpen={isLectureModalOpen}
          onClose={handleLectureModalClose}
          sectionId={currentSectionId}
          position={courseData?.find((section) => section.id === currentSectionId)?.lessons.length || 0}
          editingLesson={editingLesson}
          mode={modalMode}
        />
      )}

      {isAssignmentModalOpen && (
        <AssignmentModal
          isOpen={isAssignmentModalOpen}
          onClose={handleAssignmentModalClose}
          sectionId={currentSectionId}
          editingLesson={editingLesson}
          mode={modalMode}
        />
      )}
    </div>
  )
}
