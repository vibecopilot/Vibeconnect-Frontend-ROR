import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import {
  getDepartmentCount,
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

  // Use passed dashboardData if available; otherwise, call the org-level API.
  // const fetchDepartmentData = async () => {
  //   try {
  //     if (dashboardData) {
  //       setDepartmentData(dashboardData.department_wise);
  //     } else {
  //       const res = await getDepartmentCount(hrmsOrgId);
  //       setDepartmentData(res);
  //     }
  //   } catch (error) {
  //     console.error("Error in fetchDepartmentData:", error);
  //   }
  // };

  // const fetchDepartmentData = async () => {
  //   try {
  //     // When "all" (or no site) is selected, call the org-level API.
  //     if ( !siteId || siteId.trim() === "" ) {
  //       const res = await getDepartmentCount(hrmsOrgId);
  //       console.log(res);
  //       setDepartmentData(res || []);
  //     }
  //     // Otherwise, if dashboardData is provided, use it.
  //     else if (dashboardData && dashboardData.department_wise) {
  //       setDepartmentData(dashboardData.department_wise);
  //     } else {
  //       // Fallback: call the org-level API.
  //       const res = await getDepartmentCount(hrmsOrgId);
  //       setDepartmentData(res || []);
  //     }
  //   } catch (error) {
  //     console.error("Error in fetchDepartmentData:", error);
  //     setDepartmentData([]);
  //   }
  // };

  // const fetchLocationData = async () => {
  //   try {
  //     if (dashboardData) {
  //       setLocationData(dashboardData.location_wise);
  //     } else {
  //       const res = await getLocationCount(hrmsOrgId);
  //       setLocationData(res);
  //     }
  //   } catch (error) {
  //     console.error("Error in fetchLocationData:", error);
  //   }
  // };

  // const fetchGenderData = async () => {
  //   try {
  //     if (dashboardData) {
  //       setGenderData(dashboardData.gender_wise);
  //     } else {
  //       const res = await getGenderCount(hrmsOrgId);
  //       setGenderData(res);
  //     }
  //   } catch (error) {
  //     console.error("Error in fetchGenderData:", error);
  //   }
  // };

  // const fetchDepartmentData = async () => {
  //   try {
  //     let res;

  //     // 1) If no site is selected or siteId is blank, call org-level API
  //     if (!siteId || siteId.trim() === "") {
  //       res = await getDepartmentCount(hrmsOrgId);
  //     }
  //     // 2) If we do have site-level dashboardData, use that
  //     else if (dashboardData && dashboardData.department_wise) {
  //       res = dashboardData.department_wise;
  //     }
  //     // 3) Otherwise, fallback to org-level
  //     else {
  //       res = await getDepartmentCount(hrmsOrgId);
  //     }

  //     // -- UNIFY the shape --
  //     const unifiedData = (res || []).map((item) => ({
  //       department_id: item.department_id ?? item.id,
  //       department__name: item.department__name ?? item.name,
  //       employee_count: item.employee_count,
  //     }));

  //     setDepartmentData(unifiedData);
  //   } catch (error) {
  //     console.error("Error in fetchDepartmentData:", error);
  //     setDepartmentData([]);
  //   }
  // };
  
    // Fetch and unify department data from either the org-level API or dashboardData
    const fetchDepartmentData = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        let res;
        if (!siteId || siteId.trim() === "") {
          res = await getDepartmentCount(hrmsOrgId);
        } else if (dashboardData && dashboardData.department_wise) {
          res = dashboardData.department_wise;
        } else {
          res = await getDepartmentCount(hrmsOrgId);
        }
        // Unify the object shape: org-level returns { id, name, employee_count }
        // and site-level returns { department_id, department__name, employee_count }
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
  
    // Fetch location data (no need to unify keys here if the API is consistent)
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
          res = await getLocationCount(hrmsOrgId);
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
  
    // Fetch gender data (assumed consistent in structure)
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
          res = await getGenderCount(hrmsOrgId);
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
  
    // One useEffect to call the proper fetch function based on the selected option
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
  
    // While loading, show a loading indicator
    if (loading) return <div>Loading...</div>;
  
    // If there is an error message, display it
    if (errorMsg) return <div>{errorMsg}</div>;
  
    // Determine chart options based on selected option
    let chartOptions = {};
    if (selectedOption.toLowerCase() === "department") {
      if (!departmentData || departmentData.length === 0)
        return <div>No department data available.</div>;
      // Build chart data using unified field name "department__name"
      const departmentChartData = departmentData.reduce((acc, item) => {
        const name = item.department__name || "Unknown";
        acc[name] = (acc[name] || 0) + item.employee_count;
        return acc;
      }, {});
      chartOptions = {
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
    } else if (selectedOption.toLowerCase() === "location") {
      if (!locationData || locationData.length === 0)
        return <div>No location data available.</div>;
      const locationChartData = locationData.map((item) => ({
        name: item.branch_location__location || "Unknown",
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
            data: locationChartData,
          },
        ],
        credits: { enabled: false },
      };
    } else if (selectedOption.toLowerCase() === "gender") {
      if (!genderData || genderData.length === 0)
        return <div>No gender data available.</div>;
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
            data: genderChartData,
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
  