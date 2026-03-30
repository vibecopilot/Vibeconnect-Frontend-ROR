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
  const [chartType, setChartType] = useState("donut");
  const [activeTab, setActiveTab] = useState("send"); // "send" | "thankyou"
  const [thankYouMessage, setThankYouMessage] = useState("");
  const [clientLogo, setClientLogo] = useState(null);
  const [mailMessage, setMailMessage] = useState("");
  const shareableLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/survey/${id}`
      : "";

  useEffect(() => {
    if (survey) {
      setMailMessage(`Dear Participant,

We would like to invite you to take part in our survey.

${survey.description || ""}

Please click the link below:

${shareableLink}

Thank you,
${survey.survey_title} Team`);
    }
  }, [survey, shareableLink]);

  useEffect(() => {
    if (survey) {
      setThankYouMessage(survey?.thank_you_message || "");
      setClientLogo(survey?.client_logo || "");
    }
  }, [survey]);

  // const responseCount = responses.length;
  const responseCount = responses.length;
  const questionCount = survey?.survey_questions?.length ?? 0;
  const completedCount = responseCount;
  const completionRate =
    responseCount > 0 ? Math.round((completedCount / responseCount) * 100) : 0;
  const estimatedMinutes =
    questionCount <= 0 ? 0 : Math.max(1, Math.ceil(questionCount / 2));

  /* Build per-question answer aggregations for the overview chart */
  const questionStats = (() => {
    const questions = survey?.survey_questions || [];
    if (!questions.length || !responses.length) return [];
    return questions.map((q) => {
      const counts = {};
      const textAnswers = [];
      responses.forEach((r) => {
        const ans = r.survey_answers?.find(
          (a) => Number(a.survey_question_id) === Number(q.id),
        );
        if (!ans) return;
        if (
          q.question_type === "single_choice" ||
          q.question_type === "multiple_choice"
        ) {
          const opts = q.options || [];
          (ans.selected_option_ids || []).forEach((oid) => {
            const label =
              opts.find((o) => Number(o.id) === Number(oid))?.label ||
              `Option ${oid}`;
            counts[label] = (counts[label] || 0) + 1;
          });
        } else if (
          q.question_type === "rating" ||
          q.question_type === "scale"
        ) {
          const key =
            ans.numeric_value != null ? String(ans.numeric_value) : "—";
          counts[key] = (counts[key] || 0) + 1;
        } else {
          const t = ans.text_value?.trim();
          if (t) textAnswers.push(t);
        }
      });
      return { question: q, counts, textAnswers };
    });
  })();

  const PALETTE = [
    "#22c55e",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
  ];

  const overviewChartOptions = {
    chart: { type: "donut", toolbar: { show: false } },
    labels: questionStats.length
      ? questionStats.map(
        (s) => s.question.q_title?.substring(0, 30) || `Q${s.question.id}`,
      )
      : ["No Questions"],
    colors: PALETTE,
    legend: { position: "bottom", fontSize: "12px" },
    dataLabels: { enabled: true, formatter: (v) => `${Math.round(v)}%` },
    tooltip: { y: { formatter: (v) => `${v} response${v !== 1 ? "s" : ""}` } },
    plotOptions: {
      pie: {
        customScale: 0.75, // 🔥 SHRINK WHOLE DONUT
        donut: {
          size: "65%", // slightly bigger hole → cleaner look
        },
      },
    },
  };

  const chartOptions =
    chartType === "donut"
      ? overviewChartOptions
      : {
        ...overviewChartOptions,
        chart: { type: "bar", toolbar: { show: false } },

        colors: PALETTE,

        plotOptions: {
          bar: {
            borderRadius: 8,
            columnWidth: "40%",
            distributed: true,
          },
        },

        grid: {
          show: true,
          borderColor: "#e5e7eb",
          strokeDashArray: 4,
          xaxis: { lines: { show: false } },
          yaxis: { lines: { show: true } },
        },

        dataLabels: { enabled: false },

        xaxis: {
          categories: overviewChartOptions.labels,
          labels: {
            style: {
              fontSize: "11px",
              colors: "#6b7280",
            },
          },
        },

        yaxis: {
          labels: {
            style: {
              fontSize: "11px",
              colors: "#6b7280",
            },
          },
        },

        tooltip: {
          theme: "light",
          y: {
            formatter: (val) => `${val} responses`,
          },
        },

        legend: { show: false },
      };


  const chartSeries =
    chartType === "donut"
      ? questionStats.length
        ? questionStats.map(
          (s) =>
            Object.values(s.counts).reduce((a, b) => a + b, 0) || 0,
        )
        : [responseCount || 1]

      : [
        {
          name: "Responses",
          data: questionStats.length
            ? questionStats.map(
              (s) =>
                Object.values(s.counts).reduce((a, b) => a + b, 0) || 0,
            )
            : [0],
        },
      ];

  // The survey will only take a few minutes to complete, and your responses will be kept confidential.

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
    if (!emailList.trim())
      return toast.error("Please enter at least one email");

    const emails = emailList.split(/[\s,;]+/).filter((email) => email);

    if (emails.length === 0) return toast.error("No valid emails found");

    setSendingEmails(true);
    try {
      await axiosInstance.post("/send-survey", {
        emails,
        message: `
