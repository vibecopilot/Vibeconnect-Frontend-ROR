import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../../pages/style/Calendar.css";
import { getPPMTask } from "../../api";
import toast from "react-hot-toast";
import ModalWrapper from "../../containers/modals/ModalWrapper";
function PPMCalendarDashboard() {
  const [modal, setModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  useEffect(() => {
    const fetchPPMTask = async () => {
      toast.loading("Please wait...");
      try {
        const taskResponse = await getPPMTask();

        const formattedEvents = taskResponse.data.activities.map((task) => ({
          title: task?.asset_name || "No Title",
          start: task?.start_time || new Date().toISOString(), // Ensure start date is valid
          // end: task?.end_date || "", // Optional end date
          extendedProps: {
            assignTo: task?.assigned_to_name || "Unassigned",
            status: task?.status || "unknown",
          },
        }));
        console.log(formattedEvents);
        // Set events in state
        setEvents(formattedEvents);
        toast.dismiss(); // Dismiss loading tast
      } catch (error) {
        console.log(error);
        toast.error("Failed to load tasks");
      }
    };

    fetchPPMTask();
  }, []);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const handleEvent = (eventInfo) => {
    setSelectedEvent(eventInfo.event);
    setModal(true);
  };
  const oncloseModal = () => {
    console.log("CALLED");
    setSelectedEvent(null);
    setModal(false);
  };
  return (
    <div>
      <FullCalendar
        // ref={calendarRef}
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
        eventClick={handleEvent} // Display the events from the state
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
        eventClassNames={(eventInfo) => {
          return eventInfo.event.extendedProps.status === "inprogress"
            ? "yellow"
            : eventInfo.event.extendedProps.status === "complete"
            ? "green"
            : "red";
        }}
        eventContent={(eventInfo) => (
          <div>
            <b>{eventInfo.event.title}</b>
            <br />
            <span>Assigned To: {eventInfo.event.extendedProps.assignTo}</span>
            <br />
            <span>Status: {eventInfo.event.extendedProps.status}</span>
          </div>
        )}
      />
      {modal && (
        <ModalWrapper onclose={oncloseModal}>
          <div className="flex flex-col gap-y-4">
            <h3 className="text-base text-center font-bold text-gray-900">
              {selectedEvent.title}
            </h3>
            <p className="text-sm font-semibold text-gray-500">
              Assigned To:{" "}
              <span className="font-normal">
                {selectedEvent.extendedProps.assignTo}
              </span>
            </p>
            <p className="text-sm font-semibold text-gray-500">
              Status:{" "}
              <span className="font-normal">
                {selectedEvent.extendedProps.status}
              </span>
            </p>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
}

export default PPMCalendarDashboard;
