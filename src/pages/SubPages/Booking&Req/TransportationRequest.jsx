import React, { useState, useEffect } from "react";
import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Table from "../../../components/table/Table";
import { useSelector } from "react-redux";
import { BsEye } from "react-icons/bs";
import Navbar from "../../../components/Navbar";
import { BiEdit } from "react-icons/bi";
import { TiTick } from "react-icons/ti";
import { IoAddCircleOutline, IoClose } from "react-icons/io5";
import {
  gettransportRequest,
  getFilterTransportRequest,
  transportationApproval,
} from "../../../api";
import BookingRequestNav from "./BookingRequestnav";

const TransportationRequest = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [TransportrequestsData, setTransportrequestsData] = useState([]);
  const [approved, setApproved] = useState(true);
  const themeColor = useSelector((state) => state.theme.color);
  useEffect(() => {
    const fetchTransportRequest = async () => {
      try {
        let transportreqresp;

        if (selectedStatus === "all") {
          const response = await gettransportRequest();
          transportreqresp = response.data;
        } else {
          const response = await getFilterTransportRequest(approved); // Use a filter API
          transportreqresp = response.data;
        }

        const processedData = transportreqresp
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

        console.log("response from API:", processedData);

        setTransportrequestsData(processedData);
      } catch (err) {
        console.error("Failed to fetch Transport request data:", err);
      }
    };

    fetchTransportRequest();
  }, [selectedStatus, approved]);

  const handleApproval = async (id, decision) => {
    const approveData = new FormData();
    approveData.append("transport_request[booking_status]", decision);
    try {
      const res = await transportationApproval(id, approveData);
      console.log(approveData);
      setApproved((prev) => !prev);
      if (decision === true) {
        toast.success("Booking successfully");
      } else {
        toast.success("Approval denied");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const CustomNavLink = ({ to, children }) => {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          `p-1 rounded-full px-4 cursor-pointer text-center transition-all duration-300 ease-linear ${
            isActive
              ? "bg-white text-blue-500 shadow-custom-all-sides"
              : "hover:text-blue-400"
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
          <Link to={`/admin/transport-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
          <Link to={`/admin/transport-edit/${row.id}`}>
            <BiEdit size={15} />
          </Link>
        </div>
      ),
    },
    // {
    //   name: "Employee ID",
    //   selector: (row) => row.employee_id,
    //   sortable: true,
    // },
    {
      name: "Employee Name",
      selector: (row) => row.employee_name,
      sortable: true,
    },
    {
      name: "Mobile Number",
      selector: (row) => row.mobile_no,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.booking_confirmation_email,
      sortable: true,
    },
    {
      name: "Pickup Location",
      selector: (row) => row.pickup_location,
      sortable: true,
    },
    {
      name: "Pickup Location",
      selector: (row) => row.drop_off_location,
      sortable: true,
    },
    {
      name: "Date Date",
      selector: (row) => row.start_date,
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => row.end_date,
      sortable: true,
    },
    {
      name: "Driver Information",
      selector: (row) => row.driver_contact_information,
      sortable: true,
    },
    {
      name: "Special Requirements",
      selector: (row) => row.special_requirements,
      sortable: true,
    },
    {
      name: "Vehicle Details",
      selector: (row) => row.vehicle_details,
      sortable: true,
    },
    {
      name: "Manager Approval",
      selector: (row) => (row.manager_approval ? "Yes" : "No"),
      sortable: true,
    },
    // {
    //   name: "Booking Status",
    //   selector: (row) => row.booking_status,
    //   sortable: true,
    // },
    {
      name: "Approval",
      selector: (row) =>
        row.booking_status === "pending" ? (
          <div className="flex justify-center gap-2">
            <button
              className="text-green-400 font-medium hover:bg-green-400 hover:text-white transition-all duration-200 p-1 rounded-full"
              onClick={() => handleApproval(row.id, true)}
            >
              <TiTick size={20} />
            </button>
            <button
              className="text-red-400 font-medium hover:bg-red-400 hover:text-white transition-all duration-200 p-1 rounded-full"
              onClick={() => handleApproval(row.id, false)}
            >
              <IoClose size={20} />
            </button>
          </div>
        ) : row.booking_status === "true" ? (
          <span className="text-green-600 font-medium">
            <TiTick size={20} />
          </span>
        ) : row.booking_status === "false" ? (
          <span className="text-red-600 font-medium">
            <IoClose size={20} />
          </span>
        ) : null,
      sortable: true,
    },
  ];

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    // Handle status change logic here if needed
  };

  return (
    <section className="flex">
      <Navbar />
      <div className="p-4 w-full my-2 flex md:mx-2 overflow-hidden flex-col">
        <BookingRequestNav />
        <div className="w-full flex md:flex-row flex-col gap-5 justify-between mt-10 my-2">
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
            {/* <div className="flex items-center gap-2">
              <input
                type="radio"
                id="cancelled"
                name="status"
                checked={selectedStatus === "cancelled"}
                onChange={() => setSelectedStatus("cancelled")}
              />
              <label htmlFor="cancelled" className="text-sm">
                Cancelled
              </label>
            </div> */}
          </div>
          <span className="flex gap-4">
            <Link
              to={"/admin/add-transport-request"}
              style={{ background: themeColor }}
              className="px-4 py-2  font-medium text-white rounded-md flex gap-2 items-center justify-center"
            >
              <IoAddCircleOutline size={20} />
              Add
            </Link>
            {/* Additional buttons can be added here */}
          </span>
        </div>
        <div className="w-full overflow-x-auto">
          <Table
            responsive
            columns={columns}
            data={TransportrequestsData}
            // customStyles={customStyle}
            pagination
            fixedHeader
            selectableRowsHighlight
            highlightOnHover
          />
        </div>
      </div>
    </section>
  );
};

export default TransportationRequest;
