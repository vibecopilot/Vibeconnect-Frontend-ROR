import React, { useEffect, useState } from "react";
import AdminHRMS from "./AdminHrms";
import { useSelector } from "react-redux";
import {
  FaAngleLeft,
  FaAngleRight,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaRedo,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import ToggleSwitch from "../../Buttons/ToggleSwitch";
import EmployeeDetailView from "./EmployeeDetailView";
import {
  getAdminAccess,
  getAttendanceRecord,
  getEmployeeAttendanceOfToday,
  getUserDetails,
  postRegularizationRequest,
  // fetchByIdAndAssociatedOrganization,
  fetchByName,
  fetchByAssociatedOrganization,
  getAssociatedSites,
  getAttendanceRecordFilter,
  fetchByNumeric,
  getExportAttendance
} from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { Link } from "react-router-dom";
import { MdClose, MdOutlinePunchClock } from "react-icons/md";
import { DNA } from "react-loader-spinner";
import toast from "react-hot-toast";
import { Pagination } from "antd";
import Accordion from "./Components/Accordion";
import Table from "../../components/table/Table";
import { CustomDropdown } from "../../utils/CustomDropdown";

const getDateRange = (startDate) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let dateRange = [];

  // Ensure startDate is a valid Date object
  let initialDate = new Date(startDate); // Use the passed startDate directly

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(initialDate); // Avoid mutating the original date
    currentDate.setDate(initialDate.getDate() + i); // Increment date by i days
    dateRange.push(
      `${daysOfWeek[currentDate.getDay()]} ${currentDate
        .getDate()
        .toString()
        .padStart(2, "0")} ${currentDate
        .toLocaleString("default", { month: "short" })
        .toUpperCase()}`
    );
  }

  return dateRange;
};

