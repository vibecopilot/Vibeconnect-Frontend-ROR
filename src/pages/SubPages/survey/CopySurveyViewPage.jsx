import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import { Link } from "react-router-dom";
import { RxArrowRight } from "react-icons/rx";
import { IoIosCloseCircleOutline, IoMdStar } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
function CopySurveyViewPage() {
  const [isFavorites, setIsFavorites] = useState(false);
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
      <div className="w-full flex flex-col overflow-hidden">
        <div className="grid grid-cols-12">
          <div className="col-span-9">
            <div className="flex justify-start mx-12 p-2">
              <Link to="/admin/copy-survey" className="flex items-center">
                <IoIosCloseCircleOutline />
                Close
              </Link>
            </div>
            <div className="border-b border-inherit"></div>
            <div className="h-screen overflow-y-auto">
              <h2 className="text-2xl text-green-600 px-10 mt-5">
                Customer Feedback Survey
              </h2>
              <p className="text-xl text-gray-600 px-10 mt-3 mb-10">
                Please let us know about your experience with our product and
                service.
              </p>
              <div className="space-y-10 px-10">
                {question.map((q) => (
                  <div key={q.id}>
                    <h2 className="text-lg font-medium text-gray-600 mb-6">
                      {q.id}. {q.questionName}
                    </h2>
                    {q.questType === "radioButton" && (
                      <div className="grid grid-cols-1 gap-2">
                        {q.option.map((option, index) => (
                          <label
                            key={index}
                            className={`flex items-center gap-2 p-2 rounded-md border ${
                              responses[q.id] === option
                                ? "bg-gray-100 border-2 border-gray-500"
                                : "border-transparent"
                            } cursor-pointer`}
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
                                  ? "border-gray-700"
                                  : "border-gray-400"
                              }`}
                            >
                              {responses[q.id] === option && (
                                <div className="w-2.5 h-2.5 bg-gray-700 rounded-full"></div>
                              )}
                            </div>
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
                            className={`flex items-center gap-2 p-2 rounded-md border ${
                              (responses[q.id] || []).includes(option)
                                ? "bg-gray-100 border-2 border-gray-500"
                                : "border-transparent"
                            } cursor-pointer`}
                          >
                            <input
                              type="checkbox"
                              name={`question-${q.id}`}
                              value={option}
                              checked={(responses[q.id] || []).includes(option)}
                              onChange={() =>
                                handleCheckboxChange(q.id, option)
                              }
                              className="hidden"
                            />
                            <div
                              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                                (responses[q.id] || []).includes(option)
                                  ? "border-gray-700 bg-gray-700"
                                  : "border-gray-400"
                              }`}
                            >
                              {(responses[q.id] || []).includes(option) && (
                                <div className="text-white">
                                  <FaCheck />
                                </div>
                              )}
                            </div>
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
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
                  </div>
                ))}
              </div>
              <div className="mb-10 mt-5 mx-10">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => console.log(responses)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
          <div className="col-span-3 border-l pt-5 pb-10 flex flex-col justify-between h-full">
            <div className="space-y-5 px-8">
              <div>
                <h2 className="text-2xl">Untitled</h2>
                <p className="text-xs font-normal ">Modified: 2/28/2025</p>
              </div>
              <button
                className="hover:bg-gray-100 p-2 rounded"
                onClick={() => setIsFavorites((prev) => !prev)}
              >
                <div className="flex gap-1 items-center">
                  <span>
                    <IoMdStar
                      className={
                        isFavorites ? "text-yellow-500" : "text-gray-500"
                      }
                    />
                  </span>
                  <p className="text-gray-700 font-medium text-sm">
                    {isFavorites ? "Remove from favorites" : "Add to favorites"}
                  </p>
                </div>
              </button>
              <p className="font-sans">You can always edit the survey later.</p>
              <div className="space-y-1">
                <h2 className="text-sm font-medium text-gray-500">Questions</h2>
                <p className="text-2xl font-light">5</p>
              </div>
              <div className="space-y-1">
                <h2 className="text-sm font-medium text-gray-500">Responses</h2>
                <p className="text-2xl font-light">0</p>
              </div>
              <div className="space-y-1">
                <h2 className="text-sm font-medium text-gray-500">
                  Time to complete
                </h2>
                <p className="text-2xl font-light">2 minutes</p>
              </div>
              <div className="space-y-1">
                <h2 className="text-sm font-medium text-gray-500">
                  Completion rate
                </h2>
                <p className="text-2xl font-light">79%</p>
              </div>
            </div>

            {/* Push this section to the bottom */}
            <div className="border-t mt-auto p-5 mb-5 space-y-5">
              <div className="w-full">
                <Link
                  to={`/admin/copy-survey-question`}
                  className="bg-yellow-500 rounded-md w-full py-2 px-6 flex justify-center items-center gap-8"
                >
                  <h2> Copy This Survey</h2>
                  <span>
                    <RxArrowRight size={20} />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CopySurveyViewPage;
