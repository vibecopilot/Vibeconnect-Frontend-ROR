import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import axiosInstance from "../../../api/axiosInstance";
import { Link } from "react-router-dom";
import { AiFillQuestionCircle } from "react-icons/ai";
import Chart from "react-apexcharts";
import { FaChartBar, FaCheck, FaPaperPlane, FaPencilAlt } from "react-icons/fa";
import { GrShare } from "react-icons/gr"; 
import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";
import { getSurvey, updateSurvey, getSurveyResponses } from "../../../api";

function SurveyDetails() {
  const { id } = useParams();
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

The survey will only take a few minutes to complete, and your responses will be kept confidential.

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
  const handleSendEmails = async () => {
  if (!emailList.trim()) return toast.error("Please enter at least one email");

  const emails = emailList.split(/[\s,;]+/).filter((email) => email);

  if (emails.length === 0) return toast.error("No valid emails found");

  setSendingEmails(true);
  try {
    await axiosInstance.post("/send-survey", {
      emails,
      message: mailMessage,
      survey_link: shareableLink,
    });
    toast.success("Survey sent successfully!");
    setEmailList("");
    setMailMessage("Please take this survey!");
    setSendModalOpen(false); // close modal after sending
  } catch (err) {
    console.error(err);
    toast.error("Failed to send survey");
  } finally {
    setSendingEmails(false);
  }
};

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getSurvey(id)
      .then((res) => setSurvey(res.data))
      .catch(() => setSurvey(null))
      .finally(() => setLoading(false));
  }, [id]);

  const responseCount = survey?.survey_responses?.length ?? 0;
  const questionCount = survey?.survey_questions?.length ?? 0;
  const completedCount = responseCount;
  const completionRate = responseCount > 0 ? Math.round((completedCount / responseCount) * 100) : 0;
  const estimatedMinutes = questionCount <= 0 ? 0 : Math.max(1, Math.ceil(questionCount / 2));

  const options = {
    chart: { type: "donut" },
    labels: ["Responses", "No responses yet"],
    colors: ["#6366F1", "#F59E0B"],
    legend: { position: "bottom", show: false },
    dataLabels: { enabled: false },
  };
  const series = responseCount > 0 ? [responseCount, 0] : [0, 100];
  const shareableLink = typeof window !== "undefined" ? `${window.location.origin}/survey/${id}` : "";

  const steps = [
    { id: 1, label: "Add questions", icon: <FaPencilAlt className="w-4 h-4" />, to: `/admin/create-scratch-survey/${id}` },
    { id: 2, label: "Go to Collect", icon: <FaPaperPlane className="w-4 h-4" />, action: () => setSendModalOpen(true) },
    { id: 3, label: "Analyze your results", icon: <FaChartBar className="w-4 h-4" />, to: `/admin/result-analyze-result?survey_id=${id}` },
  ];

  const handleActivateSurvey = async () => {
    setActivating(true);
    try {
      await updateSurvey(id, { survey: { status: "active" } });
      toast.success("Survey is now active. Share the link to collect responses.");
      fetchSurvey();
      setSendModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to activate survey.");
    } finally {
      setActivating(false);
    }
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "");

  if (loading) {
    return (
      <section className="flex">
        <Navbar />
        <div className="w-full flex mx-3 items-center justify-center min-h-[200px]">Loading…</div>
      </section>
    );
  }
  if (!survey) {
    return (
      <section className="flex">
        <Navbar />
        <div className="w-full flex mx-3 flex-col overflow-hidden mb-8">
          <p className="mt-5">Survey not found.</p>
          <Link to="/admin/survey" className="text-blue-600 underline mt-2">Back to surveys</Link>
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
        <div className="w-full bg-gray-100 rounded-md my-5">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="relative flex justify-between">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-0.5">
                <div className="absolute left-0 right-1/2 h-full bg-green-500 transition-all duration-500"></div>
                <div className="absolute left-1/2 right-0 h-full bg-gray-200 transition-all duration-500"></div>
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
        <div className="grid grid-cols-12 gap-5 mt-5">
          <div className="flex justify-end gap-3 mx-5 col-span-12">
            <Link to={`/admin/create-scratch-survey/${id}`} className="text-sky-500 border-r border-gray-700 pr-5 hover:underline">
              Edit design
            </Link>
            <button
              type="button"
              onClick={() => setSendModalOpen(true)}
              className="text-sky-500 border-r border-gray-700 pr-5 hover:underline text-left"
            >
              Send survey
            </button>
            <Link to={`/admin/result-analyze-result?survey_id=${id}`} className="text-sky-500 hover:underline">
              Analyze Results
            </Link>
          </div>
          <div className="col-span-4 space-y-5">
            <div className="border p-6 rounded-md">
              <div className="flex flex-col space-y-2 my-5">
                <h2 className="font-medium px-5">Survey</h2>
                <div className="w-full">
                  <div className="w-[100px]">
                    <Chart options={options} series={series} type="donut" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 mb-5">
                <div className="border-r border-gray-700 pr-5 flex flex-col space-y-3">
                  <h3 className="text-gray-500 items-center text-sm">
                    COMPLETION RATE
                  </h3>
                  <div>
                    <h2 className="text-2xl">{responseCount > 0 ? `${completionRate}%` : "0%"}</h2>
                    <p className="text-sm text-gray-500">{responseCount} response{responseCount !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-3">
                  <h3 className="text-gray-500 items-center text-sm">
                    ESTIMATED TIME TO COMPLETE
                  </h3>
                  <div>
                    <h2 className="text-2xl">{estimatedMinutes}</h2>
                    <p className="text-sm text-gray-500">Minutes</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border p-6 rounded-md">
              <div className="flex items-center justify-center">
                <h2 className="flex items-center gap-2 text-sm">
                  Survey Language: <span className="font-medium">English</span>
                </h2>
              </div>
            </div>
            <div className="border p-6 rounded-md">
              <div className="flex items-center justify-center">
                <h2 className="flex items-center gap-2 text-sm">
                  Theme: <span className="font-medium">Simple</span>
                </h2>
              </div>
            </div>
          </div>
          <div className="col-span-8 space-y-3">
            <div className="border grid grid-cols-3 gap-5 p-6 rounded-md">
              <div className="flex flex-col items-start border-r border-gray-700 pr-5 space-y-4">
                <h2 className="text-gray-500 text-sm">TOTAL RESPONSES</h2>
                <p className="text-2xl font-medium">{responseCount}</p>
              </div>
              <div className="flex flex-col items-start border-r border-gray-700 pr-5 space-y-4">
                <div className="flex justify-between items-center gap-x-2 w-full">
                  <h2 className="text-gray-500 text-sm">
                    OVERALL SURVEY STATUS
                  </h2>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      survey.status === "active" ? "bg-green-600" : survey.status === "closed" ? "bg-gray-500" : "bg-amber-500"
                    }`}
                  />
                </div>
                <Link to={`/admin/preview-survey/${id}`} className="text-green-600 text-2xl capitalize">
                  {survey.status === "active" ? "Open" : survey.status || "Draft"}
                </Link>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="flex gap-2 items-center">
                  <h2 className="text-gray-500 text-sm">NOTIFICATIONS</h2>
                  <span>
                    <AiFillQuestionCircle size={15} />
                  </span>
                </div>
                <p className="font-medium">Only you</p>
              </div>
            </div>
            <div>
              <h2 className="text-2xl text-gray-800 mb-2">Collectors</h2>
              <div className="border rounded-md">
                <h2 className={`text-white text-sm px-5 w-fit p-1 rounded-b-md mx-5 capitalize ${
                  survey.status === "active" ? "bg-green-700" : survey.status === "closed" ? "bg-gray-600" : "bg-amber-700"
                }`}>
                  {survey.status || "Draft"}
                </h2>
                <div className="flex justify-between m-5">
                  <div className="flex flex-col space-y-2">
                    <h2 className="text-sky-500 text-sm font-medium">
                      {survey.survey_title || "Survey"} — Share link
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Created: {formatDate(survey.created_at)}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {survey.status === "active"
                        ? "Survey is live. Share the link below to collect responses."
                        : "Activate the survey and share the link to collect responses."}{" "}
                      <button
                        type="button"
                        onClick={() => setSendModalOpen(true)}
                        className="text-sky-500 text-sm underline hover:no-underline"
                      >
                        Set up collector
                      </button>
                    </p>
                  </div>
                  <h2 className="text-gray-500 text-sm flex items-center gap-2">
                    Invoice: <span className="font-medium">N/A</span>
                  </h2>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl text-gray-800 mb-2">Responses</h2>
              <div className="border rounded-md p-5">
                {responseCount === 0 ? (
                  <h2 className="flex items-center justify-center gap-1 text-gray-600">
                    No survey responses yet.{" "}
                    <Link to={`/admin/preview-survey/${id}`} className="text-sky-500 hover:underline">
                      Preview & share survey
                    </Link>
                  </h2>
                ) : (
                  <div className="space-y-2">
                    <p className="font-medium">{responseCount} response{responseCount !== 1 ? "s" : ""} received.</p>
                    <Link to={`/admin/result-analyze-result?survey_id=${id}`} className="text-sky-500 hover:underline text-sm">
                      View in Analyze Results →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Send survey / Set up collector modal */}
        {sendModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Send survey</h3>
                <button
                  type="button"
                  onClick={() => setSendModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <MdClose className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Share this link with respondents. They can open it to take the survey.
              </p>
              <div className="flex gap-2 mb-4">
                <input
                  readOnly
                  value={shareableLink}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(shareableLink);
                    toast.success("Link copied to clipboard.");
                  }}
                  className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm"
                >
                  Copy
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-3">
  Enter multiple emails separated by commas, semicolons, or spaces. Add a message if you like.
</p>
<textarea
  value={emailList}
  onChange={(e) => setEmailList(e.target.value)}
  placeholder="Enter emails separated by commas, semicolons, or spaces"
  className="w-full px-3 py-2 border rounded mb-3 resize-none"
/>

<input
  type="text"
  value={mailMessage}
  onChange={(e) => setMailMessage(e.target.value)}
  placeholder="Optional message"
  className="w-full px-3 py-2 border rounded mb-4"
/>
<button
  type="button"
  onClick={handleSendEmails}
  disabled={sendingEmails}
  className={`w-full px-3 py-2 rounded text-white ${
    sendingEmails ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
  } mb-4`}
>
  {sendingEmails ? "Sending..." : "Send Survey"}
</button>

              {survey?.status !== "active" && (
                <p className="text-sm text-gray-500 mb-3">
                  Activate the survey so respondents can submit responses.
                </p>
              )}
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setSendModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Close
                </button>
                {survey?.status !== "active" && (
                  <button
                    type="button"
                    onClick={handleActivateSurvey}
                    disabled={activating}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    {activating ? "Activating…" : "Activate survey"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default SurveyDetails;
