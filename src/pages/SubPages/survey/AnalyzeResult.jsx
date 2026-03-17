import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Chart from "react-apexcharts";
import { FaDownload, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getSurvey, getSurveyResponses } from "../../../api";

const PER_PAGE = 50;

function formatAnswer(q, answer) {
  if (!answer) return "—";
  if (q.question_type === "single_choice" || q.question_type === "multiple_choice") {
    const ids = answer.selected_option_ids || [];
    const opts = q.options || [];
    const labels = ids.map((id) => opts.find((o) => Number(o.id) === Number(id))?.label || id);
    return labels.join(", ") || "—";
  }
  if (q.question_type === "rating" || q.question_type === "scale") {
    return answer.numeric_value != null ? String(answer.numeric_value) : "—";
  }
  return (answer.text_value || "").trim() || "—";
}

function AnalyzeResult() {
  const [searchParams] = useSearchParams();
  const surveyId = searchParams.get("survey_id");
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(!!surveyId);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
    if (!surveyId) {
      setLoading(false);
      return;
    }
    Promise.all([
      getSurvey(surveyId)
        .then((r) => {
          const d = r?.data;
          return d?.survey ?? d ?? null;
        })
        .catch(() => null),
      getSurveyResponses(surveyId)
        .then((r) => {
          const d = r?.data;
          if (Array.isArray(d)) return d;
          if (Array.isArray(d?.survey_responses)) return d.survey_responses;
          if (Array.isArray(d?.responses)) return d.responses;
          return [];
        })
        .catch(() => []),
    ]).then(([s, res]) => {
      setSurvey(s || null);
      setResponses(res);
      setLoading(false);
    });
  }, [surveyId]);

  const responseCount = responses.length;

  // Aggregate answers by question for charts
  const getQuestionStats = () => {
    if (!survey?.survey_questions?.length || !responses.length) return [];
    const questions = survey.survey_questions;

    return questions.map((q) => {
      const counts = {};
      const textAnswers = [];

      responses.forEach((r) => {
        const answer = r.survey_answers?.find((a) => Number(a.survey_question_id) === Number(q.id));
        if (!answer) return;

        if (q.question_type === "single_choice" || q.question_type === "multiple_choice") {
          const optionIds = answer.selected_option_ids || [];
          const options = q.options || [];
          optionIds.forEach((optId) => {
            const opt = options.find((o) => Number(o.id) === Number(optId));
            const label = opt?.label || `Option ${optId}`;
            counts[label] = (counts[label] || 0) + 1;
          });
        } else if (q.question_type === "rating" || q.question_type === "scale") {
          const v = answer.numeric_value != null ? Number(answer.numeric_value) : "—";
          const key = String(v);
          counts[key] = (counts[key] || 0) + 1;
        } else {
          const t = answer.text_value?.trim() || "";
          if (t) textAnswers.push(t);
        }
      });

      const labels = Object.keys(counts);
      const series = Object.values(counts);
      return {
        question: q,
        labels,
        series,
        textAnswers,
      };
    });
  };

  const questionStats = getQuestionStats();

  const totalPages = Math.ceil(responses.length / PER_PAGE) || 1;
  const paginatedResponses = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return responses.slice(start, start + PER_PAGE);
  }, [responses, page]);

  const handleDownloadCSV = () => {
    if (!survey?.survey_questions?.length || !responses.length) return;
    const questions = survey.survey_questions;
    const headers = ["#", "Respondent", "Submitted At", ...questions.map((q) => q.q_title || "Q")];
    const rows = responses.map((r, i) => {
      const respondent = r.response_by || r.user?.name || "Anonymous";
      const date = r.created_at ? new Date(r.created_at).toLocaleString() : "";
      const answerCols = questions.map((q) => {
        const ans = r.survey_answers?.find((a) => Number(a.survey_question_id) === Number(q.id));
        const val = formatAnswer(q, ans);
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      return [i + 1, `"${respondent.replace(/"/g, '""')}"`, `"${date}"`, ...answerCols].join(",");
    });
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `survey-${surveyId}-responses-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (loading) {
    return (
      <div className="flex">
        <Navbar />
        <div className="w-full flex items-center justify-center min-h-[200px]">Loading…</div>
      </div>
    );
  }

  if (!surveyId) {
    return (
      <div className="flex">
        <Navbar />
        <div className="w-full flex flex-col p-6">
          <p className="text-gray-600">Select a survey from Survey Details to analyze results.</p>
          <Link to="/admin/survey" className="text-sky-500 hover:underline mt-2">Back to surveys</Link>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="flex">
        <Navbar />
        <div className="w-full flex flex-col p-6">
          <p className="text-gray-600">Survey not found.</p>
          <Link to="/admin/survey" className="text-sky-500 hover:underline mt-2">Back to surveys</Link>
        </div>
      </div>
    );
  }

  const defaultChartOptions = {
    chart: { type: "bar" },
    plotOptions: {
      bar: { horizontal: false, columnWidth: "55%", borderRadius: 4 },
    },
    dataLabels: { enabled: true },
    xaxis: { categories: [] },
    colors: ["#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899"],
  };

  return (
    <div className="flex">
      <Navbar />
      <div className="w-full flex flex-col overflow-hidden">
        <header className="flex justify-between items-center bg-white px-6 py-3 border-b shadow-sm">
          <h1 className="text-xl font-semibold">{survey.survey_title || "Analyze results"}</h1>
          <div className="flex items-center gap-4">
            {responseCount > 0 && (
              <button
                onClick={handleDownloadCSV}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
              >
                <FaDownload />
                Download CSV
              </button>
            )}
            <Link
              to={`/admin/survey-details/${surveyId}`}
              className="text-sky-500 hover:underline text-sm"
            >
              ← Survey details
            </Link>
          </div>
        </header>

        <div className="flex-1 p-6 space-y-6">
          <p className="text-gray-600 text-sm font-medium">
            RESPONDENTS: {responseCount} response{responseCount !== 1 ? "s" : ""}
          </p>

          {responseCount === 0 ? (
            <div className="border rounded-md p-10 flex flex-col items-center space-y-3 max-w-lg mx-auto">
              <div className="text-gray-500 text-2xl">⚠</div>
              <p className="text-gray-700">This survey has no responses yet.</p>
              <Link
                to={`/admin/preview-survey/${surveyId}`}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Preview & share survey
              </Link>
            </div>
          ) : (
            <>
              {/* Per-question charts */}
              {questionStats.map((stat, idx) => (
                <div key={stat.question.id || idx} className="border rounded-lg p-5 bg-white shadow-sm">
                  <h3 className="text-base font-semibold text-gray-800 mb-3">
                    {idx + 1}. {stat.question.q_title}
                  </h3>
                  {stat.question.question_type === "text" ? (
                    <div className="space-y-2">
                      {stat.textAnswers.length === 0 ? (
                        <p className="text-gray-500 text-sm">No text answers.</p>
                      ) : (
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                          {stat.textAnswers.map((t, i) => (
                            <li key={i}>{t}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : stat.labels.length > 0 ? (
                    <div className="max-w-xl">
                      <Chart
                        options={{
                          ...defaultChartOptions,
                          xaxis: { ...defaultChartOptions.xaxis, categories: stat.labels },
                          chart: {
                            ...defaultChartOptions.chart,
                            type: stat.labels.length <= 6 ? "donut" : "bar",
                          },
                          labels: stat.labels,
                        }}
                        series={
                          stat.labels.length <= 6
                            ? stat.series
                            : [{ name: "Responses", data: stat.series }]
                        }
                        type={stat.labels.length <= 6 ? "donut" : "bar"}
                        height={280}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No answers for this question yet.</p>
                  )}
                </div>
              ))}

              {/* Response records - 50 per page */}
              <div className="border rounded-lg p-5 bg-white shadow-sm">
                <h3 className="text-base font-semibold text-gray-800 mb-4">Response records</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left py-2 px-3 font-semibold text-gray-700">#</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700">Respondent</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700">Submitted</th>
                        {survey.survey_questions.map((q, i) => (
                          <th key={q.id} className="text-left py-2 px-3 font-semibold text-gray-700 max-w-[200px]">
                            Q{i + 1}: {q.q_title}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedResponses.map((r, idx) => {
                        const globalIndex = (page - 1) * PER_PAGE + idx;
                        const respondent = r.response_by || r.user?.name || "Anonymous";
                        const submitted = r.created_at ? new Date(r.created_at).toLocaleString() : "—";
                        return (
                          <tr key={r.id || globalIndex} className="border-b hover:bg-gray-50">
                            <td className="py-2 px-3 text-gray-600">{globalIndex + 1}</td>
                            <td className="py-2 px-3 font-medium">{respondent}</td>
                            <td className="py-2 px-3 text-gray-500">{submitted}</td>
                            {survey.survey_questions.map((q) => {
                              const ans = r.survey_answers?.find((a) => Number(a.survey_question_id) === Number(q.id));
                              return (
                                <td key={q.id} className="py-2 px-3 text-gray-700 max-w-[200px] truncate" title={formatAnswer(q, ans)}>
                                  {formatAnswer(q, ans)}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, responses.length)} of {responses.length}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                      >
                        <FaChevronLeft />
                      </button>
                      <span className="text-sm font-medium">
                        Page {page} of {totalPages}
                      </span>
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                      >
                        <FaChevronRight />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyzeResult;
