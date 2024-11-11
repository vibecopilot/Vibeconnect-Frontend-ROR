import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import { getDepartmentCount } from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import { BiChevronDown } from "react-icons/bi";

const DepartmentCount = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");

  const fetchDepartmentData = async () => {
    try {
      const res = await getDepartmentCount(hrmsOrgId);
      setDepartmentData(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDepartmentData();
  }, []);

  // Aggregate employee count by department name
  const data = departmentData.reduce((acc, item) => {
    if (acc[item.name]) {
      acc[item.name] += item.employee_count;
    } else {
      acc[item.name] = item.employee_count;
    }
    return acc;
  }, {});

  // Format data for pie/doughnut chart
  const chartData = Object.keys(data).map((department) => ({
    name: department,
    y: data[department],
  }));
  const totalDepartments = Object.keys(data).length;

  // Pie chart configuration
  const pieChartOptions = {
    chart: {
      type: "pie",
    },
    title: {
      text: "",
      style: {
        fontSize: "16px",
        fontWeight: "600",
        color: "gray",
      },
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: "Employees",
        colorByPoint: true,
        data: chartData,
      },
    ],
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y}</b> ({point.percentage:.1f}%)",
    },
  };

  return (
    <div className="ml-4">
      <div className="flex justify-between m-2">
        <h2 className="text-gray-500 font-medium">
          Employee count by department
        </h2>
        <BiChevronDown size={30} />
      </div>
      <HighchartsReact highcharts={Highcharts} options={pieChartOptions} />
      <div className="flex justify-center">
        <p className="font-medium text-sm mb-2 flex items-center">
          Total Department : {totalDepartments}
        </p>
      </div>
      {/* <h2>Doughnut Chart</h2>
      <HighchartsReact
        highcharts={Highcharts}
        options={doughnutChartOptions}
      /> */}
    </div>
  );
};

export default DepartmentCount;
