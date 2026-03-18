import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import { FaChartBar } from "react-icons/fa";
import { MdMenuOpen } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { getSurvey, createSurveyResponse } from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import toast from "react-hot-toast";

function PreviewSurvey() {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [openQuestion, setOpenQuestion] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    getSurvey(id)
      .then((res) => setSurvey(res.data))
      .catch(() => setSurvey(null))
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

  const toggleQuestion = (qId) => {
    setOpenQuestion((prev) => (prev === qId ? null : qId));
  };

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

  const handleSubmit = async () => {
    if (!id || !survey) return;
    setSubmitting(true);
    try {
      const user = getItemInLocalStorage("USER");
      const userId = user?.id ?? user?.user_id ?? null;
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
      await createSurveyResponse(id, {
        survey_response: {
          user_id: userId,
          survey_answers_attributes,
        },
      });
      toast.success("Response submitted.");
      setAnswers({});
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit response.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestionInput = (q, index) => {
    const opts = q.options || [];
    const value = answers[q.id];

    switch (q.question_type) {
      case "single_choice":
        return (
          <div className="grid grid-cols-2 gap-2">
            {opts.map((opt) => (
              <label
                key={opt.id || opt.label}
                className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer ${value === opt.label ? "bg-gray-100 border-2 border-gray-500" : "border-transparent"
                  }`}
              >
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value={opt.label}
                  checked={value === opt.label}
                  onChange={() => setAnswer(q.id, opt.label)}
                  className="hidden"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${value === opt.label ? "border-gray-700" : "border-gray-400"
                    }`}
                >
                  {value === opt.label && <div className="w-2.5 h-2.5 bg-gray-700 rounded-full" />}
                </div>
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );
      case "multiple_choice":
        return (
          <div className="grid grid-cols-2 gap-2">
            {opts.map((opt) => {
              const arr = Array.isArray(value) ? value : [];
              const checked = arr.includes(opt.label);
              return (
                <label
                  key={opt.id || opt.label}
                  className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer ${checked ? "bg-gray-100 border-2 border-gray-500" : "border-transparent"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setMultiAnswer(q.id, opt.label, e.target.checked)}
                    className="hidden"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${checked ? "border-gray-700 bg-gray-700" : "border-gray-400"
                      }`}
                  >
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
        const scale = q.scale || 5;
        const color = q.color || "#FACC15"; // yellow

        return (
          <div className="flex flex-col gap-2">

            {/* Stars */}
            <div className="flex gap-2 text-4xl">
              {Array.from({ length: scale }, (_, i) => {
                const n = i + 1;
                const isSelected = value >= n;

                return (
                  <span
                    key={n}
                    onClick={() => setAnswer(q.id, n)}
                    className="cursor-pointer transition-transform hover:scale-110"
                    style={{
                      color: isSelected ? color : "#D1D5DB" // gray if not selected
                    }}
                  >
                    ★
                  </span>
                );
              })}
            </div>

            {/* Labels */}
            <div className="flex justify-between text-xs text-gray-500 w-[220px]">
              <span>Poor</span>
              <span>Fair</span>
              <span>Average</span>
              <span>Good</span>
              <span>Excellent</span>
            </div>

          </div>
        );
      }
      case "text":
      default: {
        return (
          <textarea
            className="w-full max-w-lg px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Type your answer..."
            value={value ?? ""}
            onChange={(e) => setAnswer(q.id, e.target.value)}
            rows={3}
          />
        );
      }
    }
  };

  if (loading) {
    return (
      <section className="flex">
        <Navbar />
        <div className="w-full flex items-center justify-center min-h-[200px]">Loading…</div>
      </section>
    );
  }
  if (!id) {
    return (
      <section className="flex">
        <Navbar />
        <div className="w-full flex mx-3 flex-col overflow-hidden my-5 p-5">
          <p>No survey selected. Open a survey from the list or details page.</p>
        </div>
      </section>
    );
  }
  if (!survey) {
    return (
      <section className="flex">
        <Navbar />
        <div className="w-full flex mx-3 flex-col overflow-hidden my-5 p-5">
          <p>Survey not found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden my-5">
        <div className="flex justify-center mt-5">
          <div className="w-full max-w-3xl space-y-8 relative">
            {/* Progress Indicator & Analyze Survey */}
            <div className="absolute top-4 right-6 flex items-center gap-3">
              <div className="bg-white border rounded-lg shadow px-4 py-2 flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">
                  {answeredCount}/{total} Answered
                </span>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
              <Link
                to={`/admin/result-analyze-result?survey_id=${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow"
              >
                <FaChartBar />
                Analyze Survey
              </Link>
            </div>
            <h2 className="text-2xl text-green-600">{survey.survey_title}</h2>
            {survey.description && (
              <p className="text-gray-600">{survey.description}</p>
            )}

            {/* Default client details preview */}
            <div className="mt-4 bg-white rounded-xl border border-gray-200 p-5 max-w-3xl space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-500">
                    Company name
                  </span>
                  <div className="mt-1 h-9 rounded-md border border-gray-300 bg-gray-50" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-500">
                    Floor / Unit
                  </span>
                  <div className="mt-1 h-9 rounded-md border border-gray-300 bg-gray-50" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-500">
                    Feedback date
                  </span>
                  <div className="mt-1 h-9 rounded-md border border-gray-300 bg-gray-50 flex items-center px-3 text-xs text-gray-500">
                    {new Date().toISOString().split("T")[0]}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-500">
                    Feedback given by (name)
                  </span>
                  <div className="mt-1 h-9 rounded-md border border-gray-300 bg-gray-50" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-500">
                  Contact details
                </span>
                <div className="mt-1 h-9 rounded-md border border-gray-300 bg-gray-50" />
              </div>
            </div>

            {questions.map((q, idx) => (
              <div key={q.id}>
                <h2 className="text-lg text-gray-900">
                  {idx + 1}. {q.q_title}
                </h2>
                <div className="mt-3">{renderQuestionInput(q, idx)}</div>
              </div>
            ))}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {submitting ? "Submitting…" : "Submit response"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PreviewSurvey;
