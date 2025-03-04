import React, { useEffect, useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BsEye } from "react-icons/bs";
import toast from "react-hot-toast";
import Table from "../components/table/Table";
import { getBookParking } from "../api";
import { dateFormat, formatTime } from "../utils/dateUtils";

const Parkings = () => {
  const [bookingdata, setBookingData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Stats for allotment and vacancy (kept separate)
  const [stats, setStats] = useState({
    total_allotted_slots: 0,
    total_vacant_slots: 0,
  });

  // New state to count vehicle types
  const [vehicleCounts, setVehicleCounts] = useState({
    total_2_wheeler: 0,
    total_4_wheeler: 0,
  });

  // console.log(siteId)

  const fetchingbookingData = async () => {
    try {
      const res = await getBookParking();
      const bookingReqData = res.data.map((item) => ({
        id: item.id,
        parking_id: item.parking_id,
        name: item.user_name,
        status: item.status,
        booked_by: item.created_by,
        booking_date:item.booking_date,
        parking_name: item.parking_name,
        vehicle_type: item.vehicle_type,
        slot_id: item.slot_id,
        created_at: item.created_at,
        total_allotted_slots: item.total_allotted_slots || 0,
        total_vacant_slots: item.total_vacant_slots || 0,
      }));
       console.log(bookingReqData)
      setBookingData(bookingReqData);
      setFilteredData(bookingReqData);

      if (bookingReqData.length > 0) {
        // Assume all records have same allotment/vacancy values;
        // take from first record.
        setStats({
          total_allotted_slots: bookingReqData[0].total_allotted_slots,
          total_vacant_slots: bookingReqData[0].total_vacant_slots,
        });

        // Compute vehicle counts by iterating over bookingReqData
        let count2 = 0;
        let count4 = 0;
        bookingReqData.forEach((item) => {
          if (
            item.vehicle_type &&
            item.vehicle_type.toLowerCase() === "2-wheeler"
          ) {
            count2++;
          } else if (
            item.vehicle_type &&
            item.vehicle_type.toLowerCase() === "4-wheeler"
          ) {
            count4++;
          }
        });
        setVehicleCounts({
          total_2_wheeler: count2,
          total_4_wheeler: count4,
        });
      }
    } catch (error) {
      console.error("Error fetching booking request data:", error);
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchingbookingData();
  }, []);

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchText(searchValue);
    const filteredResults = bookingdata.filter(
      (item) =>
        item.parking_name.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredData(filteredResults);
  };

  const columns = [
    {
      name: "view",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/parking-details/${row.parking_id}`}>
            <BsEye size={15} />
          </Link>
        </div>
      ),
    },
    { name: "Booked For", selector: (row) => row.name, sortable: true },
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
    { name: "Parking Slot", selector: (row) => row.slot_id, sortable: true },
    {
      name: "Created Date",
      selector: (row) => row.booking_date,

      sortable: true,
    },
    {
      name: "Created Time",
      selector: (row) => formatTime(row.created_at),
      sortable: true,
    },
  ];

  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex m-3 flex-col overflow-hidden">
        {/* Stats Display */}
        <div className="flex justify-start gap-4 my-2">
          <div className="shadow-xl rounded-full border-4 border-gray-400 w-52 px-6 flex flex-col items-center">
            <p className="font-semibold">Total Allotted Slots</p>
            <p className="text-center font-semibold">
              {bookingdata.length > 0
                ? stats.total_allotted_slots
                : "loading..."}
            </p>
          </div>
          <div className="shadow-xl rounded-full border-4 border-green-400 w-52 px-6 flex flex-col items-center">
            <p className="font-semibold">Four Wheelers</p>
            <p className="text-center font-semibold">
              {bookingdata.length > 0
                ? vehicleCounts.total_4_wheeler
                : "loading..."}
            </p>
          </div>
          <div className="shadow-xl rounded-full border-4 border-red-400 w-52 px-6 flex flex-col items-center">
            <p className="font-semibold">2 Wheelers</p>
            <p className="text-center font-semibold">
              {bookingdata.length > 0
                ? vehicleCounts.total_2_wheeler
                : "loading..."}
            </p>
          </div>
          <div className="shadow-xl rounded-full border-4 border-orange-400 w-52 px-6 flex flex-col items-center">
            <p className="font-semibold">Vacant Slot</p>
            <p className="text-center font-semibold">
              {bookingdata.length > 0 ? stats.total_vacant_slots : "loading..."}
            </p>
          </div>
        </div>

        {/* Search Input & Book Link */}
        <div className="flex justify-between my-5">
          <input
            type="text"
            placeholder="Search by parking number"
            className="border border-gray-400 w-96 placeholder:text-sm rounded-lg p-2"
            value={searchText}
            onChange={handleSearch}
          />
          <Link
            to={"/admin/book-parking"}
            className="border-2 font-semibold hover:bg-black hover:text-white duration-150 transition-all border-black p-2 rounded-md text-black cursor-pointer text-center flex items-center gap-2 justify-center"
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
