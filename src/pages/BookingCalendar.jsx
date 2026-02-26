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
//   const [appliedFilter, setAppliedFilter] = useState(false);
//   const [applyFilter, setApplyFilter] = useState(false);
  

// useEffect(() => {
//   const fetchBookings = async () => {
//     try {
//       const formattedFrom = formatDate(fromDate);
//       const formattedTo = formatDate(toDate);

//       const response = await getCalendarBookings(
//         "guest_room",
//         formattedFrom,
//         formattedTo,
//         47 // if site_id required
//       );

//       const bookings = response?.data?.amenity_bookings || [];

//       formatEvents(bookings);

//     } catch (error) {
//       console.error("Error fetching calendar bookings:", error);
//     }
//   };

//   if (appliedFilter) {
//     fetchBookings();
//   }

// }, [appliedFilter]);

 

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

//  <div className="flex items-end gap-3">

//   {/* Apply Button */}
//   <button
//     onClick={() => {
//       setAppliedFilter((prev) => !prev); // triggers API
//     }}
//     className="bg-blue-600 text-white px-4 py-2 rounded-md"
//   >
//     Apply
//   </button>

//   {/* Reset Button */}
//   <button
//     onClick={() => {
//       setFromDate("");
//       setToDate("");
//       setAppliedFilter((prev) => !prev); // reload full data
//     }}
//     className="bg-gray-500 text-white px-4 py-2 rounded-md"
//   >
//     Reset
//   </button>

// </div>
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






import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useLocation } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { getCalendarBookings } from "../api";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const BookingCalendar = () => {
  const location = useLocation();

  const [events, setEvents] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ✅ Format Date Function (MM/DD/YYYY)
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  // ✅ Fetch Bookings Function
  const fetchBookings = async (from = "", to = "") => {
    try {
      const response = await getCalendarBookings(
        "guest_room",
        from ? formatDate(from) : "",
        to ? formatDate(to) : "",
        47 // site_id
      );

      const bookings = response?.data?.amenity_bookings || [];

      const formattedEvents = bookings
        .filter((b) => b.booking_date)
        .map((b) => {
          const startDate = new Date(b.booking_date);
          const endDate = new Date(b.booking_date);
          endDate.setDate(endDate.getDate() + 1);

          return {
            title: b.book_by_user || b.user_name || "Booking",
            start: startDate,
            end: endDate,
            allDay: true,
          };
        });

      setEvents(formattedEvents);

    } catch (error) {
      console.error("Error fetching calendar bookings:", error);
    }
  };

  // ✅ Load Data on First Render
  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <section className="flex">
      <Navbar />

      <div className="w-full flex m-3 flex-col overflow-hidden">

        {/* Tabs */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-4 bg-gray-200 px-6 py-2 rounded-full shadow-sm">

            <Link
              to="/bookings"
              className={`px-4 py-1 rounded-full transition ${
                location.pathname === "/bookings"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600"
              }`}
            >
              Workspace Bookings
            </Link>

            <Link
              to="/bookings/calendar"
              className={`p-2 rounded-md transition ${
                location.pathname === "/bookings/calendar"
                  ? "bg-white shadow-sm"
                  : ""
              }`}
            >
              <FaCalendarAlt size={16} />
            </Link>

          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">
          Workspace Calendar
        </h2>

        {/* Date Filters */}
        <div className="flex gap-4 mb-4">
          <div>
            <label className="text-sm font-medium">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border p-2 rounded-md ml-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border p-2 rounded-md ml-2"
            />
          </div>

          <div className="flex items-end gap-3">

            {/* Apply */}
            <button
              onClick={() => {
                if (!fromDate || !toDate) {
                  alert("Please select both dates");
                  return;
                }
                fetchBookings(fromDate, toDate);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Apply
            </button>

            {/* Reset */}
            <button
              onClick={() => {
                setFromDate("");
                setToDate("");
                fetchBookings();
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Reset
            </button>

          </div>
        </div>

        {/* Calendar */}
        <div style={{ height: 600 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
          />
        </div>

      </div>
    </section>
  );
};

export default BookingCalendar;