"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CourseItem from "./CourseItem";
import Link from "next/link";


function CourseList() {
  //fetch course list
  const [course, setCourse] = useState([]); // khởi tạo ds đầu tiên 
  const [isExpanded, setIsExpanded] = useState(false); // nút mở rộng 
  const [coursesToShow, setCoursesToShow] = useState(4); // danh sách hiển thị tất cả 
  const [remainingCourse, setRemainingCourse] = useState(0); // danh sách còn lại để hiển thị 
  const [sortedCourse,setSortedCourse] = useState([]); // danh sách sau khi sắp xếp và lọc ra
  const updateRemainingCourses = () =>
    {
      const remaining = sortedCourse.length - coursesToShow;
      setRemainingCourse(remaining >= 4 ? 4 : remaining );
    }


  const getCourses = async () => {
    const response = await fetch("http://localhost:8080/course", {
      method: "GET",
    });
    const data = await response.json();
    console.log(data);

    setCourse(data.result);
    setSortedCourse(data.result);
  };

  const handleSortChange = (value) =>
  {
      setCoursesToShow(4);
      let sorted = [...course];
      if (value === 'Free')
      {
        sorted = sorted.filter((course) => course.price === null);
      }
      else if (value === 'Paid')
      {
        sorted = sorted.filter((course) => course.price > 0);
      } else {
        sorted = course; // Show all courses
      }
      setSortedCourse(sorted);
      updateRemainingCourses(sorted);
  }

  const handleShowMore = () => {
    
    // Khi click "Xem thêm", mở rộng số khóa học để hiển thị tất cả
    if(coursesToShow + 4 <= sortedCourse.length)
    {
        setCoursesToShow(coursesToShow+4);
    }
    else{
      setCoursesToShow(sortedCourse.length); // Hiển thị tất cả các khóa học
      setIsExpanded(true);
    }
  };

  const handleShowLess = () => {
    setIsExpanded(false);
    setCoursesToShow(4); // Quay lại hiển thị 4 khóa học
  };
  
  useEffect(() => {
    getCourses();
    
  }, []);

  useEffect(() => {
    updateRemainingCourses();
  }, [coursesToShow, sortedCourse]);


  return (
    <div className="p-5 bg-white rounded-lg mt-5">
      {/* tittle and filter */}
      <div className="flex items-center justify-between ">
        <h2 className="text-[20px] font-bold text-primary">All Course</h2>
        <Select onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Free">Free</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* className='grid grid-flow-row auto-cols-max p-6 gap-4 mt-5 ' */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4  gap-4 mt-5">
        {sortedCourse?.length > 0
          ? sortedCourse.slice(0, coursesToShow).map((course) => (
              <Link href={"/course-preview/" + course.name}>
                <div key={course.id}>
                  <CourseItem course={course} />
                </div>
              </Link>
            ))
          : [1, 2, 3, 4].map((item,index) => (
              <div
                key={index}
                className="w-full  h-[240px]
          rounded-xl m-2 bg-slate-200 animate-pulse"
              >{item}</div>
            ))}
      </div>
      
      <div className="mt-5">
        {sortedCourse.length >= coursesToShow &&(
            <button className="border  border-sky-500 rounded-md  w-28 h-8 hover:bg-blue-100">
            {!isExpanded && (
              <span
                onClick={handleShowMore} 
                className="cursor-pointer text-[13px] text-blue-600 font-medium  "
              >
                
                Show {remainingCourse} more
                
              </span>
              
            )}
            {
              isExpanded && (
                <span
                onClick={handleShowLess}
                className="cursor-pointer text-[13px] text-blue-600 font-medium"
              >
                Show Less
              </span>
              )
            }
          </button>
        )}
      </div>

      
    </div>
  );
}

export default CourseList;
