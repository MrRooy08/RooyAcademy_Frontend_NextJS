

import React from 'react'
import WelcomeBanner from './_components/WelcomeBanner'
import CourseList from './_components/CourseList'
import SideBanners from './_components/SideBanners'

function Courses() {
  return (
   <div className='grid grid-cols-1 sm:grid-cols-3 p-10 bg-white'>
    {/* Left container  */}
    <div className='col-span-3'
    >
      {/* banner */}
        <WelcomeBanner/>

        {/* Course List */}
        <CourseList/>

    </div>
    {/* Right container */}
        
   </div>    
  )
}

export default Courses