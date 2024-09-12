import React, { useState } from "react";
import AdminHRMS from "./AdminHrms";
import { useSelector } from "react-redux";
import { FaChevronLeft, FaChevronRight, FaRedo } from "react-icons/fa";
import ToggleSwitch from "../../Buttons/ToggleSwitch";
import EmployeeDetailView from "./EmployeeDetailView";

// Sample data for employees and their attendance
const employees = [
  {
    id: 1,
    name: "Vinayak Kapdoskar",
    avatar: "path_to_avatar_image",
    attendance: ["ABSENT", "ABSENT", "ABSENT", "ABSENT", "ABSENT", "", ""],
  },
  {
    id: 2,
    name: "Salome Kulangara",
    avatar: "path_to_avatar_image",
    attendance: ["ABSENT", "ABSENT", "ABSENT", "ABSENT", "ABSENT", "", ""],
  },
  {
    id: 3,
    name: "Ankit Nima",
    avatar: "path_to_avatar_image",
    attendance: ["ABSENT", "ABSENT", "ABSENT", "ABSENT", "ABSENT", "", ""],
  },
  {
    id: 4,
    name: "Raj Nima",
    avatar: "path_to_avatar_image",
    attendance: ["ABSENT", "ABSENT", "ABSENT", "ABSENT", "ABSENT", "", ""],
  },
  {
    id: 5,
    name: "Viraj Nima",
    avatar: "path_to_avatar_image",
    attendance: ["ABSENT", "ABSENT", "ABSENT", "ABSENT", "ABSENT", "", ""],
  },
  {
    id: 6,
    name: "sachin Nima",
    avatar: "path_to_avatar_image",
    attendance: ["ABSENT", "ABSENT", "ABSENT", "ABSENT", "ABSENT", "", ""],
  },
  {
    id: 7,
    name: "virat Nima",
    avatar: "path_to_avatar_image",
    attendance: ["ABSENT", "ABSENT", "ABSENT", "ABSENT", "ABSENT", "", ""],
  },
  {
    id: 8,
    name: "Ankit Nima",
    avatar: "path_to_avatar_image",
    attendance: ["ABSENT", "ABSENT", "ABSENT", "ABSENT", "ABSENT", "", ""],
  },
  {
    id: 9,
    name: "vikas Nima",
    avatar: "path_to_avatar_image",
    attendance: ["ABSENT", "ABSENT", "ABSENT", "ABSENT", "ABSENT", "", ""],
  },
  {
    id: 10,
    name: "rahul Nima",
    avatar: "path_to_avatar_image",
    attendance: ["ABSENT", "ABSENT", "ABSENT", "ABSENT", "ABSENT", "", ""],
  },
  {
    id: 11,
    name: "harsh Nima",
    avatar: "path_to_avatar_image",
    attendance: ["ABSENT", "ABSENT", "ABSENT", "ABSENT", "ABSENT", "", ""],
  },
  {
    id: 12,
    name: "niraj Nima",
    avatar: "path_to_avatar_image",
    attendance: ["ABSENT", "ABSENT", "ABSENT", "ABSENT", "ABSENT", "", ""],
  },
  {
    id: 13,
    name: "vardha Nima",
    avatar: "path_to_avatar_image",
    attendance: ["ABSENT", "ABSENT", "ABSENT", "ABSENT", "ABSENT", "", ""],
  },
  {
    id: 14,
    name: "varun Nima",
    avatar: "path_to_avatar_image",
    attendance: ["ABSENT", "ABSENT", "ABSENT", "ABSENT", "ABSENT", "", ""],
  },
  {
    id: 15,
    name: "Ravi Nima",
    avatar: "path_to_avatar_image",
    attendance: ["ABSENT", "ABSENT", "ABSENT", "ABSENT", "ABSENT", "", ""],
  },
  // Add more employees...
];

// Function to get formatted date range (7 days)
const getDateRange = (startDate) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let dateRange = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    dateRange.push(
      `${daysOfWeek[currentDate.getDay()]} ${currentDate
        .getDate()
        .toString()
        .padStart(2, "0")} ${currentDate
        .toLocaleString("default", { month: "short" })
        .toUpperCase()}`
    );
  }
  return dateRange;
};

