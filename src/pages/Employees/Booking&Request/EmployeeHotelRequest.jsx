import React, { useEffect, useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

import Table from "../../../components/table/Table";
import { useSelector } from "react-redux";
import { BsEye } from "react-icons/bs";
import Navbar from "../../../components/Navbar";
import { getHotelRequest, getFilterHotelRequest } from "../../../api";
const EmployeeHotelRequest = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const themeColor = useSelector((state) => state.theme.color);
  const [HotelrequestsData, setHotelrequestsData] = useState([]);
  const [approved, setApproved] = useState(true);
  const CustomNavLink = ({ to, children }) => {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          `p-1 rounded-full px-4 cursor-pointer text-center transition-all duration-300 ease-linear ${
            isActive && "bg-white text-blue-500 shadow-custom-all-sides"
          }`
        }
      >
        {children}
      </NavLink>
    );
  };

  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        let hotelreqresp;

        if (selectedStatus === "all") {
          // Fetch all requests
          const response = await getHotelRequest();
          hotelreqresp = response.data;
        } else {
          // Fetch filtered requests
          const response = await getFilterHotelRequest(approved);
          hotelreqresp = response.data;
        }

        // Sort the requests by date
        hotelreqresp = hotelreqresp.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        console.log("response from api", hotelreqresp);
        setHotelrequestsData(hotelreqresp);
      } catch (err) {
        console.error("Failed to fetch hotel request data:", err);
      }
    };

    fetchRequests(); // Call the API function
  }, [approved, selectedStatus]);

  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/employee/hotel-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
        </div>
      ),
    },

    {
      name: "Destination",
      selector: (row) => row.destination,
      sortable: true,
    },
    {
      name: "Check-in Date",
      selector: (row) => dateFormat(row.check_in_date),
      sortable: true,
    },
    {
      name: "Check-out Date",
      selector: (row) => dateFormat(row.check_out_date),
      sortable: true,
    },
    {
      name: "Number of Rooms",
      selector: (row) => row.number_of_rooms,
      sortable: true,
    },
    {
      name: "Room Type",
      selector: (row) => row.room_type,
      sortable: true,
    },
    {
      name: "Special Requests:",
      selector: (row) => row.special_requests,
      sortable: true,
    },
    {
      name: "Hotel Preferences",
      selector: (row) => row.hotel_preferences,
      sortable: true,
    },
    {
      name: "Cancellation",
      selector: (row) =>
        row.booking_status === "false" && (
          <button className="text-red-400 font-medium">Cancel</button>
        ),
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => {
        if (row.booking_status === "true") {
          return <span className="text-black">Approved</span>;
        } else if (row.booking_status === "pending") {
          return <span className="text-black">Pending</span>;
        } else if (row.booking_status === "false") {
          return <button className="text-black">Cancel</button>;
        }
      },
      sortable: true,
    },
  ];
  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        {/* Navigation Bar */}
        <div className="flex justify-center my-2">
          <div className="sm:flex grid grid-cols-2 sm:flex-row gap-5 font-medium p-2 sm:rounded-full rounded-md opacity-90 bg-gray-200">
            <CustomNavLink to="/employee/booking-request/hotel-request">
              Hotel Request
            </CustomNavLink>
            <CustomNavLink to="/employee/booking-request/flight-ticket-request">
              Flight Ticket Request
            </CustomNavLink>
            <CustomNavLink to="/employee/booking-request/cab-bus-request">
              Cab/Bus Request
            </CustomNavLink>
            <CustomNavLink to="/employee/booking-request/transportation-request">
              Transportation Request
            </CustomNavLink>
            <CustomNavLink to="/employee/booking-request/traveling-allowance-request">
              {" "}
              Traveling Allowance Request
            </CustomNavLink>
          </div>
        </div>

        {/* Filters and Add Button */}
        <div className="flex md:flex-row flex-col gap-5 justify-between mt-10 my-2">
          <div className="sm:flex grid grid-cols-2 items-center justify-center gap-4 border border-gray-300 rounded-md px-3 p-2 w-auto">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="all"
                name="status"
                checked={selectedStatus === "all"}
                onChange={() => {
                  setSelectedStatus("all");
                }}
              />
              <label htmlFor="all" className="text-sm">
                All
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="Approved"
                name="status"
                checked={selectedStatus === "Approved"}
                onChange={() => {
                  setSelectedStatus("Approved");
                  setApproved(true);
                }}
              />
              <label htmlFor="Approved" className="text-sm">
                Approved
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="pending"
                name="status"
                checked={selectedStatus === "pending"}
                onChange={() => {
                  setSelectedStatus("pending");
                  setApproved("pending");
                }}
              />
              <label htmlFor="pending" className="text-sm">
                Pending
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="Rejected"
                name="status"
                checked={selectedStatus === "Rejected"}
                onChange={() => {
                  setSelectedStatus("Rejected");
                  setApproved(false);
                }}
              />
              <label htmlFor="Rejected" className="text-sm">
                Rejected
              </label>
            </div>
          </div>
          <span className="flex gap-4">
            <Link
              to={"/employee/booking-request/add-hotel-request"}
              className="border-2 font-semibold hover:bg-black hover:text-white transition-all border-black p-2 rounded-md text-black cursor-pointer text-center flex items-center gap-2 justify-center"
              style={{ height: "1cm" }}
            >
              <PiPlusCircle size={20} />
              Add
            </Link>
          </span>
        </div>

        {/* Table Component */}
        <Table
          responsive
          columns={columns}
          data={HotelrequestsData}
          //   customStyles={customStyle}
          pagination
          fixedHeader
          selectableRowsHighlight
          highlightOnHover
        />
      </div>
    </section>
  );
};

export default EmployeeHotelRequest;
