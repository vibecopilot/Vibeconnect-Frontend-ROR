import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDailyPickUpTransportationDetails } from "../../../api";
import { useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import { dateFormatSTD, formatTime } from "../../../utils/dateUtils";

const AdminPickupDetails = () => {
  const [details, setDetails] = useState("");
  const { id } = useParams();

  const themeColor = useSelector((state) => state.theme.color);
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const categoryDetails = await getDailyPickUpTransportationDetails(id);
        setDetails(categoryDetails.data);
      } catch (error) {
        console.error("Error fetching category details:", error);
      }
    };
    fetchCategoryDetails();
  }, []);
  return (
    <section className="flex ">
      <Navbar />
      <div className="w-full flex flex-col overflow-hidden mx-2">
        <h2
          className="text-center text-white my-1 font-semibold text-lg p-2 rounded-md "
          style={{ background: themeColor }}
        >
          Daily Pickup & Drop Details
        </h2>
        <div className="grid grid-cols-3 gap-2 gap-y-4 my-2 p-5 border rounded-xl bg-blue-50">
          <div className="grid grid-cols-2">
            <p className="font-medium">Booking ID :</p>
            <p>{details.id}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-medium">Booked by/For :</p>
            <p>{details?.user_full_name? details?.user_full_name: "Self"}</p>
          </div>

          <div className="grid grid-cols-2">
            <p className="font-medium">Pickup Location :</p>
            <p>{details?.pickup_location}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-medium">Drop-Off Location :</p>
            <p>{details?.dropoff_location}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-medium">Date :</p>
            <p>{dateFormatSTD(details?.date)}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-medium">Pickup Time :</p>
            <p>{formatTime(details?.time)}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-medium">Passengers :</p>
            <p>{details?.no_of_passengers}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-medium">Created by :</p>
            <p>{details.created_by_full_name}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-medium">Created on :</p>
            <p>{dateFormatSTD(details.created_at)}</p>
          </div>
        </div>
        <div className="px-4">
          <p className="font-medium">Additional Note :</p>
          <p className="bg-gray-50 rounded-md p-2">
            {details.additional_note ? (
              details.additional_note
            ) : (
              <p className="text-center">No Additional info</p>
            )}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdminPickupDetails;
