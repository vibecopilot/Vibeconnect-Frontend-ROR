import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import { AiOutlineDown, AiOutlineRight } from "react-icons/ai";
import { MdMenuOpen } from "react-icons/md";
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from "react-icons/io";
function PreviewSurvey() {
  const likeRate = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Example numbers
  const [selectedValue, setSelectedValue] = useState(null);
  const [question2, setQuestion2] = useState("");
  const question2Data = {
    question:
      "2. Overall, how satisfied or dissatisfied are you with our company?",
    options: [
      "Very satisfied",
      "Somewhat satisfied",
      "Neither satisfied nor dissatisfied",
      "Somewhat dissatisfied",
      "Very dissatisfied",
    ],
  };
  const [question3, setQuestion3] = useState([]);
  const question3Data = [
    {
      id: 3,
      text: "Overall, how satisfied or dissatisfied are you with our company?",
      options: [
        "Very Satisfied",
        "Satisfied",
        "Neutral",
        "Dissatisfied",
        "Very Dissatisfied",
      ],
    },
  ];
  const handleCheckboxChange = (option) => {
    setQuestion3((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };
  const [question4, setQuestion4] = useState([]);
  const question4Data = {
    question: "4. How well do our products meet your needs?",
    options: [
      "Extremely well",
      "Not so well",
      "Very well",
      "Not at all well",
      "Somewhat well",
    ],
  };

  const [question5, setQuestion5] = useState("");
  const question5Data = {
    question: "5. How would you rate the quality of the product?",
    options: [
      "Very high quality",
      "High quality",
      "Neither high nor low quality",
      "Low quality",
      "Very low quality",
    ],
  };

  const [question6, setQuestion6] = useState("");
  const question6Data = {
    question: "6. How would you rate the value for money of the product?",
    options: [
      "Very good value",
      "Good value",
      "Neither good nor bad value",
      "Poor value",
      "Very poor value",
    ],
  };

  const [question7, setQuestion7] = useState("");
  const question7Data = {
    question:
      "7. How responsive have we been to your questions about our services?",
    options: [
      "Extremely responsive",
      "Very responsive",
      "Somewhat responsive",
      "Not so responsive",
      "Not at all responsive",
      "Not applicable",
    ],
  };

  const [question8, setQuestion8] = useState("");
  const question8Data = {
    question: "8. How long have you been a customer of our company?",
    options: [
      "This is my first purchase",
      "Less than six months",
      "Six months to a year",
      "1 - 2 years",
      "3 or more years",
      "I haven't made a purchase yet",
    ],
  };

  const [question9, setQuestion9] = useState("");
  const question9Data = {
    question:
      "9. How likely are you to recommend our company to a friend or colleague?",
    options: [
      "Extremely likely",
      "Very likely",
      "Somewhat likely",
      "Not so likely",
      "Not at all likely",
    ],
  };

  const [question10, setQuestion10] = useState("");
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (q) => {
    setOpenQuestion(openQuestion === q ? null : q);
  };

  const progress = 9; // Current progress
  const total = 10; // Total number of questions
  const percentage = (progress / total) * 100;
  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden my-5">
        <div className="grid grid-cols-12 gap-5 mt-5 border overflow-y-auto">
          <div className="col-span-4 space-y-5 border-r">
            <div className="max-w-md mx-auto">
              <div className="flex justify-between items-center mb-4 px-5 py-2">
                <h2 className="text-lg font-semibold">Survey overview</h2>
                <button className="text-gray-600 hover:text-gray-800">
                  <MdMenuOpen className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-4 px-5">
                <select className="w-full p-2 border rounded-md text-gray-700">
                  <option>Showing all pages</option>
                  <option>Page 1</option>
                </select>
              </div>

              {/* Survey Questions */}
              <div className="w-full max-w-md mx-auto">
                <h2 className="text-lg font-semibold border-b pb-5">Page 1</h2>

                {/* Question 1 */}
                <div className="pb-2 p-5">
                  <button
                    className="w-full text-left font-medium text-gray-700 flex justify-between items-start gap-4"
                    onClick={() => toggleQuestion(1)}
                  >
                    <span className="mt-1">
                      {openQuestion === 1 ? (
                        <IoIosArrowDown />
                      ) : (
                        <IoIosArrowForward />
                      )}
                    </span>
                    <h2>
                      Q1: How likely is it that you would recommend this company
                      to a friend or colleague?
                    </h2>
                  </button>
                  {openQuestion === 1 && (
                    <p className="text-sm text-gray-500 mt-2 px-8">
                      This is an NPS question
                    </p>
                  )}
                </div>
                <div className="w-full max-w-md p-5">
                  <button
                    className="w-full text-left font-medium text-gray-700 flex justify-between items-start gap-4"
                    onClick={() => toggleQuestion(2)}
                  >
                    <span className="mt-1">
                      {openQuestion === 2 ? (
                        <IoIosArrowDown />
                      ) : (
                        <IoIosArrowForward />
                      )}
                    </span>
                    <h2>{question2Data.question}</h2>
                  </button>
                  {openQuestion === 2 && (
                    <div className="mt-2 grid grid-cols-1 gap-2">
                      {question2Data.options.map((answer, index) => (
                        <button
                          key={index}
                          className="w-full flex items-center px-8 py-1"
                        >
                          <span className="text-gray-700 p-1 px-2 text-sm rounded-md bg-gray-100 mr-2">{`A${
                            index + 1
                          }`}</span>
                          {answer}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="w-full max-w-md p-5">
                  <button
                    className="w-full text-left font-medium text-gray-700 flex justify-between items-start gap-4"
                    onClick={() => toggleQuestion(3)}
                  >
                    <span className="mt-1">
                      {openQuestion === 3 ? (
                        <IoIosArrowDown />
                      ) : (
                        <IoIosArrowForward />
                      )}
                    </span>
                    <h2>{question2Data.question}</h2>
                  </button>
                  {openQuestion === 3 && (
                    <div className="mt-2 grid grid-cols-1 gap-2">
                      {question2Data.options.map((answer, index) => (
                        <button
                          key={index}
                          className="w-full flex items-center px-8 py-1"
                        >
                          <span className="text-gray-700 p-1 px-2 text-sm rounded-md bg-gray-100 mr-2">{`A${
                            index + 1
                          }`}</span>
                          {answer}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="w-full max-w-md p-5">
                  <button
                    className="w-full  font-medium text-gray-700 flex gap-4"
                    onClick={() => toggleQuestion(4)}
                  >
                    <span className="mt-1">
                      {openQuestion === 4 ? (
                        <IoIosArrowDown />
                      ) : (
                        <IoIosArrowForward />
                      )}
                    </span>
                    <h2>
                      <h2>{question4Data.question}</h2>
                    </h2>
                  </button>
                  {openQuestion === 4 && (
                    <div className="mt-2 grid grid-cols-1 gap-2">
                      {question4Data.options.map((answer, index) => (
                        <button
                          key={index}
                          className="w-full flex items-center p-2 px-8"
                        >
                          <span className="text-gray-700 p-1 px-2 text-sm rounded-md bg-gray-100 mr-2">{`A${
                            index + 1
                          }`}</span>
                          {answer}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="w-full max-w-md p-5">
                  <button
                    className="w-full font-medium text-gray-700 flex gap-4"
                    onClick={() => toggleQuestion(5)}
                  >
                    <span className="mt-1">
                      {openQuestion === 5 ? (
                        <IoIosArrowDown />
                      ) : (
                        <IoIosArrowForward />
                      )}
                    </span>
                    <h2>
                      <h2>{question5Data.question}</h2>
                    </h2>
                  </button>
                  {openQuestion === 5 && (
                    <div className="mt-2 grid grid-cols-1 gap-2">
                      {question5Data.options.map((answer, index) => (
                        <button
                          key={index}
                          className="w-full flex items-center p-1 px-8"
                        >
                          <span className="text-gray-700 p-1 px-2 text-sm rounded-md bg-gray-100 mr-2">{`A${
                            index + 1
                          }`}</span>
                          {answer}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="w-full max-w-md p-5">
                  <button
                    className="w-full text-start font-medium text-gray-700 flex gap-4"
                    onClick={() => toggleQuestion(6)}
                  >
                    <span className="mt-1">
                      {openQuestion === 6 ? (
                        <IoIosArrowDown />
                      ) : (
                        <IoIosArrowForward />
                      )}
                    </span>
                    <h2>
                      <h2>{question6Data.question}</h2>
                    </h2>
                  </button>
                  {openQuestion === 6 && (
                    <div className="grid grid-cols-1 gap-2">
                      {question6Data.options.map((answer, index) => (
                        <button
                          key={index}
                          className="w-full flex items-center p-1 px-8"
                        >
                          <span className="text-gray-700 p-1 px-2 text-sm rounded-md bg-gray-100 mr-2">{`A${
                            index + 1
                          }`}</span>
                          {answer}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="w-full max-w-md p-5">
                  <button
                    className="w-full text-start font-medium text-gray-700 flex gap-4"
                    onClick={() => toggleQuestion(7)}
                  >
                    <span className="mt-1">
                      {openQuestion === 7 ? (
                        <IoIosArrowDown />
                      ) : (
                        <IoIosArrowForward />
                      )}
                    </span>
                    <h2>
                      <h2>{question7Data.question}</h2>
                    </h2>
                  </button>
                  {openQuestion === 7 && (
                    <div className="mt-2 grid grid-cols-1 gap-2">
                      {question7Data.options.map((answer, index) => (
                        <button
                          key={index}
                          className="w-full flex items-center p-1 px-8"
                        >
                          <span className="text-gray-700 p-1 px-2 text-sm rounded-md bg-gray-100 mr-2">{`A${
                            index + 1
                          }`}</span>
                          {answer}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="w-full max-w-md p-5">
                  <button
                    className="w-full text-start font-medium text-gray-700 flex gap-4"
                    onClick={() => toggleQuestion(8)}
                  >
                    <span className="mt-1">
                      {openQuestion === 8 ? (
                        <IoIosArrowDown />
                      ) : (
                        <IoIosArrowForward />
                      )}
                    </span>
                    <h2>
                      <h2>{question8Data.question}</h2>
                    </h2>
                  </button>
                  {openQuestion === 8 && (
                    <div className="mt-2 grid grid-cols-1 gap-2">
                      {question8Data.options.map((answer, index) => (
                        <button
                          key={index}
                          className="w-full flex items-center p-1 px-8"
                        >
                          <span className="text-gray-700 p-1 px-2 text-sm rounded-md bg-gray-100 mr-2">{`A${
                            index + 1
                          }`}</span>
                          {answer}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="w-full max-w-md p-5">
                  <button
                    className="w-full text-start font-medium text-gray-700 flex gap-4"
                    onClick={() => toggleQuestion(9)}
                  >
                    <span className="mt-1">
                      {openQuestion === 9 ? (
                        <IoIosArrowDown />
                      ) : (
                        <IoIosArrowForward />
                      )}
                    </span>
                    <h2>
                      <h2>{question9Data.question}</h2>
                    </h2>
                  </button>
                  {openQuestion === 9 && (
                    <div className="mt-2 grid grid-cols-1 gap-2">
                      {question9Data.options.map((answer, index) => (
                        <button
                          key={index}
                          className="w-full flex items-center p-1"
                        >
                          <span className="text-gray-700 p-1 px-2 text-sm rounded-md bg-gray-100 mr-2">{`A${
                            index + 1
                          }`}</span>
                          {answer}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-8 space-y-8">
            <h2 className="text-2xl text-green-600">
              Customer Satisfaction Template
            </h2>
            <div>
              <h2 className="text-lg text-gray-900">
                1. How likely is it that you would recommend this company to a
                friend or colleague?
              </h2>
              <div className="flex justify-between text-sm font-medium text-gray-600 my-5">
                <span>NOT AT ALL LIKELY</span>
                <span>EXTREMELY LIKELY</span>
              </div>

              <div className="grid grid-cols-12 gap-1 w-full">
                {likeRate.map((i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedValue(i)}
                    className={`border p-2 rounded w-full ${
                      selectedValue === i
                        ? "bg-gray-500 text-white border-green-800"
                        : "bg-gray-100 text-black border-green-500"
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg text-gray-900">
                {question2Data.question}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {question2Data.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center gap-2 p-2 rounded-md border ${
                      question2 === option
                        ? "bg-gray-100 border-2 border-gray-500"
                        : "border-transparent"
                    } cursor-pointer`}
                  >
                    <input
                      type="radio"
                      name="satisfaction"
                      value={option}
                      checked={question2 === option}
                      onChange={() => setQuestion2(option)}
                      className="hidden"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        question2 === option
                          ? "border-gray-700"
                          : "border-gray-400"
                      }`}
                    >
                      {question2 === option && (
                        <div className="w-2.5 h-2.5 bg-gray-700 rounded-full"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              {question3Data.map((question) => (
                <div key={question.id}>
                  <h2 className="text-lg text-gray-900">
                    {question.id}. {question.text}
                  </h2>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {question.options.map((option) => (
                      <label
                        key={option}
                        className={`flex items-center gap-2 p-2 rounded-md border ${
                          question3.includes(option)
                            ? "bg-gray-100 border-2 border-gray-500"
                            : "border-transparent"
                        } cursor-pointer`}
                      >
                        <input
                          type="checkbox"
                          name={`question${question.id}`}
                          value={option}
                          checked={question3.includes(option)}
                          onChange={() => handleCheckboxChange(option)}
                          className="hidden"
                        />
                        <div
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                            question3.includes(option)
                              ? "border-gray-700 bg-gray-700"
                              : "border-gray-400"
                          }`}
                        >
                          {question3.includes(option) && (
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
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-lg text-gray-900">
                {question4Data.question}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {question4Data.options.map((ques4) => (
                  <label
                    key={ques4}
                    className={`flex items-center gap-2 p-2 rounded-md border ${
                      question4 === ques4
                        ? "bg-gray-100 border-2 border-gray-500"
                        : "border-transparent"
                    } cursor-pointer`}
                  >
                    <input
                      type="radio"
                      name="product_meeting_needs"
                      value={ques4}
                      checked={question4 === ques4}
                      onChange={() => setQuestion4(ques4)}
                      className="hidden"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        question4 === ques4
                          ? "border-gray-700"
                          : "border-gray-400"
                      }`}
                    >
                      {question4 === ques4 && (
                        <div className="w-2.5 h-2.5 bg-gray-700 rounded-full"></div>
                      )}
                    </div>
                    <span>{ques4}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg text-gray-900">
                {question5Data.question}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {question5Data.options.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center gap-2 p-2 rounded-md border ${
                      question5 === option
                        ? "bg-gray-100 border-2 border-gray-500"
                        : "border-transparent"
                    } cursor-pointer`}
                  >
                    <input
                      type="radio"
                      name="product_quality"
                      value={option}
                      checked={question5 === option}
                      onChange={() => setQuestion5(option)}
                      className="hidden"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        question5 === option
                          ? "border-gray-700"
                          : "border-gray-400"
                      }`}
                    >
                      {question5 === option && (
                        <div className="w-2.5 h-2.5 bg-gray-700 rounded-full"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg text-gray-900">
                {question6Data.question}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {question6Data.options.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center gap-2 p-2 rounded-md border ${
                      question6 === option
                        ? "bg-gray-100 border-2 border-gray-500"
                        : "border-transparent"
                    } cursor-pointer`}
                  >
                    <input
                      type="radio"
                      name="product_value"
                      value={option}
                      checked={question6 === option}
                      onChange={() => setQuestion6(option)}
                      className="hidden"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        question6 === option
                          ? "border-gray-700"
                          : "border-gray-400"
                      }`}
                    >
                      {question6 === option && (
                        <div className="w-2.5 h-2.5 bg-gray-700 rounded-full"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg text-gray-900">
                {question7Data.question}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {question7Data.options.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center gap-2 p-2 rounded-md border ${
                      question7 === option
                        ? "bg-gray-100 border-2 border-gray-500"
                        : "border-transparent"
                    } cursor-pointer`}
                  >
                    <input
                      type="radio"
                      name="response_quality"
                      value={option}
                      checked={question7 === option}
                      onChange={() => setQuestion7(option)}
                      className="hidden"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        question7 === option
                          ? "border-gray-700"
                          : "border-gray-400"
                      }`}
                    >
                      {question7 === option && (
                        <div className="w-2.5 h-2.5 bg-gray-700 rounded-full"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg text-gray-900">
                {question8Data.question}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {question8Data.options.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center gap-2 p-2 rounded-md border ${
                      question8 === option
                        ? "bg-gray-100 border-2 border-gray-500"
                        : "border-transparent"
                    } cursor-pointer`}
                  >
                    <input
                      type="radio"
                      name="customer_duration"
                      value={option}
                      checked={question8 === option}
                      onChange={() => setQuestion8(option)}
                      className="hidden"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        question8 === option
                          ? "border-gray-700"
                          : "border-gray-400"
                      }`}
                    >
                      {question8 === option && (
                        <div className="w-2.5 h-2.5 bg-gray-700 rounded-full"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg text-gray-900">
                {question9Data.question}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {question9Data.options.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center gap-2 p-2 rounded-md border ${
                      question9 === option
                        ? "bg-gray-100 border-2 border-gray-500"
                        : "border-transparent"
                    } cursor-pointer`}
                  >
                    <input
                      type="radio"
                      name="purchase_likelihood"
                      value={option}
                      checked={question9 === option}
                      onChange={() => setQuestion9(option)}
                      className="hidden"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        question9 === option
                          ? "border-gray-700"
                          : "border-gray-400"
                      }`}
                    >
                      {question9 === option && (
                        <div className="w-2.5 h-2.5 bg-gray-700 rounded-full"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg text-gray-900 mb-3">
                10.Do you have any other comments, questions, or concerns?
              </h2>
              <div className="w-full max-w-lg">
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  placeholder="Type your message here..."
                  value={question10}
                  onChange={(e) => setQuestion10(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[98%] p-5 flex items-center justify-center bg-green-500 fixed bottom-8">
          <div className="w-full flex flex-col items-center gap-3">
            <span className="text-white font-semibold">
              {progress} of {total} answered
            </span>
            <div className="relative w-[80%] h-4 bg-white rounded-full overflow-hidden border border-white">
              <div
                className="h-full bg-green-600"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PreviewSurvey;
