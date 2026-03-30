import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiShield,
  FiFileText,
  FiHome,
  FiDroplet,
  FiTool,
  FiHeart,
  FiMessageSquare,
  FiStar,
  FiClipboard,
  FiUsers,
  FiSettings,
  FiCheckCircle,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import {
  getPublicSurvey,
  createPublicSurveyResponse,
  domainPrefix,
} from "../../../api";

/* ── Star-rating widget ── */
function StarRatingInput({ rating = 0, onRatingChange, scale = 5 }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: scale }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onRatingChange(n)}
          className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
        >
          <FaStar
            size={26}
            className={`transition-colors ${n <= (hovered || rating) ? "text-yellow-400" : "text-gray-300"}`}
          />
        </button>
      ))}
    </div>
  );
}

/* ── Icon + colour palette per question index ── */
const ICON_PALETTE = [
  { bg: "bg-purple-100", text: "text-purple-600" },
  { bg: "bg-blue-100", text: "text-blue-600" },
  { bg: "bg-emerald-100", text: "text-emerald-600" },
  { bg: "bg-cyan-100", text: "text-cyan-600" },
  { bg: "bg-orange-100", text: "text-orange-600" },
  { bg: "bg-amber-100", text: "text-amber-600" },
  { bg: "bg-slate-100", text: "text-slate-600" },
  { bg: "bg-rose-100", text: "text-rose-600" },
  { bg: "bg-indigo-100", text: "text-indigo-600" },
  { bg: "bg-teal-100", text: "text-teal-600" },
  { bg: "bg-lime-100", text: "text-lime-600" },
  { bg: "bg-pink-100", text: "text-pink-600" },
];
const getIconStyle = (idx) => {
  const style = ICON_PALETTE[idx % ICON_PALETTE.length];
  return {
    Icon: FiShield, // ALWAYS SAME ICON
    ...style,
  };
};

