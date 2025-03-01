import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import { getTotalHRMSEmployeeCount } from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const EmployeeCount = ({ dashboardData, siteId }) => {
  const [totalEmployees, setTotalEmployees] = useState({});
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");

  const fetchEmployeeCount = async () => {
    try {
      // If we have site-level data (dashboardData) and specifically gender_wise, sum it up
      if (dashboardData && dashboardData.gender_wise) {
        let total = dashboardData.gender_all_employee_count;
        // dashboardData.gender_wise.forEach((item) => {
        //   total += item.employee_count;
        // });
        setTotalEmployees({ Total: total });
      } else {
        if (
          !siteId ||
          siteId.site_name === "Select All Sites" ||
          siteId === "all"
        ) {
          const res = await getTotalHRMSEmployeeCount(hrmsOrgId);
          setTotalEmployees(res || []);
        } else {
          // const res = await getTotalHRMSEmployeeCount(hrmsOrgId, siteId);
          setTotalEmployees([0]);
        }
      }
    } catch (error) {
      console.log("Error in fetchEmployeeCount:", error);
      setTotalEmployees({});
    }
  };

  useEffect(() => {
    fetchEmployeeCount();
  }, [siteId, dashboardData]);

  // Generate Highcharts config
  const generateChartOptions = (title, data) => {
    // Check if there's no data or all counts are zero.
    const isNoData =
      !data ||
      Object.keys(data).length === 0 ||
      Object.values(data).every((val) => Number(val) === 0);

    return {
      chart: {
        type: "column",
        borderRadius: 30,
      },
      title: {
        text: title,
        style: {
          fontSize: "16px",
          fontWeight: "600",
          color: "gray",
        },
      },
      xAxis: {
        categories: isNoData ? ["No employee Count"] : Object.keys(data),
      },
      yAxis: {
        title: {
          text: "Value ",
        },
        allowDecimals: false,
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
          },
        },
      },
      credits: { enabled: false },
      series: [
        {
          name: title,
          colorByPoint: true,
          data: isNoData
            ? [{ name: "No employee Count", y: 0 }]
            : Object.keys(data).map((key) => ({
                name: key,
                y: data[key],
              })),
        },
      ],
    };
  };

  const downloadBarChart = () => {
    const input = document.getElementById("barchart-content");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("portrait", "mm", "a6");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const availableWidth = pageWidth - margin * 1;
      // Calculate the height preserving the aspect ratio
      const originalImgHeight = (canvas.height * availableWidth) / canvas.width;
      const increasedImgHeight = originalImgHeight * 1;
      pdf.addImage(
        imgData,
        "PNG",
        margin,
        margin,
        availableWidth,
        increasedImgHeight
      );
      pdf.save("pirchart.pdf");
    });
  };

  return (
    <div className="ml-10 bg-white p-4 rounded-lg shadow-xl">
      <div className="flex gap-2 mt-4">
        <button
          className="flex items-center my-1 gap-2 px-4 py-2 bg-slate-300  hover:bg-blue-400 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm"
          onClick={downloadBarChart}
        >
          <FaDownload />
        </button>
      </div>
      <div className="mt-4 mx-10 px-5 py-1" id="barchart-content">
        <HighchartsReact
          highcharts={Highcharts}
          options={generateChartOptions("Employee head count", totalEmployees)}
        />
      </div>
    </div>
  );
};

export default EmployeeCount;
