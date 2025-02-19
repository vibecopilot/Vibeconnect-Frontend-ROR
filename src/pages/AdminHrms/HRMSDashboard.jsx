import React, { useEffect, useState, useRef } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import "tailwindcss/tailwind.css";
import { ImFileText2 } from "react-icons/im";
import { AiOutlineBell } from "react-icons/ai";
import AdminHRMS from "./AdminHrms";
import { FaPlus } from "react-icons/fa";
import {
  MdSettings,
  MdAnnouncement,
  MdPostAdd,
  MdNotificationsActive,
} from "react-icons/md";
import { Link } from "react-router-dom";
import { BiUser } from "react-icons/bi";
import { IoReload } from "react-icons/io5";
import HighchartsReact from "highcharts-react-official";
import EmployeeCount from "./HRMSHighChart/EmployeeCount";
import DepartmentCount from "./HRMSHighChart/DepartmentCount";
import {
  getMyOrganization,
  getNotification,
  updateNotificationStatus,
  // getNotification,
  // updateNotificationStatus,
} from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast"; // If using react-hot-toast

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

const HRMSDashboard = () => {
  const empId = getItemInLocalStorage("HRMS_EMPLOYEE_ID");
  const [expanded, setExpanded] = useState(false);
  const [expanded1, setExpanded1] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [notificationData, setNotificationData] = useState([]);
  const drawerRef = useRef(null);
  // const [notifications, setNotifications] = useState([]);
  // const [newUsers, setNewUsers] = useState([]);
  // const [seen, setSeen] = useState(false);
  const navigate = useNavigate();
  document.title = `HRMS Vibe Connect`;
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  const toggleExpand1 = () => {
    setExpanded1(!expanded1);
  };

  const departmentDistributionData = {
    labels: ["Unassigned", "Trainer"],
    datasets: [
      {
        data: [1, 2],
        backgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };
  const options = {
    maintainAspectRatio: false,
    legend: {
      position: "bottom",
    },
  };

  const employeeHeadCountData = {
    labels: ["Jan 24", "Feb 24", "Mar 24", "Apr 24", "May 24", "Jun 24"],
    datasets: [
      {
        label: "Active",
        backgroundColor: "#36A2EB",
        data: [10, 12, 14, 16, 18, 20],
      },
      {
        label: "On-Hold",
        backgroundColor: "#FFCE56",
        data: [1, 1, 1, 1, 1, 1],
      },
      {
        label: "In-Active",
        backgroundColor: "#FF6384",
        data: [1, 1, 1, 1, 1, 1],
      },
    ],
  };

  const ctcPayoutData = {
    labels: ["Dec 23", "Jan 24", "Feb 24", "Mar 24", "Apr 24", "May 24"],
    datasets: [
      {
        label: "CTC",
        borderColor: "#36A2EB",
        data: [2, 2.5, 3, 3.5, 4, 4.5],
        fill: false,
      },
      {
        label: "Net Salary",
        borderColor: "#FFCE56",
        data: [1.5, 1.7, 1.9, 2.1, 2.3, 2.5],
        fill: false,
      },
    ],
  };
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  console.log(hrmsOrgId);

  const [orgName, setOrgName] = useState("");
  const fetchMyOrganization = async () => {
    try {
      const res = await getMyOrganization(hrmsOrgId);
      setOrgName(res.name);
    } catch (error) {
      console.log(error);
    }
  };

  // Close the drawer if user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    const clientDashboardVisible =
      localStorage.getItem("CLIENT_DASHBOARD_VISIBLE") === "true";
    console.log("Client dashboard value:", clientDashboardVisible);

    if (clientDashboardVisible) {
      console.log("Skipping notifications for client dashboard user");
      return;
    }
    // Function to fetch notifications from your API
    const fetchNotifications = async () => {
      try {
        if (!empId) return;
        const data = await getNotification(empId);
        // const data = await getNotification();
        console.log("API Response:", data);
        setNotificationData(data);

        // Optionally, show a toast for each unread notification
        // data.forEach((notification) => {
        //   if (!notification.is_read) {
        //     toast.custom(
        //       <div className="bg-white shadow-lg border border-gray-100 rounded-lg p-2">
        //         <p className="text-base font-semibold text-gray-900">
        //           {notification.title}
        //         </p>
        //         <div className="flex items-center justify-between gap-x-4">
        //           <p className="text-xs font-medium w-[200px] text-gray-500">
        //             {notification.message || notification.description}
        //           </p>
        //           <button
        //             onClick={() => handleView(notification.id)}
        //             className="bg-blue-500 text-white px-2 py-1 rounded-lg text-xs font-medium"
        //           >
        //             View
        //           </button>
        //         </div>
        //       </div>,
        //       { duration: 5000, position: "top-right" }
        //     );
        //   }
        // });
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    // Fetch on mount and set an interval to refresh notifications every 60 seconds
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
    // }, [empId]);
  }, []);

  const handleView = async (notificationId) => {
    try {
      const res = await updateNotificationStatus(notificationId);
      console.log("Notification updated:", res.data);
      // Navigate to the pending page after successful update
      navigate("/admin/add-employee/onboarding");
    } catch (error) {
      console.error("Error updating notification status:", error);
      toast.error("Error updating notification status: " + error.message);
      // Refresh notifications count if update fails
    }
  };

  // Toggle the drawer open/closed
  const toggleDrawer = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <section className="flex ">
        <AdminHRMS />
        {/* <div className="flex-1 flex flex-col"> */}
        <div className="p-2 w-full flex  overflow-hidden flex-col">
          <div className="bg-white flex justify-items-end  p-4 shadow-md absolute overflow-y-auto top-0 left-0 right-0">
            <h1 className="text-2xl font-bold pl-20 top-0 left-0 right-0">
              Welcome To <span>{orgName}</span>
            </h1>
            <div
              className="bg-white mt-1 text-black text-center font-semibold absolute right-32 "
              style={{ width: "10px", height: "10px", borderRadius: "5%" }}
            >
              <div className="relative z-20">
                {/* Notification Icon (always visible) */}
                <button
                  onClick={toggleDrawer}
                  className="relative focus:outline-none"
                >
                  {notificationData.length === 0 ? (
                    <div className="flex">
                      <p className="mx-1">Notification</p>
                      <span>
                        {React.createElement(MdNotificationsActive, {
                          size: "25",
                        })}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span
                        className="absolute top-0
                         bg-blue-400 inline-flex items-center justify-center px-2 py-2 mx-4 text-xs font-bold leading-none text-grey-600 rounded-full"
                      >
                        {notificationData.filter((n) => !n.is_read).length}
                      </span>
                      <span className="">
                        {React.createElement(MdNotificationsActive, {
                          size: "25",
                        })}
                      </span>
                    </div>
                  )}
                </button>

                {/* Drawer notification panel */}
                <div
                  ref={drawerRef}
                  className={`fixed top-20 right-0 h-50vh bg-white shadow-lg transform mx-15 ${
                    isOpen ? "translate-x-1" : "translate-x-full"
                  } transition-transform duration-300 ease-in-out`}
                  style={{ width: "400px" }}
                >
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <p className="text-m text-black-600">
                        {notificationData.filter((n) => !n.is_read).length} new
                        notifications
                      </p>

                      <button
                        onClick={toggleDrawer}
                        className="text-grey-200 mx-5 focus:outline-none"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                  {/* Scrollable notifications container */}
                  <div
                    className="overflow-y-auto"
                    style={{ maxHeight: "calc(50vh - 120px)" }}
                  >
                    {notificationData.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-4 border-b border-gray-200"
                      >
                        <div className="mb-1 flex justify-between">
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-xs text-gray-500">
                            {notification.date || "Just now"}
                          </p>
                        </div>
                        <p className="text-xs flex text-gray-600">
                          {notification.description || notification.message}
                        </p>
                        <div className="mt-2">
                          <button
                            onClick={() => handleView(notification.id)}
                            className="bg-blue-500 flex text-white px-3 py-1 text-xs rounded"
                          >
                            {notification.actions && notification.actions.length
                              ? notification.actions[0]
                              : "View"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    {/* <button className="w-full text-sm text-blue-500"
                    // onClick={navigate("/admin/add-employee/onboarding")}
                    >
                      view all
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
            &nbsp;
          </div>

          <div className="mt-16 overflow-y-auto absolute top-1 left-20">
            <Link
              to={"/dashboard"}
              className="text-blue-400 mx-10 my-2 underline font-medium"
            >
              Home{">"}
            </Link>
            <div className="grid md:grid-cols-3 mr-2 my-2  gap-2">
              <div className="shadow-custom-all-sides rounded-lg ml-5">
                <DepartmentCount />
              </div>
              <div className="shadow-custom-all-sides rounded-lg ">
                <EmployeeCount />
              </div>

              <div>
                {/* <div className="shadow-custom-all-sides rounded-lg ">
                <Notification />
                </div> */}
                {/* <div
              className="bg-white p-6 rounded-lg shadow-custom-all-sides m-4 z-10"
              style={{ width: "380px", height: "350px" }}
              >
              <h3 className=" font-semibold mb-4">Employee Head Count</h3>
              <Bar
              data={employeeHeadCountData}
              options={{ maintainAspectRatio: false }}
              />
              </div>*/}
                {/* <div
              className="bg-white p-6 rounded-lg shadow-custom-all-sides m-4 z-10"
              style={{ width: "380px", height: "350px" }}
              >
              <h3 className=" font-semibold mb-4">
              CTC Payout (Last 6 months)
              </h3>
              <Line
              data={ctcPayoutData}
              options={{ maintainAspectRatio: false }}
              />
              </div>  */}
              </div>
            </div>
            <div className="w-full flex flex-col overflow-hidden mt-3">
              <div className="flex justify-start gap-2 my-5 flex-wrap ml-5">
                <div className=" rounded-xl border-4 border-gray-400 h-24 w-60 bg-opacity-50 bg-gray-300 px-6 flex flex-col justify-center items-center">
                  <p className="font-semibold md:text-lg">Pending Requests</p>
                  <p className="text-center font-semibold md:text-lg">2</p>
                </div>
                <div className=" rounded-xl border-4 border-green-400  h-24 w-60 bg-opacity-50 bg-green-300  px-6 flex flex-col justify-center items-center">
                  <p className="font-semibold md:text-lg">Process Alerts</p>
                  <p className="text-center font-semibold md:text-lg">1</p>
                </div>
                <div className=" rounded-xl border-4 border-red-400 h-24 w-60 bg-opacity-50 bg-red-300 px-6 flex flex-col justify-center items-center">
                  <p className="font-semibold md:text-lg">Today's Events</p>
                  <p className="text-center font-semibold md:text-lg">0</p>
                </div>
                <div className="rounded-xl border-4 border-orange-400 h-24 w-60 bg-opacity-50 bg-orange-300 px-6 flex flex-col justify-center items-center">
                  <p className="font-semibold md:text-lg">Setup Issues</p>
                  <p className="text-center font-semibold md:text-lg">1</p>
                </div>
                <div className=" flex justify-end w-full ">
                  <p className="font-semibold m-5 bg-gray-100 p-2 rounded-full text-right">
                    Today's Birthdays / Work Anniversaries (0)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default HRMSDashboard;

// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   BarElement,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Legend,
//   Tooltip,
// } from "chart.js";
// import { Doughnut, Bar, Line } from "react-chartjs-2";
// import "tailwindcss/tailwind.css";
// import { ImFileText2 } from "react-icons/im";
// import { AiOutlineBell } from "react-icons/ai";
// import AdminHRMS from "./AdminHrms";
// import { FaPlus } from "react-icons/fa";
// import { MdSettings, MdAnnouncement, MdPostAdd } from "react-icons/md";
// import { Link } from "react-router-dom";
// import { BiUser } from "react-icons/bi";
// import { IoReload } from "react-icons/io5";
// import HighchartsReact from "highcharts-react-official";
// import EmployeeCount from "./HRMSHighChart/EmployeeCount";
// import DepartmentCount from "./HRMSHighChart/DepartmentCount";
// import {
//   getMyOrganization,
//   getNotification,
//   updateNotificationStatus,
// } from "../../api";
// import { getItemInLocalStorage } from "../../utils/localStorage";
// import toast from "react-hot-toast";

// ChartJS.register(
//   ArcElement,
//   BarElement,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Legend,
//   Tooltip
// );

// const HRMSDashboard = () => {
//   const { id } = useParams();
//   const [expanded, setExpanded] = useState(false);
//   const [expanded1, setExpanded1] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [newUsers, setNewUsers] = useState([]);
//   const [seen, setSeen] = useState(false);
//   const navigate = useNavigate();
//   document.title = `HRMS Vibe Connect`;

//   const departmentDistributionData = {
//     labels: ["Unassigned", "Trainer"],
//     datasets: [
//       {
//         data: [1, 2],
//         backgroundColor: ["#FF6384", "#36A2EB"],
//       },
//     ],
//   };

//   const options = {
//     maintainAspectRatio: false,
//     legend: {
//       position: "bottom",
//     },
//   };

//   const employeeHeadCountData = {
//     labels: ["Jan 24", "Feb 24", "Mar 24", "Apr 24", "May 24", "Jun 24"],
//     datasets: [
//       {
//         label: "Active",
//         backgroundColor: "#36A2EB",
//         data: [10, 12, 14, 16, 18, 20],
//       },
//       {
//         label: "On-Hold",
//         backgroundColor: "#FFCE56",
//         data: [1, 1, 1, 1, 1, 1],
//       },
//       {
//         label: "In-Active",
//         backgroundColor: "#FF6384",
//         data: [1, 1, 1, 1, 1, 1],
//       },
//     ],
//   };

//   const ctcPayoutData = {
//     labels: ["Dec 23", "Jan 24", "Feb 24", "Mar 24", "Apr 24", "May 24"],
//     datasets: [
//       {
//         label: "CTC",
//         borderColor: "#36A2EB",
//         data: [2, 2.5, 3, 3.5, 4, 4.5],
//         fill: false,
//       },
//       {
//         label: "Net Salary",
//         borderColor: "#FFCE56",
//         data: [1.5, 1.7, 1.9, 2.1, 2.3, 2.5],
//         fill: false,
//       },
//     ],
//   };

//   const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
//   const [orgName, setOrgName] = useState("");

//   const fetchMyOrganization = async () => {
//     try {
//       const res = await getMyOrganization(hrmsOrgId);
//       setOrgName(res.name);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const [notificationData, setNotificationData] = useState([]);
//   const empId = getItemInLocalStorage("APPROVERID");

//   const handleClick = (notificationId) => {
//     updateNotificationStatus(notificationId);
//     navigate("/admin/add-employee/onboarding");
//   };

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const data = await getNotification(empId);
//         setNotificationData(data);
//         if (data.length > 0) {
//           const unreadNotifications = data.filter((n) => !n.is_read);
//           unreadNotifications.forEach((notification) => {
//             toast.custom(
//               <div className="bg-white shadow-lg border border-gray-100 rounded-lg p-2">
//                 <p className="text-base font-semibold text-gray-900">
//                   {notification.title}
//                 </p>
//                 <div className="flex items-center justify-between gap-x-4">
//                   <p className="text-xs font-medium w-[200px] text-gray-500">
//                     {notification.message}
//                   </p>
//                   <button
//                     onClick={() => handleClick(notification.id)}
//                     className="bg-blue-500 text-white px-2 py-1 rounded-lg text-xs font-medium"
//                   >
//                     View
//                   </button>
//                 </div>
//               </div>,
//               { duration: 5000, position: "top-right" }
//             );
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching notifications:", error);
//       }
//     };

//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 60000);

//     return () => clearInterval(interval);
//   }, [empId]);

//   return (
//     <section className="flex">
//       <AdminHRMS />
//       <div className="p-2 w-full flex overflow-hidden flex-col">
//         <div className="bg-white flex justify-items-end p-4 shadow-md absolute overflow-y-auto top-0 left-0 right-0">
//           <h1 className="text-2xl font-bold pl-20 top-0 left-0 right-0">
//             Welcome To <span>{orgName}</span>
//           </h1>
//         </div>

//         <div className="mt-16 overflow-y-auto absolute top-1 left-20">
//           <Link
//             to={"/dashboard"}
//             className="text-blue-400 mx-10 my-2 underline font-medium"
//           >
//             Home{">"}
//           </Link>
//           <div className="grid md:grid-cols-3 mr-2 my-2 gap-2">
//             <div className="shadow-custom-all-sides rounded-lg ml-5">
//               <DepartmentCount />
//             </div>
//             <div className="shadow-custom-all-sides rounded-lg">
//               <EmployeeCount />
//             </div>
//           </div>
//           <div className="w-full flex flex-col overflow-hidden mt-3">
//             <div className="flex justify-start gap-2 my-5 flex-wrap ml-5">
//               <div className="rounded-xl border-4 border-gray-400 h-24 w-60 bg-opacity-50 bg-gray-300 px-6 flex flex-col justify-center items-center">
//                 <p className="font-semibold md:text-lg">Pending Requests</p>
//                 <p className="text-center font-semibold md:text-lg">2</p>
//               </div>
//               <div className="rounded-xl border-4 border-green-400 h-24 w-60 bg-opacity-50 bg-green-300 px-6 flex flex-col justify-center items-center">
//                 <p className="font-semibold md:text-lg">Process Alerts</p>
//                 <p className="text-center font-semibold md:text-lg">1</p>
//               </div>
//               <div className="rounded-xl border-4 border-red-400 h-24 w-60 bg-opacity-50 bg-red-300 px-6 flex flex-col justify-center items-center">
//                 <p className="font-semibold md:text-lg">Today's Events</p>
//                 <p className="text-center font-semibold md:text-lg">0</p>
//               </div>
//               <div className="rounded-xl border-4 border-orange-400 h-24 w-60 bg-opacity-50 bg-orange-300 px-6 flex flex-col justify-center items-center">
//                 <p className="font-semibold md:text-lg">Setup Issues</p>
//                 <p className="text-center font-semibold md:text-lg">1</p>
//               </div>
//               <div className="flex justify-end w-full">
//                 <p className="font-semibold m-5 bg-gray-100 p-2 rounded-full text-right">
//                   Today's Birthdays / Work Anniversaries (0)
//                 </p>
//               </div>
//               <div className="flex flex-col">
//                 <div className="font-medium my-10 ml-5">
//                   <h1 className="text-xl flex items-center gap-2">
//                     Announcement <IoReload />{" "}
//                   </h1>

//                   <div className="flex flex-col ">
//                     <div className="font-medium my-10 ml-5">
//                       <h1 className="text-xl flex items-center gap-2">
//                         Announcement <IoReload />{" "}
//                       </h1>
//                     </div>
//                     {/* <div className="font-medium text-2xl mb-10 mt-10 ml-5">
//                   <h1 className="text-xl flex items-center gap-2">
//                     Employee Feeds <IoReload />
//                   </h1>
//                 </div> */}
//                   </div>
//                 </div>
//               </div>

//               {expanded && (
//                 <div className="absolute bottom-2 right-10 mt-10 w-48 bg-white rounded-lg shadow-lg z-30">
//                   <ul className="py-1">
//                     <li className="px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer flex items-center">
//                       <MdSettings size={20} className="mr-2" />
//                       Settings
//                     </li>
//                     <li className="px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer flex items-center">
//                       <MdAnnouncement size={20} className="mr-2" />
//                       Announcement
//                     </li>
//                     <li className="px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer flex items-center">
//                       <MdPostAdd size={20} className="mr-2" />
//                       Post
//                     </li>
//                   </ul>
//                 </div>
//               )}
//               {expanded1 && (
//                 <div className="absolute right-0 top-0 w-48 bg-white rounded-lg shadow-custom-all-sides m-2 z-20">
//                   <ul className="py-1">
//                     <li className="px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer flex items-center">
//                       {/* <MdSettings size={20} className="mr-2" /> */}
//                       Switch to Employee
//                     </li>
//                     <li className="px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer flex items-center">
//                       {/* <MdAnnouncement size={20} className="mr-2" /> */}
//                       Notification setting
//                     </li>
//                     <li className="px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer flex items-center">
//                       {/* <MdPostAdd size={20} className="mr-2" /> */}
//                       Help Center
//                     </li>
//                     <li className="px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer flex items-center">
//                       {/* <MdPostAdd size={20} className="mr-2" /> */}
//                       Submit a ticket
//                     </li>
//                     <li className="px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer flex items-center">
//                       {/* <MdPostAdd size={20} className="mr-2" /> */}
//                       Sign Out
//                     </li>
//                   </ul>
//                 </div>
//               )}

//               {/* <div className="absolute bottom-3 right-4 mb-3">
//             <div
//               className="bg-blue-500 text-white border border-r-2 rounded-full"
//               onClick={toggleExpand}
//               style={{
//                 cursor: "pointer",
//                 padding: "10px",
//                 borderRadius: "50%",
//               }}
//             >
//               <FaPlus size={18} />
//             </div>
//           </div> */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// const [notificationData, setNotificationData] = useState([]);
// const empId = getItemInLocalStorage("APPROVERID");

// const handleClick = (notificationId) => {
//   console.log(notificationData);
//   updateNotificationStatus(notificationId);
//   navigate("/admin/add-employee/onboarding");
// };

// useEffect(() => {
//   const fetchNotifications = async () => {
//     try {
//       const data = await getNotification(empId);
//       console.log("API Response:", data);
//       setNotificationData(data);
//       if (data.length > 0) {
//         const unreadNotifications = data.filter((n) => !n.is_read);
//         setNotificationData(unreadNotifications);
//         unreadNotifications.forEach((notification) => {
//           toast.custom(
//             <div className="bg-white shadow-lg border border-gray-100 rounded-lg p-2">
//               <p className="text-base font-semibold text-gray-900">
//                 {notification.title}
//               </p>
//               <div className="flex items-center justify-between gap-x-4">
//                 <p className="text-xs font-medium w-[200px] text-gray-500">
//                   {notification.message}
//                 </p>
//                 <button
//                   onClick={() => handleClick(notification.id)}
//                   className="bg-blue-500 text-white px-2 py-1 rounded-lg text-xs font-medium"
//                 >
//                   View
//                 </button>
//               </div>
//             </div>,
//             { duration: 5000, position: "top-right" }
//           );
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     }
//   };

//   fetchNotifications();
//   const interval = setInterval(fetchNotifications, 60000);

//   return () => clearInterval(interval);
// }, [empId]);
