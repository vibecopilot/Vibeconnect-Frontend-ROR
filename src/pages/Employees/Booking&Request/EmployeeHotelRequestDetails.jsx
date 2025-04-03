import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getHotelRequestDetails } from "../../../api";
import { useParams } from "react-router-dom";
const EmployeeHotelRequestDetails = () => {
  const { id } = useParams();
  const themeColor = useSelector((state) => state.theme.color);

  const [formData, setFormData] = useState({
    destination: "",
    number_of_rooms: "",
    room_type: "",
    special_requests: "",
    hotel_preferences: "",
    check_in_date: "",
    check_out_date: "",
    //  site_id: ""
  });
  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // Return date in yyyy-mm-dd format
  };

  useEffect(() => {
    const fetchHotelRequestDetails = async () => {
      const HotelreqDetailsResponse = await getHotelRequestDetails(id);
      const data = HotelreqDetailsResponse.data;
      console.log(data);
      setFormData({
        ...formData,
        destination: data.destination,
        number_of_rooms: data.number_of_rooms,
        room_type: data.room_type,
        special_requests: data.special_requests,
        hotel_preferences: data.hotel_preferences,
        check_in_date: dateFormat(data.check_in_date),
        check_out_date: dateFormat(data.check_out_date),
        //  site_id: data.site_id
      });
    };
    fetchHotelRequestDetails();
  }, []);
  return (
    <div className="flex justify-center items-center my-2 w-full p-4 overflow-y-auto mb-10">
      <div className="border border-gray-300 rounded-lg p-2 w-full mx-4 max-h-screen overflow-y-auto">
        <h2
          style={{ background: themeColor }}
          className="text-center md:text-xl font-bold p-2 bg-black rounded-md text-white"
        >
          Hotel Request Details
        </h2>
        <div className="grid md:grid-cols-3 gap-5 mt-5">
          <div className="flex items-center gap-2 w-full">
            <label className="font-semibold">Destination:</label>
            <p>{formData.destination}</p>
          </div>

          <div className="flex items-center gap-2 w-full">
            <label className="font-semibold">Check-in Date:</label>
            <p>{formData.check_in_date}</p>
          </div>

          <div className="flex items-center gap-2 w-full">
            <label className="font-semibold">Check-out Date:</label>
            <p>{formData.check_out_date}</p>
          </div>

          <div className="flex items-center gap-2 w-full">
            <label className="font-semibold">Number of Rooms:</label>
            <p>{formData.number_of_rooms}</p>
          </div>

          <div className="flex items-center gap-2 w-full">
            <label className="font-semibold">Room Type:</label>
            <p>{formData.room_type}</p>
          </div>

          <div className="flex items-center gap-2 w-full">
            <label className="font-semibold">Special Requests:</label>
            <p>{formData.special_requests}</p>
          </div>

          {/* <div className="flex items-center gap-2 w-full">
            <label className="font-semibold">
              Booking Confirmation Number:
            </label>
            <p>{request.bookingConfirmationNumber}</p>
          </div> */}

          {/* <div className="flex items-center gap-2 w-full">
            <label className="font-semibold">Booking Status:</label>
            <p>{request.bookingStatus}</p>
          </div> */}

          {/* <div className="flex items-center gap-2 w-full">
            <label className="font-semibold">
              Manager Approval (If Required):
            </label>
            <p>{request.managerApproval}</p>
          </div> */}

          {/* <div className="flex items-center gap-2 w-full mb-10">
            <label className="font-semibold">Booking Confirmation Email:</label>
            <p>{request.bookingConfirmationEmail}</p>
          </div> */}
          <div className="flex items-center gap-2 w-full">
            <label className="font-semibold">Hotel Preferences:</label>
            <p>{formData.hotel_preferences}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHotelRequestDetails;
