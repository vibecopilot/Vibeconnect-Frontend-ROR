import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Table from "../../../components/table/Table";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import { getAmenitiesBookingById } from "../../../api";

const BookingDetails = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  const [facility, setFacility] = useState("");
  const siteId = getItemInLocalStorage("SITEID");
  const [formData, setFormData] = useState({
    amenity_id: "",
    amenity_slot_id: "",
    user_id: "",
    booking_date: "",
    site_id: siteId,
    amount: "",
    gst_no: 0,
    member_adult: 0,
    guest_adult: 0,
    no_of_members: 0,
    no_of_guests: 0,
    payment_mode: "post",
    min_people: 0,
    max_people: 0,
  });
  return (
    <section>
      <div
        style={{ background: themeColor }}
        className="flex  justify-center bg-black m-2 p-2 rounded-md"
      >
        <h2 className="text-xl font-semibold text-center text-white ">
          Booking Details
        </h2>
      </div>
      <div className="flex flex-col  w-full p-2">
        <div className="flex justify-between items-center w-full">
          <h1 className="w-full font-medium text-lg">Test Meeting Room</h1>
          <div className=" flex justify-end gap-2 w-full">
            <p className="text-end bg-red-900 rounded-md text-white p-2">
              Capture Payment
            </p>
            <p className="text-end bg-yellow-500 rounded-md text-white p-2">
              Request Payment
            </p>
          </div>
        </div>
        <div className="grid grid-cols-4 w-full gap-5 my-2 bg-blue-50 border rounded-xl p-2">
          <div className="grid grid-cols-2 gap-2 items-center">
            <p className=" font-medium">Booking ID : </p>
            <p className=" ">5431 </p>
          </div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <p className="font-medium">Status : </p>
            <p className="bg-green-400 text-white p-1 rounded-md text-center">
              Confirmed
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <p className="font-medium">Scheduled Date : </p>
            <p className="">11/11/2024</p>
          </div>

          <div className="grid grid-cols-2 gap-2 items-center">
            <p className="font-medium">Selected Slot: </p>
            <p className="">04:00 PM to 04:45 PM</p>
          </div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <p className="font-medium">Booked on : </p>
            <p className="">08/11/24</p>
          </div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <p className="font-medium">Booked by : </p>
            <p className="">Kunal sah</p>
          </div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <p className="font-medium">GST : </p>
            <p className="">₹ 1.8</p>
          </div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <p className="font-medium">Payable Amount : </p>
            <p className="">₹ 11.8</p>
          </div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <p className="font-medium">Transaction ID : </p>
            <p className=""></p>
          </div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <p className="font-medium">Payment Status : </p>
            <p className="bg-yellow-500 text-white text-center p-1 rounded-md">
              Pending
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <p className="font-medium">Payment Method : </p>
            <p>Pay on facility</p>
          </div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <p className="font-medium">Amount Paid : </p>
            <p>₹ 0.0</p>
          </div>
        </div>
        <div>
          <h2 className="border-b font-medium">Member details</h2>
          <Table />
        </div>
      </div>
    </section>
  );
};

export default BookingDetails;
