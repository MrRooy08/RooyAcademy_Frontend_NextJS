"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Clock,
  BookOpen,
  FileText,
  Save,
  Send,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Timer,
  PenTool,
  Lightbulb,
  Check,
} from "lucide-react"
import { useSections } from "@/app/(protected)/[courseName]/learn/SectionsContext"
import { useParams, useRouter } from "next/navigation"
import InstructorAnswer from "./_components/InstructorAnswer"
import CustomQuill from "@/app/_components/CustomQuill"
import { useGetProgressQuery, useGetProgressAssignmentQuery } from "@/app/features/courses/courseApi"
import { useAuth } from "@/app/Context/AuthContext"
import { toast } from "sonner"


export default function Component() {
  const { user } = useAuth()
  const router = useRouter()
  const [exercise, setExercise] = useState()
  const [answers, setAnswers] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(1 * 60)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [showInstructorAnswer, setShowInstructorAnswer] = useState(false)
  const [showExercise, setShowExercise] = useState(false)

  const [isTimerActive, setIsTimerActive] = useState(false)
  const { id, courseName } = useParams()
  const courseId = courseName

  const enrollmentId = user?.result?.enrolledCourses?.find(
    (en) => en.courseId === courseId
  )?.enrollmentId || null

  const { data: progressData, isLoading: isProgressLoading, error: progressError } = useGetProgressQuery(enrollmentId);
  const { data: progressDataAssignment, isLoading: isProgressLoadingAssignment, error: progressErrorAssignment } = useGetProgressAssignmentQuery(enrollmentId);
  console.log("progressDataAssignment", progressDataAssignment)

  const progressId = progressData?.result?.progressId || enrollmentId;

  const sections = useSections()

  const { refetch: refetchProgress } = useGetProgressQuery(enrollmentId, {
    skip: !enrollmentId
  })
  let assignments = null
  let completed = null;
  for (const s of sections) {
    const found = s.assignments?.find((as) => as.id === id)
    if (found) {

      assignments = found
      completed = found.completed
      break
    }
  }
  console.log(assignments, "assignments", completed, "completed")

  useEffect(() => {
    if (assignments.questions && assignments.questions.length > 0 && answers.length === 0) {
      const currentAssignmentData = progressDataAssignment?.result?.find(
        (item) => item.assignmentId === assignments.id
      );

      const initialAnswers = assignments.questions.map((q) => {
        const matchedAnswer = currentAssignmentData?.studentAnswers?.find(
          (a) => a.questionId === q.id
        );

        return {
          questionId: q.id,
          questionContent: q.questionContent,
          answerContent: q.answerContent,
          userAnswer: matchedAnswer?.answerContent || "",
          feedback: currentAssignmentData?.feedback?.replace(/<[^>]+>/g, '') || "",
          lastSaved: new Date(),
        };
      });
      setAnswers(initialAnswers)
    }
    setExercise(assignments)
  }, [assignments])

  console.log("answers", answers)

  const saveAnswersToAPI = async (answersData) => {
    if (!progressId) {
      toast.error("Có sai xót xảy ra vui lòng thử lại!!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/assignments/submit-with-answers`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          progressId,
          assignmentId: id,
          questions: answersData.map((answer) => ({
            id: answer.questionId,
            answerContent: answer.userAnswer,
          })),
          finishedTime: timeRemaining
        })
      })

      if (!response.ok) {
        toast.error("Nộp bài thất bại!");
        return;
      }
      await refetchProgress()
      stopTimer();
      setIsSubmitted(true)
      toast.success("Nộp bài thành công!");
      return await response.json()
    } catch (error) {
      toast.error("Nộp bài thất bại!");
    }
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const updateAnswer = (questionId, answer) => {
    setAnswers((prev) => prev.map((a) => (a.questionId === questionId ? { ...a, userAnswer: answer, lastSaved: new Date() } : a)))
  }

  const getPlainTextFromHtml = (html) => {
    if (!html) return ""
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = html
    return tempDiv.textContent || tempDiv.innerText || ""
  }

  const hasValidAnswer = (userAnswer) => {
    if (!userAnswer) return false
    const plainText = getPlainTextFromHtml(userAnswer).trim()
    return plainText.length > 0
  }

  const getWordCount = (html) => {
    const plainText = getPlainTextFromHtml(html)
    if (!plainText.trim()) return 0
    return plainText.split(/\s+/).filter(word => word.length > 0).length
  }

  const getCompletionProgress = () => {
    const answeredQuestions = answers.filter((a) => hasValidAnswer(a.userAnswer)).length
    return (answeredQuestions / assignments.questions.length) * 100 || 0
  }

  const isAllQuestionsAnswered = () => {
    return answers.every((a) => hasValidAnswer(a.userAnswer))
  }

  const handleInstructorAnswer = () => {
    setShowInstructorAnswer(true)
  }

  let timerRef = useRef();

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTimerActive(false);
  };
  const handleStartExercise = () => {
    setShowExercise(true)
    setIsTimerActive(true)
    if (exercise?.estimatedTime) {
      setTimeRemaining(exercise.estimatedTime)
    }

    if (timerRef.current) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  const currentUserAnswer = answers.find((a) => a.questionId === assignments.questions[currentQuestionIndex]?.id)?.userAnswer || ""
  console.log("currentUserAnswer", currentUserAnswer)
  const currentAssignmentData = progressDataAssignment?.result?.find(
    (item) => item.assignmentId === assignments?.id
  );

  const currentAnswer = currentAssignmentData?.studentAnswers?.find(
    (answer) => answer.questionId === assignments?.questions[currentQuestionIndex]?.id
  );

  console.log("currentAssignmentData:", currentAssignmentData);
  console.log("currentAnswer:", currentAnswer);


  if (isSubmitted || completed) {
    const timeCompleted = isSubmitted
      ? timeRemaining
      : currentAnswer?.finishedTime || 0;
    const answeredCount = isSubmitted
      ? answers.filter((a) => a.userAnswer.trim() !== "").length
      : currentAssignmentData?.studentAnswers?.length || 0;
    const instructorAnswers =
      isSubmitted
        ? answers
        : currentAssignmentData || [];

    const totalQuestions = assignments.questions.length;
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full shadow-2xl border-0 bg-white/90 backdrop-blur-sm animate-fade-in">
          <CardContent className="text-center p-12">
            <div className="mb-6">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto animate-bounce" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Bài Tập Đã Được Nộp!</h2>
            <p className="text-gray-600 text-lg mb-6">
              Cảm ơn bạn đã hoàn thành bài tập. Kết quả sẽ được thông báo sớm nhất có thể.
            </p>
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-medium">Thời gian hoàn thành: {formatTime(timeCompleted)}</p>
              <p className="text-green-700">
                Số câu đã trả lời: {answeredCount} /{totalQuestions}
              </p>
            </div>
            <Button
              onClick={handleInstructorAnswer}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Lightbulb className="mr-2 h-5 w-5" />
              Xem Đáp Án Giảng Viên
            </Button>
            {showInstructorAnswer && <InstructorAnswer answers={instructorAnswers} />}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-4">
        <div className="mb-6 animate-fade-in">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      <div className="ql-editor leading-relaxed" dangerouslySetInnerHTML={{ __html: exercise?.name }} />
                    </CardTitle>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-2xl font-bold ${isTimerActive
                      ? (timeRemaining < 600 ? "text-red-200 animate-pulse" : "text-white")
                      : "text-blue-100"
                      }`}
                  >
                    <Timer className="inline h-6 w-6 mr-2" />
                    {isTimerActive ? formatTime(timeRemaining) : formatTime(exercise?.estimatedTime || 0)}
                  </div>
                  <p className="text-blue-100 text-sm">
                    {isTimerActive ? (
                      <>
                        Thời gian còn lại
                        {formatTime(timeRemaining)}
                      </>
                    ) : (
                      <>
                        Thời gian dự kiến
                      </>
                    )}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4 animate-slide-in-left">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Tiến Độ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Hoàn thành</span>
                    <span className="font-medium">
                      {completed ? "100" : Math.round(getCompletionProgress())}%
                    </span>
                  </div>
                  <Progress value={
                    completed ? 100 : getCompletionProgress()
                  } className="h-2" />
                  <p className="text-xs text-gray-600">
                    {completed ? assignments.questions.length : answers.filter((a) => hasValidAnswer(a.userAnswer)).length}/{assignments.questions.length} câu hỏi
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Câu Hỏi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {exercise?.questions.map((_, index) => {
                    const isAnswered = hasValidAnswer(answers[index]?.userAnswer)
                    const isCurrent = index === currentQuestionIndex
                    return (
                      <Button
                        key={index}
                        variant={isCurrent ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentQuestionIndex(index)}
                        className={`w-full justify-start transition-all duration-300  ${isCurrent
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                          : isAnswered
                            ? "border-green-300 bg-green-50 hover:bg-green-100"
                            : "hover:bg-gray-50"
                          }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${isAnswered ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
                            }`}
                        >
                          {isAnswered ? <CheckCircle className="h-3 w-3" /> : index + 1}
                        </div>
                        Câu {index + 1}
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6 animate-slide-in-right">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 ">
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Thời lượng: {formatTime(exercise?.estimatedTime)}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800">Mô tả bài tập:</h3>
                  <div className="ql-editor leading-relaxed" dangerouslySetInnerHTML={{ __html: exercise?.description }} />
                  <h3 className="font-semibold text-gray-800">Hướng dẫn:</h3>
                  <div className="ql-editor leading-relaxed" dangerouslySetInnerHTML={{ __html: exercise?.instructions }} />
                </div>
                <Separator className="my-4" />
                <div className="flex justify-center">
                  {
                    completed ? (
                      <>
                      </>
                    ) : (
                      <>
                        {showExercise ? (
                          <div className="text-center">
                            <Button
                              disabled
                              className="bg-red-600 hover:bg-red-700 cursor-not-allowed mb-2"
                            >
                              <Timer className="mr-2 h-5 w-5" />
                              Đang làm bài - Thời gian: {formatTime(timeRemaining)}
                            </Button>
                            <p className="text-sm text-gray-600">
                              Bài tập sẽ tự động nộp khi hết thời gian
                            </p>
                          </div>
                        ) : (
                          <Button
                            onClick={handleStartExercise}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Lightbulb className="mr-2 h-5 w-5" />
                            Bắt đầu làm bài tập
                          </Button>
                        )}
                      </>
                    )
                  }
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm animate-fade-in-up">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <PenTool className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xl">Câu hỏi {currentQuestionIndex + 1}</span>
                    <Badge variant="secondary" className="ml-3 bg-white/20 text-white">
                      {
                        completed ? (
                          <Check className="h-4 w-4 mr-2" />
                        ) : (
                          <>
                            {hasValidAnswer(currentUserAnswer) ? "Đã trả lời" : "Chưa trả lời"}
                          </>
                        )
                      }
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500">
                    <div className="flex items-start gap-3">
                      {
                        completed ? (
                          <>
                            <Lightbulb className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                            <div className="ql-editor leading-relaxed"
                              dangerouslySetInnerHTML={
                                { __html: exercise?.questions[currentQuestionIndex]?.questionContent }
                              } />
                          </>
                        ) : (
                          <>
                            {showExercise
                              ? (
                                <>
                                  <Lightbulb className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                                  <div className="ql-editor leading-relaxed"
                                    dangerouslySetInnerHTML={
                                      { __html: exercise?.questions[currentQuestionIndex]?.questionContent }
                                    } />
                                </>
                              )
                              : (
                                <>
                                  <Lightbulb className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                                  <p>Nhấn "Bắt đầu làm bài tập" để bắt đầu</p>
                                </>
                              )
                            }
                          </>
                        )
                      }
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Câu trả lời của bạn:</label>
                    {
                      completed ? (
                        <>
                          <div className="ql-editor leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: currentAnswer?.answerContent || ''
                            }} />
                          <p className="text-xs text-gray-500">
                            Số từ: {getWordCount(currentAnswer?.answerContent || '')}
                          </p>
                        </>
                      ) : (
                        <>
                          {showExercise
                            ? (
                              <>
                                <CustomQuill
                                  value={currentUserAnswer}
                                  disabled={timeRemaining <= 0}
                                  onChange={(value) => updateAnswer(exercise?.questions[currentQuestionIndex]?.id, value)}
                                  placeholder="Mô tả chi tiết về bài tập..."
                                  minHeight={100}
                                  maxHeight={150}
                                />

                                <p className="text-xs text-gray-500">
                                  Số từ: {getWordCount(currentUserAnswer)}
                                </p>
                              </>
                            )
                            : (
                              <></>
                            )
                          }
                        </>
                      )
                    }
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                      disabled={currentQuestionIndex === 0 || !isTimerActive}
                      className="hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Câu trước
                    </Button>

                    <div className="flex gap-3">
                      <>
                        {completed ? (
                          <Button
                            variant="default"
                            className="hover:scale-105 hover:bg-green-200 transition-transform duration-300 bg-green-600 text-white cursor-not-allowed"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Đã hoàn thành
                          </Button>
                        ) : (
                          <>
                            {currentQuestionIndex === exercise?.questions.length - 1 ? (
                              <Button
                                onClick={() => setShowSubmitConfirm(true)}
                                disabled={!isAllQuestionsAnswered() || !isTimerActive}
                                className={`hover:scale-105 transition-all duration-300 ${isAllQuestionsAnswered() && isTimerActive
                                  ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                  : "bg-gray-400 cursor-not-allowed opacity-50"
                                  }`}
                              >
                                <Send className="h-4 w-4 mr-2" />
                                {!isTimerActive
                                  ? "Chưa bắt đầu"
                                  : isAllQuestionsAnswered()
                                    ? "Nộp Bài"
                                    : `Hoàn thành ${answers.filter(a => hasValidAnswer(a.userAnswer)).length}/${assignments.questions.length} câu`}
                              </Button>
                            ) : (
                              <Button
                                onClick={() =>
                                  setCurrentQuestionIndex(Math.min(exercise?.questions.length - 1, currentQuestionIndex + 1))
                                }
                                disabled={!isTimerActive}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Câu tiếp →
                              </Button>
                            )}
                          </>
                        )}
                      </>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {showSubmitConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <Card className="max-w-md w-full shadow-2xl border-0 bg-white animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  Xác Nhận Nộp Bài
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Bạn có chắc chắn muốn nộp bài? Sau khi nộp, bạn sẽ không thể chỉnh sửa câu trả lời.
                  </p>
                  <AlertCircle className="h-4 w-4" />
                  Số câu đã trả lời: {answers.filter((a) => a.answerContent.trim() !== "").length}/
                  {exercise?.questions.length}
                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setShowSubmitConfirm(false)}>
                      Hủy
                    </Button>
                    <Button
                      onClick={() => saveAnswersToAPI(answers)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      Xác Nhận Nộp
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-slide-in-left { animation: slide-in-left 0.8s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.8s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
      `}</style>
    </div>
  )
}
