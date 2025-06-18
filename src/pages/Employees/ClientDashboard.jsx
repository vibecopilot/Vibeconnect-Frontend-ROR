import React, { useState, useEffect, useMemo } from "react";
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
import Select from "react-select";
import {
  getClientDashboard,
  getEmployeeJobInfo,
  getSiteWiseAttendance,
  getAssociatedOrgDash,
  getCountOfClientDashboard,
  getAssocaitedSitesAttendance,
  getClientDashboardSummary,
  downloadSummaryData,
  downloadAllSiteData,
  getAllSitesAttendance,
  getSiteWiseAttendanceData,
  getEmployeeAssociations,
} from "../../api/index";
import { persistor } from "../../store/store";
import { useNavigate } from "react-router-dom";
import {
  formatTime,
  convertTo12HourFormat,
  convertTo12HrFormat,
} from "../../utils/dateUtils";
import { Pagination } from "antd";
import { BsFileExcel } from "react-icons/bs";
import { RiFileExcel2Line } from "react-icons/ri";
import toast from "react-hot-toast";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const employee_id = getItemInLocalStorage("HRMS_EMPLOYEE_ID");

  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // "2025-06-10" format
  });
  const [selectedData, setSelectedData] = useState(null);
  const [open, setOpen] = useState(false);
  const [isPieChart, setIsPieChart] = useState(true);
  const [clientData, setClientData] = useState(null);
  const [multiple_ass, setMultipleAssos] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
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
  const fetchAttendanceCount = async () => {
    try {
      if (!empId) return;

      const response = await getCountOfClientDashboard(empId, selectedDate);
      setAttendanceCount(response);
      console.log(response);
      setPieChartData([
        { name: "Head Count", y: response.total_employees, color: "#f97316" },
        {
          name: "Present",
          y: response.multiple_associated_present_today,
          color: "#10b981",
        },
        {
          name: "Absent",
          y:
            response.total_employees -
            response.multiple_associated_present_today,
          color: "#3b82f6",
        },
      ]);
    } catch (error) {
      console.error("Error fetching attendance count:", error);
      return null;
    }
  };
  useEffect(() => {
    if (!selectedSite) {
      fetchAttendanceCount();
    }
  }, [selectedSite, selectedDate]);

  const orgId = localStorage.getItem("HRMSORGID");

  const handleSliceClick = (event) => {
    setSelectedData(event.point.name);
  };

  const pieOptions = useMemo(
    () => ({
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
    }),
    [pieChartData]
  );

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

  const renderCell = (data) => {
    if (isLoading) return "Loading...";
    return data !== undefined && data !== null ? data : "Fetching Data..";
  };

  const handleLocation = () => {
    setIsModalOpen(true);
  };

  const [sites, setSites] = useState([]);

  const fetchAssociatedSites = async () => {
    try {
      const res = await getEmployeeAssociations(empId);
      console.log(res);

      if (Array.isArray(res) && res.length > 0) {
        const associatedSites = res[0].multiple_associated_info || [];

        const allSites = associatedSites.map((site) => ({
          value: site.id,
          label: site.site_name,
        }));

        // Add "All Sites" option at the beginning
        const sitesWithAllOption = [
          { label: "All Sites", value: null },
          ...allSites,
        ];

        setSites(sitesWithAllOption);
      } else {
        // Only "All Sites" when no sites from API
        setSites([{ label: "All Sites", value: null }]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAssociatedSites();
  }, []);

  const [dashboardSummary, setDashboardSummary] = useState([]);
  const [aggregateSummary, setAggregateSummary] = useState(null);
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  const [summaryDate, setSummaryDate] = useState(formattedDate);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentSummaryPage, setCurrentSummaryPage] = useState("");

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
      console.log(res);
      setDashboardSummary(res.results.data);
      setAggregateSummary(res.results);
      setTotalPages(res.total_pages);

      setCurrentSummaryPage(res.current_page);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownloadSummaryReport = async (
    siteId,
    orgId,
    start_date,
    siteName
  ) => {
    const toastId = toast.loading("Download report please wait!!!");
    try {
      const res = await downloadSummaryData(siteId, orgId, start_date);
      const blob = new Blob([res.data], { type: res.headers["content-type"] });

      const link = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      link.href = url;

      link.download = `${siteName ? siteName : siteId}-${start_date}.xlsx`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
      toast.dismiss(toastId);
      toast.success("Success");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to download report ❌");
      console.log(error);
    }
  };
  const handleDownloadAllSitesReport = async (date) => {
    const toastId = toast.loading("Download report please wait!!!");
    try {
      const res = await downloadAllSiteData(empId, date);
      const blob = new Blob([res.data], { type: res.headers["content-type"] });

      const link = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      link.href = url;

      link.download = `All Sites -${date}.xlsx`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
      toast.dismiss(toastId);
      toast.success("Success");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to download report ❌");
      console.log(error);
    }
  };

  const [allSitesAttendance, setAllSiteAttendance] = useState([]);
  const [totalAllDataPages, setTotalAllDataPages] = useState(0);
  const [totalAllPageNumber, setTotalAllPageNumber] = useState(0);
  const [selectedAllSitesStatus, setSelectedAllSiteStatus] = useState("all");
  const fetchAllSitesAttendance = async () => {
    try {
      const response = await getAllSitesAttendance(
        empId,
        selectedDate,
        totalAllPageNumber + 1,
        selectedAllSitesStatus
      );

      setTotalAllDataPages(response.data.total_pages);
      setAllSiteAttendance(response.data.results);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!selectedSite) {
      fetchAllSitesAttendance();
    }
  }, [
    totalAllPageNumber,
    selectedDate,
    empId,
    selectedAllSitesStatus,
    selectedSite,
  ]);

  const [siteWiseAttendance, setSiteWiseAttendance] = useState([]);
  const [siteWisePageNumber, setSiteWisePageNumber] = useState(0);
  const [siteWiseTotalPages, setSiteWiseTotalPages] = useState(0);
  const [siteWiseStatus, setSiteWiseStatus] = useState("all");
  const [siteWiseHeadCount, setSiteWiseHeadCount] = useState(0);
  const [siteWisePresent, setSiteWisePresent] = useState(0);
  const [siteWiseAbsent, setSiteWiseAbsent] = useState(0);
  const fetchSiteWiseAttendance = async () => {
    try {
      if (selectedSite) {
        const res = await getSiteWiseAttendanceData(
          selectedSite,
          selectedDate,
          siteWisePageNumber + 1,
          siteWiseStatus
        );
        console.log("running");
        if (res.status === 200) {
          setSiteWiseAttendance(res?.data?.results?.data);
          setSiteWiseHeadCount(res?.data?.results?.site_employee_count);
          setSiteWisePresent(res?.data?.results?.present_count);
          setSiteWiseAbsent(res?.data?.results?.absent_count);
          setSiteWiseTotalPages(res?.data?.total_pages);
          setPieChartData([
            {
              name: "Head Count",
              y: res?.data?.results?.site_employee_count,
              color: "#f97316",
            },
            {
              name: "Present",
              y: res?.data?.results?.present_count,
              color: "#10b981",
            },
            {
              name: "Absent",
              y: res?.data?.results?.absent_count,
              color: "#3b82f6",
            },
          ]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSiteWiseAttendance();
  }, [selectedSite, selectedDate, siteWisePageNumber, siteWiseStatus]);

  return (
    <div className="flex flex-col h-screen relative">
      <nav
        style={{ background: themeColor }}
        className="text-white px-6 py-4 flex justify-between items-center"
      >
        <div className="text-2xl font-bold pl-16">Dashboard</div>
        <div className="flex items-center space-x-4">
          {sites.length === 0 ? (
            <p className="text-grey-500">No site associated</p>
          ) : (
            <Select
              options={sites}
              onChange={(selectedOption) => {
                setSelectedSite(selectedOption?.value || null);
                setSiteWisePageNumber(0);
                setSiteWiseStatus("all");
                setTotalAllPageNumber(0);
              }}
              noOptionsMessage={() => "No sites Available"}
              placeholder="Select Site"
              maxMenuHeight={500}
              className="z-50 w-96 text-black"
            />
            // <select
            //   className="text-black px-6 py-2"
            //   onChange={(e) => {
            //     setSelectedSite(e.target.value),
            //       setSiteWisePageNumber(0),
            //       setSiteWiseStatus("all"),
            //       setTotalAllPageNumber(0);
            //   }}
            //   value={selectedSite || ""}
            // >
            //   <option value="">Select All Sites</option>
            //   {sites.map((site, index) => (
            //     <option key={site.id} value={site.id}>
            //       {site.site_name}
            //     </option>
            //   ))}
            // </select>
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
                <div className="border bg-white p-4  rounded-lg transition-colors duration-300 cursor-pointer text-center">
                  <h3 className="font-semibold text-lg">Head Count</h3>
                  <p>{siteWiseHeadCount}</p>
                </div>
                <div className="border bg-white p-4 rounded-lg transition-colors duration-300 cursor-pointer text-center">
                  <h3 className="font-semibold text-lg">Present</h3>
                  <p>{siteWisePresent}</p>
                </div>
                <div className="border bg-white p-4 rounded-lg transition-colors duration-300 cursor-pointer text-center">
                  <h3 className="font-semibold text-lg">Absent</h3>
                  <p>{siteWiseAbsent}</p>
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
                    {(attendanceCount?.total_employees ?? 0) -
                      (attendanceCount?.multiple_associated_present_today ?? 0)}
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

                <div className="flex flex-col w-full h-[65%] hide-scrollbar overflow-scroll text-gray-700 bg-white rounded-xl bg-clip-border">
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
                        <th className="border p-2 font-medium">Action</th>
                      </tr>
                    </thead>

                    <tbody className="">
                      {dashboardSummary.map((summary) => (
                        <tr key={summary.site_id}>
                          <td className="border p-1 px-2">{summary.site_id}</td>
                          <td
                            className="border p-2 max-w-96 text-wrap"
                            title={summary.site_name}
                          >
                            {summary.site_name}
                          </td>
                          <td className="border p-2">
                            {summary.present_count}
                          </td>
                          <td className="border p-2">{summary.absent_count}</td>
                          <td className="border p-2">
                            {summary.total_employees}
                          </td>
                          <td className="border p-2">
                            <button
                              className="bg-green-400 p-2 px-4 text-sm font-medium rounded-md text-white flex items-center gap-2"
                              onClick={() =>
                                handleDownloadSummaryReport(
                                  summary.site_id,
                                  orgId,
                                  summaryDate,
                                  summary.site_name
                                )
                              }
                            >
                              <RiFileExcel2Line size={18} /> Report
                            </button>
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
                  type="date"
                  name=""
                  value={selectedDate}
                  id=""
                  className=" top-10 right-10 bg-white rounded-lg p-2 border border-gray-200 z-50 w-[300px] "
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              {isPieChart ? (
                <>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={pieOptions}
                  />
                  {/* <div className="text-center mt-4">
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
                  </div> */}
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
                  // onChange={handleDateChange}
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
                <div className="flex items-center justify-between">
                  <div className="mb-4 flex gap-4">
                    <button
                      onClick={() => setSelectedAllSiteStatus("all")}
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      All
                    </button>
                    <button
                      onClick={() => setSelectedAllSiteStatus("present")}
                      className="px-4 py-2 bg-green-300 rounded hover:bg-green-400"
                    >
                      Present
                    </button>
                    <button
                      onClick={() => setSelectedAllSiteStatus("absent")}
                      className="px-4 py-2 bg-red-300 rounded hover:bg-red-400"
                    >
                      Absent
                    </button>
                  </div>
                  <button
                    className="bg-green-400 p-2 px-4 text-sm font-medium rounded-md text-white flex items-center gap-2"
                    onClick={() => handleDownloadAllSitesReport(selectedDate)}
                  >
                    <RiFileExcel2Line size={18} /> Report
                  </button>
                </div>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2 font-medium">Employee</th>
                      <th className="border px-4 py-2 font-medium">Status</th>
                      <th className="border px-4 py-2 font-medium">Check In</th>
                      <th className="border px-4 py-2 font-medium">
                        Check Out
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allSitesAttendance?.map((record) => (
                      <tr key={record.id}>
                        <td className="border px-4 py-2">{`${record?.first_name} ${record?.last_name}`}</td>
                        <td
                          className={`border px-4 py-2 text-center ${
                            record?.attendance.length > 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {record?.attendance.length > 0 ? "Present" : "Absent"}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {record?.attendance[0]?.is_check_in
                            ? formatTime(record?.attendance[0]?.attendance_time)
                            : "--"}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {record?.attendance?.length > 0 &&
                          record.attendance[record.attendance.length - 1]
                            ?.is_check_in === false
                            ? formatTime(
                                record.attendance[record.attendance.length - 1]
                                  .attendance_time
                              )
                            : "--"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {allSitesAttendance.length > 0 && (
                  <div
                    className={
                      "w-full mt- flex justify-end border rounded-md p-2"
                    }
                  >
                    <Pagination
                      current={totalAllPageNumber + 1}
                      total={totalAllDataPages * 10}
                      pageSize={10}
                      onChange={(page) => {
                        setTotalAllPageNumber(page - 1);
                      }}
                      showSizeChanger={false}
                    />
                  </div>
                )}
              </div>
            )}

            {selectedSite && (
              <div className="bg-white shadow-lg p-4 rounded-lg mt-4">
                <h3 className="font-bold text-center text-xl mb-4">
                  Site Attendance Details
                </h3>
                <div className="mb-4 flex justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSiteWiseStatus("all")}
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      All
                    </button>
                    <button
                      onClick={() => setSiteWiseStatus("present")}
                      className="px-4 py-2 bg-green-300 rounded hover:bg-green-400"
                    >
                      Present
                    </button>
                    <button
                      onClick={() => setSiteWiseStatus("absent")}
                      className="px-4 py-2 bg-red-300 rounded hover:bg-red-400"
                    >
                      Absent
                    </button>
                  </div>

                  <button
                    className="bg-green-400 p-2 px-4 text-sm font-medium rounded-md text-white flex items-center gap-2"
                    onClick={() =>
                      handleDownloadSummaryReport(
                        selectedSite,
                        orgId,
                        selectedDate,

                        multiple_ass.find((site) => site.id == selectedSite)
                          ?.siteName
                      )
                    }
                  >
                    <RiFileExcel2Line size={18} /> Report
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
                    {siteWiseAttendance?.map((record) => (
                      <tr key={record.employee_id}>
                        <td className="border px-4 py-2">{`${record?.first_name} ${record?.last_name}`}</td>
                        <td
                          className={`border px-4 py-2 text-center ${
                            record?.attendance.length > 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {record?.attendance.length > 0 ? "Present" : "Absent"}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {record?.attendance[0]?.is_check_in
                            ? formatTime(record?.attendance[0]?.attendance_time)
                            : "--"}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {record?.attendance?.length > 0 &&
                          record.attendance[record.attendance.length - 1]
                            ?.is_check_in === false
                            ? formatTime(
                                record.attendance[record.attendance.length - 1]
                                  .attendance_time
                              )
                            : "--"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {siteWiseAttendance?.length > 0 && (
                  <div
                    className={
                      "w-full mt- flex justify-end border rounded-md p-2"
                    }
                  >
                    <Pagination
                      current={siteWisePageNumber + 1}
                      total={siteWiseTotalPages * 10}
                      pageSize={10}
                      onChange={(page) => {
                        setSiteWisePageNumber(page - 1);
                      }}
                      showSizeChanger={false}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;