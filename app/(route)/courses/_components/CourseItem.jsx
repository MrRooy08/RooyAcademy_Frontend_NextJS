import React, { useState } from 'react'


const LEVEL_MAP = {
  TD001: "Sơ cấp",
  TD002: "Trung cấp",
  TD003: "Cấp chuyên gia",
  TD004: "Tất cả trình độ",
};

function CourseItem({ course }) {

  // const imgUrlAws = `https://mrrooy.s3.ap-southeast-2.amazonaws.com/${course.imageUrl}`;
  const getPreviewUrl = (fileOrString, courseId, baseUrl) => {
    if (fileOrString instanceof File || fileOrString instanceof Blob) {
      return URL.createObjectURL(fileOrString);
    }
    if (typeof fileOrString === "string") {
      return fileOrString.startsWith("http")
        ? fileOrString
        : `${baseUrl}${courseId}/${fileOrString}`;
    }
    return "";
  };

  return (
    <div className='relative border border-sky-500/20 rounded-xl 
    shadow-none 
    transition-all duration-500 ease-in-out
    hover:shadow-md
    hover:shadow-blue-500/40
    hover:bg-gray-100
    hover:scale-105 
    
    '
    >
      <div className='p-2' >
        <img
          src={getPreviewUrl(course.imageUrl, course.id, process.env.NEXT_PUBLIC_API_URL_IMAGE)}
          alt={course.name || "No image available"}
          width={500}
          height={300}
          className="rounded-xl w-full sm:h-30 md:h-52 lg:h-36"
        />
      </div>

      <div className='p-3'>
        <div className='flex items-start justify-between gap-2'>
          <h2 className='font-medium text-sm sm:text-base flex-1 truncate whitespace-nowrap overflow-hidden'>
            {course.name}
          </h2>
          <div className='bg-green-500/20 rounded-full px-2 py-0.5 whitespace-nowrap flex-shrink-0 mx-auto md:mx-0'>
            <span className='text-[12px] font-semibold text-green-600 tracking-wide'>Bán chạy nhất</span>
          </div>
        </div>
        <div className='flex gap-2 text-gray-500'>
          {course.instructorCourse
            .filter((instructor) => instructor.isActive === "Active")
            .map((instructor, key) => (
              <p key={key}>
                {
                  instructor?.name?.trim() === "null null" ? "Lê Hoàng Thịnh" : instructor.name
                }
              </p>
            ))}
        </div>
      </div>

      <div className='space-y-1 px-3 pb-3'>
        <div className='flex justify-between text-xs'>
          <span className='text-gray-500'>Trình độ</span>
          <span className='font-medium text-gray-700'>{LEVEL_MAP[course.levelCourse] || course.levelCourse}</span>
        </div>
        <div className='flex justify-between text-xs'>
          <span className='text-gray-500'>Danh mục</span>
          <span className='font-medium text-gray-700'>{course.category}</span>
        </div>
        {course.parentcategory && (
          <div className='flex justify-between text-xs'>
            <span className='text-gray-500'>Danh mục cha</span>
            <span className='font-medium text-gray-700'>{course.parentcategory}</span>
          </div>
        )}
        <div className='flex justify-between text-xs'>
          <span className='text-gray-500'>Chủ đề</span>
          <span className='font-medium text-gray-700'>{course.topic}</span>
        </div>
        <div className='bg-blue-500/20 rounded-lg p-2 mt-2'>
          <p className='text-sm font-semibold text-blue-500 text-center'>
            {course.price === 0 || course.price === null ? "Miễn phí" : new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(course.price)}
          </p>
        </div>
      </div>

    </div>
  )
}

export default CourseItem