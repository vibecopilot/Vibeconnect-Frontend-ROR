import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { BsPlusCircle } from "react-icons/bs";
import { FiMinus, FiPlus } from "react-icons/fi";
import Navbar from "../../../components/Navbar";
import AddStarField from "./AddStarField";
import BestWorstScale from "./BestWorstScale";
import FileUploadSurvey from "./FileUploadSurvey";
import MatrixDropdownMenuSurvey from "./MatrixDropdownMenuSurvey";
import AddDropdownField from "./AddDropdownField";
import MatrixRatingScale from "./MatrixRatingScale";
import AddRankingField from "./AddRankingField";
import AddRangeField from "./AddRangeField";
import AddMultipleTextBoxesField from "./AddMultipleTextBoxesField"
// import AddMultipleTextBoxesField from "./AddMultipleTextboxesField";
import AddDateTimeField from "./AddDateTimeField";

function CreateScratchSurvey() {
  const themeColor = useSelector((state) => state.theme.color);
  const [surveyTitle, setSurveyTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    const newQuestion = {
      question: "",
      questionType: "",
      choices: ["", "", "", ""],
      checkBox: ["", "", "", ""],
      star: ["", ""],
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleQuestionChange = (e, index) => {
    const updatedQuestions = [...questions];
    console.log(updatedQuestions);
    updatedQuestions[index].question = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleQuestionTypeChange = (e, index) => {
    const updatedQuestions = [...questions];
    console.log(updatedQuestions);
    updatedQuestions[index].questionType = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleChoiceChange = (e, questionIndex, choiceIndex) => {
    const updatedQuestions = [...questions];
    console.log(questions);
    updatedQuestions[questionIndex].choices[choiceIndex] = e.target.value;
    setQuestions(updatedQuestions);
  };

  const addChoice = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].choices.push("");
    setQuestions(updatedQuestions);
  };

  const removeChoice = (questionIndex, choiceIndex) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].choices.length > 1) {
      updatedQuestions[questionIndex].choices = updatedQuestions[
        questionIndex
      ].choices.filter((_, i) => i !== choiceIndex);
      setQuestions(updatedQuestions);
    }
  };

  const [isChecked, setIsChecked] = useState(false);

  // Handle checkbox change
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleChangeCheckBox = (e, questionCheckBox, checkBoxIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionCheckBox].checkBox[checkBoxIndex] = e.target.value;
    setQuestions(updatedQuestions);
  };

  const addCheckBox = (questionCheckBox) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionCheckBox].checkBox.push("");
    setQuestions(updatedQuestions);
  };

  const removeCheckBox = (questionIndex, checkBoxIndex) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].checkBox.length > 1) {
      updatedQuestions[questionIndex].checkBox = updatedQuestions[
        questionIndex
      ].checkBox.filter((_, i) => i !== checkBoxIndex);
      setQuestions(updatedQuestions);
    }
  };

  return (
    <div className="flex">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="flex flex-col overflow-hidden w-full">
        <h2
          className="text-center text-lg font-bold my-5 p-2 rounded-md text-white mx-10"
          style={{ background: themeColor }}
        >
          Add Survey
        </h2>
        <div className="flex justify-center">
          <div className="sm:border border-gray-400 p-1 md:px-10 rounded-lg w-4/5 mb-14">
            {/* Survey Form */}
            <div className="md:grid grid-cols-3 gap-5 my-3">
              <div className="flex flex-col">
                <label htmlFor="title" className="font-semibold my-2">
                  Survey Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Enter Survey Title"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                  value={surveyTitle}
                  onChange={(e) => setSurveyTitle(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="start_date" className="font-semibold my-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  id="start_date"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="end_date" className="font-semibold my-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  id="end_date"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col col-span-3">
                <label
                  htmlFor="description"
                  className="font-semibold my-2 mt-4"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  placeholder="Enter Survey Description"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Questions Section */}
            <div className="my-5">
              <h2 className="border-b border-gray-500 text-gray-950 text-xl">
                Add Questions
              </h2>
              {questions.map((question, index) => (
                <div
                  key={index}
                  className="md:grid grid-cols-3 gap-5 my-3 border p-5 rounded-md"
                >
                  <div className="flex flex-col col-span-2">
                    <label
                      htmlFor={`question-${index}`}
                      className="font-semibold my-2"
                    >
                      Question
                    </label>
                    <input
                      type="text"
                      name="question"
                      id={`question-${index}`}
                      placeholder="Enter Question"
                      className="border p-1 px-4 border-gray-500 rounded-md"
                      value={question.question}
                      onChange={(e) => handleQuestionChange(e, index)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor={`questionType-${index}`}
                      className="font-semibold my-2"
                    >
                      Question Type
                    </label>
                    <select
                      name="questionType"
                      id={`questionType-${index}`}
                      className="border p-1 px-4 border-gray-500 rounded-md"
                      value={question.questionType}
                      onChange={(e) => handleQuestionTypeChange(e, index)}
                    >
                      <option value="">Select Question Type</option>
                      <option value="multiple-choice">Multiple choice</option>
                      <option value="checkBoxes">CheckBoxes</option>
                      <option value="star">Star</option>
                      <option value="bestWorstScale">Best Worst Scale</option>
                      <option value="fileUpload">File Upload</option>
                      <option value="singleTextBox">Single TextBox</option>
                      <option value="commentBox">Comment Box</option>
                      <option value="matrixDropdown">
                        Matrix Of Dropdown Menu
                      </option>
                      <option value="dropdown">Dropdown</option>
                      <option value="matrixRatingScale">
                        Matrix Rating Scale
                      </option>
                      <option value="ranking">Ranking</option>
                      <option value="slider">Slider</option>
                      <option value="multipleTextboxes">
                        Multiple Textboxes
                      </option>
                      <option value="dateTime">Date/Time</option>
                    </select>
                  </div>
                  {/* Choices for Multiple Choice Questions */}
                  {question.questionType === "multiple-choice" && (
                    <div className="flex flex-col col-span-3 mt-4 space-y-3">
                      {question.choices.map((choice, choiceIndex) => (
                        <div
                          className="flex items-center gap-2"
                          key={choiceIndex}
                        >
                          <label
                            htmlFor={`choice-${choiceIndex}`}
                            className="font-semibold w-32"
                          >
                            Option {choiceIndex + 1}
                          </label>
                          <input
                            type="text"
                            id={`choice-${choiceIndex}`}
                            className="border p-1 px-4 border-gray-500 rounded-md w-full"
                            value={choice}
                            onChange={(e) =>
                              handleChoiceChange(e, index, choiceIndex)
                            }
                            placeholder="Enter an Answer option"
                          />
                          {isChecked && (
                            <div className="flex items-center">
                              <span className="text-gray-500 mr-2">Points</span>
                              <button className="w-8 h-8 flex items-center justify-center border border-gray-200 hover:bg-gray-50">
                                <FiMinus className="w-4 h-4 text-gray-600" />
                              </button>
                              <input
                                type="number"
                                className="w-12 h-8 text-center border-t border-b border-gray-200"
                                placeholder="0"
                              />
                              <button className="w-8 h-8 flex items-center justify-center border border-gray-200 hover:bg-gray-50">
                                <FiPlus className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeChoice(index, choiceIndex)}
                            className="text-red-500"
                          >
                            <FaTrash size={20} />
                          </button>
                        </div>
                      ))}
                      <div className="col-span-4 flex items-center justify-start mt-3">
                        <input
                          type="checkbox"
                          id="scoreThisQuestion"
                          className="mr-2"
                          checked={isChecked}
                          onChange={handleCheckboxChange}
                        />
                        <label
                          htmlFor="scoreThisQuestion"
                          className="text-lg text-gray-700"
                        >
                          Score this question
                        </label>
                      </div>
                      {/* Add New Choice Button */}
                      <div>
                        {question.choices.length < 6 && (
                          <button
                            type="button"
                            onClick={() => addChoice(index)}
                            className="border border-gray-500 text-black px-4 py-1 rounded-md mt-2"
                          >
                            <BsPlusCircle />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  {question.questionType === "checkBoxes" && (
                    <div className="flex flex-col col-span-3 mt-4 space-y-3">
                      {question.checkBox.map((box, checkBoxIndex) => (
                        <div
                          className="flex items-center gap-2"
                          key={checkBoxIndex}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <input
                              type="checkbox"
                              id={`checkbox-${checkBoxIndex}`}
                              className="border-gray-500 rounded-md"
                              checked={isChecked}
                              onChange={(e) =>
                                handleCheckboxChange(e, index, checkBoxIndex)
                              }
                            />
                            <input
                              type="text"
                              id={`box-${checkBoxIndex}`}
                              className="border p-1 px-4 border-gray-500 rounded-md w-full"
                              value={box}
                              onChange={(e) =>
                                handleChangeCheckBox(e, index, checkBoxIndex)
                              }
                              placeholder={`Enter an answer choice ${
                                checkBoxIndex + 1
                              }`}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCheckBox(index, checkBoxIndex)}
                            className="text-red-500"
                          >
                            <FaTrash size={20} />
                          </button>
                        </div>
                      ))}
                      <div>
                        {question.checkBox.length < 6 && (
                          <button
                            type="button"
                            onClick={() => addCheckBox(index)}
                            className="border border-gray-500 text-black px-4 py-1 rounded-md mt-2"
                          >
                            <BsPlusCircle />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  {question.questionType === "star" && (
                    <div className="flex flex-col col-span-3 mt-4 space-y-3">
                      <AddStarField />
                    </div>
                  )}
                  {question.questionType === "bestWorstScale" && (
                    <div className="flex flex-col col-span-3 mt-4 space-y-3">
                      <BestWorstScale />
                    </div>
                  )}
                  {question.questionType === "fileUpload" && (
                    <div className="flex flex-col col-span-3 mt-4 space-y-3">
                      <FileUploadSurvey />
                    </div>
                  )}
                  {question.questionType === "matrixDropdown" && (
                    <div className="flex flex-col col-span-3 mt-4 space-y-3">
                      <MatrixDropdownMenuSurvey />
                    </div>
                  )}
                  {question.questionType === "dropdown" && (
                    <div className="flex flex-col col-span-3 mt-4 space-y-3">
                      <AddDropdownField />
                    </div>
                  )}
                  {question.questionType === "matrixRatingScale" && (
                    <div className="flex flex-col col-span-3 mt-4 space-y-3">
                      <MatrixRatingScale />
                    </div>
                  )}
                  {question.questionType === "ranking" && (
                    <div className="flex flex-col col-span-3 mt-4 space-y-3">
                      <AddRankingField />
                    </div>
                  )}
                  {question.questionType === "slider" && (
                    <div className="flex flex-col col-span-3 mt-4 space-y-3">
                      <AddRangeField />
                    </div>
                  )}
                  {question.questionType === "multipleTextboxes" && (
                    <div className="flex flex-col col-span-3 mt-4 space-y-3">
                      <AddMultipleTextBoxesField />
                    </div>
                  )}
                  {question.questionType === "dateTime" && (
                    <div className="flex flex-col col-span-3 mt-4 space-y-3">
                      <AddDateTimeField />
                    </div>
                  )}
                  {/* Remove Question Button */}
                  <div className="flex col-span-3 justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-red-500 font-semibold border rounded-md p-1 px-4"
                    >
                      Remove Question
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex justify-start my-3">
                <button
                  type="button"
                  onClick={addQuestion}
                  className="border border-gray-500 rounded-md px-4 py-1"
                >
                  Add Question
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateScratchSurvey;
