import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./style/Calendar.css";
import { getPPMCalendar } from "../api";
import toast from "react-hot-toast";

const PPMCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const calendarRef = useRef(null);

  // Function to fetch data from the API with date range
  const fetchPPM = async () => {
    // Only proceed if both dates are set
    if (!startDate || !endDate) return;
    toast.loading("Please wait");
    try {
      const response = await getPPMCalendar( startDate, endDate );
      const mappedEvents = response.data.map((event) => ({
        title: event.title,
        start: event.start,
        end: event.end,
      }));
      toast.dismiss()
      toast.success("PPM Calendar data fetched successfully");
      setEvents(mappedEvents);
      console.log("PPM CALENDAR", response);
    } catch (error) {
      console.error("Error fetching PPM calendar data", error);
    }
  };

  // Fetch events whenever both startDate and endDate are set
  useEffect(() => {
    if (startDate && endDate) {
      fetchPPM();
    }
  }, [startDate, endDate]);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const renderEventContent = (eventInfo) => (
    <div>
      <strong>{eventInfo.timeText}</strong> <br />
      <i>{eventInfo.event.title}</i>
    </div>
  );

  return (
    <div className="rounded-xl shadow-custom-all-sides p-2">
      {/* Date range inputs */}
      
      <div className="shadow-custom-all-sides mb-2 rounded-xl p-2 flex items-center gap-4">
          <label className="font-medium">
            Start Date :&nbsp;
            <input
              className="border p-1 px-2 rounded-md border-gray-400"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
            />
          </label>
          <label className="font-medium">
            End Date :&nbsp;
            <input
              className="border p-1 px-2 rounded-md border-gray-400"
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </label>
        </div>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev",
          center: "title",
          right: "next dayGridMonth,timeGridWeek,timeGridDay",
        }}
        views={{
          fortnightlyView: {
            type: "dayGrid",
            duration: { weeks: 2 },
            buttonText: "fortnight",
          },
        }}
        initialDate={selectedDate}
        events={events}
        eventBackgroundColor={(eventInfo) =>
          eventInfo.event.extendedProps?.category === "Task" ? "red" : "green"
        }
        eventTextColor="white"
        height={"90vh"}
        allDayText="All Day"
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }}
        eventContent={renderEventContent}
      />
    </div>
  );
};

export default PPMCalendar;
