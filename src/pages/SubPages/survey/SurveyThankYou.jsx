import React from "react";
import { useParams } from "react-router-dom";

function SurveyThankYou() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 max-w-md text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Thank you</h1>
        <p className="mt-3 text-gray-600">
          Your response has been submitted successfully. We appreciate you taking the time to complete this survey.
        </p>
        {id && (
          <p className="mt-4 text-sm text-gray-500">
            Survey ID: {id}
          </p>
        )}
      </div>
    </div>
  );
}

export default SurveyThankYou;
