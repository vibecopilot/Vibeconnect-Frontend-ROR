import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Chart from "react-apexcharts";
import { getSurvey, getSurveyResponses } from "../../../api";

function AnalyzeResult() {
  const [searchParams] = useSearchParams();
  const surveyId = searchParams.get("survey_id");
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(!!surveyId);

  useEffect(() => {
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
          <Link
            to={`/admin/survey-details/${surveyId}`}
            className="text-sky-500 hover:underline text-sm"
          >
            ← Survey details
          </Link>
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

              {/* Response list */}
              <div className="border rounded-lg p-5 bg-white shadow-sm">
                <h3 className="text-base font-semibold text-gray-800 mb-3">Individual responses</h3>
                <div className="space-y-2">
                  {responses.map((r, i) => (
                    <div
                      key={r.id || i}
                      className="flex items-center justify-between py-2 px-3 rounded bg-gray-50 text-sm text-gray-700"
                    >
                      <span>
                        Response #{i + 1} — {r.response_by || "Anonymous"}
                      </span>
                      <span className="text-gray-500">
                        {r.created_at ? new Date(r.created_at).toLocaleString() : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyzeResult;
