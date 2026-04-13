import React, { useEffect, useMemo, useState, useRef } from "react"; // ✅ Added useRef
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import toast from "react-hot-toast";
import ModalWrapper from "../../containers/modals/ModalWrapper";
import { getCalendarActivities } from "../../api";
import "../../pages/style/Calendar.css";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaUserAlt,
  FaDownload,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

/** ✅ small badge */
const Badge = ({ tone = "gray", children }) => {
  const toneMap = {
    green: "bg-emerald-100 text-emerald-800",
    yellow: "bg-amber-100 text-amber-800",
    red: "bg-rose-100 text-rose-800",
    blue: "bg-blue-100 text-blue-800",
    gray: "bg-gray-100 text-gray-800",
  };
  return (
    <span
      className={[
        "px-2 py-0.5 rounded-full text-[11px] font-semibold inline-flex items-center gap-1",
        toneMap[tone] || toneMap.gray,
      ].join(" ")}
    >
      {children}
    </span>
  );
};

const statusTone = (status = "") => {
  const s = String(status).toLowerCase();
  if (s === "complete" || s === "completed") return "green";
  if (s === "overdue") return "red";
  if (s === "pending") return "yellow";
  if (s === "inprogress" || s === "in_progress") return "blue";
  return "gray";
};

const statusIcon = (status = "") => {
  const s = String(status).toLowerCase();
  if (s === "complete" || s === "completed") return <FaCheckCircle />;
  if (s === "overdue") return <FaExclamationTriangle />;
  if (s === "pending") return <FaClock />;
  if (s === "inprogress" || s === "in_progress") return <FaClock />;
  return <FaClock />;
};

const normalizeStatus = (s) => String(s || "unknown").toLowerCase();

