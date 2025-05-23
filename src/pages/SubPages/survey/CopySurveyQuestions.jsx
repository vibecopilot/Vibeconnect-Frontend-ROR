import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import { BiMessageRounded } from "react-icons/bi";
import TemplateCommentSurvey from "./TemplateCommentSurvey";
import LibrarySurveyModal from "./LibrarySurveyModal";
import TemplateEditQuestionSurvey from "./TemplateEditQuestionSurvey";
import TemplateOptionQuestionSurvey from "./TemplateOptionQuestionSurvey";
import TemplateLogicQuestionSurvey from "./TemplateLogicQuestionSurvey";
import TemplateMoveQuestionSurvey from "./TemplateMoveQuestionSurvey";
import TemplateCopyQuestionSurvey from "./TemplateCopyQuestionSurvey";
import { PiQuestionDuotone } from "react-icons/pi";
import SurveySetting from "./SurveySetting";
function CopySurveyQuestions() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSidebar, setIsSidebar] = useState("setting");
  const [libraryModal, setLibraryModal] = useState(false);
  const [activeButton, setActiveButton] = useState("");
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const updateQuestionButton = ["Edit", "Options", "Logic", "Move", "Copy"];
  const question = [
    {
      id: 1,
      questionName:
        "Is this the first time you are using our Products and services?",
      questType: "radioButton",
      option: ["Yes", "No"],
    },
    {
      id: 2,
      questionName: " Would you recommend it to your friends and colleagues? ",
      questType: "radioButton",
      option: ["True", "False"],
    },
    {
      id: 3,
      questionName:
        "Do you have any suggestions to improve our product and service? ",
      questType: "textArea",
    },
    {
      id: 4,
      questionName: " How satisfied are you with our company overall? ",
      questType: "checkBox",
      option: [
        "Very satisfied",
        "Satisfied",
        "undecided",
        "unsatisfied",
        "Very unsatisfied",
      ],
    },
    {
      id: 5,
      questionName: "How do you prefer to be contacted?",
      questType: "select",
      option: ["Email", "Phone", "SMS", "None"],
    },
  ];

  const [responses, setResponses] = useState({});

  const handleRadioChange = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxChange = (questionId, value) => {
    setResponses((prev) => {
      const currentValues = prev[questionId] || [];
      return {
        ...prev,
        [questionId]: currentValues.includes(value)
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      };
    });
  };

  const handleTextAreaChange = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSelectChange = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex flex-col overflow-hidden my-5">
        <div className="border-b border-inherit w-full"></div>
        <div className="grid grid-cols-12">
          <div className="col-span-3 border-r">
            <div className="border-b py-3">
              <div className="flex justify-between mx-10">
                <h2>STYLE</h2>
                <span>
                  <PiQuestionDuotone size={20} />
                </span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-5 border-b">
              <button
                onClick={() => setIsSidebar("setting")}
                className={`p-3 cursor-pointer ${
                  isSidebar === "setting"
                    ? "border-b-2 border-green-600 text-green-600 font-semibold"
                    : ""
                }`}
              >
                SETTINGS
              </button>
              <button
                onClick={() => setIsSidebar("themes")}
                className={`p-3 cursor-pointer ${
                  isSidebar === "themes"
                    ? "border-b-2 border-green-600 text-green-600 font-semibold"
                    : ""
                }`}
              >
                THEMES
              </button>
            </div>
            {isSidebar === "setting" && (
              <div>
                <SurveySetting />
              </div>
            )}
          </div>
          <div className="col-span-9">
            <h2 className="text-2xl text-green-600 px-10 my-5">
              Customer Satisfaction Template
            </h2>
            <div className="space-y-10 px-10 pb-10">
              {question.map((q) => (
                <div
                  key={q.id}
                  className="relative group p-5 hover:bg-gray-100 hover:rounded-md cursor-pointer z-10"
                >
                  {activeQuestionId === q.id ? (
                    <div className="bg-white p-5 rounded shadow border-2">
                      <div className="flex flex-wrap gap-5 mt-3 mx-5">
                        {updateQuestionButton.map((buttonName) => (
                          <div
                            key={buttonName}
                            className={`p-3 cursor-pointer ${
                              activeButton === buttonName
                                ? "border-b-2 border-green-600 text-green-600"
                                : ""
                            }`}
                            onClick={() => setActiveButton(buttonName)}
                          >
                            {buttonName}
                          </div>
                        ))}
                      </div>

                      {activeButton === "Edit" && (
                        <TemplateEditQuestionSurvey
                          question={q}
                          setActiveQuestionId={setActiveQuestionId}
                        />
                      )}
                      {activeButton === "Options" && (
                        <TemplateOptionQuestionSurvey
                          setActiveQuestionId={setActiveQuestionId}
                        />
                      )}
                      {activeButton === "Logic" && (
                        <TemplateLogicQuestionSurvey
                          question={q}
                          setActiveQuestionId={setActiveQuestionId}
                        />
                      )}
                      {activeButton === "Move" && (
                        <TemplateMoveQuestionSurvey
                          questionId={q}
                          question={question}
                          setActiveQuestionId={setActiveQuestionId}
                        />
                      )}
                      {activeButton === "Copy" && (
                        <TemplateCopyQuestionSurvey
                          questionId={q}
                          question={question}
                          setActiveQuestionId={setActiveQuestionId}
                        />
                      )}
                    </div>
                  ) : (
                    <>
                      <h2 className="text-lg font-medium text-gray-600 mb-6">
                        {q.id}. {q.questionName}
                      </h2>
                      <div className="absolute top-5 right-5 hidden group-hover:flex space-x-2">
                        <button
                          className="text-black px-3 py-1 rounded border border-black flex gap-2 items-center bg-white"
                          onClick={() => setDrawerOpen(true)}
                        >
                          <BiMessageRounded size={20} />
                          <span>1</span>
                        </button>
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded"
                          onClick={() => {
                            setActiveQuestionId(q.id);
                            setActiveButton("Edit");
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-gray-500 text-white px-3 py-1 rounded"
                          onClick={() => {
                            setActiveQuestionId(q.id);
                            setActiveButton("Options");
                          }}
                        >
                          Options
                        </button>
                        <button
                          className="bg-yellow-500 text-white px-3 py-1 rounded"
                          onClick={() => {
                            setActiveQuestionId(q.id);
                            setActiveButton("Logic");
                          }}
                        >
                          Logic
                        </button>
                        <button
                          className="bg-gray-500 text-white px-3 py-1 rounded"
                          onClick={() => {
                            setActiveQuestionId(q.id);
                            setActiveButton("Move");
                          }}
                        >
                          Move
                        </button>
                        <button
                          className="bg-gray-500 text-white px-3 py-1 rounded"
                          onClick={() => {
                            setActiveQuestionId(q.id);
                            setActiveButton("Copy");
                          }}
                        >
                          Copy
                        </button>
                        <button
                          className="bg-yellow-500 text-white px-3 py-1 rounded"
                          onClick={() => setLibraryModal(true)}
                        >
                          Library
                        </button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded">
                          Delete
                        </button>
                      </div>
                      {q.questType === "radioButton" && (
                        <div className="grid grid-cols-1 gap-2">
                          {q.option.map((option, index) => (
                            <label
                              key={index}
                              className="flex items-center gap-2 p-2 rounded-md"
                            >
                              <input
                                type="radio"
                                name={`question-${q.id}`}
                                value={option}
                                checked={responses[q.id] === option}
                                onChange={() => handleRadioChange(q.id, option)}
                                className="hidden"
                              />
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  responses[q.id] === option
                                    ? "border-gray-400"
                                    : "border-gray-400"
                                }`}
                              ></div>
                              <span className="font-extralight text-gray-900">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                      {q.questType === "checkBox" && (
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          {q.option.map((option) => (
                            <label
                              key={option}
                              className="flex items-center gap-2 p-2 rounded-md"
                            >
                              <input
                                type="checkbox"
                                name={`question-${q.id}`}
                                value={option}
                                checked={(responses[q.id] || []).includes(
                                  option
                                )}
                                onChange={() =>
                                  handleCheckboxChange(q.id, option)
                                }
                                className="hidden"
                              />
                              <div
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                                  (responses[q.id] || []).includes(option)
                                    ? "border-gray-400 "
                                    : "border-gray-400"
                                }`}
                              ></div>
                              <span className="font-extralight text-gray-900">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                      {q.questType === "textArea" && (
                        <div className="w-full max-w-lg mt-2">
                          <textarea
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                            placeholder="Type your message here..."
                            value={responses[q.id] || ""}
                            onChange={(e) =>
                              handleTextAreaChange(q.id, e.target.value)
                            }
                          ></textarea>
                        </div>
                      )}
                      {q.questType === "select" && (
                        <div className="w-full max-w-lg mt-2">
                          <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            value={responses[q.id] || ""}
                            onChange={(e) =>
                              handleSelectChange(q.id, e.target.value)
                            }
                          >
                            <option value="" disabled>
                              Select an option
                            </option>
                            {q.option.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
              <button
                className="bg-green-500 text-white px-4 py-2 rounded mb-20"
                onClick={() => console.log(responses)}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <TemplateCommentSurvey
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      {libraryModal && (
        <LibrarySurveyModal onclose={() => setLibraryModal(false)} />
      )}
    </section>
  );
}

export default CopySurveyQuestions;
