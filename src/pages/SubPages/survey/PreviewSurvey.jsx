import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSurvey } from "../../../api";
import toast from "react-hot-toast";
import { domainPrefix } from "../../../api";
import { FaStar } from "react-icons/fa";
import {
  FiShield,
  FiFileText,
} from "react-icons/fi";

/* ⭐ Star Rating */
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
        >
          <FaStar
            size={26}
            className={`${n <= (hovered || rating)
              ? "text-yellow-400"
              : "text-gray-300"
              }`}
          />
        </button>
      ))}
    </div>
  );
}

/* 🎨 Icon styles */
const ICON_PALETTE = [
  { bg: "bg-purple-100", text: "text-purple-600" },
  { bg: "bg-blue-100", text: "text-blue-600" },
  { bg: "bg-emerald-100", text: "text-emerald-600" },
];

const getIconStyle = (idx) => {
  const style = ICON_PALETTE[idx % ICON_PALETTE.length];
  return {
    Icon: FiShield,
    ...style,
  };
};

function PreviewSurvey() {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSurvey(id)
      .then((res) => setSurvey(res.data))
      .catch(() => setSurvey(null))
      .finally(() => setLoading(false));
  }, [id]);

  const questions = survey?.survey_questions || [];

  const setAnswer = (qid, val) =>
    setAnswers((p) => ({ ...p, [qid]: val }));

  const setMultiAnswer = (qid, label, checked) => {
    setAnswers((p) => {
      const arr = p[qid] || [];
      return {
        ...p,
        [qid]: checked
          ? [...arr, label]
          : arr.filter((x) => x !== label),
      };
    });
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
                key={opt.id}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer ${value === opt.label
                  ? "bg-violet-50 border-violet-400"
                  : "border-gray-200"
                  }`}
              >
                <input
                  type="radio"
                  className="hidden"
                  checked={value === opt.label}
                  onChange={() => setAnswer(q.id, opt.label)}
                />
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
                  key={opt.id}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer ${checked
                    ? "bg-violet-50 border-violet-400"
                    : "border-gray-200"
                    }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={checked}
                    onChange={(e) =>
                      setMultiAnswer(
                        q.id,
                        opt.label,
                        e.target.checked
                      )
                    }
                  />
                  <span>{opt.label}</span>
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
          />
        );

      case "text":
      default:
        return (
          <textarea
            className="w-full px-4 py-3 border rounded-xl"
            placeholder="Write your answer..."
            value={value || ""}
            onChange={(e) =>
              setAnswer(q.id, e.target.value)
            }
          />
        );
    }
  };

  const handleSubmit = () => {
    toast.success("Preview mode only 🚀");
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        Loading...
      </div>
    );
  }

  if (!survey) {
    return <div>Survey not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">




      <div
        style={{ backgroundColor: survey?.theme_color || "#f97316" }}
        className="text-white p-6 rounded-xl"
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 z-0" />
        <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-white/10 z-0" />
        <div className="absolute top-6 right-12 w-16 h-16 rounded-full bg-white/5 z-0" />

        <div className="relative z-10 w-full px-4 sm:px-16">

          <div className="grid grid-cols-3 items-center">

            {/* LEFT: LOGO */}
            <div className="flex justify-start">
              {survey.client_logo && (
                <img
                  src={
                    survey.client_logo?.startsWith("http")
                      ? survey.client_logo
                      : `${domainPrefix}${survey.client_logo}`
                  }
                  alt="Logo"
                  className="h-12 sm:h-14 object-contain"
                />
              )}
            </div>

            {/* CENTER: TITLE */}
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold">
                {survey.survey_title}
              </h1>
            </div>

            {/* RIGHT: DATES */}
            <div className="flex justify-end text-right text-sm text-white/90">

            </div>

          </div>

          

          {/* DESCRIPTION */}
          {survey.description && (
            <p className="mt-6 text-sm sm:text-base text-white/90">
              {survey.description}
            </p>
          )}

        </div>

       
      </div>
      

          
        {survey?.background_image && (
          <div className="w-full mt-4">
            <img
              src={
                survey.background_image.startsWith("http")
                  ? survey.background_image
                  : domainPrefix + survey.background_image
              }
              alt="Banner"
              className="w-full h-[220px] sm:h-[300px] object-cover rounded-xl"
            />
          </div>
        )}
        

      {/* 🔥 CLIENT DETAILS */}
      <div className="bg-white rounded-2xl p-5 border shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <FiFileText />
          <h2 className="font-semibold">
            Client Details (Preview)
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Company name" className="border p-2 rounded" />
          <input placeholder="Floor / Unit" className="border p-2 rounded" />
          <input type="date" className="border p-2 rounded" />
          <input placeholder="Name" className="border p-2 rounded" />
          <input placeholder="Email" className="border p-2 rounded" />
          <input placeholder="Contact" className="border p-2 rounded" />
        </div>
      </div>

      {/* 🔥 QUESTIONS SAME DESIGN */}
      {questions.map((q, idx) => {
        const { Icon, bg, text } = getIconStyle(idx);

        return (
          <div
            key={q.id}
            className="bg-white rounded-2xl p-5 border shadow-sm"
          >
            <div className="flex gap-3">
              <div
                className={`w-10 h-10 ${bg} flex items-center justify-center rounded`}
              >
                <Icon className={text} />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold">
                  {q.q_title}
                </h3>

                <div className="mt-3">
                  {renderQuestionInput(q)}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* 🔥 SUBMIT */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          style={{ backgroundColor: survey?.background_color || "#f97316" }}
          className="text-white px-4 py-2 rounded"
        >
          Submit (Preview)
        </button>
      </div>
    </div>
  );
}

export default PreviewSurvey;