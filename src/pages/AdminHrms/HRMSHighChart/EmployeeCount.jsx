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
        let total = dashboardData.gender_all_employee_count;
        // dashboardData.gender_wise.forEach((item) => {
        //   total += item.employee_count;
        // });
        setTotalEmployees({ Total: total });
      } else {
        if (!siteId || siteId.trim() === "" || siteId === "all") {
          const res = await getTotalHRMSEmployeeCount(hrmsOrgId);
          setTotalEmployees(res || []);
        } else {
          // const res = await getTotalHRMSEmployeeCount(hrmsOrgId, siteId);
          setTotalEmployees(res || [0]);
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