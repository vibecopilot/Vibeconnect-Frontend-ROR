import React from "react";
import Navbar from "../../../components/Navbar";
import { MdOutlineSignalCellularAlt2Bar } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import { RxArrowRight } from "react-icons/rx";
import Chart from "react-apexcharts";
function SampleResultSurvey() {
  const question1 = [
    { label: "Not at all likely - 0", value: 5965, percentage: "11.03%" },
    { label: "1", value: 2900, percentage: "5.36%" },
    { label: "2", value: 2228, percentage: "4.12%" },
    { label: "3", value: 2088, percentage: "3.86%" },
    { label: "4", value: 2747, percentage: "5.08%" },
    { label: "5", value: 5469, percentage: "10.12%" },
    { label: "6", value: 4211, percentage: "7.79%" },
    { label: "7", value: 5184, percentage: "9.59%" },
    { label: "8", value: 5930, percentage: "10.97%" },
    { label: "9", value: 4488, percentage: "8.3%" },
    { label: "Extremely likely - 10", value: 12850, percentage: "23.77%" },
    { label: "Total", value: 54066, percentage: "" },
  ];

  const totalAnswer1 = question1.reduce((sum, item) => sum + item.value, 0);
  const skipped1 = 10292;

  const chartOptionsQuestion1 = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "25%",
        distributed: false,
      },
    },
    xaxis: {
      categories: ["Question 1"],
      labels: {
        style: { fontSize: "12px" },
        show: false,
        align: "left",
      },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px" },
      },
    },
    grid: {
      show: true,
    },
    dataLabels: {
      enabled: false,
    },
    legend: { show: false },
  };

  const seriesQuestion1 = [
    {
      name: "Option A",
      data: [30],
      color: "#00C851", // Adjust the value as needed
    },
  ];
  const question2 = [
    { label: "Very satisfied", value: 22537, color: "#00C851" },
    { label: "Somewhat satisfied", value: 12453, color: "#007EFB" },
    {
      label: "Neither satisfied nor dissatisfied",
      value: 4749,
      color: "#CCCCCC",
    },
    { label: "Somewhat dissatisfied", value: 4284, color: "#FFA500" },
    { label: "Very dissatisfied", value: 5101, color: "#FF4444" },
  ];

  const totalAnswer2 = question2.reduce((sum, item) => sum + item.value, 0);
  const skipped2 = 10292;

  const chartOptionsQuestion2 = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "10%",
        distributed: false,
      },
    },
    xaxis: {
      categories: ["Question 2"],
      labels: {
        style: { fontSize: "12px" },
        show: false,
        align: "left",
      },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px" },
      },
    },
    grid: {
      show: true,
    },
    dataLabels: {
      enabled: false,
    },
    legend: { show: false },
  };

  const seriesQuestion2 = question2.map((item) => ({
    name: item.label,
    data: [item.value],
    color: item.color,
  }));

  const question3 = [
    { label: "Reliable", value: 18228, color: "#2ECC71" }, // Green
    { label: "High quality", value: 16575, color: "#3498DB" }, // Blue
    { label: "Useful", value: 13757, color: "#9B59B6" }, // Purple
    { label: "Unique", value: 8233, color: "#F39C12" }, // Orange
    { label: "Good value for money", value: 9976, color: "#E67E22" }, // Dark Orange
    { label: "Overpriced", value: 5502, color: "#E74C3C" }, // Red
    { label: "Impractical", value: 4823, color: "#C0392B" }, // Dark Red
    { label: "Ineffective", value: 4779, color: "#D35400" }, // Deep Orange
    { label: "Poor quality", value: 3768, color: "#8E44AD" }, // Dark Purple
    { label: "Unreliable", value: 3560, color: "#7F8C8D" }, // Gray
  ];

  const totalAnswer3 = question3.reduce((sum, item) => sum + item.value, 0);
  const skipped3 = 10292;

  const chartOptionsQuestion3 = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "10%",
        distributed: false,
      },
    },
    xaxis: {
      categories: ["Question 3"],
      labels: {
        style: { fontSize: "12px" },
        show: false,
        align: "left",
      },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px" },
      },
    },
    grid: {
      show: true,
    },
    dataLabels: {
      enabled: false,
    },
    legend: { show: false },
  };

  const seriesQuestion3 = question3.map((item) => ({
    name: item.label,
    data: [item.value],
    color: item.color,
  }));

  const question4 = [
    { label: "Extremely well", value: 17699, color: "#2ECC71" }, // Green
    { label: "Very well", value: 15153, color: "#3498DB" }, // Blue
    { label: "Somewhat well", value: 7592, color: "#9B59B6" }, // Purple
    { label: "Not so well", value: 3264, color: "#F39C12" }, // Orange
    { label: "Not at all well", value: 3330, color: "#E67E22" }, // Dark Orange
  ];

  const totalAnswer4 = question4.reduce((sum, item) => sum + item.value, 0);
  const skipped4 = 10292;

  const chartOptionsQuestion4 = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "10%",
        distributed: false,
      },
    },
    xaxis: {
      categories: ["Question 3"],
      labels: {
        style: { fontSize: "12px" },
        show: false,
        align: "left",
      },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px" },
      },
    },
    grid: {
      show: true,
    },
    dataLabels: {
      enabled: false,
    },
    legend: { show: false },
  };

  const seriesQuestion4 = question4.map((item) => ({
    name: item.label,
    data: [item.value],
    color: item.color,
  }));

  const question5 = [
    { label: "Very high quality", value: 15606, color: "#2ECC71" }, // Green
    { label: "High quality", value: 15352, color: "#3498DB" }, // Blue
    { label: "Neither high nor low quality", value: 7654, color: "#9B59B6" }, // Purple
    { label: "Low quality", value: 2869, color: "#F39C12" }, // Orange
    { label: "Very low quality", value: 3422, color: "#E67E22" }, // Dark Orange
  ];

  const totalAnswer5 = question5.reduce((sum, item) => sum + item.value, 0);
  const skipped5 = 292;

  const chartOptionsQuestion5 = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "10%",
        distributed: false,
      },
    },
    xaxis: {
      categories: ["Question 3"],
      labels: {
        style: { fontSize: "12px" },
        show: false,
        align: "left",
      },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px" },
      },
    },
    grid: {
      show: true,
    },
    dataLabels: {
      enabled: false,
    },
    legend: { show: false },
  };

  const seriesQuestion5 = question5.map((item) => ({
    name: item.label,
    data: [item.value],
    color: item.color,
  }));

  const question6 = [
    { label: "Excellent", value: 16529, color: "#2ECC71" }, // Green
    { label: "Above average", value: 12338, color: "#3498DB" }, // Blue
    { label: "Average", value: 9025, color: "#9B59B6" }, // Purple
    { label: "Below average", value: 3313, color: "#F39C12" }, // Orange
    { label: "Poor", value: 3691, color: "#E67E22" }, // Dark Orange
  ];
  const totalAnswer6 = question6.reduce((sum, item) => sum + item.value, 0);
  const skipped6 = 2192;
  const chartOptionsQuestion6 = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "10%",
        distributed: false,
      },
    },
    xaxis: {
      categories: ["Question 3"],
      labels: {
        style: { fontSize: "12px" },
        show: false,
        align: "left",
      },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px" },
      },
    },
    grid: {
      show: true,
    },
    dataLabels: {
      enabled: false,
    },
    legend: { show: false },
  };

  const seriesQuestion6 = question6.map((item) => ({
    name: item.label,
    data: [item.value],
    color: item.color,
  }));

  const question7 = [
    { label: "Extremely responsive", value: 1945, color: "#2ECC71" }, // Green
    { label: "Very responsive", value: 1550, color: "#3498DB" }, // Blue
    { label: "Somewhat responsive", value: 1340, color: "#9B59B6" }, // Purple
    { label: "Not so responsive", value: 654, color: "#F39C12" }, // Orange
    { label: "Not at all responsive", value: 353, color: "#E67E22" }, // Dark Orange
    { label: "Not applicable", value: 295, color: "#8E44AD" }, // Dark Orange
  ];
  const totalAnswer7 = question7.reduce((sum, item) => sum + item.value, 0);
  const skipped7 = 2192;
  const chartOptionsQuestion7 = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "10%",
        distributed: false,
      },
    },
    xaxis: {
      categories: ["Question 3"],
      labels: {
        style: { fontSize: "12px" },
        show: false,
        align: "left",
      },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px" },
      },
    },
    grid: {
      show: true,
    },
    dataLabels: {
      enabled: false,
    },
    legend: { show: false },
  };

  const seriesQuestion7 = question7.map((item) => ({
    name: item.label,
    data: [item.value],
    color: item.color,
  }));

  const question8 = [
    { label: "This is my first purchase", value: 13893, color: "#2ECC71" }, // Green
    { label: "Less than six months", value: 8147, color: "#3498DB" }, // Blue
    { label: "Six months to a year", value: 6291, color: "#9B59B6" }, // Purple
    { label: "1 - 2 years", value: 5171, color: "#F39C12" }, // Orange
    { label: "3 or more years", value: 9233, color: "#E67E22" }, // Dark Orange
    { label: "I haven't made a purchase yet", value: 3836, color: "#8E44AD" }, // Dark Orange
  ];

  const totalAnswer8 = question8.reduce((sum, item) => sum + item.value, 0);
  const skipped8 = 2992;
  const chartOptionsQuestion8 = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "10%",
        distributed: false,
      },
    },
    xaxis: {
      categories: ["Question 3"],
      labels: {
        style: { fontSize: "12px" },
        show: false,
        align: "left",
      },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px" },
      },
    },
    grid: {
      show: true,
    },
    dataLabels: {
      enabled: false,
    },
    legend: { show: false },
  };

  const seriesQuestion8 = question8.map((item) => ({
    name: item.label,
    data: [item.value],
    color: item.color,
  }));

  const question9 = [
    { label: "Extremely likely", value: 16854, color: "#2ECC71" }, // Green
    { label: "Very likely", value: 13508, color: "#3498DB" }, // Blue
    { label: "Somewhat likely", value: 8276, color: "#9B59B6" }, // Purple
    { label: "Not so likely", value: 3649, color: "#F39C12" }, // Orange
    { label: "Not at all likely", value: 4593, color: "#E67E22" }, // Dark Orange
  ];

  const totalAnswer9 = question9.reduce((sum, item) => sum + item.value, 0);
  const skipped9 = 992;

  const chartOptionsQuestion9 = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "10%",
        distributed: false,
      },
    },
    xaxis: {
      categories: ["Question 3"],
      labels: {
        style: { fontSize: "12px" },
        show: false,
        align: "left",
      },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px" },
      },
    },
    grid: {
      show: true,
    },
    dataLabels: {
      enabled: false,
    },
    legend: { show: false },
  };

  const seriesQuestion9 = question9.map((item) => ({
    name: item.label,
    data: [item.value],
    color: item.color,
  }));

  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex flex-col overflow-hidden my-5">
        <div className="grid grid-cols-12">
          <div className="col-span-9">
            <div className="flex flex-wrap justify-center gap-5 mx-12">
              <NavLink
                to="/admin/template-detail-survey"
                className={({ isActive }) =>
                  `p-3 cursor-pointer ${
                    isActive
                      ? "border-b-2 border-green-600 text-green-600 font-semibold"
                      : ""
                  }`
                }
              >
                Preview
              </NavLink>
              <NavLink
                to="/admin/sample-result-survey"
                className={({ isActive }) =>
                  `p-3 cursor-pointer ${
                    isActive
                      ? "border-b-2 border-green-600 text-green-600 font-semibold"
                      : ""
                  }`
                }
              >
                Sample Result
              </NavLink>
            </div>
            <div className="border-b border-inherit"></div>
            <div className="w-full p-8 space-y-5 h-screen overflow-y-auto ">
              <h2 className="text-sm font-medium text-gray-800 mb-4">
                1. How likely is it that you would recommend this company to a
                friend or colleague?
              </h2>
              <div>
                <Chart
                  options={chartOptionsQuestion1}
                  series={seriesQuestion1}
                  type="bar"
                  height={300}
                  align="left"
                />
              </div>
              <h2 className="font-medium flex justify-center">Total </h2>
              <div className="flex justify-center gap-3">
                <div className="flex gap-1">
                  <p className="font-normal text-gray-700 text-xs">Answered:</p>
                  <span className="font-normal text-gray-700 text-xs">
                    {totalAnswer1}
                  </span>
                </div>
                <div className="flex gap-1">
                  <p className="font-normal text-gray-600 text-xs">Skipped:</p>
                  <span className="font-normal text-gray-600 text-xs">
                    {skipped1}
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full border rounded-md border-gray-300 overflow-x-auto">
                  <thead>
                    <tr className="text-gray-700">
                      {question1.map((item, index) => (
                        <th
                          key={index}
                          className="px-4 py-2 text-center border border-gray-300 font-normal rounded-md"
                        >
                          {item.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {question1.map((item, index) => (
                        <td
                          key={index}
                          className="px-4 py-4 text-center text-gray-500 border border-gray-300"
                        >
                          <div className="flex gap-5 items-center justify-center">
                            <span className="font-normal text-gray-700 text-sm">
                              {item.value}
                            </span>
                            <span className="font-normal text-gray-700 text-sm">
                              {item.percentage}
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-800 mb-4">
                  2. Overall, how satisfied or dissatisfied are you with our
                  company?
                </h2>
                <div>
                  <Chart
                    options={chartOptionsQuestion2}
                    series={seriesQuestion2}
                    type="bar"
                    height={300}
                  />
                </div>
                <div className="mt-2">
                  <div className="flex justify-center gap-3">
                    <div className="flex gap-1">
                      <p className="font-normal text-gray-700 text-xs">
                        Answered:
                      </p>
                      <span className="font-normal text-gray-700 text-xs">
                        {totalAnswer2}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <p className="font-normal text-gray-600 text-xs">
                        Skipped:
                      </p>
                      <span className="font-normal text-gray-600 text-xs">
                        {skipped2}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-gray-200">
                    {question2.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between py-4 border-b border-gray-200"
                      >
                        <div className="flex items-center">
                          <span className="font-medium text-gray-600 text-xs">
                            {item.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="font-medium text-gray-600 text-xs">
                            {((item.value / totalAnswer2) * 100).toFixed(0)}%
                          </div>
                          <div className="font-medium text-gray-600 text-xs">
                            {item.value.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between py-4 font-semibold text-gray-800">
                      <h2 className="text-xs">Total Respondents</h2>
                      <div className="flex items-center gap-6">
                        <div className="text-xs">{totalAnswer2}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-800 mb-4">
                  3. Which of the following words would you use to describe our
                  products? Select all that apply.
                </h2>
                <div>
                  <Chart
                    options={chartOptionsQuestion3}
                    series={seriesQuestion3}
                    type="bar"
                    height={300}
                  />
                </div>
                <div className="mt-2">
                  <div className="flex justify-center gap-3">
                    <div className="flex gap-1">
                      <p className="font-normal text-gray-700 text-xs">
                        Answered:
                      </p>
                      <span className="font-normal text-gray-700 text-xs">
                        {totalAnswer3}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <p className="font-normal text-gray-600 text-xs">
                        Skipped:
                      </p>
                      <span className="font-normal text-gray-600 text-xs">
                        {skipped3}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-gray-200">
                    {question3.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between py-4 border-b border-gray-200"
                      >
                        <div className="flex items-center">
                          <span className="font-medium text-gray-600 text-xs">
                            {item.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="font-medium text-gray-600 text-xs">
                            {((item.value / totalAnswer3) * 100).toFixed(0)}%
                          </div>
                          <div className="font-medium text-gray-600 text-xs">
                            {item.value.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between py-4 font-semibold text-gray-800">
                      <h2 className="text-xs">Total Respondents</h2>
                      <div className="flex items-center gap-6">
                        <div className="text-xs">{totalAnswer3}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-800 mb-4">
                  4. How well do our products meet your needs?
                </h2>
                <div>
                  <Chart
                    options={chartOptionsQuestion4}
                    series={seriesQuestion4}
                    type="bar"
                    height={300}
                  />
                </div>
                <div className="mt-2">
                  <div className="flex justify-center gap-3">
                    <div className="flex gap-1">
                      <p className="font-normal text-gray-700 text-xs">
                        Answered:
                      </p>
                      <span className="font-normal text-gray-700 text-xs">
                        {totalAnswer4}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <p className="font-normal text-gray-600 text-xs">
                        Skipped:
                      </p>
                      <span className="font-normal text-gray-600 text-xs">
                        {skipped4}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-gray-200">
                    {question4.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between py-4 border-b border-gray-200"
                      >
                        <div className="flex items-center">
                          <span className="font-medium text-gray-600 text-xs">
                            {item.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="font-medium text-gray-600 text-xs">
                            {((item.value / totalAnswer4) * 100).toFixed(0)}%
                          </div>
                          <div className="font-medium text-gray-600 text-xs">
                            {item.value.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between py-4 font-semibold text-gray-800">
                      <h2 className="text-xs">Total Respondents</h2>
                      <div className="flex items-center gap-6">
                        <div className="text-xs">{totalAnswer4}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-800 mb-4">
                  5. How would you rate the quality of the product?
                </h2>
                <div>
                  <Chart
                    options={chartOptionsQuestion5}
                    series={seriesQuestion5}
                    type="bar"
                    height={300}
                  />
                </div>
                <div className="mt-2">
                  <div className="flex justify-center gap-3">
                    <div className="flex gap-1">
                      <p className="font-normal text-gray-700 text-xs">
                        Answered:
                      </p>
                      <span className="font-normal text-gray-700 text-xs">
                        {totalAnswer5}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <p className="font-normal text-gray-600 text-xs">
                        Skipped:
                      </p>
                      <span className="font-normal text-gray-600 text-xs">
                        {skipped5}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-gray-200">
                    {question5.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between py-4 border-b border-gray-200"
                      >
                        <div className="flex items-center">
                          <span className="font-medium text-gray-600 text-xs">
                            {item.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="font-medium text-gray-600 text-xs">
                            {((item.value / totalAnswer5) * 100).toFixed(0)}%
                          </div>
                          <div className="font-medium text-gray-600 text-xs">
                            {item.value.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between py-4 font-semibold text-gray-800">
                      <h2 className="text-xs">Total Respondents</h2>
                      <div className="flex items-center gap-6">
                        <div className="text-xs">{totalAnswer5}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-800 mb-4">
                  6. How would you rate the value for money of the product?
                </h2>
                <div>
                  <Chart
                    options={chartOptionsQuestion6}
                    series={seriesQuestion6}
                    type="bar"
                    height={300}
                  />
                </div>
                <div className="mt-2">
                  <div className="flex justify-center gap-3">
                    <div className="flex gap-1">
                      <p className="font-normal text-gray-700 text-xs">
                        Answered:
                      </p>
                      <span className="font-normal text-gray-700 text-xs">
                        {totalAnswer6}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <p className="font-normal text-gray-600 text-xs">
                        Skipped:
                      </p>
                      <span className="font-normal text-gray-600 text-xs">
                        {skipped6}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-gray-200">
                    {question6.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between py-4 border-b border-gray-200"
                      >
                        <div className="flex items-center">
                          <span className="font-medium text-gray-600 text-xs">
                            {item.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="font-medium text-gray-600 text-xs">
                            {((item.value / totalAnswer6) * 100).toFixed(0)}%
                          </div>
                          <div className="font-medium text-gray-600 text-xs">
                            {item.value.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between py-4 font-semibold text-gray-800">
                      <h2 className="text-xs">Total Respondents</h2>
                      <div className="flex items-center gap-6">
                        <div className="text-xs">{totalAnswer6}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-800 mb-4">
                  7. How responsive have we been to your questions about our
                  services?
                </h2>
                <div>
                  <Chart
                    options={chartOptionsQuestion7}
                    series={seriesQuestion7}
                    type="bar"
                    height={300}
                  />
                </div>
                <div className="mt-2">
                  <div className="flex justify-center gap-3">
                    <div className="flex gap-1">
                      <p className="font-normal text-gray-700 text-xs">
                        Answered:
                      </p>
                      <span className="font-normal text-gray-700 text-xs">
                        {totalAnswer7}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <p className="font-normal text-gray-600 text-xs">
                        Skipped:
                      </p>
                      <span className="font-normal text-gray-600 text-xs">
                        {skipped7}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-gray-200">
                    {question7.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between py-4 border-b border-gray-200"
                      >
                        <div className="flex items-center">
                          <span className="font-medium text-gray-600 text-xs">
                            {item.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="font-medium text-gray-600 text-xs">
                            {((item.value / totalAnswer7) * 100).toFixed(0)}%
                          </div>
                          <div className="font-medium text-gray-600 text-xs">
                            {item.value.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between py-4 font-semibold text-gray-800">
                      <h2 className="text-xs">Total Respondents</h2>
                      <div className="flex items-center gap-6">
                        <div className="text-xs">{totalAnswer7}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-800 mb-4">
                  8. How long have you been a customer of our company?
                </h2>
                <div>
                  <Chart
                    options={chartOptionsQuestion8}
                    series={seriesQuestion8}
                    type="bar"
                    height={300}
                  />
                </div>
                <div className="mt-2">
                  <div className="flex justify-center gap-3">
                    <div className="flex gap-1">
                      <p className="font-normal text-gray-700 text-xs">
                        Answered:
                      </p>
                      <span className="font-normal text-gray-700 text-xs">
                        {totalAnswer8}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <p className="font-normal text-gray-600 text-xs">
                        Skipped:
                      </p>
                      <span className="font-normal text-gray-600 text-xs">
                        {skipped8}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-gray-200">
                    {question8.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between py-4 border-b border-gray-200"
                      >
                        <div className="flex items-center">
                          <span className="font-medium text-gray-600 text-xs">
                            {item.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="font-medium text-gray-600 text-xs">
                            {((item.value / totalAnswer8) * 100).toFixed(0)}%
                          </div>
                          <div className="font-medium text-gray-600 text-xs">
                            {item.value.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between py-4 font-semibold text-gray-800">
                      <h2 className="text-xs">Total Respondents</h2>
                      <div className="flex items-center gap-6">
                        <div className="text-xs">{totalAnswer8}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-800 mb-4">
                  9. How likely are you to purchase any of our products again?
                </h2>
                <div>
                  <Chart
                    options={chartOptionsQuestion9}
                    series={seriesQuestion9}
                    type="bar"
                    height={300}
                  />
                </div>
                <div className="mt-2">
                  <div className="flex justify-center gap-3">
                    <div className="flex gap-1">
                      <p className="font-normal text-gray-700 text-xs">
                        Answered:
                      </p>
                      <span className="font-normal text-gray-700 text-xs">
                        {totalAnswer9}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <p className="font-normal text-gray-600 text-xs">
                        Skipped:
                      </p>
                      <span className="font-normal text-gray-600 text-xs">
                        {skipped9}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-gray-200">
                    {question9.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between py-4 border-b border-gray-200"
                      >
                        <div className="flex items-center">
                          <span className="font-medium text-gray-600 text-xs">
                            {item.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="font-medium text-gray-600 text-xs">
                            {((item.value / totalAnswer9) * 100).toFixed(0)}%
                          </div>
                          <div className="font-medium text-gray-600 text-xs">
                            {item.value.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between py-4 font-semibold text-gray-800">
                      <h2 className="text-xs">Total Respondents</h2>
                      <div className="flex items-center gap-6">
                        <div className="text-xs">{totalAnswer9}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-3 border-l py-5">
            <div className="space-y-5 px-5">
              <h2 className="text-2xl">Customer Satisfaction Template</h2>
              <div className="flex gap-2 items-center">
                <div className="w-6 h-6 rounded-full bg-gray-200 shadow-lg flex justify-center items-center">
                  <MdOutlineSignalCellularAlt2Bar size={25} />
                </div>
                <p className="text-gray-700">Benchmarks available</p>
              </div>
              <p className="font-sans">
                Your customers’ happiness directly influences your company’s
                longevity. Be sure to get feedback directly from the people who
                matter. Our Customer Satisfaction Survey Template will measure
                your product’s value and quality, helping you gauge
                opportunities for improvement.
              </p>
              <p className="text-sm from-neutral-600 text-gray-800">
                You can always make changes to the theme and template.
              </p>
            </div>
            <div className="border-t my-5 p-5 space-y-5">
              <div className="border p-3 space-y-2 rounded-md">
                <h2 className="text-sm font-medium">Premium features</h2>
                <p className="text-xs">This template contains paid features</p>
              </div>
              <div className="w-full">
                <Link
                  to={`/admin/edit-template-survey`}
                  className="bg-yellow-500 rounded-md w-full py-2 px-6 flex justify-center  items-center gap-8"
                >
                  <h2>Use This Template</h2>
                  <span>
                    <RxArrowRight size={20} />
                  </span>
                </Link>
              </div>
              <p className="text-sm font-normal text-gray-600">
                Didn’t find what you’re looking for?
              </p>
              <div>
                <Link
                  to={`/admin/create-scratch-survey`}
                  className="font-medium text-sm text-sky-800"
                >
                  Start with a blank survey
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SampleResultSurvey;
