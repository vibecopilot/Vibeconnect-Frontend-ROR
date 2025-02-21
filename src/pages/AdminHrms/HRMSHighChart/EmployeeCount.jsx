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

const EmployeeCount = ({ siteId }) => {
  const [totalEmployees, setTotalEmployees] = useState({});
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");

  const fetchEmployeeCount = async () => {
    try {
      const res = siteId
        ? await getTotalHRMSEmployeeCount(hrmsOrgId, siteId)
        : await getTotalHRMSEmployeeCount(hrmsOrgId);
      setTotalEmployees(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEmployeeCount();
  }, [siteId]);

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
