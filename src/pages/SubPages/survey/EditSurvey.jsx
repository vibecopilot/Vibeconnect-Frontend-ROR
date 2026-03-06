import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { BsPlusCircle } from "react-icons/bs";
import Navbar from "../../../components/Navbar";
import toast from "react-hot-toast";
import { getSurvey, updateSurvey } from "../../../api";

const BACKEND_TYPES = ["text", "single_choice", "multiple_choice", "rating", "scale", "true_false"];

function EditSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const themeColor = useSelector((state) => state.theme.color);
  const [loading, setLoading] = useState(!!id);
  const [surveyTitle, setSurveyTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    getSurvey(id)
      .then((res) => {
        const s = res.data;
        setSurveyTitle(s.survey_title || "");
        setDescription(s.description || "");
        setStartDate(s.start_date ? new Date(s.start_date).toISOString().split("T")[0] : "");
        setEndDate(s.end_date ? new Date(s.end_date).toISOString().split("T")[0] : "");
        const qs = (s.survey_questions || []).map((q) => ({
          _id: q.id,
          q_title: q.q_title || "",
          question_type: q.question_type || "text",
          required: q.required || false,
          min_value: q.min_value,
          max_value: q.max_value,
          options: (q.options || []).map((o) => ({ _id: o.id, label: o.label || "" })),
        }));
        setQuestions(qs);
      })
      .catch(() => toast.error("Failed to load survey"))
      .finally(() => setLoading(false));
  }, [id]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { _id: null, q_title: "", question_type: "text", required: false, min_value: null, max_value: null, options: [] },
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, field, value) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addOption = (qIndex) => {
    setQuestions((prev) => {
      const next = [...prev];
      const q = next[qIndex];
      next[qIndex] = { ...q, options: [...(q.options || []), { _id: null, label: "" }] };
      return next;
    });
  };

  const removeOption = (qIndex, oIndex) => {
    setQuestions((prev) => {
      const next = [...prev];
      const opts = (next[qIndex].options || []).filter((_, i) => i !== oIndex);
      next[qIndex] = { ...next[qIndex], options: opts };
      return next;
    });
  };

  const updateOption = (qIndex, oIndex, label) => {
    setQuestions((prev) => {
      const next = [...prev];
      const opts = [...(next[qIndex].options || [])];
      opts[oIndex] = { ...opts[oIndex], label };
      next[qIndex] = { ...next[qIndex], options: opts };
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!surveyTitle.trim()) {
      toast.error("Please enter a survey title.");
      return;
    }
    setSubmitting(true);
    try {
      const survey_questions = questions.map((q, i) => {
        const base = {
          position: i + 1,
          q_title: q.q_title?.trim() || "",
          question_type: q.question_type,
          required: q.required,
          min_value: q.min_value ?? (q.question_type === "scale" ? 0 : null),
          max_value: q.max_value ?? (q.question_type === "scale" ? 10 : null),
        };
        if (q._id) base.id = q._id;
        const opts = (q.options || []).filter((o) => o.label?.trim()).map((o, j) => {
          const opt = { label: o.label.trim(), position: j + 1 };
          if (o._id) opt.id = o._id;
          return opt;
        });
        if (opts.length) base.options = opts;
        return base;
      }).filter((q) => q.q_title);

      await updateSurvey(id, {
        survey: {
          survey_title: surveyTitle.trim(),
          description: description.trim() || null,
          start_date: startDate || null,
          end_date: endDate || null,
          survey_questions,
        },
      });
      toast.success("Survey updated.");
      navigate(`/admin/survey-details/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update survey.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Navbar />
        <div className="w-full flex items-center justify-center min-h-[200px]">Loading…</div>
      </div>
    );
  }

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
          Edit Survey
        </h2>
        <div className="flex justify-center">
          <div className="sm:border border-gray-400 p-1 md:px-10 rounded-lg w-4/5 mb-14">
            <form onSubmit={handleSubmit}>
              <div className="md:grid grid-cols-3 gap-5 my-3">
                <div className="flex flex-col">
                  <label className="font-semibold my-2">Survey Title</label>
                  <input
                    type="text"
                    placeholder="Enter Survey Title"
                    className="border p-1 px-4 border-gray-500 rounded-md"
                    value={surveyTitle}
                    onChange={(e) => setSurveyTitle(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold my-2">Start Date</label>
                  <input
                    type="date"
                    className="border p-1 px-4 border-gray-500 rounded-md"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold my-2">End Date</label>
                  <input
                    type="date"
                    className="border p-1 px-4 border-gray-500 rounded-md"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="flex flex-col col-span-3">
                  <label className="font-semibold my-2">Description</label>
                  <textarea
                    placeholder="Enter Survey Description"
                    className="border p-1 px-4 border-gray-500 rounded-md"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="my-5">
                <h2 className="border-b border-gray-500 text-gray-950 text-xl">Questions</h2>
                {questions.map((q, qIndex) => (
                  <div key={qIndex} className="md:grid grid-cols-3 gap-5 my-3 border p-5 rounded-md">
                    <div className="flex flex-col col-span-2">
                      <label className="font-semibold my-2">Question text</label>
                      <input
                        type="text"
                        placeholder="Enter question"
                        className="border p-1 px-4 border-gray-500 rounded-md"
                        value={q.q_title}
                        onChange={(e) => updateQuestion(qIndex, "q_title", e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-semibold my-2">Type</label>
                      <select
                        className="border p-1 px-4 border-gray-500 rounded-md"
                        value={q.question_type}
                        onChange={(e) => updateQuestion(qIndex, "question_type", e.target.value)}
                      >
                        {BACKEND_TYPES.map((t) => (
                          <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
                        ))}
                      </select>
                    </div>
                    {(q.question_type === "single_choice" || q.question_type === "multiple_choice") && (
                      <div className="flex flex-col col-span-3 mt-2">
                        <label className="font-semibold my-2">Options</label>
                        {(q.options || []).map((opt, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              className="border p-1 px-4 border-gray-500 rounded-md flex-1"
                              placeholder={`Option ${oIndex + 1}`}
                              value={opt.label}
                              onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() => removeOption(qIndex, oIndex)}
                              className="text-red-500 p-1"
                            >
                              <FaTrash size={18} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addOption(qIndex)}
                          className="border border-gray-500 text-black px-4 py-1 rounded-md mt-2"
                        >
                          <BsPlusCircle /> Add option
                        </button>
                      </div>
                    )}
                    <div className="col-span-3 flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-red-500 font-semibold border rounded-md p-1 px-4"
                      >
                        Remove question
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
                    Add question
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 text-white rounded-md disabled:opacity-50"
                    style={{ background: themeColor }}
                  >
                    {submitting ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditSurvey;
