import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import axiosInstance from "../../../api/axiosInstance";
import Chart from "react-apexcharts";
import { FaChartBar, FaPaperPlane, FaPencilAlt } from "react-icons/fa";
import { GrShare } from "react-icons/gr";
import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";
import { getSurvey, updateSurvey, getSurveyResponses } from "../../../api";

function SurveyDetails() {
  const { id } = useParams();

  const shareableLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/survey/${id}`
      : "";

  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [activating, setActivating] = useState(false);
  const [emailList, setEmailList] = useState("");
  const [sendingEmails, setSendingEmails] = useState(false);
  const [mailMessage, setMailMessage] = useState("");

  useEffect(() => {
  setMailMessage(
`Dear Participant,

We would like to invite you to take part in our survey. Your feedback is extremely valuable and will help us improve our services and better understand user experiences.

Please click the link below to begin the survey:

Take the Survey

${shareableLink}

Alternatively, you may copy and paste the following link into your browser:
${shareableLink}

The survey will only take a few minutes to complete, and your responses will be kept confidential.

Thank you for your time and participation.

Best regards,
Survey Team`
  );
}, [shareableLink]);

  const responseCount = responses.length;

  /* Build per-question answer aggregations for the overview chart */
  const questionStats = (() => {
    const questions = survey?.survey_questions || [];
    if (!questions.length || !responses.length) return [];
    return questions.map((q) => {
      const counts = {};
      const textAnswers = [];
      responses.forEach((r) => {
        const ans = r.survey_answers?.find(
          (a) => Number(a.survey_question_id) === Number(q.id)
        );
        if (!ans) return;
        if (q.question_type === "single_choice" || q.question_type === "multiple_choice") {
          const opts = q.options || [];
          (ans.selected_option_ids || []).forEach((oid) => {
            const label = opts.find((o) => Number(o.id) === Number(oid))?.label || `Option ${oid}`;
            counts[label] = (counts[label] || 0) + 1;
          });
        } else if (q.question_type === "rating" || q.question_type === "scale") {
          const key = ans.numeric_value != null ? String(ans.numeric_value) : "—";
          counts[key] = (counts[key] || 0) + 1;
        } else {
          const t = ans.text_value?.trim();
          if (t) textAnswers.push(t);
        }
      });
      return { question: q, counts, textAnswers };
    });
  })();

  const PALETTE = ["#22c55e","#3b82f6","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899"];

  const overviewChartOptions = {
    chart: { type: "donut", toolbar: { show: false } },
    labels: questionStats.length
      ? questionStats.map((s) => s.question.q_title?.substring(0, 30) || `Q${s.question.id}`)
      : ["No Questions"],
    colors: PALETTE,
    legend: { position: "bottom", fontSize: "12px" },
    dataLabels: { enabled: true, formatter: (v) => `${Math.round(v)}%` },
    tooltip: { y: { formatter: (v) => `${v} response${v !== 1 ? "s" : ""}` } },
    plotOptions: { pie: { donut: { size: "55%" } } },
  };

  const overviewChartSeries = questionStats.length
    ? questionStats.map((s) => Object.values(s.counts).reduce((a, b) => a + b, 0) || 0)
    : [responseCount || 1];

  const steps = [
    {
      id: 1,
      label: "Design Survey",
      icon: <FaPencilAlt />,
      to: `/admin/create-scratch-survey/${id}`
    },
    {
      id: 2,
      label: "Collect Responses",
      icon: <FaPaperPlane />,
      action: () => setSendModalOpen(true)
    },
    {
      id: 3,
      label: "Analyze Results",
      icon: <FaChartBar />,
      to: `/admin/result-analyze-result?survey_id=${id}`
    }
  ];

  const fetchSurvey = async () => {
    try {
      const [surveyRes, responsesRes] = await Promise.all([
        getSurvey(id),
        getSurveyResponses(id),
      ]);

      /* Handle nested or flat survey shape */
      const surveyData = surveyRes?.data?.survey ?? surveyRes?.data ?? null;
      setSurvey(surveyData);

      /* Handle nested or flat responses shape */
      const rd = responsesRes?.data;
      const list = Array.isArray(rd)
        ? rd
        : Array.isArray(rd?.survey_responses)
        ? rd.survey_responses
        : Array.isArray(rd?.responses)
        ? rd.responses
        : [];
      setResponses(list);
    } catch {
      toast.error("Failed to load survey");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurvey();
  }, [id]);

  const handleActivateSurvey = async () => {
    setActivating(true);
    try {
      await updateSurvey(id, { survey: { status: "active" } });
      toast.success("Survey activated");
      fetchSurvey();
      setSendModalOpen(false);
    } catch {
      toast.error("Activation failed");
    } finally {
      setActivating(false);
    }
  };

  const handleSendEmails = async () => {
    if (!emailList.trim()) {
      toast.error("Enter at least one email");
      return;
    }

    if (survey?.status !== "active") {
      toast.error("Activate survey first");
      return;
    }

    setSendingEmails(true);

    try {
      const emails = emailList
        .split(/[\s,;]+/)
        .map((e) => e.trim())
        .filter((e) => e.includes("@"));

      await axiosInstance.post("/send-survey", {
        survey_id: id,
        emails,
        message: mailMessage,
        survey_link: shareableLink
      });

      toast.success("Survey emails sent");
      setEmailList("");
      setSendModalOpen(false);
    } catch {
      toast.error("Email sending failed");
    } finally {
      setSendingEmails(false);
    }
  };

  if (loading) {
    return (
      <section className="flex">
        <Navbar />
        <div className="w-full flex justify-center items-center">
          Loading...
        </div>
      </section>
    );
  }

  return (
    <section className="flex bg-gray-50 min-h-screen">
  <Navbar />

  <div className="flex-1 px-10 py-8 space-y-8 overflow-x-hidden">
    <div className="w-full flex items-center justify-between mb-6">

  {/* Title */}
  <h1 className="text-3xl font-bold">
    {survey?.survey_title}
  </h1>

  {/* Action Buttons */}
  <div className="flex items-center gap-3 shrink-0">

    {/* Edit */}
    <div className="relative group">
      <Link
        to={`/admin/create-scratch-survey/${id}`}
        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center"
      >
        <FaPencilAlt size={16} />
      </Link>

      <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2
      bg-black text-white text-xs px-2 py-1 rounded opacity-0
      group-hover:opacity-100 transition whitespace-nowrap">
        Edit Survey
      </span>
    </div>

    {/* Preview */}
    <div className="relative group">
      <Link
        to={`/admin/preview-survey/${id}`}
        className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg flex items-center justify-center"
      >
        <GrShare size={16} />
      </Link>

      <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2
      bg-black text-white text-xs px-2 py-1 rounded opacity-0
      group-hover:opacity-100 transition whitespace-nowrap">
        Preview Survey
      </span>
    </div>

  </div>

</div>
      

        {/* Progress Stepper */}
<div className="bg-white rounded-xl border shadow-sm p-6">

  <div className="flex items-center justify-between relative">

    {/* Background Line */}
    <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200"></div>

    {/* Progress Line */}
    <div
      className="absolute top-5 left-0 h-1 bg-green-500 transition-all duration-500"
      style={{ width: "50%" }}
    ></div>

    {steps.map((step, index) => (
      <div
        key={step.id}
        className="flex flex-col items-center relative z-10 w-full"
      >

        {/* Step Circle */}
        <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
          {step.icon}
        </div>

        {/* Step Label */}
        <span className="text-sm mt-2 text-gray-700">
          {step.to ? (
            <Link to={step.to}>{step.label}</Link>
          ) : (
            <button onClick={step.action}>{step.label}</button>
          )}
        </span>

      </div>
    ))}

  </div>

</div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-3 gap-6">

          <div className="bg-white rounded-xl border shadow-sm p-6 text-center">
            <p className="text-gray-500 text-sm">Total Responses</p>
            <p className="text-4xl font-bold mt-2">{responses.length}</p>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6 text-center">
            <p className="text-gray-500 text-sm">Survey Status</p>
            <p className="text-2xl text-green-600 mt-2 capitalize">
              {survey?.status}
            </p>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6 text-center">
            <p className="text-gray-500 text-sm">Estimated Time</p>
            <p className="text-2xl mt-2">2 min</p>
          </div>

        </div>

        {/* Response Chart */}
        <div className="bg-white rounded-xl border shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Response Overview</h2>
            {responseCount > 0 && (
              <span className="text-sm text-gray-500">
                {responseCount} response{responseCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {responseCount === 0 ? (
            <div className="flex flex-col items-center py-10 text-gray-400 gap-2">
              <span className="text-4xl">📊</span>
              <p className="text-sm">No responses yet. Share the survey to collect data.</p>
            </div>
          ) : (
            <>
              {/* Donut: answered counts per question */}
              <div className="w-full max-w-sm mx-auto">
                <Chart
                  options={overviewChartOptions}
                  series={overviewChartSeries}
                  type="donut"
                  height={280}
                />
              </div>

              {/* Per-question breakdown */}
              {questionStats.length > 0 && (
                <div className="mt-8 space-y-6">
                  {questionStats.map((stat, idx) => (
                    <div key={stat.question.id || idx} className="border rounded-lg p-4">
                      <p className="text-sm font-semibold text-gray-800 mb-3">
                        {idx + 1}. {stat.question.q_title}
                      </p>

                      {stat.question.question_type === "text" ? (
                        stat.textAnswers.length > 0 ? (
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {stat.textAnswers.map((t, i) => <li key={i}>{t}</li>)}
                          </ul>
                        ) : (
                          <p className="text-xs text-gray-400">No text answers yet.</p>
                        )
                      ) : Object.keys(stat.counts).length > 0 ? (
                        <div className="space-y-2">
                          {Object.entries(stat.counts).map(([label, count], i) => {
                            const total = Object.values(stat.counts).reduce((a, b) => a + b, 0);
                            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                            return (
                              <div key={i}>
                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                  <span>{label}</span>
                                  <span>{count} ({pct}%)</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                  <div
                                    className="h-2 rounded-full"
                                    style={{ width: `${pct}%`, backgroundColor: PALETTE[i % PALETTE.length] }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400">No answers yet.</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Collector */}
        <div className="bg-white rounded-xl border shadow-sm p-6">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-sm text-gray-500">
                Share your survey link
              </p>

              <p className="text-green-600 font-medium">
                {shareableLink}
              </p>
            </div>

            <button
              onClick={() => setSendModalOpen(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Send Survey
            </button>

          </div>

        </div>

        {/* Send Modal */}
        {sendModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

            <div className="bg-white rounded-2xl shadow-xl p-6 w-[500px]">

              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold">Send Survey</h3>

                <MdClose
                  className="cursor-pointer"
                  onClick={() => setSendModalOpen(false)}
                />
              </div>

              <textarea
                value={emailList}
                onChange={(e) => setEmailList(e.target.value)}
                placeholder="Enter multiple emails"
                className="w-full border rounded-lg p-2 mb-4"
              />

              <textarea
                rows={5}
                value={mailMessage}
                onChange={(e) => setMailMessage(e.target.value)}
                className="w-full border rounded-lg p-2 mb-4"
              />

              <button
                onClick={handleSendEmails}
                className="w-full bg-green-500 text-white py-2 rounded-lg"
              >
                Send Survey
              </button>

              {survey?.status !== "active" && (
                <button
                  onClick={handleActivateSurvey}
                  className="w-full mt-3 bg-blue-500 text-white py-2 rounded-lg"
                >
                  Activate Survey
                </button>
              )}

            </div>

          </div>
        )}

      </div>
    </section>
  );
}

export default SurveyDetails;

