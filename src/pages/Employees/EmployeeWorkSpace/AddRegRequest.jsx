import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { postRegularizationRequest } from "../../../api";
import toast from "react-hot-toast";
import { PiPlus, PiPlusCircleBold } from "react-icons/pi";
import { getItemInLocalStorage } from "../../../utils/localStorage";

const AddRegRequest = ({ setAddRegReq }) => {
  const [regData, setRegData] = useState({
    requestType: "",
    checkInTime: "",
    checkOutTime: "",
    reason: "",
    requestDate: "",
  });
  const hrmsEmployeeId = getItemInLocalStorage("HRMS_EMPLOYEE_ID");
  const handleAddRegRequest = async () => {
    try {
      const todayDate = new Date().toISOString().split("T")[0];
     
      const postData = new FormData();
      postData.append(
        "requested_check_in",
        regData.checkInTime ? `${regData.checkInTime}:00` : ""
      );
      postData.append(
        "requested_check_out",
        regData.checkOutTime ? `${regData.checkOutTime}:00` : ""
      );
      // postData.append("requested_check_in", requestedCheckIn);
      // postData.append("requested_check_out", requestedCheckOut);
      postData.append("request_type", regData.requestType);
      postData.append("requested_date", regData.requestDate);
      postData.append("reason", regData.reason);
      postData.append("employee", hrmsEmployeeId);
      await postRegularizationRequest(postData);
      setAddRegReq(false);
      //   setSelectedEmpAttendance(false);
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white px-6 py-4 rounded-xl shadow-lg min-w-96">
        <div
          // style={{ background: themeColor }}
          className="flex justify-between gap-2 bg-gray-100 items-center p-2 rounded-md w-[40rem]"
        >
          <div className="flex gap-2 items-center">
            <div className="flex flex-col ">
              <p className="font-semibold flex items-center justify-center text-center gap-2  text-lg">
                <PiPlusCircleBold /> New regularization Request
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 my-2">
          <div className="w-full border-b flex justify-between items-center">
            <p className="font-medium">Regularization Details </p>
          </div>
          <div className=" flex flex-col gap-2">
            <label htmlFor="" className="font-medium">
              Select Date
            </label>
            <input
              type="date"
              name="requestDate"
              id=""
              className="border border-gray-300 rounded-md p-2"
              value={regData.requestDate}
              onChange={handleRegChanges}
            />
          </div>
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
              Comment
            </label>
            <textarea
              name="reason"
              value={regData.reason}
              onChange={handleRegChanges}
              id=""
              cols="30"
              rows="3"
              className="border border-gray-300 rounded-md p-2"
            ></textarea>
          </div>
          <div className="flex gap-2 justify-center items-center border-t p-1 ">
            <button
              className=" bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2"
              onClick={() => setAddRegReq(false)}
            >
              <MdClose /> Cancel
            </button>
            <button
              className=" bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2"
              onClick={handleAddRegRequest}
            >
              <FaCheck /> Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRegRequest;
