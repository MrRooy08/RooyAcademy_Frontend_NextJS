"use client"
import React, {useEffect, useState} from 'react'
import CourseDescription from '../_components/CourseDescription';
import CourseEnrollSection from '../_components/CourseEnrollSection';
import LessonByCourse from '../_components/LessonByCourse';

function CoursePreview({params}) {
  const {courseName} = params;
  const [course,setCourse] = useState(null);

    const getCourseByCourseName = async() => {
      const response = await fetch (
        `http://localhost:8080/course/get-course-name?name=${decodeURIComponent(courseName)}`,
        {
          method: "GET",
        });

        const data = await response.json();
        console.log(data);
        setCourse(data.result);

    }


    useEffect(() => {
      getCourseByCourseName();
  },[courseName]);




  return course &&(
    <div className='grid grid-cols-1 md:grid-cols-3 p-5 gap-3' >
        {/* Title video, description */}
        <div className='col-span-2 bg-white p-3'> 
           <CourseDescription  course={course}/>
        </div>
        <div>
            <div>
            <CourseEnrollSection course={course} />
            </div>
            <div className='mt-1'>
              <LessonByCourse course={course}/>
              </div>
            
        </div>
    </div>
  )
}



export default CoursePreview