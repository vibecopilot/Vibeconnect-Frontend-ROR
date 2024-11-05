import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./style/Calendar.css";
import { getPPMCalendar } from "../api";

const PPMCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);

  const fetchPPM = async () => {
    try {
      const response = await getPPMCalendar();
      const mappedEvents = response.data.map((event) => ({
        title: event.title,
        start: event.start,
        end: event.end,
      }));
      setEvents(mappedEvents);
      console.log("PPM CALENDAR", response);
    } catch (error) {
      console.error("Error fetching PPM calendar data", error);
    }
  };

  useEffect(() => {
    fetchPPM();
  }, [selectedDate]);

  const renderEventContent = (eventInfo) => (
    <div>
      <strong>{eventInfo.timeText}</strong> <br />
      <i>{eventInfo.event.title}</i>
    </div>
  );

  return (
    <div className="rounded-xl shadow-custom-all-sides p-2">
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
          eventInfo.event.extendedProps.category === "Task" ? "red" : "green"
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
