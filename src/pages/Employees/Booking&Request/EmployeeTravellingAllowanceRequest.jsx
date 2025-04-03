import React, { useEffect, useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";
import Table from "../../../components/table/Table";
import { useSelector } from "react-redux";
import { BsEye } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import {
  getTravellingAllowanceRequest,
  getFilterTravellingAllowanceRequest,
} from "../../../api";
const EmployeeTravellingAllowanceRequest = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [TravelAllowancerequestsData, setTravelAllowancerequestsData] =
    useState([]);
  const themeColor = useSelector((state) => state.theme.color);
  const [approved, setApproved] = useState(true);
  useEffect(() => {
    const fetchTravelAllowanceRequest = async () => {
      try {
        let travelallowancereqresp;

        if (selectedStatus === "all") {
          const response = await getTravellingAllowanceRequest();
          travelallowancereqresp = response.data;
        } else {
          const response = await getFilterTravellingAllowanceRequest(approved);
          travelallowancereqresp = response.data;
        }
        travelallowancereqresp = travelallowancereqresp.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        console.log("response from API", travelallowancereqresp);
        setTravelAllowancerequestsData(travelallowancereqresp);
      } catch (err) {
        console.error("Failed to fetch travel allowance request data:", err);
      }
    };

    fetchTravelAllowanceRequest();
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
          <Link to={`/employee/travelling-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
        </div>
      ),
    },
    {
      name: "Expense Category",
      selector: (row) => row.expense_category,
      sortable: true,
    },
    {
      name: "Date of Expense",
      selector: (row) => row.date_of_expense,
      sortable: true,
    },
    {
      name: "Description of Expense",
      selector: (row) => row.description_of_expense,
      sortable: true,
    },
    {
      name: "Amount Spent",
      selector: (row) => row.amount_spent,
      sortable: true,
    },
    {
      name: "Reimbursement Amount",
      selector: (row) => row.reimbursement_amount,
      sortable: true,
    },
    {
      name: "Reimbursement Method",
      selector: (row) => row.reimbursement_method,
      sortable: true,
    },
    {
      name: "Cancellation",
      selector: (row) =>
        row.approval_status === "false" && (
          <button className="text-red-400 font-medium">Cancel</button>
        ),
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) =>
        row.approval_status === "pending" ? (
          <div className="text-black">
            <h2>Pending</h2>
          </div>
        ) : row.approval_status === "true" ? (
          <span className="text-black">Approved</span>
        ) : row.approval_status === "false" ? (
          <span className="text-black">Cancel</span>
        ) : null,
      sortable: true,
    },
  ];

  // Function to handle status change (e.g., all, upcoming, completed, cancelled)
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    // Additional logic can be added here if needed
  };

  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        {/* Navigation links */}
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
        {/* Filter and Add section */}
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
          </div>
          {/* Add button */}
          <span className="flex gap-4">
            <Link
              to={"/employee/add-travelallowance-request"}
              className="border-2 font-semibold hover:bg-black hover:text-white transition-all border-black p-2 rounded-md text-black cursor-pointer text-center flex items-center gap-2 justify-center"
              style={{ height: "1cm" }}
            >
              <PiPlusCircle size={20} />
              Add
            </Link>
            {/* Additional buttons can be added here */}
          </span>
        </div>
        {/* Table section with right-side scrolling */}
        <div className="w-full overflow-x-auto">
          <Table
            responsive
            columns={columns}
            data={TravelAllowancerequestsData}
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

export default EmployeeTravellingAllowanceRequest;
