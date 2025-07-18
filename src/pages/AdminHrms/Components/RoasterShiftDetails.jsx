import { useEffect, useState } from "react";
import {
  deleteRosterRecord,
  editRosterRecord,
  editRosterShiftDetails,
  getAdminAccess,
  getRosterRecordDetails,
  getRosterShift,
  postRosterRecord,
  postRosterAssign,
  editRosterAssign,
} from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { MdClose, MdDeleteForever } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { error } from "highcharts";

function RoasterShiftDetails({
  employee,
  date,
  schedule,
  onClose,
  recordId,
  fetchRosterRecords,
  mode,
}) {
  const [shiftType, setShiftType] = useState("");
  const [shiftData, setShiftData] = useState("");
  const [branchLocation, setBranchLocation] = useState("");
  const [employeeData, setEmployeeData] = useState([]);
  const [repeat, setRepeat] = useState(false);
  const [frequency, setFrequency] = useState("");
  const [endDate, setEndDate] = useState("");
  const [formData, setFormData] = useState({
    endOn: "never",
  });
  console.log("Employee id", employee.id);
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      weekday: "short",
    });
  };
  console.log(mode);
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const [shifts, setShifts] = useState([]);

  console.log(shiftData, repeat, frequency, formData.endOn, endDate);
  useEffect(() => {
    const fetchRosterRecordDetails = async () => {
      try {
        const res = await getRosterRecordDetails(date.id);
        // setEmployeeData(res);
        // setFormData({ ...formData, selectedShift: res.shift });
        setShiftType(res.shift_type);
        setShiftData(res.shift);
        setRepeat(res.repeat);
        setFrequency(res.frequency);
        setFormData({ ...formData, endOn: res.ends_on });
        setEndDate(res.end_date);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRosterShifts = async () => {
      try {
        const res = await getRosterShift(hrmsOrgId);
        setShifts(res);
        console.log("shift details", res);
      } catch (error) {
        console.log(error);
      }
    };
    if (date?.id) {
      fetchRosterRecordDetails();
    }
    fetchRosterShifts();
  }, []);
  const themeColor = useSelector((state) => state.theme.color);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleEditRosterShift = async () => {
  //   const editData = new FormData();
  //   editData.append(
  //     "date",
  //     date?.date ? date?.date : new Date(schedule).toISOString().slice(0, 10)
  //   );
  //   editData.append("shift", formData.selectedShift);
  //   editData.append("employee", employee.id);
  //   try {
  //     if (date?.date) {
  //       const res = await editRosterRecord(date.id, editData);
  //     } else {
  //       const res = await postRosterRecord(editData);
  //     }
  //     fetchRosterRecords();
  //     toast.success("Roster record updated successfully");
  //     onClose();
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Something went wrong");
  //   }
  // };

  console.log("Schedule 105", schedule);

  const dayIndex = schedule.getDay();
  let selectedDay;
  let indexNumber;

  function getWeekdayOccurrencesForSelectedDate(selectedDate) {
    const date = new Date(selectedDate);
    const month = date.getMonth();
    const year = date.getFullYear();
    const dayOfMonth = date.getDate();

    const weekdayCount = [0, 0, 0, 0, 0, 0, 0];

    for (let day = 1; day <= dayOfMonth; day++) {
      const currentDay = new Date(year, month, day);
      const weekday = currentDay.getDay();
      weekdayCount[weekday]++;
    }
    return weekdayCount;
  }

  const occurrences = getWeekdayOccurrencesForSelectedDate(schedule);
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  weekdays.forEach((day, index) => {
    indexNumber = occurrences[index];
    let nth;

    if (occurrences[index] === 1) {
      nth = "st";
    } else if (occurrences[index] === 2) {
      nth = "nd";
    } else if (occurrences[index] === 3) {
      nth = "rd";
    } else {
      nth = "th";
    }

    if (dayIndex === index) {
      selectedDay = `${occurrences[index]}${nth} ${day} of the month`;
    }
  });

  const day = schedule.toLocaleDateString("en-US", { weekday: "long" });

  const dayMapping = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
  };

  const dayNumber = dayMapping[day];

  console.log(dayNumber);
  const formattedDate = schedule.toISOString().split("T")[0];
  console.log(formattedDate);
  const handleAddShift = async () => {
    if (shiftType === "") {
      return toast.error("Please select Shift Type");
    }
    if (shiftData === "") {
      return toast.error("Please select Shift ");
    }
    if (repeat && frequency === "") {
      return toast.error("Please select Frequency");
    }
    const postData = new FormData();
    postData.append("employee", employee.id);
    postData.append("date", formattedDate);
    postData.append("shift_type", shiftType);
    postData.append("shift", shiftData);
    postData.append("repeat", repeat);
    postData.append("frequency", frequency);
    postData.append("selected_weekday", dayNumber);
    postData.append("nth_weekday", indexNumber);
    postData.append("ends_on", formData.endOn);
    postData.append("end_date", endDate);
    try {
      const res = await postRosterAssign(postData);
      onClose();
      toast.success("New Shift Added Successfully");
      fetchRosterRecords();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditShift = async () => {
    if (shiftType === "") {
      return toast.error("Please select Shift Type");
    }
    if (shiftData === "") {
      return toast.error("Please select Shift ");
    }
    if (repeat && frequency === "") {
      return toast.error("Please select Frequency");
    }
    const editData = new FormData();
    // editData.append("employee", employee.id);
    // editData.append("id", date.id);
    editData.append("date", formattedDate);
    editData.append("shift_type", shiftType);
    editData.append("shift", shiftData);
    editData.append("repeat", repeat);
    editData.append("frequency", frequency);
    // editData.append("selected_weekday", dayNumber);
    // editData.append("nth_weekday", indexNumber);
    editData.append("ends_on", formData.endOn);
    editData.append("end_date", formattedDate);
    try {
      const res = await editRosterAssign(date.id, editData);
      onClose();
      toast.success("New Shift Update Successfully");
      fetchRosterRecords();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditRosterShift = async () => {
    try {
      // Validate required fields
      if (!formData.selectedShift) {
        return toast.error("Please select a shift.");
      }

      const payload = {
        employee_ids: [employee.id],
        shift_id: formData.selectedShift,
        date_range: [
          date?.date
            ? date.date
            : new Date(schedule).toISOString().slice(0, 10),
        ], // Single date
      };

      if (date?.date) {
        const res = await editRosterRecord(payload);
      } else {
        const res = await postRosterRecord(payload);
      }

      fetchRosterRecords();
      toast.success("Roster record updated successfully.");
      onClose();
    } catch (error) {
      console.error("Error updating roster:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleDeleteRosterRecord = async () => {
    try {
      await deleteRosterRecord(date.id);
      fetchRosterRecords();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const empId = getItemInLocalStorage("HRMS_EMPLOYEE_ID");
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

  // if(formData.endOn === "on" && new Date(endDate) <= new Date(schedule)){
  //   toast.error("End date must be after the current shift date");
  //   return;
  // }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-2/3 md:w-1/3">
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
              <p className="font-medium text-xs">
                {date?.date ? formatDate(date?.date) : formatDate(schedule)}
              </p>
            </div>
            <p className="text-blue-500 font-semibold">
              {date?.shift_start_time} - {date?.shift_end_time}
            </p>
            {/* <p>{employee.date}</p> */}
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">
              Select Type <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-2 border rounded-md"
              value={shiftType}
              onChange={(e) => setShiftType(e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="full_working_day">Full Working Day</option>
              <option value="full_day_weekly_off">Full Day Weekly Off</option>
              <option value="half_day_weekly_off">Half Day Weekly Off</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">
              Select Shift <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-2 border rounded"
              value={shiftData}
              onChange={(e) => setShiftData(e.target.value)}
              name="shiftData"
              disabled={!roleAccess?.can_assign_edit_delete_shifts}
            >
              <option value="">Select Shift</option>
              {shifts.map((shift) => (
                <option value={shift.id} key={shift.id}>
                  {shift.name} start time:{shift.start_time || "no start time"}{" "}
                  , End Time:{shift.end_time || "no end time"}
                </option>
              ))}
            </select>
          </div>

          {/* <div className="mb-4">
            <label className="block mb-2">Branch Location</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={branchLocation}
              onChange={(e) => setBranchLocation(e.target.value)}
              placeholder="Branch Location"
            />
          </div> */}

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
                  Select Frequency <span className="text-red-500">*</span>
                </label>
                <select
                  name=""
                  id=""
                  className="w-full p-2 border rounded-md"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly_same_date">
                    Monthly on same date
                  </option>
                  <option value="monthly_nth_weekday">{selectedDay}</option>
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
                      checked={formData.endOn === "never"}
                      onChange={() =>
                        setFormData({ ...formData, endOn: "never" })
                      }
                    />
                    <label htmlFor="never">Never</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="end"
                      id="on"
                      checked={formData.endOn === "on"}
                      onChange={() => setFormData({ ...formData, endOn: "on" })}
                    />
                    <label htmlFor="on">On</label>
                  </div>
                </div>
              </div>
              {formData.endOn === "on" && (
                <div className="flex flex-col gap-2">
                  <label htmlFor="endDate">End date</label>
                  <input
                    id="endDate"
                    type="date"
                    className="w-full p-2 border rounded-md"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={
                      new Date(new Date(schedule).getTime() + 24 * 60 * 1000)
                        .toISOString()
                        .split("T")[0]
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-around items-center px-4 p-1 border-t">
          {roleAccess?.can_assign_edit_delete_shifts && mode !== "add" && (
            <button
              className="px-4 py-2 border-2 border-red-500 text-red-500 rounded-full flex items-center gap-2"
              onClick={() => handleDeleteRosterRecord()}
            >
              <MdDeleteForever size={20} /> Delete
            </button>
          )}
          <button
            className="px-4 py-2 border-2 border-gray-500 text-gray-500  rounded-full flex items-center gap-2"
            onClick={onClose}
          >
            <MdClose size={20} /> Cancel
          </button>
          {roleAccess?.can_assign_edit_delete_shifts &&
            (mode === "add" ? (
              <button
                className="px-4 py-2 border border-green-500 text-green-500 rounded-full flex items-center gap-2"
                onClick={handleAddShift}
              >
                <FaCheck /> Add
              </button>
            ) : (
              <button
                className="px-4 py-2 border border-green-500 text-green-500 rounded-full flex items-center gap-2"
                onClick={handleEditShift} // Assuming there's an edit function
              >
                <FaCheck /> Edit
              </button>
            ))}
        </div>
      </div>
    </div>
    // </div>
  );
}

export default RoasterShiftDetails;