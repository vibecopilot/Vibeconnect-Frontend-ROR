import React, { useEffect, useState } from "react";
import { AiFillCar } from "react-icons/ai";
import Navbar from "../../../components/Navbar";
import { fetchParkingDetail } from "../../../api/index";
import { useParams } from "react-router-dom";

const ParkingDetails = () => {
  const [parkingData, setParkingData] = useState(null);
  const { id } = useParams(); // Get the ID from the URL

  useEffect(() => {
    const fetchParkingDetails = async () => {
      try {
        const res = await fetchParkingDetail(id);
        const item = res.data;
        const bookingReqData = {
          id: item.id,
          floor_id:item.floor_id,
          booked_by: item.created_by,
          parking_name: item.name,
          site_id:item.site_id,
          site_name:item.site_name,
          created_at: item.created_at,
          booking_date: item.booking_date,
          building_name: item.building_name,
          floor_name: item.floor_name,
          vehicle_type: item.vehicle_type,
        };
        console.log(bookingReqData)
        setParkingData(bookingReqData);
      } catch (error) {
        console.log("Error fetching booking request data:", error);
      }
    };
    fetchParkingDetails();
  }, []);

  if (!parkingData) {
    return <div>Loading...</div>;
  }

  return (
    <section className=" min-h-screen flex items-center justify-center bg-gray-100">
      <Navbar />
      <div className="w-full max-w-5xl mx-auto px-6">
        <div className="bg-white border border-gray-300 shadow-lg rounded-lg p-6 sm:p-10">
          <h3 className="border-b text-center text-2xl font-bold pb-4 mb-6">
            PARKING DETAILS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg shadow-md">
              <p className="text-gray-600 font-semibold">Parking Name:</p>
              <p className="text-lg font-bold text-gray-900">
                {parkingData.parking_name}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg shadow-md">
              <p className="text-gray-600 font-semibold">Site Id:</p>
              <p className="text-lg font-bold text-gray-900">
                {parkingData.site_id}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg shadow-md">
              <p className="text-gray-600 font-semibold">Site Name:</p>
              <p className="text-lg font-bold text-gray-900">
                {parkingData.site_name}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg shadow-md">
              <p className="text-gray-600 font-semibold">Building Name:</p>
              <p className="text-lg font-bold text-gray-900">
                {parkingData.building_name}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg shadow-md">
              <p className="text-gray-600 font-semibold">Floor Name:</p>
              <p className="text-lg font-bold text-gray-900">
                {parkingData.floor_name}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg shadow-md">
              <p className="text-gray-600 font-semibold">Parking Type:</p>
              <p className="text-lg font-bold text-gray-900">
                {parkingData.vehicle_type}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParkingDetails;

//   return (
//     <section className="flex">
//       <Navbar/>
//       <div>
//         <div className="md:mx-20 my-5 mb-10 sm:border border-gray-400 p-5 px-10 rounded-lg sm:shadow-xl">
//           <h3 className="border-b text-center text-xl border-black mb-6 font-bold">
//             {" "}
//             PARKING DETAILS
//           </h3>

//           <div className="w-full mx-3 my-5 p-5 ">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//               <div className="col-span-1">
//                 <label
//                   className="block text-gray-700 font-bold mb-2"
//                   htmlFor="client-name"
//                 >
//                   {" "}
//                   Name:Akshat Shrawat
//                 </label>
//                 {/* <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="client-name" type="text" value="Shubh Jhaveri" disabled /> */}
//               </div>
//               {/* <div className="col-span-1">
//         <label className="block text-gray-700 font-bold mb-2" htmlFor="two-wheeler">No. of 2 Wheeler:0</label>
//         </div>
//         <div className="col-span-1">
//         <label className="block text-gray-700 font-bold mb-2" htmlFor="four-wheeler">No. of 4 Wheeler:0</label>
//         </div> */}
//               <div className="col-span-1">
//                 <label
//                   className="block text-gray-700 font-bold mb-2"
//                   htmlFor="two-wheeler"
//                 >
//                   Parking Number:P1
//                 </label>
//               </div>
//               <div className="col-span-1">
//                 <label
//                   className="block text-gray-700 font-bold mb-2"
//                   htmlFor="start-period"
//                 >
//                   Booking Date:01/10/2024
//                 </label>
//                 {/* <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="start-period" type="text" value="01/10/2023" disabled /> */}
//               </div>
//               <div className="col-span-1">
//                 <label
//                   className="block text-gray-700 font-bold mb-2"
//                   htmlFor="end-period"
//                 >
//                   Start Time:10:00 AM
//                 </label>
//                 {/* <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="end-period" type="text" value="31/12/2024" disabled /> */}
//               </div>
//               <div className="col-span-1">
//                 <label
//                   className="block text-gray-700 font-bold mb-2"
//                   htmlFor="end-period"
//                 >
//                   End Time:11:00 AM
//                 </label>
//               </div>
//               <div className="col-span-1">
//                 <label
//                   className="block text-gray-700 font-bold mb-2"
//                   htmlFor="end-period"
//                 >
//                   Building Name - Jyoti Tower
//                 </label>
//               </div>
//               <div className="col-span-1">
//                 <label
//                   className="block text-gray-700 font-bold mb-2"
//                   htmlFor="end-period"
//                 >
//                   Floor Name - 2nd Floor
//                 </label>
//               </div>
//               <div className="col-span-1">
//                 <label
//                   className="block text-gray-700 font-bold mb-2"
//                   htmlFor="end-period"
//                 >
//                   Parking Type - Two Wheeler
//                 </label>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ParkingDetails;

{
  /* <h3 className="border-b text-center text-xl border-black mb-6 font-bold">Tower Name - Jyoti Tower , Floor Name - 2nd Floor, Parking Type - Two Wheeler</h3> */
}

{
  /* <div className="w-full mx-3 my-5 p-5 shadow-lg rounded-lg border border-gray-300">



<div class="flex my-4 overflow-x-auto">

<div class="grid grid-cols-2 gap-2">
<div class="bg-teal-400 w-12 h-8 rounded-md font-bold shadow flex items-center justify-center text-center text-gray-400 p-2">
<p class="my-1">P11A</p>
</div>
<div class="bg-teal-400 w-12 h-8 rounded-md font-bold shadow flex items-center justify-center text-center text-gray-400 p-2">
<p class="my-1">P11B</p>
</div>
<div class="bg-teal-400 w-12 h-8 rounded-md font-bold shadow flex items-center justify-center text-center text-gray-400 p-2">
<p class="my-1">P12A</p>
</div>
<div class="bg-teal-400 w-12 h-8 rounded-md font-bold shadow flex items-center justify-center text-center text-gray-400 p-2">
<p class="my-1">P12B</p>
</div>
</div>

<div class="flex flex-wrap gap-2 ml-2">
<div class="rounded-md font-bold shadow flex items-center justify-center text-center text-gray-400 p-2 w-34 h-75">
<div className='flex flex-col'>
<AiFillCar/>
<p>P1</p></div>
</div>
<div class="rounded-md font-bold shadow flex items-center justify-center text-center text-gray-400 p-2 w-34 h-75">
<div className='flex flex-col'>
<AiFillCar/>
<p>P2</p></div>
</div>
<div class="rounded-md font-bold shadow flex items-center justify-center text-center text-gray-400 p-2 w-34 h-75">
<div className='flex flex-col'>
<AiFillCar/>
<p>P3</p></div>
</div>
<div class="rounded-md font-bold shadow flex items-center justify-center text-center text-gray-400 p-2 w-34 h-75">
<div className='flex flex-col'>
<AiFillCar/>
      <p>P4</p></div>
      </div>
      <div class="rounded-md font-bold shadow flex items-center justify-center text-center text-gray-400 p-2 w-34 h-75">
      <div className='flex flex-col'>
      <AiFillCar/>
      <p>P5</p></div>
      </div>
      <div class="rounded-md font-bold shadow flex items-center justify-center text-center text-gray-400 p-2 w-34 h-75">
      <div className='flex flex-col'>
      <AiFillCar/>
      <p>P6</p></div>
      </div>
      <div class="rounded-md font-bold shadow flex items-center justify-center text-center text-gray-400 p-2 w-34 h-75">
      <div className='flex flex-col'>
      <AiFillCar/>
      <p>P7</p></div>
      </div>
      <div class="rounded-md font-bold shadow flex items-center justify-center text-center text-gray-400 p-2 w-34 h-75">
      <div className='flex flex-col'>
      <AiFillCar/>
      <p>P8</p></div>
      </div>
      <div class="bg-teal-400 rounded-md font-bold shadow flex items-center justify-center text-center text-gray-400 p-2 w-34 h-75">
      <div className='flex flex-col'>
      <AiFillCar/>
      <p>P9</p></div>
      </div>
      <div class="bg-teal-400 rounded-md font-bold shadow flex items-center justify-center text-center text-gray-400 p-2 w-34 h-75">
      <div className='flex flex-col'>
      <AiFillCar/>
      <p>P10</p></div>
      </div>
      </div>
      </div>
      
      
      
      </div> */
}
