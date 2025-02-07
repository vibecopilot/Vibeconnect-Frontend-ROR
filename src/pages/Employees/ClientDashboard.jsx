import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { RxExit } from "react-icons/rx";
import { FaRegUserCircle } from "react-icons/fa";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSelector } from "react-redux";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { PiSignOutBold } from "react-icons/pi";
import {
  getClientDashboard,
  getEmployeeJobInfo,
  getAssociatedSite,
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
  const [multiple_ass, setMultipleAssos] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [siteWiseData, setSiteWiseData] = useState([]); // list of employees for selected site
  const [count, setCount] = useState(0);

  // Chart States
  const [pieChartData, setPieChartData] = useState([
    { name: "Head Count", y: 0, color: "#f97316" },
    { name: "Present", y: 0, color: "#10b981" },
    { name: "Absent", y: 0, color: "#3b82f6" },
  ]);
  const [barChartData, setBarChartData] = useState([0, 0, 0]);

  // Table State for attendance records
  const [attendanceTableRecords, setAttendanceTableRecords] = useState([]);

  // State for absent record
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
      "HRMSORGID",
      "board_id",
      "menuState",
      "Name",
      "LASTNAME",
      "USERTYPE",
      "user",
      "UNITID",
      "Building",
      "categories",
      "SITEID",
      "STATUS",
      "complaint",
      "UserId",
      "VIBETOKEN",
      "VIBEUSERID",
      "VIBEORGID",
      "FEATURES",
      "HRMSORGID",
      "HRMS_EMPLOYEE_ID",
    ].forEach((key) => localStorage.removeItem(key));
    persistor.purge(["board"]).then(() => {
      navigate("/login");
    });
  };

  // -------------------------------
  // FETCH OVERALL CLIENT DATA ON MOUNT
  // -------------------------------
  useEffect(() => {
    const fetchClientDashboardData = async () => {
      try {
        const empId = localStorage.getItem("HRMS_EMPLOYEE_ID");
        const res = await getClientDashboard(empId);
        // Assume res is an array; store it in state
        setClientData(res);
        // Also fetch employee job info to get multiple associated sites
        const hrmsAdminData = await getEmployeeJobInfo(empId);
        const multiple_asso = hrmsAdminData[0].multiple_associated;

        setPieChartData([
          { name: "Head Count", y: res.length, color: "#f97316" }
        ]);
        setMultipleAssos(multiple_asso);
      } catch (error) {
        console.log("Error fetching client dashboard:", error);
      }
    };
    fetchClientDashboardData();
  }, []);

  // -------------------------------
  // FETCH SITE DATA AND ATTENDANCE
  // -------------------------------
  const fetchSiteData = async (siteId, dateParam = selectedDate) => {
    try {
      // Fetch the list of employees for the site
      const siteRes = await getAssociatedSite(siteId);
      setSiteWiseData(siteRes);

      // Format the date as YYYY-MM-DD
      const year = dateParam.getFullYear();
      const month = String(dateParam.getMonth() + 1).padStart(2, "0");
      const day = String(dateParam.getDate()).padStart(2, "0");
      const todayDate = `${year}-${month}-${day}`;
      console.log("Formatted Date:", todayDate);

      // Fetch attendance data for the site using the formatted date
      const attendanceRes = await getSiteWiseAttendance(siteId, todayDate);
      console.log("Site Wise Attendance Data:", attendanceRes);

      const presentRecord = attendanceRes.attendance_data;
      console.log("Attendance records:", presentRecord);

      // Aggregated counts from attendanceRes
      const headCount = attendanceRes.total_employees || 0;
      const presentCount = attendanceRes.attended_employee_count || 0;
      const absentCount = headCount - presentCount;

      setPieChartData([
        { name: "Head Count", y: headCount, color: "#f97316" },
        { name: "Present", y: presentCount, color: "#10b981" },
        { name: "Absent", y: absentCount, color: "#3b82f6" },
      ]);
      setBarChartData([headCount, presentCount, absentCount]);
      setCount(headCount);

      // Build mapping from employee id (as string) to employee name using first_name and last_name from siteRes
      const employeeMap = siteRes.reduce((acc, employee) => {
        const name =
          `${employee.first_name || ""} ${employee.last_name || ""}`.trim() ||
          "N/A";
        acc[String(employee.id)] = name;
        return acc;
      }, {});
      console.log("Employee Map:", employeeMap);

      // Build a fallback mapping from attendance records for employee names (if available)
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
      console.log("Attendance Name Map:", attendanceNameMap);

      // Map attendance records to include name (from attendance record)
      const presentEmployeeDetails = presentRecord
        .filter((record) => record.attendance_time.startsWith(todayDate))
        .map((record) => ({
          employee: String(record.employee),
          empName:
            `${record.first_name || ""} ${record.last_name || ""}`.trim() ||
            "N/A",
        }));
      console.log("Present Employee Details:", presentEmployeeDetails);

      // Extract present employee IDs as strings
      const presentEmployeeIDs = presentEmployeeDetails.map(
        (detail) => detail.employee
      );
      console.log("Present Employee IDs:", presentEmployeeIDs);

      // Compute absent employees by filtering siteRes for those not present
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
      console.log("Absent Record:", absentRecordObj);

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
      console.log("Attendance Table Records:", tableRecords);
      setAttendanceTableRecords(tableRecords);
    } catch (error) {
      console.log("Error fetching site data:", error);
    }
  };

  // -------------------------------
  // HANDLERS
  // -------------------------------
  const handleChange = (event) => {
    const selectedSiteId = event.target.value;
    setSelectedSite(selectedSiteId);
    if (selectedSiteId) {
      fetchSiteData(selectedSiteId, selectedDate);
    } else {
      // If no site is selected, use overall head count from clientData
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
      setAttendanceTableRecords([]);
      setAbsentRecord(null);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsCalendarVisible(false);
    if (selectedSite) {
      fetchSiteData(selectedSite, date);
    }
  };

  const handleSliceClick = (event) => {
    setSelectedData(event.point.name);
    setIsDropdownVisible(true);
  };

  const handleDropdownClick = (item) => {
    setSelectedData(item);
    setIsDropdownVisible(false);
    if (item === "Head Count" || item === "Present" || item === "Absent") {
      setIsPieChart(false);
    }
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
        events: {
          click: handleSliceClick,
        },
      },
    },
    series: [
      {
        name: "Employees",
        data: pieChartData,
      },
    ],
  };

  const barChartOptions = {
    chart: { type: "column" },
    title: { text: "Head Count Status" },
    xAxis: {
      categories: ["Head Count", "Present", "Absent"],
      pointPadding: 0.1,
      groupPadding: 0.1,
    },
    yAxis: {
      title: { text: "Count" },
    },
    plotOptions: {
      series: {
        cursor: "pointer",
        events: {
          click: (event) => {
            setSelectedData(event.point.category);
            setIsDropdownVisible(true);
          },
        },
      },
    },
    series: [
      {
        name: "Count",
        data: barChartData,
        color: "#4f9c88",
        pointWidth: 40,
      },
    ],
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y}</b>",
    },
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
                <option key={index} value={asso}>
                  {`Site ${asso}`}
                </option>
              ))}
            </select>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1">
        <aside
          style={{ background: themeColor }}
          className="group w-[4.5rem] hover:w-1/4 text-white flex flex-col items-center py-4 duration-500 overflow-hidden"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {/* User Profile Section */}
          <div className="flex items-center space-x-3 w-full px-4 text-xl font-medium transition-all duration-500">
            <FaRegUserCircle className="text-3xl" />
            <span className="hidden group-hover:inline-block text-lg font-semibold">
              {fullName}
            </span>
          </div>
          <div className="w-full border-b border-gray-400 my-4 group-hover:block hidden"></div>
          {/* Logout Button */}
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
            <div className="bg-white shadow-lg p-2 rounded-lg">
              <h3 className="font-semibold text-lg">Head Count</h3>
              <p>{selectedSite ? count : clientData ? clientData.length : 0}</p>
            </div>
            {/* Only show Present and Absent boxes if a site is selected */}
            {selectedSite && (
              <>
                <div className="bg-white shadow-lg p-2 rounded-lg">
                  <h3 className="font-semibold text-lg">Present</h3>
                  <p>{barChartData[1]}</p>
                </div>
                <div className="bg-white shadow-lg p-2 rounded-lg">
                  <h3 className="font-semibold text-lg">Absent</h3>
                  <p>{barChartData[2]}</p>
                </div>
              </>
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
                <HighchartsReact highcharts={Highcharts} options={pieOptions} />
              ) : (
                <HighchartsReact
                  highcharts={Highcharts}
                  options={barChartOptions}
                />
              )}
            </div>

            {isCalendarVisible && (
              <div className="absolute top-20 right-10 bg-white shadow-md rounded-lg p-4 border border-gray-200 z-50 w-[300px] h-[300px]">
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
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

            {/* Attendance Table */}
            {selectedSite && (
              <div className="bg-white shadow-lg p-4 rounded-lg mt-4">
                <h3 className="font-bold text-xl mb-4">Attendance Details</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">Employee Name</th>
                      <th className="border px-4 py-2">Status</th>
                      <th className="border px-4 py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceTableRecords.length > 0 ? (
                      attendanceTableRecords.map((record) => (
                        <tr key={record.id}>
                          <td className="border px-4 py-2">{record.empName}</td>
                          <td className=" text-center border px-4 py-2">
                            {record.status}
                          </td>
                          <td className="text-center border px-4 py-2">
                            {record.date}
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
    </div>
  );
};

export default ClientDashboard;
