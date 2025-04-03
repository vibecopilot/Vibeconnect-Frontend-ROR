import React, { useEffect, useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Table from "../../../components/table/Table";
import { useSelector } from "react-redux";
import { BsEye } from "react-icons/bs";
import Navbar from "../../../components/Navbar";
import {
  getFlightTicketRequest,
  getFilterFlightTicketRequest,
} from "../../../api";

const EmployeeFlightRequest = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const themeColor = useSelector((state) => state.theme.color);
  const [FlightrequestsData, setFlightrequestsData] = useState([]);
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

  useEffect(() => {
    const fetchFlightRequest = async () => {
      try {
        let flightreqresp;
        if (selectedStatus === "all") {
          const response = await getFlightTicketRequest();
          flightreqresp = response.data;
        } else {
          const response = await getFilterFlightTicketRequest(approved);
          flightreqresp = response.data;
        }

        // Sorting flightreqresp by created_at in descending order
        flightreqresp = flightreqresp.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        console.log("response from API", flightreqresp);

        // Assuming you want to set the sorted flight request data
        setFlightrequestsData(flightreqresp);
      } catch (err) {
        console.error("Failed to fetch flight request data:", err);
      }
    };

    fetchFlightRequest();
  }, [selectedStatus, approved]);

  //  useEffect(() => {
  //     const fetchFlightRequest = async () => {
  //       try {
  //         const response = await getFlightTicketRequest();
  //         const flightreqresp = response.data.sort((a, b) => {
  //           return new Date(b.created_at) - new Date(a.created_at);
  //         });
  //         console.log("response from api", flightreqresp);

  //         setFlightrequestsData(flightreqresp);
  //       } catch (err) {
  //         console.error("Failed to fetch flight request data:", err);
  //       }
  //     };

  //     fetchFlightRequest(); // Call the API
  //   }, []);
  // Dummy data for demonstration
  // const data = [
  //   {
  //     id: 1,
  //     Id: "55",
  //     name: "Mi",
  //     Departure_City: "Mumbai",
  //     Arrival_City: "abc",
  //     Departure: "15/02/2024",
  //     Checkout: "15/02/2024",
  //     Preferred: "Airline",
  //     Ticket_number: "89",
  //     booking_email: "jkl",
  //     Class: "Economy",
  //     Passenger_Name: "abc",
  //     Passport_Information: "ab",
  //     Manager_Approval: "Upcoming",
  //     status: "pending",
  //   },
  //   // Add more data entries as needed
  // ];

  // Handle status change function
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    // Implement logic to filter data based on status
  };

  // Define columns for the table
  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/employee/flight-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
        </div>
      ),
    },

    {
      name: "Departure City",
      selector: (row) => row.departure_city,
      sortable: true,
    },
    {
      name: "Arrival City",
      selector: (row) => row.arrival_city,
      sortable: true,
    },
    {
      name: "Departure Date",
      selector: (row) => row.departure_date,
      sortable: true,
    },
    {
      name: "Return Date",
      selector: (row) => row.return_date,
      sortable: true,
    },
    {
      name: "Preferred Airline",
      selector: (row) => row.preferred_airlines,
      sortable: true,
    },
    {
      name: "Class",
      selector: (row) => row.flight_class,
      sortable: true,
    },
    // {
    //   name: "Booking Status",
    //   selector: (row) => row.status,
    //   sortable: true,
    // },
    {
      name: "Additional Passengers",
      selector: (row) =>
        row.additional_passengers
          ?.map((passenger) => passenger.name)
          .join(", ") || "No Passengers",
      sortable: false, // Sorting might not be straightforward for multiple names
    },
    {
      name: "Passport Information",
      selector: (row) => row.passport_information,
      sortable: true,
    },
    {
      name: "Cancellation",
      cell: (row) =>
        row.booking_status === "false" && (
          <button className="text-red-400 font-medium">Cancel</button>
        ),
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
        <div className="flex justify-center w-full my-2">
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
              Traveling Allowance Request
            </CustomNavLink>
          </div>
        </div>
        <div className="w-full flex mx-3 flex-col overflow-hidden">
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
            <span className="mr-4">
              <Link
                to="/employee/add-flight-request"
                className="border-2 font-semibold hover:bg-black hover:text-white transition-all border-black p-2 rounded-md text-black cursor-pointer text-center flex items-center gap-2 justify-center"
                style={{ height: "1cm" }}
              >
                <PiPlusCircle size={20} />
                Add
              </Link>
            </span>
          </div>
          <div className="w-full">
            <Table columns={columns} data={FlightrequestsData} />
          </div>
        </div>{" "}
      </div>
    </section>
  );
};

export default EmployeeFlightRequest;
