import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import { Link } from "react-router-dom";
import { AiFillQuestionCircle } from "react-icons/ai";
import Chart from "react-apexcharts";
import { FaChartBar, FaCheck, FaPaperPlane, FaPencilAlt } from "react-icons/fa";
import { GrShare } from "react-icons/gr";
import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";
import { getSurvey, updateSurvey } from "../../../api";

function SurveyDetails() {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [activating, setActivating] = useState(false);

  const fetchSurvey = () => {
    if (!id) return;
    getSurvey(id)
      .then((res) => setSurvey(res.data))
      .catch(() => setSurvey(null));
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
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden mb-8">
        <div className="flex justify-between mt-5">
          <h1 className="text-2xl font-bold">{survey.survey_title || "Survey Details"}</h1>
          <div className="flex gap-2">
            <Link
              to={`/admin/result-analyze-result?survey_id=${id}`}
              className="bg-green-500 text-white p-1 px-5 flex items-center gap-2 rounded-md"
            >
              <h2>Analyze Result</h2>
            </Link>
            <Link
              to={`/admin/preview-survey/${id}`}
              className="bg-green-500 text-white p-1 px-5 flex items-center gap-2 rounded-md"
            >
              <h2>Preview Survey</h2>
              <span>
                <GrShare />
              </span>
            </Link>
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

              {/* Steps */}
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="relative flex flex-col items-center group"
                >
                  {/* Step Circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 
                  ${
                    step.status === "completed"
                      ? "bg-green-500 border-green-500"
                      : "bg-white border-gray-300"
                  }`}
                  >
                    {step.status === "completed" ? (
                      <FaCheck className="w-5 h-5 text-white" />
                    ) : (
                      <div
                        className={`w-5 h-5 flex items-center justify-center 
                    ${
                      step.status === "current"
                        ? "text-gray-600"
                        : "text-gray-400"
                    }`}
                      >
                        {step.icon}
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <span className="mt-3 text-sm font-medium whitespace-nowrap text-green-600">
                    <div className="flex items-center gap-2">
                      {step.icon}
                      {step.to ? (
                        <Link to={step.to}>{step.label}</Link>
                      ) : (
                        <button type="button" onClick={step.action} className="text-left hover:underline">
                          {step.label}
                        </button>
                      )}
                    </div>
                  </span>
                </div>
              ))}
            </div>
          </div>
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
