import { useState } from "react";
import { postCompanyHoliday } from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";

const HolidayModal = ({ onSave, onClose }) => {
  const [holidayName, setHolidayName] = useState("");
  const [holidayDate, setHolidayDate] = useState("");
  const [holidayType, setHolidayType] = useState("Mandatory");
  const [appliesTo, setAppliesTo] = useState("All Employees");
  const [employees, setEmployees] = useState([]);
  // useEffect(() => {
  //   const fetchAllEmployees = async () => {
  //     try {
  //       const res = await getAllHRMSEmployee();
  //       const FilteredEmployee = res.filter(
  //         (org) => org.organization === hrmsOrgId
  //       );
  //       const employeesList = FilteredEmployee.map((emp) => ({
  //         value: emp.id,
  //         label: `${emp.first_name} ${emp.last_name}`,
  //       }));

  //       setEmployees(employeesList);
  //       console.log(res);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchAllEmployees();
  // }, []);
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const AddHoliDay = async () => {
    const formData = new FormData();
    formData.append("name", holidayName);
    formData.append("date", holidayDate);
    formData.append("types_of_holiday", holidayType);
    formData.append("applies_to", appliesTo);
    formData.append("organization", hrmsOrgId);
    try {
      const res = await postCompanyHoliday(formData);
      console.log(res);
      onClose()
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-2 items-center">
          <div className="">
            <label className="block font-medium text-gray-700">
              Holiday Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={holidayName}
              onChange={(e) => setHolidayName(e.target.value)}
              required
              placeholder="Enter holiday name"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">
              Select Holiday Icon <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              className="mt-1 block w-full p-2 text-sm border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={holidayDate}
            onChange={(e) => setHolidayDate(e.target.value)}
            required
          />
        </div>

        <div className="">
          <label className="block text-sm font-medium text-gray-700">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={holidayType}
            onChange={(e) => setHolidayType(e.target.value)}
            required
          >
            <option value="">Select Holiday</option>
            <option value="Mandatory">Mandatory</option>
            <option value="Flexi">Flexi</option>
          </select>
        </div>
      </div>
      <div className="my-2">
        <label className="block text-sm font-medium text-gray-700">
          Applies To <span className="text-red-500">*</span>
        </label>
        <select
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          value={appliesTo}
          onChange={(e) => setAppliesTo(e.target.value)}
          required
        >
          <option value="">Select Applies To</option>
          <option value="All Employees">All Employees</option>
          <option value="Some Employees">Some Employees</option>
          <option value="Specific Employees">Specific Employees</option>
        </select>
        {/* <Select
                  options={employees}
                  noOptionsMessage={() => "No Employee Available"}
                  onChange={handleUserChangeSelect}
                  placeholder="Select Department Head"
                /> */}
      </div>
      <div className="flex justify-end gap-2">
        <button className="px-4 py-2 bg-gray-300 rounded-md" onClick={onClose}>
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={AddHoliDay}
        >
          Save
        </button>
      </div>
    </>
  );
};

export default HolidayModal;
