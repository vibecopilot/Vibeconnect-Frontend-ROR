import React from "react";
import Navbar from "../../../components/Navbar";
import { Link } from "react-router-dom";
import { AiFillQuestionCircle } from "react-icons/ai";
import Chart from "react-apexcharts";
import { FaChartBar, FaCheck, FaPaperPlane, FaPencilAlt } from "react-icons/fa";
import { GrShare } from "react-icons/gr";
function SurveyDetails() {
  const options = {
    chart: {
      type: "donut",
    },
    labels: ["vote", "not vote"],
    colors: ["#6366F1", "#F59E0B"], // Tailwind colors
    legend: {
      position: "bottom",
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
  };

  const series = [100, 0];

  const steps = [
    {
      id: 1,
      label: "Add questions",
      icon: <FaPencilAlt className="w-4 h-4" />,
      status: "completed",
    },
    {
      id: 2,
      label: "Go to Collect",
      icon: <FaPaperPlane className="w-4 h-4" />,
      status: "completed",
    },
    {
      id: 3,
      label: "Analyze your results",
      icon: <FaChartBar className="w-4 h-4" />,
      status: "completed",
    },
  ];
  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden mb-8">
        <div className="flex justify-between mt-5">
          <h1 className="text-2xl font-bold">Survey Details</h1>
          <div className="flex gap-2">
            <Link
              to={`/admin/result-analyze-result`}
              className="bg-green-500 text-white p-1 px-5 flex items-center gap-2 rounded-md"
            >
              <h2>Analyze Result</h2>
            </Link>
            <Link
              to={`/admin/preview-survey`}
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
                  <span
                    className={`mt-3 text-sm font-medium whitespace-nowrap
                ${
                  step.status === "completed"
                    ? "text-green-600"
                    : step.status === "current"
                    ? "text-gray-600"
                    : "text-gray-400"
                }`}
                  >
                    <div className="flex items-center gap-2">
                      <p>{step.icon}</p> <Link to={``}>{step.label}</Link>
                    </div>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-5 mt-5">
          <div className="flex justify-end gap-3 mx-5 col-span-12">
            <Link
              to={``}
              className="text-sky-500 border-r border-gray-700 pr-5 hover:underline"
            >
              Edit design
            </Link>
            <Link
              to={``}
              className="text-sky-500 border-r border-gray-700 pr-5 hover:underline"
            >
              Send survey
            </Link>
            <Link to={``} className="text-sky-500 hover:underline">
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
                    ESTIMATED COMPLETION RATE
                  </h3>
                  <div>
                    <h2 className="text-2xl">61%</h2>
                    <p className="text-sm text-gray-500">Completed</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-3">
                  <h3 className="text-gray-500 items-center text-sm">
                    ESTIMATED TIME TO COMPLETE
                  </h3>
                  <div>
                    <h2 className="text-2xl">2</h2>
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
                <p className="text-2xl font-medium">0</p>
              </div>
              <div className="flex flex-col items-start border-r border-gray-700 pr-5 space-y-4">
                <div className="flex justify-between items-center gap-x-2 w-full">
                  <h2 className="text-gray-500 text-sm">
                    OVERALL SURVEY STATUS
                  </h2>
                  <span className="h-2 w-2 bg-green-600 rounded-full text-green-900"></span>
                </div>
                <Link
                  to={`/admin/survey-collect-response`}
                  className="text-green-600 text-2xl"
                >
                  Open
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
                <h2 className="bg-orange-800 text-white text-sm px-5 w-fit p-1 rounded-b-md mx-5">
                  DRAFT
                </h2>
                <div className="flex justify-between m-5">
                  <div className="flex flex-col space-y-2">
                    <h2 className="text-sky-500 text-sm hover:underline">
                      Target Audience 1
                    </h2>
                    <p className="text-gray-500 text-sm flex gap-1">
                      Created: <span>Created: 2/28/2025</span>
                    </p>
                    <p className="text-gray-500 text-sm">
                      Looks like your collector is not quite set up yet.{" "}
                      <Link
                        to={``}
                        className="text-sky-500 text-sm underline hover:text-sm"
                      >
                        Set up collector
                      </Link>
                    </p>
                  </div>
                  <h2 className="text-gray-500 text-sm flex items-center gap-2">
                    Invoice: <span className="font-medium">N/A</span>
                  </h2>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl text-gray-800 mb-2">Responses Volume</h2>
              <div className="border rounded-md p-5 ">
                <h2 className="flex items-center justify-center gap-1">
                  No survey responses yet{" "}
                  <button className="text-sky-500 hover:text-sky-950 hover:underline">
                    What is this?
                  </button>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SurveyDetails;
