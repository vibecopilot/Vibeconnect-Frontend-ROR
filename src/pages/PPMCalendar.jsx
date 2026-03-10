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

const PPMCalendar = () => {

  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);

  const [modal, setModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
  

  const [selectedDate] = useState(new Date());

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


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

  /* -------- FETCH PPM TASK -------- */

  const fetchPPMTask = async () => {

    toast.loading("Loading PPM tasks...");

    try {

      const response = await getPPMTask();

      const activities =
        response.activities || response.data?.activities || [];

      const formattedEvents = activities.map((task) => ({
        title: task.asset_name || "No Asset",
        start: task.start_time,
        extendedProps: {
          assignTo: task.assigned_to_name || "Unassigned",
          status: task.status || "pending",
          checklist: task.checklist_name || "",
          location: task.location || ""
        }
      }));

      setEvents(formattedEvents);
      setAllEvents(formattedEvents);

      toast.dismiss();

    } catch (error) {

      console.error("PPM Calendar Error:", error);
      toast.dismiss();
      toast.error("Failed to load PPM tasks");

    }
  };

  useEffect(() => {
    fetchPPMTask();
  }, []);

  /* -------- FILTER FUNCTION -------- */

  const handleFilter = () => {

    if (!startDate || !endDate) {
      toast.error("Please select start and end date");
      return;
    }

    const filtered = allEvents.filter((event) => {

      // extract only date from API date
      const eventDate = event.start.split("T")[0];

      return eventDate >= startDate && eventDate <= endDate;

    });

    setEvents(filtered);

    if (filtered.length === 0) {
      toast.error("No records found for selected date");
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

  return (
    
    // <>
     <section
    className="flex"
    style={{
      background: `url(${selectedImage}) no-repeat center/cover`,
    }}
  >
    {/* ---------- SIDEBAR NAVBAR ---------- */}

    <Navbar />

    {/* ---------- MAIN CONTENT ---------- */}

    <div className="p-4 w-full flex flex-col">

      {/* ---------- TOP NAV ---------- */}

      <AssetNav />
    
      <div className="rounded-xl shadow-custom-all-sides p-4 mt-7">

        {/* -------- FILTER UI -------- */}

        {/* <div className="flex items-center gap-3 mb-4 flex-wrap">

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded"
          />

          <button
            onClick={handleFilter}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Filter
          </button>

          <button
            onClick={handleReset}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Reset
          </button>

        </div> */}

        {/* -------- CALENDAR -------- */}

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}

          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}

          initialView="dayGridMonth"

          initialDate={selectedDate}

          events={events}

          eventClick={handleEvent}

          height="90vh"

          eventTextColor="white"

          eventClassNames={(eventInfo) => {

            const status = eventInfo.event.extendedProps.status;

            if (status === "complete") return "green";
            if (status === "pending") return "yellow";
            if (status === "overdue") return "red";

            return "blue";
          }}

          eventContent={(eventInfo) => (
            <div>
              <b>{eventInfo.event.title}</b>
              <br />
              <small>{eventInfo.event.extendedProps.assignTo}</small>
            </div>
          )}
        />

      </div>

      {/* -------- EVENT MODAL -------- */}

      {modal && selectedEvent && (
        <ModalWrapper onclose={oncloseModal}>

          <div className="flex flex-col gap-y-4 p-4">

            <h3 className="text-lg text-center font-bold">
              {selectedEvent.title}
            </h3>

            <p className="text-sm font-semibold text-gray-600">
              Checklist :
              <span className="font-normal ml-2">
                {selectedEvent.extendedProps.checklist}
              </span>
            </p>

            <p className="text-sm font-semibold text-gray-600">
              Assigned To :
              <span className="font-normal ml-2">
                {selectedEvent.extendedProps.assignTo}
              </span>
            </p>

            <p className="text-sm font-semibold text-gray-600">
              Status :
              <span className="font-normal ml-2">
                {selectedEvent.extendedProps.status}
              </span>
            </p>

            <p className="text-sm font-semibold text-gray-600">
              Location :
              <span className="font-normal ml-2">
                {selectedEvent.extendedProps.location}
              </span>
            </p>

          </div>

        </ModalWrapper>
      )}
      </div>
      </section>
    // {/* </> */}
  );
};

export default PPMCalendar;