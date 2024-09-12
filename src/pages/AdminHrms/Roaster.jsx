import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import ToggleSwitch from "../../Buttons/ToggleSwitch";
import AdminHRMS from "./AdminHrms";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useSelector } from "react-redux";

// Example data
const employees = [
  { name: "Aniket Parkar", code: "AP" },
  { name: "Prathamesh Palav", code: "PP" },
  { name: "Sami Saudagar", code: "SS" },
  { name: "Ajay Baniya", code: "AB" },
  { name: "Sujal Bhavkar", code: "SB" },
  { name: "Ritik Solanki", code: "RS" },
  { name: "Dhiraj Pogaiy", code: "DP" },
  { name: "Prathamesh Raut", code: "PR" },
  { name: "Praveen Nair", code: "PN" },
  { name: "Mahek Nair", code: "MN" },
];

const handleUpload = () => {
  // Handle the file upload logic here
  console.log("Uploading file...");
};
const rosterData = [
  {
    schedule: [
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
    ],
  },
  {
    schedule: [
      "09:00 AM  06:00 PM",
      "Weekly Off",
      "Half Day",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
    ],
  },
  {
    schedule: [
      "09:00 AM  06:00 PM",
      "Weekly Off",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
    ],
  },
  {
    schedule: [
      "09:00 AM  06:00 PM",
      "Weekly Off",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
    ],
  },
  {
    schedule: [
      "09:30 AM  06:00 PM",
      "Weekly Off",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
    ],
  },
  {
    schedule: [
      "09:30 AM  06:00 PM",
      "Weekly Off",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
    ],
  },
  {
    schedule: [
      "09:30 AM  06:00 PM",
      "Weekly Off",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
    ],
  },
  {
    schedule: [
      "09:30 AM  06:00 PM",
      "Weekly Off",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
    ],
  },
  {
    schedule: [
      "09:30 AM  06:00 PM",
      "Weekly Off",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
    ],
  },
  {
    schedule: [
      "09:30 AM  06:00 PM",
      "Weekly Off",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
      "09:00 AM  06:00 PM",
    ],
  },
  // Add more employee schedules here
];

