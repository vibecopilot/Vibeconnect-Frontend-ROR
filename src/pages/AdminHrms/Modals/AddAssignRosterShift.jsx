import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import MultiSelect from "../Components/MultiSelect";
import {
  getMyHRMSEmployees,
  getRosterShift,
  postRosterRecord,
  getAssociatedSites,
  getRosterRecordsFilter,
  postRosterAssign,
  getEmployeeAssociations,
  postRosterAssignBulk,
} from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import DatePicker from "react-multi-date-picker";
import "react-multi-date-picker/styles/colors/teal.css";
import toast from "react-hot-toast";
import Select from "react-select";
import { format } from "date-fns";
const AddAssignRosterShift = ({ onClose, fetchRosterRecords }) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [filteredEmp, setFilteredEmp] = useState([]);
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const empId = localStorage.getItem("HRMS_EMPLOYEE_ID");
  const [allSites, setAllSites] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [empData, setEmpData] = useState([]);
  const [repeat, setRepeat] = useState(false);
  const [formData, setFormData] = useState({
    shiftType: "",
    selectedShift: "",
    frequency: "",
    endOn: "never",
    endDate: "",
  });
  console.log(empData);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await getEmployeeAssociations(empId);

        console.log("Site name :", res);
        if (Array.isArray(res) && res.length > 0) {
          const associatedSites = res[0].multiple_associated_info || [];
          const allSites = associatedSites.map((site) => ({
            value: site.id,
            label: site.site_name,
          }));

          setAllSites(allSites);
        } else {
          setAllSites([]);
        }
      } catch (error) {
        console.error("Error fetching sites:", error);
      }
    };
    fetchSites();
  }, [hrmsOrgId]);

  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        const res = await getMyHRMSEmployees(hrmsOrgId);
        console.log("first res line 21:", res);
        const employeesList = res.map((emp) => ({
          value: emp.id,
          label: `${emp.first_name} ${emp.last_name}`,
        }));
        console.log("first res line EmployeeList:", employeesList);

        setEmployees(employeesList);
        setFilteredEmployees(employeesList);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRosterShifts = async () => {
      try {
        const res = await getRosterShift(hrmsOrgId);
        console.log("Roster Shifts:", res);
        setShifts(res);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRosterShifts();
    fetchAllEmployees();
  }, []);

  const [selectedOptions, setSelectedOptions] = useState([]);
  console.log("line 85", selectedOptions);
  const handleSelect = (option) => {
    console.log("Option:", option);
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  console.log(formData);
  const [selectedDates, setSelectedDates] = useState([]);

  const handleDateChange = (dates) => {
    const formattedDates = dates.map((date) => date.format("YYYY-MM-DD"));
    setSelectedDates(formattedDates);
  };
  console.log(selectedDates);
  // const handleAssignRoster = async () => {
  //   try {
  //     if (!selectedOptions.length) {
  //       return toast.error("Please select employees");
  //     }
  //     if (!formData.selectedShift) {
  //       return toast.error("Please select shift");
  //     }
  //     if (!selectedDates.length) {
  //       return toast.error("Please select dates");
  //     }

  //     const payload = {
  //       employee_ids: selectedOptions,
  //       shift_id: formData.selectedShift,
  //       date_range: selectedDates,
  //     };
  //     const response = await postRosterRecord(payload);
  //     console.log("Roster assigned successfully:", response);
  //     fetchRosterRecords();
  //     onClose();
  //   } catch (error) {
  //     console.error("Error assigning roster:", error.message);
  //   }
  // };

  const fetchRosterRecordFilter = async (page, siteId) => {
    try {
      const res = await getRosterRecordsFilter(hrmsOrgId, siteId, page);
      const empList = res.results.map((emp) => ({
        value: emp.id,
        label: `${emp.first_name} ${emp.last_name}`,
      }));
      setEmpData(empList);
      setFilteredEmp(empList);
      console.log(empList);
    } catch (error) {
      console.log(error);
    }
  };
  const [selectedOptionSite, setSelectedOptionSite] = useState(null);
  const handleChangeSite = (selectedOption) => {
    setSelectedOptionSite(selectedOption); // Update state
    console.log("Selected Option:", selectedOption.value);
    fetchRosterRecordFilter(1, selectedOption.value);
  };
  const [selectedShiftDate, setSelectedShiftDate] = useState(null);

  const handleShiftDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      setSelectedShiftDate(date);
      console.log("Selected Date:", format(date, "yyyy-MM-dd"));
    } else {
      console.error("Invalid date selected:", date);
    }
  };
  console.log("line 159", selectedShiftDate);

  const formattedDate = selectedShiftDate
    ? selectedShiftDate.toISOString().split("T")[0]
    : "";
  console.log("line 161", formattedDate);

  const day = selectedShiftDate
    ? selectedShiftDate.toLocaleDateString("en-US", { weekday: "long" })
    : "Invalid Date";

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

  console.log("line 182", dayNumber);
  let selectedDay;
  let indexNumber;
  // Ensure selectedShiftDate is a valid Date object
  if (!selectedShiftDate || isNaN(new Date(selectedShiftDate))) {
    console.error("Invalid date provided.");
  } else {
    const dayIndex = new Date(selectedShiftDate).getDay(); // Convert to Date if needed
    selectedDay;
    indexNumber;
    function getWeekdayOccurrencesForSelectedDate(selectedDate) {
      const date = new Date(selectedDate);
      if (isNaN(date)) return [];

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

    const occurrences = getWeekdayOccurrencesForSelectedDate(selectedShiftDate);
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
      indexNumber = occurrences[index] || 0; // Ensure indexNumber is not undefined
      let nth;

      if (indexNumber === 1) {
        nth = "st";
      } else if (indexNumber === 2) {
        nth = "nd";
      } else if (indexNumber === 3) {
        nth = "rd";
      } else {
        nth = "th";
      }

      if (dayIndex === index) {
        selectedDay = `${indexNumber}${nth} ${day} of the month`;
      }
    });
    console.log("line 239", indexNumber);
    console.log("line 240", selectedDay); // Output the result
  }
  const handleAddShift = async () => {
    if (!selectedOptionSite) {
      return toast.error("Please select site");
    }
    if (!formData.shiftType) {
      return toast.error("Please select shift type");
    }
    const postData = {
      organization: hrmsOrgId,
      employee_ids: [...selectedOptions],
      site_id: selectedOptionSite.value,

      date: formattedDate,
      shift_type: formData.shiftType,
      shift: formData.selectedShift,
      repeat: repeat,
      frequency: formData.frequency,
      selected_weekday: dayNumber,
      nth_weekday: indexNumber,
      ends_on: formData.endOn,
      end_date: formData.endDate,
    };

    try {
      const res = await postRosterAssignBulk(postData);

      onClose();
      toast.success("New Shift Added Successfully");
      fetchRosterRecords();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="z-10 fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-xl shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Assign Multiple Shifts</h2>
        <div className="max-h-96 overflow-y-auto p-2">
          <div className="mb-2">
            <label className="block mb-2 font-medium">Select Sites:</label>
            <Select
              options={allSites}
              value={selectedOptionSite}
              onChange={handleChangeSite}
              className="basic-single-select"
              classNamePrefix="select"
              placeholder="Select a site..."
            />
          </div>
          <div>
            <MultiSelect
              options={empData}
              title={"Select Employees"}
              handleSelect={handleSelect}
              // handleSelectAll={handleSelectAll}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              setOptions={setEmpData}
              searchOptions={filteredEmp}
              compTitle="Select Employees"
            />
            <div className="w-full flex flex-col gap-1 mb-2">
              <label className="block mb-1 font-medium">Select Date:</label>
              <DatePicker
                selected={selectedShiftDate}
                onChange={(date) => handleShiftDateChange(new Date(date))}
                dateFormat="yyyy-MM-dd"
                inputClass="text-gray-700 text-sm font-medium p-2 w-full border rounded-md border-gray-300"
                placeholder="Select a date"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Select Type</label>
              <select
                className="w-full p-2 border rounded-md"
                name="shiftType"
                value={formData.shiftType}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                <option value="full_working_day">Full Working Day</option>
                <option value="full_day_weekly_off">Full Day Weekly Off</option>
                <option value="half_day_weekly_off">Half Day Weekly Off</option>
              </select>
            </div>
            <div className="my-2">
              <label className="block mb-2 font-medium">Select Shift</label>
              <select
                className="w-full p-2 border rounded"
                value={formData.selectedShift}
                onChange={handleChange}
                name="selectedShift"
              >
                <option value="">Select Shift</option>
                {shifts.map((shift) => (
                  <option value={shift.id} key={shift.id}>
                    {shift.name}
                  </option>
                ))}
              </select>
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
                  <select
                    name="frequency"
                    id=""
                    className="w-full p-2 border rounded-md"
                    value={formData.frequency}
                    onChange={handleChange}
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
                        onChange={() =>
                          setFormData({ ...formData, endOn: "on" })
                        }
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
                      name="endDate"
                      className="w-full p-2 border rounded-md"
                      value={formData.endDate}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-4 border-t p-1">
          <button
            className="border-2 rounded-full flex items-center gap-2 border-red-500 text-red-500 p-1 px-4"
            onClick={onClose}
          >
            <MdClose /> Cancel
          </button>
          <button
            className="border-2 rounded-full flex items-center gap-2 border-green-500 text-green-500 p-1 px-4"
            onClick={handleAddShift}
          >
            <FaCheck /> Add Shift
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAssignRosterShift;