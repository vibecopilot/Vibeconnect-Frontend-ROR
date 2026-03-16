import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  return (
    <StarRating
      rating={value || 0}
      onRatingChange={(val) => setAnswer(q.id, val)}
      scale={5}
    />
  );

case "scale": {
  const min = q.min_value ?? 0;
  const max = q.max_value ?? 10;
  const range = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="flex flex-wrap gap-2">
      {range.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => setAnswer(q.id, n)}
          className={`min-w-[2.5rem] px-3 py-2 rounded-lg border font-medium transition-colors ${
            value === n
              ? "bg-violet-600 text-white border-violet-600"
              : "bg-white text-gray-700 border-gray-300 hover:border-violet-400"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
      case "text":
      default:
        return (
          <textarea
            className="w-full max-w-xl px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            placeholder="Type your answer..."
            value={value ?? ""}
            onChange={(e) => setAnswer(q.id, e.target.value)}
            rows={3}
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900">{survey.survey_title}</h1>
            {survey.description && <p className="mt-2 text-gray-600">{survey.description}</p>}
          </div>
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            {/* Default client details section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Company name
                </label>
                <input
                  type="text"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  placeholder="Enter company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Floor / Unit
                </label>
                <input
                  type="text"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  placeholder="Enter floor or unit"
                  value={floorUnit}
                  onChange={(e) => setFloorUnit(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Feedback date
                </label>
                <input
                  type="date"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  value={feedbackDate}
                  onChange={(e) => setFeedbackDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Feedback given by (name)
                </label>
                <input
                  type="text"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  placeholder="Enter name"
                  value={feedbackGivenBy}
                  onChange={(e) => setFeedbackGivenBy(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Contact details
                </label>
                <input
                  type="text"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  placeholder="Phone / email"
                  value={contactDetails}
                  onChange={(e) => setContactDetails(e.target.value)}
                />
              </div>
            </div>

            {questions.map((q, idx) => (
              <div key={q.id}>
                <h2 className="text-lg font-medium text-gray-900 mb-3">
                  {idx + 1}. {q.q_title}
                  {q.required && <span className="text-red-500 ml-1">*</span>}
                </h2>
                <div className="mt-2">{renderQuestionInput(q)}</div>
              </div>
            ))}
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="pt-4 flex flex-col items-center gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto min-w-[200px] bg-violet-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "Submitting…" : "Submit"}
              </button>
              <div className="w-full max-w-xs">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>{answeredCount} of {total} answered</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 transition-all duration-300" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TakeSurvey;
