import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../../../components/Navbar";
import { dateFormatSTD } from "../../../utils/dateUtils";
import { getDailyPickUpTransportationDetails } from "../../../api";
import { useParams } from "react-router-dom";

const AdminOutstationDetails = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const [details, setDetails] = useState("");
  const { id } = useParams();
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
      <div className="w-full flex flex-col overflow-hidden mx-2 p-2">
        <h2
          className="text-center text-white my-1 font-semibold text-lg p-2 rounded-md "
          style={{ background: themeColor }}
        >
          Outstation Details
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
            <p className="font-medium">Departure :</p>
            <p>{details?.pickup_location}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-medium">Destination :</p>
            <p>{details?.dropoff_location}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-medium">Departure Date :</p>
            <p>{dateFormatSTD(details?.date)}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-medium">Return Date :</p>
            <p></p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-medium">Passengers :</p>
            <p>{details?.no_of_passengers}</p>
          </div>
        </div>
        <div className="px-4 my-5">
          <p className="font-medium my-1">Purpose :</p>
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

export default AdminOutstationDetails;
