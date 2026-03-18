import React from "react";
import { useParams } from "react-router-dom";
//import thankYouImg from "../../assets/images/thankyou.png";
//import logoImg from "../../assets/images/logo.png";

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
        {/* 🔷 LOGO */}
        //<img
        // src={logoImg}
        // alt="Logo"
        // className="w-28 mx-auto mb-6"
        />
        {/*thankyou img */}
        <img
        //src={thankYouImg}
        // alt="Thank You"
        // className="w-40 mx-auto my-4"
        />
        <p className="mt-3 text-gray-600">
          Dear Participant,
          for taking the time to complete our survey. We truly appreciate your valuable feedback.
          Your response will help us better understand user experiences and improve our services. We are grateful for your participation and support.
          If you have any additional comments or suggestions, please feel free to share them with us.
          ds,Survey Team
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
