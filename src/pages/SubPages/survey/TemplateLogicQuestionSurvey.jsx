import React from "react";
import { PiQuestionDuotone } from "react-icons/pi";
function TemplateLogicQuestionSurvey({ question, setActiveQuestionId }) {
  return (
    <div className="bg-gray-100 rounded-md p-5">
      <div className="grid grid-cols-12">
        <div className="flex gap-2 items-center col-span-2">
          <h2 className="text-sm">If answer is ...</h2>
          <span>
            <PiQuestionDuotone size={20} />
          </span>
        </div>
        <div className="flex gap-2 items-center col-span-2">
          <h2 className="text-sm">Then skip to ...</h2>
          <span>
            <PiQuestionDuotone size={20} />
          </span>
        </div>
        <div className="col-span-8 flex justify-end">
          <button className="text-sky-400 mx-5">Clear All</button>
        </div>
      </div>
      <div className="border-t my-2 py-3">
        {question?.option.map((option, index) => (
          <div
            key={index}
            className="text-sm text-gray-500 font-normal my-2  grid grid-cols-12 space-y-3"
          >
            <div className="col-span-2  flex items-center">
              <h2 className="text-sm font-normal"> {option}</h2>
            </div>
            <div className="col-span-7">
              <div className="flex gap-5">
                <div className="w-full">
                  <select className="mt-1 block w-full p-1 border border-gray-300 rounded-md shadow-sm">
                    <option value="">--Choose page--</option>
                    <option value="page1">Page 1</option>
                    <option value="option2">End of survey</option>
                    <option value="option3">Disqualification</option>
                  </select>
                </div>
                <div className="w-full">
                  <select
                    className="mt-1 block w-full p-1 border border-gray-300 rounded-md shadow-sm"
                    disabled
                  >
                    <option></option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-span-3 flex justify-end items-center">
              <button className="text-sky-400 mx-5">Clear</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <button
          className="border border-black text-black px-3 py-1 rounded mt-4"
          onClick={() => setActiveQuestionId(null)}
        >
          Close
        </button>
        <button className="bg-green-500 text-white px-3 py-1 rounded mt-4">
          Save
        </button>
      </div>
    </div>
  );
}

export default TemplateLogicQuestionSurvey;
