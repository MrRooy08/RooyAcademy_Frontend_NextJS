import React from 'react'
import VideoPlayer from './VideoPlayer'
import CourseEnrollSection from './CourseEnrollSection'
import Markdown from 'react-markdown';

function CourseVideoDescription({course}) {
  console.log(course);
  return (

    <div className='p-3'>
      <h2 className='text-[20px] font-semibold p-1' >{course.name}</h2>
      <VideoPlayer videoUrl={course.videoUrl} />
      <h2 className='mt-5 text[17px] font-semibold'>About This Course</h2>
      <p className='text-[12px] font-light mt-2 leading-6'>{course.description}</p>
      <h2 className='text-gray-500 text-[14px] mb-3 mt-4' >{course.content}</h2>
    </div>
  )
}

export default CourseVideoDescription