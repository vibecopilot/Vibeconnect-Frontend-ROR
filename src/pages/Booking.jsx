// import React, { useState, useEffect } from "react";
// import DataTable from "react-data-table-component";
// import { IoAddCircleOutline } from "react-icons/io5";
// import Navbar from "../components/Navbar";
// import { BiEdit, BiExport } from "react-icons/bi";
// import ExportBookingModal from "../containers/modals/ExportBookingsModal";
// import { Link, useLocation } from "react-router-dom";
// import SeatBooking from "./SubPages/SeatBooking";
// import Table from "../components/table/Table";
// import { useSelector } from "react-redux";
// import { BsEye } from "react-icons/bs";
// import { getAmenitiesBooking, getFacitilitySetup } from "../api";
// import { FaCalendarAlt } from "react-icons/fa";



// const Booking = () => {
//   const [searchText, setSearchText] = useState("");
//   const [modal, showModal] = useState(false);
//   // const [page, setPage] = useState("meetingBooking");
//   const [bookings, setBookings] = useState([]); 
//   const [loading, setLoading] = useState(false); 
//   const [error, setError] = useState(null); 
//   const [bookingFacility, setBookingFacility] = useState([]);
//   const themeColor = "rgb(3, 19 37)";

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // Fetch Bookings
//         const bookingsResponse = await getAmenitiesBooking();
//         console.log("Bookings Response:", bookingsResponse.data.amenity_bookings);
//         setBookings(bookingsResponse?.data.amenity_bookings || []);

//         // Fetch Facility Setup
//         const facilityResponse = await getFacitilitySetup();
//         console.log("Facility Setup Response:", facilityResponse.data.amenities);
//         setBookingFacility(facilityResponse?.data.amenities || []);

