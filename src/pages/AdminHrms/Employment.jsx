import React, { useEffect, useState } from "react";
import AdminHRMS from "./AdminHrms";
import { FaTrash } from "react-icons/fa";
import AddEmployeeDetailsList from "./AddEmployeeDetailsList";
import { GrHelpBook } from "react-icons/gr";
import {
  getMyHRMSEmployees,
  getMyOrganizationLocations,
  getMyOrgDepartments,
} from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { useSelector } from "react-redux";

const Employment = () => {
  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const listItemStyle = {
    listStyleType: "disc",
    color: "black",
    fontSize: "14px",
    fontWeight: 500,
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
const themeColor = useSelector((state)=> state.theme.color)
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
            />
          </div>
          <div className="grid gap-2 items-center w-full">
            <label htmlFor="jobTitle" className="font-semibold">
              Employment Type:
            </label>
            <select className="border border-gray-400 p-2 rounded-md">
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
              name=""
              id=""
              className="border border-gray-400 p-2 rounded-md"
            />
          </div>
          <div className="grid gap-2 items-center w-full">
            <label htmlFor="jobTitle" className="font-semibold">
              Branch Location:
            </label>
            <select className="border border-gray-400 p-2 rounded-md">
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
            <select className="border border-gray-400 p-2 rounded-md">
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
            />
          </div>
          <div className="grid gap-2 items-center w-full">
            <label htmlFor="designation" className="font-semibold">
              Reporting Supervisor:
            </label>
            <select className="border border-gray-400 p-2 rounded-md">
              <option value="">Select Supervisor</option>
              {employees.map((employee)=>(
                <option value={employee.id} key={employee.id}>{employee.first_name} {employee.last_name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button className="border rounded-md text-white p-1 px-4" style={{background: themeColor}}>Next</button>
        </div>
      </div>
     
    </div>
  );
};

export default Employment;
