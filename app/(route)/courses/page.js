
import React from "react";
import WelcomeBanner from "./_components/WelcomeBanner";
import CourseList from "./_components/CourseList";
import AdvertisingBanner from "./_components/AdvertisingBanner";


function Courses() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 p-10 bg-white">
      {/* Left container  */}
      <div className="col-span-3 m-16">
        {/* banner onCourseAdded={addNewCourse}*/}
        <WelcomeBanner />

        {/* Course List */}
        <CourseList  />

        <AdvertisingBanner />
      </div>
      {/* Right container */}
    </div>
  );
}

export default Courses;
