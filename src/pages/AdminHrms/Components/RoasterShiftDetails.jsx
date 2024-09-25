import { useState } from "react";

function RoasterShiftDetails({ employee, date, schedule, onClose }) {
  const [shiftType, setShiftType] = useState("Full Day Weekly Off");
  const [selectedShift, setSelectedShift] = useState(
    "8.45 A.M. TO 6.05 P.M. (08:45 AM - 06:05 PM)"
  );
  const [branchLocation, setBranchLocation] = useState("");
  const [repeat, setRepeat] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      weekday: "short",
    });
  };
 

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-1/3">
        {/* <div className="bg-white p-2 w-80"> */}
            <h2 className="font-semibold text-lg border-b">Selected Employee Details</h2>
          <div className="flex items-center mb-4">
            {employee.avatar ? (
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-12 h-12 rounded-full mr-3"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold mr-3">
               {employee.first_name[0]}
               {employee.last_name[0]}
              </div>
            )}
            <h2 className="text-xl font-semibold">{employee.first_name} {employee.last_name}</h2>
          </div>

          <div className="mb-4 flex justify-between w-full">
            <h3 className="font-semibold">Current Shift</h3>
            <p>{formatDate(date?.date)}</p>
            {/* <p className="text-orange-500 font-semibold">{schedule}</p> */}
            {/* <p>{employee.date}</p> */}
          </div>

          <div className="mb-4">
            <label className="block mb-2">Select Type</label>
            <select
              className="w-full p-2 border rounded-md"
              value={shiftType}
              onChange={(e) => setShiftType(e.target.value)}
            >
              <option>Full Day Weekly Off</option>
              <option>Half Day</option>
              <option>Not Assigned</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Select Shift</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
            >
              <option>8.45 A.M. TO 6.05 P.M. (08:45 AM - 06:05 PM)</option>
              <option>7.45 A.M. TO 5.05 P.M. (07:45 AM - 05:05 PM)</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Branch Location</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={branchLocation}
              onChange={(e) => setBranchLocation(e.target.value)}
              placeholder="Branch Location"
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={repeat}
                onChange={(e) => setRepeat(e.target.checked)}
              />
              Repeat?
            </label>
          </div>
          <div className="flex justify-between">
            <button className="px-4 py-2 bg-red-500 text-white rounded">
              Delete
            </button>
            <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
              Cancel
            </button>
            <button className="px-4 py-2 bg-orange-500 text-white rounded">
              Save
            </button>
          </div>
        </div>
      </div>
    // </div>
  );
}

export default RoasterShiftDetails;
