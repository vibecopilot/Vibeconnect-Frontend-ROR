import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import { postRegularizationRequest } from "../../../api";
import { FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const AddRegularizationReq = ({ onclose, regDate }) => {
  const themeColor = useSelector((state) => state.theme.color);
  const [regData, setRegData] = useState({
    requestType: "",
    checkInTime: "",
    checkOutTime: "",
    reason: "",
  });

  const hrmsEmployeeId = getItemInLocalStorage("HRMS_EMPLOYEE_ID");
  const handleAddRegRequest = async () => {
    try {
      const postData = new FormData();
      postData.append(
        "requested_check_in",
        regData.checkInTime ? `${regData.checkInTime}:00` : ""
      );
      postData.append(
        "requested_check_out",
        regData.checkOutTime ? `${regData.checkOutTime}:00` : ""
      );
      postData.append("request_type", regData.requestType);
      postData.append("requested_date", regDate);
      postData.append("reason", regData.reason);
      postData.append("employee", hrmsEmployeeId);
      await postRegularizationRequest(postData);
      onclose();
      setRegData({
        ...regData,
        checkInTime: "",
        checkOutTime: "",
        requestType: "",
        reason: "",
      });
      toast.success("Regularization request submitted successfully");
    } catch (error) {
      console.log("Error submitting regularization request:", error);
      toast.error("Failed to submit the regularization request");
    }
  };

  const handleRegChanges = async (e) => {
    setRegData({ ...regData, [e.target.name]: e.target.value });
  };
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-sm z-20">
      <div className="bg-white overflow-auto max-h-[70%]  md:w-auto min-w-[30rem] p-4 flex flex-col rounded-xl gap-2">
        <div>
          <h2 className="font-medium mb-2 border-b">
            New Regularization Request
          </h2>
          <div className="grid gap-2">
            <div className=" flex flex-col gap-2">
              <label htmlFor="" className="font-medium">
                Type of request
              </label>
              <select
                name="requestType"
                id=""
                className="border border-gray-300 rounded-md p-2"
                value={regData.requestType}
                onChange={handleRegChanges}
              >
                <option value="">Select request type</option>
                <option value="Check in">Check in request</option>
                <option value="Check out">Check out request</option>
                <option value="Check in & out">
                  Check in & Check out request
                </option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              {regData.requestType === "Check in" && (
                <div className="flex flex-col gap-2">
                  <label htmlFor="" className="font-medium">
                    Check-In
                  </label>
                  <input
                    type="time"
                    name="checkInTime"
                    value={regData.checkInTime}
                    onChange={handleRegChanges}
                    id=""
                    className="border border-gray-300 rounded-md p-2"
                  />
                </div>
              )}
              {regData.requestType === "Check out" && (
                <div className="flex flex-col gap-2">
                  <label htmlFor="" className="font-medium">
                    Check-Out
                  </label>
                  <input
                    type="time"
                    name="checkOutTime"
                    value={regData.checkOutTime}
                    onChange={handleRegChanges}
                    id=""
                    className="border border-gray-300 rounded-md p-2"
                  />
                </div>
              )}
              {regData.requestType === "Check in & out" && (
                <div className="grid grid-cols-2 gap-1">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="" className="font-medium">
                      Check in
                    </label>
                    <input
                      type="time"
                      name="checkInTime"
                      value={regData.checkInTime}
                      onChange={handleRegChanges}
                      id=""
                      className="border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="" className="font-medium">
                      Check out
                    </label>
                    <input
                      type="time"
                      name="checkOutTime"
                      value={regData.checkOutTime}
                      onChange={handleRegChanges}
                      id=""
                      className="border border-gray-300 rounded-md p-2"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="font-medium">
                Reason
              </label>
              <textarea
                name="reason"
                value={regData.reason}
                onChange={handleRegChanges}
                id=""
                cols="30"
                rows="3"
                className="border border-gray-300 rounded-md p-2"
                placeholder="Enter reason"
              ></textarea>
            </div>
          </div>
          <div className="my-2 flex justify-center gap-2">
            <button
              className="p-2 text-white rounded-md bg-green-400 flex items-center gap-2"
              onClick={handleAddRegRequest}
            >
              <FaCheck /> Submit
            </button>
            <button
              onClick={onclose}
              className=" p-2 text-white rounded-md bg-red-400 flex items-center gap-2"
            >
              <MdClose /> Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRegularizationReq;
