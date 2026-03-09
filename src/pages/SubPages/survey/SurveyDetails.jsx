import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import axiosInstance from "../../../api/axiosInstance";
import Chart from "react-apexcharts";
import { FaChartBar, FaPaperPlane, FaPencilAlt } from "react-icons/fa";
import { GrShare } from "react-icons/gr";
import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";
import { getSurvey, updateSurvey } from "../../../api";

function SurveyDetails() {
  const { id } = useParams();

  const shareableLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/survey/${id}`
      : "";

  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [activating, setActivating] = useState(false);
  const [emailList, setEmailList] = useState("");
  const [sendingEmails, setSendingEmails] = useState(false);
  const [mailMessage, setMailMessage] = useState("");
  const [responseCount, setResponseCount] = useState(0);

  useEffect(() => {
    setMailMessage(`Dear Participant, We would like to invite you to take part in our survey. Your feedback is extremely valuable and will help us improve our services and better understand user experiences. Please click the link below to begin the survey: ${shareableLink} The survey will only take a few minutes to complete, and your responses will be kept confidential. Thank you for your time and participation. Best regards, Survey Team`);
  }, [shareableLink]);

  const chartOptions = {
    chart: { type: "donut" },
    labels: ["Responses", "Remaining"],
    colors: ["#22c55e", "#e5e7eb"],
    legend: { show: false },
    dataLabels: { enabled: false }
  };

  const chartSeries = responseCount > 0 ? [responseCount, 100 - responseCount] : [0, 100];

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
      const res = await getSurvey(id);
      setSurvey(res.data);
      if (res.data?.responses) {
        setResponseCount(res.data.responses.length);
      }
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

      await axiosInstance.post("/send_survey_emails", {
        survey_id: id,
        emails,
        message: mailMessage,
        link: shareableLink
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

      <div className="w-full px-10 py-8 space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{survey?.survey_title}</h1>

          <Link
            to={`/admin/preview-survey/${id}`}
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            Preview
            <GrShare />
          </Link>
        </div>

        {/* Progress Stepper */}
        <div className="bg-white rounded-xl border shadow-sm p-6 flex justify-between">

          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center w-full">

              <div className="flex items-center w-full justify-center">
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                  {step.icon}
                </div>

                {index !== steps.length - 1 && (
                  <div className="flex-1 h-1 bg-gray-200"></div>
                )}
              </div>

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

        {/* Dashboard Cards */}
        <div className="grid grid-cols-3 gap-6">

          <div className="bg-white rounded-xl border shadow-sm p-6 text-center">
            <p className="text-gray-500 text-sm">Total Responses</p>
            <p className="text-4xl font-bold mt-2">{responseCount}</p>
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

          <h2 className="text-lg font-semibold mb-6">
            Response Overview
          </h2>

          <div className="w-[280px] mx-auto">
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="donut"
              height={250}
            />
          </div>

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

