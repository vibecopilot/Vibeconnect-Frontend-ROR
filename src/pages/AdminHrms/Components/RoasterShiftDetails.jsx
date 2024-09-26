import { useEffect, useState } from "react";
import { getRosterShift } from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import { useSelector } from "react-redux";

function RoasterShiftDetails({ employee, date, schedule, onClose }) {
  const [shiftType, setShiftType] = useState("Full Day Weekly Off");
  const [selectedShift, setSelectedShift] = useState(
    "8.45 A.M. TO 6.05 P.M. (08:45 AM - 06:05 PM)"
  );
  const [branchLocation, setBranchLocation] = useState("");
  const [repeat, setRepeat] = useState(false);
  const [formData, setFormData] = useState({
    endOn: "Never",
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      weekday: "short",
    });
  };
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const [shifts, setShifts] = useState([]);
  useEffect(() => {
    const fetchRosterShifts = async () => {
      try {
        const res = await getRosterShift(hrmsOrgId);
        setShifts(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRosterShifts();
  }, []);
  const themeColor = useSelector((state) => state.theme.color);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-1/3">
        {/* <div className="bg-white p-2 w-80"> */}
        <h2 className="font-semibold text-lg border-b mb-1">
          Selected Employee Details
        </h2>
        <div className="max-h-[28rem] overflow-y-auto p-1">
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
            <h2 className="text-xl font-semibold">
              {employee.first_name} {employee.last_name}
            </h2>
          </div>

          <div className="mb-4 flex justify-between items-center w-full border-2 p-1 rounded-md border-blue-500">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">Current Shift</h3>
              <p className="font-medium text-xs">{formatDate(date?.date)}</p>
            </div>
            <p className="text-blue-500 font-semibold">
              {date?.shift_start_time} - {date?.shift_end_time}
            </p>
            {/* <p>{employee.date}</p> */}
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Select Type</label>
            <select
              className="w-full p-2 border rounded-md"
              value={shiftType}
              onChange={(e) => setShiftType(e.target.value)}
            >
              <option selected="selected" value="full_working_day">
                Full Working Day
              </option>
              <option value="full_day_weekly_off">Full Day Weekly Off</option>
              <option value="half_day_weekly_off">Half Day Weekly Off</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Select Shift</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
            >
              {shifts.map((shift) => (
                <option value={shift.id} id={shift.id}>
                  {shift.name}
                </option>
              ))}
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
          {repeat && (
            <div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-medium">
                  Select Frequency
                </label>
                <select name="" id="" className="w-full p-2 border rounded-md">
                  <option value="">Select</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly on same date">
                    Monthly on same date
                  </option>
                  <option value="4th Monday of the month">
                    4th Monday of the month
                  </option>
                </select>
              </div>
              <div className="flex flex-col my-2">
                <label htmlFor="" className="font-medium">
                  Ends on
                </label>
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="end"
                      id="never"
                      checked={formData.endOn === "Never"}
                      onChange={() =>
                        setFormData({ ...formData, endOn: "Never" })
                      }
                    />
                    <label htmlFor="never">Never</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="end"
                      id="on"
                      checked={formData.endOn === "On"}
                      onChange={() => setFormData({ ...formData, endOn: "On" })}
                    />
                    <label htmlFor="on">On</label>
                  </div>
                </div>
              </div>
              {formData.endOn === "On" && (
                <div className="flex flex-col gap-2">
                  <label htmlFor="">End date</label>
                  <input type="date" className="w-full p-2 border rounded-md" />
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-between px-4 p-1 border-t">
          <button className="px-4 py-2 bg-red-500 text-white rounded">
            Delete
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            style={{ background: themeColor }}
            className="px-4 py-2  text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
    // </div>
  );
}

export default RoasterShiftDetails;