<div style="font-family: Arial, sans-serif;">

  ${clientLogo ? `
    <div style="text-align:center; margin-bottom:20px;">
      <img src="${clientLogo}" alt="Logo" style="max-height:80px;" />
    </div>
  ` : ""}

  <p>Dear Participant,</p>

  <p>We would like to invite you to take part in our survey.</p>

  <p>${mailMessage || ""}</p>

  <p>
    <a href="${shareableLink}" 
       style="background:#4f46e5;color:white;padding:10px 16px;
              text-decoration:none;border-radius:6px;">
      Take Survey
    </a>
  </p>

  <p>Or copy this link:</p>
  <p>${shareableLink}</p>

  <br/>

  <p>Thank you,<br/>${survey?.survey_title} Team</p>

</div>
`,
        survey_link: shareableLink,
      });
      toast.success("Survey sent successfully!");
      setEmailList("");

      setSendModalOpen(false);
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
    fetchSurvey();
  }, [id]);

  const options = {
    chart: { type: "donut" },
    labels: ["Responses", "No responses yet"],
    colors: ["#6366F1", "#F59E0B"],
    legend: { position: "bottom", show: false },
    dataLabels: { enabled: false },
  };
  const series = responseCount > 0 ? [responseCount, 0] : [0, 100];

  const steps = [
    {
      id: 1,
      label: "Add questions",
      icon: <FaPencilAlt className="w-4 h-4" />,
      to: `/admin/create-scratch-survey/${id}`,
    },
    {
      id: 2,
      label: "Go to Collect",
      icon: <FaPaperPlane className="w-4 h-4" />,
      action: () => setSendModalOpen(true),
    },
    {
      id: 3,
      label: "Analyze your results",
      icon: <FaChartBar className="w-4 h-4" />,
      to: `/admin/result-analyze-result?survey_id=${id}`,
    },
  ];

  const handleActivateSurvey = async () => {
    setActivating(true);
    try {
      await updateSurvey(id, { survey: { status: "active" } });
      toast.success(
        "Survey is now active. Share the link to collect responses.",
      );
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
        <div className="w-full flex mx-3 items-center justify-center min-h-[200px]">
          Loading…
        </div>
      </section>
    );
  }
  if (!survey) {
    return (
      <section className="flex">
        <Navbar />
        <div className="w-full flex mx-3 flex-col overflow-hidden mb-8">
          <p className="mt-5">Survey not found.</p>
          <Link to="/admin/survey" className="text-blue-600 underline mt-2">
            Back to surveys
          </Link>
        </div>
      </section>
    );
  }
  const isSurveyCompleted = survey?.end_date
    ? new Date().setHours(0, 0, 0, 0) >= new Date(survey.end_date).setHours(0, 0, 0, 0)
    : false;

  return (
    <section className="flex bg-gray-50 min-h-screen">
      <Navbar />

      <div className="flex-1 px-10 py-8 space-y-8 overflow-x-hidden">
        <div className="w-full flex items-center justify-between mb-6">
          {/* Title */}
          <h1 className="text-3xl font-bold">{survey?.survey_title}</h1>

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
            </div>

            {/* Preview */}
            <div className="relative group">
              <Link
                to={`/admin/preview-survey/${id}`}
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg flex items-center justify-center"
              >
                <GrShare size={16} />
              </Link>
            </div>

            {/* 🔥 NEW SEND SURVEY BUTTON */}
            <div className="relative group">
              <button
                onClick={() => {
                  if (survey) {
                    setMailMessage(`Dear Participant,

We would like to invite you to take part in our survey.

${survey.description || ""}

Please click the link below:

${shareableLink}

