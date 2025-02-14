import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { RxExit } from "react-icons/rx";
import { FaRegUserCircle } from "react-icons/fa";
import Table from "../../components/table/Table";

import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSelector } from "react-redux";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { PiSignOutBold } from "react-icons/pi";
import { DNA } from "react-loader-spinner";
import {
  getClientDashboard,
  getEmployeeJobInfo,
  getAssociatedSite,
  getAssociatedSites,
  getTotalAttendance,
  getAttendance,
  getSiteWiseAttendance,
} from "../../api/index";
import { persistor } from "../../store/store";
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {
  const navigate = useNavigate();

  // UI States
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedData, setSelectedData] = useState(null);
  const [open, setOpen] = useState(false);
  const [isPieChart, setIsPieChart] = useState(true);

  // Data States
  const [clientData, setClientData] = useState(null); // overall client data array
  const [multiple_ass, setMultipleAssos] = useState([]); // Array of objects: { id, siteName }
  const [selectedSite, setSelectedSite] = useState("");
  const [siteWiseData, setSiteWiseData] = useState([]); // List of employees for selected site
  const [count, setCount] = useState(0);
  // overallAttendance holds the attendance for ALL sites when no site is selected.
  const [overallAttendance, setOverallAttendance] = useState(null);
  const [checkInData, setCheckInData] = useState([]);
  const [notCheckIn, setNotCheckIn] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState();
  const [showNotCheck, setShowNotCheckIn] = useState();
  // Existing states…
  // New state variables to keep the full list and the filtered list.
  const [fullSiteAttendanceRecords, setFullSiteAttendanceRecords] = useState(
    []
  );
  const [filteredSiteAttendanceRecords, setFilteredSiteAttendanceRecords] =
    useState([]);
  const [fullOverallAttendanceRecords, setFullOverallAttendanceRecords] =
    useState([]);
  const [
    filteredOverallAttendanceRecords,
    setFilteredOverallAttendanceRecords,
  ] = useState([]);

  // Chart States
  const [pieChartData, setPieChartData] = useState([
    { name: "Head Count", y: 0, color: "#f97316" },
    { name: "Present", y: 0, color: "#10b981" },
    { name: "Absent", y: 0, color: "#3b82f6" },
  ]);
  const [barChartData, setBarChartData] = useState([0, 0, 0]);

  // Table and absent record states
  const [attendanceTableRecords, setAttendanceTableRecords] = useState([]);
  const [absentRecord, setAbsentRecord] = useState(null);

  // User Info
  const lastName = JSON.parse(localStorage.getItem("LASTNAME") || '""');
  const firstName = JSON.parse(localStorage.getItem("Name") || '""');
  const fullName = `${firstName} ${lastName}`.trim();
  const themeColor = useSelector((state) => state.theme.color);

  // -------------------------------
  // LOGOUT HANDLER
  // -------------------------------
  const handleLogout = () => {
    [
      "TOKEN",
      "COMPANYID",
      "HRMS_EMPLOYEE_ID",
      // ... other keys as needed
    ].forEach((key) => localStorage.removeItem(key));
    persistor.purge(["board"]).then(() => {
      navigate("/login");
    });
  };

  // -------------------------------
  // FETCH OVERALL CLIENT DATA ON MOUNT
  // -------------------------------

  const fetchClientDashboardData = async (dateParam = selectedDate) => {
    try {
      const empId = localStorage.getItem("HRMS_EMPLOYEE_ID");
      const orgId = localStorage.getItem("HRMSORGID");

      // Fetch client dashboard data and set state
      const clientDataResponse = await getClientDashboard(empId);
      setClientData(clientDataResponse);
      console.log(clientDataResponse);

      // Format the date as YYYY-MM-DD
      const year = dateParam.getFullYear();
      const month = String(dateParam.getMonth() + 1).padStart(2, "0");
      const day = String(dateParam.getDate()).padStart(2, "0");
      const todayDate = `${year}-${month}-${day}`;

      // Fetch overall attendance which contains total_employee and total_present
      const allAttendance = await getTotalAttendance(empId, todayDate);
      const total_employee = allAttendance.total_employees || 0;
      const total_present = allAttendance.total_present || 0;
      const total_absent = Math.max(total_employee - total_present, 0);

      // Store overall attendance
      setOverallAttendance({
        total_employee,
        total_present,
        total_absent,
      });
      // setting all present emp data in the checkIndata state
      const checkIn = allAttendance.attendance;
      setCheckInData(checkIn);
      console.log("present id's:", checkIn);

      const notCheckedInEmployees = clientDataResponse.filter(
        (employee) =>
          !checkIn.some(
            (check) => Number(check.id) === Number(employee.vibe_id)
          )
      );
      console.log("Employees not checked in:", notCheckedInEmployees);
      // ----- BUILD OVERALL ATTENDANCE TABLE RECORDS -----
      // Combine the clientData and checkIn data to create a unified record.
      const overallAttendanceTableRecords = clientDataResponse.map((client) => {
        // Build employee full name (fallback to "N/A" if missing)
        const empName =
          `${client.first_name || ""} ${client.last_name || ""}`.trim() ||
          "N/A";
        // Determine status based on checkInData (comparing as strings for safety)
        const status = checkIn.some(
          (check) => String(check.id) === String(client.vibe_id)
        )
          ? "Present"
          : "Absent";
        return {
          id: client.id,
          vibe_id: client.vibe_id,
          empName,
          gender: client.gender,
          status,
          date: todayDate,
          // check_in:is_check_in,
        };
      });
      // Save full & filtered records (initially unfiltered)
      setFullOverallAttendanceRecords(overallAttendanceTableRecords);
      setFilteredOverallAttendanceRecords(overallAttendanceTableRecords);
      setNotCheckIn(notCheckedInEmployees);

      // Get HRMS admin data to extract associated site ids
      const hrmsAdminData = await getEmployeeJobInfo(empId);
      const multiple_asso = hrmsAdminData[0].multiple_associated;
      // console.log("Array for associated sites:", multiple_asso);

      // Fetch ALL sites for the organization
      const allSites = await getAssociatedSites(orgId);
      // console.log("All sites from API:", allSites);

      const siteNamesResult = multiple_asso.map((id) => {
        const matchingSite =
          Array.isArray(allSites) && allSites.length > 0
            ? allSites.find((site) => site.id === id)
            : null;
        const siteName = matchingSite ? matchingSite.site_name : "Not Found";
        return { id, siteName };
      });
      // console.log("Fetched site names:", siteNamesResult);
      setMultipleAssos(siteNamesResult);

      // Update the charts with overall attendance values
      setPieChartData([
        { name: "Head Count", y: total_employee, color: "#f97316" },
        { name: "Present", y: total_present, color: "#10b981" },
        { name: "Absent", y: total_absent, color: "#3b82f6" },
      ]);
      setBarChartData([total_employee, total_present, total_absent]);
      setCount(total_employee);
    } catch (error) {
      console.error("Error fetching client dashboard:", error);
    }
  };

  // Call fetchClientDashboardData on mount
  useEffect(() => {
    fetchClientDashboardData();
  }, []);
  // -------------------------------
  // FETCH SITE DATA AND ATTENDANCE (for a selected site)
  // -------------------------------
  const fetchSiteData = async (siteId, dateParam = selectedDate) => {
    try {
      // console.log("Selected Site ID:", siteId);
      // Fetch the list of employees for the selected site
      const siteRes = await getAssociatedSite(siteId);
      setSiteWiseData(siteRes);

      // Format the date as YYYY-MM-DD
      const year = dateParam.getFullYear();
      const month = String(dateParam.getMonth() + 1).padStart(2, "0");
      const day = String(dateParam.getDate()).padStart(2, "0");
      const todayDate = `${year}-${month}-${day}`;
      // console.log("Formatted Date:", todayDate);

      // Fetch attendance data for the site using the formatted date
      const attendanceRes = await getSiteWiseAttendance(siteId, todayDate);
      // console.log("Site Wise Attendance Data:", attendanceRes);

      const presentRecord = attendanceRes.attendance_data;
      // console.log("Attendance records:", presentRecord);

      const headCount = attendanceRes.total_employees || 0;
      const presentCount = attendanceRes.attended_employee_count || 0;
      const absentCount = headCount - presentCount;

      // Update site-specific charts and count
      setPieChartData([
        { name: "Head Count", y: headCount, color: "#f97316" },
        { name: "Present", y: presentCount, color: "#10b981" },
        { name: "Absent", y: absentCount, color: "#3b82f6" },
      ]);
      setBarChartData([headCount, presentCount, absentCount]);
      setCount(headCount);

      // Build a mapping for employee names from siteRes
      const employeeMap = siteRes.reduce((acc, employee) => {
        const name =
          `${employee.first_name || ""} ${employee.last_name || ""}`.trim() ||
          "N/A";
        acc[String(employee.id)] = name;
        return acc;
      }, {});
      // console.log("Employee Map:", employeeMap);

      // Build a mapping from attendance records for employee names (as a fallback)
      const attendanceNameMap = presentRecord.reduce((acc, record) => {
        if (record.employee) {
          const name = `${record.first_name || ""} ${
            record.last_name || ""
          }`.trim();
          if (name) {
            acc[String(record.employee)] = name;
          }
        }
        return acc;
      }, {});
      // console.log("Attendance Name Map:", attendanceNameMap);

      const presentEmployeeDetails = presentRecord
        .filter((record) => record.attendance_time.startsWith(todayDate))
        .map((record) => ({
          employee: String(record.employee),
          empName:
            `${record.first_name || ""} ${record.last_name || ""}`.trim() ||
            "N/A",
        }));
      // console.log("Present Employee Details:", presentEmployeeDetails);

      const presentEmployeeIDs = presentEmployeeDetails.map(
        (detail) => detail.employee
      );
      // console.log("Present Employee IDs:", presentEmployeeIDs);

      // Build absent record (employees not in the present list)
      const absentEmployees = siteRes
        .filter((employee) => !presentEmployeeIDs.includes(String(employee.id)))
        .map((employee) => {
          const empName =
            employeeMap[String(employee.id)] ||
            attendanceNameMap[String(employee.id)] ||
            "N/A";
          return {
            employee: employee.id,
            empName,
          };
        });
      const absentRecordObj = { absentrecord: absentEmployees };
      setAbsentRecord(absentRecordObj);
      console.log("Site Data:",siteRes );

      // Build the attendance table records
      const tableRecords = siteRes.map((employee) => {
        const empName =
          employeeMap[String(employee.id)] ||
          attendanceNameMap[String(employee.id)] ||
          "N/A";
        const status = presentEmployeeIDs.includes(String(employee.id))
          ? "Present"
          : "Absent";
        return {
          id: employee.id,
          empName,
          status,
          date: todayDate,
        };
      });
      // console.log("Attendance Table Records:", tableRecords);
      setAttendanceTableRecords(tableRecords);
      setFullSiteAttendanceRecords(tableRecords);
      setFilteredSiteAttendanceRecords(tableRecords);
      console.log(tableRecords)
    } catch (error) {
      console.log("Error fetching site data:", error);
    }
  };

  // -------------------------------
  // HANDLERS
  // -------------------------------

  const handlePresentEmpSiteWise = () => {
    const presentRecords = fullSiteAttendanceRecords.filter(
      (record) => record.status === "Present"
    );
    setFilteredSiteAttendanceRecords(presentRecords);
  };

  // Filter the full site records to show only Absent employees
  const handleAbsentEmpSiteWise = () => {
    const absentRecords = fullSiteAttendanceRecords.filter(
      (record) => record.status === "Absent"
    );
    setFilteredSiteAttendanceRecords(absentRecords);
  };

  const handleOverallAll = () => {
    setFilteredOverallAttendanceRecords(fullOverallAttendanceRecords);
  };

  const handleOverallPresent = () => {
    const presentRecords = fullOverallAttendanceRecords.filter(
      (record) => record.status === "Present"
    );
    setFilteredOverallAttendanceRecords(presentRecords);
  };

  const handleOverallAbsent = () => {
    const absentRecords = fullOverallAttendanceRecords.filter(
      (record) => record.status === "Absent"
    );
    setFilteredOverallAttendanceRecords(absentRecords);
  };

  // Reset the filter to show all records
  const handleAllEmpSiteWise = () => {
    setFilteredSiteAttendanceRecords(fullSiteAttendanceRecords);
  };

  const handleChange = (event) => {
    const selectedSiteId = event.target.value;
    setSelectedSite(selectedSiteId);
    if (selectedSiteId) {
      // When a site is selected, load its data.
      fetchSiteData(selectedSiteId, selectedDate);
    } else {
      // fetchClientDashboardData();

      if (overallAttendance) {
        setCount(overallAttendance.total_employee);
        setPieChartData([
          {
            name: "Head Count",
            y: overallAttendance.total_employee,
            color: "#f97316",
          },
          {
            name: "Present",
            y: overallAttendance.total_present,
            color: "#10b981",
          },
          {
            name: "Absent",
            y: overallAttendance.total_absent,
            color: "#3b82f6",
          },
        ]);
        setBarChartData([
          overallAttendance.total_employee,
          overallAttendance.total_present,
          overallAttendance.total_absent,
        ]);
      } else {
        // Fallback if overallAttendance is not set
        setCount(clientData ? clientData.length : 0);
        setPieChartData([
          {
            name: "Head Count",
            y: clientData ? clientData.length : 0,
            color: "#f97316",
          },
          { name: "Present", y: 0, color: "#10b981" },
          { name: "Absent", y: 0, color: "#3b82f6" },
        ]);
        setBarChartData([clientData ? clientData.length : 0, 0, 0]);
      }
      setAttendanceTableRecords([]);
      setAbsentRecord(null);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsCalendarVisible(false);
    if (selectedSite) {
      fetchSiteData(selectedSite, date);
    } else if (overallAttendance) {
      fetchClientDashboardData(date);

      // Update overall charts if no site is selected
      setPieChartData([
        {
          name: "Head Count",
          y: overallAttendance.total_employee,
          color: "#f97316",
        },
        {
          name: "Present",
          y: overallAttendance.total_present,
          color: "#10b981",
        },
        { name: "Absent", y: overallAttendance.total_absent, color: "#3b82f6" },
      ]);
      setBarChartData([
        overallAttendance.total_employee,
        overallAttendance.total_present,
        overallAttendance.total_absent,
      ]);
    }
  };

  const handleSliceClick = (event) => {
    setSelectedData(event.point.name);
  };

  // -------------------------------
  // CHART OPTIONS
  // -------------------------------
  const pieOptions = {
    chart: { type: "pie" },
    title: { text: "Head Count Status" },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: { enabled: true },
        events: { click: handleSliceClick },
      },
    },
    series: [{ name: "Employees", data: pieChartData }],
  };

  const barChartOptions = {
    chart: { type: "column" },
    title: { text: "Head Count Status" },
    xAxis: {
      categories: ["Head Count", "Present", "Absent"],
      pointPadding: 0.1,
      groupPadding: 0.1,
    },
    yAxis: { title: { text: "Count" } },
    plotOptions: { series: { cursor: "pointer" } },
    series: [
      { name: "Count", data: barChartData, color: "#4f9c88", pointWidth: 40 },
    ],
    tooltip: { pointFormat: "{series.name}: <b>{point.y}</b>" },
  };

  return (
    <div className="flex flex-col h-screen relative">
      {/* Top Navigation Bar */}
      <nav
        style={{ background: themeColor }}
        className="text-white px-6 py-4 flex justify-between items-center"
      >
        <div className="text-2xl font-bold">Dashboard</div>
        <div className="flex items-center space-x-4">
          {multiple_ass.length === 0 ? (
            <p className="text-grey-500">No site associated</p>
          ) : (
            <select className="text-black px-6 py-2" onChange={handleChange}>
              <option value="">Select All Sites</option>
              {multiple_ass.map((asso, index) => (
                <option key={index} value={asso.id}>
                  {asso.siteName}
                </option>
              ))}
            </select>
          )}
        </div>
      </nav>

      {/* Sidebar & Main Content */}
      <div className="flex flex-1">
        <aside
          style={{ background: themeColor }}
          className="group w-[4.5rem] hover:w-1/4 text-white flex flex-col items-center py-4 duration-500 overflow-hidden"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <div className="flex items-center space-x-3 w-full px-4 text-xl font-medium transition-all duration-500">
            <FaRegUserCircle className="text-3xl" />
            <span className="hidden group-hover:inline-block text-lg font-semibold">
              {fullName}
            </span>
          </div>
          <div className="w-full border-b border-gray-400 my-4 group-hover:block hidden"></div>
          <button
            onClick={handleLogout}
            className="font-semibold flex items-center rounded-md px-2 py-2 hover:bg-white hover:text-black transition-all duration-300 ease-in-out my-2 gap-4"
          >
            <PiSignOutBold size={20} />
            {open && "Logout"}
          </button>
        </aside>

        <div className="flex-1 p-6 bg-gray-100">
          {/* Data Boxes */}

          <div className="grid grid-cols-6 gap-2 mb-4">
            {selectedSite ? (
              // When a site is selected, show site-specific counts:
              <>
                <div className="shadow-lg p-2 rounded-lg transition-colors duration-300 cursor-pointer">
                  <h3 className="font-semibold text-lg">Head Count</h3>
                  <p>{count}</p>
                </div>
                <div className="shadow-lg p-2 rounded-lg transition-colors duration-300 cursor-pointer">
                  <h3 className="font-semibold text-lg">Present</h3>
                  <p>{barChartData[1]}</p>
                </div>
                <div className="shadow-lg p-2 rounded-lg transition-colors duration-300 cursor-pointer">
                  <h3 className="font-semibold text-lg">Absent</h3>
                  <p>{barChartData[2]}</p>
                </div>
              </>
            ) : overallAttendance ? (
              // When no site is selected and overallAttendance is available, show overall counts:
              <>
                <div className="shadow-lg p-2 rounded-lg transition-colors duration-300 cursor-pointer text-center">
                  <h3 className="font-semibold text-lg">Head Count</h3>
                  <p>{overallAttendance.total_employee}</p>
                </div>

                <div className="shadow-lg p-2 rounded-lg transition-colors duration-300 cursor-pointer text-center">
                  <h3 className="font-semibold text-lg">Present</h3>
                  <p>{overallAttendance.total_present}</p>
                </div>

                  <div className="shadow-lg p-2 rounded-lg transition-colors duration-300 cursor-pointer text-center">
                    <h3 className="font-semibold text-lg">Absent</h3>
                    <p>{overallAttendance.total_absent}</p>
                  </div>
              </>
            ) : (
              // Fallback: if overallAttendance isn't available, show head count only.
              <div className="shadow-lg p-2 rounded-lg transition-colors duration-300 cursor-pointer">
                <h3 className="font-semibold text-lg">Head Count</h3>
                <p>{clientData ? clientData.length : 0}</p>
              </div>
            )}
          </div>

          {/* Chart Container */}
          <div className="grid grid-cols-1 gap-4 relative">
            <div className="bg-white shadow-lg p-2 rounded-lg mt-4">
              <div className="text-end">
                <input
                  type="text"
                  value={selectedDate.toLocaleDateString()}
                  readOnly
                  onClick={() => setIsCalendarVisible(true)}
                  className="cursor-pointer pl-2 bg-transparent text-lg font-semibold border border-gray-500 focus:outline-none"
                />
              </div>
              {isPieChart ? (
                <>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={pieOptions}
                  />
                  <div className="text-center mt-4">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsPieChart(false);
                      }}
                      className="text-blue-500 underline"
                    >
                      Site View
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={barChartOptions}
                  />
                  <div className="text-center mt-4">
                    <button
                      onClick={() => setIsPieChart(true)}
                      className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                      Back to Pie Chart
                    </button>
                  </div>
                </>
              )}
            </div>

            {isCalendarVisible && (
              <div className="absolute top-20 right-10 bg-white shadow-md rounded-lg p-4 border border-gray-200 z-50 w-[300px] h-[300px]">
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  // maxDate = {maxDate}
                  className="react-calendar p-0 w-full h-full overflow-y-auto"
                />
                <button
                  onClick={() => setIsCalendarVisible(false)}
                  className="mt-4 text-sm py-1 px-2 bg-red-500 rounded-lg text-white"
                >
                  Close
                </button>
              </div>
            )}

            {!selectedSite && (
              <div className="bg-white shadow-lg p-4 rounded-lg mt-4">
                <h3 className="font-bold text-center text-xl mb-4">
                  Overall Attendance Details
                </h3>
                {/* Filter Buttons */}
                <div className="mb-4 flex gap-4">
                  <button
                    onClick={handleOverallAll}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    All
                  </button>
                  <button
                    onClick={handleOverallPresent}
                    className="px-4 py-2 bg-green-300 rounded hover:bg-green-400"
                  >
                    Present
                  </button>
                  <button
                    onClick={handleOverallAbsent}
                    className="px-4 py-2 bg-red-300 rounded hover:bg-red-400"
                  >
                    Absent
                  </button>
                </div>
                <table className="text-left w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">Emp ID</th>
                      <th className="border px-4 py-2">Name</th>
                      <th className="border px-4 py-2">Gender</th>
                      <th className="border px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOverallAttendanceRecords.length > 0 ? (
                      filteredOverallAttendanceRecords.map((record) => (
                        <tr key={record.id}>
                          <td className="border px-4 py-2">{record.vibe_id}</td>
                          <td className="border px-4 py-2">{record.empName}</td>
                          <td className="border px-4 py-2">{record.gender}</td>
                          <td
                            className={`border px-4 py-2 text-left ${
                              record.status === "Absent"
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {record.status}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="border px-4 py-2" colSpan="5">
                          No attendance records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Attendance Table */}
            {selectedSite && (
              <div className="bg-white shadow-lg p-4 rounded-lg mt-4">
                <h3 className="font-bold text-xl mb-4">Attendance Details</h3>
                {/* Filter Buttons */}
                <div className="mb-4 flex gap-4">
                  <button
                    onClick={handleAllEmpSiteWise}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    All
                  </button>
                  <button
                    onClick={handlePresentEmpSiteWise}
                    className="px-4 py-2 bg-green-300 rounded hover:bg-green-400"
                  >
                    Present
                  </button>
                  <button
                    onClick={handleAbsentEmpSiteWise}
                    className="px-4 py-2 bg-red-300 rounded hover:bg-red-400"
                  >
                    Absent
                  </button>
                </div>

                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">Employee Name</th>
                      <th className="border px-4 py-2">Status</th>
                      {/* <th className="border px-4 py-2">Date</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    
                    {filteredSiteAttendanceRecords.length > 0 ? (
                      filteredSiteAttendanceRecords.map((record) => (
                        <tr key={record.id}>
                          <td className="border px-4 py-2">{record.empName}</td>
                          <td
                            className={`text-center border px-4 py-2 ${
                              record.status === "Absent"
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {record.status}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="border px-4 py-2" colSpan="3">
                          No attendance records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Site Selection (if needed) */}
      {isDropdownVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white rounded-lg p-4 w-[300px]">
            <button
              onClick={() => setIsDropdownVisible(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-xl"
            >
              &times;
            </button>
            <h3 className="text-xl text-center font-bold mb-4">
              {selectedSite
                ? `Site: ${
                    multiple_ass.find((s) => s.id === selectedSite)?.siteName
                  }`
                : "No Site Selected"}
            </h3>
            {selectedSite ? (
              <div>
                <p className="mb-4 text-sm text-center">
                  Site already selected.
                </p>
                <button
                  onClick={() => {
                    setIsDropdownVisible(false);
                    setIsPieChart(false);
                  }}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Go to Bar Chart
                </button>
              </div>
            ) : (
              <div>
                <ul>
                  {multiple_ass.map((site) => (
                    <li
                      key={site.id}
                      className="cursor-pointer p-2 hover:bg-gray-200"
                      onClick={() => {
                        setSelectedSite(site.id);
                        fetchSiteData(site.id);
                        setIsDropdownVisible(false);
                        setIsPieChart(false);
                      }}
                    >
                      {site.siteName}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setIsDropdownVisible(false)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