//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError(`Failed to fetch data: ${error.message || error}`);
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const combinedData = bookings.map((booking) => {
//     const facility = bookingFacility.find(
//       (fac) => fac.id === booking.amenity_id
//     );

//     // Find the relevant slot from amenity slots
//     const amenitySlots = facility?.amenity_slots || [];
//     const slot = amenitySlots.find((s) => s.id === booking.amenity_slot_id);

//     // Format the slot time if found
//     const slotTime = slot
//       ? `${String(slot.start_hr || 0).padStart(2, "0")}:${String(
//           slot.start_min || 0
//         ).padStart(2, "0")} - ${String(slot.end_hr || 0).padStart(
//           2,
//           "0"
//         )}:${String(slot.end_min || 0).padStart(2, "0")}`
//       : "N/A";

//     return {
//       ...booking,
//       fac_name: facility?.fac_name || "N/A",
//       fac_type: facility?.fac_type || "N/A",
//       description: facility?.description || "N/A",
//       terms: facility?.terms || "N/A",
//       slot_time: slotTime, // Add formatted slot time
//     };
//   });

//   // Sort combinedData by ID in descending order
//   const sortedData = combinedData.sort((a, b) => b.id - a.id);

//   // Handle Search
//   const handleSearch = (event) => {
//     const searchValue = event.target.value;
//     setSearchText(searchValue);

//     const filteredResults = sortedData.filter((item) =>
//       item.fac_name.toLowerCase().includes(searchValue.toLowerCase())
//     );
//     setBookings(filteredResults);
//   };

//   // Columns for DataTable
//   const columns = [
//     {
//       name: "Action",
//       cell: (row) => (
//         <div className="flex item-center gap-2">
//           <Link to={`/bookings/booking-details/${row.id}`}>
//             <BsEye />
//           </Link>
//           {/* <Link to={`bookings/edit_bookings/${row.id}`}>
//         <BiEdit size={15} />
//       </Link> */}
//         </div>
//       ),
//       sortable: false,
//     },
//     { name: "ID", selector: (row) => row.id, sortable: true },
//     // {
//     //   name: "Facility ID",
//     //   selector: (row) => row.amenity_id,
//     //   sortable: true,
//     // },
//     {
//       name: "Facility Name",
//       selector: (row) => row.fac_name,
//       sortable: true,
//     },
//     {
//       name: "Facility Type",
//       selector: (row) => row.fac_type,
//       sortable: true,
//     },
//     {
//       name: "Total Amount",
//       selector: (row) => row.amount || "NA",
//       sortable: true,
//     },
//     {
//       name: "Paymnet Status",
//       selector: (row) => row.status || "NA",
//       sortable: true,
//     },
//     {
//       name: "Paymnet Method",
//       selector: (row) => row?.payment?.payment_method || "NA",
//       sortable: true,
//     },
//     {
//       name: "Booked By",
//       selector: (row) => {
//         console.log("row", row.book_by_user);
//         return row?.book_by_user || "User Not Set!";
//       },
//       sortable: true,
//     },
//     {
//       name: "Booked On",
//       selector: (row) => {
//         const date = new Date(row.created_at);
//         const yy = date.getFullYear().toString(); // Get last 2 digits of the year
//         const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
//         const dd = String(date.getDate()).padStart(2, "0");
//         return `${dd}/${mm}/${yy}`;
//       },
//       sortable: true,
//     },
//     {
//       name: "Scheduled On",
//       selector: (row) => {
//         const date = new Date(row.booking_date);
//         const yy = date.getFullYear().toString(); // Get last 2 digits of the year
//         const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
//         const dd = String(date.getDate()).padStart(2, "0");
//         return `${dd}/${mm}/${yy}`;
//       },
//       sortable: true,
//     },
//     {
//       name: "Scheduled Time",
//       selector: (row) => row.slot_time || "N/A",
//       sortable: true,
//     },
//     {
//       name: "Description",
//       selector: (row) => row.description,
//       sortable: true,
//     },
//     {
//       name: "Terms",
//       selector: (row) => row.terms,
//       sortable: true,
//     },
//     {
//       name: "Booking Status",
//       selector: (row) => row.status || "N/A",
//       sortable: true,
//     },
//   ];

//   return (
//     <section className="flex">
//       <Navbar />
//       <div className="w-full flex m-3 flex-col overflow-hidden">
//         <div className="flex justify-center">
//           <div className="sm:flex grid grid-cols-2 sm:flex-row gap-5 font-medium p-2 sm:rounded-full rounded-md opacity-90 bg-gray-200">
//           <Link
//   to="/bookings"
//   className={`p-1 rounded-full px-4 transition-all duration-300 ${
//     location.pathname === "/bookings"
//       ? "bg-white text-blue-500 shadow-custom-all-sides"
//       : "text-gray-600"
//   }`}
// >
//   Workspace Bookings
// </Link>

//            <Link
//   to="/bookings/calendar"
//   className={`p-2 rounded-md ${
//     location.pathname === "/bookings/calendar"
//       ? "bg-white shadow"
//       : ""
//   }`}
// >
//   <FaCalendarAlt size={16} />
// </Link>
//        </div>
//         </div>
//         {/* {page === "meetingBooking" && ( */}
//           <div>
//             <div className="flex gap-2 items-center">
//               <input
//                 type="text"
//                 placeholder="Search By Facility"
//                 className="border p-2 w-full border-gray-300 rounded-lg"
//                 value={searchText}
//                 onChange={handleSearch}
//               />
//               <div className="flex gap-2 justify-end">
//                 <Link
//                   to={"/bookings/new-facility-booking"}
//                   style={{ background: themeColor }}
//                   className="bg-blue-700 w-20 rounded-lg flex font-semibold items-center gap-2 text-white p-2 my-2"
//                 >
//                   <IoAddCircleOutline size={20} />
//                   Book
//                 </Link>
//                 <button
//                   style={{ background: themeColor }}
//                   onClick={() => showModal(true)}
//                   className="bg-blue-700 rounded-lg flex font-semibold items-center gap-2 text-white p-2 my-2"
//                 >
//                   <BiExport size={20} />
//                   Export
//                 </button>
//               </div>
//             </div>

//             <div className="flex min-h-screen">
//               {loading ? (
//                 <p className="text-center">Loading bookings...</p>
//               ) : error ? (
//                 <p className="text-center text-red-500">{error}</p>
//               ) : (
//                 <div className="w-full">
//                   <Table columns={columns} data={sortedData} />
//                 </div>
//               )}
//             </div>
//             {modal && <ExportBookingModal onclose={() => showModal(false)} />}
//           </div>
        

//         {/* {page === "seatBooking" && ( */}
//           {/* <div>
//             <SeatBooking />
//           </div> */}
//         {/* )} */}
//       </div>
//     </section>
//   );
// };

// export default Booking;






// import React, { useState, useEffect } from "react";
// import DataTable from "react-data-table-component";
// import { IoAddCircleOutline } from "react-icons/io5";
// import Navbar from "../components/Navbar";
// import { BiEdit, BiExport } from "react-icons/bi";
// import ExportBookingModal from "../containers/modals/ExportBookingsModal";
// import { Link, useLocation } from "react-router-dom";
// import SeatBooking from "./SubPages/SeatBooking";
// import Table from "../components/table/Table";
// import { useSelector } from "react-redux";
// import { BsEye } from "react-icons/bs";
// import { getAmenitiesBooking, getFacitilitySetup } from "../api";
// import { FaCalendarAlt } from "react-icons/fa";



// const Booking = () => {
//   const [searchText, setSearchText] = useState("");
//   const [modal, showModal] = useState(false);
//   // const [page, setPage] = useState("meetingBooking");
//   const [bookings, setBookings] = useState([]); 
//   const [loading, setLoading] = useState(false); 
//   const [error, setError] = useState(null); 
//   const [bookingFacility, setBookingFacility] = useState([]);
//   const [page, setPage] = useState(1);
//   const [perPage] = useState(10);
//   const [totalRows, setTotalRows] = useState(0);
//   const themeColor = "rgb(3, 19 37)";

//   useEffect(() => {
//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       const response = await getAmenitiesBooking(page, perPage, 47);

//       console.log("Amenity Booking API:", response.data);

//       setBookings(response.data.amenity_bookings || []);
//       setTotalRows(response.data.total_count || 0);

//       const facilityResponse = await getFacitilitySetup();
//       setBookingFacility(facilityResponse?.data?.amenities || []);

//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError(`Failed to fetch data: ${error.message || error}`);
//       setLoading(false);
//     }
//   };

//   fetchData();
// }, [page]);

//   const combinedData = bookings.map((booking) => {
//     const facility = bookingFacility.find(
//       (fac) => fac.id === booking.amenity_id
//     );

//     // Find the relevant slot from amenity slots
//     const amenitySlots = facility?.amenity_slots || [];
//     const slot = amenitySlots.find((s) => s.id === booking.amenity_slot_id);

//     // Format the slot time if found
//     const slotTime = slot
//       ? `${String(slot.start_hr || 0).padStart(2, "0")}:${String(
//           slot.start_min || 0
//         ).padStart(2, "0")} - ${String(slot.end_hr || 0).padStart(
//           2,
//           "0"
//         )}:${String(slot.end_min || 0).padStart(2, "0")}`
//       : "N/A";

//     return {
//       ...booking,
//       fac_name: facility?.fac_name || "N/A",
//       fac_type: facility?.fac_type || "N/A",
//       description: facility?.description || "N/A",
//       terms: facility?.terms || "N/A",
//       slot_time: slotTime, // Add formatted slot time
//     };
//   });

//   // Sort combinedData by ID in descending order
//   const sortedData = combinedData.sort((a, b) => b.id - a.id);

//   // Handle Search
//   const handleSearch = (event) => {
//     const searchValue = event.target.value;
//     setSearchText(searchValue);

//     const filteredResults = sortedData.filter((item) =>
//       item.fac_name.toLowerCase().includes(searchValue.toLowerCase())
//     );
//     setBookings(filteredResults);
//   };

//   // Columns for DataTable
//   const columns = [
//     {
//       name: "Action",
//       cell: (row) => (
//         <div className="flex item-center gap-2">
//           <Link to={`/bookings/booking-details/${row.id}`}>
//             <BsEye />
//           </Link>
//           {/* <Link to={`bookings/edit_bookings/${row.id}`}>
//         <BiEdit size={15} />
//       </Link> */}
//         </div>
//       ),
//       sortable: false,
//     },
//     { name: "ID", selector: (row) => row.id, sortable: true },
//     // {
//     //   name: "Facility ID",
//     //   selector: (row) => row.amenity_id,
//     //   sortable: true,
//     // },
//     {
//       name: "Facility Name",
//       selector: (row) => row.fac_name,
//       sortable: true,
//     },
//     {
//       name: "Facility Type",
//       selector: (row) => row.fac_type,
//       sortable: true,
//     },
//     {
//       name: "Total Amount",
//       selector: (row) => row.amount || "NA",
//       sortable: true,
//     },
//     {
//       name: "Paymnet Status",
//       selector: (row) => row.status || "NA",
//       sortable: true,
//     },
//     {
//       name: "Paymnet Method",
//       selector: (row) => row?.payment?.payment_method || "NA",
//       sortable: true,
//     },
//     {
//       name: "Booked By",
//       selector: (row) => {
//         console.log("row", row.book_by_user);
//         return row?.book_by_user || "User Not Set!";
//       },
//       sortable: true,
//     },
//     {
//       name: "Booked On",
//       selector: (row) => {
//         const date = new Date(row.created_at);
//         const yy = date.getFullYear().toString(); // Get last 2 digits of the year
//         const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
//         const dd = String(date.getDate()).padStart(2, "0");
//         return `${dd}/${mm}/${yy}`;
//       },
//       sortable: true,
//     },
//     {
//       name: "Scheduled On",
//       selector: (row) => {
//         const date = new Date(row.booking_date);
//         const yy = date.getFullYear().toString(); // Get last 2 digits of the year
//         const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
//         const dd = String(date.getDate()).padStart(2, "0");
//         return `${dd}/${mm}/${yy}`;
//       },
//       sortable: true,
//     },
//     {
//       name: "Scheduled Time",
//       selector: (row) => row.slot_time || "N/A",
//       sortable: true,
//     },
//     {
//       name: "Description",
//       selector: (row) => row.description,
//       sortable: true,
//     },
//     {
//       name: "Terms",
//       selector: (row) => row.terms,
//       sortable: true,
//     },
//     {
//       name: "Booking Status",
//       selector: (row) => row.status || "N/A",
//       sortable: true,
//     },
//   ];

//   return (
//     <section className="flex">
//       <Navbar />
//       <div className="w-full flex m-3 flex-col overflow-hidden">
//         <div className="flex justify-center">
//           <div className="sm:flex grid grid-cols-2 sm:flex-row gap-5 font-medium p-2 sm:rounded-full rounded-md opacity-90 bg-gray-200">
//           <Link
//   to="/bookings"
//   className={`p-1 rounded-full px-4 transition-all duration-300 ${
//     location.pathname === "/bookings"
//       ? "bg-white text-blue-500 shadow-custom-all-sides"
//       : "text-gray-600"
//   }`}
// >
//   Workspace Bookings
// </Link>

//            <Link
//   to="/bookings/calendar"
//   className={`p-2 rounded-md ${
//     location.pathname === "/bookings/calendar"
//       ? "bg-white shadow"
//       : ""
//   }`}
// >
//   <FaCalendarAlt size={16} />
// </Link>
//        </div>
//         </div>
//         {/* {page === "meetingBooking" && ( */}
//           <div>
//             <div className="flex gap-2 items-center">
//               <input
//                 type="text"
//                 placeholder="Search By Facility"
//                 className="border p-2 w-full border-gray-300 rounded-lg"
//                 value={searchText}
//                 onChange={handleSearch}
//               />
//               <div className="flex gap-2 justify-end">
//                 <Link
//                   to={"/bookings/new-facility-booking"}
//                   style={{ background: themeColor }}
//                   className="bg-blue-700 w-20 rounded-lg flex font-semibold items-center gap-2 text-white p-2 my-2"
//                 >
//                   <IoAddCircleOutline size={20} />
//                   Book
//                 </Link>
//                 <button
//                   style={{ background: themeColor }}
//                   onClick={() => showModal(true)}
//                   className="bg-blue-700 rounded-lg flex font-semibold items-center gap-2 text-white p-2 my-2"
//                 >
//                   <BiExport size={20} />
//                   Export
//                 </button>
//               </div>
//             </div>

//             <div className="flex min-h-screen">
//               {loading ? (
//                 <p className="text-center">Loading bookings...</p>
//               ) : error ? (
//                 <p className="text-center text-red-500">{error}</p>
//               ) : (
//                 <div className="w-full">
//   <Table
//     columns={columns}
//    data={sortedData.filter((item) =>
//   item.fac_name?.toLowerCase().includes(searchText.toLowerCase())
// )}
//     pagination
//     paginationServer
//    paginationTotalRows={totalRows}
//     paginationPerPage={perPage}
//     onChangePage={(newPage) => setPage(newPage)}
//   />
// </div>
//               )}
//             </div>
//             {modal && <ExportBookingModal onclose={() => showModal(false)} />}
//           </div>
        

//         {/* {page === "seatBooking" && ( */}
//           {/* <div>
//             <SeatBooking />
//           </div> */}
//         {/* )} */}
//       </div>
//     </section>
//   );
// };

// export default Booking;




import React, { useEffect, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import Navbar from "../components/Navbar";
import { BiExport } from "react-icons/bi";
import ExportBookingModal from "../containers/modals/ExportBookingsModal";
import { Link, useLocation } from "react-router-dom";
import Table from "../components/table/Table";
import { BsEye } from "react-icons/bs";
import { getAmenitiesBooking, getFacitilitySetup } from "../api";
import { FaCalendarAlt } from "react-icons/fa";

const Booking = () => {
  const location = useLocation();
  const [searchText, setSearchText] = useState("");
  const [modal, showModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingFacility, setBookingFacility] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const themeColor = "rgb(3, 19 37)";

  // Fetch bookings and facility setup from API
  const loadBookings = async (pageNumber = page, search = searchText) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAmenitiesBooking(pageNumber, perPage, 47, search);
       console.log("Page:", pageNumber);
      console.log("Fetching page:", pageNumber);
      console.log("Response:", response.data);
      
      setBookings(response.data.amenity_bookings || []);
      setTotalRows(response.data.total_count || 0);

      const facilityResponse = await getFacitilitySetup();
      setBookingFacility(facilityResponse?.data?.amenities || []);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(`Failed to fetch data: ${err.message || err}`);
      setLoading(false);
    }
  };

  // Fetch bookings whenever page or search changes
  useEffect(() => {
    loadBookings(page, searchText);
  }, [page, searchText]);

  // Combine booking data with facility info
  const combinedData = bookings.map((booking) => {
    const facility = bookingFacility.find((fac) => fac.id === booking.amenity_id);
    const amenitySlots = facility?.amenity_slots || [];
    const slot = amenitySlots.find((s) => s.id === booking.amenity_slot_id);

    const slotTime = slot
      ? `${String(slot.start_hr || 0).padStart(2, "0")}:${String(slot.start_min || 0).padStart(2, "0")} - ${String(slot.end_hr || 0).padStart(2, "0")}:${String(slot.end_min || 0).padStart(2, "0")}`
      : "N/A";

    return {
      ...booking,
      fac_name: facility?.fac_name || "N/A",
      fac_type: facility?.fac_type || "N/A",
      description: facility?.description || "N/A",
      terms: facility?.terms || "N/A",
      slot_time: slotTime,
    };
  });

  // Handle search input
  const handleSearch = (event) => {
    setSearchText(event.target.value);
    setPage(1); // Reset page to 1 on search
  };

  // Table columns
  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex item-center gap-2">
          <Link to={`/bookings/booking-details/${row.id}`}>
            <BsEye />
          </Link>
        </div>
      ),
      sortable: false,
    },
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Facility Name", selector: (row) => row.fac_name, sortable: true },
    { name: "Facility Type", selector: (row) => row.fac_type, sortable: true },
    { name: "Total Amount", selector: (row) => row.amount || "NA", sortable: true },
    { name: "Payment Status", selector: (row) => row.status || "NA", sortable: true },
    { name: "Payment Method", selector: (row) => row?.payment?.payment_method || "NA", sortable: true },
    { name: "Booked By", selector: (row) => row?.book_by_user || "User Not Set!", sortable: true },
    {
      name: "Booked On",
      selector: (row) => {
        const date = new Date(row.created_at);
        return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
      },
      sortable: true,
    },
    {
      name: "Scheduled On",
      selector: (row) => {
        const date = new Date(row.booking_date);
        return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
      },
      sortable: true,
    },
    { name: "Scheduled Time", selector: (row) => row.slot_time || "N/A", sortable: true },
    { name: "Description", selector: (row) => row.description, sortable: true },
    { name: "Terms", selector: (row) => row.terms, sortable: true },
    { name: "Booking Status", selector: (row) => row.status || "N/A", sortable: true },
  ];

  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex m-3 flex-col overflow-hidden">
        <div className="flex justify-center">
          <div className="sm:flex grid grid-cols-2 sm:flex-row gap-5 font-medium p-2 sm:rounded-full rounded-md opacity-90 bg-gray-200">
            <Link
              to="/bookings"
              className={`p-1 rounded-full px-4 transition-all duration-300 ${
                location.pathname === "/bookings" ? "bg-white text-blue-500 shadow-custom-all-sides" : "text-gray-600"
              }`}
            >
              Workspace Bookings
            </Link>
            <Link
              to="/bookings/calendar"
              className={`p-2 rounded-md ${location.pathname === "/bookings/calendar" ? "bg-white shadow" : ""}`}
            >
              <FaCalendarAlt size={16} />
            </Link>
          </div>
        </div>

        <div>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Search By Facility"
              className="border p-2 w-full border-gray-300 rounded-lg"
              value={searchText}
              onChange={handleSearch}
            />
            <div className="flex gap-2 justify-end">
              <Link
                to={"/bookings/new-facility-booking"}
                style={{ background: themeColor }}
                className="bg-blue-700 w-20 rounded-lg flex font-semibold items-center gap-2 text-white p-2 my-2"
              >
                <IoAddCircleOutline size={20} />
                Book
              </Link>
              <button
                style={{ background: themeColor }}
                onClick={() => showModal(true)}
                className="bg-blue-700 rounded-lg flex font-semibold items-center gap-2 text-white p-2 my-2"
              >
                <BiExport size={20} />
                Export
              </button>
            </div>
          </div>

          <div className="flex min-h-screen">
            {loading ? (
              <p className="text-center">Loading bookings...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <div className="w-full">
                <Table
                  columns={columns}
                  data={combinedData}
                  pagination
                  paginationServer
                  paginationTotalRows={totalRows}
                  paginationPerPage={perPage}
                  onChangePage={(newPage) => setPage(newPage)}
                />
              </div>
            )}
          </div>
          {modal && <ExportBookingModal onclose={() => showModal(false)} />}
        </div>
      </div>
    </section>
  );
};

export default Booking;