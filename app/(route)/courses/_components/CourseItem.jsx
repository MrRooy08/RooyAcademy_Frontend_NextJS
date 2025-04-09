import React, { useState } from 'react'
import Image from 'next/image'
// import '../../../styles/index.module.css'


// ease-out 
//     hover:shadow-cyan-500/70
//     hover:bg-gray-100 
//     hover:scale-105 shadow 
//     hover:shadow-lg 
//     transition-shadow duration-500
// shadow-none
//     transition-all duration-500 ease-in-out 
//     hover:scale-110
//     hover: shadow-violet-500/70 
//     hover: bg-gray-100
// shadow-none 
//     transition-all duration-300 ease-in-out
//     hover:shadow-md
//     hover:shadow-blue-500 
//     hover:scale-105 


function CourseItem({course}) {

  const imgUrlAws = `https://mrrooy.s3.ap-southeast-2.amazonaws.com/${course.imageUrl}`;

  return (
    <div className=' border border-sky-500/20 rounded-xl 
    shadow-none 
    transition-all duration-500 ease-in-out
    hover:shadow-md
    hover:shadow-blue-500/40
    hover:bg-gray-100
    hover:scale-105 
    
    '
    >
      <div className='p-2' >
      <Image 
        src={imgUrlAws} // Truy cập ảnh từ thư mục public
        alt={course.name || "No image available"} 
        width={500} 
        height={300} 
        className='rounded-xl w-full 
        sm:h-30
        md:h-52
        lg:h-36
        ' 
      />
      </div>
      
        <div className='grid gap-1 p-3 
        lg:h-32
        md:h-40
        '>
            <h2 className='font-medium 
            sm:h-[60px]
            md:h-[20px] col-span-3 '>{course.name}</h2>
            <h2 className='text-[12px] text-gray-500'>{course.levelCourse.name}</h2>
            <h2 className='text-[15px] col-span-2 grid justify-end'>{course.price}</h2>
            
        </div>
      
    </div>
  )
}

export default CourseItem