const AttendanceRec = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedRecord1, setSelectedRecord1] = useState(false);
  const [selectedEmpAttendance, setSelectedEmpAttendance] = useState(false);
  const [addRegularization, setAddRegularization] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const associatedOrgId = getItemInLocalStorage("HRMS_SITE_ID");
  const [attendanceCount, setAttendanceCount] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [attRecords, setAttRecords] = useState([]);
  const [employeeId, SetEmployeeId] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedFirstName, setSelectedFirstName] = useState("");
  const [selectedLastName, setSelectedLastName] = useState("");
  const [allSites, setAllSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState("all");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [checkOutLogs, setCheckOutLogs] = useState([]);
  const [isPresent, setIsPresent] = useState(false);
  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState("");
  const [empDesignation, setEmpDesignation] = useState("");
  const [searchText, setSearchText] = useState("");
  const employeesPerPage = 10;

  const [regData, setRegData] = useState({
    requestType: "",
    checkInTime: "",
    checkOutTime: "",
    reason: "",
  });

  const days = getDateRange(startDate);
  const themeColor = useSelector((state) => state.theme.color);

  // Pagination logic
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;

  const handleNextPage = () => {
    if (indexOfLastEmployee < employees.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleRecordClick = (employee, schedule, code) => {
    setSelectedRecord({ employee, schedule, code });
  };

  const [paginationInfo, setPaginationInfo] = useState({
    next: null,
    previous: null,
  });

  const fetchEmployeeAttendance = async (page) => {
    setLoading(true);
    try {
      const res = await getAttendanceRecord(hrmsOrgId, page);

      const data = res.results;
      setAttendanceCount(res.count);
      console.log("EmployeeData:", data);
      setEmployees(data);
      setFilteredEmployees(data);
      setPaginationInfo({
        next: res.next,
        previous: res.previous,
      });
      setPageNumber(page);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeAttendance(pageNumber);
  }, []);

  const handlePageChange = (page) => {
    console.log("Pagination new page:", page);
    setPageNumber(page);
    if (!selectedSite || selectedSite.site_name === "Select All Sites") {
      fetchEmployeeAttendance(page);
    } else {
      fetchFilteredEmployeeAttendance(page, selectedSite.id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getNextSevenDays = (start) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const nextSevenDays = getNextSevenDays(startDate);

  const getAttendanceStatus = (employee, date) => {
    const today = new Date();
    const record = employee.attendance_records.find(
      (record) => new Date(record.date).toDateString() === date.toDateString()
    );
    const isPastDate = date < today;
    if (isPastDate) {
      return record ? (record.length !== 0 ? "Present" : "Absent") : "Absent";
    }
    return "";
  };
  const changeWeek = (direction) => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    setStartDate(newDate);
  };
  // console.log("EMPLOYEES:", employees);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const sites = await getAssociatedSites(hrmsOrgId);
        console.log("Site name :", sites);
        setAllSites(sites);
      } catch (error) {
        console.error("Error fetching sites:", error);
      }
    };

    fetchSites();
  }, [hrmsOrgId]);

  const fetchFilteredEmployeeAttendance = async (page, siteId) => {
    setLoading(true);
    try {
      // Call your filtered endpoint with the provided siteId
      const res = await getAttendanceRecordFilter(hrmsOrgId, siteId, page);
      const data = res.results;
      setAttendanceCount(res.count);
      console.log("Filtered Attendance Data:", data);
      setEmployees(data);
      setFilteredEmployees(data);
      setPaginationInfo({
        next: res.next,
        previous: res.previous,
      });
      setPageNumber(page);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchText(value);

    // If search is empty, revert to the full list or clear the results.
    if (value.trim() === "") {
      setFilteredEmployees(employees);
      return;
    }

    try {
      let result;
      if (/^\d+$/.test(value)) {
        // Numeric search.
        result = await fetchByAssociatedOrganization(hrmsOrgId, value);
      } else {
        // Name-based search.
        result = await fetchByName(hrmsOrgId, value);
      }
      console.log("result:", result);

      const employeesData = Array.isArray(result.results) ? result.results : [];
      console.log("EmployeeData :", employeesData);
      setFilteredEmployees(employeesData);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      setFilteredEmployees([]);
    }
  };
  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;

  const handleMonthChange = (e) => {
    const selectedMonthString = e.target.value; // Format: "YYYY-MM"
    const [year, month] = selectedMonthString.split("-");

    // Create a new date from the selected month (start from 1st of the month)
    const newStartDate = new Date(year, month - 1, 1);

    setSelectedMonth(newStartDate);
    setStartDate(newStartDate); // Update the start date to the first of the selected month
  };
  const dateRange = getDateRange(startDate);
  useEffect(() => {
    console.log("Weekly Date Range:", dateRange);
  }, [startDate]);

  const handleRegChanges = async (e) => {
    setRegData({ ...regData, [e.target.name]: e.target.value });
  };

  const handleShowAttendanceDetails = (
    dateSelected,
    detailRecords,
    empId,
    firstName,
    lastName
  ) => {
    setSelectedDate(dateSelected);
    setAttRecords(detailRecords);
    SetEmployeeId(empId);
    setSelectedFirstName(firstName);
    setSelectedLastName(lastName);
  };

  function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }
  console.log(regData);

  const handleAddRegRequest = async () => {
    try {
      const todayDate = new Date().toISOString().split("T")[0];
      const requestedCheckIn = regData.checkInTime
        ? new Date(`${todayDate}T${regData.checkInTime}:00Z`).toISOString()
        : "";
      const requestedCheckOut = regData.checkOutTime
        ? new Date(`${todayDate}T${regData.checkOutTime}:00Z`).toISOString()
        : "";
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const postData = new FormData();
      postData.append("requested_date", formattedDate);
      postData.append(
        "requested_check_in",
        regData.checkInTime ? `${regData.checkInTime}:00` : ""
      );
      postData.append(
        "requested_check_out",
        regData.checkOutTime ? `${regData.checkOutTime}:00` : ""
      );
      postData.append("request_type", regData.requestType);
      postData.append("reason", regData.reason);
      postData.append("status", "approve");
      postData.append("employee", employeeId);
      await postRegularizationRequest(postData);

      setAddRegularization(false);
      setSelectedEmpAttendance(false);
      setRegData({
        ...regData,
        checkInTime: "",
        checkOutTime: "",
        requestType: "",
        reason: "",
      });
      toast.success("Regularization request submitted successfully");
    } catch (error) {
      console.log("Error submitting regularization request:", error);
      toast.error("Failed to submit the regularization request");
    }
  };
  const fetchEmployeeFullDetails = async (empId) => {
    try {
      const res = await getUserDetails(empId);
      setEmpDesignation(
        res?.employment_info?.designation || "Designation not assigned"
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Changes
  const navigateToLocation = (latitude, longitude) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, "_blank");
  };

  const [emplocation, setEmployeeLocation] = useState([]);
  const safeLoc = Array.isArray(emplocation) ? emplocation : [];
  const firstLocation = safeLoc[0] ?? {};
  const validLocations = safeLoc.filter(
    (loc) => loc?.latitude && loc?.longitude
  );
  const lastValidLocation = validLocations[validLocations.length - 1] ?? null;

  const fetchTodayAttendance = async (empId, dateString) => {
    await fetchEmployeeFullDetails(empId);
    try {
      const date = new Date(dateString);
      const formattedDate = date.toISOString().slice(0, 10);
      const formattedEnd = date.toISOString().slice(0, 10);
      setSelectedAttendanceDate(formattedDate);
      const res = await getEmployeeAttendanceOfToday(
        empId,
        formattedDate,
        formattedEnd
      );
      console.log("attendance record for emp:", res);
      if (res && res.length > 0) {
        const checkInRecord = res.find((record) => record.is_check_in === true);
        setIsPresent(checkInRecord ? checkInRecord.is_check_in : false);
        const reversedRes = [...res].reverse();
        const checkOutRecord = reversedRes.find(
          (record) => record.is_check_in === false
        );
        console.log("CheckOutRecord:", checkOutRecord);

        const checkInTime = checkInRecord
          ? new Date(checkInRecord.attendance_time).toLocaleTimeString()
          : null;
        const checkOutTime = checkOutRecord
          ? new Date(checkOutRecord.attendance_time).toLocaleTimeString()
          : null;
        console.log("CheckOutTime:", checkOutTime);

        // const checkOutTime = checkOutRecord
        //   ? new Date(checkOutRecord.attendance_time).toLocaleTimeString()
        //   : null;
        // console.log("checkOutTime:", checkOutTime);

        // const checkInTime = checkInRecord
        //   ? formatTimeToAmPmUTC(checkInRecord.attendance_time)
        //   : null;
        // const checkOutTime = checkOutRecord
        //   ? formatTimeToAmPmUTC(checkInRecord.attendance_time)
        //   : null;
        const validLocations = res.filter(
          ({ latitude, longitude }) => latitude != null && longitude != null
        );
        const location =
          validLocations.length > 0
            ? validLocations.map(({ latitude, longitude }) => ({
                latitude,
                longitude,
              }))
            : null;
        if (!location) {
          console.warn("No valid location data available.", location);
        }

        setCheckInTime(checkInTime || "-");
        setCheckOutTime(checkOutTime || "-");
        setEmployeeLocation(location);
        setCheckOutLogs(res);
        console.log(res);
      } else {
        setCheckInTime("");
        setCheckOutTime("");
        setIsPresent(false);
        setEmployeeLocation([]); // Clear out location data.
      }
    } catch (error) {
      console.log("Error fetching attendance:", error);
    }
    console.log("employeeLocation:", emplocation);
  };

  const checkOutLogsColumn = [
    {
      name: "Particular",
      selector: (row) => (row.is_check_in ? "Check in" : "Check out"),
      sortable: true,
    },
    {
      name: "Timing",
      selector: (row) => new Date(row.attendance_time).toLocaleTimeString(),
      sortable: true,
    },
  ];

  const formatTimeToAmPmUTC = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const amPm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0-23 to 1-12, with 0 being 12 AM
    const formattedMinutes = minutes.toString().padStart(2, "0"); // Ensure two digits for minutes

    return `${formattedHours}:${formattedMinutes} ${amPm}`;
  };

  const empId = getItemInLocalStorage("HRMS_EMPLOYEE_ID");
  const orgId = getItemInLocalStorage("HRMSORGID");
  const [roleAccess, setRoleAccess] = useState({});

  useEffect(() => {
    const fetchRoleAccess = async () => {
      try {
        const res = await getAdminAccess(orgId, empId);

        setRoleAccess(res[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoleAccess();
  }, []);

  //export attendance record in excell
  // const [exportAllData, setExportAllData]=useState([])
  // const getAllAttendanceData = async()=>{
  //   const allAttendanceResp =await getExportAttendance(orgId)
  //   console.log("attendance response",allAttendanceResp)
  //   setExportAllData(allAttendanceResp)
  //   return allAttendanceResp
  // }
  // const exportToExcel = async()=>{
  //   const url = `https://api.hrms.vibecopilot.ai/user-details/download?organization_id=${orgId}`
  //   const link = document.createElement('a');
  // link.href = url;
  // link.setAttribute('download', 'data.json'); // optional, server usually overrides this
  // document.body.appendChild(link);
  // link.click();
  // link.remove();
     
  // }

  // calculating the working hrs 
  // Convert 24-hour time to AM/PM format
const formatToAmPm = (timeString) => {
  if (!timeString || timeString === "-") return "-";
  
  try {
    // Handle case where time might already be in AM/PM format
    if (timeString.includes("AM") || timeString.includes("PM")) {
      return timeString;
    }
    
    // Parse 24-hour format
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    console.error("Error formatting time:", error);
    return "-";
  }
};

// Convert AM/PM time to 24-hour format for calculations
const amPmTo24Hour = (timeString) => {
  if (!timeString || timeString === "-") return null;
  
  try {
    const [time, period] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error("Error converting time:", error);
    return null;
  }
};
// calculating working hrs 
const calculateWorkingHours = (checkInTime, checkOutTime) => {
  if (!checkInTime || !checkOutTime || checkInTime === "-" || checkOutTime === "-") {
    return "-";
  }
  
  try {
    // Convert AM/PM times to 24-hour format for calculation
    const checkIn24 = amPmTo24Hour(checkInTime);
    const checkOut24 = amPmTo24Hour(checkOutTime);
    
    if (!checkIn24 || !checkOut24) return "-";
    
    // Parse the times
    const [inHours, inMinutes] = checkIn24.split(':').map(Number);
    const [outHours, outMinutes] = checkOut24.split(':').map(Number);
    
    // Convert to total minutes
    const totalInMinutes = inHours * 60 + inMinutes;
    const totalOutMinutes = outHours * 60 + outMinutes;
    
    // Calculate difference in minutes
    let diffMinutes = totalOutMinutes - totalInMinutes;
    
    // Handle overnight shifts (if check-out is next day)
    if (diffMinutes < 0) {
      diffMinutes += 24 * 60; // Add 24 hours
    }
    
    // Convert back to hours and minutes
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  } catch (error) {
    console.error("Error calculating working hours:", error);
    return "-";
  }
};
  

  return (
    <div className="flex">
      <AdminHRMS />

      <div className="ml-20 bg-gray-100 p-2 w-full mb-5">
        {/* Header */}
        <div>
          <header
            style={{ background: themeColor }}
            className="bg-blue-500 text-white p-4 flex justify-between rounded-md items-center"
          >
            <h1 className="text-2xl font-semibold">Attendance Record</h1>
            <div className="flex items-center space-x-4">
              <input
                id="monthSelect"
                className="border p-1 w-64 px-4 text-black border-gray-500 rounded-md"
                value={`${selectedMonth.getFullYear()}-${(
                  selectedMonth.getMonth() + 1
                )
                  .toString()
                  .padStart(2, "0")}`} // Format to YYYY-MM
                type="month"
                onChange={handleMonthChange}
              />
              {/* <select className="border p-2 text-black w-48 rounded">
                <option value="">Action</option>
                <option value="">Bulk Regularization</option>
                <option value="">Bulk Delete</option>
              </select>
              <button className="bg-white p-2 text-black rounded">
                Upload Records
              </button>
              <button
                style={{ background: themeColor }}
                className="bg-black p-2 rounded"
              >
                Filter
              </button>
              <button
                style={{ background: themeColor }}
                className="bg-black p-2 rounded"
              >
                <FaRedo />
              </button>
              <label className="text-white" htmlFor="">
                Multiselect
              </label>
              <ToggleSwitch /> */}
            </div>
          </header>
        </div>

        {/* Legend */}
        <div className="flex gap-5 mt-2">
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-green-500 mt-1 rounded-full"></div>
            <p> Present</p>
          </div>
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-red-500 mt-1 rounded-full"></div>
            <p> Absent</p>
          </div>
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-orange-500 mt-1 rounded-full"></div>
            <p>Weekly Off/Holiday</p>
          </div>
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-blue-500 mt-1 rounded-full"></div>
            <p>Half Day</p>
          </div>
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-gray-500 mt-1 rounded-full"></div>
            <p>No Shift/Template missing</p>
          </div>
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-black mt-1 rounded-full"></div>
            <p> Invalid Record</p>
          </div>
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-yellow-400 mt-1 rounded-full"></div>
            <p> Early</p>
          </div>
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-pink-400 mt-1 rounded-full"></div>
            <p> Late</p>
          </div>
        </div>

        <div className="flex items-center justify-between my-4 gap-4">
          {/* Left group: Dropdown + Search */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={searchText}
              onChange={handleSearch}
              className="border border-gray-400 p-2 rounded-md w-96"
              placeholder="Search by employee name"
            />

            <CustomDropdown
              AllSites={allSites}
              selectedValue={selectedSite}
              onSelect={(site) => {
                if (site.site_name === "Select All Sites") {
                  setSelectedSite(null);
                  fetchEmployeeAttendance(1);
                } else {
                  setSelectedSite(site);
                  fetchFilteredEmployeeAttendance(1, site.id);
                }
              }}
            />
          </div>
          {/* <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              // onClick={exportToExcel}
              style={{ background: themeColor }}
            >
              Export
            </button> */}

          {/* Right group: Prev Button + Date Range + Next Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeWeek("prev")}
              className="font-bold p-2 rounded border-2 text-black border-black"
            >
              <FaAngleLeft />
            </button>
            <span className="text-sm font-medium">
              {formatDate(nextSevenDays[0].toISOString())} -{" "}
              {formatDate(nextSevenDays[6].toISOString())}
            </span>
            <button
              onClick={() => changeWeek("next")}
              className="font-bold p-2 rounded border-2 text-black border-black"
            >
              <FaAngleRight size={20} />
            </button>
          </div>
          
        </div>
        

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <DNA
                visible={true}
                height="120"
                width="120"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
              />
            </div>
          ) : filteredEmployees.length > 0 ? (
            <table className="w-full bg-white shadow-sm border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left ">Employee Name</th>
                  {nextSevenDays.map((date, index) => (
                    <th
                      key={index}
                      className="p-2  border-none text-center font-mono"
                    >
                      {formatDate(date.toISOString())}
                    </th>
                  ))}
                  {/* <th></th> */}
                </tr>
              </thead>
              <tbody>
                {/* {filteredEmployees &&
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="p-2 font-medium border-b flex items-center gap-2">
                        {employee?.profile_photo ? (
                          <div className=" h-10 w-10 rounded-full border">
                            <img
                              src={employee.profile_photo}
                              alt=""
                              className="rounded-full h-10 w-10"
                            />
                          </div>
                        ) : (
                          <div
                            className=" text-white p-2 flex items-center justify-center rounded-full h-10 w-10 text-xs text-center border border-gray-700"
                            style={{ background: themeColor }}
                          >
                            {employee.first_name.charAt(0).toUpperCase()}
                            {employee.last_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {employee.first_name} {employee.last_name}
                      </td>
                      {nextSevenDays.map((date, index) => (
                        <td key={index} className="p-2 text-center border-b">
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              console.log(
                                "Employee attendance selected!",
                                date,
                                employee
                              );
                              handleShowAttendanceDetails(
                                date,
                                employee.attendance_records,
                                employee.id,
                                employee.first_name,
                                employee.last_name
                              );
                              setSelectedEmpAttendance(true);
                              fetchTodayAttendance(employee.id, date);
                            }}
                            className={
                              getAttendanceStatus(employee, date) === "Present"
                                ? "text-green-600 border-2 rounded-full border-green-600 p-1 px-3"
                                : getAttendanceStatus(employee, date) ===
                                  "Absent"
                                ? "text-red-600 border-2 rounded-full border-red-600 p-1 px-3"
                                : ""
                            }
                          >
                            {getAttendanceStatus(employee, date)}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))} */}

                {filteredEmployees &&
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="p-2 font-medium border-b flex items-center gap-2">
                        {employee?.profile_photo ? (
                          <div className="h-10 w-10 rounded-full border">
                            <img
                              src={employee.profile_photo}
                              alt=""
                              className="rounded-full h-10 w-10"
                            />
                          </div>
                        ) : (
                          <div
                            className="text-white p-2 flex items-center justify-center rounded-full h-10 w-10 text-xs text-center border border-gray-700"
                            style={{ background: themeColor }}
                          >
                            {employee.first_name.charAt(0).toUpperCase()}
                            {employee.last_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {employee.first_name} {employee.last_name}
                      </td>
                      {nextSevenDays.map((date, index) => (
                        <td key={index} className="p-2 text-center border-b">
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              console.log(
                                "Employee attendance selected!",
                                date,
                                employee
                              );
                              handleShowAttendanceDetails(
                                date,
                                employee.attendance_records,
                                employee.id,
                                employee.first_name,
                                employee.last_name
                              );
                              setSelectedEmpAttendance(true);
                              fetchTodayAttendance(employee.id, date);
                            }}
                            className={
                              getAttendanceStatus(employee, date) === "Present"
                                ? "text-green-600 border-2 rounded-full border-green-600 p-1 px-3"
                                : getAttendanceStatus(employee, date) ===
                                  "Absent"
                                ? "text-red-600 border-2 rounded-full border-red-600 p-1 px-3"
                                : ""
                            }
                          >
                            {getAttendanceStatus(employee, date)}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p>No records to show</p>
            </div>
          )}
          <div></div>
        </div>
        <div className="flex justify-end mb-5 mt-2">
          <Pagination
            showSizeChanger={false}
            current={pageNumber}
            total={attendanceCount}
            pageSize={10}
            onChange={handlePageChange}
          />
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Filter Options</h2>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Attendance Template
                </label>
                <input type="text" className="border p-2 w-full rounded" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Branch Location</label>
                <input type="text" className="border p-2 w-full rounded" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Employee Department
                </label>
                <input type="text" className="border p-2 w-full rounded" />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-300 p-2 rounded"
                  onClick={handleModalToggle}
                >
                  Cancel
                </button>
                <button className="bg-blue-400 p-2 rounded">Apply</button>
              </div>
            </div>
          </div>
        )}
        {isModalOpen2 && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Refresh Records</h2>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Select Start Date *
                </label>
                <input type="date" className="border p-2 w-full rounded" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Select End Date *</label>
                <input type="date" className="border p-2 w-full rounded" />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-300 p-2 rounded"
                  onClick={() => setIsModalOpen2(false)}
                >
                  Cancel
                </button>
                <button className="bg-blue-400 p-2 rounded">Submit</button>
              </div>
            </div>
          </div>
        )}
      </div>
      {isModalOpen1 && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-2/3">
            <h2 className="text-xl font-bold mb-4">
              Upload Attendance Records
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700">
                Step 1: Select upload format*
              </label>
              <select
                value={uploadFormat}
                onChange={(e) => setUploadFormat(e.target.value)}
                className="border border-gray-400 p-2 rounded-md mt-1"
              >
                <option value="Vibe Connect">
                  Vibe Connect General Format
                </option>
                <option value="ESSL">ESSL Basic Report Format</option>
              </select>
            </div>

            {uploadFormat === "Vibe Connect" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Step 2: Select month and year for download or upload*
                  </label>
                  <div className="flex gap-5 mb-4">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-48 border border-gray-400 p-2 rounded-md"
                    >
                      <option value="">Select year</option>
                      {/* Add options for years here */}
                    </select>

                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-48 border border-gray-400 p-2 rounded-md"
                    >
                      <option value="">Select month</option>
                      {/* Add options for months here */}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">
                    Step 3: Download attendance global format*
                  </label>
                  <p className="text-gray-600 text-sm mb-2">
                    Includes all your employees with their pre-existing
                    attendance records as per Company's Attendance Cycle Dates
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    <li>
                      Select all the cells instructions when uploading check in
                      times
                    </li>
                    <li>Right click and select the format cells button</li>
                    <li>Choose the "Text" format</li>
                    <li>
                      Enter the check-in / check-out times in AM/PM format: E.g.
                      8:05 AM or 12:30 PM
                    </li>
                  </ul>
                  <button
                    onClick={handleUpload}
                    className="w-52 mt-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                  >
                    Download
                  </button>
                </div>
              </>
            )}

            {uploadFormat === "ESSL" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Step 2: Download sample biometric format
                  </label>
                  <p className="text-gray-600 text-sm mb-2">
                    Includes all your Employees with their pre-existing
                    attendance records as per Company's Attendance Cycle Dates
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    <li>
                      Make sure that attendance template assigned to employees
                      have Biometric or Both Biometric & Web check-in enabled.
                    </li>
                    <li>
                      ESSL upload would not work for employees not having
                      Biometric code.
                    </li>
                    <button
                      onClick={handleUpload}
                      className="w-52 mt-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                    >
                      Download
                    </button>
                  </ul>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">
                    Step 3: Select date format in which you want to upload*
                  </label>
                  <select
                    value={selectedDateFormat}
                    onChange={(e) => setSelectedDateFormat(e.target.value)}
                    className="w-48 border border-gray-400 p-2 rounded-md"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    {/* Add other date formats if needed */}
                  </select>
                </div>
              </>
            )}

            <div className="mb-4">
              <label className="block text-gray-700">
                Step 4: Make necessary changes in the downloaded file and
                upload*
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="mt-1 border p-2 rounded-md"
              />
            </div>

            <div className="flex justify-center gap-2">
              <button
                onClick={handleUpload}
                className="w-48 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Upload
              </button>
              <button
                onClick={() => setIsModalOpen1(false)}
                className="w-48 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-red-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Employee Details Modal */}
      {selectedEmpAttendance && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white px-6 py-4 rounded-xl shadow-lg min-w-96 max-h-[35rem] overflow-auto hide-scrollbar">
            <h2 className=" font-semibold mb-2 border-b">
              Selected Employee Details
            </h2>
            {!addRegularization ? (
              <div>
                <div
                  style={{ background: themeColor }}
                  className="flex justify-between gap-2 bg-gray-100 items-center p-2 rounded-md w-[40rem] "
                >
                  <div className="flex gap-2 items-center">
                    <div className="bg-white rounded-full mr-2">
                      <div
                        className=" text-white p-2 flex items-center justify-center rounded-full h-10 w-10 text-sm text-center border-2 border-white font-medium"
                        style={{ background: themeColor }}
                      >
                        {selectedFirstName.charAt(0).toUpperCase()}
                        {selectedLastName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex flex-col ">
                      <p className="font-semibold text-white text-lg">
                        {selectedFirstName} {selectedLastName}
                      </p>
                      <p className="font-sm text-white">{empDesignation}</p>
                    </div>
                  </div>
                  {isPresent ? (
                    <div className=" h-8 border-2 p-2 flex justify-center items-center bg-green-500 rounded-md">
                      <p className="font-medium  text-white">Present</p>
                    </div>
                  ) : (
                    <div className=" h-8 border-2 p-2 flex justify-center items-center bg-red-500 rounded-md">
                      <p className="font-medium  text-white">Absent</p>
                    </div>
                  )}
                </div>
                {/* Modal */}
                <div className="flex flex-col gap-2 my-2">
                  <div className="w-full border-b flex justify-between items-center">
                    <p className="font-medium">Attendance Details </p>
                    {/* <p></p> */}
                    <p className="font-mono">{selectedAttendanceDate}</p>
                  </div>

                  <div className="flex justify-between">
    <p className="font-medium">Check In Time:</p>
    <p>{checkInTime ? formatToAmPm(checkInTime) : "-"}</p>
  </div>

                  
  <div className="flex justify-between">
    <p className="font-medium">Check Out Time:</p>
    <p>{checkOutTime ? formatToAmPm(checkOutTime) : "-"}</p>
  </div>
                  <div>
                    {safeLoc.length > 0 && (
                      <>
                        {/* Display first location */}
                        <div className="flex justify-between">
                          <h3 className="font-medium">Check In Location :</h3>
                          <button
                            className="flex items-center space-x-1"
                            onClick={() =>
                              navigateToLocation(
                                firstLocation.latitude,
                                firstLocation.longitude
                              )
                            }
                          >
                            <span className="text-slate-900">Map</span>
                            <FaLocationDot />
                          </button>
                        </div>
                        {/* Display last location */}
                        <div>
                          {lastValidLocation ? (
                            <div className="flex justify-between my-2">
                              <h3 className="font-medium">
                                Check Out Location:
                              </h3>
                              <button
                                className="flex items-center space-x-1"
                                onClick={() =>
                                  navigateToLocation(
                                    lastValidLocation.latitude,
                                    lastValidLocation.longitude
                                  )
                                }
                              >
                                <span className="text-slate-900">Map</span>
                                <FaLocationDot />
                              </button>
                            </div>
                          ) : (
                            <p>No valid Checkout Location Found.</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <Accordion
                    icon={MdOutlinePunchClock}
                    title={"Attendance logs"}
                    content={
                      <div>
                        <Table
                          columns={checkOutLogsColumn}
                          data={checkOutLogs}
                          isPagination={false}
                        />
                      </div>
                    }
                  />
                  <div className=" flex justify-between">
                    <p className="font-medium">Working Hrs :</p>
                    <p>
      {checkInTime && checkOutTime && checkInTime !== "-" && checkOutTime !== "-"
        ? calculateWorkingHours(
            formatToAmPm(checkInTime),
            formatToAmPm(checkOutTime)
          )
        : "-"}
    </p>
                  </div>
                  <div className=" flex justify-between">
                    <p className="font-medium">Break Hrs :</p>
                    <p>-</p>
                  </div>
                  <div className=" flex justify-between">
                    <p className="font-medium">Deviation Hrs :</p>
                    <p>-</p>
                  </div>
                  <div className=" flex justify-between">
                    <p className="font-medium">Late/Early Mark :</p>
                    <p>-</p>
                  </div>
                  <div className=" flex justify-between">
                    <p className="font-medium">Shift Time :</p>
                    {/* <p>{selectedRecord.schedule}</p> */}
                  </div>
                  <div className="flex gap-2 justify-end border-t p-1 ">
                    {roleAccess.can_apply_regularization_on_behalf_of_employee && (
                      <button
                        className=" bg-blue-500 text-white px-4 py-2 rounded-full"
                        onClick={() => setAddRegularization(true)}
                      >
                        Apply For Regularization
                      </button>
                    )}

                    <button
                      className=" bg-red-500 text-white px-4 py-2 rounded-full"
                      onClick={() => {
                        setSelectedEmpAttendance(false), setCheckOutLogs([]);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div
                  style={{ background: themeColor }}
                  className="flex justify-between gap-2 bg-gray-100 items-center p-2 rounded-md w-[40rem]"
                >
                  <div className="flex gap-2 items-center">
                    <div className="flex flex-col ">
                      <p className="font-semibold text-white text-lg">
                        New regularization Request
                      </p>
                      <p className="font-mono text-white">
                        {selectedDate.toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  </div>
                  {isPresent ? (
                    <div className=" h-8 border-2 p-2 flex justify-center items-center bg-green-500 rounded-md">
                      <p className="font-medium  text-white">Present</p>
                    </div>
                  ) : (
                    <div className=" h-8 border-2 p-2 flex justify-center items-center bg-red-500 rounded-md">
                      <p className="font-medium  text-white">Absent</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 my-2">
                  <div className="w-full border-b flex justify-between items-center">
                    <p className="font-medium">Regularization Details </p>
                  </div>
                  <div className=" flex flex-col gap-2">
                    <label htmlFor="" className="font-medium">
                      Type of request
                    </label>
                    <select
                      name="requestType"
                      id=""
                      className="border border-gray-300 rounded-md p-2"
                      value={regData.requestType}
                      onChange={handleRegChanges}
                    >
                      <option value="">Select request type</option>
                      <option value="Check in">Check in request</option>
                      <option value="Check out">Check out request</option>
                      <option value="Check in & out">
                        Check in & Check out request
                      </option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    {regData.requestType === "Check in" && (
                      <div className="flex flex-col gap-2">
                        <label htmlFor="" className="font-medium">
                          Check-In
                        </label>
                        <input
                          type="time"
                          name="checkInTime"
                          value={regData.checkInTime}
                          onChange={handleRegChanges}
                          id=""
                          className="border border-gray-300 rounded-md p-2"
                        />
                      </div>
                    )}
                    {regData.requestType === "Check out" && (
                      <div className="flex flex-col gap-2">
                        <label htmlFor="" className="font-medium">
                          Check-Out
                        </label>
                        <input
                          type="time"
                          name="checkOutTime"
                          value={regData.checkOutTime}
                          onChange={handleRegChanges}
                          id=""
                          className="border border-gray-300 rounded-md p-2"
                        />
                      </div>
                    )}
                    {regData.requestType === "Check in & out" && (
                      <div className="grid grid-cols-2 gap-1">
                        <div className="flex flex-col gap-2">
                          <label htmlFor="" className="font-medium">
                            Check in
                          </label>
                          <input
                            type="time"
                            name="checkInTime"
                            value={regData.checkInTime}
                            onChange={handleRegChanges}
                            id=""
                            className="border border-gray-300 rounded-md p-2"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label htmlFor="" className="font-medium">
                            Check out
                          </label>
                          <input
                            type="time"
                            name="checkOutTime"
                            value={regData.checkOutTime}
                            onChange={handleRegChanges}
                            id=""
                            className="border border-gray-300 rounded-md p-2"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="" className="font-medium">
                      Comment
                    </label>
                    <textarea
                      name="reason"
                      value={regData.reason}
                      onChange={handleRegChanges}
                      id=""
                      cols="30"
                      rows="3"
                      className="border border-gray-300 rounded-md p-2"
                    ></textarea>
                  </div>
                  <div className="flex gap-2 justify-end items-center border-t p-1 ">
                    <button
                      className=" bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2"
                      onClick={() => setAddRegularization(false)}
                    >
                      <MdClose /> Cancel
                    </button>
                    <button
                      className=" bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2"
                      onClick={handleAddRegRequest}
                    >
                      <FaCheck /> Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceRec;

// const handleSearch =  (e) => {
//   const value = e.target.value;
//   setSearchText(value);
//   if (value.trim() === "") {
//     setFilteredEmployees(employees);
//     return;
//   }
//   try {
//     if (/^\d+$/.test(value)) {
//       // You could choose either fetchByNumeric or fetchByIdAndAssociatedOrganization;
//       // here they do the same thing.
//       const result = fetchById(
//         hrmsOrgId,
//         value
//       );
//     } else {
//       const result =  fetchByName(
//         hrmsOrgId,
//         value
//       );
//     }
//     console.log("result data:",result.data)
//     setFilteredEmployees(result.data || result);
//     // const filteredResult = employees.filter(
//     //   (employee) =>
//     //     `${employee.first_name} ${employee.last_name}`
//     //   .toLowerCase()
//     //   .includes(searchValue.toLowerCase()) ||
//     //   employee.associated_organization_name
//     //   .toLowerCase()
//     //   .includes(searchValue.toLowerCase())
//     // );
//     // setFilteredEmployees(filteredResult);
//   } catch (error) {
//     console.error("Error fetching attendance records:", error);
//     setFilteredEmployees([]);
//   }
// };

// const handleSearch = async (e) => {
//   const value = e.target.value;
//   setSearchText(value);

//   // If the search value is empty, show all employees or clear the search result.
//   if (value.trim() === "") {
//     setFilteredEmployees(employees);
//     return;
//   }

//   try {
//     let result; // Declare result in the outer scope.

//     if (/^\d+$/.test(value)) {
//       // Await the asynchronous call for numeric search.
//       result = await fetchById(hrmsOrgId, value);
//     } else {
//       // Await the asynchronous call for name search.
//       result = await fetchByName(hrmsOrgId, value);
//     }

//     console.log("result data:", result.data); // Ensure your API returns data in result.data or adjust accordingly.

//     // Update the state with the fetched data.
//     // If your API returns an object with a `data` property, use that.
//     // Otherwise, use the result directly.
//     setFilteredEmployees(result.data || result);
//   } catch (error) {
//     console.error("Error fetching attendance records:", error);
//     setFilteredEmployees([]);
//   }
// };

// const handleSearch = async (e) => {
//   const value = e.target.value;
//   setSearchText(value);

//   // If search is empty, revert to the full list or clear the results
//   if (value.trim() === "") {
//     setFilteredEmployees(employees);
//     return;
//   }

//   try {
//     let result;

//     if (/^\d+$/.test(value)) {
//       // Numeric search
//       result = await fetchById(hrmsOrgId, value);
//     } else {
//       // Name-based search
//       result = await fetchByName(hrmsOrgId, value);
//     }

//     // Log the full response to inspect its structure
//     console.log("result:", result.results);

//     // Update filteredEmployees based on the response structure
//     const employeesData = Array.isArray(result.results);
//     setFilteredEmployees(employeesData);
//   } catch (error) {
//     console.error("Error fetching attendance records:", error);
//     setFilteredEmployees([]);
//   }
// };

// const handleSearch = async (e) => {
//   const value = e.target.value;
//   setSearchText(value);

//   // If search is empty, revert to the full list or clear the results
//   if (value.trim() === "") {
//     setFilteredEmployees(employees);
//     return;
//   }

//   try {
//     let result;

//     if (/^\d+$/.test(value)) {
//       // Numeric search
//       result = await fetchById(hrmsOrgId, value);
//     } else {
//       // Name-based search
//       result = await fetchByName(hrmsOrgId, value);
//     }

//     // Log the full response to inspect its structure
//     console.log("result:", result);

//     // If the API returns an array directly, use it
//     const employeesData = Array.isArray(result) ? result : [];
//     setFilteredEmployees(employeesData);
//   } catch (error) {
//     console.error("Error fetching attendance records:", error);
//     setFilteredEmployees([]);
//   }
// };
