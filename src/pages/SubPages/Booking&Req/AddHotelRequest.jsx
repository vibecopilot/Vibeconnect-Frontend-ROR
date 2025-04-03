import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { postHotelRequest, getSetupUsers } from "../../../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import { FaCheck } from "react-icons/fa";
import Select from "react-select";
const AddHotelRequest = () => {
  const siteId = getItemInLocalStorage("SITEID");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    // employee_id: "",
    // employee_name: "",
    destination: "",
    hotel_name: "",
    location: "",
    number_of_rooms: "",
    room_type: "",
    special_requests: "",
    hotel_preferences: "",
    check_in_date: "",
    check_out_date: "",
    booking_confirmation_number: "",
    booking_certification_email: "",
    booking_status: "",
    manager_approval: false,
    is_available: false,
    site_id: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const handleHotelRequest = async () => {
    if (!selectedUser || !selectedUser.label) {
      toast("Employee Name is required.");
      return;
    }
    if (
      !formData.booking_confirmation_number ||
      !/^\d{10}$/.test(formData.booking_confirmation_number)
    ) {
      toast("Valid Mobile Number is required.");
      return;
    }
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.booking_certification_email)
    ) {
      toast("Please enter a valid email address");
      return;
    }

    if (!formData || !formData.destination) {
      toast("Destination is required.");
      return;
    }
    if (!formData || !formData.check_in_date) {
      toast("Check In Date is required.");
      return;
    }
    if (!formData || !formData.check_out_date) {
      toast("Check Out Date is required.");
      return;
    }
    if (!formData || !formData.room_type) {
      toast("Room type is required.");
      return;
    }
    const sendData = new FormData();
    // sendData.append("hotel[employee_id]", formData.employee_id);
    // sendData.append("hotel[employee_name]", formData.employee_name);
    sendData.append("hotel[employee_name]", selectedUser.label);
    sendData.append("hotel[destination]", formData.destination);
    sendData.append("hotel[number_of_rooms]", formData.number_of_rooms);
    sendData.append("hotel[room_type]", formData.room_type);
    sendData.append("hotel[special_requests]", formData.special_requests);
    sendData.append("hotel[hotel_preferences]", formData.hotel_preferences);
    sendData.append("hotel[check_in_date]", formData.check_in_date);
    sendData.append("hotel[check_out_date]", formData.check_out_date);
    sendData.append(
      "hotel[booking_confirmation_number]",
      formData.booking_confirmation_number
    );
    sendData.append(
      "hotel[booking_certification_email]",
      formData.booking_certification_email
    );
    sendData.append("hotel[booking_status]", formData.booking_status);
    sendData.append("hotel[manager_approval]", formData.manager_approval);
    sendData.append("hotel[site_id]", siteId);

    try {
      const HotelreqResp = await postHotelRequest(sendData);
      toast.success("Hotel Request Added");
      navigate("/admin/booking-request/hotel-request");
      console.log("Hotel request Response", HotelreqResp);
    } catch (error) {
      console.log(error);
    }
  };
  const themeColor = useSelector((state) => state.theme.color);

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
    <div className="flex justify-center  my-2 w-full p-4">
      <div className="border border-gray-300 rounded-lg p-4 w-full mx-4  ">
        <h2
          className="text-center md:text-xl font-bold p-2  rounded-md text-white"
          style={{ background: themeColor }}
        >
          Hotel Request
        </h2>
        <div className="grid md:grid-cols-3 gap-2 mt-5">
          {/* <div className="grid gap-2 items-center w-full">
            <label htmlFor="employeeId" className="font-semibold">
              Employee ID:
            </label>
            <input
              type="number"
              id="employeeId"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              className="border p-2 px-4 border-gray-500 rounded-md"
              placeholder="Enter Employee ID"
            />
          </div>

          <div className="grid gap-2 items-center w-full">
            <label htmlFor="employeeName" className="font-semibold">
              Employee Name:
            </label>
            <input
              type="text"
              id="employeeName"
              name="employee_name"
              value={formData.employee_name}
              onChange={handleChange}
              className="border p-2 px-4 border-gray-500 rounded-md"
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
              htmlFor="bookingConfirmationNumber"
              className="font-semibold"
            >
              Mobile Number:
            </label>
            <input
              type="text"
              id="bookingConfirmationNumber"
              name="booking_confirmation_number"
              value={formData.booking_confirmation_number}
              onChange={handleChange}
              className="border p-2 px-4 border-gray-500 rounded-md"
              placeholder="Enter Mobile Number"
            />
          </div>
          <div className="grid gap-2 items-center w-full">
            <label htmlFor="bookingConfirmationEmail" className="font-semibold">
              Email:
            </label>
            <input
              type="email"
              id="bookingConfirmationEmail"
              name="booking_certification_email"
              value={formData.booking_certification_email}
              onChange={handleChange}
              className="border p-2 px-4 border-gray-500 rounded-md"
              placeholder="Enter Email"
            />
          </div>
          <div className="grid gap-2 items-center w-full">
            <label htmlFor="destination" className="font-semibold">
              Destination:
            </label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="border p-2 px-4 border-gray-500 rounded-md"
              placeholder="Enter Destination"
            />
          </div>

          <div className="grid gap-2 items-center w-full">
            <label htmlFor="checkInDate" className="font-semibold">
              Check-in Date:
            </label>
            <input
              type="date"
              id="checkInDate"
              name="check_in_date"
              value={formData.check_in_date}
              onChange={handleChange}
              className="border p-2 px-4 border-gray-500 rounded-md"
            />
          </div>

          <div className="grid gap-2 items-center w-full">
            <label htmlFor="checkOutDate" className="font-semibold">
              Check-out Date:
            </label>
            <input
              type="date"
              id="checkOutDate"
              name="check_out_date"
              value={formData.check_out_date}
              onChange={handleChange}
              className="border p-2 px-4 border-gray-500 rounded-md"
            />
          </div>

          <div className="grid gap-2 items-center w-full">
            <label htmlFor="numberOfRooms" className="font-semibold">
              Number of Rooms:
            </label>
            <input
              type="number"
              id="numberOfRooms"
              name="number_of_rooms"
              value={formData.number_of_rooms}
              onChange={handleChange}
              className="border p-2 px-4 border-gray-500 rounded-md"
              placeholder="Enter Number of Rooms"
            />
          </div>

          <div className="grid gap-2 items-center w-full">
            <label htmlFor="roomType" className="font-semibold">
              Room Type:
            </label>
            <select
              id="roomType"
              className="border p-2 px-4 border-gray-500 rounded-md"
              name="room_type"
              value={formData.room_type}
              onChange={handleChange}
            >
              <option value="">Select Room Type</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="suite">Suite</option>
            </select>
          </div>
          <div className="grid gap-2 items-center w-full">
            <label htmlFor="managerApproval" className="font-semibold">
              Manager Approval (If Required) :
            </label>
            <select
              id="managerApproval"
              className="border p-2 px-4 border-gray-500 rounded-md"
              name="manager_approval"
              value={formData.manager_approval}
              onChange={handleChange}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* <div className="grid gap-2 items-center w-full">
            <label htmlFor="managerApproval" className="font-semibold">
              Manager Approval :
            </label>
            <select
              id="managerApproval"
              className="border p-2 px-4 border-gray-500 rounded-md"
              name="manager_approval"
              value={formData.manager_approval}
              onChange={handleChange}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div> */}
        </div>
        <div className="grid gap-2 items-center w-full my-4">
          <label htmlFor="specialRequests" className="font-semibold">
            Special Requests:
          </label>
          <textarea
            id="specialRequests"
            className="border p-1 px-4 border-gray-500 rounded-md"
            name="special_requests"
            value={formData.special_requests}
            onChange={handleChange}
            placeholder="Enter Special Requests"
            cols="25"
            rows="3"
          ></textarea>
        </div>
        <div className="grid gap-2 items-center w-full my-4">
          <label htmlFor="hotelPreferences" className="font-semibold">
            Hotel Preferences:
          </label>
          <textarea
            id="hotelPreferences"
            className="border p-1 px-4 border-gray-500 rounded-md"
            name="hotel_preferences"
            value={formData.hotel_preferences}
            onChange={handleChange}
            placeholder="Enter Hotel Preferences"
            cols="25"
            rows="3"
          ></textarea>
        </div>
        <div className="flex gap-5 justify-center items-center my-4">
          <button
            onClick={handleHotelRequest}
            className="bg-green-400 text-white flex items-center gap-2 font-semibold py-2 px-4 rounded-md"
          >
            <FaCheck /> Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddHotelRequest;
