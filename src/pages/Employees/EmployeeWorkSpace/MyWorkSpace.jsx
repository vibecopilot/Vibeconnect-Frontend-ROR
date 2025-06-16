import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../../components/Navbar";
import EmployeePortal from "../../../components/navbars/EmployeePortal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Table from "../../../components/table/Table";
import { useSelector } from "react-redux";
import { BiPlus } from "react-icons/bi";
import { Link, useParams } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import AddRegularizationReq from "./AddRegularizationReq";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import Webcam from "react-webcam";
import {
  getEmployeeAttendanceOfMonth,
  getEmployeeAttendanceOfToday,
  getEmployeeDetails,
  markEmployeeAttendance,
  getAssociatedSiteOnly,
} from "../../../api";
import toast from "react-hot-toast";
import { PiPlus, PiPlusCircleBold, PiPlusCircleDuotone } from "react-icons/pi";
import AddRegRequest from "./AddRegRequest";
const MyWorkSpace = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [addRegularization, setAddRegularization] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [regDate, setRegDate] = useState("");
  const themeColor = useSelector((state) => state.theme.color);
  const hrmsEmployeeId = getItemInLocalStorage("HRMS_EMPLOYEE_ID");
  const [employeeLocation, setEmployeeLocation] = useState({});
  const [showCamera, setShowCamera] = useState(false);
  const [checkIn, setCheckIn] = useState(false);
  const [employeeImage, setEmployeeImage] = useState([]);
  const webcamRef = useRef(null);
  const { id } = useParams();
  const empId = getItemInLocalStorage("HRMS_EMPLOYEE_ID");

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
          {/* <button title="View Details">
            <BsEye size={15} />
          </button> */}
          <button
            className="border p-1 px-2 rounded border-gray-300"
            title="Add Regularization"
            // onClick={() => setAddRegularization(true)}
            onClick={() => handleRegModal(row.date)}
          >
            <BiPlus size={15} />
          </button>
        </div>
      ),
    },
  ];

  const handleRegModal = (selectedDate) => {
    setRegDate(selectedDate);
    setAddRegularization(true);
  };

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

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const [goeTag, setgeoTag] = useState(false);
  // const [siteId ,setSiteId] = useState();
  const siteId = getItemInLocalStorage("HRMS_SITE_ID");
  const [qrCodeStatus, setqrCodeStatus] = useState(false);
  const [qrCodeUrl, setqrCodeUrl] = useState(false);
  const [siteLocation, setSiteLocation] = useState({});

  const fetchEmployeeDetails = async () => {
    try {
      const res = await getEmployeeDetails(empId);
      console.log("Employee Details:", res);
      console.log("Employee geotag_enabled:", res.geotag_enabled);
      setgeoTag(res.geotag_enabled);
    } catch (error) {
      console.log("Error fetching employee details:", error);
    }
  };

  // Helper: Calculate distance between two coordinates using the Haversine formula
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const toRad = (x) => (x * Math.PI) / 180;
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);
    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const allowedDistance = 100; // Allowed range in meters

  const captureImage = (checkInStatus) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Latitude is:", latitude, longitude);
        const imageSrc = webcamRef.current.getScreenshot();

        // Validate that the imageSrc is a non-empty string
        if (
          !imageSrc ||
          typeof imageSrc !== "string" ||
          imageSrc.trim() === ""
        ) {
          toast.error("Image capture failed. Please try again.");
          return;
        }

        setEmployeeImage(imageSrc);
        setCheckIn(checkInStatus);
        const currentLocation = { latitude, longitude };
        setEmployeeLocation(currentLocation);
        handleMarkAttendance(currentLocation);
      },
      (error) => {
        console.log("Error getting location:", error);
        // If geotag is enabled, don't proceed without valid location.
        if (goeTag) {
          toast.error("Failed to fetch location. Cannot mark attendance.");
          return;
        }
        // If geotag is disabled, proceed without location.
        const imageSrc = webcamRef.current.getScreenshot();
        if (
          !imageSrc ||
          typeof imageSrc !== "string" ||
          imageSrc.trim() === ""
        ) {
          toast.error("Image capture failed. Please try again.");
          return;
        }
        setEmployeeImage(imageSrc);
        setCheckIn(checkInStatus);
        handleMarkAttendance();
      }
    );
  };

  // Convert dataURI to Blob for employee image
  const dataURItoBlob = (dataURI) => {
    if (typeof dataURI !== "string") {
      console.error("Expected a data URI string, but got:", dataURI);
      toast.error("Invalid image data Click Again");
      return null;
    }
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };


  const handleMarkAttendance = async (currentLocationParam) => {
    const currentLocation = currentLocationParam || employeeLocation;

    if (goeTag) {
      if (
        !currentLocation ||
        !currentLocation.latitude ||
        !currentLocation.longitude
      ) {
        toast.error("Employee location not available.");
        return;
      }
      if (!siteLocation || !siteLocation.latitude || !siteLocation.longitude) {
        toast.error("Site location not available.");
        return;
      }
      const distance = getDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        siteLocation.latitude,
        siteLocation.longitude
      );
      if (distance > allowedDistance) {
        toast.error("Unable to mark attendance. Emp out of range");
        return;
      }
    }

    const postAttendance = new FormData();
    postAttendance.append("is_check_in", checkIn);
    postAttendance.append("employee", hrmsEmployeeId);

    const imageBlob = dataURItoBlob(employeeImage);
    if (!imageBlob) return; // Prevent submission if image conversion fails

    postAttendance.append("user_image", imageBlob);

    if (
      currentLocation &&
      currentLocation.latitude &&
      currentLocation.longitude
    ) {
      postAttendance.append("latitude", currentLocation.latitude);
      postAttendance.append("longitude", currentLocation.longitude);
    }

    try {
      const response = await markEmployeeAttendance(postAttendance);
      toast.success("Attendance marked successfully!");
      console.log("SetAttendance Record:", response);
      setShowCamera(false);
      fetchAttendance();
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error("Failed to mark attendance. Please try again.");
    }
  };
  const fetchAssociatedSite = async () => {
    try {
      const res = await getAssociatedSiteOnly(siteId);
      console.log("Associated Site:", res);
      console.log("Site latitude:", res.latitude);
      console.log("Site longitude:", res.longitude);
      // Ensure you access the correct properties from res
      setSiteLocation({ latitude: res.latitude, longitude: res.longitude });
      setqrCodeStatus(res.qr_code_status);
      setqrCodeUrl(res.qr_code);
    } catch (error) {
      console.log("Error fetching the associated site:", error);
    }
  };

  useEffect(() => {
    fetchEmployeeDetails();
    fetchAssociatedSite();
  }, []);

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
              ? new Date(record.attendance_time).toLocaleTimeString()
              : "Invalid Time",
            checkIn: record.is_check_in ? "Check-In" : "Check-Out",
            latitude: record.latitude || "N/A",
            longitude: record.longitude || "N/A",
          })),
        });
      });
    });
    console.log("consolidatedRow data:", consolidatedRows);
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
  const [addRegReq, setAddRegReq] = useState(false);

  return (
    <section className="flex">
      <Navbar />
      <div className="p-2 w-full my-2 flex md:mx-2 overflow-hidden flex-col">
        <EmployeePortal />
        <div className="my-2 z-20 flex lg:flex-row flex-col justify-start gap-2 md:justify-end items-start md:items-end">
          {/* <div className="flex md:flex-row flex-col gap-4 mt-2">
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
          </div> */}
          <div className="flex gap-2 items-center md:flex-row flex-col">
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
            <button
              className=" rounded-md p-2 px-4 font-semibold border border-gray-400 flex items-center gap-2"
              onClick={() => setAddRegReq(true)}
            >
              <PiPlusCircleBold /> Regularization
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
        <AddRegularizationReq
          onclose={() => setAddRegularization(false)}
          regDate={regDate}
        />
      )}
      {addRegReq && <AddRegRequest setAddRegReq={setAddRegReq} />}
    </section>
  );
};

