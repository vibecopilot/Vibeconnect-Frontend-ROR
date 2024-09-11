import React, { useEffect, useState } from "react";
import AdminHRMS from "./AdminHrms";
import { FaArrowRight, FaTrash } from "react-icons/fa";
import AddEmployeeDetailsList from "./AddEmployeeDetailsList";
import { GrHelpBook } from "react-icons/gr";
import {
  getMyHRMSEmployees,
  getMyOrganizationLocations,
  getMyOrgDepartments,
} from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { useSelector } from "react-redux";

const Employment = ({ setSteps, empId }) => {
  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employeeCode: "",
    joinDate: "",
    employmentType: "",
    probationDuseDate: "",
    branch: "",
    department: "",
    designation: "",
    supervisor: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationRes = await getMyOrganizationLocations(hrmsOrgId);
        setLocations(locationRes);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchDepartments = async () => {
      try {
        const departmentRes = await getMyOrgDepartments(hrmsOrgId);
        setDepartments(departmentRes);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchEmployees = async () => {
      try {
        const employeeRes = await getMyHRMSEmployees(hrmsOrgId);
        setEmployees(employeeRes);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLocations();
    fetchDepartments();
    fetchEmployees();
  }, []);
  const themeColor = useSelector((state) => state.theme.color);
  const [disableNext, setDisableNext] = useState(true);
  const [disableSave, setDisableSave] = useState(false);

  const handleAddEmployment = async () => {
    const postData = new FormData();
  };

  return (
    <div className="flex  w-full">
      {/* <AddEmployeeDetailsList /> */}
      <div className="w-full p-6 bg-white rounded-lg ">
        <h2 className="border-b text-center text-xl border-black mb-6 font-bold mt-2">
          Employment Information
        </h2>
        <div className="grid md:grid-cols-3 gap-2 mt-5">
          <div className="grid gap-2 items-center w-full">
            <label htmlFor="companyName" className="font-semibold">
              Employee Code:
            </label>
            <input
              type="text"
              id="companyName"
              className="border border-gray-400 p-2 rounded-md"
              placeholder="Enter Employee code"
              value={formData.employeeCode}
              onChange={handleChange}
              name="employeeCode"
            />
          </div>

          <div className="grid gap-2 items-center w-full">
            <label htmlFor="jobTitle" className="font-semibold">
              Joining Date:
            </label>
            <input
              type="date"
              id="jobTitle"
              className="border border-gray-400 p-2 rounded-md"
              placeholder="Enter Job Title"
              value={formData.joinDate}
              onChange={handleChange}
              name="joinDate"
            />
          </div>
          <div className="grid gap-2 items-center w-full">
            <label htmlFor="jobTitle" className="font-semibold">
              Employment Type:
            </label>
            <select
              className="border border-gray-400 p-2 rounded-md"
              value={formData.employmentType}
              onChange={handleChange}
              name="employmentType"
            >
              <option value="">Select Employment Type</option>
              <option value="fullTime">Full Time</option>
              <option value="partTime">Part Time</option>
            </select>
          </div>
          <div className="grid gap-2 items-center w-full">
            <label htmlFor="jobTitle" className="font-semibold">
              Probation Due Date:
            </label>
            <input
              type="date"
              name="probationDuseDate"
              id=""
              className="border border-gray-400 p-2 rounded-md"
              value={formData.probationDuseDate}
            />
          </div>
          <div className="grid gap-2 items-center w-full">
            <label htmlFor="jobTitle" className="font-semibold">
              Branch Location:
            </label>
            <select
              className="border border-gray-400 p-2 rounded-md"
              value={formData.branch}
              onChange={handleChange}
              name="branch"
            >
              <option value="">Select Branch Location</option>
              {locations?.map((location) => (
                <option value={location.id} key={location.id}>
                  {location.city}, {location.state}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2 items-center w-full">
            <label htmlFor="jobTitle" className="font-semibold">
              Department:
            </label>
            <select
              className="border border-gray-400 p-2 rounded-md"
              value={formData.department}
              onChange={handleChange}
              name="department"
            >
              <option value="">Select Department</option>
              {departments?.map((department) => (
                <option value={department.id} key={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2 items-center w-full">
            <label htmlFor="designation" className="font-semibold">
              Designation:
            </label>
            <input
              type="text"
              id="designation"
              className="border border-gray-400 p-2 rounded-md"
              placeholder="Enter Designation"
              onChange={handleChange}
              value={formData.designation}
              name="designation"
            />
          </div>
          <div className="grid gap-2 items-center w-full">
            <label htmlFor="designation" className="font-semibold">
              Reporting Supervisor:
            </label>
            <select
              className="border border-gray-400 p-2 rounded-md"
              value={formData.supervisor}
              onChange={handleChange}
              name="supervisor"
            >
              <option value="">Select Supervisor</option>
              {employees.map((employee) => (
                <option value={employee.id} key={employee.id}>
                  {employee.first_name} {employee.last_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-5 justify-end items-center my-4">
          <button
            type="submit"
            // style={{ background: themeColor }}
            // onClick={handleAddEmployee}
            onClick={() => setDisableNext(false)}
            className={`px-4 py-2  text-white font-medium rounded-md flex items-center gap-2 ${
              disableSave ? "bg-gray-400 cursor-not-allowed" : "bg-green-400"
            }`}
            disabled={disableSave}
          >
            Save
          </button>
          <button
            type="submit"
            // onClick={()=> setSteps("employment")}
            onClick={() => setSteps("salary")}
            className={`px-4 py-2  text-white font-medium  rounded-md flex items-center gap-2 ${
              disableNext ? "bg-gray-400 cursor-not-allowed" : "bg-green-400"
            }`}
            disabled={disableNext}
          >
            Next <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Employment;
