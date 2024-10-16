import React, { useEffect, useState } from "react";
import { getMyOrganizationLocations, getMyOrgDepartments } from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";

const AddJobInfo = ({closeModal1}) => {
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const fetchLocation = async () => {
    try {
      const res = await getMyOrganizationLocations(hrmsOrgId);
      setLocations(res);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchDepartments = async () => {
    try {
      const res = await getMyOrgDepartments(hrmsOrgId);
      setDepartments(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLocation();
    fetchDepartments();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center overflow-y-auto justify-center bg-gray-500 bg-opacity-50">
      <div class="max-h-screen bg-white p-2 px-3 w-[32rem] rounded-lg shadow-lg overflow-y-auto">
        <form>
          <h2 className="text-2xl font-bold mb-4">Job Information</h2>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-700">
                Effective From <span className="text-red-500">*</span>
              </label>
              <input type="date" className="mt-1 p-2  border rounded-md" />
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Branch Location <span className="text-red-500">*</span>
              </label>
              <select className="mt-1 p-2 text-black border w-full rounded-md">
                <option value="">Select Location</option>
                {locations.map((location) => (
                  <option value={location.id} key={location.id}>
                    {location.location} {location.city} {location.state}{" "}
                    {location.country}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Department <span className="text-red-500">*</span>
              </label>
              <select className="mt-1 p-2 text-black border rounded-md w-full">
                <option value="">Select Department</option>
                {departments.map((department) => (
                  <option value={department.id} key={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Designation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="mt-1 p-2  border rounded-md w-full"
                placeholder="Enter designation"
              />
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Reporting supervisor{" "}
              </label>
              <input
                type="text"
                className="mt-1 p-2  border rounded-md w-full"
                placeholder=""
              />
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Project{" "}
              </label>
              <input
                type="text"
                className="mt-1 p-2  border rounded-md w-full"
                placeholder="Project working on"
              />
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Comment{" "}
              </label>
              <input
                type="text"
                className="mt-1 p-2  border rounded-md w-full"
                placeholder="Comment"
              />
            </div>
          </div>
          <div className="flex my-2 justify-end gap-2">
            <button
              type="button"
                onClick={closeModal1}
              className="border-2 border-red-400 rounded-full text-red-400 px-4 p-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className=" bg-green-400 rounded-full p-1 px-4 text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobInfo;