/* ── Category label from question title keywords ── */
const CATEGORY_KEYWORDS = [
  {
    keywords: ["security", "guard", "cctv", "surveillance"],
    label: "SECURITY",
  },
  {
    keywords: [
      "facility",
      "facilities",
      "lobby",
      "atrium",
      "building",
      "elevator",
      "lift",
      "parking",
    ],
    label: "FACILITIES",
  },
  {
    keywords: ["hygiene", "clean", "housekeep", "washroom", "sanit", "janitor"],
    label: "HYGIENE",
  },
  {
    keywords: ["staff", "courtesy", "professionalism", "employee", "personnel"],
    label: "STAFF",
  },
  {
    keywords: ["service", "reception", "front desk", "concierge", "helpdesk"],
    label: "SERVICES",
  },
  {
    keywords: [
      "plumb",
      "electric",
      "hvac",
      "air condition",
      "maintenance",
      "repair",
    ],
    label: "MAINTENANCE",
  },
  {
    keywords: [
      "comment",
      "suggestion",
      "feedback",
      "additional",
      "general",
      "other",
    ],
    label: "GENERAL",
  },
];
const getCategoryFromTitle = (title) => {
  const lower = (title || "").toLowerCase();
  for (const { keywords, label } of CATEGORY_KEYWORDS) {
    if (keywords.some((kw) => lower.includes(kw))) return label;
  }
  return "DETAILS";
};
const getQuestionCategory = (q) => {
  const fromTitle = getCategoryFromTitle(q.q_title);
  if (fromTitle !== "DETAILS") return fromTitle;
  if (q.question_type === "rating" || q.question_type === "scale")
    return "RATING";
  if (q.question_type === "text") return "FEEDBACK";
  return "DETAILS";
};

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
    () => new Date().toISOString().split("T")[0],
  );
  const [feedbackGivenBy, setFeedbackGivenBy] = useState("");
  const [contactDetails, setContactDetails] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setFeedbackDate(new Date().toISOString().split("T")[0]); //force today's date as default on load
    if (!id) {
      setLoading(false);
      return;
    }

    getPublicSurvey(id)
      .then((res) => {
        console.log("SURVEY RESPONSE:", res.data); // 👈 DEBUG HERE
        setSurvey(res.data);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Survey not found.");
        setSurvey(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const questions = survey?.survey_questions || [];
  const total = questions.length;
  const answeredCount = questions.filter((q) => {
    const v = answers[q.id];
    if (q.question_type === "multiple_choice")
      return Array.isArray(v) && v.length > 0;
    return v !== undefined && v !== null && v !== "";
  }).length;

  const setAnswer = (qid, val) => setAnswers((p) => ({ ...p, [qid]: val }));
  const setMultiAnswer = (qid, label, checked) => {
    setAnswers((p) => {
      const arr = p[qid] || [];
      return {
        ...p,
        [qid]: checked ? [...arr, label] : arr.filter((x) => x !== label),
      };
    });
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required.");
      setSubmitting(false);
      return;
    }
    if (!id || !survey) return;
    setError(null);
    setSubmitting(true);
    try {
      const survey_answers_attributes = questions.map((q) => {
        const v = answers[q.id];
        const attrs = { survey_question_id: q.id };
        if (q.question_type === "text") {
          attrs.text_value = typeof v === "string" ? v : "";
        } else if (
          q.question_type === "rating" ||
          q.question_type === "scale"
        ) {
          attrs.numeric_value = v != null ? Number(v) : null;
        } else if (
          (q.question_type === "single_choice" ||
            q.question_type === "multiple_choice") &&
          q.options?.length
        ) {
          const optionIds = q.options
            .filter((o) =>
              Array.isArray(v) ? v.includes(o.label) : v === o.label,
            )
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
          company_name: companyName.trim(),
          floor_unit: floorUnit.trim(),
          feedback_date: feedbackDate || null,
          feedback_given_by: feedbackGivenBy.trim(),
          contact_details: contactDetails.trim(),
          email: email.trim(), // ✅ ADD THIS LINE
          survey_answers_attributes,
        },
      });
      navigate(`/survey/${id}/thank-you`, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(" ")
          : "Failed to submit. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Render question input ── */
  const renderQuestionInput = (q) => {
    const opts = q.options || [];
    const value = answers[q.id];

    switch (q.question_type) {
      case "single_choice":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            {opts.map((opt) => (
              <label
                key={opt.id || opt.label}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                  value === opt.label
                    ? "bg-violet-50 border-violet-400 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
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
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${value === opt.label ? "border-violet-600" : "border-gray-400"}`}
                >
                  {value === opt.label && (
                    <div className="w-2.5 h-2.5 bg-violet-600 rounded-full" />
                  )}
                </div>
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case "multiple_choice":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            {opts.map((opt) => {
              const arr = Array.isArray(value) ? value : [];
              const checked = arr.includes(opt.label);
              return (
                <label
                  key={opt.id || opt.label}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                    checked
                      ? "bg-violet-50 border-violet-400 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) =>
                      setMultiAnswer(q.id, opt.label, e.target.checked)
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${checked ? "border-violet-600 bg-violet-600" : "border-gray-400"}`}
                  >
                    {checked && (
                      <svg
                        className="w-3 h-3 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              );
            })}
          </div>
        );

      case "rating":
        return (
          <StarRatingInput
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
                className={`min-w-[2.5rem] px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
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
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 placeholder:text-gray-400 text-sm resize-none"
            placeholder="Share your thoughts..."
            value={value ?? ""}
            onChange={(e) => setAnswer(q.id, e.target.value)}
            rows={3}
          />
        );
    }
  };

  /* ── Loading / Error states ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading survey...</p>
        </div>
      </div>
    );
  }
  if (!id || error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-md text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiShield className="w-7 h-7 text-red-400" />
          </div>
          <p className="text-gray-700 font-medium">
            {error || "Survey not found."}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            The link may be invalid or the survey may no longer be available.
          </p>
        </div>
      </div>
    );
  }
  if (!survey) return null;
  const accentColor = "#DD3820";
  const defaultFieldsCount = 6;
  const totalWithDefaults = total + defaultFieldsCount;
  const defaultFieldsFilled = [
    !!companyName.trim(),
    !!floorUnit.trim(),
    !!feedbackDate,
    !!feedbackGivenBy.trim(),
    !!contactDetails.trim(),
    !!email.trim(), // ✅ ADD THIS LINE
  ].filter(Boolean).length;
  const progressCompleted = defaultFieldsFilled + answeredCount;
  const progressTotal = totalWithDefaults;
  const progressPct = progressTotal
    ? (progressCompleted / progressTotal) * 100
    : 0;
  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className="min-h-screen pb-10 bg-white"
      style={{
        background: survey.background_image
          ? `url(${domainPrefix + survey.background_image}) center/cover fixed no-repeat`
          : "linear-gradient(to bottom, #f3f4f6, #f9fafb)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-5">
        {survey?.background_image && (
          <div
            className="w-full h-40 rounded-xl overflow-hidden mb-4"
            style={{
              backgroundImage: `url(${survey.background_image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}

        {/* ── Header Banner ── */}
        <div
          style={{ backgroundColor: survey?.theme_color || "#f97316" }}
          className="text-white p-4 rounded-xl"
        >
          {/* Decorative circles */}
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 z-0 pointer-events-none" />
          <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-white/10 z-0 pointer-events-none" />
          <div className="absolute top-6 right-12 w-16 h-16 rounded-full bg-white/5 z-0 pointer-events-none" />

          <div className="relative z-10 w-full">
            <div className="w-full px-4 sm:px-16">
              {/* Logo pinned top-left */}
              {survey.client_logo && (
                <div className="flex justify-start mb-3">
                  <img
                    src={
                      survey.client_logo.startsWith("http")
                        ? survey.client_logo
                        : `${domainPrefix}${survey.client_logo}`
                    }
                    alt="Logo"
                    className="h-10 sm:h-14 max-w-[120px] sm:max-w-[160px] object-contain"
                  />
                </div>
              )}

              {/* Title – always centred */}
              <div className="text-center">
                <h1 className="text-2xl sm:text-4xl font-bold leading-tight break-words">
                  {survey.survey_title}
                </h1>
              </div>

              {/* Description */}
              {survey.description && (
                <p className="mt-4 sm:mt-6 text-base sm:text-xl text-white/90 leading-relaxed text-left">
                  {survey.description}
                </p>
              )}
            </div>
          </div>
        </div>
        {/* ── Progress Bar ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-800">
              Your Progress
            </span>
            <span
              className="text-sm font-semibold"
              style={{ color: accentColor }}
            >
              {progressCompleted} of {progressTotal} completed
            </span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500 ease-out rounded-full"
              style={{
                width: `${progressPct}%`,
                background: `linear-gradient(90deg, ${accentColor}, #a855f7)`,
              }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ── Client Details ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                <FiFileText className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600">
                  Client Details
                </span>
                <p className="text-sm font-semibold text-gray-800">
                  Contact & Feedback Information
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Company name
                </label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                  placeholder="Enter company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Floor / Unit
                </label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                  placeholder="Enter floor or unit"
                  value={floorUnit}
                  onChange={(e) => setFloorUnit(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Feedback date
                </label>

                <div className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-100 text-gray-700 text-sm">
                  {new Date().toLocaleDateString("en-GB")}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Feedback given by (name)
                </label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                  placeholder="Enter name"
                  value={feedbackGivenBy}
                  onChange={(e) => setFeedbackGivenBy(e.target.value)}
                />
              </div>

              {/* ✅ Email on left */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* ✅ Contact details on right */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Mobile Number
                </label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                  placeholder="Enter mobile number"
                  value={contactDetails}
                  onChange={(e) => setContactDetails(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ── Question Cards ── */}
          {questions.map((q, idx) => {
            const { Icon, bg, text } = getIconStyle(idx);
            const category = getQuestionCategory(q);
            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}
                  >
                    <Icon className={`w-5 h-5 ${text}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:justify-between gap-4">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 mt-0.5 leading-snug">
                      {q.q_title}
                      {q.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </h3>

                    {/* Attachment */}
                    {q.attachments && q.attachments.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {q.attachments.map((att) => {
                          const url = att.document_url
                            ? domainPrefix + att.document_url
                            : "";
                          const isImage =
                            /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
                          return isImage ? (
                            <img
                              key={att.id}
                              src={url}
                              alt="attachment"
                              className="max-h-32 sm:max-h-40 rounded-lg border object-cover"
                            />
                          ) : (
                            <a
                              key={att.id}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-violet-600 underline hover:text-violet-800"
                            >
                              View attachment
                            </a>
                          );
                        })}
                      </div>
                    )}

                    {/* Input: below title on mobile, inline on large */}

                    <div className="mt-3 sm:w-[280px]">
                      {renderQuestionInput(q)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* ── Submit Button ── */}
          <div className="pt-4 pb-2 flex justify-center">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2.5 px-10 py-3.5 rounded-xl text-white font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-[0.98]"
              style={{
                backgroundColor: survey?.theme_color || "#f97316",
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)"
              }}
            >
              <IoSend className="w-5 h-5" />
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>

        {/* ── Footer ── */}
        {(survey.footer_text || survey.footer_image) && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center space-y-3">
            {survey.footer_image && (
              <img
                src={domainPrefix + survey.footer_image}
                alt="Footer"
                className="max-h-16 mx-auto object-contain"
              />
            )}
            {survey.footer_text && (
              <p className="text-sm text-gray-500">{survey.footer_text}</p>
            )}
          </div>
        )}

        {/* Copyright */}
        <p className="text-center text-xs text-gray-400 pt-2 pb-6">
          Copyright &copy; 2023-{new Date().getFullYear()} Digielves Tech
          Wizards Private Limited. All rights reserved
        </p>
      </div>
    </div>
  );
}

export default TakeSurvey;
