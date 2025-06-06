import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { RxExit } from "react-icons/rx";
import { FaRegUserCircle } from "react-icons/fa";
import Table from "../../components/table/Table";
import AdminHRMS from "../AdminHrms/AdminHrms";
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
  getSiteWiseAttendance,
  getAssociatedOrgDash,
  getCountOfClientDashboard,
  getAssocaitedSitesAttendance,
  getClientDashboardSummary,
} from "../../api/index";
import { persistor } from "../../store/store";
import { useNavigate } from "react-router-dom";
import {
  formatTime,
  convertTo12HourFormat,
  convertTo12HrFormat,
} from "../../utils/dateUtils";
import { Pagination } from "antd";


const ClientDashboard = () => {
  const navigate = useNavigate();
  const employee_id = getItemInLocalStorage("HRMS_EMPLOYEE_ID");


  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedData, setSelectedData] = useState(null);
  const [open, setOpen] = useState(false);
  const [isPieChart, setIsPieChart] = useState(true);
  const [clientData, setClientData] = useState(null);
  const [multiple_ass, setMultipleAssos] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedSiteName, setSelectedSiteName] = useState(null);
  const [siteWiseData, setSiteWiseData] = useState([]);
  const [count, setCount] = useState(0);
  const [overallAttendance, setOverallAttendance] = useState(null);
  const [checkInData, setCheckInData] = useState([]);
  const [checkOutData, setCheckOutData] = useState([]);
  const [notCheckIn, setNotCheckIn] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState();
  const [showNotCheck, setShowNotCheckIn] = useState();
  const [showAllSites, setShowAllSites] = useState(false);
  const [attendanceCount, setAttendanceCount] = useState({
    total_employees: 0,
    site_count: 0,
    present_count: 0,
    attendance_date: "",
  });
  const [attendanceTableRecords, setAttendanceTableRecords] = useState([]);
  const [absentRecord, setAbsentRecord] = useState(null);
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
  const [pieChartData, setPieChartData] = useState([
    { name: "Head Count", y: 0, color: "#f97316" },
    { name: "Present", y: 0, color: "#10b981" },
    { name: "Absent", y: 0, color: "#3b82f6" },
  ]);
  const [barChartData, setBarChartData] = useState([0, 0, 0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Location, setLocation] = useState([]);
  // const [selectedSiteName, setSelectedSiteName] = useState(null);


  const lastName = JSON.parse(localStorage.getItem("LASTNAME") || '""');
  const firstName = JSON.parse(localStorage.getItem("Name") || '""');
  const fullName = `${firstName} ${lastName}`.trim();
  const themeColor = useSelector((state) => state.theme.color);


  const handleLogout = () => {
    ["TOKEN", "COMPANYID", "HRMS_EMPLOYEE_ID"].forEach((key) =>
      localStorage.removeItem(key)
    );
    persistor.purge(["board"]).then(() => {
      navigate("/login");
    });
  };


  const empId = localStorage.getItem("HRMS_EMPLOYEE_ID");
  const fetchAttendanceCount = async (dateParam = selectedDate) => {
    try {
      if (!empId) return;


      const formattedDate = `${dateParam.getFullYear()}-${String(
        dateParam.getMonth() + 1
      ).padStart(2, "0")}-${String(dateParam.getDate()).padStart(2, "0")}`;


      const response = await getCountOfClientDashboard(empId, formattedDate);
      setAttendanceCount(response);
      return response;
    } catch (error) {
      console.error("Error fetching attendance count:", error);
      return null;
    }
  };


  const fetchSiteLocationData = async (siteLocation, selectedDate) => {
    try {
      const formattedDate = `${selectedDate.getFullYear()}-${String(
        selectedDate.getMonth() + 1
      ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;


      const updatedSites = await Promise.all(
        siteLocation.map(async (site) => {
          const siteRes = await getSiteWiseAttendance(site.id, formattedDate);
          const presentCount = siteRes.attended_employee_count;
          const totalEmployeeCount = siteRes.total_employees;
          const absentCount = totalEmployeeCount - presentCount;


          return {
            id: site.id,
            siteName: site.site_name,
            presentCount,
            totalEmployeeCount,
            absentCount,
          };
        })
      );


      setLocation(updatedSites);
      return updatedSites;
    } catch (error) {
      console.error("Error fetching site data:", error);
      throw error;
    }
  };


  const handleSiteDateChange = async (date) => {
    setSelectedDate(date);
    await fetchSiteLocationData(Location, date);
    await fetchClientDashboardData(date);
  };


  const fetchClientDashboardData = async (dateParam = selectedDate) => {
    try {
      setIsLoading(true);
      const empId = localStorage.getItem("HRMS_EMPLOYEE_ID");
      const orgId = localStorage.getItem("HRMSORGID");


      if (!empId || !orgId) {
        throw new Error("Employee ID or Organization ID not found");
      }


      const formattedDate = `${dateParam.getFullYear()}-${String(
        dateParam.getMonth() + 1
      ).padStart(2, "0")}-${String(dateParam.getDate()).padStart(2, "0")}`;


      const [clientDataResponse, countResponse, allAttendance, hrmsAdminData] =
        await Promise.all([
          getClientDashboard(empId),
          fetchAttendanceCount(dateParam),
          getAssociatedOrgDash(empId, formattedDate),
          getEmployeeJobInfo(empId),
        ]);


      setClientData(clientDataResponse);
      setAttendanceCount(countResponse);


      const total_employee = allAttendance.total_employees || 0;
      const total_present = allAttendance.total_present || 0;
      const total_absent = Math.max(total_employee - total_present, 0);


      setOverallAttendance({
        total_employee,
        total_present,
        total_absent,
        attendanceRecord: allAttendance.attendance[0] || null,
      });


      const attendanceRecords = allAttendance.attendance || [];
      const presentIds = attendanceRecords.map((record) => record.employee_id);


      const checkIn = attendanceRecords
        .filter((item) => item.is_check_in === true)
        .map(
          ({
            is_check_in,
            attendance_time,
            first_name,
            last_name,
            employee_id,
            shift,
          }) => ({
            is_check_in,
            attendance_time,
            first_name,
            last_name,
            employee_id,
            shiftName: shift?.shift_name || "No Shift",
          })
        );
      setCheckInData(checkIn);


      const checkOut = attendanceRecords
        .filter((item) => item.is_check_in === false)
        .map(
          ({
            is_check_in,
            attendance_time,
            first_name,
            last_name,
            employee_id,
            shift,
          }) => ({
            is_check_in,
            attendance_time,
            first_name,
            last_name,
            employee_id,
            shiftName: shift?.shift_name || "No Shift",
          })
        );
      setCheckOutData(checkOut);


      const AllEmpRecord = clientDataResponse.map((client) => {
        const empName =
          `${client.first_name || ""} ${client.last_name || ""}`.trim() ||
          "N/A";


        const empCheckInData = checkIn.filter(
          (record) => String(record.employee_id) === String(client.id)
        );
        const empCheckOutData = checkOut.filter(
          (record) => String(record.employee_id) === String(client.id)
        );


        const status = empCheckInData.length > 0 ? "Present" : "Absent";
        const checkInTime =
          status === "Present"
            ? empCheckInData[0]?.attendance_time || "__"
            : "__";
        const checkOutTime =
          status === "Present"
            ? empCheckOutData[0]?.attendance_time || "__"
            : "__";


        return {
          id: client.id,
          empName,
          status,
          date: formattedDate,
          checkInTime,
          checkOutTime,
        };
      });


      setFullOverallAttendanceRecords(AllEmpRecord);
      setFilteredOverallAttendanceRecords(AllEmpRecord);


      const siteLocation = hrmsAdminData[0]?.multiple_associated_info || [];
      const siteNamesResult = siteLocation.map((site) => ({
        id: site.id,
        siteName: site.site_name,
      }));


      setMultipleAssos(siteNamesResult);
      await fetchSiteLocationData(siteLocation, selectedDate);


      setPieChartData([
        { name: "Head Count", y: total_employee, color: "#f97316" },
        { name: "Present", y: total_present, color: "#10b981" },
        { name: "Absent", y: total_absent, color: "#3b82f6" },
      ]);
      setBarChartData([total_employee, total_present, total_absent]);
      setCount(total_employee);
    } catch (error) {
      console.error("Error fetching client dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const fetchSiteData = async (siteId, dateParam = selectedDate) => {
    try {
      const formattedDate = `${dateParam.getFullYear()}-${String(
        dateParam.getMonth() + 1
      ).padStart(2, "0")}-${String(dateParam.getDate()).padStart(2, "0")}`;


      const attendanceRes = await getAssocaitedSitesAttendance(
        siteId,
        formattedDate,
        formattedDate
      );


      const attendanceData = attendanceRes.results;
      const attendanceRecords = attendanceData.attendance_data || [];


      const headCount = attendanceData.total_employees || 0;
      const presentCount = attendanceData.attended_employee_count || 0;
      const absentCount = headCount - presentCount;


      setPieChartData([
        { name: "Head Count", y: headCount, color: "#f97316" },
        { name: "Present", y: presentCount, color: "#10b981" },
        { name: "Absent", y: absentCount, color: "#3b82f6" },
      ]);
      setBarChartData([headCount, presentCount, absentCount]);
      setCount(headCount);


      const employeeRecords = {};


      attendanceRecords.forEach((record) => {
        const empId = record.employee;
        if (!employeeRecords[empId]) {
          employeeRecords[empId] = {
            id: empId,
            empName:
              `${record.employee__first_name || ""} ${
                record.employee__last_name || ""
              }`.trim() || "N/A",
            checkInTime: null,
            checkOutTime: null,
            status: "Absent",
            userImage: record.user_image,
          };
        }


        if (record.is_check_in) {
          employeeRecords[empId].checkInTime = record.attendance_time;
          employeeRecords[empId].status = "Present";
        } else {
          employeeRecords[empId].checkOutTime = record.attendance_time;
        }
      });


      const tableRecords = Object.values(employeeRecords).map((record) => ({
        ...record,
        shiftName: "No Shift",
      }));


      setAttendanceTableRecords(tableRecords);
      setFullSiteAttendanceRecords(tableRecords);
      setFilteredSiteAttendanceRecords(tableRecords);


      const presentEmployeeIds = attendanceRecords
        .filter((record) => record.is_check_in)
        .map((record) => record.employee);


      setAbsentRecord({
        absentrecord: tableRecords.filter(
          (record) => !presentEmployeeIds.includes(record.id)
        ),
      });
    } catch (error) {
      console.error("Error fetching site attendance data:", error);
    }
  };


  const handlePresentEmpSiteWise = () => {
    const presentRecords = fullSiteAttendanceRecords.filter(
      (record) => record.status === "Present"
    );
    setFilteredSiteAttendanceRecords(presentRecords);
  };


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


  const handleAllEmpSiteWise = () => {
    setFilteredSiteAttendanceRecords(fullSiteAttendanceRecords);
  };


  const handleChange = async (event) => {
    const selectedSiteId = event.target.value;


    setSelectedSite(selectedSiteId || null);
    if (selectedSiteId) {
      await fetchSiteData(selectedSiteId, selectedDate);
    } else {
      await fetchClientDashboardData(selectedDate);
      setFilteredOverallAttendanceRecords(fullOverallAttendanceRecords);


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
      }
    }
  };


  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsCalendarVisible(false);
    if (selectedSite) {
      fetchSiteData(selectedSite, date);
    } else {
      fetchClientDashboardData(date);
    }
  };


  const handleSliceClick = (event) => {
    setSelectedData(event.point.name);
  };


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


  useEffect(() => {
    fetchClientDashboardData();
  }, []);


  const renderCell = (data) => {
    if (isLoading) return "Loading...";
    return data !== undefined && data !== null ? data : "Fetching Data..";
  };


  const handleLocation = () => {
    setIsModalOpen(true);
  };


  const [dashboardSummary, setDashboardSummary] = useState([]);
  const [aggregateSummary, setAggregateSummary] = useState(null);
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  const [summaryDate, setSummaryDate] = useState(formattedDate);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentSummaryPage, setCurrentSummaryPage] = useState("");
  const paginationHandler = (page) => {
    setPageNumber(page - 1);
  };
  useEffect(() => {
    if (summaryDate) {
      fetchDashboardSummary();
    }
  }, [isModalOpen, pageNumber, summaryDate]);


  const fetchDashboardSummary = async () => {
    try {
      const res = await getClientDashboardSummary(
        empId,
        pageNumber + 1,
        summaryDate
      );
      setDashboardSummary(res.results.data);
      setAggregateSummary(res.results);
      setTotalPages(res.total_pages);


      setCurrentSummaryPage(res.current_page);
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="flex flex-col h-screen relative">
      <nav
        style={{ background: themeColor }}
        className="text-white px-6 py-4 flex justify-between items-center"
      >
        <div className="text-2xl font-bold pl-16">Dashboard</div>
        <div className="flex items-center space-x-4">
          {multiple_ass.length === 0 ? (
            <p className="text-grey-500">No site associated</p>
          ) : (
            <select
              className="text-black px-6 py-2"
              onChange={handleChange}
              value={selectedSite || ""}
            >
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
      <AdminHRMS />


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
          <div className="grid grid-cols-6 gap-2 mb-4">
            {selectedSite ? (
              <>
                <div className="shadow-lg p-2 rounded-lg transition-colors duration-300 cursor-pointer text-center">
                  <h3 className="font-semibold text-lg">Head Count</h3>
                  <p>{count}</p>
                </div>
                <div className="shadow-lg p-2 rounded-lg transition-colors duration-300 cursor-pointer text-center">
                  <h3 className="font-semibold text-lg">Present</h3>
                  <p>{barChartData[1]}</p>
                </div>
                <div className="shadow-lg p-2 rounded-lg transition-colors duration-300 cursor-pointer text-center">
                  <h3 className="font-semibold text-lg">Absent</h3>
                  <p>{barChartData[2]}</p>
                </div>
              </>
            ) : (
              <>
                <div
                  className="border bg-white p-4 rounded-lg transition-colors duration-300 cursor-pointer text-center"
                  onClick={handleLocation}
                >
                  <h3 className="font-semibold text-lg">Site Location</h3>
                  <p>{attendanceCount?.site_count}</p>
                </div>


                <div className="border bg-white p-4 rounded-lg transition-colors duration-300 text-center">
                  <h3 className="font-semibold text-lg">Total Head Count</h3>
                  <p>{attendanceCount?.total_employees}</p>
                </div>


                <div className="border bg-white p-4 rounded-lg transition-colors duration-300 cursor-pointer text-center">
                  <h3 className="font-semibold text-lg">Total Present</h3>
                  <p>{attendanceCount?.multiple_associated_present_today}</p>
                </div>


                <div className="border bg-white p-4 rounded-lg transition-colors duration-300 cursor-pointer text-center">
                  <h3 className="font-semibold text-lg">Total Absent</h3>
                  <p>
                    {attendanceCount?.total_employees -
                      attendanceCount?.multiple_associated_present_today}
                  </p>
                </div>
              </>
            )}
          </div>


          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg p-6 pb-0 w-full md:w-2/3 lg:w-2/3 h-[90%] overflow-y-scroll">
                <div className="flex justify-between">
                  <div className="justify-start">
                    <h2 className="text-xl py-1 font-bold mb-4">
                      Site Locations
                    </h2>
                  </div>
                  <div className="mb-2">
                    <input
                      type="date"
                      value={summaryDate}
                      onChange={(e) => setSummaryDate(e.target.value)}
                      className="p-2 border rounded-md px-4"
                    />
                  </div>
                </div>


                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="border p-2 rounded-lg text-center">
                    <h3 className="font-semibold">Total Sites</h3>
                    <p>{aggregateSummary?.total_sites}</p>
                  </div>
                  <div className="border p-2 rounded-lg text-center">
                    <h3 className="font-semibold">Total Employees</h3>
                    <p>{aggregateSummary?.total_employees_overall}</p>
                  </div>
                  <div className="border p-2 rounded-lg text-center">
                    <h3 className="font-semibold">Present Today</h3>
                    <p>{aggregateSummary?.total_present_overall}</p>
                  </div>
                  <div className="border p-2 rounded-lg text-center">
                    <h3 className="font-semibold">Absent Today</h3>
                    <p>
                      {aggregateSummary?.total_employees_overall != null &&
                      aggregateSummary?.total_present_overall != null
                        ? aggregateSummary.total_employees_overall -
                          aggregateSummary.total_present_overall
                        : "--"}
                    </p>
                  </div>
                </div>


                <div className="flex flex-col w-full h-[65%] overflow-scroll text-gray-700 bg-white  rounded-xl bg-clip-border">
                  <table className="w-full text-left table-auto min-w-max border-collapse">
                    <thead className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                      <tr>
                        <th className="border p-2 font-medium">Site ID</th>
                        <th className="border p-2 font-medium">Site Name</th>
                        <th className="border p-2 bg-green-400 text-white font-medium">
                          Present Emp Count
                        </th>
                        <th className="border p- bg-red-400 text-white text-center font-medium">
                          Absent Emp Count
                        </th>
                        <th className="border p-2 font-medium">
                          Total Emp Count
                        </th>
                      </tr>
                    </thead>


                    <tbody className="">
                      {dashboardSummary.map((summary) => (
                        <tr key={summary.site_id}>
                          <td className="border p-1 px-2">{summary.site_id}</td>
                          <td className="border p-2">{summary.site_name}</td>
                          <td className="border p-2">
                            {summary.present_count}
                          </td>
                          <td className="border p-2">{summary.absent_count}</td>
                          <td className="border p-2">
                            {summary.total_employees}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {dashboardSummary.length > 0 && (
                  <div
                    className={
                      "w-full mt- flex justify-end border rounded-md p-2"
                    }
                  >
                    <Pagination
                      current={pageNumber + 1}
                      total={totalPages * 10}
                      pageSize={10}
                      onChange={(page) => {
                        setPageNumber(page - 1);
                      }}
                      showSizeChanger={false}
                    />
                  </div>
                )}
                <div className="flex justify-center">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="my-2 px-8 py-2 text-l bg-red-500 text-white rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}


          <div className="grid grid-cols-1 gap-4 relative">
            <div className="bg-white p-2 rounded-lg mt-4">
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
              <div className="absolute top-20 right-10 bg-white rounded-lg p-4 border border-gray-200 z-50 w-[300px] h-[300px]">
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


            {!selectedSite && (
              <div className="bg-white p-4 rounded-lg mt-4">
                <h3 className="font-bold text-center text-xl mb-4">
                  Attendance Details
                </h3>
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


                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">Employee</th>
                      <th className="border px-4 py-2">Status</th>
                      <th className="border px-4 py-2">Check In</th>
                      <th className="border px-4 py-2">Check Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOverallAttendanceRecords.map((record) => (
                      <tr key={record.id}>
                        <td className="border px-4 py-2">{record.empName}</td>
                        <td
                          className={`border px-4 py-2 text-center ${
                            record.status === "Absent"
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {record.status}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {record.checkInTime
                            ? formatTime(record.checkInTime)
                            : "__"}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {record.checkOutTime
                            ? formatTime(record.checkOutTime)
                            : "__"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}


            {selectedSite && (
              <div className="bg-white shadow-lg p-4 rounded-lg mt-4">
                <h3 className="font-bold text-center text-xl mb-4">
                  Site Attendance Details
                </h3>
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
                      <th className="border px-4 py-2">Employee</th>
                      <th className="border px-4 py-2">Status</th>
                      <th className="border px-4 py-2">Check In</th>
                      <th className="border px-4 py-2">Check Out</th>
                      <th className="border px-4 py-2">Image</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSiteAttendanceRecords.map((record) => (
                      <tr key={record.id}>
                        <td className="border px-4 py-2">{record.empName}</td>
                        <td
                          className={`border px-4 py-2 text-center ${
                            record.status === "Absent"
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {record.status}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {record.checkInTime
                            ? formatTime(record.checkInTime)
                            : "__"}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {record.checkOutTime
                            ? formatTime(record.checkOutTime)
                            : "__"}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {record.userImage ? (
                            <img
                              src={record.userImage}
                              alt="Employee"
                              className="w-10 h-10 rounded-full mx-auto"
                            />
                          ) : (
                            "No Image"
                          )}
                        </td>
                      </tr>
                    ))}
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



