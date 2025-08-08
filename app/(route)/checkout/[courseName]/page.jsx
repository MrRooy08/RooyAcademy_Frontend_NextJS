"use client"

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEnrollCourseMutation } from "@/app/features/courses/courseApi";
import { toast } from "sonner";
import CheckoutPage from "../_components/CheckoutPage";

export default function page() {
  const router = useRouter();
  const params = useParams();
  const courseName = params.courseName;
  const [enrollCourse] = useEnrollCourseMutation()

  useEffect(() => {
    const purchased = JSON.parse(localStorage.getItem("purchasedCourses") || "[]");
    if (!purchased.includes(courseName)) {
      localStorage.setItem("purchasedCourses", JSON.stringify([...purchased, courseName]));
    }
  }, [courseName]);

  const handlePay = () => {
    try{
      enrollCourse({courseId: courseName})
      toast.success("Enrolled successfully!")
      router.push("/my-learning");

    }catch(e){
      toast.error("Enrolled failed!")
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50  mt-20">
      <CheckoutPage courseName={courseName}/>
    </div>
  );
}
