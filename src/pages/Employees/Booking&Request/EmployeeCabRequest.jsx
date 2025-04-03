import React, { useEffect, useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Table from "../../../components/table/Table";
import { useSelector } from "react-redux";
import { BsEye } from "react-icons/bs";
import Navbar from "../../../components/Navbar";
import { getcabRequest, getFilterCabRequest } from "../../../api";

const EmployeeCabRequest = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const themeColor = useSelector((state) => state.theme.color);
  const [approved, setApproved] = useState(true);
  const [CabrequestsData, setCabrequestsData] = useState([]);
  useEffect(() => {
    const fetchCabRequest = async () => {
      try {
        let cabreqresp;

        if (selectedStatus === "all") {
          const response = await getcabRequest();
          cabreqresp = response.data;
        } else {
          const response = await getFilterCabRequest(approved); // Use a filter API
          cabreqresp = response.data;
        }

        // Map through the data to add `date` and `time` fields
        cabreqresp = cabreqresp
          .map((request) => {
            let date = "";
            let time = "";

            if (request.date_and_time) {
              const dateTime = new Date(request.date_and_time);
              date = dateTime.toISOString().split("T")[0]; // Extract the date
              time = dateTime.toTimeString().split(" ")[0]; // Extract the time
            }

            return {
              ...request,
              date,
              time,
            };
          })
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort by created_at in descending order

        console.log("response from API", cabreqresp);

        // Update the state with the transformed and sorted data
        setCabrequestsData(cabreqresp);
      } catch (err) {
        console.error("Failed to fetch cab request data:", err);
      }
    };

    fetchCabRequest(); // Trigger the fetch function
  }, [selectedStatus, approved]);

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

  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/employee/cab-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
        </div>
      ),
    },
    {
      name: "Pickup Location",
      selector: (row) => row.pickup_location,
      sortable: true,
    },
    {
      name: "Drop-off Location",
      selector: (row) => row.drop_off_location,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "Time",
      selector: (row) => row.time,
      sortable: true,
    },
    {
      name: "Number of Passengers",
      selector: (row) => row.number_of_passengers,
      sortable: true,
    },
    {
      name: "Transportation Type",
      selector: (row) => row.transportation_type,
      sortable: true,
    },

    {
      name: "Special Requirements",
      selector: (row) => row.special_requirements,
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
                to="/employee/add-cab-request"
                className="border-2 font-semibold hover:bg-black hover:text-white transition-all border-black p-2 rounded-md text-black cursor-pointer text-center flex items-center gap-2 justify-center"
                style={{ height: "1cm" }}
              >
                <PiPlusCircle size={20} />
                Add
              </Link>
            </span>
          </div>
          <div className="w-full flex mx-3 flex-col overflow-hidden">
            <Table
              responsive
              columns={columns}
              data={CabrequestsData}
              pagination
              fixedHeader
              selectableRowsHighlight
              highlightOnHover
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmployeeCabRequest;
