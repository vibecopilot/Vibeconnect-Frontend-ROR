import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import Accordion from "../../AdminHrms/Components/Accordion";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { postCabRequest } from "../../../api";
import toast from "react-hot-toast";
const EmployeeAddCabRequest = () => {
  const themeColor = useSelector((state) => state.theme.color);

  const first_name = getItemInLocalStorage("Name");
  const last_name = getItemInLocalStorage("LASTNAME");
  const user_email = getItemInLocalStorage("USEREMAIL");
  const [formData, setFormData] = useState({
    pickup_location: "",
    drop_off_location: "",
    dateTime: "",
    number_of_passengers: "",
    transportation_type: "",
    special_requirements: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target; // Extract name and value from e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Dynamically update the property in formData
    }));
  };
  const navigate = useNavigate();
  const handleCabRequest = async () => {
    if (!formData.pickup_location) {
      toast("Pickup Location is required.");
      return;
    }
    if (!formData.drop_off_location) {
      toast("Drop Off Location is required.");
      return;
    }
    if (!formData.dateTime) {
      toast("Date & Time is required.");
      return;
    }
    if (!formData.transportation_type) {
      toast("Transportation Type is required.");
      return;
    }
    const sendData = new FormData();
    sendData.append(
      "cab_and_bus_request[pickup_location]",
      formData.pickup_location
    );
    sendData.append("cab_and_bus_request[booking_status]", "pending");
    sendData.append(
      "cab_and_bus_request[drop_off_location]",
      formData.drop_off_location
    );

    sendData.append("cab_and_bus_request[date_and_time]", formData.dateTime);
    sendData.append(
      "cab_and_bus_request[number_of_passengers]",
      formData.number_of_passengers
    );
    sendData.append(
      "cab_and_bus_request[transportation_type]",
      formData.transportation_type
    );
    sendData.append(
      "cab_and_bus_request[special_requirements]",
      formData.special_requirements
    );
    try {
      const CabreqResp = await postCabRequest(sendData);
      toast.success("Cab Request Added");
      navigate("/employee/booking-request/cab-bus-request");
      console.log("Cab request Response", CabreqResp);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex justify-center items-center my-5 w-full p-4">
      <div className="border border-gray-300 rounded-lg p-4 w-full mx-4 ">
        <h2
          style={{ background: themeColor }}
          className="text-center md:text-xl font-bold p-2 bg-black rounded-md text-white"
        >
          Cab Request
        </h2>
        <Accordion
          title={"Requester Details"}
          // icon={MdOutlineWebAsset}
          content={
            <>
              <div className="grid grid-cols-3  p-2 rounded-md bg-gray-100">
                <div className="grid grid-cols-2">
                  <label htmlFor="" className="font-medium">
                    Name :{" "}
                  </label>
                  <p>
                    {first_name} {last_name}
                  </p>
                </div>
                <div className="grid grid-cols-2">
                  <label htmlFor="" className="font-medium">
                    Email :{" "}
                  </label>
                  <p>{user_email}</p>
                </div>
              </div>
            </>
          }
        />
        <div className="grid md:grid-cols-3 gap-2 mt-2">
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
              className="border border-gray-400 p-2 rounded-md"
              placeholder="Enter Pickup Location"
            />
          </div>

          <div className="grid gap-2 items-center w-full">
            <label htmlFor="dropoffLocation" className="font-semibold">
              Drop-off Location:
            </label>
            <input
              type="text"
              name="drop_off_location"
              value={formData.drop_off_location}
              onChange={handleChange}
              id="dropoffLocation"
              className="border border-gray-400 p-2 rounded-md"
              placeholder="Enter Drop-off Location"
            />
          </div>

          <div className="grid gap-2 items-center w-full">
            <label htmlFor="destination" className="font-semibold">
              Date & Time:
            </label>
            <input
              type="datetime-local"
              id="dateTime"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
              className="border p-1 px-4 border-gray-500 rounded-md"
              placeholder="Enter Date & Time"
            />
          </div>

          <div className="grid gap-2 items-center w-full">
            <label htmlFor="numberOfPassengers" className="font-semibold">
              Number of Passengers:
            </label>
            <input
              type="number"
              id="numberOfPassengers"
              name="number_of_passengers"
              value={formData.number_of_passengers}
              onChange={handleChange}
              className="border border-gray-400 p-2 rounded-md"
              placeholder="Enter Number of Passengers"
            />
          </div>

          <div className="grid gap-2 items-center w-full">
            <label htmlFor="transportationType" className="font-semibold">
              Transportation Type:
            </label>
            <select
              id="transportationType"
              name="transportation_type"
              value={formData.transportation_type}
              onChange={handleChange}
              className="border border-gray-400 p-2 rounded-md"
            >
              <option value="">Select Transport type</option>
              <option value="cab">Cab</option>
              <option value="shuttle">Shuttle</option>
              <option value="bus">Bus</option>
            </select>
          </div>
          {/* <div className="grid gap-2 items-center w-full">
            <label
              htmlFor="bookingConfirmationNumber"
              className="font-semibold"
            >
              Mobile Number:
            </label>
            <input
              type="text"
              id="bookingConfirmationNumber"
              className="border border-gray-400 p-2 rounded-md"
              placeholder="Mobile Number"
            />
          </div> */}
        </div>
        <div className="grid gap-2 items-center w-full my-4">
          <label htmlFor="specialRequirements" className="font-semibold">
            Special Requirements:
          </label>
          <textarea
            id="specialRequirements"
            name="special_requirements"
            value={formData.special_requirements}
            onChange={handleChange}
            cols="25"
            rows="3"
            className="border p-1 px-4 border-gray-500 rounded-md"
            placeholder="Enter Special Requirements"
          ></textarea>
        </div>
        <div className="flex gap-5 justify-center items-center my-4">
          <button
            onClick={handleCabRequest}
            type="submit"
            className="bg-green-500 text-white  font-semibold py-2 px-4 rounded-md flex items-center gap-2"
          >
            <FaCheck /> Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAddCabRequest;