Thank you,
${survey.survey_title} Team`);
                  }
                  setSendModalOpen(true);
                }}
                className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-lg flex items-center justify-center"
              >
                <FaPaperPlane size={16} />
              </button>
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
              style={{ width: isSurveyCompleted ? "100%" : "50%" }}
            ></div>

            {steps.map((step) => (
              <div
                key={step.id}
                className="flex flex-col items-center relative z-10 w-full"
              >
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${isSurveyCompleted || step.id <= 2
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-500"
                    }`}
                >
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


        {/* Response Chart */}
        {/*  <div className="bg-white rounded-xl border shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Response Overview 123</h2>
            {responseCount > 0 && (
              <span className="text-sm text-gray-500">
                {responseCount} response{responseCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>*/}

        {/* {responseCount === 0 ? (
            <div className="flex flex-col items-center py-10 text-gray-400 gap-2">
              <span className="text-4xl">📊</span>
              <p className="text-sm">
                No responses yet. Share the survey to collect data.
              </p>
            </div>
          ) : (
            <>
              <div className="w-full max-w-sm mx-auto">
                <Chart
                  options={overviewChartOptions}
                  series={overviewChartSeries}
                  type="donut"
                  height={280}
                />
              </div>
*/}
        {/*  {questionStats.length > 0 && (
                <div className="mt-8 space-y-6">
                  {questionStats.map((stat, idx) => (
                    <div
                      key={stat.question.id || idx}
                      className="border rounded-lg p-4"
                    >
                      <p className="text-sm font-semibold text-gray-800 mb-3">
                        {idx + 1}. {stat.question.q_title}
                      </p>

                      {stat.question.question_type === "text" ? (
                        stat.textAnswers.length > 0 ? (
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {stat.textAnswers.map((t, i) => (
                              <li key={i}>{t}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-gray-400">
                            No text answers yet.
                          </p>
                        )
                      ) : Object.keys(stat.counts).length > 0 ? (
                        <div className="space-y-2">
                          {Object.entries(stat.counts).map(
                            ([label, count], i) => {
                              const total = Object.values(stat.counts).reduce(
                                (a, b) => a + b,
                                0,
                              );
                              const pct =
                                total > 0
                                  ? Math.round((count / total) * 100)
                                  : 0;
                              return (
                                <div key={i}>
                                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>{label}</span>
                                    <span>
                                      {count} ({pct}%)
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                      className="h-2 rounded-full"
                                      style={{
                                        width: `${pct}%`,
                                        backgroundColor:
                                          PALETTE[i % PALETTE.length],
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            },
                          )}
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
        </div>*/}

        <div className="grid grid-cols-12 gap-6 mt-4">

          {/* LEFT SIDE */}
          {/* LEFT SIDE */}
          <div className="col-span-12 md:col-span-6 bg-white rounded-xl shadow p-5">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Survey Overview
              </h2>

              {/* TABS */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1 text-sm">

                <button
                  onClick={() => setChartType("donut")}
                  className={`px-3 py-1 rounded-md transition ${chartType === "donut"
                    ? "bg-white shadow text-gray-900"
                    : "text-gray-500"
                    }`}
                >
                  Donut
                </button>

                <button
                  onClick={() => setChartType("bar")}
                  className={`px-3 py-1 rounded-md transition ${chartType === "bar"
                    ? "bg-white shadow text-gray-900"
                    : "text-gray-500"
                    }`}
                >
                  Bar
                </button>

              </div>
            </div>

            {/* Chart */}
            <div className="flex justify-center">
              <div className="w-[220px]">
                <Chart
                  options={chartOptions}
                  series={chartSeries}
                  type={chartType}
                  height={180}
                />
              </div>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="col-span-12 md:col-span-6 grid grid-cols-2 gap-4">

            {/* Total Responses */}
            <div className="bg-white rounded-xl shadow p-4 border text-center">
              <p className="text-xs text-gray-800">Total Responses</p>
              <h2 className="text-5xl font-bold mt-3">
                {survey.responses_count || 0}
              </h2>
            </div>

            {/* Survey Status */}
            <div className="bg-white rounded-xl shadow p-4 border text-center">
              <p className="text-xs text-gray-500">Survey Status</p>
              <h2 className="text-4xl font-semibold text-green-600 mt-1 capitalize">
                {survey.status || "Draft"}
              </h2>
            </div>

            {/* Estimated Time */}
            <div className="bg-white rounded-2xl shadow p-4 border text-center">
              <p className="text-xs text-gray-500">Estimated Time</p>
              <h2 className="text-3xl font-semibold mt-1">
                {estimatedMinutes} min
              </h2>
            </div>

            {/* NEW CARD */}
            <div className="bg-white rounded-xl shadow p-4 border text-center">
              <p className="text-xs text-gray-500">Completion Rate</p>
              <h2 className="text-3xl font-bold mt-1">
                {completionRate}%
              </h2>
            </div>

          </div>

        </div>

        {/* Send survey / Set up collector modal */}
        {sendModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 min-h-[500px] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-4 border-b mb-4">
                  <button
                    onClick={() => setActiveTab("send")}
                    className={`pb-2 ${activeTab === "send"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500"
                      }`}
                  >
                    Send Survey
                  </button>

                  <button
                    onClick={() => setActiveTab("thankyou")}
                    className={`pb-2 ${activeTab === "thankyou"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500"
                      }`}
                  >
                    Thank You Mail
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setSendModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <MdClose className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1">
                {activeTab === "send" && (
                  <>
                    <p className="text-gray-600 text-sm mb-3">
                      Share this link with respondents. They can open it to take the
                      survey.
                    </p>


                    <div className="flex gap-2 mb-4">
                      <input
                        readOnly
                        value={shareableLink}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(shareableLink);
                            toast.success("Link copied to clipboard.");
                          } catch (err) {
                            const textArea = document.createElement("textarea");
                            textArea.value = shareableLink;
                            document.body.appendChild(textArea);
                            textArea.select();
                            document.execCommand("copy");
                            document.body.removeChild(textArea);

                            toast.success("Link copied (fallback).");
                          }
                        }}
                        className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      Enter multiple emails separated by commas, semicolons, or
                      spaces. Add a message if you like.
                    </p>
                    <textarea
                      value={emailList}
                      onChange={(e) => setEmailList(e.target.value)}
                      placeholder="Enter emails separated by commas, semicolons, or spaces"
                      className="w-full px-3 py-2 border rounded mb-3 resize-none"
                    />

                    {/* ✅ CLIENT LOGO FIELD */}
                    <div className="mb-3">
                      <label className="block text-sm text-gray-600 mb-1">
                        Upload Client Logo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;

                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setClientLogo(reader.result); // base64
                          };
                          reader.readAsDataURL(file);
                        }}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    {clientLogo && (
                      <div className="mb-3 flex justify-center">
                        <img
                          src={clientLogo}
                          alt="Preview"
                          className="h-16 object-contain"
                        />
                      </div>
                    )}

                    {/* 🔥 MESSAGE / DESCRIPTION */}
                    <textarea
                      value={mailMessage}
                      onChange={(e) => setMailMessage(e.target.value)}
                      placeholder="Add message / description"
                      className="w-full px-3 py-2 border rounded mb-3 resize-none"
                    />
                    <button
                      type="button"
                      onClick={handleSendEmails}
                      disabled={sendingEmails}
                      className={`w-full px-3 py-2 rounded text-white ${sendingEmails
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                        } mb-4`}
                    >

                      {sendingEmails ? "Sending..." : "Send Survey"}
                    </button>
                  </>
                )}

                {activeTab === "thankyou" && (
                  <>
                    <div className="mb-3">
                      <label className="block text-sm text-gray-600 mb-1">
                        Upload Client Logo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;

                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setClientLogo(reader.result);
                          };
                          reader.readAsDataURL(file);
                        }}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>

                    {clientLogo && (
                      <div className="mb-3 flex justify-center">
                        <img
                          src={clientLogo}
                          alt="Preview"
                          className="h-16 object-contain"
                        />
                      </div>
                    )}

                    <textarea
                      value={thankYouMessage}
                      onChange={(e) => setThankYouMessage(e.target.value)}
                      placeholder="Enter thank you message"
                      className="w-full px-3 py-2 border rounded mb-3 resize-none flex-1 min-h-[150px]"
                    />

                    <button
                      className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-green-700"
                      onClick={async () => {
                        try {
                          await axiosInstance.post("/survey/save-thankyou", {
                            survey_id: id,
                            thank_you_message: thankYouMessage,
                            client_logo: clientLogo,
                          });

                          toast.success("Saved successfully!");
                        } catch (err) {
                          toast.error("Failed to save");
                        }
                      }}
                    >
                      Save
                    </button>
                  </>
                )}
              </div>

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
    </section >
  );
}

export default SurveyDetails;