const Roster = () => {
  const themeColor = useSelector((state) => state.theme.color);

  const [isOpen, setIsOpen] = useState(false);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [downloadLiteVersion, setDownloadLiteVersion] = useState("No");
  const [repeat, setRepeat] = useState(false);
  const [startDate, setStartDate] = useState(dayjs("2024-07-06"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState(null);
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const handleNextWeek = () => {
    setStartDate(startDate.add(1, "week"));
  };

  const handlePrevWeek = () => {
    setStartDate(startDate.subtract(1, "week"));
  };

  const renderDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(startDate.add(i, "day"));
    }
    return dates;
  };

  const dates = renderDates();

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleShiftClick = (employeeIndex, shift) => {
    setSelectedEmployeeIndex(employeeIndex);
    setSelectedShift(shift);
  };
  const splitTime = (time) => {
    if (time.includes(" - ")) {
      return time.split(" - ");
    }
    return [time];
  };
  const [currentMonth, setCurrentMonth] = useState("");

  useEffect(() => {
    // Get the current date
    const date = new Date();

    // Format the current year and month in 'YYYY-MM' format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Pad the month with a leading zero if needed

    setCurrentMonth(`${year}-${month}`);
  }, []);
  return (
    <div className="flex ">
      <AdminHRMS />
      <div className="ml-20  bg-gray-100 p-2 w-full">
        {/* Header */}
        <header
          style={{ background: themeColor }}
          className="bg-blue-500 p-4 text-white rounded-md flex justify-between items-center"
        >
          <h1 className="text-2xl font-medium">Roster Record</h1>
          <div className="flex items-center space-x-4">
            <input
              className="border p-2 w-64 px-4 text-black rounded-md"
              type="month"
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
            />
            <button onClick={toggleModal} className="border p-2 rounded-md">
              Upload Records
            </button>
            <button className="border p-2 rounded" onClick={handleModalToggle}>
              Filter
            </button>
            <label className="text-white" htmlFor="">
              Multiselect
            </label>
            <ToggleSwitch />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex gap-5 mt-2 ">
          <div className="flex gap-2">
            <div class="w-4 h-4 bg-green-500 mt-1 rounded-full"></div>
            <p> Full Working Day</p>
          </div>
          <div className="flex gap-2">
            <div class="w-4 h-4 bg-orange-500 mt-1 rounded-full"></div>
            <p>Weekly Off/Holiday</p>
          </div>
          <div className="flex gap-2">
            <div class="w-4 h-4 bg-blue-500 mt-1 rounded-full"></div>
            <p>Half Day</p>
          </div>
          <div className="flex gap-2">
            <div class="w-4 h-4 bg-gray-500 mt-1 rounded-full"></div>
            <p>Not Assigned</p>
          </div>
        </div>
        <div className="flex  mt-6">
          {/* Employee List */}
          <div className="bg-white p-4 rounded shadow-md">
            <p className="font-bold mb-1">Employee List</p>
            <input
              type="text"
              placeholder="Search Employee Name/Code"
              className="p-2 border mb-2 rounded"
            />
            <ul>
              {employees.map((employee, index) => (
                <li key={index} className="p-2 flex items-center border-b">
                  <span className="bg-gray-200 p-2 rounded-full mr-2 text-sm">
                    {employee.code}
                  </span>
                  {employee.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Roster Records */}
          <div className="w-full bg-white p-4 rounded shadow-md">
            <div className="flex justify-between mb-4">
              <button
                className="bg-gray-300 p-2 rounded"
                onClick={handlePrevWeek}
              >
                <FaArrowLeft />
              </button>
              <button
                className="bg-gray-300 p-2 rounded"
                onClick={handleNextWeek}
              >
                <FaArrowRight />
              </button>
            </div>
            <div className="flex gap-2">
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    {dates.map((date) => (
                      <th key={date} className="px-4 font-medium text-sm py-2">
                        {date.format("ddd DD MMM")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rosterData.map((employee, employeeIndex) => (
                    <tr key={employeeIndex}>
                      {employee.schedule.map((time, shiftIndex) => {
                        const [startTime, endTime] = splitTime(time);
                        let baseClass =
                          "border font-semibold text-center border-black  cursor-pointer";
                        let conditionClass = "";

                        if (time === "Weekly Off") {
                          conditionClass = "bg-orange-200 hover:bg-orange-400";
                        } else if (time === "09:00 AM  06:00 PM") {
                          conditionClass = "bg-green-200 hover:bg-green-600";
                        } else if (time === "Absent") {
                          conditionClass = "bg-red-400 hover:bg-red-600";
                        } else {
                          conditionClass = "bg-blue-400 hover:bg-blue-600";
                        }

                        return (
                          <td
                            key={shiftIndex}
                            className={`${baseClass} ${conditionClass}`}
                            onClick={() =>
                              handleShiftClick(employeeIndex, time)
                            }
                          >
                            <div className="flex flex-col">
                              <span>{startTime}</span>
                              {endTime && <span>{endTime}</span>}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected Employee Details */}
          <div className="bg-white p-4 rounded border-l w-72">
            <h2 className="text-lg font-semibold mb-4">
              Selected Employee Details
            </h2>
            {selectedShift !== null && selectedEmployeeIndex !== null ? (
              <div>
                <div className="flex items-center gap-5">
                  <p className="text-sm bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                    {employees[selectedEmployeeIndex].code}
                  </p>

                  <p className=" font-medium">
                    {" "}
                    {employees[selectedEmployeeIndex].name}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-semibold">Current Shift </p>
                  <div className="text-green-500 rounded-md p-1">
                    <p>{selectedShift}</p>
                  </div>
                </div>
                <div className=" bg-gray-100 flex items-center justify-center">
                  <div className="bg-white p-2 rounded  space-y-4 w-72 ">
                    <div className="grid gap-2 items-center w-full">
                      <span className="text-gray-700 font-medium">
                        Select Type
                      </span>
                      <select className="border border-gray-400 p-1 rounded-md">
                        <option>Full Working Day</option>
                      </select>
                    </div>
                    <div className="grid gap-2 items-center w-full">
                      <span className="text-gray-700 font-medium">
                        Select Shift
                      </span>
                      <select className="border border-gray-400 p-1 rounded-md text-sm">
                        <option>9 A.M. TO 6 P.M. (09:00 AM - 06:00 PM)</option>
                      </select>
                    </div>
                    <div className="grid gap-2 items-center w-full">
                      <span className="text-gray-700 font-medium">
                        Branch Location
                      </span>
                      <input
                        type="text"
                        className="border border-gray-400 p-2 rounded-md"
                        placeholder="Branch Location"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 flex items-center">
                      <input
                        type="checkbox"
                        id="repeat"
                        className="mr-2"
                        checked={repeat}
                        onChange={() => setRepeat(!repeat)}
                      />
                      <label htmlFor="repeat" className="text-gray-700">
                        Repeat?
                      </label>
                    </div>
                    {repeat && (
                      <>
                        <div className="col-span-1">
                          <label className="block">
                            <span className="text-gray-700">
                              Select Frequency
                            </span>
                            <select className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm">
                              <option>Select</option>
                            </select>
                          </label>
                        </div>
                        <div className="col-span-1">
                          <label className="block">
                            <span className="text-gray-700">Ends on?</span>
                            <div className="flex items-center mt-1 space-x-4">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="endsOn"
                                  className="mr-2"
                                />
                                <span>Never</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="endsOn"
                                  className="mr-2"
                                />
                                <span>On</span>
                              </label>
                            </div>
                          </label>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between">
                      <button className="bg-black text-white mb-2 hover:bg-gray-700 font-semibold py-2 px-4 rounded">
                        Delete
                      </button>
                      <button
                        className="bg-black text-white mb-2 hover:bg-gray-700 font-semibold py-2 px-4 rounded"
                        onClick={() => setSelectedEmployeeIndex(null)}
                      >
                        Cancel
                      </button>
                      <button className="bg-black text-white mb-2 hover:bg-gray-700 font-semibold py-2 px-4 rounded">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm">
                  Please select a specific record to update or delete it. To
                  edit multiple records, turn on multi select.
                </p>
                <button className="mt-4 bg-orange-400 p-2 rounded">
                  Learn More
                </button>
              </>
            )}
          </div>
        </div>

        {/* Modal */}
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
        {isOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h2 className="text-xl font-semibold mb-4">
                Upload Roster Records
              </h2>
              <p className="font-semibold mb-1">
                Step 1: Select month and year for download or upload *
              </p>
              <div className="flex justify-between gap-5 mb-2">
                {/* <label className="block mb-1">Select year</label> */}
                <select
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-52 border p-2 rounded"
                >
                  <option value="">Select Year</option>
                </select>

                <select
                  type="text"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-52 border p-2 rounded"
                >
                  <option value="">Select Month</option>
                </select>
              </div>

              <div className="mb-4">
                {/* <label className="block mb-1">Select month</label> */}
              </div>

              <div className="mb-4 mt-1">
                <label className="font-semibold ">
                  Step 2:Do you want to download Lite Version Sheet?
                </label>
                <select
                  value={downloadLiteVersion}
                  onChange={(e) => setDownloadLiteVersion(e.target.value)}
                  className="w-52 border mt-1 p-2 rounded"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div className="flex flex-col mb-4">
                <label className="font-semibold ">
                  Step 3:Download roster global format
                </label>
                <button className="w-48 bg-green-500 mt-1 text-white px-4 py-2 rounded">
                  Download
                </button>
              </div>

              <div className="flex flex-col mb-4">
                <label className="font-semibold ">
                  Step 4: Make necessary changes in the imported file and Upload
                  *
                </label>
                <input type="file" />
              </div>

              <div className="text-right">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={toggleModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Roster;
