import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { gettransportRequestDetails } from "../../../api";
import { useParams } from "react-router-dom";

const EmployeeTransportRequestDetails = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    pickup_location: "",
    drop_off_location: "",
    startDate: "",
    endDate: "",
    date_and_time: "",
    special_requirements: "",
  });
  useEffect(() => {
    const fetchTransportRequestDetails = async () => {
      try {
        const HotelreqDetailsResponse = await gettransportRequestDetails(id);
        const data = HotelreqDetailsResponse.data;
        console.log(data);
        const [date, timeWithSeconds] = data.date_and_time
          ? data.date_and_time.split("T")
          : ["", ""];
        const time = timeWithSeconds ? timeWithSeconds.slice(0, 5) : "";
        setFormData({
          ...formData,
          pickup_location: data.pickup_location,
          drop_off_location: data.drop_off_location,
          startDate: data.start_date,
          endDate: date.end_date,
          special_requirements: data.special_requirements,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchTransportRequestDetails();
  }, []);
  return (
    <div className="flex justify-center items-center my-5 w-full p-4">
      <div className="border border-gray-300 rounded-lg p-4 w-full mx-4 max-h-screen overflow-y-auto">
        <h2
          className="text-center md:text-xl font-bold p-2 bg-black rounded-full text-white"
          style={{ background: themeColor }}
        >
          Transport Request Details
        </h2>
        <div className="grid md:grid-cols-3 gap-5 mt-5">
          <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">Pickup Location:</label>
            <p>{formData.pickup_location}</p>
          </div>
          <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">Drop-off Location:</label>
            <p>{formData.drop_off_location}</p>
          </div>

          <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">Start Date:</label>
            <p>{formData.startDate}</p>
          </div>

          <div className="flex gap-2 items-center w-full">
            <label className="font-semibold">End Date:</label>
            <p>{formData.endDate}</p>
          </div>
          <div className="flex flex-col gap-2 w-full col-span-3">
            <label className="font-semibold">Special Requirements:</label>
            <p>{formData.special_requirements}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTransportRequestDetails;
