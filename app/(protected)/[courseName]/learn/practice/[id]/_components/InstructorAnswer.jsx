import React from 'react'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Eye } from "lucide-react"

function InstructorAnswer({ answers }) {
    console.log(answers, "answers")
    const handleBackToResults = () => {
        window.history.back();
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Button onClick={handleBackToResults} variant="outline" className="flex items-center gap-2 bg-transparent">
                        <ArrowLeft className="w-4 h-4" />
                        Quay lại kết quả
                    </Button>
                </div>

                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Eye className="w-6 h-6 text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-800">Đáp Án Giảng Viên</h1>
                        </div>
                        <p className="text-gray-600">Dưới đây là đáp án chi tiết và giải thích từ giảng viên</p>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    {answers?.studentAnswers?.map((answer, index) => (
                        <Card key={index} className="overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold">{index + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="ql-editor leading-relaxed text-lg font-semibold text-gray-800 flex-1 pr-4"
                                                dangerouslySetInnerHTML={{ __html: answer.questionContent }} />
                                        </div>
                                        <div className="mb-6">
                                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                                <div className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center">
                                                    <span className="text-orange-600 text-xs">S</span>
                                                </div>
                                                Câu trả lời của bạn:
                                            </h4>
                                            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
                                                <div className="ql-editor leading-relaxed text-lg font-semibold text-gray-800 flex-1 pr-4"
                                                    dangerouslySetInnerHTML={{ __html: answer.userAnswer ? answer.userAnswer : answer.answerContent }} />
                                            </div>
                                        </div>
                                        <div className="mb-6">
                                            <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                                                <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                                                    <span className="text-green-600 text-xs">T</span>
                                                </div>
                                                Đáp án mẫu từ giảng viên:
                                            </h4>
                                            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                                                <div className="ql-editor leading-relaxed text-gray-700  overflow-hidden
                                                whitespace-pre-line break-words line-clamp-6" dangerouslySetInnerHTML={{ __html: answer.userAnswer ? answer.answerContent : answer.correctAnswerContent }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                        <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Nhận xét từ giảng viên:
                        </h4>
                        <div className="ql-editor leading-relaxed text-lg font-semibold text-gray-800 flex-1 pr-4"
                            dangerouslySetInnerHTML={{ __html: answers?.feedback }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InstructorAnswer