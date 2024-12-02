import React, { useEffect, useState } from "react";
import image from "/profile.png";
import { useParams } from "react-router-dom";
import { domainPrefix, getFBDetails } from "../../../../api";
import Table from "../../../../components/table/Table";
import Navbar from "../../../../components/Navbar";
import FBDetails from "../FBDetails";

const FBRestaurtantDetails = () => {
  const [formData, setFormData] = useState({});
  const { id } = useParams();
  const [scheduleData, setScheduleData] = useState([])
  useEffect(() => {
    const fetchFBDetails = async () => {
      try {
        const details = await getFBDetails(id);
        console.log(details);
        setFormData(details.data)
        const restaurantSchedule = details.data.restaurant_schedule || {};
        const transformedData = Object.keys(restaurantSchedule).map((day) => ({
          operational_days: day,
          start_time: restaurantSchedule[day].start_time || null,
          end_time: restaurantSchedule[day].end_time || null,
          break_start_time: null,
          break_end_time: null,
          booking_allowed: restaurantSchedule[day].booking_allowed ? "Yes" : "No",
          order_allowed: restaurantSchedule[day].order_allowed ? "Yes" : "No",
          last_booking_order_time: null,
        }));
        setScheduleData(transformedData);
        console.log(transformedData)
      } catch (error) {
        console.error("Error fetching site FB details:", error);
      }
    };
    fetchFBDetails();
  }, []);

  const columns = [
    {
      name: "Operational Days	",
      selector: (row) => row.operational_days,
      sortable: true,
    },

    {
      name: "Start Time",
      selector: (row) => row.start_time,
      sortable: true,
    },
    {
      name: "End Time",
      selector: (row) => row.end_time,
      sortable: true,
    },
    {
      name: "Break Start Time	",
      selector: (row) => row.break_start_time,
      sortable: true,
    },
    {
      name: "Break End Time",
      selector: (row) => row.break_end_time,
      sortable: true,
    },
    {
      name: "Booking Allowed",
      selector: (row) => row.booking_allowed,
      sortable: true,
    },
    {
      name: "Order Allowed",
      selector: (row) => row.order_allowed,
      sortable: true,
    },
    {
      name: "Last Booking & Order Time",
      selector: (row) => row.last_booking_order_time,
      sortable: true,
    },
  ];

  const data = [
    {
      operational_days: "monday",
    }
  ]
  return (
    <div className="flex">
      
      <FBDetails/>
      <div className="overflow-hidden w-full my-8">
      <div className=" mx-3">
        <h3 className="border-b text-left text-xl border-black mb-6 mt-2 font-bold">
          BASIC DETAILS
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="grid grid-cols-2">
            <p className="">Restaurant Name:</p>
            <p>{formData.restaurant_name}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="">Cuisines:</p>
            <p>{formData.cuisines}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="">Delivery Time:</p>
            <p>{formData.delivery_time}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="">Cost for Two:</p>
            <p>{formData.delivery_time}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="">Address:</p>
            <p>{formData.address}</p>
          </div>
        </div>
      </div>

      <div className=" my-5 p-5 shadow-sm rounded-lg">
        <h3 className="border-b text-left text-xl border-black mb-6 font-bold">
          RESTAURTANT DETAILS
        </h3>
        <Table responsive columns={columns} data={scheduleData} pagination={false} />
       
      </div>
      <div className=" my-5 p-5">
        <h3 className="border-b text-left text-xl border-black mb-6 font-bold">
          OTHER INFO
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid grid-cols-2">
            <p className="">Phone Number:</p>
            <p>{formData.mobile_number}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="">Booking Allowed:</p>
            <p>{formData.booking_allowed}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="">Cancel Before Schedule:</p>
            <p>{formData.cancel_before}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="">Closing Message:</p>
            <p>{formData.closing_message}</p>
          </div>
        </div>
      </div>

      <div className="my-5 p-5">
  <h3 className="border-b text-left text-xl border-black mb-6 font-bold">
    COVER
  </h3>
  <div className="flex gap-4 flex-wrap my-4 items-center text-center">
    {formData.food_and_beverages_attachments?.length > 0 && formData.food_and_beverages_attachments[0] ? (
      <img
        src={domainPrefix + formData.food_and_beverages_attachments[0].document}
        alt="Cover Image"
        className="w-64 h-64 object-cover rounded-md"
        onClick={() =>
          window.open(
            domainPrefix + formData.food_and_beverages_attachments[0].document,
            "_blank"
          )
        }
      />
    ) : (
      <p>No Cover Image</p>
    )}
  </div>
</div>

<div className=" my-5 p-5">
  <h3 className="border-b text-left text-xl border-black mb-6 font-bold">
    MENU
  </h3>
  <div className="flex gap-4 flex-wrap my-4 items-center text-center">
    {formData.food_and_beverages_attachments?.length > 1 && formData.food_and_beverages_attachments[1] ? (
      <img
        src={domainPrefix + formData.food_and_beverages_attachments[1].document}
        alt="Menu Image"
        className="w-64 h-64 object-cover rounded-md"
        onClick={() =>
          window.open(
            domainPrefix + formData.food_and_beverages_attachments[1].document,
            "_blank"
          )
        }
      />
    ) : (
      <p>No Menu Image</p>
    )}
  </div>
</div>

<div className=" my-5 p-5">
  <h3 className="border-b text-left text-xl border-black mb-6 font-bold">
    GALLERY
  </h3>
  <div className="flex gap-4 flex-wrap my-4 items-center text-center">
    {formData.food_and_beverages_attachments?.length > 2 && formData.food_and_beverages_attachments[2] ? (
      <img
        src={domainPrefix + formData.food_and_beverages_attachments[2].document}
        alt="Gallery Image"
        className="w-64 h-64 object-cover rounded-md"
        onClick={() =>
          window.open(
            domainPrefix + formData.food_and_beverages_attachments[2].document,
            "_blank"
          )
        }
      />
    ) : (
      <p>No Gallery Image</p>
    )}
  </div>
</div>
</div>
   
    </div>
  );
};

export default FBRestaurtantDetails;
