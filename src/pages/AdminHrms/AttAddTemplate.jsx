import React, { useState } from "react";
import AttendanceDetailsList from "./AttendanceDetailsList";
import AttendanceTemplateProcess from "./AttendanceTemplateProcess";
import AdminHRMS from "./AdminHrms";
import { FaCheck } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import TemplateGeneralSetting from "./AttendanceTemplate/TemplateGeneralSetting";
import AttendanceRegularization from "./AttendanceTemplate/AttendanceRegularization";
import LateEarlyCheckouts from "./AttendanceTemplate/LateEarlyCheckouts";
import OTSettings from "./AttendanceTemplate/OTSettings";

const AttAddTemplate = () => {
  const initialSteps = [
    { id: 1, title: "General Template Settings", completed: false },
    { id: 2, title: "Attendance Regularization", completed: false },
    { id: 3, title: "Late Marks and Early Check Outs", completed: false },
    { id: 4, title: "Change OT Settings", completed: false },
  ];

  const [steps, setSteps] = useState(initialSteps);
  const [currentStep, setCurrentStep] = useState(0);

  const handleNextStep = () => {
    // Mark the current step as completed and move to the next step
    setSteps((prevSteps) =>
      prevSteps.map((step, index) =>
        index === currentStep ? { ...step, completed: true } : step
      )
    );
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepClick = (stepIndex) => {
    if (steps[stepIndex].completed || stepIndex === currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  const handleCancel = () => {
    // Reset steps or navigate away
    console.log("Cancel clicked");
    setSteps(initialSteps);
    setCurrentStep(0);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex ml-20">
      <AdminHRMS />

      {/* Sidebar for process steps */}
      <div className="bg-white border-r py-6 px-4 w-72">
        <h2 className="text-xl font-semibold mb-6">Process</h2>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-start ${
                step.completed || index === currentStep
                  ? "cursor-pointer"
                  : "cursor-not-allowed"
              }`}
              onClick={() => handleStepClick(index)} // Handle click only for completed or current steps
            >
              <div className="relative flex items-center justify-center">
                {step.completed ? (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <FaCheck className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-purple-200 rounded-lg flex items-center justify-center">
                    <FiFileText className="w-5 h-5 text-purple-600" />
                  </div>
                )}
                {index < steps.length - 1 && (
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-10 bg-gray-300" />
                )}
              </div>
              <div className="ml-4">
                <p
                  className={`font-medium ${
                    step.completed ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {step.id}. {step.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conditionally render step components */}
      <div className="flex-grow p-6">
        {currentStep === 0 && (
          <TemplateGeneralSetting
            handleNextStep={handleNextStep}
            handleCancel={handleCancel}
            handleBack={handleBack}
          />
        )}
        {currentStep === 1 && (
          <AttendanceRegularization
            handleNextStep={handleNextStep}
            handleCancel={handleCancel}
            handleBack={handleBack}
          />
        )}
        {currentStep === 2 && (
          <LateEarlyCheckouts
            handleNextStep={handleNextStep}
            handleCancel={handleCancel}
            handleBack={handleBack}
          />
        )}
        {currentStep === 3 && (
          <OTSettings handleCancel={handleCancel} handleBack={handleBack} />
        )}
      </div>
    </div>
  );
};

export default AttAddTemplate;
