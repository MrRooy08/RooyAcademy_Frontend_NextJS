"use client";

import { useState, useMemo, memo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CourseItem from "./CourseItem";
import Link from "next/link";
import { useGetCoursesQuery } from "@/app/features/courses/courseApi";


function CourseList() {
  const { data, isLoading, error } = useGetCoursesQuery({
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });

  const courses = data?.result || [];

  const [filter, setFilter] = useState("All");
  const [coursesToShow, setCoursesToShow] = useState(4);
  const [isExpanded, setIsExpanded] = useState(false);

  // Tính danh sách đã lọc
  const filteredCourses = useMemo(() => {
    if (filter === "Free") {
      return courses.filter((course) => course.price === 0 || course.price === null);
    }
    if (filter === "Paid") {
      return courses.filter((course) => course.price > 0);
    }
    return courses;
  }, [courses, filter]);

  const visibleCourses = filteredCourses.slice(0, coursesToShow);
  const remainingCourse = Math.max(filteredCourses.length - coursesToShow, 0);

  const handleSortChange = (value) => {
    setFilter(value);
    setCoursesToShow(4);
    setIsExpanded(false);
  };

  const handleShowMore = () => {
    if (coursesToShow + 4 <= filteredCourses.length) {
      setCoursesToShow((prev) => prev + 4);
    } else {
      setCoursesToShow(filteredCourses.length);
      setIsExpanded(true);
    }
  };

  const handleShowLess = () => {
    setCoursesToShow(4);
    setIsExpanded(false);
  };

  const handleOpen = () => {
    if (document.body.getAttribute("data-scroll-locked")) {
      document.body.removeAttribute("data-scroll-locked");
    }
  };

  return (
    <div className="p-5 bg-white rounded-lg mt-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-primary">Những kỹ năng bạn cần sẽ có trong này</h2>
          <h2 className="text-gray-500">
          Từ kỹ năng thiết yếu đến các chủ đề chuyên môn, 
          <span className="text-primary">Rooy</span> luôn đồng hành cùng bạn trên hành trình phát triển sự nghiệp..
          </h2>
        </div>

        <Select onValueChange={handleSortChange} onOpenChange={handleOpen}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Tất cả</SelectItem>
            <SelectItem value="Free">Miễn Phí</SelectItem>
            <SelectItem value="Paid">Trả phí</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 mt-5">
        {isLoading ? (
          [1, 2, 3, 4].map((item, index) => (
            <div
              key={index}
              className="w-full h-[240px] rounded-xl m-2 bg-slate-200 animate-pulse"
            />
          ))
        ) : (
          visibleCourses.map((course, index) => (
            <div key={index}>
              <Link href={"/course-preview/" + course.id}>
                <CourseItem course={course} />
              </Link>
            </div>
          ))
        )}
      </div>

      <div className="mt-5">
        {filteredCourses.length > coursesToShow && !isExpanded && (
          <button className="border border-sky-500 rounded-md w-28 h-8 hover:bg-blue-100" onClick={handleShowMore}>
            <span className="cursor-pointer text-[13px] text-blue-600 font-medium">
              Hiển thị thêm {remainingCourse} 
            </span>
          </button>
        )}

        {isExpanded && (
          <button className="border border-sky-500 rounded-md w-28 h-8 hover:bg-blue-100" onClick={handleShowLess}>
            <span className="cursor-pointer text-[13px] text-blue-600 font-medium">
              Thu gọn
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(CourseList);
