import React from "react";
import { useParams } from "react-router-dom";

function SurveyThankYou() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">

      {/* ✅ ONLY ONE CONTAINER */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 max-w-md text-center">

        {/* ✅ SINGLE ICON */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* ✅ THANK YOU TEXT */}
        <h2 className="text-4xl sm:text-3xl font-bold text-gray-800">
          Thank You!
        </h2>

        <p className="text-sm text-gray-500 mt-1 mb-4">
          Your response has been successfully submitted
        </p>

        

        
      </div>
    </div>
  );
}

export default SurveyThankYou;