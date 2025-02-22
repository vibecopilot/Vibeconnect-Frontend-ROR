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
      if (!siteId || siteId.trim() === "" || siteId === "all") {
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
      if (!siteId || siteId.trim() === "" || siteId === "all") {
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
      if (!siteId || siteId.trim() === "" || siteId === "all") {
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
              : [{ name: "No gender data", y: 0}],
        },
      ],
      credits: { enabled: false },
    };
  }

  return (
    <div className="ml-4">
      <div className="flex justify-between m-2">
        <h2 className="text-gray-500 font-medium">
          Employee count by {selectedOption.toLowerCase()}
        </h2>
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="border border-gray-300 rounded p-1"
        >
          <option value="Department">Department</option>
          <option value="Location">Location</option>
          <option value="Gender">Gender</option>
        </select>
      </div>
      <div>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    </div>
  );
};

export default DepartmentCount;
