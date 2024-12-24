import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getFlightRequestDetails } from '../../../api';
const EmployeeFlightRequestDetails = () => {
  const { id } = useParams();
  const themeColor = useSelector((state) => state.theme.color);
  const [additional, setAdditionalPassenger] = useState([])
  const [formData, setFormData] = useState({
    departure_city: "",
    arrival_city: "",
    departure_date: "",
    return_date: "",
    preferred_airlines: "",
    flight_class: "",
    passport_information: "",
  });
  useEffect(() => {
    const fetchFlightRequestDetails = async () => {
      try {
        const HotelreqDetailsResponse = await getFlightRequestDetails(id);
        const data = HotelreqDetailsResponse.data;
        console.log(data);
        setFormData({
          ...formData,
          departure_city: data.departure_city,
          arrival_city: data.arrival_city,
          departure_date: data.departure_date,
          return_date: data.return_date,
          preferred_airlines: data.preferred_airlines,
          flight_class: data.flight_class,
          passport_information: data.passport_information,
        });
        setAdditionalPassenger(data)
        console.log(passengers)
      } catch (error) {
        console.log(error);
      }
    };
    fetchFlightRequestDetails();
  }, []);
  return (
    <div className="flex justify-center items-center my-2 w-full p-4">
      <div className="border border-gray-300 rounded-lg p-2 w-full mx-4 max-h-screen overflow-y-auto">
        <h2
          style={{ background: themeColor }}
          className="text-center md:text-xl font-bold p-2 bg-black rounded-md text-white"
        >
          Flight Request Details
        </h2>
        <div className="grid md:grid-cols-3 gap-5 mt-5">
          <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">Departure City:</label>
            <p>{formData.departure_city}</p>
          </div>

          <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">Arrival City:</label>
            <p>{formData.arrival_city}</p>
          </div>

          <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">Departure Date:</label>
            <p>{formData.departure_date}</p>
          </div>

          <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">Return Date:</label>
            <p>{formData.return_date}</p>
          </div>

          <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">Preferred Airlines:</label>
            <p>{formData.preferred_airlines}</p>
          </div>

          <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">Class:</label>
            <p>{formData.flight_class}</p>
          </div>

          {/* <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">Passenger Name(s):</label>
            <ul>
              {request.passengerNames.map((name, index) => (
                <li key={index}>{name}</li>
              ))}
            </ul>
          </div> */}

          <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">Passport Information:</label>
            <p>{formData.passport_information}</p>
          </div>

          {/* <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">Ticket Confirmation Number:</label>
            <p>{request.ticketConfirmationNumber}</p>
          </div>

          <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">Booking Status:</label>
            <p>{request.bookingStatus}</p>
          </div>

          <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">
              Manager Approval (If Required):
            </label>
            <p>{request.managerApproval}</p>
          </div>

          <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">Booking Confirmation Email:</label>
            <p>{request.bookingConfirmationEmail}</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default EmployeeFlightRequestDetails;
