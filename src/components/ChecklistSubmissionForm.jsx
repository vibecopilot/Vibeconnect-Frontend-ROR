import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  API_URL,
  createChecklistSubmission,
  getActivityDetails,
  getActivitySubmissions,
} from "../api";

// Attachfile#document_url is a signed absolute URL. Older rows may still be
// relative paths, so only prefix those.
const attachmentUrl = (document) => {
  if (!document) return "";
  if (/^(https?:\/\/|data:)/i.test(document)) return document;
  return `${API_URL}${document.startsWith("/") ? "" : "/"}${document}`;
};

const asArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.activities)) return value.activities;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

const errorMessage = (error) => {
  const data = error?.response?.data;
  if (typeof data === "string") return data;
  if (Array.isArray(data)) return data.join(", ");
  if (data?.errors) {
    if (typeof data.errors === "string") return data.errors;
    return Object.entries(data.errors)
      .map(([field, messages]) => {
        const list = Array.isArray(messages) ? messages : [messages];
        return `${field}: ${list.join(", ")}`;
      })
      .join("; ");
  }
  if (data && typeof data === "object") {
    const details = Object.entries(data)
      .filter(([, messages]) => Array.isArray(messages) || typeof messages === "string")
      .map(([field, messages]) => {
        const list = Array.isArray(messages) ? messages : [messages];
        return `${field}: ${list.join(", ")}`;
      });
    if (details.length) return details.join("; ");
  }
  return data?.error || data?.message || error?.message || "Something went wrong.";
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const answerOptions = (question) =>
  [1, 2, 3, 4]
    .map((position) => ({
      option: question[`option${position}`],
      valueType: question[`value_type${position}`],
    }))
    .filter((item) => item.option !== undefined && item.option !== null && item.option !== "");

const activityGroups = (activity) => {
  if (Array.isArray(activity?.groups) && activity.groups.length > 0) {
    return activity.groups;
  }
  return [
    {
      group_id: null,
      group: "",
      questions: Array.isArray(activity?.questions) ? activity.questions : [],
    },
  ];
};

/**
 * Checklist answer/submit form shared by the app-launched public page and the
 * admin routine-task page. The payload and validation match the public flow:
 * one Submission row per unanswered question via POST /submissions.json.
 *
 * @param {object}   props
 * @param {string}   props.activityId  activity (task) id
 * @param {node}     props.backLink    optional back link rendered above the form
 * @param {function} props.onSubmitted called after a successful submission
 * @param {function} props.onClose     optional close/done handler (used in a modal)
 */
const ChecklistSubmissionForm = ({
  activityId,
  backLink = null,
  onSubmitted,
  onClose,
}) => {
  const [activity, setActivity] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [values, setValues] = useState({});
  const [files, setFiles] = useState({});
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const applyAnswerRows = (rows) => {
    const prefilled = {};
    const prefilledComments = {};

    rows.forEach((row) => {
      if (row.question_id === undefined || row.question_id === null) return;
      const key = String(row.question_id);
      if (prefilled[key] === undefined) prefilled[key] = row.value ?? "";
      if (row.comment) prefilledComments[key] = row.comment;
    });

    setAnswers(rows);
    setValues(prefilled);
    setComments(prefilledComments);
  };

  useEffect(() => {
    let cancelled = false;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const [activityResponse, answersResponse] = await Promise.all([
          getActivityDetails(activityId),
          getActivitySubmissions(activityId),
        ]);

        if (cancelled) return;

        const activityData = activityResponse?.data ?? activityResponse;
        const answerRows = asArray(answersResponse?.data ?? answersResponse);

        setActivity(activityData);
        applyAnswerRows(answerRows);
      } catch (fetchError) {
        if (!cancelled) setError(errorMessage(fetchError));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (activityId) fetchDetail();
    return () => {
      cancelled = true;
    };
  }, [activityId]);

  const groups = useMemo(() => activityGroups(activity), [activity]);
  const questions = useMemo(
    () => groups.flatMap((group) => (Array.isArray(group.questions) ? group.questions : [])),
    [groups]
  );
  const answerByQuestion = useMemo(() => {
    const mapped = {};
    answers.forEach((row) => {
      if (row.question_id === undefined || row.question_id === null) return;
      const key = String(row.question_id);
      if (!mapped[key]) mapped[key] = row;
    });
    return mapped;
  }, [answers]);
  const answeredIds = useMemo(
    () => new Set(Object.keys(answerByQuestion)),
    [answerByQuestion]
  );
  const attachmentsByQuestion = useMemo(() => {
    const mapped = {};
    answers.forEach((row) => {
      if (row.question_id === undefined || row.question_id === null) return;
      const key = String(row.question_id);
      const documents = Array.isArray(row.question_attachments) ? row.question_attachments : [];
      if (documents.length > 0) {
        mapped[key] = [...(mapped[key] || []), ...documents];
      }
    });
    return mapped;
  }, [answers]);
  const alreadyAnswered =
    questions.length > 0 && questions.every((question) => answeredIds.has(String(question.id)));
  const isComplete =
    submitted ||
    String(activity?.status || "").toLowerCase() === "complete" ||
    alreadyAnswered;

  const setValue = (questionId, value) => {
    setValues((current) => ({ ...current, [String(questionId)]: value }));
  };

  const setQuestionComment = (questionId, value) => {
    setComments((current) => ({ ...current, [String(questionId)]: value }));
  };

  const handleFiles = (questionId, event) => {
    const selected = Array.from(event.target.files || []);
    if (selected.length === 0) return;

    const key = String(questionId);
    setFiles((current) => ({
      ...current,
      [key]: [...(current[key] || []), ...selected],
    }));
    event.target.value = "";
  };

  const removeFile = (questionId, fileIndex) => {
    const key = String(questionId);
    setFiles((current) => {
      const remaining = [...(current[key] || [])];
      remaining.splice(fileIndex, 1);
      return { ...current, [key]: remaining };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const pendingQuestions = questions.filter(
      (question) => !answeredIds.has(String(question.id))
    );
    const questionsArr = {};

    for (const [index, question] of pendingQuestions.entries()) {
      const key = String(question.id);
      const label = question.name || `Question ${index + 1}`;
      const answer = values[key];
      const selectedFiles = files[key] || [];
      const hasAnswer = answer !== undefined && answer !== null && String(answer).trim() !== "";

      if (!hasAnswer && question.question_mandatory) {
        const message = `Please answer: ${label}`;
        setError(message);
        toast.error(message);
        return;
      }
      if (question.image_mandatory && selectedFiles.length === 0) {
        const message = `Please add a photo for: ${label}`;
        setError(message);
        toast.error(message);
        return;
      }
      if (!hasAnswer && selectedFiles.length === 0) continue;

      questionsArr[String(index)] = {
        id: question.id,
        option: hasAnswer ? answer : "",
        comment: comments[key] || "",
        files: selectedFiles,
      };
    }

    if (Object.keys(questionsArr).length === 0) {
      const message = "No new answers to submit.";
      setError(message);
      toast.error(message);
      return;
    }

    const formData = new FormData();
    const appendSubmissionField = (field, value) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(`submission[${field}]`, value);
      }
    };

    appendSubmissionField("checklist_id", activity.checklist_id);
    appendSubmissionField("activity_id", activity.id);
    appendSubmissionField("asset_id", activity.asset_id);
    appendSubmissionField("soft_service_id", activity.soft_service_id);
    // The Rails user is resolved from the token server-side; never send a
    // mobile-app / Vibe user id as submission[user_id].
    // Only per-question comments are sent — a single overall comment would be
    // copied onto every question by the API and show on all of them.

    Object.entries(questionsArr).forEach(([index, answer]) => {
      formData.append(`questions_arr[${index}][id]`, answer.id);
      formData.append(`questions_arr[${index}][option]`, answer.option);
      formData.append(`questions_arr[${index}][comment]`, answer.comment);
      answer.files.forEach((file) => {
        formData.append(`questions_arr[${index}][attachfiles][]`, file);
      });
    });

    try {
      setSubmitting(true);
      await createChecklistSubmission(formData);

      // Reload the saved answers so comments and uploaded attachments can be
      // shown immediately in the read-only submitted summary below.
      try {
        const response = await getActivitySubmissions(activityId);
        applyAnswerRows(asArray(response?.data ?? response));
      } catch (refreshError) {
        console.error("Unable to refresh submissions:", refreshError);
      }

      setSubmitted(true);
      toast.success("Checklist submitted successfully");
      if (onSubmitted) onSubmitted({ activityId, activity });
    } catch (submitError) {
      const message = errorMessage(submitError);
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderSubmittedSummary = () => (
    <div className="rounded-xl border border-emerald-200 bg-white shadow-sm">
      <div className="border-b border-emerald-100 p-5 text-center">
        <p className="text-lg font-semibold text-emerald-700">Checklist submitted</p>
        <p className="mt-2 text-sm text-slate-600">
          {submitted
            ? "Your answers have been recorded."
            : "This checklist has already been completed."}
        </p>
        <div className="mt-5 flex items-center justify-center gap-4">
          {backLink}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Done
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        {groups.length === 0 && (
          <p className="text-center text-sm text-slate-500">No questions configured</p>
        )}
        {groups.map((group, groupIndex) => {
          const groupQuestions = Array.isArray(group.questions) ? group.questions : [];
          if (groupQuestions.length === 0) return null;
          const heading =
            group.group || (group.group_id ? `Group ${group.group_id}` : null);

          return (
            <section
              key={group.group_id ?? `summary-group-${groupIndex}`}
              className="rounded-lg border border-slate-100 p-3"
            >
              {heading && (
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  {heading}
                </h3>
              )}
              <div className="space-y-3">
                {groupQuestions.map((question, questionIndex) => {
                  const key = String(question.id);
                  const row = answerByQuestion[key];
                  const documents = attachmentsByQuestion[key] || [];

                  return (
                    <div key={key} className="rounded-lg bg-slate-50 p-3">
                      <p className="text-sm font-medium text-slate-800">
                        {question.name || `Question ${questionIndex + 1}`}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                        <p>
                          <span className="text-slate-500">Answer: </span>
                          <span className="font-semibold text-emerald-700">
                            {row?.value || "—"}
                          </span>
                        </p>
                        <p>
                          <span className="text-slate-500">Comment: </span>
                          <span className="font-medium text-slate-700">
                            {row?.comment || "—"}
                          </span>
                        </p>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">
                        Submitted by {row?.user_name || "—"} · {formatDateTime(row?.created_at)}
                      </p>
                      <div className="mt-3">
                        <p className="text-xs text-slate-500">Attachments</p>
                        {documents.length > 0 ? (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {documents.map((document, documentIndex) => (
                              <a
                                key={document.id ?? documentIndex}
                                href={attachmentUrl(document.document)}
                                target="_blank"
                                rel="noreferrer"
                                className="block"
                              >
                                <img
                                  src={attachmentUrl(document.document)}
                                  alt={`Attachment ${documentIndex + 1}`}
                                  className="h-20 w-20 rounded-lg border border-slate-200 object-cover hover:scale-105 transition"
                                />
                              </a>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-1 text-xs text-slate-400">No attachments</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (error && !activity) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
        <p className="text-base font-semibold text-red-700">Unable to load checklist</p>
        <p className="mt-2 text-sm text-slate-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-slate-800">
      {backLink && <div className="mb-5">{backLink}</div>}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          {activity?.checklist_name || "Checklist"}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {activity?.asset_name || activity?.soft_service_name || "Unassigned resource"}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
          <span>Due: {formatDateTime(activity?.start_time)}</span>
          {activity?.assigned_to_name && <span>Assigned: {activity.assigned_to_name}</span>}
          {(activity?.checklist_category || activity?.checklist_group) && (
            <span>Category: {activity.checklist_category || activity.checklist_group}</span>
          )}
          {activity?.checklist_frequency && (
            <span>Frequency: {activity.checklist_frequency}</span>
          )}
          {activity?.status && (
            <span className="capitalize">Status: {activity.status}</span>
          )}
        </div>
      </div>

      {isComplete ? (
        renderSubmittedSummary()
      ) : questions.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-base font-medium text-slate-700">No questions configured</p>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Close
            </button>
          )}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
        >
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {groups.map((group, groupIndex) => {
            const groupQuestions = Array.isArray(group.questions) ? group.questions : [];
            if (groupQuestions.length === 0) return null;
            const heading =
              group.group || (group.group_id ? `Group ${group.group_id}` : null);

            return (
              <section
                key={group.group_id ?? `group-${groupIndex}`}
                className="rounded-lg border border-slate-100 p-3"
              >
                {heading && (
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                    {heading}
                  </h3>
                )}

                <div className="space-y-5">
                  {groupQuestions.map((question, questionIndex) => {
                    const questionKey = String(question.id);
                    const answered = answeredIds.has(questionKey);
                    const answer = values[questionKey] ?? "";
                    const options = answerOptions(question);
                    const label = question.name || `Question ${questionIndex + 1}`;
                    const selectedFiles = files[questionKey] || [];
                    const existingDocuments = attachmentsByQuestion[questionKey] || [];

                    return (
                      <div key={questionKey} className={answered ? "opacity-70" : ""}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label
                            htmlFor={`question-${questionKey}`}
                            className="text-sm font-medium text-slate-800"
                          >
                            {label}
                            {question.question_mandatory && (
                              <span className="ml-1 text-red-500">*</span>
                            )}
                          </label>
                          {answered && (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                              Answered
                            </span>
                          )}
                        </div>

                        {question.help_text && (
                          <p className="mt-1 text-xs text-slate-500">{question.help_text}</p>
                        )}

                        {question.qtype === "multiple" ? (
                          <div className="mt-3 flex flex-wrap gap-3">
                            {options.map(({ option, valueType }) => (
                              <label
                                key={`${questionKey}-${option}`}
                                className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                              >
                                <input
                                  type="radio"
                                  name={`question-${questionKey}`}
                                  value={option}
                                  checked={answer === option}
                                  disabled={answered}
                                  required={Boolean(question.question_mandatory) && !answered}
                                  onChange={() => setValue(question.id, option)}
                                />
                                <span>{option}</span>
                                {valueType && (
                                  <span
                                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold text-white ${
                                      valueType === "P" ? "bg-emerald-500" : "bg-red-500"
                                    }`}
                                  >
                                    {valueType}
                                  </span>
                                )}
                              </label>
                            ))}
                          </div>
                        ) : question.qtype === "description" ? (
                          <textarea
                            id={`question-${questionKey}`}
                            rows={3}
                            value={answer}
                            disabled={answered}
                            required={Boolean(question.question_mandatory) && !answered}
                            onChange={(event) => setValue(question.id, event.target.value)}
                            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 disabled:bg-slate-50"
                          />
                        ) : (
                          <input
                            id={`question-${questionKey}`}
                            type={
                              ["numeric", "meter", "remaining_life"].includes(
                                question.field_type
                              )
                                ? "number"
                                : "text"
                            }
                            value={answer}
                            disabled={answered}
                            required={Boolean(question.question_mandatory) && !answered}
                            onChange={(event) => setValue(question.id, event.target.value)}
                            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 disabled:bg-slate-50"
                          />
                        )}

                        <div className="mt-3">
                          <p className="text-xs text-slate-500">
                            {question.image_mandatory
                              ? "Photo required *"
                              : "Photos (optional)"}
                          </p>

                          {!answered && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              <label className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-indigo-300">
                                Choose photo
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  className="hidden"
                                  onChange={(event) => handleFiles(question.id, event)}
                                />
                              </label>
                            </div>
                          )}

                          {selectedFiles.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {selectedFiles.map((file, fileIndex) => (
                                <span
                                  key={`${file.name}-${fileIndex}`}
                                  className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs text-indigo-700"
                                >
                                  {file.name}
                                  <button
                                    type="button"
                                    onClick={() => removeFile(question.id, fileIndex)}
                                    className="ml-1 font-semibold text-red-500"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}

                          {existingDocuments.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {existingDocuments.map((document, documentIndex) => (
                                <a
                                  key={document.id ?? documentIndex}
                                  href={attachmentUrl(document.document)}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <img
                                    src={attachmentUrl(document.document)}
                                    alt="checklist attachment"
                                    className="h-16 w-16 rounded-lg border border-slate-200 object-cover"
                                  />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mt-3">
                          <label
                            htmlFor={`question-comment-${questionKey}`}
                            className="text-xs font-medium text-slate-600"
                          >
                            Comment (optional)
                          </label>
                          {answered ? (
                            <p className="mt-1 text-xs text-slate-600">
                              {answerByQuestion[questionKey]?.comment || "No comment"}
                            </p>
                          ) : (
                            <input
                              id={`question-comment-${questionKey}`}
                              type="text"
                              value={comments[questionKey] || ""}
                              onChange={(event) =>
                                setQuestionComment(question.id, event.target.value)
                              }
                              placeholder="Add a note for this question"
                              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {submitting ? "Submitting..." : "Submit checklist"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ChecklistSubmissionForm;
