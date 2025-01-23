import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BsEye } from "react-icons/bs";
import Table from "../components/table/Table";
import { getBookParking } from "../api";

const Parkings = () => {
  const [filteredData, setFilteredData] = useState([]);
   useEffect(() => {
      const fetchPantry = async () => {
       try {
         const invResp = await getBookParking();
         const sortedInvData = invResp.data.sort((a, b) => {
           
          return new Date(b.created_at) - new Date(a.created_at);
        });
         
         setFilteredData(sortedInvData)
         console.log(invResp);
       } catch (error) {
        console.log(error)
       }
      };
      fetchPantry();
    }, []);
    const formatDate = (dateString) => {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        // second: "2-digit",
        hour12: true, // Use 12-hour format
      };
      return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
    };
  const columns = [
    {
      name: "view",

      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/parking-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
        </div>
      ),
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Parking Number",
      selector: (row) => row.parking_name,
      sortable: true,
    },
    
    {
      name: "Parking Type",
      selector: (row) => row.vehicle_type,
      sortable: true,
    },
    {
      name: "Parking Slot",
      selector: (row) => row.vehicle_type,
      sortable: true,
    },
    
    // {
    //   name: "From",
    //   selector: (row) => new Date(row.booking_start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    //   sortable: true,
    // },
    // {
    //   name: "To",
    //   selector: (row) => new Date(row.booking_end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    //   sortable: true,
    // },
    
    {
      name: "Status",
      selector: (row) => (row.status ? "Booked" : "Not Booked"),
      sortable: true,
    },
    {
      name: "Booked by",
      selector: (row) => row.booked_by,
      sortable: true,
    },
    {
      name: "Created On",
      selector: (row) => formatDate(row.created_at),
      sortable: true,
    },
    
    // {
    //   name: "Action",
    //   selector: (row) =>
    //     row.status !== "Expired" && (
    //       <button className="text-red-500">Cancel</button>
    //     ),
    //   sortable: true,
    // },
  ];

  const data = [
    {
      booked_by: "person 1",
      level: 1,
      from: "09:30 AM",
      to: "11:30 AM",
      status: "Upcoming",
    },
    {
      booked_by: "person 2",
      level: 2,
      from: "09:30 AM",
      to: "11:30 AM",
      status: "Expired",
    },
  ];
  return (
    <section className="flex">
      <Navbar />
      <div className=" w-full flex m-3 flex-col overflow-hidden">
        <div className="flex  justify-start gap-4 my-2  ">
          <div className="shadow-xl rounded-full border-4 border-gray-400 w-52  px-6 flex flex-col items-center">
            <p className="font-semibold ">Total Alloted Slots</p>
            <p className="text-center font-semibold ">0</p>
          </div>
          <div className="shadow-xl rounded-full border-4 border-green-400 w-52  px-6 flex flex-col items-center">
            <p className="font-semibold">Four Wheelers</p>
            <p className="text-center font-semibold  ">0</p>
          </div>
          <div className="shadow-xl rounded-full border-4 border-red-400 w-52  px-6 flex flex-col items-center">
            <p className="font-semibold">2 Wheelers</p>
            <p className="text-center font-semibold ">0</p>
          </div>

          <div className="shadow-xl rounded-full border-4 border-orange-400 w-52  px-6 flex flex-col items-center">
            <p className="font-semibold">Vacant Slot</p>
            <p className="text-center font-semibold ">0</p>
          </div>
        </div>
        <div className=" flex justify-between my-5">
          <input
            type="text"
            placeholder="Search by name "
            className="border border-gray-400 w-96 placeholder:text-sm rounded-lg p-2"
            //   value={searchText}
            //   onChange={handleSearch}
          />
          <Link
            to={"/admin/book-parking"}
            className="border-2 font-semibold hover:bg-black hover:text-white duration-150 transition-all border-black p-2 rounded-md text-black cursor-pointer text-center flex items-center  gap-2 justify-center"
          >
            <PiPlusCircle size={20} />
            Book
          </Link>
        </div>
        <Table columns={columns} data={filteredData} isPagination={true} />
      </div>
    </section>
  );
};

export default Parkings;
