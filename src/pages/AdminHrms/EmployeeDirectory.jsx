import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import AdminHRMS from "./AdminHrms";
import { Link } from "react-router-dom";
import { PiPlusCircle } from "react-icons/pi";
// import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import InviteEmployeeModal from "./InviteEmployeeModal";
import { getAllHrmsOrganisation, getMyHRMSEmployees } from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";

// const employeesData = [
//   {
//     id: 1,
//     name: "Ajay Baniya",
//     code: "BPC13",
//     doj: "12-12-2022",
//     role: "Digital Marketer",
//     department: "Marketing",
//     status: "Active",
//     phone: "+91-9004753837",
//     email: "ajaybaniya0001@gmail.com",
//     location: "Mumbai",
//   },
//   {
//     id: 2,
//     name: "Aniket Parkar",
//     code: "BPC3",
//     doj: "02-09-2019",
//     role: "Business & Operations",
//     department: "Operations",
//     status: "Active",
//     phone: "+91-9004753838",
//     email: "aniketparkar@gmail.com",
//     location: "Mumbai",
//   },
//   {
//     id: 3,
//     name: "Akhil Parkar",
//     code: "BPC3",
//     doj: "02-09-2019",
//     role: "Business & Operations",
//     department: "Operations",
//     status: "Active",
//     phone: "+91-9004753838",
//     email: "aniketparkar@gmail.com",
//     location: "Mumbai",
//   },
//   {
//     id: 3,
//     name: "Mittu Panda",
//     code: "BPC3",
//     doj: "02-09-2019",
//     role: "Business & Operations",
//     department: "Operations",
//     status: "Active",
//     phone: "+91-9004753838",
//     email: "aniketparkar@gmail.com",
//     location: "Mumbai",
//   },
//   // Add more employee data here...
// ];

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

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
    setSelectedEmployee(null); // Deselect employee if a new letter is selected
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
    // Add more colors if needed
    return colors[Math.floor(Math.random() * colors.length)];
  }

  const randomColor = getRandomColor();
  return (
    <div className=" w-full">
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
                {/* <button
            type="submit"
            className="bg-black text-white hover:bg-gray-700 font-semibold py-2 px-4 rounded"
          >
            Actions
          </button> */}
                <div className="relative inline-block text-left">
                  <button
                    onClick={toggleDropdown}
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                  >
                    Actions
                    <svg
                      className="-mr-1 ml-2 h-5 w-5"
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

                  {isOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
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
                            Upload Investments
                          </button>
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          {/* Upload Statutory Settings */}
                          <button onClick={() => setIsModalOpen2(true)}>
                            Upload Statutory Settings
                          </button>
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          {/* Upload Documents */}
                          <button onClick={() => setIsModalOpen3(true)}>
                            Upload Documents
                          </button>
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          {/* Bulk Update Employee Data */}
                          <button onClick={() => setIsModalOpen4(true)}>
                            Bulk Update Employee Data
                          </button>
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          {/* Bulk Add New Employees */}
                          <button onClick={() => setIsModalOpen5(true)}>
                            Bulk Add New Employees
                          </button>
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          <button onClick={() => setIsModalOpen5(true)}>
                            Bulk Add New Self Onboard Employees
                          </button>
                        </a>
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
                      {/* <p>Includes all your Employees with their available details.

</p> */}

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
                  className="border-2 font-semibold hover:bg-black hover:text-white duration-150 transition-all border-white p-2 rounded-md text-white cursor-pointer text-center flex items-center  gap-2 justify-center"
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
        <div className="flex justify-between h-screen">
          <div className="w-full p-4 flex flex-wrap overflow-y-auto mt-2 ml-20">
            {alphabet.map((letter) => (
              <div key={letter} id={letter} className="w-full">
                {selectedLetter === null || selectedLetter === letter ? (
                  <>
                    <h2 className="text-2xl font-semibold mb-4">{letter}</h2>
                    <div className="flex flex-wrap">
                      {groupedEmployees[letter]?.map((employee) => (
                        <div
                          key={employee.id}
                          className="bg-white w-64  p-2 m-2 rounded-lg border cursor-pointer"
                          onClick={() => setSelectedEmployee(employee)}
                        >
                          <div className="flex items-center">
                            <div
                              className="bg-gray-300 rounded-full text-white h-12 w-12 flex items-center font-medium justify-center mr-4"
                              style={{ backgroundColor: randomColor }}
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
                              {/* <Link><BiEdit size={15}/></Link> */}
                              <div className="flex items-center  gap-2 mt-2">
                                <Link to={`/hrms/employee-directory-Personal`}>
                                  <BiEdit />
                                </Link>{" "}
                                <button>
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
          <div className="w-10 bg-white text-black p-4">
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
          <div className="w-96 p-4 bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Employee Details</h1>
            {selectedEmployee ? (
              <div>
                <h2 className="text-2xl font-bold">{selectedEmployee.name}</h2>
                <p>Department: {selectedEmployee.department}</p>
                <p>Role: {selectedEmployee.role}</p>
                <p>Status: {selectedEmployee.status}</p>
                <p>Location: {selectedEmployee.location}</p>
                <p>Phone: {selectedEmployee.mobile}</p>
                <p>Email: {selectedEmployee.email_id}</p>
                <button
                  type="submit"
                  className="bg-black w-full mb-4 text-white mt-2 hover:bg-gray-700 font-semibold py-2 px-4 rounded"
                >
                  View Profile
                </button>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-black text-white hover:bg-gray-700 font-semibold py-2 px-4 rounded"
                  >
                    Separate
                  </button>
                  <button
                    type="submit"
                    className="bg-black text-white hover:bg-gray-700 font-semibold py-2 px-4 rounded"
                  >
                    Hold
                  </button>
                  <button
                    type="submit"
                    className="bg-black text-white hover:bg-gray-700 font-semibold py-2 px-4 rounded"
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            ) : (
              <p>Select an employee to see details</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDirectory;
