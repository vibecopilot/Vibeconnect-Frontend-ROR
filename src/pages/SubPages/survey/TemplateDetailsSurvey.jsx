import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import { MdOutlineSignalCellularAlt2Bar } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import { RxArrowRight } from "react-icons/rx";
function TemplateDetailsSurvey() {
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

  const progress = 9; // Current progress
  const total = 10; // Total number of questions
  const percentage = (progress / total) * 100;

  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex flex-col overflow-hidden my-5">
        <div className="grid grid-cols-12">
          <div className="col-span-9">
            <div className="flex flex-wrap justify-center gap-5 mx-12">
              <NavLink
                to="/admin/template-detail-survey"
                className={({ isActive }) =>
                  `p-3 cursor-pointer ${
                    isActive
                      ? "border-b-2 border-green-600 text-green-600 font-semibold"
                      : ""
                  }`
                }
              >
                Preview
              </NavLink>
              <NavLink
                to="/admin/sample-result-survey"
                className={({ isActive }) =>
                  `p-3 cursor-pointer ${
                    isActive
                      ? "border-b-2 border-green-600 text-green-600 font-semibold"
                      : ""
                  }`
                }
              >
                Sample Result
              </NavLink>
            </div>
            <div className="border-b border-inherit"></div>
            <h2 className="text-2xl text-green-600 px-10 my-5">
              Customer Satisfaction Template
            </h2>
            <div className="h-screen overflow-y-auto">
              <div className="space-y-10 px-10">
                {question.map((q) => (
                  <div key={q.id}>
                    <h2 className="text-lg font-medium text-gray-600 mb-6">
                      {q.id}. {q.questionName}
                    </h2>

                    {q.questType === "range" && (
                      <>
                        <div className="flex justify-between text-sm font-medium text-gray-600 my-2">
                          <span>NOT AT ALL LIKELY</span>
                          <span>EXTREMELY LIKELY</span>
                        </div>
                        <div className="grid grid-cols-10 gap-1 w-full border-2">
                          {q.option.map((i) => (
                            <button
                              key={i}
                              onClick={() => handleRangeChange(q.id, i)}
                              className={`border p-2 rounded w-full ${
                                responses[q.id] === i
                                  ? "bg-gray-500 text-white border-green-800 w-full"
                                  : "bg-gray-100 text-black border-green-500 w-full"
                              }`}
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
                      <div className="grid grid-cols-2 gap-2 mt-2">
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
                                <svg
                                  className="w-3 h-3 text-white"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
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
                  </div>
                ))}
              </div>
              <div className="my-5 mx-10">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => console.log(responses)}
                >
                  Submit
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center bg-green-500 bottom-6 py-2 px-4">
              <div className="flex items-center gap-3 w-full">
                <div className="relative w-1/2 h-4 bg-white rounded-full overflow-hidden border border-white">
                  <div
                    className="h-full bg-green-600"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="text-white font-semibold">
                  <span>{progress}</span> <span>of {total} answered</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-3 border-l py-5">
            <div className="space-y-5 px-5">
              <h2 className="text-2xl">Customer Satisfaction Template</h2>
              <div className="flex gap-2 items-center">
                <div className="w-6 h-6 rounded-full bg-gray-200 shadow-lg flex justify-center items-center">
                  <MdOutlineSignalCellularAlt2Bar size={25} />
                </div>
                <p className="text-gray-700">Benchmarks available</p>
              </div>
              <p className="font-sans">
                Your customers’ happiness directly influences your company’s
                longevity. Be sure to get feedback directly from the people who
                matter. Our Customer Satisfaction Survey Template will measure
                your product’s value and quality, helping you gauge
                opportunities for improvement.
              </p>
              <p className="text-sm from-neutral-600 text-gray-800">
                You can always make changes to the theme and template.
              </p>
            </div>
            <div className="border-t my-5 p-5 space-y-5">
              <div className="border p-3 space-y-2 rounded-md">
                <h2 className="text-sm font-medium">Premium features</h2>
                <p className="text-xs">This template contains paid features</p>
              </div>
              <div className="w-full">
                <Link
                  to={`/admin/edit-template-survey`}
                  className="bg-yellow-500 rounded-md w-full py-2 px-6 flex justify-center  items-center gap-8"
                >
                  <h2>Use This Template</h2>
                  <span>
                    <RxArrowRight size={20} />
                  </span>
                </Link>
              </div>
              <p className="text-sm font-normal text-gray-600">
                Didn’t find what you’re looking for?
              </p>
              <div>
                <Link
                  to={`/admin/create-scratch-survey`}
                  className="font-medium text-sm text-sky-800"
                >
                  Start with a blank survey
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TemplateDetailsSurvey;
