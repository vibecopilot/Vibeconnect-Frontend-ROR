import React, { useEffect, useState } from "react";
import { BiCalendarExclamation } from "react-icons/bi";
import { HiLocationMarker } from "react-icons/hi";
import { useParams } from "react-router-dom";
import { FaRegFileAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { domainPrefix, getEventsDetails } from "../api";
import EventCheckInModal from "./EventCheckInModal";

const EventPage = () => {
  const [eventDetails, setEventDetails] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const { id } = useParams();
  console.log("event id", id);
  const formattedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventDetailsResp = await getEventsDetails(id);
        console.log(eventDetailsResp);
        setEventDetails(eventDetailsResp.data);
        // Check if ANY user has rsvp === "attended"
        const users = eventDetailsResp?.data?.users || [];
        const submitted = users.some((u) => u.rsvp === "attended");
        setCheckedIn(submitted);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEventDetails();
  }, [id]);

  const isImage = (filePath) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];
    const extension = filePath.split(".").pop().split("?")[0].toLowerCase();
    return imageExtensions.includes(extension);
  };
  const getFileName = (filePath) => {
    return filePath.split("/").pop().split("?")[0];
  };

  const themeColor = useSelector((state) => state.theme.color);
  return (
    <section>
      <div className="m-2">
        <h2
          style={{ background: themeColor }}
          className="text-center text-xl font-bold p-2 bg-black rounded-full text-white"
        >
          {eventDetails?.event_name}
        </h2>
        <div className="my-2 mb-10 border-2 p-2 rounded-md border-gray-400">
          {/* Grid Section for Image and Description */}
          <div className="my-5 grid gap-4 grid-cols-12 border-2 sm:mx-5 p-4 rounded-md border-gray-400">
            {/* Description aligned to full width */}
            <h2 className="col-span-12 text-xl font-semibold text-gray-800">
              {eventDetails.discription}
            </h2>

            {/* Conditional image or file rendering */}
            {eventDetails.event_image &&
              eventDetails.event_image.length > 0 && (
                <div className="col-span-12 sm:col-span-6">
                  {isImage(
                    domainPrefix + eventDetails.event_image[0].document
                  ) ? (
                    <img
                      src={domainPrefix + eventDetails.event_image[0].document}
                      alt="event"
                      className="rounded-md w-full max-h-[28rem] object-cover cursor-pointer"
                      onClick={() =>
                        window.open(
                          domainPrefix + eventDetails.event_image[0].document,
                          "_blank"
                        )
                      }
                    />
                  ) : (
                    <a
                      href={domainPrefix + eventDetails.event_image[0].document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-400 transition-all duration-300 text-center flex flex-col items-center"
                    >
                      <FaRegFileAlt size={50} />
                      {getFileName(eventDetails.event_image[0].document)}
                    </a>
                  )}
                </div>
              )}
          </div>

          {/* Organizer Details */}
          <div className="py-2 px-4 rounded-md bg-blue-50 mx-2">
            <div className="gap-5 w-full justify-around my-2">
              <p className="text-lg font-medium mb-3">Organised By:</p>
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2">
                  <p className="flex gap-1 items-center font-medium">
                    <HiLocationMarker /> Location:
                  </p>
                  <p>{eventDetails.venue}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="flex gap-1 items-center font-medium">
                    <BiCalendarExclamation /> Start Date & Time:
                  </p>
                  <p>{formattedDate(eventDetails.start_date_time)}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="flex gap-1 items-center font-medium">
                    <BiCalendarExclamation /> End Date & Time:
                  </p>
                  <p>{formattedDate(eventDetails.end_date_time)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Check-in Section */}
          <div className="flex justify-center gap-4 mx-10 mt-5">
            {!checkedIn ? (
              <button
                onClick={() => setModalOpen(true)}
                className="p-3 border rounded-md border-black bg-green-500 text-white font-semibold"
              >
                Check In
              </button>
            ) : (
              <div className="p-3 border rounded-md border-black bg-green-200 text-green-800 font-semibold flex items-center justify-center">
                Successfully Checked In!
              </div>
            )}
          </div>
        </div>

        {modalOpen === true && (
          <EventCheckInModal
            eventId={id}
            onClose={() => setModalOpen(false)}
            onSuccess={() => {
              setModalOpen(false);
              setCheckedIn(true);
            }}
          />
        )}
      </div>
    </section>
  );
};

export default EventPage;
