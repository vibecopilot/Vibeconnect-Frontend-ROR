import React, { useEffect, useState } from "react";
import image from "/profile.png";
import { useParams } from "react-router-dom";
import { getFBDetails } from "../../../../api";
import Table from "../../../../components/table/Table";
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
    <div className="flex flex-col w-full overflow-hidden">
      <div className="mx-3 px-5">
        <h3 className="border-b text-left text-xl border-black mb-6 mt-2 font-bold">
          BASIC DETAILS
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="grid grid-cols-2">
            <p className="font-bold">Restaurant Name:</p>
            <p>{formData.restaurant_name}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-bold">Cuisines:</p>
            <p>{formData.cuisines}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-bold">Delivery Time:</p>
            <p>{formData.delivery_time}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-bold">Cost for Two:</p>
            <p>{formData.delivery_time}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-bold">Address:</p>
            <p>{formData.address}</p>
          </div>
        </div>
      </div>

      <div className="mx-3 my-5 p-5 shadow-sm rounded-lg">
        <h3 className="border-b text-left text-xl border-black mb-6 font-bold">
          RESTAURTANT DETAILS
        </h3>
        <Table responsive columns={columns} data={scheduleData} pagination={false} />
        {/* <div class="overflow-x-auto">
          <table class="table-auto">
            <thead>
              <tr>
                <th class="px-4 py-2"></th>
                <th class="px-4 py-2">Operational Days</th>
                <th class="px-4 py-2">Start Time</th>
                <th class="px-4 py-2">End Time</th>
                <th class="px-4 py-2">Break Start Time</th>
                <th class="px-4 py-2">Break End Time</th>
                <th class="px-4 py-2">Booking Allowed</th>
                <th class="px-4 py-2">Order Allowed</th>
                <th class="px-4 py-2">Last Booking & Order Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td class="border px-4 py-2">Monday</td>
                <td class="border px-4 py-2">
                  
                </td>
                <td class="border px-4 py-2">
                  <input type="time" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="time" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="time" />
                </td>

                <td class="border px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="time" />
                </td>
              </tr>
              <tr>
                <td class="border px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td class="border px-4 py-2">Tuesday</td>
                <td class="border px-4 py-2">
                  <input type="time" />
                </td>
                <td class="border px-4 py-2">
                  <input type="time" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="time" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="time" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="time" />
                </td>
              </tr>
              <tr>
                <td class="border px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td class="border px-4 py-2">Wednesday</td>
                <td class="border px-4 py-2">
                  <input type="time" />
                </td>
                <td class="border px-4 py-2">
                  <input type="time" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="time" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="time" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="time" />
                </td>
              </tr>
              <tr>
                <td class="border px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td class="border px-4 py-2">Thursday</td>
                <td class="border px-4 py-2">
                  <input type="time" />
                </td>
                <td class="border px-4 py-2">
                  <input type="time" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="time" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="time" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="time" />
                </td>
              </tr>
              <tr>
                <td class="border px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td class="border px-4 py-2">Friday</td>
                <td class="border px-4 py-2">
                  <input type="time" />
                </td>
                <td class="border px-4 py-2">
                  <input type="time" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="time" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="time" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="time" />
                </td>
              </tr>
              <tr>
                <td class="border px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td class="border px-4 py-2">Saturday</td>
                <td class="border px-4 py-2">
                  <input type="time" />
                </td>
                <td class="border px-4 py-2">
                  <input type="time" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="time" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="time" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="time" />
                </td>
              </tr>
              <tr>
                <td class="border px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td class="border px-4 py-2">Sunday</td>
                <td class="border px-4 py-2">
                  <input type="time" />
                </td>
                <td class="border px-4 py-2">
                  <input type="time" />
                </td>

                <td class="border px-4 py-2 text-center">
                  <input type="time" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="time" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="checkbox" />
                </td>
                <td class="border px-4 py-2 text-center">
                  <input type="time" />
                </td>
              </tr>
            </tbody>
          </table>
        </div> */}
      </div>
      <div className="mx-3 my-5 p-5">
        <h3 className="border-b text-left text-xl border-black mb-6 font-bold">
          OTHER INFO
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid grid-cols-2">
            <p className="font-bold">Phone Number:</p>
            <p>{formData.mobile_number}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-bold">Booking Allowed:</p>
            <p>{formData.booking_allowed}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-bold">Cancel Before Schedule:</p>
            <p>{formData.cancel_before}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-bold">Closing Message:</p>
            <p>{formData.closing_message}</p>
          </div>
        </div>
      </div>

      <div className="mx-3 my-5 p-5 ">
        <h3 className="border-b text-left text-xl border-black mb-6 font-bold">
          COVER
        </h3>
        <img src={image} alt="" className="w-64 h-64" />
      </div>
      <div className="mx-3 my-5 p-5">
        <h3 className="border-b text-left text-xl border-black mb-6 font-bold">
          MENU
        </h3>
        <img src={image} alt="" className="w-64 h-64" />
      </div>
      <div className="mx-3 my-5 p-5 ">
        <h3 className="border-b text-left text-xl border-black mb-6 font-bold">
          GALLERY
        </h3>
        <img src={image} alt="" className="w-64 h-64" />
      </div>
    </div>
  );
};

export default FBRestaurtantDetails;
