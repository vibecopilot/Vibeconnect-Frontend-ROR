import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { getCalendarBookings } from "../api";
import { getItemInLocalStorage } from "../utils/localStorage";
import SiteHeader from "../components/SiteHeader";


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
  const navigate = useNavigate();
  // ── reactive site ID — updated by SiteHeader on site switch ──
  const [activeSiteId, setActiveSiteId] = useState(
    () => getItemInLocalStorage("SITEID")
  );

  const [events, setEvents] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // 🔥 Handle event click
  const handleEventClick = (event) => {
    const bookingId = event.id;

    navigate(`/bookings/booking-details/${bookingId}`);
  };

  // Format date for API
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${yyyy}/${mm}/${dd}`;
  };

  // Fetch Bookings
  const fetchBookings = async (from = "", to = "") => {
    try {
      const response = await getCalendarBookings(
        "amenity",
        from ? formatDate(from) : "",
        to ? formatDate(to) : "",
        activeSiteId,  // ✅ use reactive state
      );

      // ✅ Correct API field
      const bookings = response?.data?.bookings || [];

      const formattedEvents = bookings.map((b) => {
        const startDate = new Date(b.start);

        const endDate = new Date(b.end);
        endDate.setDate(endDate.getDate() + 1); // 🔥 fix last day issue

        return {
          id: b.id,
          title: `${b.title} - ${b.booked_by}`,
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

  useEffect(() => {
    fetchBookings();
  }, [activeSiteId]); // ✅ re-fetch when site changes

  return (
    <section className="flex">
      <Navbar />

      <div className="w-full flex m-3 flex-col overflow-hidden">
        <SiteHeader
          onSiteChange={(id) => {
            setActiveSiteId(id); // triggers data useEffect
            setEvents([]);
            setFromDate("");
            setToDate("");
          }}
        />
        {/* Tabs */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-4 bg-gray-200 px-6 py-2 rounded-full shadow-sm">
            <Link
              to="/bookings"
              className={`px-4 py-1 rounded-full ${location.pathname === "/bookings"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600"
                }`}
            >
              Workspace Bookings
            </Link>

            <Link
              to="/bookings/calendar"
              className={`p-2 rounded-md ${location.pathname === "/bookings/calendar"
                ? "bg-white shadow-sm"
                : ""
                }`}
            >
              <FaCalendarAlt size={16} />
            </Link>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Workspace Calendar</h2>

          <button
            onClick={() => setShowFilter(!showFilter)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Filter
          </button>
        </div>

        {/* Date Filters */}
        {showFilter && (
          <div className="flex gap-4 mb-4 bg-gray-100 p-4 rounded">
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border p-2 rounded-md ml-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">End Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border p-2 rounded-md ml-2"
              />
            </div>

            <div className="flex items-end gap-3">
              <button
                onClick={() => {
                  if (!fromDate || !toDate) {
                    alert("Please select both dates");
                    return;
                  }
                  fetchBookings(fromDate, toDate);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Apply
              </button>

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
        )}

        {/* Calendar */}
        <div style={{ height: 600 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            tooltipAccessor="title"
            style={{ height: "100%" }}
            onSelectEvent={handleEventClick}
            eventPropGetter={(event) => {
              const colors = [
                "#2563eb",
                "#16a34a",
                "#dc2626",
                "#9333ea",
                "#ea580c",
              ];

              const color = colors[event.id % colors.length];

              return {
                style: {
                  backgroundColor: color,
                  borderRadius: "6px",
                  color: "white",
                  border: "none",
                  padding: "2px 4px",
                },
              };
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default BookingCalendar;
