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
function EditTemplateSurvey() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [libraryModal, setLibraryModal] = useState(false);
  const [activeButton, setActiveButton] = useState("");
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const updateQuestionButton = ["Edit", "Options", "Logic", "Move", "Copy"];
  const question = [
    {
      id: 1,
      questionName:
        "How likely is it that you would recommend this company to a friend or colleague? ",
      questType: "range",
      option: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    {
      id: 2,
      questionName:
        "Overall, how satisfied or dissatisfied are you with our company? ",
      questType: "radioButton",
      option: [
        "Very satisfied",
        "Somewhat dissatisfied",
        "Somewhat satisfied",
        "Very dissatisfied",
        "Neither satisfied nor dissatisfied",
      ],
    },
    {
      id: 3,
      questionName:
        " Which of the following words would you use to describe our products? Select all that apply.",
      questType: "checkBox",
      option: [
        "Reliable",
        "Overpriced",
        "High quality",
        "Impractical",
        "Useful",
        "Ineffective",
        "Unique",
        "Poor quality",
        "Good value for money",
        "Unreliable",
      ],
    },
    {
      id: 4,
      questionName: " How well do our products meet your needs? ",
      questType: "radioButton",
      option: [
        "Extremely well",
        "Not so well",
        "Very well",
        "Not at all well",
        "Somewhat well",
      ],
    },
    {
      id: 5,
      questionName: " How would you rate the quality of the product? ",
      questType: "radioButton",
      option: [
        "Very high quality",
        "Low quality",
        "High quality",
        "Very low quality",
        "Neither high nor low quality",
      ],
    },
    {
      id: 6,
      questionName: "How would you rate the value for money of the product? ",
      questType: "radioButton",
      option: [
        "Excellent",
        "Below average",
        "Above average",
        "Poor",
        "Average",
      ],
    },
    {
      id: 7,
      questionName:
        "How responsive have we been to your questions about our services?  ",
      questType: "radioButton",
      option: [
        "Extremely responsive",
        "Very responsive",
        "Somewhat responsive",
        "Not so responsive",
        "Not at all responsive",
        "Not applicable",
      ],
    },
    {
      id: 8,
      questionName: "How long have you been a customer of our company? ",
      questType: "radioButton",
      option: [
        "This is my first purchase",
        "1 - 2 years",
        "Less than six months",
        "3 or more years",
        "Six months to a year",
        "I haven't made a purchase yet",
      ],
    },
    {
      id: 9,
      questionName:
        " How likely are you to purchase any of our products again? ",
      questType: "radioButton",
      option: [
        "Extremely likely",
        "Not so likely",
        "Very likely",
        "Not at all likely",
        "Somewhat likely",
      ],
    },
    {
      id: 10,
      questionName: "Do you have any other comments, questions, or concerns?  ",
      questType: "textArea",
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

  const handleRangeChange = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };
  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex flex-col overflow-hidden my-5">
        <div className="grid grid-cols-12">
          <div className="col-span-12">
            <div className="border-b border-inherit"></div>
            <h2 className="text-2xl text-green-600 px-10 my-5">
              Customer Satisfaction Template
            </h2>
            <div className="space-y-10 px-10 pb-10">
              {question.map((q) => (
                <div
                  key={q.id}
                  className="relative group p-5 hover:bg-gray-100 hover:rounded-md cursor-pointer"
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
                      {/* <h2 className="text-lg font-medium text-gray-600 mb-6">
                        {q?.questionName || "Question Name"}
                      </h2>
                      {q.option.map((option, index) => (
                        <div
                          key={index}
                          className="text-sm text-gray-500 font-normal my-2"
                        >
                          {option}
                        </div>
                      ))}
                      <p className="text-sm text-gray-500">
                        Editing Mode - {activeButton}
                      </p> */}

                      {/* <button
                        className="bg-gray-500 text-white px-3 py-1 rounded mt-4"
                        onClick={() => setActiveQuestionId(null)}
                      >
                        Close
                      </button> */}
                    </div>
                  ) : (
                    <>
                      <h2 className="text-lg font-medium text-gray-600 mb-6">
                        {q.id}. {q.questionName}
                      </h2>
                      <div className="absolute top-5 right-5 hidden group-hover:flex space-x-2">
                        <button
                          className="text-black px-3 py-1 rounded border border-black flex gap-2 items-center"
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
                      {q.questType === "range" && (
                        <>
                          <div className="flex justify-between text-sm font-medium text-gray-600 my-2 cursor-pointer">
                            <span>NOT AT ALL LIKELY</span>
                            <span>EXTREMELY LIKELY</span>
                          </div>
                          <div className="grid grid-cols-10 gap-1 w-full border-2">
                            {q.option.map((i) => (
                              <button
                                key={i}
                                onClick={() => handleRangeChange(q.id, i)}
                                className="border p-2 rounded border-green-500 w-full bg-gray-100"
                              >
                                {i}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                      {q.questType === "radioButton" && (
                        <div className="grid grid-cols-2 gap-2">
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
                        <div className="grid grid-cols-2 gap-2 mt-2">
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

export default EditTemplateSurvey;
