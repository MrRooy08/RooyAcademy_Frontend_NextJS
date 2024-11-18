import React, { useState, useEffect } from 'react'
import { Lock } from 'lucide-react';

function LessonByCourse({course}) {

    const [lesson,setLesson] = useState([]);

    const getLessonByCourseName = async()  =>{
      const response = await fetch (
        `http://localhost:8080/lesson/lesson-details/${course.name}`,
        {
          method: "GET",
        });

      const data = await response.json();
      console.log(data);
      setLesson(data.result);
  }

  useEffect(() => {
    getLessonByCourseName();
},[course]);


  return (
    <div className='p-3 bg-white rounded-sm'>
          <h2 >Content Course </h2>
      {lesson.length > 0 ? lesson.map((lesson,index) =>(
        <div key={lesson.id}>
              <h2 className='p-2 text-[14px] flex justify-between 
              items-center m-3  hover:bg-gray-200 hover:text-gray-500 
              border rounded-sm px-4 cursor-pointer 
              '>{index}. {lesson.name}<Lock className='h-4 w-4'/></h2>
              
        </div>
      )) 
      : [1,2,3,4,5,6,7,8,9].map((item,index)=> (
        <div key={index} className='w-full h-[30px]
        rounded-xl m-1 mt-4 bg-slate-200 animate-pulse' >

        </div>
      ))}
    </div>
  )
}

export default LessonByCourse