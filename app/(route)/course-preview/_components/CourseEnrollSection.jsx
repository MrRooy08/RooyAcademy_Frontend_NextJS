// import { Button } from '@/components/ui/button'
// import React, {useState} from 'react'

// function CourseEnrollSection({course}) {

//   const [isVisible, setIsVisible] = useState(true);


//   return (
//     <div className='p-3 text-center rounded-sm bg-primary flex flex-col gap-3'>
//         <h2 className='text-[22px] font-bold text-white'> Enroll to the Course </h2>
//         <h2 className='text-white font-light'> Buy Monthly Membership and Get Access to All Courses </h2>
//         <Button className="bg-white text-primary 
//         hover:bg-white 
//         hover:text-primary
//         flex flex-col gap-3
//         ">Buy Just {course.price}</Button>
//     </div>
//   )
// }

// export default CourseEnrollSection

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

function CourseEnrollSection({ course }) {
  // State để quản lý việc ẩn/hiển thị component
  const [isVisible, setIsVisible] = useState(true);

  // Hàm đóng component
  const handleClose = () => {
    setIsVisible(false);
  };

  // Nếu isVisible là false, không render component này
  if (!isVisible) return null;

  return (
      <div className='p-3 relative text-center rounded-sm bg-primary flex flex-col gap-3'>
      <button 
        className='text-gray-400 absolute top-0 right-0 p-1 hover:text-white' 
        onClick={handleClose}
        aria-label="Close"
      >
        <svg 
        width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <h2 className='text-[22px] font-bold text-white'>
        {course.price == null ? 'Enroll to the Membership' : 'Enroll to the Course'}
        </h2>
      <h2 className='text-white font-light'>Buy Monthly Membership and Get Access to All Courses</h2>
      <Button className="bg-white text-primary hover:bg-white hover:text-primary flex flex-col gap-3">
        Buy Just {course.price}
      </Button>
    </div>
  );
}

export default CourseEnrollSection;
