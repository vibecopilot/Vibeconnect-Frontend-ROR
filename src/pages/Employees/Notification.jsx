import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getNotification } from "../../api/index"; // Import API function

const Notification = () => {
  const navigate = useNavigate();
  // Store multiple notifications

  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     try {
  //       const data = await getNotification();
  //       console.log("API Response:", data); // ✅ Check API response
  //       if (data.length > 0) {
  //         setNewUsers(data);
  //         data.forEach((user) => {
  //           toast.info(
  //             <div>
  //               <p>New Signup: {user.name}</p>
  //               <button
  //                 onClick={() => navigate("/admin/hrms/notification")}
  //                 className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
  //               >
  //                 Approve
  //               </button>
  //             </div>,
  //             { autoClose: false }
  //           );
  //         });
  //       } else {
  //         console.log("No new signups found."); // ✅ Debugging
  //       }
  //     } catch (error) {
  //       console.error("Error fetching notifications:", error);
  //     }
  //   };

  //   fetchNotifications();
  //   const interval = setInterval(fetchNotifications, 50000); // Check every 50 seconds

  //   return () => clearInterval(interval);
  // }, [navigate]);

  return <h2>Home Page</h2>;
};
export default Notification;
