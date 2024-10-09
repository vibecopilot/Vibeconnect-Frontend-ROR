import React, { useEffect, useRef, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { FaChevronDown, FaTrash, FaUserEdit } from "react-icons/fa";
import AdminHRMS from "./AdminHrms";
import { Link } from "react-router-dom";
import { PiPlusCircle } from "react-icons/pi";
// import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import InviteEmployeeModal from "./InviteEmployeeModal";
import {
  deleteHRMSEmployee,
  getMyHRMSEmployees,
  getUserDetails,
} from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";

function EmployeeDirectory() {
  const themeColor = useSelector((state) => state.theme.color);
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [isModalOpen4, setIsModalOpen4] = useState(false);
  const [isModalOpen5, setIsModalOpen5] = useState(false);
  const [isModalOpen6, setIsModalOpen6] = useState(false);
  const [isModalOpen7, setIsModalOpen7] = useState(false);
  const [isModalOpen8, setIsModalOpen8] = useState(false);
  const [isModalOpen9, setIsModalOpen9] = useState(false);
  const [isModalOpen10, setIsModalOpen10] = useState(false);
  const [isModalOpen11, setIsModalOpen11] = useState(false);
  const [employeesData, setEmployeesData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [selectedLetter, setSelectedLetter] = useState(null);
  console.log(selectedEmployee);
  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        const res = await getMyHRMSEmployees(hrmsOrgId);
        setEmployeesData(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllEmployees();
  }, []);

  const groupedEmployees = employeesData.reduce((acc, employee) => {
    const firstLetter = employee.first_name[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(employee);
    return acc;
  }, {});

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const alphabet = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`.split("");
  // const alphabet = ["All", ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("")];

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
    console.log(letter);
    setSelectedEmployee(null);
  };

  const filteredEmployees = selectedLetter
    ? groupedEmployees[selectedLetter] || []
    : employeesData;

  function getRandomColor() {
    const colors = [
      "#8B0000",
      "#FF4500",
      "#2E8B57",
      "#4682B4",
      "#6A5ACD",
      "#D2691E",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  const randomColor = getRandomColor();
  const colors = [
    // "#8B0000",
    "#FF4500",
    "#2E8B57",
    "#4682B4",
    "#6A5ACD",
    "#D2691E",
  ];

  function getColorForEmployee(index) {
    return colors[index % colors.length];
  }

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState("");

  const handleDeleteModal = (empId) => {
    setIsDeleteModalOpen(true);
    setEmployeeId(empId);
  };
  const handleDeleteEmployee = async () => {
    try {
      await deleteHRMSEmployee(employeeId);
    } catch (error) {
      console.log(error);
    }
  };

  const showEmployeeDetails = async (empId) => {
    setEmployeeId(empId);
    try {
      const res = await getUserDetails(empId);
      setSelectedEmployee(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      <AdminHRMS />
      <div className="flex flex-col ">
        <div className="">
          <header
            style={{ background: themeColor }}
            className=" text-white  py-4 ml-20"
          >
            <h1 className="text-3xl pl-5 font-bold">Employee Directory</h1>
            <p className="pl-5">
              Employee personal details are noted under this section.
            </p>
            <div className="flex justify-end  gap-2 mb-1">
              <input
                type="text"
                placeholder="Search by Name / Code"
                className="border p-2 text-black rounded w-1/3"
              />
              <div className="flex gap-3">
                <div className="relative inline-block text-left">
                  <button
                    onClick={toggleDropdown}
                    className=" justify-center w-full flex items-center gap-2 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                  >
                    Actions
                    <FaChevronDown />
                  </button>

                  {isOpen && (
                    <div
                      ref={dropdownRef}
                      className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                    >
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <p
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          <button onClick={() => setIsModalOpen1(true)}>
                            Upload Investments
                          </button>
                        </p>
                        <p
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          {/* Upload Statutory Settings */}
                          <button onClick={() => setIsModalOpen2(true)}>
                            Upload Statutory Settings
                          </button>
                        </p>
                        <p
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          {/* Upload Documents */}
                          <button onClick={() => setIsModalOpen3(true)}>
                            Upload Documents
                          </button>
                        </p>
                        <p
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          {/* Bulk Update Employee Data */}
                          <button onClick={() => setIsModalOpen4(true)}>
                            Bulk Update Employee Data
                          </button>
                        </p>
                        <p
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          {/* Bulk Add New Employees */}
                          <button onClick={() => setIsModalOpen5(true)}>
                            Bulk Add New Employees
                          </button>
                        </p>
                        <p
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          <button onClick={() => setIsModalOpen5(true)}>
                            Bulk Add New Self Onboard Employees
                          </button>
                        </p>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          <button onClick={() => setIsModalOpen6(true)}>
                            Bulk Add Employee Multi-row Data
                          </button>
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          {/* Bulk Update Payment Information */}
                          <button onClick={() => setIsModalOpen7(true)}>
                            Bulk Update Payment Information
                          </button>
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          {/* Bulk Add Employees Contract */}
                          <button onClick={() => setIsModalOpen8(true)}>
                            Bulk Add Employees Contract
                          </button>
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          {/* Upload Perqs */}
                          <button onClick={() => setIsModalOpen9(true)}>
                            Upload Perqs
                          </button>
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          {/* Bulk Termination */}
                          <button onClick={() => setIsModalOpen10(true)}>
                            Bulk Termination
                          </button>
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          <button onClick={() => setIsModalOpen11(true)}>
                            {" "}
                            Invite Employees
                          </button>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                <InviteEmployeeModal
                  isOpen={isModalOpen11}
                  onClose={() => setIsModalOpen11(false)}
                />
                {isModalOpen1 && (
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
                    <div className="bg-white text-black p-5 rounded-md shadow-md w-2/3">
                      <h2 className="text-xl font-semibold mb-4">
                        Upload Employee Investment Declarations for 2024-2025
                      </h2>
                      <p className="font-bold">
                        Step 1: Select type of upload *
                      </p>
                      <p>
                        Declared Investment Declarations - Upload all the
                        Investment Details declared by your employees.
                      </p>
                      <p>
                        Verified Investment Declarations - Upload all the
                        employee Investment Details that have been physically
                        verified.
                      </p>
                      <select
                        name=""
                        id=""
                        className="border p-2 border-black w-full mt-2 rounded-md"
                      >
                        <option value="">Select type of Upload</option>
                        <option value="">
                          Declared Investment Declarations
                        </option>
                        <option value="">
                          Verified Investment Declarations
                        </option>
                      </select>
                      <p className="mt-2 font-bold">
                        Step 2: Download the investments global format
                      </p>
                      <p>
                        Include the investment declarations of all employees.
                      </p>
                      <button
                        style={{ background: themeColor }}
                        className="font-semibold py-2 px-4 rounded text-white mt-2"
                      >
                        Download
                      </button>
                      <p className="fonr-bold mb-2 mt-2">
                        Step 3: Make the necessary changes in the downloaded
                        format template and upload *
                      </p>
                      <FileInputBox />
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setIsModalOpen1(false)}
                          style={{ background: themeColor }}
                          className="font-semibold py-2 px-4 rounded text-white mt-2"
                        >
                          Cancel
                        </button>
                        <button
                          style={{ background: themeColor }}
                          className="font-semibold py-2 px-4 rounded text-white mt-2"
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {isModalOpen4 && (
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
                    <div className="bg-white text-black p-5 rounded-md shadow-md w-2/3">
                      <h2 className="text-xl font-semibold mb-4">
                        Upload Employee Information
                      </h2>
                      <p className="font-bold">
                        Step 1: Select what data you want to update
                      </p>

                      <select
                        name=""
                        id=""
                        className="border p-2 border-black w-full mt-2 rounded-md"
                      >
                        <option value="">Select Sections</option>
                        <option value="">Salary Info</option>
                        <option value="">Address Info</option>{" "}
                      </select>
                      <p className="mt-2 font-bold">
                        Step 2: Download employee information global format
                      </p>
                      <p>
                        Includes all your Employees with their available
                        details.
                      </p>
                      <button
                        style={{ background: themeColor }}
                        className="font-semibold py-2 px-4 rounded text-white mt-2"
                      >
                        Download
                      </button>
                      <p className="fonr-bold mb-2 mt-2">
                        Step 3: Make the necessary changes in the downloaded
                        file and upload *
                      </p>
                      <FileInputBox />
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setIsModalOpen4(false)}
                          style={{ background: themeColor }}
                          className="font-semibold py-2 px-4 rounded text-white mt-2"
                        >
                          Cancel
                        </button>
                        <button
                          style={{ background: themeColor }}
                          className="font-semibold py-2 px-4 rounded text-white mt-2"
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {isModalOpen2 && (
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
                    <div className="bg-white text-black p-5 rounded-md shadow-md w-2/3">
                      <h2 className="text-xl font-semibold mb-4">
                        Upload Employee Statutory Setting
                      </h2>
                      <p className="font-bold">
                        Step 1: Download employee information global format
                      </p>

                      <button
                        style={{ background: themeColor }}
                        className="font-semibold py-2 px-4 rounded text-white mt-2"
                      >
                        Download
                      </button>
                      <p className="fonr-bold mb-2 mt-2">
                        Step 2: Make the necessary changes in the downloaded
                        file and upload *
                      </p>
                      <FileInputBox />
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setIsModalOpen2(false)}
                          style={{ background: themeColor }}
                          className="font-semibold py-2 px-4 rounded text-white mt-2"
                        >
                          Cancel
                        </button>
                        <button
                          style={{ background: themeColor }}
                          className="font-semibold py-2 px-4 rounded text-white mt-2"
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {isModalOpen5 && (
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
                    <div className="bg-white text-black p-5 rounded-md shadow-md w-2/3">
                      <h2 className="text-xl font-semibold mb-4">
                        Upload Employee Information
                      </h2>
                      <p className="font-bold">
                        Step 1: Download employee information global format
                      </p>

                      <button
                        style={{ background: themeColor }}
                        className="font-semibold py-2 px-4 rounded text-white mt-2"
                      >
                        Download
                      </button>
                      <p className="fonr-bold mb-2 mt-2">
                        Step 2: Make the necessary changes in the downloaded
                        file and upload *
                      </p>
                      <FileInputBox />
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setIsModalOpen5(false)}
                          style={{ background: themeColor }}
                          className="font-semibold py-2 px-4 rounded text-white mt-2"
                        >
                          Cancel
                        </button>
                        <button
                          style={{ background: themeColor }}
                          className="font-semibold py-2 px-4 rounded text-white mt-2"
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {isModalOpen6 && (
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
                    <div className="bg-white text-black p-5 rounded-md shadow-md w-2/3">
                      <h2 className="text-xl font-semibold mb-4">
                        Upload Employee Information
                      </h2>
                      <p className="font-bold">
                        Step 1: Select what data you want to update *
                      </p>
                      <select
                        className="border p-2 border-black mt-2 mb-2 rounded-md w-full"
                        name=""
                        id=""
                      >
                        <option value="">Select Custom Multi-Row Table</option>
                      </select>
                      <p className="font-bold">
                        Step 2: Download employee information global format
                      </p>
                      <p>
                        Includes all your Employees with their available
                        details.
                      </p>

                      <button
                        style={{ background: themeColor }}
                        className="font-semibold py-2 px-4 rounded text-white mt-2"
                      >
                        Download
                      </button>
                      <p className="fonr-bold mb-2 mt-2">
                        Step 3: Make the necessary changes in the downloaded
                        file and upload *
                      </p>
                      <FileInputBox />
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setIsModalOpen6(false)}
                          style={{ background: themeColor }}
                          className="font-semibold py-2 px-4 rounded text-white mt-2"
                        >
                          Cancel
                        </button>
                        <button
                          style={{ background: themeColor }}
                          className="font-semibold py-2 px-4 rounded text-white mt-2"
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {isModalOpen7 && (
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
                    <div className="bg-white text-black p-5 rounded-md shadow-md w-2/3">
                      <h2 className="text-xl font-semibold mb-4">
                        Upload Employee Payment Information
                      </h2>
                      <p className="font-bold">
                        Step 1: Download employee information global format
                      </p>
                      <p>
                        Includes all your Employees with their available
                        details.
                      </p>

                      <button
                        style={{ background: themeColor }}
                        className="font-semibold py-2 px-4 rounded text-white mt-2"
                      >
                        Download
                      </button>
                      <p className="fonr-bold mb-2 mt-2">
                        Step 2: Make the necessary changes in the downloaded
                        file and upload *
                      </p>
                      <FileInputBox />
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setIsModalOpen7(false)}
                          style={{ background: themeColor }}
                          className="font-semibold py-2 px-4 rounded text-white mt-2"
                        >
                          Cancel
                        </button>
                        <button
                          style={{ background: themeColor }}
                          className="font-semibold py-2 px-4 rounded text-white mt-2"
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {isModalOpen8 && (
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
                    <div className="bg-white text-black p-5 rounded-md shadow-md w-2/3">
                      <h2 className="text-xl font-semibold mb-4">
                        Upload Employee Contract Data
                      </h2>
                      <p className="font-bold">
                        Step 1: Download employee information global format
                      </p>
                      <p>
                        Includes all your Employees with their available
                        details.
                      </p>

                      <button
                        style={{ background: themeColor }}
                        className="font-semibold py-2 px-4 rounded text-white mt-2"
                      >
                        Download
                      </button>
                      <p className="fonr-bold mb-2 mt-2">
                        Step 2: Make the necessary changes in the downloaded
                        file and upload *
                      </p>
                      <FileInputBox />
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setIsModalOpen8(false)}
                          style={{ background: themeColor }}
                          className="font-semibold py-2 px-4 rounded text-white mt-2"
                        >
                          Cancel
                        </button>
                        <button
                          style={{ background: themeColor }}
                          className="font-semibold py-2 px-4 rounded text-white mt-2"
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {isModalOpen9 && (
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
                    <div className="bg-white text-black p-5 rounded-md shadow-md w-2/3">
                      <h2 className="text-xl font-semibold mb-4">
                        Upload Employee Perqs for 2024-2025
                      </h2>
                      <p className="font-bold">
                        Step 1: Download employee information global format
                      </p>
                      {/* <p>Includes all your Employees with their available details.</p> */}

                      <button
                        style={{ background: themeColor }}
                        className="font-semibold py-2 px-4 rounded text-white mt-2"
                      >
                        Download
                      </button>
                      <p className="fonr-bold mb-2 mt-2">
                        Step 2: Make the necessary changes in the downloaded
                        file and upload *
                      </p>
                      <FileInputBox />
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setIsModalOpen9(false)}
                          style={{ background: themeColor }}
                          className="font-semibold py-2 px-4 rounded text-white mt-2"
                        >
                          Cancel
                        </button>
                        <button
                          style={{ background: themeColor }}
                          className="font-semibold py-2 px-4 rounded text-white mt-2"
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {isModalOpen10 && (
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
                    <div className="bg-white text-black p-5 rounded-md shadow-md w-2/3">
                      <h2 className="text-xl font-semibold mb-4">
                        Bulk Termination
                      </h2>
                      <p className="font-bold">
                        Step 1: Download employee information global format
                      </p>
                      <p>
                        Includes all your Employees with their available
                        details.
                      </p>

                      <button
                        style={{ background: themeColor }}
                        className="font-semibold py-2 px-4 rounded text-white mt-2"
                      >
                        Download
                      </button>
                      <p className="fonr-bold mb-2 mt-2">
                        Step 2: Make the necessary changes in the downloaded
                        file and upload *
                      </p>
                      <FileInputBox />
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setIsModalOpen10(false)}
                          style={{ background: themeColor }}
                          className="font-semibold py-2 px-4 rounded text-white mt-2"
                        >
                          Cancel
                        </button>
                        <button
                          style={{ background: themeColor }}
                          className="font-semibold py-2 px-4 rounded text-white mt-2"
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {isModalOpen3 && (
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
                    <div className="bg-white text-black p-5 rounded-md shadow-md w-1/3">
                      <h2 className="text-xl font-semibold mb-4">
                        Bulk Upload Employee Documents
                      </h2>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="grid gap-2">
                          <label htmlFor="">Select Document Type *</label>
                          <select
                            className="border p-2 border-black rounded-md"
                            name=""
                            id=""
                          >
                            <option value="">Select</option>
                          </select>
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="">Document name format *</label>
                          <select
                            className="border p-2 border-black rounded-md"
                            name=""
                            id=""
                          >
                            <option value="">Select</option>
                            <option value="">PAN</option>
                            <option value="">Aadhar</option>
                          </select>
                        </div>
                      </div>
                      {/* <p className='font-bold'>Step 1: Download employee information global format</p> */}

                      {/* <button style={{ background: themeColor }} className='font-semibold py-2 px-4 rounded text-white mt-2'>Download</button> */}
                      <p className="fonr-bold mb-2 mt-2">Upload Documents *</p>
                      <FileInputBox />

                      <p>Acceptable format: .zip</p>
                      <label htmlFor="">Notify Employees by Email</label>
                      <div className="flex gap-4">
                        <div className="flex gap-2">
                          <input name="group1" type="radio" />
                          <label htmlFor="">Yes</label>
                        </div>
                        <div className="flex gap-2">
                          <input name="group1" type="radio" />
                          <label htmlFor="">No</label>
                        </div>
                      </div>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setIsModalOpen3(false)}
                          style={{ background: themeColor }}
                          className="font-semibold py-2 px-4 rounded text-white mt-2"
                        >
                          Cancel
                        </button>
                        <button
                          style={{ background: themeColor }}
                          className="font-semibold py-2 px-4 rounded text-white mt-2"
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-black text-white hover:bg-gray-700 font-semibold py-2 px-4 rounded"
                >
                  Filter
                </button>
                <Link
                  to={"/admin/add-employee/basics"}
                  className="border-2 font-semibold hover:bg-black hover:text-white duration-150 transition-all border-white p-2 rounded-md text-white cursor-pointer text-center flex items-center  gap-2 justify-center mr-1"
                >
                  <PiPlusCircle size={20} />
                  Add Employee
                </Link>
              </div>
            </div>
          </header>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
            <div className="bg-white p-5 rounded-md shadow-md w-1/3">
              {/* <h2 className="text-xl font-semibold mb-4">Add Department</h2> */}
              <div className="mb-4">
                <label
                  htmlFor="departmentName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Branch Location
                </label>
                <select
                  type="text"
                  id="departmentName"
                  // value={departmentName}
                  // onChange={(e) => setDepartmentName(e.target.value)}
                  className="mt-1 block w-full border border-gray-400 p-2 rounded-md"
                  // placeholder="Enter Department Name"
                >
                  <option value="">Mumbai</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="headOfDepartment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Joining Month
                </label>
                <select
                  id="headOfDepartment"
                  // value={headOfDepartment}
                  // onChange={(e) => setHeadOfDepartment(e.target.value)}
                  className="mt-1 block w-full border border-gray-400 p-2 rounded-md"
                >
                  <option value="" disabled>
                    January
                  </option>
                </select>
              </div>
              <div className="mb-4">
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
                    pending
                  </option>
                </select>
              </div>
              <div className="mb-4">
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
                </select>
              </div>
              <div className="flex justify-end">
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
        <div className="flex  h-screen ">
          <div className=" p-4 flex flex-wrap overflow-y-auto mt-2 ml-20 w-full ">
            {alphabet.map((letter) => (
              <div key={letter} id={letter} className="w-full">
                {selectedLetter === null || selectedLetter === letter ? (
                  <>
                    <h2 className="text-xl rounded-xl font-semibold mb-4">
                      {letter}
                    </h2>
                    <div className="flex flex-wrap">
                      {groupedEmployees[letter]?.map((employee, index) => (
                        <div
                          key={employee.id}
                          className={`${
                            employeeId === employee.id
                              ? "bg-gray-100"
                              : "bg-white"
                          }  w-64 p-2 m-2 rounded-lg border cursor-pointer`}
                          // className="bg-white w-64 p-2 m-2 rounded-lg border cursor-pointer"
                          // onClick={() => setEmployeeId(employee.id)}
                          onClick={() => {
                            showEmployeeDetails(employee.id);
                          }}
                        >
                          <div className="flex items-center">
                            <div
                              className="bg-gray-300 rounded-full text-white h-12 w-12 flex items-center font-medium justify-center mr-4"
                              style={{
                                backgroundColor: getColorForEmployee(index),
                              }}
                            >
                              {employee.first_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <h2 className=" font-bold">
                                {employee.first_name}
                              </h2>
                              <p className="text-sm font-medium">
                                DOJ: 12-12-2022
                              </p>
                              <p>{employee.role}</p>

                              <p className="text-green-500">
                                {employee.status}
                              </p>

                              <div className="flex items-center  gap-4 mt-2">
                                <Link
                                  to={`/hrms/employee-directory-Personal/${employee.id}`}
                                >
                                  <BiEdit size={18} />
                                </Link>{" "}
                                <button
                                  onClick={() => handleDeleteModal(employee.id)}
                                >
                                  <FaTrash size={15} className="text-red-400" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            ))}
          </div>
          <div className="w-10 bg-white text-black p-4 max-h-fit overflow-y-auto hide-scrollbar">
            <div className="flex flex-col">
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleLetterClick(letter)}
                  className=" p-1 text-sm "
                  title={letter}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
          <div className="w-[30rem] max-h-[30rem] p-4 bg-gray-100 m-1 rounded-xl">
            <h1 className="text-2xl font-semibold mb-4">Employee Details</h1>
            {selectedEmployee ? (
              <div className="flex flex-col gap-10 h-96">
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl text-center font-medium mb-2 border-b border-dashed border-gray-300">
                    {selectedEmployee?.employee?.first_name}{" "}
                    {selectedEmployee?.employee?.last_name}
                    {/* {selectedEmployee.first_name} {selectedEmployee.last_name} */}
                  </h2>

                  <p className="grid grid-cols-2">
                    <span className="font-medium text-sm">
                      Branch Location :
                    </span>{" "}
                    <span className="font-medium text-sm">
                      
                        <p>{selectedEmployee?.employment_info?.branch_location}</p>
                      
                    </span>
                  </p>
                  <p className="grid grid-cols-2">
                    <span className="font-medium text-sm">Phone : </span>{" "}
                    <span className="font-medium text-sm">
                      {selectedEmployee?.employee?.mobile}
                    </span>
                  </p>
                  <p className="grid grid-cols-2">
                    <span className="font-medium text-sm">Email :</span>{" "}
                    <span className="font-medium text-sm w-[10rem] break-words">
                      {selectedEmployee?.employee?.email_id}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <Link
                    to={`/hrms/employee-directory-Personal/${selectedEmployee?.employee?.id}`}
                    className="border-2 rounded-full w-full  text-green-400 border-green-400 mt-2 hover:bg-green-50 fov font-semibold py-1 px-4 flex items-center gap-2 justify-center"
                  >
                    <FaUserEdit /> View Profile
                  </Link>
                  <div className="flex justify-center gap-3">
                    <button
                      type="submit"
                      style={{ background: themeColor }}
                      className="bg-black text-white hover:bg-gray-700 py-2 px-4 rounded-full"
                    >
                      Separate
                    </button>
                    <button
                      type="submit"
                      className="bg-yellow-500 text-white hover:bg-gray-700  py-2 px-5 rounded-full"
                    >
                      Hold
                    </button>
                    <button
                      type="submit"
                      className="bg-red-500 text-sm font-medium text-white hover:bg-gray-700  py-2 px-4 rounded-full"
                    >
                      Deactivate
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p>Select an employee to see details</p>
            )}
          </div>
        </div>
      </div>
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-sm z-20">
          <div className="bg-white overflow-auto max-h-[70%]  md:w-auto w-96 p-4 px-8 flex flex-col rounded-md gap-5">
            <h2 className="font-medium border-b border-gray-400">
              Do you really want to delete this Employee?
            </h2>
            <div className="flex items-center justify-end gap-2">
              <button
                className="bg-green-400 text-white rounded-full p-1 px-4 font-medium"
                onClick={handleDeleteEmployee}
              >
                Confirm
              </button>
              <button
                className="bg-red-400 text-white rounded-full p-1 px-4 font-medium"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeDirectory;
