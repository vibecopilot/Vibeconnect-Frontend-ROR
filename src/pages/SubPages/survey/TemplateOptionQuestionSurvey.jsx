import React, { useState } from "react";

function TemplateOptionQuestionSurvey({ setActiveQuestionId }) {
  const [isRequire, setIsRequire] = useState(false);
  return (
    <div className="bg-gray-100 rounded-md p-5">
      <div className="flex flex-col gap-5 justify-start py-3 px-4">
        <div>
          <input
            type="checkbox"
            id=""
            checked={isRequire}
            onChange={() => setIsRequire(!isRequire)}
            className="mr-2 w-3 h-3"
          />
          <label htmlFor="" className="text-sm font-medium text-gray-600">
            Require an Answer to This Question
          </label>
        </div>
        {isRequire && (
          <div className="w-full px-8">
            <label className="text-sm text-gray-800">
              Adjust Question Layout
            </label>
            <textarea
              placeholder="This question requires an answer."
              className="border px-2 py-2 flex-1 rounded-md w-full resize-none"
              rows="3"
            />
          </div>
        )}
        <div>
          <input type="checkbox" id="" className="mr-2 w-3 h-3" disabled />
          <label htmlFor="" className="text-sm font-medium text-gray-300">
            Adjust Question Layout
          </label>
        </div>
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

export default TemplateOptionQuestionSurvey;
