import React, { useState } from "react";
import { useSelector } from "react-redux";
import Accordion from "../../AdminHrms/Components/Accordion";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import Navbar from "../../../components/Navbar";
import { FaCheck } from "react-icons/fa";
import { postHotelRequest } from "../../../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EmployeeAddHotelRequest = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const first_name = getItemInLocalStorage("Name");
  const last_name = getItemInLocalStorage("LASTNAME");
  const user_email = getItemInLocalStorage("USEREMAIL");

  const [formData, setFormData] = useState({
    destination: "",
    check_in_date: "",
    check_out_date: "",
    number_of_rooms: "",
    room_type: "",
    special_requests: "",
    hotel_preferences: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const handleEmpHotelRequest = async () => {
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
    sendData.append("hotel[destination]", formData.destination);
    sendData.append("hotel[check_in_date]", formData.check_in_date);
    sendData.append("hotel[check_out_date]", formData.check_out_date);
    sendData.append("hotel[number_of_rooms]", formData.number_of_rooms);
    sendData.append("hotel[room_type]", formData.room_type);
    sendData.append("hotel[special_requests]", formData.special_requests);
    sendData.append("hotel[hotel_preferences]", formData.hotel_preferences);
    try {
      const HotelreqResp = await postHotelRequest(sendData);
      toast.success("Hotel Request Added");
      navigate("/employee/booking-request/hotel-request");
      console.log("Hotel request Response", HotelreqResp);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="flex">
      <Navbar />
      <div className="flex justify-center items-center  w-full p-2">
        <div className="border border-gray-300 rounded-lg p-4 w-full mx-4 max-h-screen overflow-y-auto">
          <h2
            style={{ background: themeColor }}
            className="text-center md:text-xl font-bold p-2 bg-black rounded-md text-white"
          >
            Hotel Request
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
          <div className="grid md:grid-cols-3 gap-2 mt-5">
            <div className="grid gap-2 items-center w-full">
              <label htmlFor="destination" className="font-semibold">
                Destination :
              </label>
              <input
                type="text"
                name="destination"
                id="destination"
                value={formData.destination}
                onChange={handleChange}
                className="border border-gray-400 p-2 rounded-md"
                placeholder="Enter Destination"
              />
            </div>

            <div className="grid gap-2 items-center w-full">
              <label htmlFor="checkInDate" className="font-semibold">
                Check-in Date :
              </label>
              <input
                type="date"
                name="check_in_date"
                id="checkInDate"
                value={formData.check_in_date}
                onChange={handleChange}
                className="border border-gray-400 p-2 rounded-md"
              />
            </div>

            <div className="grid gap-2 items-center w-full">
              <label htmlFor="checkOutDate" className="font-semibold">
                Check-out Date :
              </label>
              <input
                type="date"
                name="check_out_date"
                id="checkOutDate"
                value={formData.check_out_date}
                onChange={handleChange}
                className="border border-gray-400 p-2 rounded-md"
              />
            </div>

            <div className="grid gap-2 items-center w-full">
              <label htmlFor="numberOfRooms" className="font-semibold">
                Number of Rooms :
              </label>
              <input
                type="number"
                name="number_of_rooms"
                id="numberOfRooms"
                value={formData.number_of_rooms}
                onChange={handleChange}
                className="border border-gray-400 p-2 rounded-md"
                placeholder="Enter Number of Rooms"
              />
            </div>

            <div className="grid gap-2 items-center w-full">
              <label htmlFor="roomType" className="font-semibold">
                Room Type :
              </label>
              <select
                id="roomType"
                name="room_type"
                className="border border-gray-400 p-2 rounded-md"
                value={formData.room_type}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
              </select>
            </div>
          </div>
          <div className="grid gap-2 items-center w-full my-2">
            <label htmlFor="specialRequests" className="font-semibold">
              Special Requests :
            </label>
            <textarea
              id="specialRequests"
              name="special_requests"
              className="border border-gray-400 p-2 rounded-md"
              placeholder="Enter Special Requests"
              value={formData.special_requests}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="grid gap-2 items-center w-full ">
            <label htmlFor="hotelPreferences" className="font-semibold">
              Hotel Preferences :
            </label>
            <textarea
              id="hotelPreferences"
              name="hotel_preferences"
              className="border border-gray-400 p-2 rounded-md"
              placeholder="Enter Hotel Preferences"
              value={formData.hotel_preferences}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="flex gap-5 justify-center items-center my-2">
            <button
              onClick={handleEmpHotelRequest}
              type="submit"
              className="bg-green-400  text-white  font-semibold py-2 px-4 rounded-md flex items-center gap-2"
            >
              <FaCheck /> Submit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmployeeAddHotelRequest;
