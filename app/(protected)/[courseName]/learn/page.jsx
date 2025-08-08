"use client"

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useGetSectionByCourseQuery } from "@/app/features/courses/courseApi";
import LoadingSpinner from "@/app/_components/LoadingSpinner";
import CenterErrorPage from "@/app/_components/Error";

export default function LearnDefaultPage() {
  const router = useRouter();
  const { courseName } = useParams();
  const { data, isLoading, isError } = useGetSectionByCourseQuery(courseName);

  useEffect(() => {
    if (data?.result?.length > 0) {
      for (const section of data.result) {
        if (section.lessons && section.lessons.length > 0) {
          const firstLesson = section.lessons[0];
          router.replace(`/${courseName}/learn/lecture/${firstLesson.id}`);
          return;
        }
      }
      
      for (const section of data.result) {
        if (section.assignments && section.assignments.length > 0) {
          const firstAssignment = section.assignments[0];
          console.log("Redirecting to first assignment:", firstAssignment.title);
          router.replace(`/${courseName}/learn/practice/${firstAssignment.id}`);
          return;
        }
      }
      router.replace("/courses");
    }
  }, [data, courseName, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
        <div className="ml-3 text-gray-600">Đang tải bài học đầu tiên...</div>
      </div>
    );
  }
  if (isError) {
    return (
      <CenterErrorPage 
        errorCode="404" 
        title="Khóa học không tìm thấy" 
        message="Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa." 
      />
    );
  }

  // �� Fallback loading (trong lúc đang redirect)
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner />
      <div className="ml-3 text-gray-600">Chuyển đến bài học đầu tiên...</div>
    </div>
  );
}