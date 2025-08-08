"use client"
import React, { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"
import { useSections } from "@/app/(protected)/[courseName]/learn/SectionsContext"
import { useGetSectionByCourseQuery } from "@/app/features/courses/courseApi"
import CenterErrorPage from "@/app/_components/Error"
import { getVideoURL } from "@/lib/media";
import { useCompleteLessonMutation, useGetProgressQuery } from "@/app/features/courses/courseApi";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Video, ImageIcon, FileText, Download, ArrowRight } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import LoadingSpinner from "@/app/_components/LoadingSpinner"
import { useAuth } from "@/app/Context/AuthContext"
import { toast } from "sonner";
import { motion } from 'framer-motion';

export default function LecturePage() {
  const { user } = useAuth();

  const [hideNextLessonButton, setHideNextLessonButton] = useState(false);
  const [hideNextSectionButton, setHideNextSectionButton] = useState(false);

  const { id, courseName } = useParams() 
  const courseId = courseName;


  const enrollmentId = user?.result?.enrolledCourses?.find(
    (en) => en.courseId === courseId
  )?.enrollmentId || null;

  const sections = useSections()
  let lesson = null
  for (const s of sections) {
    const found = s.lessons?.find((ls) => ls.id === id)
    if (found) {
      lesson = found
      break
    }
  }
  const { data: fetchedLesson, isLoading, isError } = useGetSectionByCourseQuery(id, { skip: !!lesson })
  lesson = lesson || fetchedLesson

  const [completeLesson, { isLoading: isCompletingLesson }] = useCompleteLessonMutation();
  const router = useRouter();
  const { data: progressData = {}, isLoading: isProgressLoading, error: progressError, refetch: refetchProgress } = useGetProgressQuery(enrollmentId, {
    skip: !enrollmentId
  });

  const completedLessonIds = useMemo(() => {
    if (!progressData?.result?.sectionProgress) return [];

    const completed = [];
    progressData.result.sectionProgress.forEach(section => {
      section.lessons?.forEach(lesson => {
        if (lesson.isCompleted) {
          completed.push(lesson.lessonId);
        }
      });
    });
    return completed;
  }, [progressData]);

  const isCompleted = completedLessonIds.includes(id);

  const progressSummary = {
    completionPercentage: progressData?.result?.completionPercentage || 0,
    completedLessons: progressData?.result?.completedLessons || 0,
    totalLessons: progressData?.result?.totalLessons || 0,
    nextLesson: progressData?.result?.nextLesson || null
  };

  useEffect(() => {
    setHideNextLessonButton(false);
    setHideNextSectionButton(false);
  }, [id]);

  const currentLessonInfo = useMemo(() => {
    if (!sections.length) return null;

    for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
      const section = sections[sectionIndex];
      const lessonIndex = section.lessons?.findIndex(l => l.id === id);

      if (lessonIndex !== -1) {
        return {
          sectionIndex,
          lessonIndex,
          section,
          lesson: section.lessons[lessonIndex],
          isLastLessonInSection: lessonIndex === (section.lessons?.length - 1),
          isLastSection: sectionIndex === sections.length - 1,
          nextLessonInSection: lessonIndex < (section.lessons?.length - 1) ? section.lessons[lessonIndex + 1] : null,
          hasNextLessonInSection: lessonIndex < (section.lessons?.length - 1),
          nextSection: sectionIndex < sections.length - 1 ? sections[sectionIndex + 1] : null
        };
      }
    }
    return null;
  }, [sections, id]);
  const handleNextLesson = () => {
    if (currentLessonInfo?.nextLessonInSection) {
      router.push(`/${courseId}/learn/lecture/${currentLessonInfo.nextLessonInSection.id}`);
    }
  };

  const handleNextSection = () => {
    if (currentLessonInfo?.nextSection) {
      const firstLessonInNextSection = currentLessonInfo.nextSection.lessons?.[0];
      if (firstLessonInNextSection) {
        router.push(`/${courseId}/learn/lecture/${firstLessonInNextSection.id}`);
      }
    }
  };

  const handleCompleteLesson = () => {
    try {
      const result = completeLesson({ enrollmentId, lessonId: id }).unwrap();
      toast.success("Học giỏi dữ zzzzzzzzzz !", {
        description: "Ê bà là người học nhanh nhất lunn á",
        action: {
          label: "Undo",
        },
        duration: 10000,
        position: "top-right",
        style: {
          backgroundColor: '#4caf50',
          color: 'white',
          borderRadius: '10px',
        },
        icon: (
          <motion.span
            initial={{ y: 0 }}
            animate={{ y: [0, -8, 0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            style={{ fontSize: '20px' }}
          >
            ✅
          </motion.span>
        ),
      })

    } catch (error) {
      toast.error("❌ Ê chưa học xong mà", {
        description: "Ê chưa học xong mà ",
        action: {
          label: "Undo",
        },
        duration: 10000,
        position: "top-right",
        style: {
          backgroundColor: 'red',
          color: 'white',
          borderRadius: '10px',
        },
        icon: (
          <motion.span
            initial={{ y: 0 }}
            animate={{ y: [0, -8, 0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            style={{ fontSize: '20px' }}
          >
            ❌
          </motion.span>
        ),
      })
    }
  }

  const shouldShowNextLessonButton = useMemo(() => {
    return isCompleted &&
      currentLessonInfo?.hasNextLessonInSection &&
      !hideNextLessonButton;
  }, [isCompleted, currentLessonInfo, hideNextLessonButton]);

  const shouldShowNextSectionButton = useMemo(() => {
    return isCompleted &&
      currentLessonInfo?.isLastLessonInSection &&
      !currentLessonInfo?.isLastSection &&
      currentLessonInfo?.nextSection?.lessons?.length > 0 &&
      !hideNextSectionButton;
  }, [isCompleted, currentLessonInfo, hideNextSectionButton]);

  const ResourceDropdown = ({ mediaList = [] }) => {
    if (!mediaList.length) return null

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="xs" className="bg-transparent">
            <Download className="w-4 h-4 mr-1" />
            Tài nguyên
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {mediaList.map((file, idx) => (
            <DropdownMenuItem
              key={file.id}
              onClick={() => {
                (async () => {
                  const url = `${process.env.NEXT_PUBLIC_API_URL_LESSON_RESOURCE || ""}${lesson.id}/${file.name}`;
                  try {
                    const res = await fetch(url, {
                      credentials: "include",
                    });
                    if (!res.ok) throw new Error("Download failed");
                    const blob = await res.blob();
                    const downloadUrl = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = downloadUrl;
                    link.download = file.name;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    URL.revokeObjectURL(downloadUrl);
                    toast.success("Tải xuống thành công!", {
                      description: "File đã được tải xuống.",
                      action: {
                        label: "Undo",
                      },
                      duration: 10000,
                      position: "top-right",
                      style: {
                        backgroundColor: '#4caf50',
                        color: 'white',
                        borderRadius: '10px',
                      },
                      icon: (
                        <motion.span
                          initial={{ y: 0 }}
                          animate={{ y: [0, -8, 0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                          style={{ fontSize: '20px' }}
                        >
                          ✅
                        </motion.span>
                      ),
                    })
                  } catch (e) {
                    console.error(e);
                  }
                })();
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


  if (isLoading) return <LoadingSpinner />
  if (isError) return <CenterErrorPage errorCode="404" title="Bài giảng không tìm thấy rồiiiiiiii" message="Xin lỗi, bài giảng bạn đang tìm kiếm không tồn tại." />

  return (
    <div className="m-4 mx-auto space-y-4 max-w-7xl w-full">
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Tiến độ khóa học</span>
          <span className="text-sm text-blue-600">
            {progressSummary.completedLessons}/{progressSummary.totalLessons} bài học
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressSummary.completionPercentage}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {progressSummary.completionPercentage.toFixed(1)}% hoàn thành
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-center">{lesson.name}</h1>
        <p className="text-gray-500 font-bold text-center"> {lesson.description}</p>
      </div>
      <ResourceDropdown
        mediaList={
          Array.isArray(lesson.mediaList)
            ? lesson.mediaList
            : Object.entries(lesson.mediaList || {}).map(([id, name]) => ({ id, name }))
        } />
      {
        lesson.video_url && (
          <video controls className="w-full">
            <source src={getVideoURL(lesson.video_url, lesson.id)} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        )
      }
      <div className="flex items-center justify-center">
        <div className="ql-editor leading-relaxed" dangerouslySetInnerHTML={{ __html: lesson.content }} />
      </div>

      <div className="flex items-center gap-4">
        {isCompleted
          ?
          "Đã học ✓"
          :
          <div className="flex items-center">
            <Button
              disabled={isCompleted || isCompletingLesson}
              onClick={handleCompleteLesson}
              className={isCompleted ? "bg-green-500 text-white px-3 py-1 rounded" : "bg-green-600 hover:bg-green-700"}
            >
              <Check className="w-4 h-4 mr-2" />
              {isCompletingLesson ? "Đang xử lý..." : "Đánh dấu đã học"}
            </Button>
          </div>
        }
      </div>

      {shouldShowNextLessonButton && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 
           max-w-lg bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-200 hover:scale-105 z-50 relative "
        >
          <button
            onClick={() => setHideNextLessonButton(true)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 hover:scale-110"
            title="Tắt thông báo"
          >
            <X className="w-3 h-3" />
          </button>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">✅ Bài học hoàn thành!</p>
              <p className="font-medium text-gray-900">Tiếp tục: {currentLessonInfo?.nextLessonInSection?.name}</p>
            </div>
            <Button
              onClick={handleNextLesson}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 flex items-center gap-2 transition-all duration-200 hover:scale-105"
            >
              Bài tiếp theo
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {shouldShowNextSectionButton && (
        <div className="p-4 bg-gradient-to-r from-pink-50 to-indigo-50 rounded-xl border border-blue-200 shadow-2xl backdrop-blur-sm
            bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg transition-all duration-200 hover:scale-105 relative">
          <button
            onClick={() => setHideNextSectionButton(true)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 hover:scale-110 z-10"
            title="Tắt thông báo"
          >
            <X className="w-3 h-3" />
          </button>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">🎉 Bạn đã hoàn thành phần này!</p>
              <p className="font-medium text-gray-900">Tiếp tục với: {currentLessonInfo?.nextSection?.title}</p>
            </div>
            <Button
              onClick={handleNextSection}
              className="bg-champagne-pink hover:bg-blue-700 text-dark font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105"
            >
              Phần kế tiếp
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}