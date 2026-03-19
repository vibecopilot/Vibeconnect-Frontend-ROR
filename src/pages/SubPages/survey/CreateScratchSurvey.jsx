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
import { BlockPicker } from "react-color";
import { domainPrefix } from "../../../api";

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
  const [clientLogo, setClientLogo] = useState(null); // for new upload
  const [existingClientLogo, setExistingClientLogo] = useState(null); // for preview

  const [headerImage, setHeaderImage] = useState(null);
  const [headerText, setHeaderText] = useState("");

  const [footerImage, setFooterImage] = useState(null);
  const [footerText, setFooterText] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [formThemeColor, setFormThemeColor] = useState(themeColor || "#7C3AED");
  const pastelColors = [
    "#FFB3BA", // pastel pink
    "#FFDFBA", // pastel orange
    "#FFFFBA", // pastel yellow
    "#BAFFC9", // pastel green
    "#BAE1FF", // pastel blue
    "#E0BBE4", // pastel purple
    "#FDFD96", // pastel light yellow
  ];
  const [backgroundImage, setBackgroundImage] = useState(null);
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
        // Load branding fields
        setBackgroundColor(s.background_color || "");
        setHeaderText(s.header_text || "");
        setFooterText(s.footer_text || "");
        setExistingClientLogo(s.client_logo || null);
        setHeaderImage(s.header_image || null);
        setFooterImage(s.footer_image || null);
        setBackgroundImage(s.background_image || null);

        const qs = (s.survey_questions || []).map((q) => {
          const opts = q.options || [];
          const labels = opts.map((o) => o.label || "");
          const frontendType = mapBackendToFrontendType(q.question_type);
          const useChoices = frontendType === "multiple-choice";
          const att = (q.attachments || [])[0];
          return {
            _qId: q.id,
            question: q.q_title || "",
            questionType: frontendType,
            choices: useChoices ? (labels.length ? labels : ["", ""]) : ["", "", "", ""],
            checkBox: !useChoices && frontendType === "checkBoxes" ? (labels.length ? labels : ["", ""]) : ["", "", "", ""],
            star: ["", ""],
            _optionIds: opts.map((o) => o.id),
            _deletedOptionIds: [],
            attachment: null,
            existingAttachment: att ? att.document_url : null,
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
      attachment: null,
      existingAttachment: null,
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleAttachmentChange = (file, index) => {
    const updated = [...questions];
    updated[index].attachment = file;
    if (file) updated[index].existingAttachment = null;
    setQuestions(updated);
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

      const destroyedQuestions = (isEditMode ? deletedQuestionIds : []).map(
        (id) => ({ id, _destroy: true })
      );

      const survey_questions = [...keptQuestions, ...destroyedQuestions];

      // FORM DATA FOR FILE UPLOAD
      const formData = new FormData();

      formData.append("survey[survey_title]", surveyTitle.trim());
      formData.append("survey[description]", description.trim());
      formData.append("survey[start_date]", startDate || "");
      formData.append("survey[end_date]", endDate || "");
      formData.append("survey[background_color]", backgroundColor);
      if (backgroundImage) {
        formData.append("survey[background_image]", backgroundImage);
      }

      // HEADER & FOOTER TEXT
      formData.append("survey[header_text]", headerText);
      formData.append("survey[footer_text]", footerText);

      // CLIENT BRANDING FILES
      console.log("Uploading logo:", clientLogo);

      if (clientLogo) {
        formData.append("survey[client_logo]", clientLogo);
      }

      if (headerImage) {
        formData.append("survey[header_image]", headerImage);
      }

      if (footerImage) {
        formData.append("survey[footer_image]", footerImage);
      }

      formData.append(
        "survey[survey_questions]",
        JSON.stringify(survey_questions)
      );

      // Question-level attachments
      questions.forEach((q, i) => {
        if (q.attachment instanceof File) {
          formData.append(`survey[question_attachment_${i}]`, q.attachment);
        }
      });

      if (isEditMode) {
        await updateSurvey(surveyId, formData);
        toast.success("Survey updated.");
        navigate(`/admin/survey-details/${surveyId}`);
      } else {
        const res = await createSurvey(formData);
        const id = res.data?.id;

        toast.success("Survey created successfully.");

        if (id) navigate(`/admin/survey-details/${id}`);
        else navigate("/admin/survey");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors ||
        err.message;

      toast.error(
        Array.isArray(msg)
          ? msg.join(", ")
          : msg ||
          (isEditMode
            ? "Failed to update survey."
            : "Failed to create survey.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const containerClass = "w-full max-w-4xl mx-auto px-4";
  const sectionClass = "w-full bg-gray-50 rounded-xl p-6 shadow-sm border";

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: backgroundColor || "#f3e8ff" }}
    >
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="flex flex-col overflow-hidden w-full">
        <div className={`${containerClass} mt-6`}>
          <h2 className="text-3xl font-extrabold text-black text-center">
            {isEditMode ? "Edit Survey" : "Add Survey"}
          </h2>
        </div>

        {/* Survey Form - centered, equal-width sections */}
        <div className={`${containerClass} flex flex-col gap-6 py-6`}>
          {/* SECTION 1 : SURVEY INFO */}
          <div className={`${sectionClass}`}>

            <h3 className="text-lg font-semibold mb-4">Survey Information</h3>

            <div className="grid md:grid-cols-3 gap-5">

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Survey Title</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Enter Survey Title"
                  className="border rounded-lg px-4 py-2"
                  value={surveyTitle}
                  onChange={(e) => setSurveyTitle(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Start Date</label>
                <input
                  type="date"
                  className="border rounded-lg px-4 py-2"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">End Date</label>
                <input
                  type="date"
                  className="border rounded-lg px-4 py-2"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

            </div>

            <div className="flex flex-col mt-4">
              <label className="font-semibold mb-1">Description</label>
              <textarea
                name="description"
                id="description"
                rows="3"
                className="border rounded-lg px-4 py-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Survey Description"
              />
            </div>

          </div>

          {/* SECTION 2 : CUSTOMIZE COLOR */}
          <div className={`${sectionClass}`}>

            <h3 className="text-lg font-semibold mb-4">
              Customize Appearance
            </h3>

            <label className="text-sm font-medium text-gray-600">
              Background Color
            </label>

            <div className="flex flex-wrap gap-3 mt-3 mb-4">

              {pastelColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setBackgroundColor(color)}
                  className={`w-10 h-10 rounded-lg border-2
${backgroundColor === color ? "border-black scale-110" : "border-gray-300"}`}
                  style={{ backgroundColor: color }}
                />
              ))}

            </div>

            <button
              type="button"
              onClick={() => {
                setBackgroundColor("")
                setFormThemeColor(themeColor || "#7C3AED")
              }}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Reset Colors
            </button>

          </div>

          {/* SECTION 3 : BRANDING */}
          <div className={`${sectionClass}`}>
            <h3 className="text-lg font-semibold mb-4">
              Branding
            </h3>

            <div className="grid md:grid-cols-2 gap-5">

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Background Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBackgroundImage(e.target.files[0])}
                  className="border p-2 rounded-md"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Client Logo</label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setClientLogo(e.target.files[0])}
                  className="border p-2 rounded-md"
                />

                {/* 🔷 Existing Logo Preview */}
                {existingClientLogo && !clientLogo && (
                  <img
                    src={
                      existingClientLogo.startsWith("http")
                        ? existingClientLogo
                        : domainPrefix + existingClientLogo
                    }
                    alt="Existing Logo"
                    className="h-16 mt-2 object-contain border rounded-md p-1"
                  />
                )}
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Header Text</label>
                <input
                  type="text"
                  className="border rounded-lg px-4 py-2"
                  value={headerText}
                  onChange={(e) => setHeaderText(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Header Image</label>
                <input
                  type="file"

                  accept="image/*"
                  onChange={(e) => setHeaderImage(e.target.files[0])}
                  className="border p-2 rounded-md"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Footer Text</label>
                <input
                  type="text"
                  className="border rounded-lg px-4 py-2"
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Footer Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFooterImage(e.target.files[0])}
                  className="border p-2 rounded-md"
                />
              </div>
            </div>

          </div>

          {/* SECTION 4 : Questions */}
          <div className={`${sectionClass} bg-white`}>

            <h3 className="text-lg font-semibold mb-4">Add Questions</h3>

            {questions.map((question, index) => (

              <div
                key={index}
                className="border border-gray-200 rounded-xl p-5 mb-6 bg-white shadow-sm"
              >

                {/* Top Row */}
                <div className="flex items-center gap-4">

                  <input
                    type="text"
                    name="question"
                    placeholder={`Question ${index + 1}`}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                    value={question.question}
                    onChange={(e) => handleQuestionChange(e, index)}
                  />

                  <select
                    className="border border-gray-300 rounded-lg px-4 py-2"
                    value={question.questionType}
                    onChange={(e) => handleQuestionTypeChange(e, index)}
                  >
                    <option value="">Text Answer</option>
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="checkBoxes">Checkbox</option>
                    <option value="star">Star</option>
                    <option value="bestWorstScale">Best Worst Scale</option>
                    <option value="fileUpload">File Upload</option>
                    <option value="singleTextBox">Single TextBox</option>
                    <option value="commentBox">Comment Box</option>
                    <option value="matrixDropdown">Matrix Of Dropdown Menu</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="matrixRatingScale">Matrix Rating Scale</option>
                    <option value="ranking">Ranking</option>
                    <option value="slider">Slider</option>
                    <option value="multipleTextboxes">Multiple Textboxes</option>
                    <option value="dateTime">Date/Time</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <FaTrash />
                  </button>

                </div>

                {/* Multiple Choice */}
                {question.questionType === "multiple-choice" && (
                  <div className="flex flex-col mt-4 space-y-3">

                    {question.choices.map((choice, choiceIndex) => (
                      <div className="flex items-center gap-2" key={choiceIndex}>

                        <input
                          type="text"
                          className="border border-gray-300 rounded-md px-3 py-1 w-full"
                          value={choice}
                          onChange={(e) => handleChoiceChange(e, index, choiceIndex)}
                          placeholder={`Option ${choiceIndex + 1}`}
                        />

                        <button
                          type="button"
                          onClick={() => removeChoice(index, choiceIndex)}
                          className="text-red-500"
                        >
                          <FaTrash size={18} />
                        </button>

                      </div>
                    ))}

                    {question.choices.length < 6 && (
                      <button
                        type="button"
                        onClick={() => addChoice(index)}
                        className="border border-gray-400 px-3 py-1 rounded-md w-fit"
                      >
                        Add Option
                      </button>
                    )}

                  </div>
                )}

                {/* Checkboxes */}
                {question.questionType === "checkBoxes" && (
                  <div className="flex flex-col mt-4 space-y-3">

                    {question.checkBox.map((box, checkBoxIndex) => (
                      <div className="flex items-center gap-2" key={checkBoxIndex}>

                        <input type="checkbox" />

                        <input
                          type="text"
                          className="border border-gray-300 rounded-md px-3 py-1 w-full"
                          value={box}
                          onChange={(e) => handleChangeCheckBox(e, index, checkBoxIndex)}
                          placeholder={`Option ${checkBoxIndex + 1}`}
                        />

                        <button
                          type="button"
                          onClick={() => removeCheckBox(index, checkBoxIndex)}
                          className="text-red-500"
                        >
                          <FaTrash size={18} />
                        </button>

                      </div>
                    ))}

                    {question.checkBox.length < 6 && (
                      <button
                        type="button"
                        onClick={() => addCheckBox(index)}
                        className="border border-gray-400 px-3 py-1 rounded-md w-fit"
                      >
                        Add Option
                      </button>
                    )}

                  </div>
                )}

                {/* Other Question Components */}
                {question.questionType === "star" && <AddStarField />}
                {question.questionType === "bestWorstScale" && <BestWorstScale />}
                {question.questionType === "fileUpload" && <FileUploadSurvey />}
                {question.questionType === "matrixDropdown" && <MatrixDropdownMenuSurvey />}
                {question.questionType === "dropdown" && <AddDropdownField />}
                {question.questionType === "matrixRatingScale" && <MatrixRatingScale />}
                {question.questionType === "ranking" && <AddRankingField />}
                {question.questionType === "slider" && <AddRangeField />}
                {question.questionType === "multipleTextboxes" && <AddMultipleTextBoxesField />}
                {question.questionType === "dateTime" && <AddDateTimeField />}

                {/* Question Attachment */}
                <div className="mt-4 border-t pt-3">
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Attachment</label>
                  {question.existingAttachment && !question.attachment && (
                    <div className="mb-2">
                      <a
                        href={question.existingAttachment}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        View existing attachment
                      </a>
                    </div>
                  )}
                  <input
                    type="file"
                    onChange={(e) => handleAttachmentChange(e.target.files[0], index)}
                    className="border p-2 rounded-md text-sm w-full"
                  />
                </div>

              </div>

            ))}

            {/* Bottom Buttons */}
            <div className="flex gap-3 mt-4">

              <button
                type="button"
                onClick={addQuestion}
                className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg"
              >
                Add Question
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 rounded-lg text-white"
                style={{ background: themeColor }}
              >
                {submitting ? "Saving…" : isEditMode ? "Save Changes" : "Create Survey"}
              </button>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateScratchSurvey;
