import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BsEye } from "react-icons/bs";
import { BiTrash, BiEdit } from "react-icons/bi";
import toast from "react-hot-toast";

import Table from "../components/table/Table";
import { deleteBookParking, getBookParking } from "../api";
import { dateFormat, formatTime } from "../utils/dateUtils";

const Parkings = () => {
  // const [filteredData, setFilteredData] = useState([]);
  const [bookingdata, setBookingData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const fetchingbookingData = async () => {
    try {
      const res = await getBookParking();
      const bookingReqData = res.data.map((item) => ({
        id: item.id,
        parking_id: item.parking_id,
        name: item.user_name,
        status: item.status,
        booked_by: item.created_by,
        parking_name: item.parking_name,
        vehicle_type: item.vehicle_type,
        slot_id: item.slot_id,
        created_at: item.created_at,
      }));
      setBookingData(bookingReqData);
    } catch (error) {
      console.log("Error fetching booking request data:", error);
    }
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchText(searchValue);
    console.log(searchText);
    const filteredResults = bookingdata.filter((item) =>
      item.parking_name.toLowerCase().includes(searchValue)
    );
    setFilteredData(filteredResults);
  };

  const handleRemovePackage = async (parking_id) => {
    try {
      const deleteRec = await deleteBookParking(parking_id);
      console.log(deleteRec);
      toast.success("Package deleted successfully");
      fetchingbookingData(); // Refresh the data after deletion
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Failed to delete the package");
    }
  };
  useEffect(() => {
    fetchingbookingData();
  }, []);

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
      name: "Booked For",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Booked by",
      selector: (row) => row.booked_by,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (row.status ? "Booked" : "Not Booked"),
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
      selector: (row) => row.slot_id,
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
      name: "Created Date",
      selector: (row) => dateFormat(row.created_at),
      sortable: true,
    },
    {
      name: "Created Time",
      selector: (row) => formatTime(row.created_at),
      sortable: true,
    },
    {
      name: "Reject Request",
      cell: (row) => (
        <button onClick={() => handleRemovePackage(row.parking_id)}>
          <BiTrash />
        </button>
      ),
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
            placeholder="Search by parking number "
            className="border border-gray-400 w-96 placeholder:text-sm rounded-lg p-2"
            //   value={searchText}
            //   onChange={handleSearch}
            value={searchText}
            onChange={handleSearch}
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
