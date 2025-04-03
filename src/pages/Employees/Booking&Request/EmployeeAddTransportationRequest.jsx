import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { postTransportRequest } from "../../../api";
import toast from "react-hot-toast";

const EmployeeAddTransportRequest = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const [formData, setFormData] = useState({
    pickup_location: "",
    special_requirements: "",
    startDate: "",
    endDate: "",
    drop_off_location: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const handleTransportRequest = async () => {
    if (!formData.pickup_location) {
      toast("Pickup Location is required.");
      return;
    }
    if (!formData.drop_off_location) {
      toast("Drop Off Location is required.");
      return;
    }
    if (!formData.startDate) {
      toast("Start Date is required.");
      return;
    }
    if (!formData.endDate) {
      toast("End Date is required.");
      return;
    }
    const sendData = new FormData();
    sendData.append(
      "transport_request[pickup_location]",
      formData.pickup_location
    );
    sendData.append("transport_request[booking_status]", "pending");
    sendData.append("transport_request[start_date]", formData.startDate);
    sendData.append("transport_request[end_date]", formData.endDate);
    sendData.append(
      "transport_request[drop_off_location]",
      formData.drop_off_location
    );

    sendData.append(
      "transport_request[special_requirements]",
      formData.special_requirements
    );
    try {
      const TransportreqResp = await postTransportRequest(sendData);
      toast.success("Transport Request Added");
      navigate("/employee/booking-request/transportation-request");
      console.log("Transport request Response", TransportreqResp);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center my-5 w-full p-4">
      <form className="border border-gray-300 rounded-lg p-4 w-full max-w-7xl mx-auto max-h-screen overflow-y-auto">
        <h2
          className="text-center text-lg md:text-xl font-bold p-2 rounded-full text-white"
          style={{ background: themeColor }}
        >
          Transport Request
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          <div className="grid gap-2 items-center w-full">
            <label htmlFor="pickupLocation" className="font-semibold">
              Pickup Location:
            </label>
            <input
              type="text"
              id="pickupLocation"
              name="pickup_location"
              value={formData.pickup_location}
              onChange={handleChange}
              className="border p-2 border-gray-500 rounded-md focus:ring focus:ring-blue-300"
              placeholder="Enter Pickup Location"
            />
          </div>

          <div className="grid gap-2 items-center w-full">
            <label htmlFor="dropoffLocation" className="font-semibold">
              Drop-off Location:
            </label>
            <input
              type="text"
              id="dropoffLocation"
              name="drop_off_location"
              value={formData.drop_off_location}
              onChange={handleChange}
              className="border p-2 border-gray-500 rounded-md focus:ring focus:ring-blue-300"
              placeholder="Enter Drop-off Location"
            />
          </div>

          <div className="grid gap-2 items-center w-full">
            <label htmlFor="destination" className="font-semibold">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="border p-2 border-gray-500 rounded-md focus:ring focus:ring-blue-300"
              placeholder="Start Date"
            />
          </div>
          <div className="grid gap-2 items-center w-full">
            <label htmlFor="dateRange" className="font-semibold">
              End Date:
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="border p-2 border-gray-500 rounded-md focus:ring focus:ring-blue-300"
              placeholder="End Date"
            />
          </div>
          <div className="grid gap-2 col-span-1 sm:col-span-2 lg:col-span-3 items-center w-full">
            <label htmlFor="specialRequirements" className="font-semibold">
              Special Requirements:
            </label>
            <textarea
              id="specialRequirements"
              name="special_requirements"
              value={formData.special_requirements}
              onChange={handleChange}
              className="border border-gray-400 p-2 rounded-md focus:ring focus:ring-blue-300"
              placeholder="Enter Special Requirements"
            ></textarea>
          </div>
        </div>
      </form>
      <div className="flex justify-center mt-4">
        <button
          onClick={handleTransportRequest}
          type="submit"
          className="bg-black text-white hover:bg-gray-700 font-semibold py-2 px-4 rounded w-full max-w-xs"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default EmployeeAddTransportRequest;