/** ✅ Download helper (CSV -> Excel openable) */
const downloadCSV = (rows, filename = "ppm_calendar.csv") => {
  const headers = ["Title", "Start", "End", "Assigned To", "Status"];
  const esc = (v) => {
    const str = String(v ?? "");
    if (str.includes('"') || str.includes(",") || str.includes("\n")) {
      return `"${str.replaceAll('"', '""')}"`;
    }
    return str;
  };

  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        esc(r.title),
        esc(r.start),
        esc(r.end || ""),
        esc(r.assignTo),
        esc(r.status),
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([lines], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

function PPMCalendarDashboard() {
  const [modal, setModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // ✅ UI state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | pending | inprogress | complete | overdue
  const [view, setView] = useState("dayGridMonth"); // dayGridMonth | timeGridWeek | timeGridDay

  // ✅ Prevent duplicate API calls
const [currentStart, setCurrentStart] = useState(null);
const [currentEnd, setCurrentEnd] = useState(null);

  // ✅ Reference to control FullCalendar API
  const calendarRef = useRef(null);
  const lastRangeRef = useRef({ start: null, end: null });

  const initialDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  //   const fetchCalendarEvents = React.useCallback(async (startStr, endStr) => {
  //     if (!startStr || !endStr) return;
  //     const toastId = toast.loading("Loading calendar...");
  //     try {
  //       const data = await getCalendarActivities(startStr, endStr);
  //       const rawList = Array.isArray(data?.data)
  //   ? data.data
  //   : (data?.data?.events ?? []);

  // // ✅ Only allow PPM and AMC
  //        const list = rawList.filter((item) => {
  //        const type = (item?.activity_type || item?.checklist_type || "")
  //        .toString()
  //        .toLowerCase();

  //       return type === "ppm" || type === "amc";
  //      });
  //       const parseDate = (val) => {
  //         if (!val) return null;
  //         const d = new Date(val);
  //         return isNaN(d.getTime()) ? null : d;
  //       };
  //       const formattedEvents = list.map((ev, idx) => {
  //         const startDate = ev.start || "";
  //         const startTime = ev.start_time || "00:00:00";
  //         const start = parseDate(startDate.includes("T") ? startDate : `${startDate}T${startTime}`) || new Date();
  //         let end = parseDate(ev.end);
  //         if (!end && ev.end_time) end = parseDate(`${ev.start || startDate}T${ev.end_time}`);
  //         const formatForCSV = (d) => (d ? d.toISOString() : "");
  //         return {
  //           id: String(ev?.id ?? idx),
  //           title: ev?.title || ev?.checklist_name || "Activity",
  //           start,
  //           end,
  //           extendedProps: {
  //             assignTo: ev?.assigned_to_name ?? ev?.assign_to ?? "—",
  //             status: normalizeStatus(ev?.status ?? ""),
  //             raw: ev,
  //             startStr: formatForCSV(start),
  //             endStr: formatForCSV(end),
  //           },
  //         };
  //       });
  //       setEvents(formattedEvents);
  //       toast.dismiss(toastId);
  //     } catch (error) {
  //       toast.dismiss(toastId);
  //       console.error(error);
  //       toast.error("Failed to load calendar");
  //     }
  //   }, []);

  const fetchCalendarEvents = React.useCallback(async (startStr, endStr) => {
    if (!startStr || !endStr) return;

    const toastId = toast.loading("Loading calendar...");

    try {
      const data = await getCalendarActivities(startStr, endStr);

      const rawList = Array.isArray(data?.data)
        ? data.data
        : data?.data?.events ?? [];

      const parseDate = (val) => {
        if (!val) return null;

        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d;
      };

      const formattedEvents = rawList.map((ev, idx) => {
        const startDate = ev.start || ev.start_date || ev.date || "";
        const startTime = ev.start_time || "00:00:00";

        const start = parseDate(
          startDate.includes("T")
            ? startDate
            : `${startDate}T${startTime || "00:00:00"}`
        );

        let end = parseDate(ev.end || ev.end_date);
        if (!end && ev.end_time) {
          end = parseDate(`${startDate}T${ev.end_time}`);
        }

        return {
          id: String(ev?.id ?? idx),
          title: ev?.title || ev?.checklist_name || ev?.name || "Activity",
          start,
          end,
          extendedProps: {
            assignTo:
              ev?.assigned_to_name ||
              ev?.assign_to ||
              (Array.isArray(ev?.assigned_users)
                ? ev.assigned_users.join(", ")
                : "—"),
            status: normalizeStatus(ev?.status ?? ""),
            raw: ev,
            startStr: start ? start.toISOString() : "",
            endStr: end ? end.toISOString() : "",
          },
        };
      });

      setEvents(formattedEvents);
      toast.dismiss(toastId);
    } catch (error) {
      toast.dismiss(toastId);
      console.error(error);
      toast.error("Failed to load calendar");
    }
  }, []);
  const handleDatesSet = React.useCallback(
    (arg) => {
      if (arg?.view?.currentStart && arg?.view?.currentEnd) {
        const startStr = arg.view.currentStart.toISOString().slice(0, 10);
        const endStr = arg.view.currentEnd.toISOString().slice(0, 10);
        if (startStr === currentStart && endStr === currentEnd) return;
        setCurrentStart(startStr);
        setCurrentEnd(endStr);
        fetchCalendarEvents(startStr, endStr);
      }
    },
    [fetchCalendarEvents, currentStart, currentEnd]
  );

  const handleDateClick = (arg) => {
    const clickedDate = arg.dateStr; // YYYY-MM-DD

    const dayEvents = events.filter((e) => {
      const eventDate = new Date(e.start)
        .toISOString()
        .slice(0, 10);

      return eventDate === clickedDate;
    });

    console.log("Clicked Date:", clickedDate);
    console.log("Events:", dayEvents);

    // show in modal or state
  };

  // ✅ Fix: When 'view' state changes, tell FullCalendar to switch view
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      if (calendarApi) {
        calendarApi.changeView(view);
      }
    }
  }, [view]);

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase();

    return (events || []).filter((e) => {
      const title = String(e?.title || "").toLowerCase();
      const assignTo = String(e?.extendedProps?.assignTo || "").toLowerCase();
      const status = normalizeStatus(e?.extendedProps?.status);

      const matchesSearch = !q || title.includes(q) || assignTo.includes(q);
      const matchesStatus =
        statusFilter === "all" ? true : status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [events, search, statusFilter]);

  const counts = useMemo(() => {
    const c = { all: filteredEvents.length, pending: 0, inprogress: 0, complete: 0, overdue: 0 };
    filteredEvents.forEach((e) => {
      const s = normalizeStatus(e?.extendedProps?.status);
      if (s === "pending") c.pending += 1;
      else if (s === "inprogress" || s === "in_progress") c.inprogress += 1;
      else if (s === "complete" || s === "completed") c.complete += 1;
      else if (s === "overdue") c.overdue += 1;
    });
    return c;
  }, [filteredEvents]);

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setModal(true);
  };

  const oncloseModal = () => {
    setSelectedEvent(null);
    setModal(false);
  };

  /** ✅ event color class */
  const eventClassNames = (arg) => {
    const s = normalizeStatus(arg?.event?.extendedProps?.status);
    if (s === "complete" || s === "completed") return ["green"];
    if (s === "pending") return ["yellow"];
    if (s === "inprogress" || s === "in_progress") return ["blue"];
    if (s === "overdue") return ["red"];
    return ["gray"];
  };

  /** ✅ modern compact event UI */
  const renderEventContent = (eventInfo) => {
    const assignTo = eventInfo?.event?.extendedProps?.assignTo;
    const status = normalizeStatus(eventInfo?.event?.extendedProps?.status);
    const tone = statusTone(status);

    return (
      <div className="px-2 py-1">
        <div className="flex items-center justify-between gap-2">
          <div className="font-semibold text-[12px] leading-4 truncate">
            {eventInfo.event.title}
          </div>
          <span className="text-[10px] opacity-90 shrink-0">
            {eventInfo.timeText}
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-[11px] opacity-90 truncate inline-flex items-center gap-1">
            <FaUserAlt className="text-[10px]" />
            {assignTo}
          </span>

          {/* <Badge tone={tone}>
            {statusIcon(status)}
            <span className="capitalize">{status}</span>
          </Badge> */}
        </div>
      </div>
    );
  };

  const exportRows = useMemo(() => {
    return filteredEvents.map((e) => ({
      title: e.title,
      // Use stored string props for CSV to ensure clean formatting
      start: e.extendedProps?.startStr || e.start,
      end: e.extendedProps?.endStr || e.end,
      assignTo: e.extendedProps?.assignTo,
      status: e.extendedProps?.status,
    }));
  }, [filteredEvents]);

  return (
    <div className="w-full px-3">
      {/* ✅ NEW UI: header + toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_24px_rgba(15,23,42,0.06)] p-4 mb-3">
        <div className="flex flex-col gap-3">
          {/* top row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 grid place-items-center">
                <FaCalendarAlt />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-gray-900 truncate">
                  PPM Calendar
                </h2>
                <p className="text-xs text-gray-500 truncate">
                  Search, filter by status, switch views, and export tasks
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge tone="blue">{counts.all} tasks</Badge>

              <button
                type="button"
                onClick={() => downloadCSV(exportRows, "ppm_calendar.csv")}
                className="h-9 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition flex items-center gap-2 text-gray-800"
                title="Export CSV"
              >
                <FaDownload className="text-sm" />
                <span className="text-sm font-medium">Export</span>
              </button>
            </div>
          </div>

          {/* controls row */}
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            {/* search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title or assignee..."
                  className="w-full pl-9 pr-9 h-10 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-200"
                />
                {search ? (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title="Clear"
                  >
                    <FaTimes />
                  </button>
                ) : null}
              </div>
            </div>

            {/* status pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { k: "all", label: "All", tone: "gray", n: counts.all },
                { k: "pending", label: "Pending", tone: "yellow", n: counts.pending },
                { k: "inprogress", label: "In Progress", tone: "blue", n: counts.inprogress },
                { k: "complete", label: "Completed", tone: "green", n: counts.complete },
                { k: "overdue", label: "Overdue", tone: "red", n: counts.overdue },
              ].map((t) => {
                const active = statusFilter === t.k;
                return (
                  <button
                    key={t.k}
                    type="button"
                    onClick={() => setStatusFilter(t.k)}
                    className={[
                      "h-10 px-3 rounded-xl border text-sm font-medium whitespace-nowrap transition",
                      active
                        ? "border-gray-300 bg-gray-100 text-gray-900"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    <span className="mr-2">{t.label}</span>
                    <Badge tone={t.tone}>{t.n}</Badge>
                  </button>
                );
              })}
            </div>

            {/* view switch */}
            <div className="flex items-center gap-2">
              {[
                { v: "dayGridMonth", label: "Month" },
                { v: "timeGridWeek", label: "Week" },
                { v: "timeGridDay", label: "Day" },
              ].map((x) => {
                const active = view === x.v;
                return (
                  <button
                    key={x.v}
                    type="button"
                    onClick={() => setView(x.v)}
                    className={[
                      "h-10 px-4 rounded-xl text-sm font-medium transition",
                      active
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200",
                    ].join(" ")}
                  >
                    {x.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ NEW UI: calendar inside clean card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_24px_rgba(15,23,42,0.06)] p-3">
        <FullCalendar
          timeZone="local"
          dateClick={handleDateClick}
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={view}
          initialDate={initialDate}
          height="78vh"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          events={filteredEvents}
          datesSet={handleDatesSet}
          eventClick={handleEventClick}
          eventClassNames={eventClassNames}
          eventContent={renderEventContent}
          eventTextColor="white"
          allDayText="All Day"
          nowIndicator
          selectable
          dayMaxEvents={1}
          eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: true }}
          slotLabelFormat={{ hour: "2-digit", minute: "2-digit", hour12: true }}
        />
      </div>

      {/* ✅ Modern modal */}
      {modal && selectedEvent && (
        <ModalWrapper onclose={oncloseModal}>
          <div className="flex flex-col gap-y-4 w-[500px] h-[300px]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-base font-bold text-gray-900 truncate">
                  {selectedEvent.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Task details & schedule
                </p>
              </div>

              <Badge tone={statusTone(selectedEvent.extendedProps?.status)}>
                {statusIcon(selectedEvent.extendedProps?.status)}
                <span className="capitalize">
                  {selectedEvent.extendedProps?.status}
                </span>
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Assigned To</p>
                <p className="text-sm font-semibold text-gray-900 mt-1 break-words whitespace-normal">
                  {selectedEvent.extendedProps?.assignTo}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Start</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {selectedEvent.start
                    ? new Date(selectedEvent.start).toLocaleString()
                    : "-"}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:col-span-2">
                <p className="text-xs text-gray-500">End</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {selectedEvent.end
                    ? new Date(selectedEvent.end).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
}

export default PPMCalendarDashboard;