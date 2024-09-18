import React, { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import Table from "../../components/table/Table";
import AdminHRMS from "./AdminHrms";
import { useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";

const LeaveCompleted = () => {
  const themeColor = useSelector((state) => state.theme.color);

  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [isModalOpen4, setIsModalOpen4] = useState(false);
  const [isModalOpen5, setIsModalOpen5] = useState(false);
  const [isModalOpen6, setIsModalOpen6] = useState(false);
  const [isModalOpen7, setIsModalOpen7] = useState(false);
  const [isModalOpen8, setIsModalOpen8] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const columns = [
    {
      name: "Employee Name",
      selector: (row) => row.Name,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.Category,
      sortable: true,
    },
    {
      name: "Start Date",
      selector: (row) => row.Start_Date,
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => row.End_Date,
      sortable: true,
    },
    {
      name: "Leave Days",
      selector: (row) => row.Leave_Days,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <button
            onClick={openModal}
            className="text-blue-500 hover:text-blue-700 focus:outline-none"
          >
            <BiEdit size={15} />
          </button>
          <FaTrash size={15} />
        </div>
      ),
    },
  ];

  const data = [
    {
      Name: "Mittu Panda",
      Category: "LWP",
      Start_Date: "23/10/2024",
      End_Date: "23/10/2024",
      Leave_Days: "2",
      status: "Approved",
    },
  ];
  const [formData, setFormData] = useState({
    halfDay: false,
  });

  return (
    <section className="flex">
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="flex justify-end gap-2 mr-2 my-2">
          <input
            type="text"
            placeholder="Search by name"
            className="border border-gray-400 w-96 placeholder:text-sm rounded-lg p-2"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            style={{ background: themeColor }}
            className="bg-black text-white hover:bg-gray-700 font-semibold py-2 px-4 rounded"
          >
            Filter
          </button>
          <div className="relative inline-block text-left">
            <button
              onClick={toggleDropdown}
              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
            >
              Actions
              <svg
                className="-mr-1 mt-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 01.707 1.707L6.414 9.586a1 1 0 01-1.414 0L.293 5.707A1 1 0 011.707 4.293L6 8.586 9.293 5.293A1 1 0 0110 3z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
        <Table columns={columns} data={data} isPagination={true} />
      </div>
      {isOpen && (
        <div className="origin-top-right z-30 absolute right-0 mt-20 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <button onClick={() => setIsModalOpen1(true)}>
                Add Single Leave Applications
              </button>
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <button onClick={() => setIsModalOpen2(true)}>
                Add Multiple Leave Applications
              </button>
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              {/* Upload Documents */}
              <button onClick={() => setIsModalOpen3(true)}>
                Approve multiple requests
              </button>
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              {/* Bulk Update Employee Data */}
              <button onClick={() => setIsModalOpen4(true)}>
                Bulk Approve by filters{" "}
              </button>
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              {/* Bulk Add New Employees */}
              <button onClick={() => setIsModalOpen5(true)}>
                Approve multiple requests
              </button>
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <button onClick={() => setIsModalOpen6(true)}>
                Bulk Reject by filters
              </button>
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <button onClick={() => setIsModalOpen7(true)}>
                Bulk Approve Cancel Leave
              </button>
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              {/* Bulk Update Payment Information */}

              <button onClick={() => setIsModalOpen8(true)}>
                Bulk Reject Cancel Leave
              </button>
            </a>
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal panel */}
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
              {/* Modal content */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="">
                  <div className="mt-3  sm:mt-0 sm:ml-4 ">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900 mb-4"
                      id="modal-headline"
                    >
                      Edit Leave
                    </h3>
                    <div className="mb-4">
                      <label
                        htmlFor="leaveCategory"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Select Leave Category *
                      </label>
                      <select
                        id="leaveCategory"
                        name="leaveCategory"
                        className=" w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="lwp">LWP</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      {/* <p className="text-sm font-medium text-gray-700 mb-1">
                        Pending Applications: 1 Applications / 0.5 Days
                      </p> */}
                      <label
                        htmlFor="dateRange"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Select Date Range for this Leave
                      </label>
                      <div className="flex space-x-2 items-center gap-2">
                        <input
                          type="date"
                          name=""
                          id=""
                          className="border p-1 rounded-md"
                        />{" "}
                        -
                        <input
                          type="date"
                          name=""
                          id=""
                          className="border p-1 rounded-md"
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
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
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
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Select Half Days
                        </label>
                        <input
                          type="date"
                          name=""
                          id=""
                          className="border p-1 rounded-md"
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
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
          <div className="bg-white p-5 rounded-md shadow-md w-2/3">
            {/* <h2 className="text-xl font-semibold mb-4">Add Department</h2> */}
            <div className="grid md:grid-cols-3 gap-5 mt-5">
              <div className="grid gap-2 items-center w-full">
                <label
                  htmlFor="departmentName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Leave Categories
                </label>
                <select
                  type="text"
                  id="departmentName"
                  className="mt-1 block w-full border border-gray-400 p-2 rounded-md"
                  placeholder="Enter Branch Location"
                >
                  <option value="">Paid Leave</option>
                  <option value="">LWP</option>
                </select>
              </div>
              <div className="grid gap-2 items-center w-full ">
                <label
                  htmlFor="headOfDepartment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Leave Status
                </label>
                <select
                  id="headOfDepartment"
                  // value={headOfDepartment}
                  // onChange={(e) => setHeadOfDepartment(e.target.value)}
                  className="mt-1 block w-full border border-gray-400 p-2 rounded-md"
                >
                  <option value="" disabled>
                    Level 1 Approval Pending
                  </option>
                  <option value="" disabled>
                    Level 2 Approval Pending
                  </option>
                </select>
              </div>
              <div className="grid gap-2 items-center w-full ">
                <label
                  htmlFor="headOfDepartment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-400 p-2 rounded-md"
                />
              </div>
              <div className="grid gap-2 items-center w-full ">
                <label
                  htmlFor="headOfDepartment"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-400 p-2 rounded-md"
                />
              </div>
              <div className="grid gap-2 items-center w-full ">
                <label
                  htmlFor="headOfDepartment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Employee Status
                </label>
                <select
                  id="headOfDepartment"
                  // value={headOfDepartment}
                  // onChange={(e) => setHeadOfDepartment(e.target.value)}
                  className="mt-1 block w-full border border-gray-400 p-2 rounded-md"
                >
                  <option value="" disabled>
                    Imcomplete
                  </option>
                  <option value="" disabled>
                    Active
                  </option>
                </select>
              </div>
              <div className="grid gap-2 items-center w-full ">
                <label
                  htmlFor="headOfDepartment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Employee Department
                </label>
                <select
                  id="headOfDepartment"
                  // value={headOfDepartment}
                  // onChange={(e) => setHeadOfDepartment(e.target.value)}
                  className="mt-1 block w-full border border-gray-400 p-2 rounded-md"
                >
                  <option value="" disabled>
                    HR
                  </option>
                  <option value="" disabled>
                    Developer
                  </option>
                  <option value="">Driver</option>
                </select>
              </div>
            </div>
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-gray-700 p-2 rounded-md mr-2"
              >
                Clear
              </button>
              <button
                // onClick={handleAddDepartment}
                className="bg-blue-500 text-white p-2 rounded-md"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalOpen1 && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="">
              <div className="mt-3  sm:mt-0 sm:ml-1 ">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900 mb-4"
                  id="modal-headline"
                >
                  Add New Leave
                </h3>
                <div className="mb-4">
                  <label
                    htmlFor="leaveCategory"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Select Employee
                  </label>
                  <select
                    id="leaveCategory"
                    name="leaveCategory"
                    className=" w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="lwp">Mittu Panda</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="leaveCategory"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Select Leave Category *
                  </label>
                  <select
                    id="leaveCategory"
                    name="leaveCategory"
                    className=" w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="lwp">LWP</option>
                  </select>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Pending Applications: 1 Applications / 0.5 Days
                  </p>
                  <label
                    htmlFor="dateRange"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Select Date Range for this Leave
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      id="dateRange"
                      name="dateRange"
                      className="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm flex-1"
                      value="21-06-2024 - 21-06-2024"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Are There Any Half Days?
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        id="halfDayYes"
                        name="halfDay"
                        type="radio"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
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

                <div className="mb-4">
                  <label
                    htmlFor="reason"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Reason for Leave
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows="3"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="Enter your reason for leave"
                  ></textarea>
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => setIsModalOpen1(false)}
                  className="bg-gray-300 text-gray-700 p-2 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  // onClick={handleAddDepartment}
                  className="bg-blue-500 text-white p-2 rounded-md"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isModalOpen2 && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="">
              <div className="mt-3  sm:mt-0 sm:ml-1 ">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900 mb-4"
                  id="modal-headline"
                >
                  Add Leaves Applications in bulk
                </h3>
                <div className="mb-4">
                  <label
                    htmlFor="leaveCategory"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Select Leave Category *
                  </label>
                  <select
                    id="leaveCategory"
                    name="leaveCategory"
                    className=" w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="lwp">LWP</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="leaveCategory"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Select Employee
                  </label>
                  <select
                    id="leaveCategory"
                    name="leaveCategory"
                    className=" w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="lwp">Mittu Panda</option>
                  </select>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Pending Applications: 1 Applications / 0.5 Days
                  </p>
                  <label
                    htmlFor="dateRange"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Select Date Range for this Leave
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      id="dateRange"
                      name="dateRange"
                      className="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm flex-1"
                      value="21-06-2024 - 21-06-2024"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Are There Any Half Days?
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        id="halfDayYes"
                        name="halfDay"
                        type="radio"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
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

                <div className="mb-4">
                  <label
                    htmlFor="reason"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Reason for Leave
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows="3"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="Enter your reason for leave"
                  ></textarea>
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => setIsModalOpen2(false)}
                  className="bg-gray-300 text-gray-700 p-2 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  // onClick={handleAddDepartment}
                  className="bg-blue-500 text-white p-2 rounded-md"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isModalOpen3 && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="">
              <div className="mt-3  sm:mt-0 sm:ml-1 ">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900 mb-4"
                  id="modal-headline"
                >
                  Are you sure?
                </h3>

                <p>
                  Are you sure you would like to Approve the selected leave
                  requests?
                </p>
                <div className="mb-4">
                  <label
                    htmlFor="reason"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Approver Comment
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows="3"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                    // placeholder="Enter your reason for leave"
                  ></textarea>
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => setIsModalOpen3(false)}
                  className="bg-gray-300 text-gray-700 p-2 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  // onClick={handleAddDepartment}
                  className="bg-blue-500 text-white p-2 rounded-md"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isModalOpen4 && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
          <div className="bg-white p-5 rounded-md shadow-md w-2/3">
            <h2 className="text-xl font-semibold mb-4">
              Bulk Approve Leave Applications by Filters
            </h2>
            <div className="grid md:grid-cols-3 gap-5 mt-5">
              <div className="grid gap-2 items-center w-full">
                <label
                  htmlFor="departmentName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Leave Categories
                </label>
                <select
                  type="text"
                  id="departmentName"
                  className="mt-1 block w-full border border-gray-400 p-2 rounded-md"
                  placeholder="Enter Branch Location"
                >
                  <option value="">Paid Leave</option>
                  <option value="">LWP</option>
                </select>
              </div>
              <div className="grid gap-2 items-center w-full ">
                <label
                  htmlFor="headOfDepartment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Leave Status
                </label>
                <select
                  id="headOfDepartment"
                  // value={headOfDepartment}
                  // onChange={(e) => setHeadOfDepartment(e.target.value)}
                  className="mt-1 block w-full border border-gray-400 p-2 rounded-md"
                >
                  <option value="" disabled>
                    Level 1 Approval Pending
                  </option>
                  <option value="" disabled>
                    Level 2 Approval Pending
                  </option>
                </select>
              </div>
              <div className="grid gap-2 items-center w-full ">
                <label
                  htmlFor="headOfDepartment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-400 p-2 rounded-md"
                />
              </div>
              <div className="grid gap-2 items-center w-full ">
                <label
                  htmlFor="headOfDepartment"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-400 p-2 rounded-md"
                />
              </div>
              <div className="grid gap-2 items-center w-full ">
                <label
                  htmlFor="headOfDepartment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Employee Status
                </label>
                <select
                  id="headOfDepartment"
                  // value={headOfDepartment}
                  // onChange={(e) => setHeadOfDepartment(e.target.value)}
                  className="mt-1 block w-full border border-gray-400 p-2 rounded-md"
                >
                  <option value="" disabled>
                    Imcomplete
                  </option>
                  <option value="" disabled>
                    Active
                  </option>
                </select>
              </div>
              <div className="grid gap-2 items-center w-full ">
                <label
                  htmlFor="headOfDepartment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Employee Department
                </label>
                <select
                  id="headOfDepartment"
                  // value={headOfDepartment}
                  // onChange={(e) => setHeadOfDepartment(e.target.value)}
                  className="mt-1 block w-full border border-gray-400 p-2 rounded-md"
                >
                  <option value="" disabled>
                    HR
                  </option>
                  <option value="" disabled>
                    Developer
                  </option>
                  <option value="">Driver</option>
                </select>
              </div>
            </div>
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => setIsModalOpen4(false)}
                className="bg-gray-300 text-gray-700 p-2 rounded-md mr-2"
              >
                Clear
              </button>
              <button
                // onClick={handleAddDepartment}
                className="bg-blue-500 text-white p-2 rounded-md"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalOpen5 && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="">
              <div className="mt-3  sm:mt-0 sm:ml-1 ">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900 mb-4"
                  id="modal-headline"
                >
                  Are you sure?
                </h3>

                <p>
                  Are you sure you would like to reject the selected leave
                  requests?
                </p>
                <div className="mb-4">
                  <label
                    htmlFor="reason"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Approver Comment
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows="3"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                    // placeholder="Enter your reason for leave"
                  ></textarea>
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => setIsModalOpen5(false)}
                  className="bg-gray-300 text-gray-700 p-2 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  // onClick={handleAddDepartment}
                  className="bg-blue-500 text-white p-2 rounded-md"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isModalOpen6 && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
          <div className="bg-white p-5 rounded-md shadow-md w-2/3">
            <h2 className="text-xl font-semibold mb-4">
              Bulk Reject Leave Applications by Filters
            </h2>
            <div className="grid md:grid-cols-3 gap-5 mt-5">
              <div className="grid gap-2 items-center w-full">
                <label
                  htmlFor="departmentName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Leave Categories
                </label>
                <select
                  type="text"
                  id="departmentName"
                  className="mt-1 block w-full border border-gray-400 p-2 rounded-md"
                  placeholder="Enter Branch Location"
                >
                  <option value="">Paid Leave</option>
                  <option value="">LWP</option>
                </select>
              </div>
              <div className="grid gap-2 items-center w-full ">
                <label
                  htmlFor="headOfDepartment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Leave Status
                </label>
                <select
                  id="headOfDepartment"
                  // value={headOfDepartment}
                  // onChange={(e) => setHeadOfDepartment(e.target.value)}
                  className="mt-1 block w-full border border-gray-400 p-2 rounded-md"
                >
                  <option value="" disabled>
                    Level 1 Approval Pending
                  </option>
                  <option value="" disabled>
                    Level 2 Approval Pending
                  </option>
                </select>
              </div>
              <div className="grid gap-2 items-center w-full ">
                <label
                  htmlFor="headOfDepartment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-400 p-2 rounded-md"
                />
              </div>
              <div className="grid gap-2 items-center w-full ">
                <label
                  htmlFor="headOfDepartment"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-400 p-2 rounded-md"
                />
              </div>
              <div className="grid gap-2 items-center w-full ">
                <label
                  htmlFor="headOfDepartment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Employee Status
                </label>
                <select
                  id="headOfDepartment"
                  // value={headOfDepartment}
                  // onChange={(e) => setHeadOfDepartment(e.target.value)}
                  className="mt-1 block w-full border border-gray-400 p-2 rounded-md"
                >
                  <option value="" disabled>
                    Imcomplete
                  </option>
                  <option value="" disabled>
                    Active
                  </option>
                </select>
              </div>
              <div className="grid gap-2 items-center w-full ">
                <label
                  htmlFor="headOfDepartment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Employee Department
                </label>
                <select
                  id="headOfDepartment"
                  // value={headOfDepartment}
                  // onChange={(e) => setHeadOfDepartment(e.target.value)}
                  className="mt-1 block w-full border border-gray-400 p-2 rounded-md"
                >
                  <option value="" disabled>
                    HR
                  </option>
                  <option value="" disabled>
                    Developer
                  </option>
                  <option value="">Driver</option>
                </select>
              </div>
            </div>
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => setIsModalOpen6(false)}
                className="bg-gray-300 text-gray-700 p-2 rounded-md mr-2"
              >
                Clear
              </button>
              <button
                // onClick={handleAddDepartment}
                className="bg-blue-500 text-white p-2 rounded-md"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalOpen7 && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="">
              <div className="mt-3  sm:mt-0 sm:ml-1 ">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900 mb-4"
                  id="modal-headline"
                >
                  Are you sure?
                </h3>

                <p>
                  Are you sure you would like to Approve Leave Cancellation for
                  selected leave requests?
                </p>
                <div className="mb-4">
                  <label
                    htmlFor="reason"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Approver Comment
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows="3"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                    // placeholder="Enter your reason for leave"
                  ></textarea>
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => setIsModalOpen7(false)}
                  className="bg-gray-300 text-gray-700 p-2 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  // onClick={handleAddDepartment}
                  className="bg-blue-500 text-white p-2 rounded-md"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isModalOpen8 && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="">
              <div className="mt-3  sm:mt-0 sm:ml-1 ">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900 mb-4"
                  id="modal-headline"
                >
                  Are you sure?
                </h3>

                <p>
                  Are you sure you would like to Reject Leave Cancellation for
                  selected leave requests?
                </p>
                <div className="mb-4">
                  <label
                    htmlFor="reason"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Approver Comment
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows="3"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                    // placeholder="Enter your reason for leave"
                  ></textarea>
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => setIsModalOpen8(false)}
                  className="bg-gray-300 text-gray-700 p-2 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  // onClick={handleAddDepartment}
                  className="bg-blue-500 text-white p-2 rounded-md"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LeaveCompleted;
