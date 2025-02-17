import React, { useEffect, useState } from "react";
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
import { MdSettings, MdAnnouncement, MdPostAdd ,MdNotificationsActive } from "react-icons/md";
import { Link } from "react-router-dom";
import { BiUser } from "react-icons/bi";
import { IoReload } from "react-icons/io5";
import HighchartsReact from "highcharts-react-official";
import EmployeeCount from "./HRMSHighChart/EmployeeCount";
import DepartmentCount from "./HRMSHighChart/DepartmentCount";
import {
  getMyOrganization,
  // getNotification,
  // updateNotificationStatus,
} from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import Notification from "../SubPages/Notification";
// import { toast, ToastContainer } from "react-toastify";
// import toast from "react-hot-toast";
// import Notification from "../Employees/Notification";
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
  const { id } = useParams();
  console.log("This is id:", id);
  const [expanded, setExpanded] = useState(false);
  const [expanded1, setExpanded1] = useState(false);
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
              style={{ width: "130px", height: "30px", borderRadius: "5%" }}
            >
             
              {/* <NavLink
                to="/admin/hrms/notifications"
                className={({ isActive }) =>
                  `${
                    isActive
                      ? "text-black bg-white flex p-2 gap-3.5 rounded-md group items-center text-sm font-medium"
                      : "group flex items-center text-sm gap-3.5 font-medium p-2"
                  }`
                }
              >
                <h1
                  className={`font-large whitespace-pre duration-300 ${
                    !open && "opacity-0 translate-x-28 overflow-hidden"
                  }`}
                >
                  Notification
                </h1>
                <h2
                  className={`${
                    open && "hidden"
                  } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
                >
                  Notification
                </h2>
                <div>
                  {React.createElement(MdNotificationsActive, { size: "20" })}
                </div>
              </NavLink> */}
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
