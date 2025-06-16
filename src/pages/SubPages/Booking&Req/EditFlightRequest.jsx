import React, { useState, useEffect } from "react";
import {
  getFlightRequestDetails,
  UpdateFlightRequest,
  getSetupUsers,
} from "../../../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import { useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { PiPlusCircleBold } from "react-icons/pi";
import Select from "react-select";
const EditFlightRequest = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [additionalPassenger, setAdditionalPassenger] = useState([
    { name: "", gender: "", class_type: "", id: null, _destroy: false },
  ]);
  const themeColor = useSelector((state) => state.theme.color);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    // employee_name: "",
    // employee_id: "",
    departure_city: "",
    arrival_city: "",
    departure_date: "",
    return_date: "",
    preferred_airlines: "",
    flight_class: "",
    passenger_name: "",
    passport_information: "",
    ticket_confirmation_number: "",
    booking_status: "",
    manager_approval: false,
    booking_confirmation_email: "",
  });
  useEffect(() => {
    const fetchFlightRequestDetails = async () => {
      try {
        const HotelreqDetailsResponse = await getFlightRequestDetails(id);
        const data = HotelreqDetailsResponse.data;
        console.log(data);
        setFormData({
          ...formData,

          // employee_id: data.employee_id,
          // employee_name: data.employee_name,
          departure_city: data.departure_city,
          arrival_city: data.arrival_city,
          departure_date: data.departure_date,
          return_date: data.return_date,
          preferred_airlines: data.preferred_airlines,
          flight_class: data.flight_class,
          passenger_name: data.passenger_name,
          passport_information: data.passport_information,
          ticket_confirmation_number: data.mobile_no,
          booking_status: data.booking_status,
          manager_approval: data.manager_approval,
          booking_confirmation_email: data.booking_confirmation_email,
        });

        setAdditionalPassenger(data.additional_passengers || []);
        setSelectedUser({
          value: data.employee_id,
          label: data.employee_name,
        });

        // Optional: Set user options
        setUsers(data.user_options || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFlightRequestDetails();
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const handleFlightRequest = async () => {
    const sendData = new FormData();
    sendData.append("flight_request[employee_name]", selectedUser.label);
    sendData.append("flight_request[departure_city]", formData.departure_city);
    sendData.append("flight_request[arrival_city]", formData.arrival_city);
    sendData.append("flight_request[departure_date]", formData.departure_date);
    sendData.append("flight_request[return_date]", formData.return_date);
    sendData.append(
      "flight_request[preferred_airlines]",
      formData.preferred_airlines
    );
    sendData.append("flight_request[flight_class]", formData.flight_class);
    sendData.append("flight_request[passenger_name]", formData.passenger_name);
    sendData.append(
      "flight_request[passport_information]",
      formData.passport_information
    );
    sendData.append(
      "flight_request[mobile_no]",
      formData.ticket_confirmation_number
    );
    sendData.append("flight_request[booking_status]", formData.booking_status);
    sendData.append(
      "flight_request[manager_approval]",
      formData.manager_approval
    );
    sendData.append(
      "flight_request[booking_confirmation_email]",
      formData.booking_confirmation_email
    );
    additionalPassenger.forEach((item) => {
      if (item._destroy) {
        // For removed passengers, include id and _destroy flag
        sendData.append(
          "flight_request[additional_passengers_attributes][][id]",
          item.id
        );
        sendData.append(
          "flight_request[additional_passengers_attributes][][_destroy]",
          true
        );
      } else if (item.id) {
        // For existing passengers, include regular details
        sendData.append(
          "flight_request[additional_passengers_attributes][][id]",
          item.id
        );
        sendData.append(
          "flight_request[additional_passengers_attributes][][name]",
          item.name
        );
        sendData.append(
          "flight_request[additional_passengers_attributes][][gender]",
          item.gender
        );
        sendData.append(
          "flight_request[additional_passengers_attributes][][class_type]",
          item.class_type
        );
      } else {
        // For new passengers, without an id yet
        sendData.append(
          "flight_request[additional_passengers_attributes][][name]",
          item.name
        );
        sendData.append(
          "flight_request[additional_passengers_attributes][][gender]",
          item.gender
        );
        sendData.append(
          "flight_request[additional_passengers_attributes][][class_type]",
          item.class_type
        );
      }
    });
    try {
      const FlightreqResp = await UpdateFlightRequest(sendData, id);
      toast.success("Flight Request Updated");
      navigate("/admin/booking-request/flight-ticket-request");
      console.log("Flight request Response", FlightreqResp);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddAdditionalPassenger = () => {
    setAdditionalPassenger([
      ...additionalPassenger,
      { name: "", gender: "", class_type: "", id: null, _destroy: false },
    ]);
  };

  // Mark a passenger for removal (setting _destroy: true instead of deleting)
  const handleRemoveAdditionalPassenger = (index) => {
    const updatedPassengers = additionalPassenger.map((passenger, i) =>
      i === index
        ? { ...passenger, _destroy: true } // Mark passenger as destroyed
        : passenger
    );
    setAdditionalPassenger(updatedPassengers);
  };

  // Update passenger data on change
  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = additionalPassenger.map((passenger, i) =>
      i === index ? { ...passenger, [field]: value } : passenger
    );
    setAdditionalPassenger(updatedPassengers);
  };

  const handleUserChange = (selectedOption) => {
    setSelectedUser(selectedOption); // Update selected user state
    console.log("Selected user:", selectedOption);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const setupUsers = await getSetupUsers(); // API call to fetch users
        const formattedOptions = setupUsers.data.map((user) => ({
          value: user.id,
          label: user.firstname,
        }));
        setUsers(formattedOptions);
        console.log(formattedOptions);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="w-full  ">
      {/* <BackButton to={"/employee/flight-request"} /> */}

      <div className="flex justify-center items-center my-5 w-full p-4">
        <div className="border border-gray-300 rounded-lg p-4 w-full mx-4">
          <h2
            className="text-center md:text-xl font-bold p-2 bg-black rounded-full text-white"
            style={{ background: themeColor }}
          >
            Edit Flight Request
          </h2>
          <div className="grid md:grid-cols-3 gap-5 mt-5">
            {/* <div className="grid gap-2 items-center w-full">
              <label htmlFor="employeeId" className="font-semibold">
                Employee ID:
              </label>
              <input
                type="number"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                id="employeeId"
                className="border p-1 px-4 border-gray-500 rounded-md"
                placeholder="Enter Employee ID"
              />
            </div>

            <div className="grid gap-2 items-center w-full">
              <label htmlFor="employeeName" className="font-semibold">
                Employee Name:
              </label>
              <input
                type="text"
                name="employee_name"
                value={formData.employee_name}
                onChange={handleChange}
                id="employeeName"
                className="border p-1 px-4 border-gray-500 rounded-md"
                placeholder="Enter Employee Name"
              />
            </div> */}
            <div className="grid gap-2 items-center w-full">
              <label className="font-medium">Employee Name:</label>
              <Select
                name="user"
                options={users}
                className="basic-single-select pr-5 text-black"
                classNamePrefix="select"
                placeholder="Select a Employee..."
                value={selectedUser} // Set the value from state
                onChange={handleUserChange} // Update selected value on change
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label
                htmlFor="ticketConfirmationNumber"
                className="font-semibold"
              >
                Mobile Number:
              </label>
              <input
                type="text"
                name="ticket_confirmation_number"
                value={formData.ticket_confirmation_number}
                onChange={handleChange}
                id="ticketConfirmationNumber"
                className="border p-1 px-4 border-gray-500 rounded-md"
                placeholder="Enter Mobile Number"
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label
                htmlFor="bookingConfirmationEmail"
                className="font-semibold"
              >
                Email:
              </label>
              <input
                type="email"
                name="booking_confirmation_email"
                id="bookingConfirmationEmail"
                value={formData.booking_confirmation_email}
                onChange={handleChange}
                className="border p-1 px-4 border-gray-500 rounded-md"
                placeholder="Enter Email"
              />
            </div>
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
                className="border p-1 px-4 border-gray-500 rounded-md"
                placeholder="Enter Destination"
              />
            </div>

            <div className="grid gap-2 items-center w-full">
              <label htmlFor="checkInDate" className="font-semibold">
                Arrival City:
              </label>
              <input
                type="text"
                name="arrival_city"
                value={formData.arrival_city}
                onChange={handleChange}
                id="checkInDate"
                className="border p-1 px-4 border-gray-500 rounded-md"
                placeholder="Enter Arrival"
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
                className="border p-1 px-4 border-gray-500 rounded-md"
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
                className="border p-1 px-4 border-gray-500 rounded-md"
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
                className="border p-1 px-4 border-gray-500 rounded-md"
                placeholder="Enter Preferred Airline(s)"
              />
            </div>

            <div className="grid gap-2 items-center w-full">
              <label htmlFor="class" className="font-semibold">
                Class:
              </label>
              <select
                id="class"
                name="flight_class"
                value={formData.flight_class}
                onChange={handleChange}
                className="border p-1 px-4 border-gray-500 rounded-md"
              >
                <option value="">Select Class</option>
                <option value="Economy">Economy</option>
                <option value="Business">Business</option>
                <option value="First">First</option>
              </select>
            </div>

            {/* <div className="grid gap-2 items-center w-full">
      <label htmlFor="passengerNames" className="font-semibold">
        Passenger Name(s):
      </label>
      <input
        type="text"
         name="passenger_name"
        value={formData.passenger_name}
        onChange={handleChange}
        id="passengerNames"
        className="border p-1 px-4 border-gray-500 rounded-md"
        placeholder="Enter Passenger Name(s)"
      />
    </div> */}

            {/* <div className="grid gap-2 items-center w-full">
      <label htmlFor="bookingStatus" className="font-semibold">
        Booking Status:
      </label>
      <select id="bookingStatus" 
      name="booking_status"
      value={formData.booking_status}
      onChange={handleChange}
      className="border p-1 px-4 border-gray-500 rounded-md">
        <option value="">Select Booking Status</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div> */}

            <div className="grid gap-2 items-center w-full">
              <label htmlFor="managerApproval" className="font-semibold">
                Manager Approval (If Required) :
              </label>
              <select
                id="managerApproval"
                name="manager_approval"
                value={formData.manager_approval}
                onChange={handleChange}
                className="border p-1 px-4 border-gray-500 rounded-md"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
          <div>
            <div className="my-4">
              <h2 className="font-medium border-b border-black my-2">
                Additional passengers
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {additionalPassenger.map(
                  (passenger, index) =>
                    !passenger._destroy && ( // Only render passengers not marked for destruction
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={passenger.name}
                          onChange={(e) =>
                            handlePassengerChange(index, "name", e.target.value)
                          }
                          className="border border-gray-400 rounded-md p-1 px-2 w-full"
                          placeholder="Passenger name"
                        />
                        <select
                          value={passenger.gender}
                          onChange={(e) =>
                            handlePassengerChange(
                              index,
                              "gender",
                              e.target.value
                            )
                          }
                          className="border border-gray-400 rounded-md p-1 px-2 w-full"
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                        <select
                          id="class"
                          name="class_type"
                          value={passenger.class_type}
                          onChange={(e) =>
                            handlePassengerChange(
                              index,
                              "class_type",
                              e.target.value
                            )
                          }
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
                    )
                )}
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
          <div className="grid gap-2 items-center w-full my-4">
            <label htmlFor="passportInformation" className="font-semibold">
              Passport Information:
            </label>
            <textarea
              name="passport_information"
              id="passportInformation"
              value={formData.passport_information}
              onChange={handleChange}
              cols="25"
              rows="3"
              className="border p-1 px-4 border-gray-500 rounded-md"
              placeholder="Enter Passport Information"
            ></textarea>
          </div>
          <div className="flex gap-5 justify-center items-center my-5">
            <button
              onClick={handleFlightRequest}
              className="bg-black text-white hover:bg-gray-700 font-semibold py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFlightRequest;