export default MyWorkSpace;

// old version
// const handleMarkAttendance = async () => {
//   const postAttendance = new FormData();
//   postAttendance.append("is_check_in", checkIn);
//   postAttendance.append("employee", hrmsEmployeeId);
//   const dataURItoBlob = (dataURI) => {
//     const byteString = atob(dataURI.split(",")[1]);
//     const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
//     const ab = new ArrayBuffer(byteString.length);
//     const ia = new Uint8Array(ab);
//     for (let i = 0; i < byteString.length; i++) {
//       ia[i] = byteString.charCodeAt(i);
//     }
//     return new Blob([ab], { type: mimeString });
//   };
//   const imageBlob = dataURItoBlob(employeeImage);
//   postAttendance.append("user_image", imageBlob);
//   try {
//     const response = await markEmployeeAttendance(postAttendance);
//     // alert("Attendance marked successfully!");
//     toast.success("Attendance marked successfully!");
//     setShowCamera(false);
//     fetchAttendance();
//   } catch (error) {
//     console.error("Error marking attendance:", error);
//     toast.error(
//       "Failed to mark attendance. Please ensure good lighting and scan the face."
//     );
//   }
// };
  // const captureImage = (checkInStatus) => {
  //   // geolocation
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       const { latitude, longitude } = position.coords;
  //       console.log("Latitude is :", latitude, longitude);
  //       const imageSrc = webcamRef.current.getScreenshot();
  //       setEmployeeImage(imageSrc);
  //       setCheckIn(checkInStatus);
  //       setEmployeeLocation({ latitude, longitude });
  //       handleMarkAttendance();
  //     },
  //     (error) => {
  //       console.log("Error getting location:", error);
  //       const imageSrc = webcamRef.current.getScreenshot();
  //       setEmployeeImage(imageSrc);
  //       setCheckIn(checkInStatus);
  //       handleMarkAttendance();
  //     }
  //   );
  // };

    // const fetchEmployeeDetails = async () => {
  //   try {
  //     const res = await getEmployeeDetails(empId);
  //     console.log("Employee Details:", res);
  //     console.log("Employee geotag_enabled:", res.geotag_enabled);

  //     setgeoTag(res.geotag_enabled);
  //   } catch (error) {
  //     console.log("Error fetching employee details:", error);
  //   }
  // };

  // const fetchAssociatedSite = async () => {
  //   try {
  //     const res = await getAssociatedSiteOnly(siteId);
  //     console.log("res:",res);
  //     console.log("Associated qr code res:",res.qr_code_status);
  //     console.log(" Associated latitude:", res.latitude);
  //     console.log("Associated  longitude:", res.longitude);
  //     setSiteLocation({latitude, longitude})
  //     setqrCodeStatus(res.qr_code_status)
  //     setqrCodeUrl(res.qr_code)
  //   } catch (error) {
  //     console.log("error fetching the associated site:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchEmployeeDetails();
  //   fetchAssociatedSite();
  // }, []);

  // const handleMarkAttendance = async (locationData) => {
  //   const postAttendance = new FormData();
  //   postAttendance.append("is_check_in", checkIn);
  //   postAttendance.append("employee", hrmsEmployeeId);

  //   // Append image
  //   const dataURItoBlob = (dataURI) => {
  //     const byteString = atob(dataURI.split(",")[1]);
  //     const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  //     const ab = new ArrayBuffer(byteString.length);
  //     const ia = new Uint8Array(ab);
  //     for (let i = 0; i < byteString.length; i++) {
  //       ia[i] = byteString.charCodeAt(i);
  //     }
  //     return new Blob([ab], { type: mimeString });
  //   };
  //   const imageBlob = dataURItoBlob(employeeImage);
  //   postAttendance.append("user_image", imageBlob);

  //   // Append location if available
  //   if (employeeLocation.latitude && employeeLocation.longitude) {
  //     postAttendance.append("latitude", employeeLocation.latitude);
  //     postAttendance.append("longitude", employeeLocation.longitude);
  //   }

  //   try {
  //     const response = await markEmployeeAttendance(postAttendance);
  //     toast.success("Attendance marked successfully!");
  //     console.log("SetAttendance Record:", response);
  //     setShowCamera(false);
  //     fetchAttendance();
  //   } catch (error) {
  //     console.error("Error marking attendance:", error);
  //     toast.error("Failed to mark attendance. Please try again.");
  //   }
  // };
  // Updated captureImage: Pass the location directly to handleMarkAttendance
  // const captureImage = (checkInStatus) => {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       const { latitude, longitude } = position.coords;
  //       console.log("Latitude is :", latitude, longitude);
  //       const imageSrc = webcamRef.current.getScreenshot();
  //       setEmployeeImage(imageSrc);
  //       setCheckIn(checkInStatus);
  //       const currentLocation = { latitude, longitude };
  //       setEmployeeLocation(currentLocation); // Update state if needed elsewhere
  //       handleMarkAttendance(currentLocation);
  //     },
  //     (error) => {
  //       console.log("Error getting location:", error);
  //       const imageSrc = webcamRef.current.getScreenshot();
  //       setEmployeeImage(imageSrc);
  //       setCheckIn(checkInStatus);
  //       // In error case, attempt marking attendance without location
  //       handleMarkAttendance();
  //     }
  //   );
  // };
  
  // const handleMarkAttendance = async (currentLocationParam) => {
  //   // Use the passed location if available, otherwise use state (which might be stale)
  //   const currentLocation = currentLocationParam || employeeLocation;

  //   // If geotag is enabled, validate location before proceeding
  //   if (goeTag) {
  //     if (
  //       !currentLocation ||
  //       !currentLocation.latitude ||
  //       !currentLocation.longitude
  //     ) {
  //       toast.error("Employee location not available.");
  //       return;
  //     }
  //     if (!siteLocation || !siteLocation.latitude || !siteLocation.longitude) {
  //       toast.error("Site location not available.");
  //       return;
  //     }
  //     const distance = getDistance(
  //       currentLocation.latitude,
  //       currentLocation.longitude,
  //       siteLocation.latitude,
  //       siteLocation.longitude
  //     );
  //     if (distance > allowedDistance) {
  //       toast.error("Unable to mark attendance. Emp out of range");
  //       return;
  //     }
  //   }

  //   // Proceed to mark attendance
  //   const postAttendance = new FormData();
  //   postAttendance.append("is_check_in", checkIn);
  //   postAttendance.append("employee", hrmsEmployeeId);

  //   const imageBlob = dataURItoBlob(employeeImage);
  //   postAttendance.append("user_image", imageBlob);

  //   if (
  //     currentLocation &&
  //     currentLocation.latitude &&
  //     currentLocation.longitude
  //   ) {
  //     postAttendance.append("latitude", currentLocation.latitude);
  //     postAttendance.append("longitude", currentLocation.longitude);
  //   }

  //   try {
  //     const response = await markEmployeeAttendance(postAttendance);
  //     toast.success("Attendance marked successfully!");
  //     console.log("SetAttendance Record:", response);
  //     setShowCamera(false);
  //     fetchAttendance();
  //   } catch (error) {
  //     console.error("Error marking attendance:", error);
  //     toast.error("Failed to mark attendance. Please try again.");
  //   }
  // };

  // Fetch associated site - ensure you set the site location properly
