import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { clearPublicAuth, setPublicAuth } from "../api/axiosInstance";
import {
  changeSiteForApp,
  createChecklistSubmission,
  getActivityDetails,
  getActivitySubmissions,
  getChecklistActivities,
  getChecklistGroups,
  getSiteData,
} from "../api";
import { updatePublicAuth, withPublicParams } from "../utils/publicAuth";

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

// Same frequency values used by the checklist configuration page.
const FREQUENCY_OPTIONS = [
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "half_yearly", label: "Half Yearly" },
  { value: "yearly", label: "Yearly" },
];

const statusColor = (status) => {
  if (status === "pending") return "bg-amber-500";
  if (status === "overdue") return "bg-red-500";
  if (status === "complete") return "bg-emerald-500";
  return "bg-slate-500";
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

const SubmissionList = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [frequency, setFrequency] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const sentinelRef = useRef(null);
  const loadingMoreRef = useRef(false);
  const requestRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;

    const fetchCategories = async () => {
      try {
        const response = await getChecklistGroups();
        const rows = asArray(response?.data ?? response);
        const options = rows
          .filter((row) => row?.info_type === "ChecklistGroup")
          .map((row) => ({ id: String(row.id), name: row.name }))
          .filter((option) => option.name)
          .sort((a, b) => a.name.localeCompare(b.name));

        if (!cancelled) setCategoryOptions(options);
      } catch (categoryError) {
        console.error("Unable to load checklist categories:", categoryError);
      }
    };

    fetchCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  const buildParams = useCallback(
    (pageNumber) => ({
      page: pageNumber,
      perPage: 15,
      statuses: ["pending", "overdue"],
      categoryId: category || null,
      frequency: frequency || null,
      search: debouncedSearch,
      startDate: new Date().toISOString().split("T")[0],
    }),
    [category, debouncedSearch, frequency]
  );

  useEffect(() => {
    let cancelled = false;

    const fetchFirstPage = async () => {
      const requestId = ++requestRef.current;
      try {
        setLoading(true);
        setError("");
        setTasks([]);
        setPage(1);
        setTotalPages(1);

        const response = await getChecklistActivities(buildParams(1));
        const data = response?.data ?? response;
        if (!cancelled && requestId === requestRef.current) {
          setTasks(asArray(data));
          setTotalPages(data?.total_pages || 1);
        }
      } catch (fetchError) {
        if (!cancelled && requestId === requestRef.current) {
          setError(errorMessage(fetchError));
        }
      } finally {
        if (!cancelled && requestId === requestRef.current) setLoading(false);
      }
    };

    fetchFirstPage();
    return () => {
      cancelled = true;
    };
  }, [buildParams]);

  const loadMore = useCallback(async () => {
    if (loading || loadingMoreRef.current || page >= totalPages) return;

    const requestId = requestRef.current;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    setError("");

    try {
      const nextPage = page + 1;
      const response = await getChecklistActivities(buildParams(nextPage));
      const data = response?.data ?? response;

      if (requestId === requestRef.current) {
        setTasks((current) => [...current, ...asArray(data)]);
        setPage(nextPage);
        setTotalPages(data?.total_pages || totalPages);
      }
    } catch (moreError) {
      if (requestId === requestRef.current) setError(errorMessage(moreError));
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [buildParams, loading, page, totalPages]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || loading || page >= totalPages) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "120px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, loading, page, totalPages]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-800">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-slate-900">My Checklists</h1>
          <p className="mt-1 text-sm text-slate-500">
            Open a pending checklist to answer and submit it.
          </p>
        </div>

        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="grid gap-2 sm:grid-cols-3">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search checklist, asset or service"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400"
            >
              <option value="">All categories</option>
              {categoryOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>

            <select
              value={frequency}
              onChange={(event) => setFrequency(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400"
            >
              <option value="">All frequencies</option>
              {FREQUENCY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {(search || category || frequency) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDebouncedSearch("");
                setCategory("");
                setFrequency("");
              }}
              className="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-800"
            >
              Clear filters
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <p className="text-base font-medium text-slate-700">
              {search || category || frequency
                ? "No checklists match these filters"
                : "No pending checklists"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {search || category || frequency
                ? "Try clearing a filter to see more results."
                : "You are all caught up for today."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <Link
                key={task.id}
                to={withPublicParams(`/apps/checklist/${task.id}`)}
                className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-slate-900">
                      {task.checklist_name || "Checklist"}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {task.asset_name || task.soft_service_name || "Unassigned resource"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize text-white ${statusColor(
                      String(task.status || "").toLowerCase()
                    )}`}
                  >
                    {task.status}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
                  <span>Due: {formatDateTime(task.start_time)}</span>
                  {task.assigned_to_name && <span>Assigned: {task.assigned_to_name}</span>}
                  {(task.checklist_category || task.checklist_group) && (
                    <span>Category: {task.checklist_category || task.checklist_group}</span>
                  )}
                  {task.checklist_frequency && <span>Frequency: {task.checklist_frequency}</span>}
                </div>
              </Link>
            ))}

            <div ref={sentinelRef} className="py-4 text-center text-xs text-slate-500">
              {loadingMore
                ? "Loading more checklists..."
                : page < totalPages
                  ? "Scroll down for more"
                  : "All checklists loaded"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SubmissionDetail = ({ activityId }) => {
  const [searchParams] = useSearchParams();
  const userId =
    searchParams.get("userId") ||
    searchParams.get("user_id") ||
    searchParams.get("vibeUserId");

  const [activity, setActivity] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [values, setValues] = useState({});
  const [files, setFiles] = useState({});
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

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
        const prefilled = {};

        answerRows.forEach((row) => {
          if (row.question_id === undefined || row.question_id === null) return;
          const key = String(row.question_id);
          if (prefilled[key] === undefined) prefilled[key] = row.value ?? "";
        });

        setActivity(activityData);
        setAnswers(answerRows);
        setValues(prefilled);
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
    () => groups.flatMap((group) => Array.isArray(group.questions) ? group.questions : []),
    [groups]
  );
  const answeredIds = useMemo(
    () => new Set(answers.map((row) => String(row.question_id))),
    [answers]
  );
  const attachmentsByQuestion = useMemo(() => {
    const mapped = {};
    answers.forEach((row) => {
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
    appendSubmissionField("user_id", userId);
    appendSubmissionField("comment", comment);

    Object.entries(questionsArr).forEach(([index, answer]) => {
      formData.append(`questions_arr[${index}][id]`, answer.id);
      formData.append(`questions_arr[${index}][option]`, answer.option);
      answer.files.forEach((file) => {
        formData.append(`questions_arr[${index}][attachfiles][]`, file);
      });
    });

    try {
      setSubmitting(true);
      await createChecklistSubmission(formData);
      setSubmitted(true);
      toast.success("Checklist submitted successfully");
    } catch (submitError) {
      const message = errorMessage(submitError);
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const backLink = (
    <Link
      to={withPublicParams("/apps/checklist")}
      className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
    >
      ← Back to checklists
    </Link>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen justify-center bg-slate-50">
        <div className="my-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (error && !activity) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <p className="text-base font-semibold text-red-700">Unable to load checklist</p>
          <p className="mt-2 text-sm text-slate-600">{error}</p>
          <div className="mt-4">{backLink}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-800">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-5">{backLink}</div>

        <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">
            {activity?.checklist_name || "Checklist"}
          </h1>
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
          <div className="rounded-xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-emerald-700">Checklist submitted</p>
            <p className="mt-2 text-sm text-slate-600">
              {submitted
                ? "Your answers have been recorded."
                : "This checklist has already been completed."}
            </p>
            <div className="mt-5">{backLink}</div>
          </div>
        ) : questions.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-base font-medium text-slate-700">No questions configured</p>
            <div className="mt-4">{backLink}</div>
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
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                      {heading}
                    </h2>
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
                                {/* <label className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-indigo-300">
                                  Take photo
                                  <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                    onChange={(event) => handleFiles(question.id, event)}
                                  />
                                </label> */}
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
                                    href={document.document}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <img
                                      src={document.document}
                                      alt="checklist attachment"
                                      className="h-16 w-16 rounded-lg border border-slate-200 object-cover"
                                    />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}

            <div>
              <label
                htmlFor="submission-comment"
                className="text-sm font-medium text-slate-800"
              >
                Comment
              </label>
              <textarea
                id="submission-comment"
                rows={3}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Optional"
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              />
            </div>

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
    </div>
  );
};

/**
 * Public checklist screens launched by the mobile app.
 *
 *   /apps/checklist?token=<token>&siteId=<id>          submission list
 *   /apps/checklist/:activityId?token=<token>&siteId=<id>  submission detail
 *
 * No protected-route wrapper and no app shell (navbar/sidebar) is used here.
 * The token from the URL seeds the shared axios auth before any child renders.
 */
const PublicChecklist = () => {
  const { activityId } = useParams();
  const [searchParams] = useSearchParams();

  const token =
    searchParams.get("token") ||
    searchParams.get("api_key") ||
    searchParams.get("apiKey") ||
    searchParams.get("auth_token");
  const siteIdParam =
    searchParams.get("siteId") || searchParams.get("site_id");
  const userIdParam =
    searchParams.get("userId") || searchParams.get("user_id");
  const vibeUserIdParam = searchParams.get("vibeUserId");

  const [resolvedSiteId, setResolvedSiteId] = useState(siteIdParam);
  const [ready, setReady] = useState(false);
  const effectiveSiteId = siteIdParam || resolvedSiteId;

  // Seeding during render guarantees children see the URL token on their very
  // first render (including state initialisers that read localStorage).
  setPublicAuth(token, effectiveSiteId, {
    userId: userIdParam,
    vibeUserId: vibeUserIdParam,
  });

  useEffect(() => {
    setResolvedSiteId(siteIdParam);
  }, [siteIdParam]);

  useEffect(() => {
    if (!token) {
      setReady(false);
      return undefined;
    }

    let cancelled = false;
    setReady(false);

    (async () => {
      try {
        if (siteIdParam) {
          try {
            await changeSiteForApp(siteIdParam);
          } catch (siteError) {
            console.error("Unable to select app site:", siteError);
          }
        } else {
          try {
            const response = await getSiteData();
            const sites = response?.data?.sites || [];
            const selected = sites[0];
            if (selected && !cancelled) {
              setResolvedSiteId(selected.id);
              try {
                await changeSiteForApp(selected.id);
              } catch (siteError) {
                console.error("Unable to select resolved site:", siteError);
              }
            }
          } catch (siteError) {
            console.error("Unable to resolve site from token:", siteError);
          }
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, siteIdParam]);

  // Drop the in-memory public credentials when leaving the public flow.
  useEffect(
    () => () => {
      if (!window.location.pathname.startsWith("/apps/checklist")) {
        clearPublicAuth();
      }
    },
    []
  );

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow">
          <h1 className="text-lg font-semibold text-gray-800">
            Missing access token
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Open this page from the app so the access token is included in the
            link.
          </p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white">
      {activityId ? (
        <SubmissionDetail key={activityId} activityId={activityId} />
      ) : (
        <SubmissionList />
      )}
    </div>
  );
};

export default PublicChecklist;
