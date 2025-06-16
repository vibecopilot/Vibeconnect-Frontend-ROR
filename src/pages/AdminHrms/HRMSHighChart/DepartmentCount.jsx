import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import {
  getDepartmentCount,
  getAllDepartmentCount,
  getGenderCount,
  getLocationCount,
} from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaDownload} from "react-icons/fa";

const DepartmentCount = ({ dashboardData, siteId }) => {
  const [selectedOption, setSelectedOption] = useState("Department");
  const [departmentData, setDepartmentData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const fetchDepartmentData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      let res;
      // Use org-level API if no site is selected or siteId equals "all"
      if (
        !siteId ||
        siteId.site_name === "Select All Sites" ||
        siteId === "all"
      ) {
        res = await getDepartmentCount(hrmsOrgId);
      } else {
        // When a specific site is selected, use dashboardData if available,
        // otherwise force an empty array.
        if (
          dashboardData &&
          dashboardData.department_wise &&
          dashboardData.department_wise.length > 0
        ) {
          res = dashboardData.department_wise;
        } else {
          res = [];
        }
      }

      // Unify the shape:
      // Org-level returns { id, name, employee_count }
      // Site-level returns { department_id, department__name, employee_count }
      const unifiedData = (res || []).map((item) => ({
        department_id: item.department_id ?? item.id,
        department__name: item.department__name ?? item.name,
        employee_count: item.employee_count,
      }));
      setDepartmentData(unifiedData);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setDepartmentData([]);
        setErrorMsg("No department data found for the selected site.");
      } else {
        setDepartmentData([]);
        setErrorMsg("Error loading department data.");
      }
      console.error("Error in fetchDepartmentData:", error);
    } finally {
      setLoading(false);
    }
  };

  // (The fetchLocationData and fetchGenderData functions remain unchanged.)
  const fetchLocationData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      let res;
      if (
        !siteId ||
        siteId.site_name === "Select All Sites" ||
        siteId === "all"
      ) {
        res = await getLocationCount(hrmsOrgId);
      } else if (dashboardData && dashboardData.location_wise) {
        res = dashboardData.location_wise;
      } else {
        res = [];
      }
      setLocationData(res || []);
    } catch (error) {
      console.error("Error in fetchLocationData:", error);
      setLocationData([]);
      setErrorMsg("Error loading location data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchGenderData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      let res;
      if (
        !siteId ||
        siteId.site_name === "Select All Sites" ||
        siteId === "all"
      ) {
        res = await getGenderCount(hrmsOrgId);
      } else if (dashboardData && dashboardData.gender_wise) {
        res = dashboardData.gender_wise;
      } else {
        res = [];
      }
      setGenderData(res || []);
    } catch (error) {
      console.error("Error in fetchGenderData:", error);
      setGenderData([]);
      setErrorMsg("Error loading gender data.");
    } finally {
      setLoading(false);
    }
  };

  // Call the appropriate fetch function when selectedOption, siteId, or dashboardData changes.
  useEffect(() => {
    if (selectedOption.toLowerCase() === "department") {
      fetchDepartmentData();
    } else if (selectedOption.toLowerCase() === "location") {
      fetchLocationData();
    } else if (selectedOption.toLowerCase() === "gender") {
      fetchGenderData();
    } else {
      fetchDepartmentData();
    }
  }, [selectedOption, siteId, dashboardData]);

  if (loading) return <div>Loading...</div>;
  if (errorMsg) return <div>{errorMsg}</div>;

  let chartOptions = {};

  if (selectedOption.toLowerCase() === "department") {
    // Build unified chart data from departmentData.
    const departmentChartData = departmentData.reduce((acc, item) => {
      const name = item.department__name || "Unknown";
      acc[name] = (acc[name] || 0) + item.employee_count;
      return acc;
    }, {});

    // If there's no data, use a placeholder slice.
    // We set y: 1 (nonzero) so the pie renders, but in our formatter we display "0".
    const seriesData =
      Object.keys(departmentChartData).length > 0
        ? Object.keys(departmentChartData).map((key) => ({
            name: key,
            y: departmentChartData[key],
          }))
        : [{ name: "No department data", y: 0 }];

    chartOptions = {
      chart: { type: "pie" },
      title: "",
      tooltip: {
        formatter: function () {
          if (this.point.name === "No department data") {
            return "No department data";
          } else {
            return `${this.point.name}: <b>${
              this.point.y
            }</b> (${this.point.percentage.toFixed(1)}%)`;
          }
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return this.point.name === "No department data"
                ? "0"
                : this.point.y;
            },
            style: { fontSize: "10px", color: "#000" },
          },
          showInLegend: true,
        },
      },
      legend: {
        align: "center",
        verticalAlign: "bottom",
        layout: "horizontal",
        itemMarginRight: 10,
        itemStyle: { fontSize: "10px" },
      },
      series: [
        {
          name: "Employees",
          colorByPoint: true,
          data: seriesData,
        },
      ],
      credits: { enabled: false },
    };
  } else if (selectedOption.toLowerCase() === "location") {
    const locationChartData = locationData.map((item) => ({
      name: item.branch_location__location || "No Data",
      y: item.employee_count,
    }));
    chartOptions = {
      chart: { type: "pie" },
      title: "",
      tooltip: { pointFormat: "{series.name}: <b>{point.y}</b> employees" },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          showInLegend: true,
          dataLabels: {
            enabled: true,
            format: "{point.y}",
            style: { fontSize: "10px", color: "#000" },
          },
        },
      },
      legend: {
        align: "center",
        verticalAlign: "bottom",
        layout: "horizontal",
        itemMarginRight: 10,
        itemStyle: { fontSize: "10px" },
      },
      series: [
        {
          name: "Employees",
          colorByPoint: true,
          data:
            locationChartData.length > 0
              ? locationChartData
              : [{ name: "No location data", y: 0 }],
        },
      ],
      credits: { enabled: false },
    };
  } else if (selectedOption.toLowerCase() === "gender") {
    const genderChartData = genderData.map((item) => ({
      name: item.gender,
      y: item.employee_count,
    }));
    chartOptions = {
      chart: { type: "pie" },
      title: "",
      tooltip: { pointFormat: "{series.name}: <b>{point.y}</b> employees" },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          showInLegend: true,
        },
      },
      legend: {
        align: "center",
        verticalAlign: "bottom",
        layout: "horizontal",
        itemMarginRight: 10,
        itemStyle: { fontSize: "10px" },
      },
      series: [
        {
          name: "Employees",
          colorByPoint: true,
          data:
            genderChartData.length > 0
              ? genderChartData
              : [{ name: "No gender data", y: 0 }],
        },
      ],
      credits: { enabled: false },
    };
  }

  const downloadPieChart = () => {
    const input = document.getElementById("piechart-content");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("portrait", "mm", "a6");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 1;
      const availableWidth = pageWidth - margin * 1;
      const imgHeight = pageHeight * 0.9;
      pdf.addImage(imgData, "PNG", margin, margin, availableWidth, imgHeight);
      pdf.save("pirchart.pdf");
    });
  };
  return (
    <div className="ml-10 bg-white p-4 rounded-lg shadow-xl">
      {/* Row 1: Heading (Left) and Select (Right) */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-gray-600 font-semibold text-lg">
            Employee Head Count
          </h2>
        </div>
        <div className="flex gap-2 mt-4">
          <div>
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="border border-gray-300 rounded-lg p-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Department">Department</option>
              <option value="Location">Location</option>
              <option value="Gender">Gender</option>
            </select>
          </div>
          <div className="mb-4">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-slate-300  hover:bg-blue-400 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm"
              onClick={downloadPieChart}
            >
              <FaDownload />
            </button>
          </div>
        </div>
      </div>
      {/* Row 3: Chart */}
      <div className="mt-4" id="piechart-content">
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    </div>
  );
};

export default DepartmentCount;

// <div className="ml-4 w-90 bg-white p-4 rounded-lg shadow-md">
//   {/* Header with Title and Select */}
//   <div className="flex justify-between items-center mb-4">
//     <h2 className="text-gray-600 font-semibold text-lg">
//       Employee count by {selectedOption.toLowerCase()}
//     </h2>
//     <select
//       value={selectedOption}
//       onChange={(e) => setSelectedOption(e.target.value)}
//       className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
//     >
//       <option value="Department">Department</option>
//       <option value="Location">Location</option>
//       <option value="Gender">Gender</option>
//     </select>
//   </div>

//   {/* Download Button */}
//   <button
//     className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm"
//     onClick={downloadPieChart}
//   >
//     PieCharts <FaDownload className="text-white" />
//   </button>

//   {/* Chart Section */}
//   <div className="mt-4">
//     <HighchartsReact highcharts={Highcharts} options={chartOptions} />
//   </div>
// </div>;
