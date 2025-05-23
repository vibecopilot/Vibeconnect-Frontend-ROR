import React from "react";

function TemplateCopyQuestionSurvey({
  question,
  questionId,
  setActiveQuestionId,
}) {
  console.log("Question List:", question);
  console.log("Current Question ID:", questionId);

  // Find the selected question
  const selectedQuestion = question.find((q) => q.id === questionId.id);

  return (
    <div className="bg-gray-100 rounded-md p-5">
      <div className="space-y-3">
        <h2 className="text-sm font-normal">
          Copy this question and put it on ...
        </h2>
        <div className="grid grid-cols-12 gap-5">
          <div className="w-full col-span-2">
            <label>Page</label>
            <select className="mt-1 block w-full p-1 rounded-md shadow-sm">
              <option value="1">1.</option>
            </select>
          </div>
          <div className="w-full col-span-2">
            <label>Position</label>
            <select className="mt-1 block w-full p-1 rounded-md shadow-sm">
              <option value="after">After</option>
              <option value="before">Before</option>
            </select>
          </div>
          <div className="w-full col-span-8">
            <label>Question</label>
            <select
              className="mt-1 block w-full p-1 rounded-md shadow-sm"
              value={questionId.id}
            >
              {question.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.id}. {q.questionName}
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
          Cancel
        </button>
        <button className="bg-green-500 text-white px-3 py-1 rounded mt-4">
          Save
        </button>
      </div>
    </div>
  );
}

export default TemplateCopyQuestionSurvey;
