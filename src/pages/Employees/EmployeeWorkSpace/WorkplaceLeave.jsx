import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import EmployeePortal from "../../../components/navbars/EmployeePortal";
import Table from "../../../components/table/Table";
import { BsEye } from "react-icons/bs";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import {
  getEmployeeLeave,
  getLeaveApplicationDetails,
  getLeaveCategory,
  getMyHRMSEmployees,
  postSingleLeaveApplication,
} from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import toast from "react-hot-toast";
const WorkplaceLeave = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4 cursor-pointer">
          <BsEye onClick={() => handleLeaveDetailsModal(row.id)} />
        </div>
      ),
    },
    {
      name: "Leave Category",
      selector: (row) => row.category_label,
      sortable: true,
    },
    {
      name: "From",
      selector: (row) => row.start_date,
      sortable: true,
    },
    {
      name: "To",
      selector: (row) => row.end_date,
      sortable: true,
    },
    // {
    //   name: "Closing Balance",
    //   selector: (row) => row.closing_balance,
    //   sortable: true,
    // },
    {
      name: "Leave Status",
      selector: (row) =>
        row.status === "rejected" ? (
          <p className="font-medium text-red-400">Rejected</p>
        ) : row.status === "approved" ? (
          <p className="font-medium text-green-400">Approved</p>
        ) : (
          row.status
        ),
      sortable: true,
    },
  ];

  const themeColor = useSelector((state) => state.theme.color);
  const [addModal, setAddModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const openAdd = () => {
    setAddModal(true);
  };

  const closeDetailModal = () => {
    setDetailModal(false);
  };

  const [formData, setFormData] = useState({
    halfDay: false,
    category: "",
    startDate: "",
    endDate: "",
    halfDayDate: "",
    reason: "",
  });

  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const [selectedUserOption, setSelectedUserOption] = useState([]);
  const [leaveCategories, setLeaveCategories] = useState([]);

  const handleUserChangeSelect = (selectedUserOption) => {
    setSelectedUserOption(selectedUserOption);
  };
  const [employees, setEmployees] = useState([]);
  const fetchAllEmployees = async () => {
    try {
      const res = await getMyHRMSEmployees(hrmsOrgId);

      const employeesList = res.map((emp) => ({
        value: emp.id,
        label: `${emp.first_name} ${emp.last_name}`,
      }));

      setEmployees(employeesList);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchLeaveCategories = async () => {
    try {
      const res = await getLeaveCategory(hrmsOrgId);
      setLeaveCategories(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAllEmployees();
    fetchLeaveCategories();
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const hrmsEmployeeId = getItemInLocalStorage("HRMS_EMPLOYEE_ID");
  const handleAddApplication = async () => {
    const postData = new FormData();
    postData.append("category", formData.category);
    postData.append("start_date", formData.startDate);
    postData.append("end_date", formData.endDate);
    postData.append("is_half_day", formData.halfDay);
    postData.append("half_day_selection", formData.halfDayDate);
    postData.append("reason", formData.reason);
    postData.append("employee", hrmsEmployeeId);
    // postData.append("status", "approved");
    try {
      const res = await postSingleLeaveApplication(postData);
      setAddModal(false);
      fetchEmployeeLeaves();
      toast.success("Leave application added successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const dd = String(today.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  };
  const [leaves, setLeaves] = useState([]);
  const fetchEmployeeLeaves = async () => {
    try {
      const res = await getEmployeeLeave(hrmsEmployeeId);
      setLeaves(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEmployeeLeaves();
  }, []);
  const [details, setDetails] = useState({});
  const handleLeaveDetailsModal = async (id) => {
    setDetailModal(true);
    try {
      const res = await getLeaveApplicationDetails(id);
      setDetails(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="flex">
      <Navbar />
      <div className="p-2 w-full my-2 flex md:mx-2 overflow-hidden flex-col">
        <EmployeePortal />
        <div className="my-2">
          <div className="w-full flex justify-between my-2 gap-2">
            <input
              type="text"
              name=""
              id=""
              className="border border-gray-400 p-2 rounded-md w-full"
              placeholder="Search by category"
            />
            <button
              className="p-1  text-white rounded-md px-4"
              style={{ background: themeColor }}
              onClick={openAdd}
            >
              Apply
            </button>
          </div>
          <div className="z-50">
            {addModal && (
              <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 bg-black opacity-30 backdrop-blur-sm z-20"></div>
                  </div>

                  <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true"
                  >
                    &#8203;
                  </span>
                  <div
                    className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-headline"
                  >
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="">
                        <div className="mt-3  sm:mt-0 sm:ml-4 ">
                          <h3
                            className="text-lg leading-6 font-medium text-gray-900 mb-4"
                            id="modal-headline"
                          >
                            Add Leave
                          </h3>

                          <div className="mb-4">
                            <label
                              htmlFor="leaveCategory"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Select Leave Category{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <select
                              id="leaveCategory"
                              name="category"
                              value={formData.category}
                              onChange={handleChange}
                              className=" w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              <option value="">Select leave category</option>
                              {leaveCategories.map((leaveCat) => (
                                <option value={leaveCat.id} key={leaveCat.id}>
                                  {leaveCat.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="mb-4 w-full">
                            {/* <p className="text-sm font-medium text-gray-700 mb-1">
                               Pending Applications: 1 Applications / 0.5 Days
                             </p> */}
                            <label
                              htmlFor="dateRange"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Select Date Range for this Leave
                            </label>
                            <div className="flex space-x-2 items-center gap-2 w-full">
                              <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                id=""
                                className="border p-1 rounded-md w-full"
                                min={getTodayDate()}
                              />{" "}
                              -
                              <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                id=""
                                className="border p-1 rounded-md w-full"
                                min={getTodayDate()}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-gray-700">
                              Are There Any Half Days?
                            </p>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center">
                                <input
                                  id="halfDayYes"
                                  name="halfDay"
                                  type="radio"
                                  checked={formData.halfDay === true}
                                  onChange={() =>
                                    setFormData({ ...formData, halfDay: true })
                                  }
                                  className="focus:ring-indigo-500 h-4 w-full text-indigo-600 border-gray-300"
                                />
                                <label
                                  htmlFor="halfDayYes"
                                  className="ml-1 block text-sm font-medium text-gray-700"
                                >
                                  Yes
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  id="halfDayNo"
                                  name="halfDay"
                                  type="radio"
                                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                  checked={formData.halfDay === false}
                                  onChange={() =>
                                    setFormData({ ...formData, halfDay: false })
                                  }
                                />
                                <label
                                  htmlFor="halfDayNo"
                                  className="ml-1 block text-sm font-medium text-gray-700"
                                >
                                  No
                                </label>
                              </div>
                            </div>
                          </div>
                          {formData.halfDay && (
                            <div className="my-2">
                              <label
                                htmlFor="halfDaySelect"
                                className="block text-sm font-medium text-gray-700 mb-2"
                              >
                                Select Half Days
                              </label>
                              <input
                                type="date"
                                name="halfDayDate"
                                value={formData.halfDayDate}
                                onChange={handleChange}
                                id=""
                                className="border p-1 w-full rounded-md"
                                min={getTodayDate()}
                              />
                            </div>
                          )}
                          <div className="my-2">
                            <label
                              htmlFor="reason"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Reason for Leave
                            </label>
                            <textarea
                              id="reason"
                              name="reason"
                              value={formData.reason}
                              onChange={handleChange}
                              rows="3"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 p-2 block w-full sm:text-sm border border-gray-300 rounded-md"
                              placeholder="Enter your reason for leave"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Modal footer */}
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600   sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={handleAddApplication}
                      >
                        Submit
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => setAddModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {detailModal && (
              <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-30 backdrop-blur-sm">
                <div className="bg-white mt-10   p-4 px-8 flex flex-col rounded-xl gap-5">
                  {/* <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full flex flex-col h-auto max-h-[80vh] overflow-y-auto z-50"> */}
                  <h2 className="text-2xl font-semibold "> Leave Details</h2>

                  <div className="grid  gap-2 ">
                    <div className="grid grid-cols-2 gap-4 w-96">
                      <label htmlFor="" className="font-medium">
                        Leave category :
                      </label>
                      <p className="font-medium text-sm">
                        {details.category_label}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-96">
                      <label htmlFor="" className="font-medium">
                        Leave Dates :
                      </label>
                      <p className="font-medium text-sm">
                        {details.start_date} to {details.end_date}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-96">
                      <label htmlFor="" className="font-medium">
                        Half day :
                      </label>
                      <p className="font-medium text-sm">
                        {details?.is_half_day ? "Yes" : "No"}
                      </p>
                    </div>
                    {details?.is_half_day && (
                      <div className="grid grid-cols-2 gap-4 w-96">
                        <label htmlFor="" className="font-medium">
                          Half day Date :
                        </label>
                        <p className="font-medium text-sm">
                          {details?.half_day_selection}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col ">
                      <label htmlFor="" className="font-medium">
                        Reason for leave
                      </label>
                      <p className="border bg-gray-100 p-2 rounded-md">
                        {details.reason}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end w-full gap-2">
                    <button
                      className="bg-red-400 text-white p-1 px-2 w-full rounded-md"
                      onClick={closeDetailModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Table columns={columns} data={leaves} />
        </div>
      </div>
    </section>
  );
};

export default WorkplaceLeave;
