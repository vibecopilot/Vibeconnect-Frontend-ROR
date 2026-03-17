import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiShield, FiFileText, FiHome } from "react-icons/fi";
import { getPublicSurvey, createPublicSurveyResponse } from "../../../api";
import StarRating from "./AddStarField";

function TakeSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [floorUnit, setFloorUnit] = useState("");
  const [feedbackDate, setFeedbackDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [feedbackGivenBy, setFeedbackGivenBy] = useState("");
  const [contactDetails, setContactDetails] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    getPublicSurvey(id)
      .then((res) => setSurvey(res.data))
      .catch((err) => {
        setError(err.response?.data?.error || "Survey not found or not available.");
        setSurvey(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const questions = survey?.survey_questions || [];
  const total = questions.length;
  const answeredCount = questions.filter((q) => {
    const v = answers[q.id];
    if (q.question_type === "multiple_choice") return Array.isArray(v) && v.length > 0;
    return v !== undefined && v !== null && v !== "";
  }).length;
  const percentage = total ? (answeredCount / total) * 100 : 0;

  const setAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const setMultiAnswer = (questionId, optionLabel, checked) => {
    setAnswers((prev) => {
      const arr = prev[questionId] || [];
      const next = checked ? [...arr, optionLabel] : arr.filter((x) => x !== optionLabel);
      return { ...prev, [questionId]: next };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id || !survey) return;
    setError(null);
    setSubmitting(true);
    try {
      const survey_answers_attributes = questions.map((q) => {
        const v = answers[q.id];
        const attrs = { survey_question_id: q.id };
        if (q.question_type === "text") {
          attrs.text_value = typeof v === "string" ? v : "";
        } else if (q.question_type === "rating" || q.question_type === "scale") {
          attrs.numeric_value = v != null ? Number(v) : null;
        } else if ((q.question_type === "single_choice" || q.question_type === "multiple_choice") && q.options?.length) {
          const optionIds = q.options
            .filter((o) => (Array.isArray(v) ? v.includes(o.label) : v === o.label))
            .map((o) => o.id);
          attrs.selected_option_ids = optionIds;
        } else {
          attrs.text_value = v != null ? String(v) : "";
        }
        return attrs;
      });
      await createPublicSurveyResponse(id, {
        survey_response: {
          user_id: null,
          survey_answers_attributes,
        },
      });
      navigate(`/survey/${id}/thank-you`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(" ") : "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestionInput = (q) => {
    const opts = q.options || [];
    const value = answers[q.id];

    switch (q.question_type) {
      case "single_choice":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {opts.map((opt) => (
              <label
                key={opt.id || opt.label}
                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                  value === opt.label ? "bg-violet-50 border-violet-500 border-2" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value={opt.label}
                  checked={value === opt.label}
                  onChange={() => setAnswer(q.id, opt.label)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${value === opt.label ? "border-violet-600" : "border-gray-400"}`}>
                  {value === opt.label && <div className="w-2.5 h-2.5 bg-violet-600 rounded-full" />}
                </div>
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );
      case "multiple_choice":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {opts.map((opt) => {
              const arr = Array.isArray(value) ? value : [];
              const checked = arr.includes(opt.label);
              return (
                <label
                  key={opt.id || opt.label}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                    checked ? "bg-violet-50 border-violet-500 border-2" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setMultiAnswer(q.id, opt.label, e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${checked ? "border-violet-600 bg-violet-600" : "border-gray-400"}`}>
                    {checked && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span>{opt.label}</span>
                </label>
              );
            })}
          </div>
        );
      case "rating":
      case "scale": {
        const scale = q.question_type === "rating" ? 5 : Math.max(1, Math.min(5, ((q.max_value ?? 10) - (q.min_value ?? 0) + 1)));
        return (
          <div className="flex flex-col gap-1.5">
            <StarRating
              rating={value || 0}
              onRatingChange={(val) => setAnswer(q.id, val)}
              scale={scale}
              color="#7C3AED"
            />
            {scale === 5 && (
              <div className="flex justify-between text-xs text-gray-500 w-[140px]">
                <span>Poor</span>
                <span>Fair</span>
                <span>Average</span>
                <span>Good</span>
                <span>Excellent</span>
              </div>
            )}
          </div>
        );
      }
      case "text":
      default:
        return (
          <textarea
            className="w-full min-w-[180px] max-w-md px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 placeholder:text-gray-400"
            placeholder="Share your thoughts..."
            value={value ?? ""}
            onChange={(e) => setAnswer(q.id, e.target.value)}
            rows={2}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <p className="text-gray-600">Loading survey…</p>
      </div>
    );
  }
  if (!id || error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-md text-center">
          <p className="text-gray-700">{error || "Survey not found."}</p>
          <p className="text-sm text-gray-500 mt-2">The link may be invalid or the survey may no longer be available.</p>
        </div>
      </div>
    );
  }
  if (!survey) {
    return null;
  }

  const accentColor = survey?.background_color || "#7C3AED";
  const defaultFieldsCount = 5;
  const totalWithDefaults = total + defaultFieldsCount;
  const defaultFieldsFilled = [
    !!companyName.trim(),
    !!floorUnit.trim(),
    !!feedbackDate,
    !!feedbackGivenBy.trim(),
    !!contactDetails.trim(),
  ].filter(Boolean).length;
  const progressCompleted = defaultFieldsFilled + answeredCount;
  const progressTotal = totalWithDefaults;
  const progressPct = progressTotal ? (progressCompleted / progressTotal) * 100 : 0;

  const getQuestionIcon = (q) => {
    if (q.question_type === "text") return FiFileText;
    if (q.question_type === "rating" || q.question_type === "scale") return FiShield;
    return FiHome;
  };

  const getQuestionCategory = (q) => {
    if (q.question_type === "rating" || q.question_type === "scale") return "RATING";
    if (q.question_type === "text") return "FEEDBACK";
    return "DETAILS";
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Purple header banner */}
        <div
          className="rounded-2xl px-8 py-10 text-center text-white shadow-sm overflow-hidden relative"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, #a855f7)`,
          }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold">
            {survey.survey_title}
          </h1>
          {survey.description && (
            <p className="mt-1.5 text-sm sm:text-base text-violet-100">
              {survey.description}
            </p>
          )}
        </div>

        {/* Progress bar card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="text-base font-medium text-gray-800">Your Progress</span>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium" style={{ color: accentColor }}>
              {progressCompleted} of {progressTotal} completed
            </span>
            <div className="w-24 sm:w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPct}%`, backgroundColor: accentColor }}
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Default client details card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <FiFileText className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Client details</span>
                <p className="text-base font-medium text-gray-800 mt-0.5">Contact & Feedback Information</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Company name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Enter company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Floor / Unit</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Enter floor or unit"
                  value={floorUnit}
                  onChange={(e) => setFloorUnit(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Feedback date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  value={feedbackDate}
                  onChange={(e) => setFeedbackDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Feedback given by (name)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Enter name"
                  value={feedbackGivenBy}
                  onChange={(e) => setFeedbackGivenBy(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Contact details</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Phone / email"
                  value={contactDetails}
                  onChange={(e) => setContactDetails(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Question cards */}
          {questions.map((q, idx) => {
            const Icon = getQuestionIcon(q);
            const category = getQuestionCategory(q);
            return (
              <div
                key={q.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{category}</span>
                  <h3 className="text-base font-medium text-gray-800 mt-0.5">
                    {q.q_title}
                    {q.required && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                </div>
                <div className="w-full sm:min-w-[200px] sm:max-w-sm flex-shrink-0">
                  {renderQuestionInput(q)}
                </div>
              </div>
            );
          })}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              style={{ backgroundColor: accentColor }}
            >
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TakeSurvey;
