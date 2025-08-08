"use client"
import { useState } from "react";
import CourseTypeSelector from "./CourseTypeSelector";
import CourseTitleStep from "./CourseTitleStep";
import CourseCategoryStep from "./CourseCategoryStep";
import Header from "../../../_components/Header"
import {Provider} from "react-redux";
import store from "@/app/Store/store";

const CourseCreationFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  return (
    <Provider store={store}>
    <div>
      <Header currentStep={currentStep} />
      <div className="min-h-[calc(100vh-200px)]">
        {currentStep === 1 && <CourseTypeSelector onNext={nextStep} />}
        {currentStep === 2 && <CourseTitleStep onNext={nextStep} onBack={prevStep} />}
        {currentStep === 3 && <CourseCategoryStep onNext={nextStep} onBack={prevStep} />}
      </div>
    </div>
    </Provider>
  );
};

export default CourseCreationFlow;