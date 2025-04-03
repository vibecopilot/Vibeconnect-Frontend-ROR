import React, { useState } from "react";
import { FaCheck, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import Accordion from "../../AdminHrms/Components/Accordion";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import { PiPlusCircleBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { postFlightTicketRequest } from "../../../api";
import toast from "react-hot-toast";
const EmployeeAddFlightRequest = () => {
  const [additionalPassenger, setAdditionalPassenger] = useState([
    { name: "", gender: "", passengerClass: "" },
  ]);
  const [formData, setFormData] = useState({
    departure_city: "",
    arrival_city: "",
    departure_date: "",
    return_date: "",
    preferred_airlines: "",
    flight_class: "",
    passport_information: "",
  });
  const themeColor = useSelector((state) => state.theme.color);

  const first_name = getItemInLocalStorage("Name");
  const last_name = getItemInLocalStorage("LASTNAME");
  const user_email = getItemInLocalStorage("USEREMAIL");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const handleFlightRequest = async () => {
    if (!formData.departure_city) {
      toast("Departure City is required.");
      return;
    }
    if (!formData.arrival_city) {
      toast("Arrival City is required.");
      return;
    }
    if (!formData.departure_date) {
      toast("Departure Date is required.");
      return;
    }
    if (!formData.return_date) {
      toast("Return Date is required.");
      return;
    }
    if (!formData.flight_class) {
      toast("Flight Class is required.");
      return;
    }
    const sendData = new FormData();
    sendData.append("flight_request[departure_city]", formData.departure_city);
    sendData.append("flight_request[booking_status]", "pending");
    sendData.append("flight_request[arrival_city]", formData.arrival_city);
    sendData.append("flight_request[departure_date]", formData.departure_date);
    sendData.append("flight_request[return_date]", formData.return_date);
    sendData.append(
      "flight_request[preferred_airlines]",
      formData.preferred_airlines
    );
    sendData.append("flight_request[flight_class]", formData.flight_class);
    sendData.append(
      "flight_request[passport_information]",
      formData.passport_information
    );
    additionalPassenger.forEach((item) => {
      sendData.append("additional_passengers[][name]", item.name);
      sendData.append("additional_passengers[][gender]", item.gender);
    });

    try {
      const FlightreqResp = await postFlightTicketRequest(sendData);
      toast.success("Flight Request Added");
      navigate("/employee/booking-request/flight-ticket-request");
      console.log("Flight request Response", FlightreqResp);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddAdditionalPassenger = () => {
    setAdditionalPassenger([
      ...additionalPassenger,
      { name: "", gender: "", passengerClass: "" },
    ]);
  };
  const handleRemoveAdditionalPassenger = (index) => {
    setAdditionalPassenger(additionalPassenger.filter((_, i) => i !== index));
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = additionalPassenger.map((passenger, i) =>
      i === index ? { ...passenger, [field]: value } : passenger
    );
    setAdditionalPassenger(updatedPassengers);
  };
  return (
    <div className="w-full mt-1 mx-2 ">
      {/* <BackButton to={"/employee/flight-request"} /> */}

      <div className="flex justify-center items-center my-5 w-full p-4">
        <div className="border border-gray-300 rounded-lg p-4 w-full mx-4  ">
          <h2
            style={{ background: themeColor }}
            className="text-center md:text-xl font-semibold p-2 bg-black rounded-md text-white"
          >
            Flight Request
          </h2>
          <Accordion
            title={"Requester Details"}
            // icon={MdOutlineWebAsset}
            content={
              <>
                <div className="grid md:grid-cols-3  p-2 rounded-md bg-gray-100">
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
          <div className="grid md:grid-cols-3 gap-5 mt-5">
            <div className="grid gap-2 items-center w-full">
              <label htmlFor="destination" className="font-semibold">
                Departure City:
              </label>
              <input
                type="text"
                name="departure_city"
                value={formData.departure_city}
                onChange={handleChange}
                id="destination"
                className="border border-gray-400 p-2 rounded-md"
                placeholder="Enter departure city"
              />
            </div>

            <div className="grid gap-2 items-center w-full">
              <label htmlFor="" className="font-semibold">
                Arrival City:
              </label>
              <input
                type="text"
                name="arrival_city"
                value={formData.arrival_city}
                onChange={handleChange}
                id=""
                className="border border-gray-400 p-2 rounded-md"
                placeholder="Enter arrival city"
              />
            </div>

            <div className="grid gap-2 items-center w-full">
              <label htmlFor="departureDate" className="font-semibold">
                Departure Date:
              </label>
              <input
                type="date"
                name="departure_date"
                value={formData.departure_date}
                onChange={handleChange}
                id="departureDate"
                className="border border-gray-400 p-2 rounded-md"
              />
            </div>

            <div className="grid gap-2 items-center w-full">
              <label htmlFor="returnDate" className="font-semibold">
                Return Date (If Round Trip):
              </label>
              <input
                type="date"
                name="return_date"
                value={formData.return_date}
                onChange={handleChange}
                id="returnDate"
                className="border border-gray-400 p-2 rounded-md"
              />
            </div>

            <div className="grid gap-2 items-center w-full">
              <label htmlFor="preferredAirlines" className="font-semibold">
                Preferred Airline(s):
              </label>
              <input
                type="text"
                name="preferred_airlines"
                value={formData.preferred_airlines}
                onChange={handleChange}
                id="preferredAirlines"
                className="border border-gray-400 p-2 rounded-md"
                placeholder="Enter Preferred Airline(s)"
              />
            </div>

            <div className="grid gap-2 items-center w-full">
              <label htmlFor="class" className="font-semibold">
                Class:
              </label>
              <select
                id="class"
                name="passengerClass"
                value={formData.passengerClass}
                onChange={handleChange}
                className="border border-gray-400 p-2 rounded-md"
              >
                <option value="">Select class</option>
                <option value="economy">Economy</option>
                <option value="business">Business</option>
                <option value="first">First</option>
              </select>
            </div>

            {/* <div className="grid gap-2 items-center w-full">
              <label
                htmlFor="ticketConfirmationNumber"
                className="font-semibold"
              >
                Mobile Number:
              </label>
              <input
                type="text"
                id="ticketConfirmationNumber"
                className="border border-gray-400 p-2 rounded-md"
                placeholder="Mobile number"
              />
            </div> */}

            {/* <div className="grid gap-2 items-center w-full">
              <label htmlFor="managerApproval" className="font-semibold">
                Manager Approval (If Required):
              </label>
              <select
                id="managerApproval"
                className="border border-gray-400 p-2 rounded-md"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div> */}
          </div>
          <div>
            <div className="my-4">
              <h2 className="font-medium border-b border-black my-2">
                Additional passengers
              </h2>
              <div className="grid lg:grid-cols-2 gap-2">
                {additionalPassenger.map((passenger, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={passenger.name}
                      name="name"
                      onChange={(e) =>
                        handlePassengerChange(index, "name", e.target.value)
                      }
                      className="border border-gray-400 rounded-md p-1 px-2 w-full"
                      placeholder="Passenger name"
                    />
                    <select
                      value={passenger.gender}
                      onChange={(e) =>
                        handlePassengerChange(index, "gender", e.target.value)
                      }
                      className="border border-gray-400 rounded-md p-1 px-2 w-full"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    <select
                      id="class"
                      name="flight_class"
                      value={formData.flight_class}
                      onChange={handleChange}
                      className="border p-1 px-4 border-gray-500 rounded-md w-full"
                    >
                      <option value="">Select Class</option>
                      <option value="Economy">Economy</option>
                      <option value="Business">Business</option>
                      <option value="First">First</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemoveAdditionalPassenger(index)}
                      className="text-white bg-red-500 rounded-md p-2"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-start">
                <button
                  onClick={handleAddAdditionalPassenger}
                  className="bg-green-400 p-2 flex gap-2 items-center rounded-md text-white font-medium"
                >
                  <PiPlusCircleBold /> Add
                </button>
              </div>
            </div>
          </div>
          <div className="grid gap-2 items-center w-full mt-2s">
            <label htmlFor="passportInformation" className="font-semibold">
              Passport Information:
            </label>
            <textarea
              name="passport_information"
              value={formData.passport_information}
              onChange={handleChange}
              id="passportInformation"
              className="border border-gray-400 p-2 rounded-md"
              placeholder="Enter Passport Information"
            ></textarea>
          </div>
          <div className="flex gap-5 justify-center items-center my-4">
            <button
              onClick={handleFlightRequest}
              style={{ background: themeColor }}
              type="submit"
              className="bg-black text-white hover:bg-gray-700 font-semibold py-2 px-4 rounded flex items-center gap-2"
            >
              <FaCheck /> Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAddFlightRequest;
