import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDailyPickUpTransportationDetails } from "../../../api";
import { useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar";

const AdminPickupDetails = () => {
  const [users, setUsers] = useState("");
  const {id} = useParams()

  const themeColor = useSelector((state) => state.theme.color);
  useEffect(() => {
    
  const fetchCategoryDetails = async () => {
    try {
      const categoryDetails = await getDailyPickUpTransportationDetails(id);
      setUsers(categoryDetails.data);
    } catch (error) {
      console.error("Error fetching category details:", error);
    }
  };
  fetchCategoryDetails();
}, []);
  return (
    <section className="flex ">
      <Navbar/>
     
        <div className="w-full flex flex-col overflow-hidden">
        <h2 className="text-center text-white my-1 font-semibold  text-lg p-4 px-4 " style={{ background: themeColor }}>
          Daily Pickup & Drop Details
        </h2>
        <div className="grid grid-cols-3 gap-5 my-5 px-5">
          <div className="grid grid-cols-2">
            <p className="font-medium">Booking ID :</p>
            <p>{users.id}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-medium">Employee :</p>
            <p>emp</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-medium">Department :</p>
            <p>IT</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-medium">Pickup Location :</p>
            <p>{users.pickup_location}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-medium">Drop-Off Location :</p>
            <p>{users.dropoff_location}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-medium">Date :</p>
            <p>{users.date}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-medium">Pickup Time :</p>
            <p>{users.time}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-medium">Passengers :</p>
            <p>{users.no_of_passengers}</p>
          </div>
        </div>
        <div className="px-4">
            <p className="font-medium">Additional Note :</p>
            <p className="bg-gray-300 rounded-md p-2">{users.additional_note}</p>
        </div>
        </div>
     
    </section>
  );
};

export default AdminPickupDetails;
