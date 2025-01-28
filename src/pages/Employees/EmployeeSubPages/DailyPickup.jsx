import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { BsEye } from "react-icons/bs";
import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";
import Table from "../../../components/table/Table";
import { useSelector } from "react-redux";
import { getTransportation } from "../../../api";
import { formatTime } from "../../../utils/dateUtils";

const DailyPickup = () => {
  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/employees/pickup-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
        </div>
      ),
    },
    {
      name: "Booking ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Pickup Location",
      selector: (row) => row.pickup_location,
      sortable: true,
    },
    {
      name: "Drop-off Location",
      selector: (row) => row.dropoff_location,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "Pickup Time",
      selector: (row) => formatTime(row.time),
      sortable: true,
    },
    {
      name: "Passengers",
      selector: (row) => row.no_of_passengers,
      sortable: true,
    },

    {
      name: "Status",
      selector: (row) => (row.approval === "Approved" ? row.status : ""),
      sortable: true,
    },
    {
      name: "Cancellation",
      selector: (row) =>
        row.approval === "Approved" && row.status === "Upcoming" ? (
          <button className="text-red-400 font-medium">Cancel</button>
        ) : (
          ""
        ),
      sortable: true,
    },
  ];

  const [pickupData, setPickup] = useState([]);
  const [filteredData, setSetFilteredData] = useState([]);
  const fetchTransportationRequests = async () => {
    try {
      const res = await getTransportation("Daily_Pickup");
      setPickup(res.data);
      setSetFilteredData(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchTransportationRequests();
  }, []);

  // const handleSearch = (e) => {
  //     const searchValue = e.target.value;
  //     setSearchText(searchValue);

  //     if (searchValue.trim() === "") {
  //       // If search input is empty, reset to show all data
  //       setFilteredData(complaints);
  //     } else {
  //       // Filter the data based on search input and selected status
  //       const filteredResults = complaints.filter(
  //         (item) =>
  //           ((selectedStatus === "all" ||
  //             item.issue_status.toLowerCase() === selectedStatus.toLowerCase()) &&
  //             (item.ticket_number
  //               .toLowerCase()
  //               .includes(searchValue.toLowerCase()) ||
  //               item.category_type
  //                 .toLowerCase()
  //                 .includes(searchValue.toLowerCase()))) ||
  //           item.issue_type.toLowerCase().includes(searchValue.toLowerCase()) ||
  //           item.heading.toLowerCase().includes(searchValue.toLowerCase()) ||
  //           item.priority.toLowerCase().includes(searchValue.toLowerCase()) ||
  //           (item.unit && item.unit.toLowerCase().includes(searchValue.toLowerCase()))
  //         // ||
  //         // item.assigned_to.toLowerCase().includes(searchValue.toLowerCase())
  //       );
  //       setFilteredData(filteredResults);
  //     }
  //   };
  const themeColor = useSelector((state) => state.theme.color);

  return (
    <section className="my-5">
      <div className="flex justify-between gap-2 my-2">
        <input
          type="text"
          placeholder="Search by Pick up location or Drop Off location"
          className="border border-gray-400 w-96 placeholder:text-xs rounded-lg p-2"
          //   value={searchText}
          //   onChange={handleSearch}
        />
        <Link
          to={"/employees/transportation/book-pickup"}
          className="rounded-md p-2 flex items-center gap-2 text-white font-medium"
          style={{ background: themeColor }}
        >
          <PiPlusCircle size={20} />
          Book
        </Link>
      </div>
      <Table
        responsive
        // selectableRows
        columns={columns}
        data={filteredData}
        // customStyles={customStyle}
        // pagination
        // fixedHeader
        // // fixedHeaderScrollHeight="420px"
        // selectableRowsHighlight
        // highlightOnHover
      />
    </section>
  );
};

export default DailyPickup;
