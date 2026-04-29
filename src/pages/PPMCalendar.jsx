import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./style/Calendar.css";
import { API_URL, getPPMTask, getVibeBackground } from "../api";
import toast from "react-hot-toast";
import ModalWrapper from "../containers/modals/ModalWrapper";
import Navbar from "../components/Navbar";
import AssetNav from "../components/navbars/AssetNav";
import { getItemInLocalStorage } from "../utils/localStorage";
import { useSelector } from "react-redux";

const PPMCalendar = () => {
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const themeColor = useSelector((state) => state.theme.color);

  /* -------- BACKGROUND -------- */
  const Get_Background = async () => {
    try {
      const user_id = getItemInLocalStorage("VIBEUSERID");
      const data = await getVibeBackground(user_id);
      if (data.success) {
        setSelectedImage(API_URL + data.data.image);
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* -------- FETCH ALL PPM PAGES -------- */
  const fetchPPMTask = async () => {
    setLoading(true);
    const toastId = toast.loading("Loading PPM tasks...");

    try {
      // Fetch first page to get total_pages
      const firstResponse = await getPPMTask(1, 100);
      const firstData = firstResponse?.data;
      const totalPages = firstData?.total_pages || 1;
      let activities = firstData?.activities || [];

      // Fetch remaining pages concurrently
      if (totalPages > 1) {
        const pagePromises = [];
        for (let page = 2; page <= totalPages; page++) {
          pagePromises.push(getPPMTask(page, 100));
        }
        const remainingResponses = await Promise.all(pagePromises);
        remainingResponses.forEach((resp) => {
          const pageActivities = resp?.data?.activities || [];
          activities = activities.concat(pageActivities);
        });
      }

      const formattedEvents = activities.map((task) => {
        // FIX: Use only the DATE portion of start_time to avoid UTC timezone shift.
        // e.g. "2025-06-10T04:30:00.000Z" → "2025-06-10"
        // This ensures the event appears on the correct calendar day regardless of timezone.
        const startDateOnly = task.start_time
          ? task.start_time.split("T")[0]
          : null;

        return {
          title: task.asset_name || task.soft_service_name || "No Asset",
          start: startDateOnly,
          extendedProps: {
            assignTo: task.assigned_to_name || "Unassigned",
            status: task.status || "pending",
            checklist: task.checklist_name || "",
            frequency: task.checklist_frequency || "",
            location: task.location || "",
            startTime: task.start_time || "",
          },
        };
      });

      setEvents(formattedEvents);
      setAllEvents(formattedEvents);

      toast.dismiss(toastId);
      toast.success(`${activities.length} PPM tasks`);
    } catch (error) {
      console.error("PPM Calendar Error:", error);
      toast.dismiss(toastId);
      toast.error("Failed to load PPM tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Get_Background();
    fetchPPMTask();
  }, []);

  /* -------- DATE FILTER -------- */
  const handleFilter = () => {
    if (!startDate || !endDate) {
      toast.error("Please select start and end date");
      return;
    }

    const filtered = allEvents.filter((event) => {
      // event.start is already a plain date string "YYYY-MM-DD"
      return event.start >= startDate && event.start <= endDate;
    });

    setEvents(filtered);

    if (filtered.length === 0) {
      toast.error("No records found for selected date range");
    } else {
      toast.success(` PPM Task Successfully Filtered`);
    }
  };

  const handleReset = () => {
    setEvents(allEvents);
    setStartDate("");
    setEndDate("");
  };

  /* -------- EVENT CLICK -------- */
  const handleEvent = (eventInfo) => {
    setSelectedEvent(eventInfo.event);
    setModal(true);
  };

  const oncloseModal = () => {
    setSelectedEvent(null);
    setModal(false);
  };

  /* -------- STATUS COLOR CLASS -------- */
  const getStatusClass = (status) => {
    if (status === "complete") return "bg-green-500";
    if (status === "pending") return "bg-yellow-500";
    if (status === "overdue") return "bg-red-500";
    return "bg-blue-500";
  };

  return (
    <section
      className="flex"
      style={{
        background: selectedImage
          ? `url(${selectedImage}) no-repeat center/cover`
          : undefined,
      }}
    >
      <Navbar />

      <div className="p-4 w-full flex flex-col">
        <AssetNav />

        <div className="rounded-xl shadow-custom-all-sides p-4 mt-4 bg-white bg-opacity-95">

          {/* -------- DATE FILTER BAR -------- */}
          <div className="flex flex-wrap items-end gap-3 mb-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 p-2 rounded-md text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 p-2 rounded-md text-sm"
              />
            </div>

            <button
              onClick={handleFilter}
              className="text-white px-4 py-2 rounded-md text-sm font-medium"
              style={{ background: themeColor }}
            >
              Filter
            </button>

            <button
              onClick={handleReset}
              className="bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Reset
            </button>

            {/* Status Legend */}
            <div className="flex items-center gap-3 ml-auto flex-wrap">
              {[
                { label: "Complete", color: "bg-green-500" },
                { label: "Pending", color: "bg-yellow-500" },
                { label: "Overdue", color: "bg-red-500" },
                { label: "Other", color: "bg-blue-500" },
              ].map((s) => (
                <span key={s.label} className="flex items-center gap-1 text-xs font-medium">
                  <span className={`w-3 h-3 rounded-full ${s.color}`} />
                  {s.label}
                </span>
              ))}
              <span className="text-xs text-gray-500 font-medium">
                {events.length} event(s)
              </span>
            </div>
          </div>

          {/* -------- CALENDAR -------- */}
          {loading ? (
            <div className="flex justify-center items-center h-96 text-gray-500">
              Loading PPM tasks...
            </div>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              initialView="dayGridMonth"
              events={events}
              eventClick={handleEvent}
              height="85vh"
              eventTextColor="white"
              eventClassNames={(eventInfo) => {
                const status = eventInfo.event.extendedProps.status;
                if (status === "complete") return ["green"];
                if (status === "pending") return ["yellow"];
                if (status === "overdue") return ["red"];
                return ["blue"];
              }}
              eventContent={(eventInfo) => (
                <div className="p-0.5 overflow-hidden">
                  <b className="text-xs">{eventInfo.event.title}</b>
                  <br />
                  <small className="text-xs opacity-90">
                    {eventInfo.event.extendedProps.assignTo}
                  </small>
                </div>
              )}
            />
          )}
        </div>

        {/* -------- EVENT DETAIL MODAL -------- */}
        {modal && selectedEvent && (
          <ModalWrapper onclose={oncloseModal}>
            <div className="flex flex-col gap-y-3 p-4 min-w-[280px]">
              <h3 className="text-lg text-center font-bold border-b pb-2">
                {selectedEvent.title}
              </h3>

              {/* Status badge */}
              <div className="flex justify-center">
                <span
                  className={`text-white text-xs font-semibold px-3 py-1 rounded-full ${getStatusClass(
                    selectedEvent.extendedProps.status
                  )}`}
                >
                  {selectedEvent.extendedProps.status?.toUpperCase()}
                </span>
              </div>

              <p className="text-sm font-semibold text-gray-600">
                Checklist:
                <span className="font-normal ml-2">
                  {selectedEvent.extendedProps.checklist}
                </span>
              </p>

              <p className="text-sm font-semibold text-gray-600">
                Frequency:
                <span className="font-normal ml-2 capitalize">
                  {selectedEvent.extendedProps.frequency}
                </span>
              </p>

              <p className="text-sm font-semibold text-gray-600">
                Assigned To:
                <span className="font-normal ml-2">
                  {selectedEvent.extendedProps.assignTo}
                </span>
              </p>

              <p className="text-sm font-semibold text-gray-600">
                Scheduled Date:
                <span className="font-normal ml-2">
                  {selectedEvent.start
                    ? new Date(selectedEvent.start).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    : "—"}
                </span>
              </p>

              <p className="text-sm font-semibold text-gray-600">
                Location:
                <span className="font-normal ml-2">
                  {selectedEvent.extendedProps.location || "—"}
                </span>
              </p>
            </div>
          </ModalWrapper>
        )}
      </div>
    </section>
  );
};

export default PPMCalendar;