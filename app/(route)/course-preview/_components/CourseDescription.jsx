import React, { useEffect,useState } from 'react'
import VideoPlayer from './VideoPlayer'
import DOMPurify from 'dompurify';


function CourseVideoDescription({course}) {
  const [description,setDescription] = useState('');

  useEffect (() => {
    if (course?.description) {
      const sanitizedDescription = DOMPurify.sanitize(course.description, {
        ALLOWED_TAGS: ['p', 'a', 'ul', 'li', 'strong', 'em', 'br'],
        ALLOWED_ATTR: ['href', 'target', 'rel'],
      });
      setDescription(sanitizedDescription);
    }
  },[course]);
  console.log(course);
  return (

    <div className='p-3'>
      <h2 className='text-[20px] font-semibold p-1' >{course.name}</h2>
      <VideoPlayer videoUrl={course.videoUrl} />
      <h2 className='mt-5 text[17px] font-semibold'>About This Course</h2>
      <div className='text-[15px] font-light mt-2 leading-6' 
      dangerouslySetInnerHTML={{ __html: description }} 
      />
      <h2 className='text-gray-500 text-[14px] mb-3 mt-4' >{course.content}</h2>
    </div>
  );
}

export default CourseVideoDescription