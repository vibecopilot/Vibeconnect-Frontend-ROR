import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import {
  getDepartmentCount,
  getGenderCount,
  getLocationCount,
} from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";


const DepartmentCount = ({ siteId }) => {
  const [selectedOption, setSelectedOption] = useState("Department");
  const [departmentData, setDepartmentData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");

  const fetchDepartmentData = async () => {
    try {
      const res = siteId
        ? await getDepartmentCount(hrmsOrgId, siteId)
        : await getDepartmentCount(hrmsOrgId);
      setDepartmentData(res);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLocationData = async () => {
    try {
      const res = siteId
        ? await getLocationCount(hrmsOrgId, siteId)
        : await getLocationCount(hrmsOrgId);
      setLocationData(res);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGenderData = async () => {
    try {
      const res = siteId
        ? await getGenderCount(hrmsOrgId, siteId)
        : await getGenderCount(hrmsOrgId);
      setGenderData(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Re-fetch when the filter option or siteId changes.
    if (selectedOption === "Department") {
      fetchDepartmentData();
    } else if (selectedOption === "Gender") {
      fetchGenderData();
    } else {
      fetchLocationData();
    }
  }, [selectedOption, siteId]);

  // Prepare data for Department chart
  const departmentChartData = departmentData.reduce((acc, item) => {
    if (acc[item.name]) {
      acc[item.name] += item.employee_count;
    } else {
      acc[item.name] = item.employee_count;
    }
    return acc;
  }, {});

  const departmentChartOptions = {
    chart: { type: "pie" },
    title: "",
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y}</b> ({point.percentage:.1f}%)",
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "{point.y}",
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
        data: Object.keys(departmentChartData).map((key) => ({
          name: key,
          y: departmentChartData[key],
        })),
      },
    ],
    credits: { enabled: false },
  };

  // Similar chart options for Location and Gender as in your existing code…
  const locationChartData = locationData.map((item) => ({
    name: item.location,
    y: item.employee_count,
  }));
  const locationChartOptions = {
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
        data: locationChartData,
      },
    ],
    credits: { enabled: false },
  };

  const genderChartData = genderData.map((item) => ({
    name: item.gender,
    y: item.employee_count,
  }));
  const genderChartOptions = {
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
        data: genderChartData,
      },
    ],
    credits: { enabled: false },
  };

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
        {selectedOption === "Department" ? (
          <HighchartsReact
            highcharts={Highcharts}
            options={departmentChartOptions}
          />
        ) : selectedOption === "Gender" ? (
          <HighchartsReact
            highcharts={Highcharts}
            options={genderChartOptions}
          />
        ) : (
          <HighchartsReact
            highcharts={Highcharts}
            options={locationChartOptions}
          />
        )}
      </div>
    </div>
  );
};

export default DepartmentCount;
