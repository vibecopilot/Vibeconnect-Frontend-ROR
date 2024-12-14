import React, { useState } from "react";
import EditEmployeeDirectory from "./EditEmployeeDirectory";
import EmployeeSections from "./EmployeeSections";
import { useParams } from "react-router-dom";
import { getItemInLocalStorage } from "../../utils/localStorage";
import toast from "react-hot-toast";
import { hrmsEmployeeLogin } from "../../api";
// Import toast

const EmployeesSetup = () => {
  const { id } = useParams();
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordSubmit = async () => {
    if (!password || !confirmPassword) {
      toast.error("Both password fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const postPassword = new FormData();
    postPassword.append("organization", hrmsOrgId);
    postPassword.append("employee", id);
    postPassword.append("password", password);
    try {
      const res = await hrmsEmployeeLogin(postPassword);
      toast.success("Password successfully updated!");
    } catch (error) {}
  };

  return (
    <div className="flex flex-col ml-20">
      <EditEmployeeDirectory />
      <div className="flex">
        <div className="">
          <EmployeeSections empId={id} />
        </div>
        <div className="w-full p-2 bg-white rounded-lg mb-5">
          <div className="p-4 grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="font-medium">
                Password
              </label>
              <input
                type="text"
                id="password"
                className="border border-gray-400 rounded-md p-2"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="font-medium">
                Confirm Password
              </label>
              <input
                type="text"
                id="confirmPassword"
                className="border border-gray-400 rounded-md p-2"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end mx-5">
            <button
              className="bg-green-400 p-2 rounded-md font-medium text-white"
              onClick={handlePasswordSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeesSetup;
