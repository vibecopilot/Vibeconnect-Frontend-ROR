import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import MultiSelect from "../Components/MultiSelect";
import {
  getMyHRMSEmployees,
  getRosterShift,
  postRosterRecord,
} from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import DatePicker from "react-multi-date-picker";
import "react-multi-date-picker/styles/colors/teal.css";
import toast from "react-hot-toast";
const AssignRosterShifts = ({ onClose, fetchRosterRecords }) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const [shifts, setShifts] = useState([]);
  const [formData, setFormData] = useState({
    selectedShift: "",
  });
  const [AllSites, setAllSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");

  const fetchSites = async () => {
    try {
      const sites = await getAssociatedSites(hrmsOrgId);
      console.log("Sites:", sites);
      setAllSites(sites);
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  };
  

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

  const [selectedDates, setSelectedDates] = useState([]);

  const handleDateChange = (dates) => {
    const formattedDates = dates.map((date) => date.format("YYYY-MM-DD"));
    setSelectedDates(formattedDates);
  };
  console.log(selectedDates);
  const handleAssignRoster = async () => {
    try {
      if (!selectedOptions.length) {
        return toast.error("Please select employees");
      }
      if (!formData.selectedShift) {
        return toast.error("Please select shift");
      }
      if (!selectedDates.length) {
        return toast.error("Please select dates");
      }

      const payload = {
        employee_ids: selectedOptions,
        shift_id: formData.selectedShift,
        date_range: selectedDates,
      };
      const response = await postRosterRecord(payload);
      console.log("Roster assigned successfully:", response);
      fetchRosterRecords();
      onClose();
    } catch (error) {
      console.error("Error assigning roster:", error.message);
    }
  };

  return (
    <div className="z-10 fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-xl shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Assign Multiple Shifts</h2>
        <div className="max-h-96 overflow-y-auto p-2">
          <div>
            <MultiSelect
              options={employees}
              title={"Select Employees"}
              handleSelect={handleSelect}
              // handleSelectAll={handleSelectAll}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              setOptions={setEmployees}
              searchOptions={filteredEmployees}
              compTitle="Select Employees"
            />
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
            <div className="w-full flex flex-col gap-1">
              <h2 className="font-medium">Select Dates</h2>
              <DatePicker
                value={selectedDates}
                onChange={handleDateChange}
                multiple
                // range
                format="YYYY-MM-DD"
                placeholder="Select Dates to assign Roster shifts"
                // className="w-full border border-teal-600 rounded-lg px-3 py- focus:ring-2 focus:ring-teal-400"
                inputClass="text-teal-700 text-sm font-medium p-2 w-full border rounded-md border-gray-300"
              />
            </div>
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
            onClick={handleAssignRoster}
          >
            <FaCheck /> Add Shift
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignRosterShifts;
