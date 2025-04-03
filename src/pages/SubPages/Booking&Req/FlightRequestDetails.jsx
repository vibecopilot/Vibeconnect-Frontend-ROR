import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getFlightRequestDetails } from "../../../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import { useParams } from "react-router-dom";

const FlightRequestDetails = () => {
  const { id } = useParams();
  const themeColor = useSelector((state) => state.theme.color);
  const [formData, setFormData] = useState({
    employee_name: "",
    employee_id: "",
    departure_city: "",
    arrival_city: "",
    departure_date: "",
    return_date: "",
    preferred_airlines: "",
    flight_class: "",
    passenger_name: [],
    passport_information: "",
    ticket_confirmation_number: "",
    booking_status: "",
    manager_approval: false,
    booking_confirmation_email: "",
    mobile: "",
  });
  useEffect(() => {
    const fetchFlightRequestDetails = async () => {
      try {
        const HotelreqDetailsResponse = await getFlightRequestDetails(id);
        const data = HotelreqDetailsResponse.data;
        console.log(data);
        setFormData({
          ...formData,

          employee_id: data.employee_id,
          employee_name: data.employee_name,
          departure_city: data.departure_city,
          arrival_city: data.arrival_city,
          departure_date: data.departure_date,
          return_date: data.return_date,
          preferred_airlines: data.preferred_airlines,
          flight_class: data.flight_class,
          passenger_name: [...data.additional_passengers],
          passport_information: data.passport_information,
          ticket_confirmation_number: data.ticket_confirmation_number,
          booking_status: data.booking_status,
          manager_approval: data.manager_approval,
          booking_confirmation_email: data.booking_confirmation_email,
          mobile: data.mobile_no,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchFlightRequestDetails();
  }, []);
  console.log(formData);
  return (
    <div className="flex justify-center items-center my-5 w-full p-4">
      <div className="border border-gray-300 rounded-lg p-4 w-full mx-4 max-h-screen overflow-y-auto">
        <h2
          className="text-center md:text-xl font-bold p-2 bg-black rounded-full text-white"
          style={{ background: themeColor }}
        >
          Flight Request Details
        </h2>
        <div className="grid md:grid-cols-3 gap-5 mt-5">
          <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">Employee Name:</label>
            <p>{formData.employee_name}</p>
          </div>
          <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">Mobile No:</label>
            <p>{formData.mobile}</p>
          </div>
          <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">Email:</label>
            <p>{formData.booking_confirmation_email}</p>
          </div>
          {/* 
  <div className="flex gap-2 items-center w-full">
    <label className="font-semibold">Employee ID:</label>
    <p>{formData.employee_id}</p>
  </div> */}

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
          <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">
              Manager Approval (If Required):
            </label>
            <p>{formData.manager_approval ? "Yes" : "No"}</p>
          </div>
          <div className="flex gap-2 items-start w-full">
            <label className="font-semibold">Additional passengers:</label>
            <p>
              {formData.passenger_name.length > 0
                ? formData.passenger_name.map((passenger, index) => (
                    <span key={index} className="flex flex-col">
                      <div className="flex gap-2 items-start">
                        {passenger.name} <span className="mx-2">|</span>
                        {passenger.class_type} <span className="mx-2">|</span>
                        {passenger.gender}
                      </div>
                    </span>
                  ))
                : "No passengers"}
            </p>
          </div>
          <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">Passport Information:</label>
            <p>{formData.passport_information}</p>
          </div>

          {/* <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">Ticket Confirmation Number:</label>
            <p>{formData.ticket_confirmation_number}</p>
          </div> */}

          {/* <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">Booking Status:</label>
            <p>{formData.booking_status}</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default FlightRequestDetails;