const AttendanceRec = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedRecord1, setSelectedRecord1] = useState(false);
  const employeesPerPage = 10;

  const handlePrevWeek = () => {
    setStartDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() - 7); // Go back 7 days
      return newDate;
    });
  };

  const handleNextWeek = () => {
    setStartDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + 7); // Go forward 7 days
      return newDate;
    });
  };

  const days = getDateRange(startDate);
  const themeColor = useSelector((state) => state.theme.color);

  // Pagination logic
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const handleNextPage = () => {
    if (indexOfLastEmployee < employees.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleRecordClick = (employee, schedule, code) => {
    setSelectedRecord({ employee, schedule, code });
  };

  return (
    <div className="flex">
      <AdminHRMS />

      <div className="ml-20 bg-gray-100 p-2 w-full mb-5">
        {/* Header */}
        <div>
          <header
            style={{ background: themeColor }}
            className="bg-blue-500 text-white p-4 flex justify-between rounded-md items-center"
          >
            <h1 className="text-2xl font-semibold">Attendance Record</h1>
            <div className="flex items-center space-x-4">
              <input
                className="border p-1 w-64 px-4 text-black border-gray-500 rounded-md"
                value="2024-07"
                type="month"
              />
              <select className="border p-2 text-black w-48 rounded">
                <option value="">Action</option>
                <option value="">Bulk Regularization</option>
                <option value="">Bulk Delete</option>
              </select>
              <button className="bg-white p-2 text-black rounded">
                Upload Records
              </button>
              <button
                style={{ background: themeColor }}
                className="bg-black p-2 rounded"
              >
                Filter
              </button>
              <button
                style={{ background: themeColor }}
                className="bg-black p-2 rounded"
              >
                <FaRedo />
              </button>
              <label className="text-white" htmlFor="">
                Multiselect
              </label>
              <ToggleSwitch />
            </div>
          </header>
        </div>

        {/* Legend */}
        <div className="flex gap-5 mt-2">
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-green-500 mt-1 rounded-full"></div>
            <p> Present</p>
          </div>
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-red-500 mt-1 rounded-full"></div>
            <p> Absent</p>
          </div>
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-orange-500 mt-1 rounded-full"></div>
            <p>Weekly Off/Holiday</p>
          </div>
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-blue-500 mt-1 rounded-full"></div>
            <p>Half Day</p>
          </div>
          <div className="flex gap-2">
            <div class="w-4 h-4 bg-gray-500 mt-1 rounded-full"></div>
            <p>No Shift/Template missing</p>
          </div>
          <div className="flex gap-2">
            <div class="w-4 h-4 bg-black mt-1 rounded-full"></div>
            <p> Invalid Record</p>
          </div>
          <div className="flex gap-2">
            <div class="w-4 h-4 bg-yellow-400 mt-1 rounded-full"></div>
            <p> Early</p>
          </div>
          <div className="flex gap-2">
            <div class="w-4 h-4 bg-pink-400 mt-1 rounded-full"></div>
            <p> Late</p>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="flex w-full items-center mt-6">
          <div className="flex justify-between gap-1 overflow-x-auto w-full">
            {/* Employee List */}
            <div className="w-72 h-full p-4 flex flex-col gap-4 bg-white rounded-xl">
              <input
                type="text"
                name=""
                id=""
                className="border-b border-gray-500 p-1 outline-none"
                placeholder="Search employee"
              />
              {currentEmployees.map((employee) => (
                <div
                  className="flex items-center justify-between"
                  key={employee.id}
                >
                  <span className="text-gray-700 font-medium border-b w-full">
                    {employee.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={handlePrevWeek}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <FaChevronLeft />
                </button>

                <div className="grid grid-cols-7 gap-2 flex-grow">
                  {days.map((day, index) => (
                    <div
                      className="text-center font-semibold text-gray-600 py-2"
                      key={index}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleNextWeek}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <FaChevronRight />
                </button>
              </div>

              {/* Attendance Rows */}
              {currentEmployees.map((employee) => (
                <div
                  className="grid grid-cols-7 gap-y-2 mb-[1px] gap-2"
                  key={employee.id}
                >
                  {employee.attendance.map((status, index) => (
                    <div
                      key={index}
                      className={`text-center py-2 border rounded ${
                        status === "ABSENT"
                          ? "border-red-500 text-red-500"
                          : status === "NS"
                          ? "bg-gray-200 text-gray-500"
                          : "border-green-500 text-green-500"
                      }`}
                    >
                      {status || ""}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            className={`p-2  text-white rounded ${
              currentPage === 1
                ? "bg-gray-400 cursor-not-allowed"
                : " bg-blue-500"
            }`}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className={`p-2  text-white rounded ${
              indexOfLastEmployee >= employees.length
                ? "bg-gray-400 cursor-not-allowed"
                : " bg-blue-500"
            }`}
            onClick={handleNextPage}
            disabled={indexOfLastEmployee >= employees.length}
          >
            Next
          </button>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Filter Options</h2>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Attendance Template
                </label>
                <input type="text" className="border p-2 w-full rounded" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Branch Location</label>
                <input type="text" className="border p-2 w-full rounded" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Employee Department
                </label>
                <input type="text" className="border p-2 w-full rounded" />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-300 p-2 rounded"
                  onClick={handleModalToggle}
                >
                  Cancel
                </button>
                <button className="bg-blue-400 p-2 rounded">Apply</button>
              </div>
            </div>
          </div>
        )}
        {isModalOpen2 && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Refresh Records</h2>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Select Start Date *
                </label>
                <input type="date" className="border p-2 w-full rounded" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Select End Date *</label>
                <input type="date" className="border p-2 w-full rounded" />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-300 p-2 rounded"
                  onClick={() => setIsModalOpen2(false)}
                >
                  Cancel
                </button>
                <button className="bg-blue-400 p-2 rounded">Submit</button>
              </div>
            </div>
          </div>
        )}
      </div>
      {isModalOpen1 && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-2/3">
            <h2 className="text-xl font-bold mb-4">
              Upload Attendance Records
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700">
                Step 1: Select upload format*
              </label>
              <select
                value={uploadFormat}
                onChange={(e) => setUploadFormat(e.target.value)}
                className="border border-gray-400 p-2 rounded-md mt-1"
              >
                <option value="Vibe Connect">
                  Vibe Connect General Format
                </option>
                <option value="ESSL">ESSL Basic Report Format</option>
              </select>
            </div>

            {uploadFormat === "Vibe Connect" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Step 2: Select month and year for download or upload*
                  </label>
                  <div className="flex gap-5 mb-4">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-48 border border-gray-400 p-2 rounded-md"
                    >
                      <option value="">Select year</option>
                      {/* Add options for years here */}
                    </select>

                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-48 border border-gray-400 p-2 rounded-md"
                    >
                      <option value="">Select month</option>
                      {/* Add options for months here */}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">
                    Step 3: Download attendance global format*
                  </label>
                  <p className="text-gray-600 text-sm mb-2">
                    Includes all your employees with their pre-existing
                    attendance records as per Company's Attendance Cycle Dates
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    <li>
                      Select all the cells instructions when uploading check in
                      times
                    </li>
                    <li>Right click and select the format cells button</li>
                    <li>Choose the "Text" format</li>
                    <li>
                      Enter the check-in / check-out times in AM/PM format: E.g.
                      8:05 AM or 12:30 PM
                    </li>
                  </ul>
                  <button
                    onClick={handleUpload}
                    className="w-52 mt-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                  >
                    Download
                  </button>
                </div>
              </>
            )}

            {uploadFormat === "ESSL" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Step 2: Download sample biometric format
                  </label>
                  <p className="text-gray-600 text-sm mb-2">
                    Includes all your Employees with their pre-existing
                    attendance records as per Company's Attendance Cycle Dates
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    <li>
                      Make sure that attendance template assigned to employees
                      have Biometric or Both Biometric & Web check-in enabled.
                    </li>
                    <li>
                      ESSL upload would not work for employees not having
                      Biometric code.
                    </li>
                    <button
                      onClick={handleUpload}
                      className="w-52 mt-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                    >
                      Download
                    </button>
                  </ul>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">
                    Step 3: Select date format in which you want to upload*
                  </label>
                  <select
                    value={selectedDateFormat}
                    onChange={(e) => setSelectedDateFormat(e.target.value)}
                    className="w-48 border border-gray-400 p-2 rounded-md"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    {/* Add other date formats if needed */}
                  </select>
                </div>
              </>
            )}

            <div className="mb-4">
              <label className="block text-gray-700">
                Step 4: Make necessary changes in the downloaded file and
                upload*
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="mt-1 border p-2 rounded-md"
              />
            </div>

            <div className="flex justify-center gap-2">
              <button
                onClick={handleUpload}
                className="w-48 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Upload
              </button>
              <button
                onClick={() => setIsModalOpen1(false)}
                className="w-48 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-red-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedRecord && !selectedRecord1 && (
        <div className="fixed right-0 top-0 bg-white shadow-lg p-6 w-1/3 h-full overflow-auto">
          <h2 className="text-2xl font-bold mb-4">Selected Employee Details</h2>
          <div className="flex gap-2">
            <div className="mt-2">
              <span className="bg-gray-200 p-2 rounded-full mt-2 mr-2">
                {selectedRecord.code}
              </span>
            </div>
            <div className="flex flex-col mb-2">
              <p className="font-semibold text-sm">{selectedRecord.employee}</p>
              <p className="font-sm">Business & Operations Manager</p>
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <p>Attendance Details </p>
              <p>6 Jul 24, Mon</p>
            </div>
            <div className="w-10 h-8 border p-2 flex justify-center items-center border-green-800 rounded-md">
              <p className="font-bold  ">P</p>
            </div>
          </div>
          <div className="mb-2 mt-2 flex justify-between">
            <p>Check In</p>
            <p>09:00 am</p>
          </div>
          <div className="mb-2 flex justify-between">
            <p>Check Out</p>
            <p>06:00 am</p>
          </div>
          <div className="mb-2 flex justify-between">
            <p>Working Hrs.</p>
            <p>08</p>
          </div>
          <div className="mb-2 flex justify-between">
            <p>Break Hrs.</p>
            <p>0</p>
          </div>
          <div className="mb-2 flex justify-between">
            <p>Status</p>
            <p>Present</p>
          </div>
          <div className="mb-2 flex justify-between">
            <p>Deviation Hrs.</p>
            <p>04:15</p>
          </div>
          <div className="mb-2 flex justify-between">
            <p>Late/Early Mark.</p>
            <p>/</p>
          </div>
          <div className="mb-2 flex justify-between">
            <p>Shift Time</p>
            <p>{selectedRecord.schedule}</p>
          </div>

          {/* Add more details here as needed */}
          <div className="flex gap-2 ">
            <button
              className="mt-5 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleselectedRecord1}
            >
              Apply for Regularization
            </button>

            <button
              className="mt-5 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setSelectedRecord(!selectedRecord)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {selectedRecord && selectedRecord1 && (
        <div className="fixed right-0 top-0 bg-white shadow-lg p-6 w-1/3 h-full overflow-auto">
          <h2 className="text-2xl font-bold mb-4">Selected Employee Details</h2>

          <div className="flex justify-between">
            <div>
              <p>New regularisation Request </p>
              <p>6 Jul 24, Mon</p>
            </div>
            <div className="w-10 h-8 border p-2 flex justify-center items-center border-green-800 rounded-md">
              <p className="font-bold  ">P</p>
            </div>
          </div>

          <div className="grid gap-2 items-center w-full">
            <span className="text-gray-700">Type of Request</span>
            <select className="border border-gray-400 p-2 rounded-md">
              <option>Select Type of Request</option>
            </select>
            <div className="grid gap-2 items-center w-full">
              <span className="text-gray-700">Comment</span>
              <input
                type="text"
                className="border border-gray-400 p-2 rounded-md"
              />
            </div>
          </div>

          {/* Add more details here as needed */}
          <div className="flex gap-2 ">
            <button
              className="mt-5 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setSelectedRecord(!selectedRecord)}
            >
              Sumbit
            </button>

            <button
              className="mt-5 bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleselectedRecord1}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceRec;
