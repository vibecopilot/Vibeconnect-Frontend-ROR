import React, { useState } from "react";
import { FaComments, FaFileAlt, FaUsers } from "react-icons/fa";
// import MultiSelect from ""
const ProgressStep = ({ icon, title, isActive }) => (
  <div className="flex flex-col items-center ">
    <div
      className={`rounded-full p-3 ${
        isActive ? "bg-orange-100 text-orange-500" : "bg-gray-200 text-gray-500"
      }`}
    >
      {icon}
    </div>
    <p
      className={`mt-2 text-sm ${
        isActive ? "text-orange-500 font-semibold" : "text-gray-500"
      }`}
    >
      {title}
    </p>
  </div>
);
const EvaluationTemplateForm = () => {
  const [templateName, setTemplateName] = useState("");
  const [enableAttachment, setEnableAttachment] = useState("No");
  const [evaluationComponents, setEvaluationComponents] = useState("");
  const [goalPercentage, setGoalPercentage] = useState("0");
  const [competencyPercentage, setCompetencyPercentage] = useState("0");
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      templateName,
      enableAttachment,
      evaluationComponents,
      goalPercentage,
      competencyPercentage,
    });
  };
  return (
    <div className=" mx-auto p-2 bg-white ">
      <div className="flex justify-between items-center mb-4 rounded-lg border p-2">
        <ProgressStep
          icon={<FaFileAlt className="w-6 h-6" />}
          title="Step 1"
          isActive={true}
        />
       <div className="border flex-grow border-dashed"></div>
        <ProgressStep
          icon={<FaUsers className="w-6 h-6" />}
          title="Step 2"
          isActive={false}
        />
        <div className="border flex-grow border-dashed"></div>
        {/* <div className="flex-grow mx-4 h-px bg-gray-300"></div> */}
        <ProgressStep
          icon={<FaComments className="w-6 h-6" />}
          title="Step 3"
          isActive={false}
        />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="templateName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Template Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="templateName"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Template Name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Do you want to enable attachment upload?
            <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="Yes"
                checked={enableAttachment === "Yes"}
                onChange={() => setEnableAttachment("Yes")}
                className="form-radio text-orange-500"
                required
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="No"
                checked={enableAttachment === "No"}
                onChange={() => setEnableAttachment("No")}
                className="form-radio text-orange-500"
                required
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          {/* <MultiSelect  /> */}
         
        </div>

        <div className="mb-4">
          <label
            htmlFor="goalPercentage"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Goal Evaluation Percentage
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="goalPercentage"
            value={goalPercentage}
            onChange={(e) => setGoalPercentage(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="0 %"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="competencyPercentage"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Competency Evaluation Percentage
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="competencyPercentage"
            value={competencyPercentage}
            onChange={(e) => setCompetencyPercentage(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="0 %"
            required
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default EvaluationTemplateForm;
