import React from "react";

function TemplateMoveQuestionSurvey({
  question,
  questionId,
  setActiveQuestionId,
}) {
  console.log(question);
  console.log(questionId);
  return (
    <div className="bg-gray-100 rounded-md p-5">
      <div className="space-y-3">
        <h2 className="text-sm font-normal">Move this question to ...</h2>
        <div className="grid grid-cols-12 gap-5">
          <div className="w-full col-span-2">
            <label>Pages</label>
            <select className="mt-1 block w-full p-1 rounded-md shadow-sm">
              <option value="">1.</option>
            </select>
          </div>
          <div className="w-full col-span-2">
            <label>Position</label>
            <select className="mt-1 block w-full p-1 rounded-md shadow-sm">
              <option value="">After</option>
              <option value="">Before</option>
            </select>
          </div>
          <div className="w-full col-span-8">
            <label>Question</label>
            <select className="mt-1 block w-full p-1 rounded-md shadow-sm">
              {question
                .filter((q) => q.id !== questionId.id) // Filter out the active question
                .map((q, index) => (
                  <option key={q.id || index} className="flex gap-4 mx-4">
                    <span className="w-20 inline-block">{q.id}. </span>
                    <span>{q.questionName}</span>
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 my-5">
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

export default TemplateMoveQuestionSurvey;
