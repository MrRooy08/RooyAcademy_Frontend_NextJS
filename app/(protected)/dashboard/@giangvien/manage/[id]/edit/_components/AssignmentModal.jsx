"use client"

import { useState, useEffect, useCallback } from "react"
import "react-quill-new/dist/quill.snow.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Trash2, BookOpen, Clock, FileText, HelpCircle, Lightbulb } from "lucide-react"
import { useCreateAssignmentBySectionMutation, useUpdateAssignmentByIdMutation } from "@/app/features/courses/courseApi"
import CustomQuill from "@/app/_components/CustomQuill"
import { toast } from "sonner"

export function AssignmentModal({ isOpen, onClose, sectionId, mode, editingLesson }) {
  const [createAssignmentBySection] = useCreateAssignmentBySectionMutation()
  const [updateAssignmentById] = useUpdateAssignmentByIdMutation()
  const [localSectionId, setLocalSectionId] = useState(null)
  console.log("sectionId received:", localSectionId)

  const [exercise, setExercise] = useState({
    id: "",
    name: "",
    description: "",
    estimatedTime: "",
    instructions: "",
    questions: [{ questionContent: "", answerContent: "", index: 1 }],
  })

  const [originalData, setOriginalData] = useState(null)
  const [completionProgress, setCompletionProgress] = useState(0)

  useEffect(() => {
    if (sectionId && sectionId !== localSectionId) {
      console.log("Updating localSectionId to:", sectionId)
      setLocalSectionId(sectionId)
    }
  }, [sectionId, localSectionId])

  useEffect(() => {
    if (mode === "edit" && editingLesson) {
      const initialData = {
        id: editingLesson.id || "",
        name: editingLesson.name || "",
        description: editingLesson.description || "",
        estimatedTime: editingLesson.estimatedTime || "",
        instructions: editingLesson.instructions || "",
        questions: editingLesson.questions || [{ questionContent: "", answerContent: "", index: 1 }],
      }
      setExercise(initialData)
      setOriginalData(JSON.parse(JSON.stringify(initialData)))
    } else if (mode === "add") {
      const initialData = {
        name: "",
        description: "",
        estimatedTime: "",
        instructions: "",
        questions: [{ questionContent: "", answerContent: "", index: 1 }],
      }
      setExercise(initialData)
      setOriginalData(null)
    }
  }, [mode, editingLesson, isOpen])

  const calculateProgress = useCallback(() => {
    const fields = [
      exercise.name,
      exercise.description,
      exercise.estimatedTime,
      exercise.instructions,
      ...exercise.questions.flatMap((q) => [q.questionContent, q.answerContent]),
    ]
    const filledFields = fields.filter((field) => field && field.toString().trim() !== "").length
    const progress = fields.length > 0 ? (filledFields / fields.length) * 100 : 0
    setCompletionProgress(Math.round(progress))
  }, [exercise])

  useEffect(() => {
    calculateProgress()
  }, [exercise, calculateProgress])

  const addQuestion = (index) => {
    const newQuestion = {
      questionContent: "",
      answerContent: "",
      isNew: true,
      index: index + 1,
    }
    setExercise((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }))
  }

  const removeQuestion = (index) => {
    setExercise((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }))
  }

  const updateQuestion = (index, field, value) => {
    setExercise((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) => (i === index ? { ...q, [field]: value } : q)),
    }))
  }

  const updateExercise = (field, value) => {
    setExercise((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const normalizeQuillContent = (content) => {
    if (!content) return ''
    return content
      .replace(/<p><br><\/p>/g, '')
      .replace(/<p>\s*<\/p>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  const hasChanges = useCallback(() => {
    if (mode === "add" || !originalData) {
      return true
    }
    if (exercise.name !== originalData.name ||
      exercise.estimatedTime !== originalData.estimatedTime) {
      return true
    }
    if (normalizeQuillContent(exercise.description) !== normalizeQuillContent(originalData.description) ||
      normalizeQuillContent(exercise.instructions) !== normalizeQuillContent(originalData.instructions)) {
      return true
    }
    if (exercise.questions.length !== originalData.questions.length) {
      return true
    }

    for (let i = 0; i < exercise.questions.length; i++) {
      const currentQ = exercise.questions[i]
      const originalQ = originalData.questions[i]

      if (normalizeQuillContent(currentQ.questionContent) !== normalizeQuillContent(originalQ.questionContent) ||
        normalizeQuillContent(currentQ.answerContent) !== normalizeQuillContent(originalQ.answerContent)) {
        return true
      }
    }

    return false
  }, [exercise, originalData, mode])

  const getChangedFields = useCallback(() => {
    if (mode === "add" || !originalData) {
      return {
        ...exercise,
        sectionId: localSectionId,
      }
    }

    const changedFields = {}

    if (exercise.name !== originalData.name) {
      changedFields.name = exercise.name
    }
    if (exercise.estimatedTime !== originalData.estimatedTime) {
      changedFields.estimatedTime = exercise.estimatedTime
    }
    if (normalizeQuillContent(exercise.description) !== normalizeQuillContent(originalData.description)) {
      changedFields.description = exercise.description
    }
    if (normalizeQuillContent(exercise.instructions) !== normalizeQuillContent(originalData.instructions)) {
      changedFields.instructions = exercise.instructions
    }

    if (mode === "edit") {
      const originalIds = new Set(originalData.questions.map(q => q.id).filter(Boolean));
      const currentIds = new Set(exercise.questions.map(q => q.id).filter(Boolean));
      
      const deletedQuestions = originalData.questions
        .filter(q => q.id && !currentIds.has(q.id))
        .map(q => q.id);
      
      const addedQuestions = exercise.questions
        .filter(q => q.isNew)
        .map(({ isNew, ...rest }) => rest);
      
      const updatedQuestions = exercise.questions
        .filter(q => !q.isNew && q.id)
        .map(question => {
          const originalQ = originalData.questions.find(q => q.id === question.id);
          if (!originalQ) return null;
          
          const isChanged =
            normalizeQuillContent(question.questionContent) !== normalizeQuillContent(originalQ.questionContent) ||
            normalizeQuillContent(question.answerContent) !== normalizeQuillContent(originalQ.answerContent);
          
          return isChanged ? { id: question.id, questionContent: question.questionContent, answerContent: question.answerContent } : null;
        })
        .filter(Boolean);
      
      if (addedQuestions.length > 0 || updatedQuestions.length > 0 || deletedQuestions.length > 0) {
        changedFields.questions = {};
        
        if (addedQuestions.length > 0) {
          changedFields.questions.add = addedQuestions;
        }
        
        if (updatedQuestions.length > 0) {
          changedFields.questions.update = updatedQuestions;
        }
        
        if (deletedQuestions.length > 0) {
          changedFields.questions.delete = deletedQuestions;
        }
      }
    } else {
      const questionsWithoutNewFlag = exercise.questions.map(({ isNew, ...rest }) => rest);
      changedFields.questions = questionsWithoutNewFlag;
    }


    return changedFields
  }, [exercise, originalData, mode, editingLesson?.id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const assignmentData = getChangedFields()
    console.log('Sending changed fields:', assignmentData)

    try {
      if (mode === "add") {
        await createAssignmentBySection(assignmentData).unwrap()
      } else {
        await updateAssignmentById({assignmentId:editingLesson.id,body:assignmentData}).unwrap()
      }
      const successMessage = mode === "add" ? "Tạo bài tập thành công !" : "Cập nhật bài tập thành công !"
      const successDescription = mode === "add"
        ? "Bài tập đã được tạo thành công"
        : "Các thay đổi đã được lưu thành công"

      toast.success(successMessage, {
        description: successDescription,
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
      onClose()
    } catch (error) {
      console.error('Error creating assignment:', error)
      toast.error("Lỗi khi tạo bài tập. Vui lòng thử lại.", {
        description: "Chi tiết: " + Date.now().toString(),
        action: {
          label: "Undo",
        },
        duration: 3000,
        position: "top-right",
        style: {
          backgroundColor: '#f44336',
          color: 'white',
          borderRadius: '10px',
          fontWeight: 'bold',
        },
      })
    }
  }

  const isFormValid = () => {
    return (
      exercise.name.trim() !== "" &&
      exercise.description.trim() !== "" &&
      exercise.estimatedTime.trim() !== "" &&
      exercise.instructions.trim() !== "" &&
      exercise.questions.every((q) => q.questionContent.trim() !== "" && q.answerContent.trim() !== "")
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {mode === "add" ? `Thêm bài tập tự luận` : "Chỉnh sửa bài tập"}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Tiến độ hoàn thành</span>
              <span className="text-sm text-gray-500">{Math.round(completionProgress)}%</span>
            </div>
            <Progress value={completionProgress} className="h-2" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Thông Tin Cơ Bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tiêu đề bài tập *</Label>
                    <Input
                      id="name"
                      value={exercise.name}
                      onChange={(e) => updateExercise("name", e.target.value)}
                      placeholder="Nhập tiêu đề bài tập..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="flex items-center gap-1">
                      <Clock className="h-6 w-4" />
                      Thời lượng ước tính *
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      min={0}
                      max={120}
                      value={exercise.estimatedTime}
                      onInvalid={(e) => e.target.setCustomValidity("Giá trị phải lớn hơn hoặc bằng 0")}
                      onInput={(e) => e.target.setCustomValidity("")}
                      onChange={(e) => updateExercise("estimatedTime", e.target.value)}
                      placeholder="Nhập số giờ làm bài"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Mô tả bài tập *
                  </Label>
                  <CustomQuill
                    value={exercise.description}
                    onChange={(value) => updateExercise("description", value)}
                    placeholder="Mô tả chi tiết về bài tập..."
                    minHeight={100}
                    maxHeight={150}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Hướng dẫn thực hiện *</Label>
                  <CustomQuill
                    value={exercise.instructions}
                    onChange={(value) => updateExercise("instructions", value)}
                    placeholder="Hướng dẫn chi tiết cách thực hiện bài tập..."
                    minHeight={100}
                    maxHeight={150}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-green-600" />
                    Câu Hỏi & Giải Pháp
                  </CardTitle>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {exercise.questions.length} câu hỏi
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {exercise.questions.map((question, index) => (
                  <div key={index} className="space-y-4 p-4 border hover:border-blue-500 rounded-lg">
                    <div className="flex justify-between items-center bg-wine-gradient rounded-md p-2">
                      <h3 className="font-bold text-white">Câu hỏi {index + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(index)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-4 ">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                          <HelpCircle className="h-4 w-4" />
                          Nội dung câu hỏi *
                        </Label>
                        <CustomQuill
                          value={question.questionContent}
                          onChange={(value) => updateQuestion(index, "questionContent", value)}
                          placeholder="Nhập nội dung câu hỏi..."
                          minHeight={80}
                          maxHeight={120}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                          <Lightbulb className="h-4 w-4" />
                          Giải pháp *
                        </Label>
                        <CustomQuill
                          value={question.answerContent}
                          onChange={(value) => updateQuestion(index, "answerContent", value)}
                          placeholder="Nhập giải pháp chi tiết cho câu hỏi này..."
                          minHeight={100}
                          maxHeight={180}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addQuestion(exercise.questions.length)}
                  className="w-full border-dashed"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm câu hỏi mới
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid() || (mode === "edit" && !hasChanges())}
                className={mode === "edit" && !hasChanges() ? "opacity-50 cursor-not-allowed" : ""}
              >
                {mode === "add" ? "Tạo bài tập" : "Lưu thay đổi"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}