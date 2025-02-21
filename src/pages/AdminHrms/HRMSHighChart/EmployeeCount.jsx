import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import { getTotalHRMSEmployeeCount } from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";
// import Highcharts from "highcharts";

// const EmployeeCount = () => {
//   const [totalEmployees, setTotalEmployees] = useState({});
//   const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
//   const fetchEmployeeCount = async () => {
//     try {
//       const res = await getTotalHRMSEmployeeCount(hrmsOrgId);
//       setTotalEmployees(res);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   useEffect(() => {
//     fetchEmployeeCount();
//   }, []);

//   const generatePieChartOptions = (title, data) => {
//     return {
//       chart: {
//         type: "column",
//         borderRadius: 30,
//       },
//       title: {
//         text: title,
//         style: {
//             fontSize: "16px",
//             fontWeight: "600",
//             color: "gray"
//           },
//       },
//       plotOptions: {
//         pie: {
//           innerSize: "80%",
//         },
//       },
//       credits: {
//         enabled: false,
//       },
//       series: [
//         {
//           name: title,
//           colorByPoint: true,
//           data: Object.keys(data).map((key) => ({
//             name: key,
//             y: data[key],
//           })),
//         },
//       ],
//     };
//   };

//   return (
//     <div className="ml-4">
//       <HighchartsReact
//         highcharts={Highcharts}
//         options={generatePieChartOptions("Employee head count", totalEmployees)}
//       />
//     </div>
//   );
// };

// export default EmployeeCount;

// const EmployeeCount = ({ dashboardData, siteId }) => {
//   const [totalEmployees, setTotalEmployees] = useState({});
//   const hrmsOrgId = getItemInLocalStorage("HRMSORGID");

//   const fetchEmployeeCount = async () => {
//     try {
//       if (dashboardData) {
//         const employeeCount = dashboardData.gender[0] + dashboardData.gender[1];
//         setTotalEmployees("employeeCount:",employeeCount.data);
//       } else {
//         const res = siteId
//           ? await getTotalHRMSEmployeeCount(hrmsOrgId, siteId)
//           : await getTotalHRMSEmployeeCount(hrmsOrgId);
//         setTotalEmployees(res);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//     console.log("totalEmployees:", totalEmployees);
//   };

//   useEffect(() => {
//     fetchEmployeeCount();
//   }, [siteId]);

//   const generateChartOptions = (title, data) => ({
//     chart: {
//       type: "column",
//       borderRadius: 30,
//     },
//     title: {
//       text: title,
//       style: {
//         fontSize: "16px",
//         fontWeight: "600",
//         color: "gray",
//       },
//     },
//     plotOptions: {
//       column: {
//         dataLabels: {
//           enabled: true,
//         },
//       },
//     },
//     credits: { enabled: false },
//     series: [
//       {
//         name: title,
//         colorByPoint: true,
//         data: Object.keys(data).map((key) => ({
//           name: key,
//           y: data[key],
//         })),
//       },
//     ],
//   });

//   return (
//     <div className="ml-4">
//       <HighchartsReact
//         highcharts={Highcharts}
//         options={generateChartOptions("Employee head count", totalEmployees)}
//       />
//     </div>
//   );
// };

// export default EmployeeCount;

const EmployeeCount = ({ dashboardData, siteId }) => {
  const [totalEmployees, setTotalEmployees] = useState({});
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");

  const fetchEmployeeCount = async () => {
    try {
      // If we have site-level data (dashboardData) and specifically gender_wise, sum it up
      if (dashboardData && dashboardData.gender_wise) {
        let total = 0;
        dashboardData.gender_wise.forEach((item) => {
          total += item.employee_count;
        });
        // Store it as an object so Highcharts can map it easily
        setTotalEmployees({ Total: total });
      }
      // Otherwise, call the org-level or site-level total if siteId is given
      else {
        // If siteId is empty or "all", call org-level
        if (!siteId || siteId.trim() === "" || siteId === "all") {
          const res = await getTotalHRMSEmployeeCount(hrmsOrgId);
          // Suppose res = { total: 146 } or similar
          setTotalEmployees(res || {});
        } else {
          // If a specific site is selected but no site-level data is available yet
          const res = await getTotalHRMSEmployeeCount(hrmsOrgId, siteId);
          setTotalEmployees(res || {});
        }
      }
    } catch (error) {
      console.log("Error in fetchEmployeeCount:", error);
      setTotalEmployees({});
    }
  };

  // Re-run whenever siteId or dashboardData changes
  useEffect(() => {
    fetchEmployeeCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId, dashboardData]);

  // Generate Highcharts config
  const generateChartOptions = (title, data) => ({
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
        data: Object.keys(data).map((key) => ({
          name: key,
          y: data[key],
        })),
      },
    ],
  });

  return (
    <div className="ml-4">
      <HighchartsReact
        highcharts={Highcharts}
        options={generateChartOptions("Employee head count", totalEmployees)}
      />
    </div>
  );
};

export default EmployeeCount;
