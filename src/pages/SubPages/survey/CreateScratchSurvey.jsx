import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { BsPlusCircle } from "react-icons/bs";
import { FiMinus, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import Navbar from "../../../components/Navbar";
import { createSurvey, getSurvey, updateSurvey } from "../../../api";
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

// Map frontend question types to backend (rating, multiple_choice, single_choice, true_false, text, scale)
const mapQuestionTypeToBackend = (frontendType) => {
  const map = {
    "multiple-choice": "single_choice",
    checkBoxes: "multiple_choice",
    star: "rating",
    bestWorstScale: "scale",
    singleTextBox: "text",
    commentBox: "text",
    dropdown: "single_choice",
    slider: "scale",
    fileUpload: "text",
    matrixDropdown: "text",
    matrixRatingScale: "scale",
    ranking: "text",
    multipleTextboxes: "text",
    dateTime: "text",
  };
  return map[frontendType] || "text";
};

// Map backend question_type to frontend questionType
const mapBackendToFrontendType = (backendType) => {
  const map = {
    single_choice: "multiple-choice",
    multiple_choice: "checkBoxes",
    rating: "star",
    scale: "slider",
    text: "commentBox",
    true_false: "multiple-choice",
  };
  return map[backendType] || "commentBox";
};

function CreateScratchSurvey() {
  const { id: surveyId } = useParams();
  const navigate = useNavigate();
  const themeColor = useSelector((state) => state.theme.color);
  const isEditMode = !!surveyId;
  const [surveyTitle, setSurveyTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [isChecked, setIsChecked] = useState(false);
  const [deletedQuestionIds, setDeletedQuestionIds] = useState([]);

  useEffect(() => {
    if (!surveyId) return;
    setLoading(true);
    setDeletedQuestionIds([]);
    getSurvey(surveyId)
      .then((res) => {
        const s = res.data;
        setSurveyTitle(s.survey_title || "");
        setDescription(s.description || "");
        setStartDate(s.start_date ? new Date(s.start_date).toISOString().split("T")[0] : "");
        setEndDate(s.end_date ? new Date(s.end_date).toISOString().split("T")[0] : "");
        const qs = (s.survey_questions || []).map((q) => {
          const opts = q.options || [];
          const labels = opts.map((o) => o.label || "");
          const frontendType = mapBackendToFrontendType(q.question_type);
          const useChoices = frontendType === "multiple-choice";
          return {
            _qId: q.id,
            question: q.q_title || "",
            questionType: frontendType,
            choices: useChoices ? (labels.length ? labels : ["", ""]) : ["", "", "", ""],
            checkBox: !useChoices && frontendType === "checkBoxes" ? (labels.length ? labels : ["", ""]) : ["", "", "", ""],
            star: ["", ""],
            _optionIds: opts.map((o) => o.id),
            _deletedOptionIds: [],
          };
        });
        setQuestions(qs);
      })
      .catch(() => toast.error("Failed to load survey"))
      .finally(() => setLoading(false));
  }, [surveyId]);

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

  if (loading) {
    return (
      <div className="flex">
        <Navbar />
        <div className="w-full flex items-center justify-center min-h-[200px]">Loading survey…</div>
      </div>
    );
  }

  const removeQuestion = (index) => {
    const q = questions[index];
    if (q?._qId) {
      setDeletedQuestionIds((prev) => [...prev, q._qId]);
    }
    setQuestions((prev) => prev.filter((_, i) => i !== index));
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
    const q = updatedQuestions[questionIndex];
    if (q.choices.length > 1) {
      const removedOptId = q._optionIds?.[choiceIndex];
      if (removedOptId) {
        q._deletedOptionIds = [...(q._deletedOptionIds || []), removedOptId];
      }
      q.choices = q.choices.filter((_, i) => i !== choiceIndex);
      if (q._optionIds && q._optionIds.length > choiceIndex) {
        q._optionIds = q._optionIds.filter((_, i) => i !== choiceIndex);
      }
      setQuestions(updatedQuestions);
    }
  };

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
    const q = updatedQuestions[questionIndex];
    if (q.checkBox.length > 1) {
      const removedOptId = q._optionIds?.[checkBoxIndex];
      if (removedOptId) {
        q._deletedOptionIds = [...(q._deletedOptionIds || []), removedOptId];
      }
      q.checkBox = q.checkBox.filter((_, i) => i !== checkBoxIndex);
      if (q._optionIds && q._optionIds.length > checkBoxIndex) {
        q._optionIds = q._optionIds.filter((_, i) => i !== checkBoxIndex);
      }
      setQuestions(updatedQuestions);
    }
  };

  const buildOptions = (q) => {
    const backendType = mapQuestionTypeToBackend(q.questionType);
    let labels = [];
    if (backendType === "single_choice" || backendType === "multiple_choice") {
      if (q.questionType === "checkBoxes") labels = (q.checkBox || []).filter(Boolean);
      else labels = (q.choices || []).filter(Boolean);
    }
    const optionIds = q._optionIds || [];
    const kept = labels.map((label, i) => {
      const opt = { label, position: i + 1 };
      if (optionIds[i]) opt.id = optionIds[i];
      return opt;
    });
    const destroyed = (q._deletedOptionIds || []).map((id) => ({ id, _destroy: true }));
    return [...kept, ...destroyed];
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!surveyTitle.trim()) {
      toast.error("Please enter a survey title.");
      return;
    }
    setSubmitting(true);
    try {
      const keptQuestions = questions
        .map((q, index) => {
          if (!q.question?.trim()) return null;
          const question_type = mapQuestionTypeToBackend(q.questionType);
          const options = buildOptions(q);
          const item = {
            q_title: q.question.trim(),
            question_type,
            position: index + 1,
            required: false,
            min_value: question_type === "scale" ? 0 : null,
            max_value: question_type === "scale" ? 10 : null,
            ...(options.length ? { options } : {}),
          };
          if (q._qId) item.id = q._qId;
          return item;
        })
        .filter(Boolean);
      const destroyedQuestions = (isEditMode ? deletedQuestionIds : []).map((id) => ({ id, _destroy: true }));
      const survey_questions = [...keptQuestions, ...destroyedQuestions];

      const payload = {
        survey: {
          survey_title: surveyTitle.trim(),
          description: description.trim() || null,
          start_date: startDate || null,
          end_date: endDate || null,
          ...(isEditMode ? {} : { status: "draft" }),
          survey_questions,
        },
      };

      if (isEditMode) {
        await updateSurvey(surveyId, payload);
        toast.success("Survey updated.");
        navigate(`/admin/survey-details/${surveyId}`);
      } else {
        const res = await createSurvey(payload);
        const id = res.data?.id;
        toast.success("Survey created successfully.");
        if (id) navigate(`/admin/survey-details/${id}`);
        else navigate("/admin/survey");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors || err.message;
      toast.error(Array.isArray(msg) ? msg.join(", ") : msg || (isEditMode ? "Failed to update survey." : "Failed to create survey."));
    } finally {
      setSubmitting(false);
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
          {isEditMode ? "Edit Survey" : "Add Survey"}
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
              <div className="flex justify-start my-3 gap-3">
                <button
                  type="button"
                  onClick={addQuestion}
                  className="border border-gray-500 rounded-md px-4 py-1"
                >
                  Add Question
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-4 py-2 text-white rounded-md disabled:opacity-50"
                  style={{ background: themeColor }}
                >
                  {submitting ? "Saving…" : isEditMode ? "Save changes" : "Create Survey"}
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
