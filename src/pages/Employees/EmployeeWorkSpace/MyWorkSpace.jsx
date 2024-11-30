import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../../components/Navbar";
import EmployeePortal from "../../../components/navbars/EmployeePortal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Table from "../../../components/table/Table";
import { useSelector } from "react-redux";
import { BiPlus } from "react-icons/bi";
import { Link } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import AddRegularizationReq from "./AddRegularizationReq";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import Webcam from "react-webcam";
import {
  getEmployeeAttendanceOfMonth,
  getEmployeeAttendanceOfToday,
  markEmployeeAttendance,
} from "../../../api";
import toast from "react-hot-toast";
const MyWorkSpace = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [addRegularization, setAddRegularization] = useState(false);

 const [showDetails, setShowDetails] = useState(false)


  const column = [
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "Check In",
      selector: (row) => {
        const checkIn = row.attendanceDetails.find(
          (record) => record.checkIn === "Check-In"
        );
        return checkIn ? checkIn.time : "N/A";
        
      },
      sortable: true,
    },

    {
      name: "Check Out",
      selector: (row) => {
        const checkOut = [...row.attendanceDetails]
          .reverse()
          .find((record) => record.checkIn === "Check-Out");
        return checkOut ? checkOut.time : "N/A";
      },
      sortable: true,
      
    },
    {
      name: "Working Hrs",
      selector: (row) => row.working_hrs,
      sortable: true,
    },
    {
      name: "Deviation hrs",
      selector: (row) => row.deviation,
      sortable: true,
    },
    {
      name: "Late/Early Mark",
      selector: (row) => row.mark,
      sortable: true,
      cell: (row) => (
        <span
          style={{
            color:
              row.mark === "Late"
                ? "red"
                : row.mark === "Early"
                ? "orange"
                : row.mark === "On Time"
                ? "green"
                : "black",
          }}
        >
          {row.mark}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row) => <p className="text-green-400">{row.status}</p>,
      sortable: true,
    },
    {
      name: "Shift time",
      selector: (row) => row.shift_time,
      sortable: true,
      // minWidth: "12rem",
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <button  title="View Details">
            <BsEye size={15} />
          </button>
          <button
            className="border p-1 px-2 rounded border-gray-300"
            title="Add Regularization"
            onClick={() => setAddRegularization(true)}
          >
            <BiPlus size={15} />
          </button>
        </div>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      date: "2024-08-28",
      check_in: "08:00 AM",
      check_out: "04:30 PM",
      working_hrs: "8.5 hrs",
      deviation: "0.5 hrs",
      mark: "On Time",
      status: "Present",
      shift_time: "08:00 AM - 05:00 PM",
    },
    {
      id: 2,
      date: "2024-08-27",
      check_in: "09:00 AM",
      check_out: "06:00 PM",
      working_hrs: "9 hrs",
      deviation: "1 hr",
      mark: "Late",
      status: "Present",
      shift_time: "08:00 AM - 05:00 PM",
    },
    {
      id: 3,
      date: "2024-08-26",
      check_in: "08:15 AM",
      check_out: "05:00 PM",
      working_hrs: "8.75 hrs",
      deviation: "0.25 hrs",
      mark: "Early",
      status: "Present",
      shift_time: "08:00 AM - 05:00 PM",
    },
    {
      id: 4,
      date: "2024-08-25",
      check_in: "08:00 AM",
      check_out: "05:15 PM",
      working_hrs: "9.25 hrs",
      deviation: "-0.25 hrs",
      mark: "On Time",
      status: "Present",
      shift_time: "08:00 AM - 05:00 PM",
    },
  ];
  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.date);
    if (startDate && endDate) {
      return itemDate >= startDate && itemDate <= endDate;
    }
    return true;
  });
  const totalCount = filteredData.length;
  const presentCount = filteredData.filter(
    (item) => item.status === "Present"
  ).length;
  const absentCount = filteredData.filter(
    (item) => item.status === "Absent"
  ).length;
  const themeColor = useSelector((state) => state.theme.color);
  const hrmsEmployeeId = getItemInLocalStorage("HRMS_EMPLOYEE_ID");
  const [showCamera, setShowCamera] = useState(false);
  const [checkIn, setCheckIn] = useState(false);
  const [employeeImage, setEmployeeImage] = useState([]);
  const webcamRef = useRef(null);
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const captureImage = (checkInStatus) => {
    const imageSrc = webcamRef.current.getScreenshot();
    setEmployeeImage(imageSrc);
    setCheckIn(checkInStatus);
    handleMarkAttendance();
  };

  const handleMarkAttendance = async () => {
    const postAttendance = new FormData();
    postAttendance.append("is_check_in", checkIn);
    postAttendance.append("employee", hrmsEmployeeId);
    const dataURItoBlob = (dataURI) => {
      const byteString = atob(dataURI.split(",")[1]);
      const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    };
    const imageBlob = dataURItoBlob(employeeImage);
    postAttendance.append("user_image", imageBlob);
    try {
      const response = await markEmployeeAttendance(postAttendance);
      // alert("Attendance marked successfully!");
      toast.success("Attendance marked successfully!");
      setShowCamera(false);
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error(
        "Failed to mark attendance. Please ensure good lighting and scan the face."
      );
    }
  };

  const [attendanceData, setAttendanceData] = useState([]);
  const [month, setMonth] = useState("");

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.toISOString().slice(0, 7);
    setMonth(currentMonth);
  }, []);
  const [consolidatedData, setConsolidatedData] = useState([]);
  const consolidateAttendanceData = (data) => {
    const consolidatedRows = [];
    data.results.forEach((employee) => {
      const { employee_name, attendance_by_date } = employee;

      Object.entries(attendance_by_date).forEach(([date, records]) => {
        consolidatedRows.push({
          employeeName: employee_name,
          date,
          attendanceDetails: records.map((record) => ({
            time: record.attendance_time
              ? new Date(record.attendance_time).toLocaleTimeString("en-US", {
                  timeZone: "UTC",
                  hour12: true,
                })
              : "Invalid Time",
            checkIn: record.is_check_in ? "Check-In" : "Check-Out",
          })),
        });
      });
    });
    console.log(consolidatedRows);
    return consolidatedRows;
  };

  const fetchAttendance = async () => {
    const startDate = `${month}-01`;

    const nextMonth = new Date(
      new Date(month).getFullYear(),
      new Date(month).getMonth() + 1,
      1
    );

    const endDate = new Date(nextMonth - 1);

    const formattedEndDate = endDate.toISOString().slice(0, 10);

    console.log("Start Date:", startDate);
    console.log("End Date:", formattedEndDate);

    try {
      const res = await getEmployeeAttendanceOfMonth(
        hrmsEmployeeId,
        startDate,
        formattedEndDate
      );
      console.log(res); // Handle the response
      setAttendanceData(res);
      const rows = consolidateAttendanceData(res);
      setConsolidatedData(rows);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (month) {
      fetchAttendance();
    }
  }, [month]);

  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const today = new Date();
  const formattedToday = today.toISOString().slice(0, 10);
  const fetchTodayAttendance = async () => {
    try {
      const res = await getEmployeeAttendanceOfToday(
        hrmsEmployeeId,
        formattedToday
      );
      if (res.length !== 0) {
        setAttendanceMarked(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  return (
    <section className="flex">
      <Navbar />
      <div className="p-2 w-full my-2 flex md:mx-2 overflow-hidden flex-col">
        <EmployeePortal />
        <div className="my-2 z-20 flex lg:flex-row flex-col justify-start gap-2 md:justify-between items-start md:items-end">
          <div className="flex md:flex-row flex-col gap-4 mt-2">
            <div className="bg-gray-200 p-4 rounded-lg w-40 text-center">
              <h3 className=" font-semibold">Total</h3>
              <p className="">{totalCount}</p>
            </div>
            <div className="bg-green-200 p-4 rounded-lg w-40 text-center">
              <h3 className=" font-semibold">Present</h3>
              <p className="">{presentCount}</p>
            </div>
            <div className="bg-red-200 p-4 rounded-lg w-40 text-center">
              <h3 className=" font-semibold">Absent</h3>
              <p className="">{absentCount}</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {showCamera && (
              <div className="fixed inset-0 z-50 flex items-center overflow-y-auto justify-center bg-gray-500 bg-opacity-50">
                <div className="max-h-screen bg-white  p-3 w-[32rem] rounded-lg shadow-lg overflow-y-auto">
                  {/* <div> */}
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="rounded-md"
                  />
                  <div className="flex justify-center gap-2 mt-4">
                    {!attendanceMarked ? (
                      <button
                        onClick={() => captureImage(true)}
                        className=" shadow-custom-all-sides rounded-md p-1 px-4 font-semibold bg-green-500 text-white"
                      >
                        Check in
                      </button>
                    ) : (
                      <button
                        onClick={() => captureImage(false)}
                        className=" shadow-custom-all-sides rounded-md p-1 px-4 font-semibold bg-green-500 text-white"
                      >
                        Check out
                      </button>
                    )}
                    <button
                      className="border-2 rounded-md p-1 px-4 border-red-400 text-red-400"
                      onClick={() => setShowCamera(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
            <button
              className=" rounded-md p-2 px-4 font-semibold border border-gray-400"
              onClick={() => setShowCamera(!showCamera)}
            >
              Mark Attendance
            </button>
            <input
              type="month"
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className=" rounded-md p-2 px-4 font-semibold border border-gray-400"
              required
            />
          </div>
        </div>
        <Table columns={column} data={consolidatedData} />
      </div>
      {addRegularization && (
        <AddRegularizationReq onclose={() => setAddRegularization(false)} />
      )}
    </section>
  );
};

export default MyWorkSpace;
