import React, { useEffect, useRef, useState } from "react";
import Table from "../../components/table/Table";
import { BiEdit } from "react-icons/bi";
import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import Collapsible from "react-collapsible";
import CustomTrigger from "../../containers/CustomTrigger";
import { FaRegAddressCard, FaTrash } from "react-icons/fa";
import {
  approveRejectMultipleRegRequest,
  getAdminAccess,
  getEmployeeAssociatedSites,
  getEmployeeDetails,
  getEmployeeRegularizationReq,
  getRegularizationDetails,
  hrmsDomain,
  postRegularizationApproval,
} from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import toast from "react-hot-toast";
import { BsEye } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import Accordion from "./Components/Accordion";
const PendingTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showBulkModal, setshowBulkModal] = useState(false);
  const [showApproveModal, setshowApproveModal] = useState(false);
  const [showApproveFilterModal, setshowApproveFilterModal] = useState(false);
  const [showRejectModal, setshowRejectModal] = useState(false);
  const [showRejectFilterModal, setshowRejectFilterModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [modalData, setModalData] = useState({
    regularizationReason: "",
    regularizationRequestStatus: "",
    startDate: "",
    endDate: "",
    employeeDepartment: "",
  });
  const handleApproveMultiple = () => {
    // Logic to approve multiple requests
    console.log("Approve multiple requests");
    setShowActionsDropdown(false);
  };

  const handleRejectMultiple = () => {
    // Logic to reject multiple requests
    console.log("Reject multiple requests");
    setShowActionsDropdown(false);
  };
  const handleEditClick = (row) => {
    setModalData({
      regularizationReason: row.reason || "",
      regularizationRequestStatus: row.status || "",
      startDate: "",
      endDate: "",
      employeeDepartment: row.department || "",
      ...row,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const formatTimeToAmPmLocal = (isoString) => {
    const date = new Date(isoString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amPm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes} ${amPm}`;
  };

  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <button onClick={() => handleShowDetails(row.id, row.employee)}>
            <BsEye size={15} />
          </button>
        </div>
      ),
    },
    {
      name: "Employee Name",
      selector: (row) => `${row.first_name} ${row.last_name}`,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => (
        <div>
          {row.requested_check_in
            ? formatDate(row.requested_check_in)
            : formatDate(row.requested_check_out)}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Requested Timings",
      selector: (row) => {
        const checkIn = row.requested_check_in
          ? formatTimeToAmPmLocal(row.requested_check_in)
          : null;
        const checkOut = row.requested_check_out
          ? formatTimeToAmPmLocal(row.requested_check_out)
          : null;

        return (
          <div>
            {checkIn && checkOut
              ? `${checkIn} - ${checkOut}`
              : checkIn
              ? `Check-In : ${checkIn}`
              : checkOut
              ? `Check-Out : ${checkOut}`
              : "No Timing Available"}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: "Actual Timings",
      selector: (row) => row.actual_timing,
      sortable: true,
    },
    {
      name: "Reason",
      selector: (row) => row.reason,
      sortable: true,
    },
    // {
    //   name: "Comment",
    //   selector: (row) => row.comment,
    //   sortable: true,
    // },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    // {
    //   name: "Action",
    //   cell: (row) => (
    //     <div className="flex items-center gap-4">
    //       <button onClick={() => handleEditClick(row)}>
    //         <BiEdit size={15} />
    //       </button>
    //       <button onClick={() => setShowModalDelete(true)}>
    //         <FaTrash size={15} />
    //       </button>
    //     </div>
    //   ),
    // },
    {
      name: "Approval",
      selector: (row) => (
        <div className="flex justify-center gap-2">
          {roleAccess?.can_approve_reject_regularisation && (
            <>
              <button
                className="text-green-400 font-medium hover:bg-green-400 hover:text-white transition-all duration-200 p-1 rounded-full"
                onClick={() => handleReqApproval(row.id, "approve")}
              >
                <TiTick size={20} />
              </button>
              <button
                className="text-red-400 font-medium hover:bg-red-400 hover:text-white transition-all duration-200 p-1 rounded-full"
                onClick={() => handleReqApproval(row.id, "reject")}
              >
                <IoClose size={20} />
              </button>
            </>
          )}
        </div>
      ),
      sortable: true,
    },
  ];

  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const fetchRegularizationReq = async () => {
    try {
      const res = await getEmployeeRegularizationReq(hrmsOrgId);
      const pendingReq = res.filter((req) => req.status === "Pending");
      setFilteredRequests(pendingReq);
      setRequests(pendingReq);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchRegularizationReq();
  }, []);

  const handleReqApproval = async (approvalId, approvalStatus) => {
    const postStatus = new FormData();
    postStatus.append("action", approvalStatus);
    try {
      await postRegularizationApproval(approvalId, postStatus);
      toast.success(`Regularization request ${approvalStatus}`);
      fetchRegularizationReq();
    } catch (error) {
      console.log(error);
    }
  };

  const [searchText, setSearchText] = useState("");
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);
    if (searchValue.trim() === "") {
      setFilteredRequests(requests);
    } else {
      const filteredResult = requests.filter((employee) =>
        `${employee.first_name} ${employee.last_name}`
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      );
      setFilteredRequests(filteredResult);
    }
  };

  const [selectedRows, setSelectedRows] = useState([]);
  const formatDateFromTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const handleSelectedRows = (rows) => {
    const selectedId = rows.map((row) => row.id);
    setSelectedRows(selectedId);
  };

  const handleApproveMultipleRegularization = async () => {
    if (selectedRows.length === 0) {
      toast.error(
        "No regularization request selected. Please select at least one."
      );
      return;
    }
    const approveData = {
      attendance_request_ids: selectedRows,
      action: "approve",
    };
    setSelectedRows([]);
    try {
      await approveRejectMultipleRegRequest(approveData);
      fetchRegularizationReq();
      setshowApproveModal(false);
      toast.success("Selected Regularization request Approved");
    } catch (error) {
      console.log(error);
    }
  };
  const handleRejectMultipleRegularization = async () => {
    if (selectedRows.length === 0) {
      toast.error(
        "No regularization request selected. Please select at least one."
      );
      return;
    }
    const approveData = {
      attendance_request_ids: selectedRows,
      action: "reject",
    };
    setSelectedRows([]);
    try {
      await approveRejectMultipleRegRequest(approveData);
      fetchRegularizationReq();
      setshowRejectModal(false);
      toast.success("Selected Regularization request Rejected");
    } catch (error) {
      console.log(error);
    }
  };

  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowActionsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowActionsDropdown]);

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };
  const [regDate, setReqDate] = useState("");
  const [requestedTime, setRequestedTime] = useState("");
  const [actualTime, setActualTime] = useState("");
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");
  const [details, setDetails] = useState({});
  const [showDetailsModal, setshowDetailsModal] = useState(false);
  const handleShowDetails = async (reqId, empId) => {
    fetchEmployeeDetails(empId);
    fetchEmployeeAssociatedSite(empId);
    setshowDetailsModal(true);
    try {
      const res = await getRegularizationDetails(reqId);
      setDetails(res);
      setReqDate(
        res.requested_check_in
          ? res.requested_check_in
          : res.requested_check_out
      );
      setRequestedTime(res.requested_timing);
      setActualTime(res.actual_timing);
      setReason(res.reason);
      setComment(res.comment);
      setStatus(res.status);
    } catch (error) {
      console.log(error);
    }
  };

  const formatTimeToAmPm = (isoString) => {
    const date = new Date(isoString);
    const hours = date.getHours();
    const minutes = date.getMinutes(); // Local minutes
    const amPm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0-23 to 1-12, with 0 being 12 AM
    const formattedMinutes = minutes.toString().padStart(2, "0"); // Ensure two digits for minutes

    return `${formattedHours}:${formattedMinutes} ${amPm}`;
  };

  const [empDetails, setEmpDetails] = useState({});
  const [empSiteDetails, setEmpSiteDetails] = useState({});
  const fetchEmployeeDetails = async (employeeId) => {
    try {
      const res = await getEmployeeDetails(employeeId);
      setEmpDetails(res);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEmployeeAssociatedSite = async (employeeId) => {
    try {
      const res = await getEmployeeAssociatedSites(employeeId);
      setEmpSiteDetails(res[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const empId = getItemInLocalStorage("APPROVERID");
  const orgId = getItemInLocalStorage("HRMSORGID");
  const [roleAccess, setRoleAccess] = useState({});
  useEffect(() => {
    const fetchRoleAccess = async () => {
      try {
        const res = await getAdminAccess(orgId, empId);

        setRoleAccess(res[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoleAccess();
  }, []);

  return (
    <section className="flex">
      <div className="w-full flex mx-2 flex-col overflow-hidden">
        <div className="flex justify-between gap-2 my-2">
          <input
            type="text"
            placeholder="Search by employee name"
            className="border border-gray-400 w-full placeholder:text-sm rounded-lg p-2"
            value={searchText}
            onChange={handleSearch}
          />
          {roleAccess?.can_approve_reject_regularisation && (
            <div className="flex gap-2">
              {/* <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
              onClick={() => setShowFilterModal(true)}
            >
              Filter
            </button> */}
              <button
                onClick={() => setShowActionsDropdown(!showActionsDropdown)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Actions
              </button>
            </div>
          )}
          {showActionsDropdown && (
            <div
              className="absolute top-35 right-2 mt-11 w-60 bg-white border border-gray-300 rounded-md shadow-lg z-10"
              ref={dropdownRef}
            >
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => {
                  setshowApproveModal(!showApproveModal);
                  setShowActionsDropdown(false);
                }}
              >
                Approve multiple requests
              </button>
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => setshowRejectModal(!showRejectModal)}
              >
                Reject multiple requests
              </button>
              {/* <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() =>
                  setshowApproveFilterModal(!showApproveFilterModal)
                }
              >
                Approve multiple requests by filters
              </button>
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => setshowRejectFilterModal(!showRejectFilterModal)}
              >
                Reject multiple requests by filters
              </button>
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => setshowBulkModal(!showBulkModal)}
              >
                Bulk Upload Regularization
              </button> */}
            </div>
          )}
        </div>
        <Table
          columns={columns}
          data={filteredRequests}
          selectableRow={true}
          isPagination={true}
          onSelectedRows={handleSelectedRows}
        />
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">
              Edit Regularization Request
            </h2>
            <div className="grid md:grid-cols-1 gap-5 mt-5">
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="regularizationReason">
                  Regularization Reason
                </label>
                <input
                  type="text"
                  name="regularizationReason"
                  value={modalData.regularizationReason}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded-md"
                />
              </div>
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="regularizationRequestStatus">
                  Regularization Request Status
                </label>
                <input
                  type="text"
                  name="regularizationRequestStatus"
                  value={modalData.regularizationRequestStatus}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded-md"
                />
              </div>
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={modalData.startDate}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded-md"
                />
              </div>
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={modalData.endDate}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded-md"
                />
              </div>
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="employeeDepartment">Employee Department</label>
                <input
                  type="text"
                  name="employeeDepartment"
                  value={modalData.employeeDepartment}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded-md"
                />
              </div>
            </div>
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showModalDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">Are you sure?</h2>
            <p>Do you really want to delete this Regularize Request?</p>
            <div className="grid md:grid-cols-1 gap-5 mt-5">
              {/* <div className="grid gap-2 items-center w-full">
                <label htmlFor="regularizationReason">Approver's comment</label>
                <textarea type="text" name="regularizationReason" value={modalData.regularizationReason} onChange={handleChange} className="border border-gray-400 p-2 rounded-md"/>
              </div> */}
            </div>
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
              onClick={() => setShowModalDelete(false)}
            >
              Cancel
            </button>
            <button
              className="mt-4 ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
              onClick={() => setShowModalDelete(false)}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
      {showApproveModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-2">Are you sure?</h2>
            <h3 className="font-medium my-2">
              Do you really want to approve selected records?
            </h3>

            <div className="grid gap-2 items-center w-full">
              <label
                htmlFor="regularizationReason"
                className="font-medium text-gray-500"
              >
                Approver's comment
              </label>
              <textarea
                type="text"
                name="regularizationReason"
                value={modalData.regularizationReason}
                onChange={handleChange}
                className="border border-gray-400 p-2 rounded-md"
              />
            </div>

            <div className="flex justify-end gap-2 my-2">
              <button
                className="border-2 border-red-500 text-red-500  py-1 px-6 rounded-full"
                onClick={() => setshowApproveModal(false)}
              >
                Close
              </button>
              <button
                className=" bg-green-500 text-white py-1 px-6 rounded-full"
                onClick={handleApproveMultipleRegularization}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-2">Are you sure?</h2>
            <h3 className="font-medium my-2">
              Do you really want to reject selected records?
            </h3>
            <div className="grid gap-2 items-center w-full">
              <label htmlFor="regularizationReason">Approver's comment</label>
              <textarea
                type="text"
                name="regularizationReason"
                value={modalData.regularizationReason}
                onChange={handleChange}
                className="border border-gray-400 p-2 rounded-md"
              />
            </div>

            <div className="flex justify-end gap-2 my-2">
              <button
                className="border-2 border-red-500 text-red-500  py-1 px-6 rounded-full"
                onClick={() => setshowRejectModal(false)}
              >
                Close
              </button>
              <button
                className=" bg-green-500 text-white py-1 px-6 rounded-full"
                onClick={handleRejectMultipleRegularization}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showFilterModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Filter Requests</h2>
            <div className="grid md:grid-cols-2 gap-5 mt-5">
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="filterReason">Regularization Reason</label>
                <select
                  name="filterReason"
                  value={modalData.regularizationReason}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded-md"
                />
              </div>
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="filterStatus">
                  Regularization Request Status
                </label>
                <select
                  name="filterStatus"
                  value={modalData.regularizationRequestStatus}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded-md"
                />
              </div>
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="filterStartDate">Start Date</label>
                <input
                  type="date"
                  name="filterStartDate"
                  value={modalData.startDate}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded-md"
                />
              </div>
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="filterEndDate">End Date</label>
                <input
                  type="date"
                  name="filterEndDate"
                  value={modalData.endDate}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded-md"
                />
              </div>
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="filterDepartment">Employee Department</label>
                <select
                  type="text"
                  name="filterDepartment"
                  value={modalData.employeeDepartment}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded-md"
                />
              </div>
            </div>
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
              onClick={() => setShowFilterModal(false)}
            >
              Close
            </button>
            &nbsp;
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
              onClick={() => setShowFilterModal(false)}
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {showBulkModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">
              Bulk Upload Regularization
            </h2>
            <Collapsible
              readOnly
              trigger={
                <CustomTrigger isOpen={isOpen}>Instructions:</CustomTrigger>
              }
              onOpen={() => setIsOpen(true)}
              onClose={() => setIsOpen(false)}
              className="bg-gray-100 my-4 p-2 rounded-md font-bold "
            >
              <div className="grid grid-cols-1 bg-gray-300 p-2 rounded-md gap-1">
                <p>
                  1. Download bulk regularization format from download section
                </p>
                <p>
                  2. Enter employee email as per records, Name & Emp Code Date &
                  date in DD-MM-YYYY Format
                </p>
                <p>3. Select Requested Check In and Check Out Column</p>
                <p>4. Right click and select the format cells button</p>
                <p>5. Choose the "Text" format</p>
                <p>
                  6. Enter the check-in / check-out times in AM/PM format: E.g.
                  8:05 AM or 12:30 PM
                </p>
              </div>
            </Collapsible>
            <div className="grid md:grid-cols-1 gap-5 mt-5">
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="filterReason">
                  Step 1: Download Bulk Regularization Format
                </label>
                <button className="bg-blue-500 w-48 text-white p-2 rounded-md">
                  Download
                </button>
              </div>
              {/* <div className="grid gap-2 items-center w-full">
                <label htmlFor="filterStatus">Regularization Request Status</label>
                <select  name="filterStatus" value={modalData.regularizationRequestStatus} onChange={handleChange} className="border border-gray-400 p-2 rounded-md"/>
              </div> */}
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="filterStartDate">
                  Step 2: Make necessary changes in upload format as per
                  instructions and Upload *
                </label>
                <input
                  type="file"
                  name="filterStartDate"
                  value={modalData.startDate}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded-md"
                />
              </div>
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="filterEndDate">
                  Step 3: Select Regularizataion Status Applicable *
                </label>
                <select
                  name="filterEndDate"
                  value={modalData.endDate}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded-md"
                />
              </div>
              {/* <div className="grid gap-2 items-center w-full">
                <label htmlFor="filterDepartment">Employee Department</label>
                <select type="text" name="filterDepartment" value={modalData.employeeDepartment} onChange={handleChange} className="border border-gray-400 p-2 rounded-md"/>
              </div> */}
            </div>
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
              onClick={() => setshowBulkModal(false)}
            >
              Close
            </button>
            &nbsp;
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
              onClick={() => setshowBulkModal(false)}
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {showApproveFilterModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">
              Bulk Approve Regularizataion Requests by Filters
            </h2>
            <div className="grid md:grid-cols-2 gap-5 mt-5">
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="filterReason">Regularization Reason</label>
                <select
                  type="text"
                  name="filterReason"
                  value={modalData.regularizationReason}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded-md"
                />
              </div>
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="filterStatus">
                  Regularization Request Status
                </label>
                <select
                  type="text"
                  name="filterStatus"
                  value={modalData.regularizationRequestStatus}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded-md"
                />
              </div>
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="filterStartDate">Start Date</label>
                <input
                  type="date"
                  name="filterStartDate"
                  value={modalData.startDate}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded-md"
                />
              </div>
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="filterEndDate">End Date</label>
                <input
                  type="date"
                  name="filterEndDate"
                  value={modalData.endDate}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded-md"
                />
              </div>
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="filterDepartment">Employee Department</label>
                <select
                  type="text"
                  name="filterDepartment"
                  value={modalData.employeeDepartment}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded-md"
                />
              </div>
            </div>
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
              onClick={() => setshowApproveFilterModal(false)}
            >
              Close
            </button>
            &nbsp;
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
              onClick={() => setshowApproveFilterModal(false)}
            >
              Apply
            </button>
          </div>
        </div>
      )}
      {showRejectFilterModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">
              Bulk Reject Regularizataion Requests by Filters
            </h2>
            <div className="grid md:grid-cols-2 gap-5 mt-5">
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="filterReason">Regularization Reason</label>
                <select
                  type="text"
                  name="filterReason"
                  value={modalData.regularizationReason}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded-md"
                />
              </div>
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="filterStatus">
                  Regularization Request Status
                </label>
                <select
                  type="text"
                  name="filterStatus"
                  value={modalData.regularizationRequestStatus}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded-md"
                />
              </div>
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="filterStartDate">Start Date</label>
                <input
                  type="date"
                  name="filterStartDate"
                  value={modalData.startDate}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded-md"
                />
              </div>
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="filterEndDate">End Date</label>
                <input
                  type="date"
                  name="filterEndDate"
                  value={modalData.endDate}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded-md"
                />
              </div>
              <div className="grid gap-2 items-center w-full">
                <label htmlFor="filterDepartment">Employee Department</label>
                <select
                  type="text"
                  name="filterDepartment"
                  value={modalData.employeeDepartment}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded-md"
                />
              </div>
            </div>
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
              onClick={() => setshowRejectFilterModal(false)}
            >
              Close
            </button>
            &nbsp;
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
              onClick={() => setshowRejectFilterModal(false)}
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {showDetailsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-[45rem] max-h-[30rem] overflow-y-auto hide-scrollbar">
            <h2 className="text-xl font-semibold text-center border-b">
              Regularization Request Details
            </h2>
            <Accordion
              title={"Requestor Details"}
              icon={FaRegAddressCard}
              content={
                <>
                  <div className="grid  gap-2 border bg-blue-50 rounded-md p-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={hrmsDomain + empDetails.profile_photo}
                        alt={empDetails?.employee?.first_name}
                        className="border border-gray-300 rounded-full h-10 w-10 object-cover"
                      />
                      <p className="font-medium">
                        {empDetails.first_name} {empDetails.last_name}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="grid grid-cols-2">
                        <label htmlFor="" className="font-medium">
                          DOB :{" "}
                        </label>
                        <p>{empDetails.date_of_birth}</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <label htmlFor="" className="font-medium">
                          Gender :{" "}
                        </label>
                        <p>{empDetails.gender}</p>
                      </div>

                      <div className="grid grid-cols-2">
                        <label htmlFor="" className="font-medium">
                          Mobile :{" "}
                        </label>
                        <p>{empDetails.mobile}</p>
                      </div>
                      <div className="grid grid-cols-2 ">
                        <label htmlFor="" className="font-medium">
                          Aadhar :{" "}
                        </label>
                        <p>{empDetails.aadhar_number}</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <label htmlFor="" className="font-medium">
                          Pan :{" "}
                        </label>
                        <p>{empDetails.pan}</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <label htmlFor="" className="font-medium">
                          Site :{" "}
                        </label>
                        <p>
                          {empSiteDetails.associated_organization_name
                            ? empSiteDetails.associated_organization_name
                            : "Not Associated"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2">
                        <label htmlFor="" className="font-medium">
                          Site ID :{" "}
                        </label>
                        <p>
                          {empSiteDetails.associated_organization
                            ? empSiteDetails.associated_organization
                            : "Not Associated"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 ">
                        <label htmlFor="" className="font-medium">
                          Email :{" "}
                        </label>
                        <p className="text-wrap max-w-20">
                          {empDetails.email_id}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              }
            />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span
                  className={`font-medium ${
                    status === "rejected" ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Regularization Date:</span>
                <span>{formatDate(regDate)}</span>
              </div>
              {/* <div className="flex justify-between">
                <span className="font-medium">Attendance Template:</span>
                <span>Attendance Policy</span>
              </div> */}
              <div className="flex justify-between">
                <span className="font-medium">Type of Request:</span>
                {details?.request_type}
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Applied On:</span>
                <span>{formatDateFromTimestamp(details.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Actual Check In:</span>
                <span></span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Actual Check Out:</span>
                <span></span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Requested Check In:</span>
                <span>
                  {details.requested_check_in
                    ? formatTimeToAmPm(details.requested_check_in)
                    : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Requested Check Out:</span>
                <span>
                  {details.requested_check_out
                    ? formatTimeToAmPm(details.requested_check_out)
                    : ""}
                </span>
              </div>
            </div>
            {/* <div className="mt-4">
              <span className="font-medium">Comments and History</span>
            </div> */}
            <div className="flex justify-center border-t p-1 mt-4">
              <button
                onClick={() => setshowDetailsModal(false)}
                className="px-4 py-1 border-red-500 border text-red-500 rounded-full flex items-center gap-2"
              >
                <MdClose /> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PendingTable;
