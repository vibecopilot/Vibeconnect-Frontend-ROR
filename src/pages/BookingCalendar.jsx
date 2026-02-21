// import React, { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import { Link, useLocation } from "react-router-dom";
// import { FaCalendarAlt } from "react-icons/fa";

// import { Calendar, dateFnsLocalizer } from "react-big-calendar";
// import format from "date-fns/format";
// import parse from "date-fns/parse";
// import startOfWeek from "date-fns/startOfWeek";
// import getDay from "date-fns/getDay";
// import enUS from "date-fns/locale/en-US";
// import "react-big-calendar/lib/css/react-big-calendar.css";

// import { getCalendarBookings } from "../api";

// const locales = { "en-US": enUS };


// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// });

// const BookingCalendar = () => {
//   const location = useLocation();
//   const [events, setEvents] = useState([]);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [allBookings, setAllBookings] = useState([]); // store original data
  

// useEffect(() => {
//   const fetchBookings = async () => {
//     try {
//       const response = await getCalendarBookings();

//       const bookings = Array.isArray(response?.data?.amenity_bookings)
//         ? response.data.amenity_bookings
//         : Array.isArray(response?.data)
//         ? response.data
//         : [];

//       setAllBookings(bookings);
//       formatEvents(bookings);

//     } catch (error) {
//       console.error("Error fetching calendar bookings:", error);
//     }
//   };



//   fetchBookings();
// }, []);

//   useEffect(() => {
//      if (!fromDate && !toDate) {
//        formatEvents(allBookings);
//        return;
//     }

//     const filtered = allBookings.filter((b) => {
//       if (!b.booking_date) return false;

//     const bookingDate = new Date(b.booking_date);

//     if (fromDate && bookingDate < new Date(fromDate)) return false;
//     if (toDate && bookingDate > new Date(toDate)) return false;

//     return true;
//   });

//   formatEvents(filtered);
// }, [fromDate, toDate]);

// const formatEvents = (bookings) => {
//   const formatted = bookings
//     .filter((b) => b.booking_date)
//     .map((b) => {
//       const startDate = new Date(b.booking_date);
//       const endDate = new Date(b.booking_date);
//       endDate.setDate(endDate.getDate() + 1);

//       return {
//         title: b.book_by_user || b.user_name || "Booking",
//         start: startDate,
//         end: endDate,
//         allDay: true,
//       };
//     });

//   setEvents(formatted);
// };



//   return (
//     <section className="flex">
//       <Navbar />

//       <div className="w-full flex m-3 flex-col overflow-hidden">

//         {/* ✅ TABS HEADER */}
//         <div className="flex justify-center mb-4">
//           <div className="flex items-center gap-4 bg-gray-200 px-6 py-2 rounded-full shadow-sm">

//             {/* Workspace Tab */}
//             <Link
//               to="/bookings"
//               className={`px-4 py-1 rounded-full transition ${
//                 location.pathname === "/bookings"
//                   ? "bg-white text-blue-600 shadow-sm"
//                   : "text-gray-600"
//               }`}
//             >
//               Workspace Bookings
//             </Link>

//             {/* Calendar Icon */}
//             <Link
//               to="/bookings/calendar"
//               className={`p-2 rounded-md transition ${
//                 location.pathname === "/bookings/calendar"
//                   ? "bg-white shadow-sm"
//                   : ""
//               }`}
//             >
//               <FaCalendarAlt size={16} />
//             </Link>

//           </div>
//         </div>

//         {/* PAGE TITLE */}
//         <h2 className="text-xl font-semibold mb-4">
//           Workspace Calendar
//         </h2>

//         <div className="flex gap-4 mb-4">
//   <div>
//     <label className="text-sm font-medium">From Date</label>
//     <input
//       type="date"
//       value={fromDate}
//       onChange={(e) => setFromDate(e.target.value)}
//       className="border p-2 rounded-md ml-2"
//     />
//   </div>

//   <div>
//     <label className="text-sm font-medium">To Date</label>
//     <input
//       type="date"
//       value={toDate}
//       onChange={(e) => setToDate(e.target.value)}
//       className="border p-2 rounded-md ml-2"
//     />
//   </div>

//   <button
//     onClick={() => {
//       setFromDate("");
//       setToDate("");
//     }}
//     className="bg-gray-500 text-white px-4 py-2 rounded-md"
//   >
//     Reset
//   </button>
// </div>

//         {/* CALENDAR */}
//         <div style={{ height: 600 }}>
//           <Calendar
//             localizer={localizer}
//             events={events}
//             startAccessor="start"
//             endAccessor="end"
//           />
//         </div>

//       </div>
//     </section>
//   );
// };

// export default BookingCalendar;