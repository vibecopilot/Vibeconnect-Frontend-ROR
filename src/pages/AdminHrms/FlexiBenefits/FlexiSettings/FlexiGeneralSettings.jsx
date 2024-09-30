import React, { useState } from "react";
import FlexiSetting from "./FlexiSetting";
import { GrHelpBook } from "react-icons/gr";

const FlexiGeneralSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const listItemStyle = {
    listStyleType: "disc",
    color: "gray",
    fontSize: "14px",
    fontWeight: 500,
  };
  const [formData, setFormData] = useState({
   initialBalanceDate:"",
   separatePayslip:"",
   previousUploads:"",
   
    id: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className="ml-20 flex gap-2">
      <FlexiSetting />
      <div className="w-2/3 h-full my-10">
        <div className="p-6 bg-white  rounded-md ">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold mb-4">Flexi Benefit Settings</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Edit
              </button>
            ) : (
              <button
                // onClick={handleEditSetting}
                className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Save
              </button>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                When were the initial balances set? (Auto eligibility accrual
                will begin after this date){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name=""
                id=""
                className={`w-full px-3 py-1 border border-gray-300 rounded-md ${
                  !isEditing ? "bg-gray-200" : ""
                }`}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Would you like to have separate payslips for flexi benefits?{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="space-x-4">
                <label>
                  <input
                    type="radio"
                    name="canAdminsApproveLeave"
                    disabled={!isEditing}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="canAdminsApproveLeave"
                    value="no"
                    disabled={!isEditing}
                  />{" "}
                  No
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Would you like to have previous uploads for flexi benefits?{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="space-x-4">
                <label>
                  <input
                    type="radio"
                    name="canSupervisorsAddLeaveAdjustment"
                    disabled={!isEditing}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="canSupervisorsAddLeaveAdjustment"
                    disabled={!isEditing}
                  />{" "}
                  No
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Can supervisors add manual adjustment of eligiblity balance for
                their subordinates? <span className="text-red-500">*</span>
              </label>
              <div className="space-x-4">
                <label>
                  <input
                    type="radio"
                    name="runDailyLeaveAccruals"
                    disabled={!isEditing}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="runDailyLeaveAccruals"
                    disabled={!isEditing}
                  />{" "}
                  No
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Would you like to freeze the submission of flexi benefits?{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="space-x-4">
                <label>
                  <input
                    type="radio"
                    name="runDailyLeaveAccruals"
                    disabled={!isEditing}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="runDailyLeaveAccruals"
                    disabled={!isEditing}
                  />{" "}
                  No
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-4 mr-2  bg-gray-50 rounded-md text-wrap  gap-4 my-2 py-2 pl-5 pr-2 w-[18rem]">
        <div className="flex  gap-4 font-medium">
          <GrHelpBook size={20} />
          <h2>Help Center</h2>
        </div>
        <div className=" ">
          {/* <p className="font-medium">Leave Setting Guidelines:</p> */}
          <ul style={listItemStyle} className="flex flex-col gap-2">
            <li>
              <ul style={listItemStyle}>
                <li>
                  Flexi benefit settings allow you to configure salary-related
                  reimbursements that let employees save on tax by submitting
                  proofs. Unsubmitted amount will be considered as a taxable
                  income.{" "}
                </li>
              </ul>
            </li>
            <li>
              <ul style={listItemStyle}>
                <li>
                  You can create different categories like internet allowances,
                  petrol reimbursements, food allowances, etc. and set the
                  allowance amount in the employee salary table. You can set the
                  frequency as monthly/quarterly/semi-annually/annually.
                </li>
              </ul>
            </li>
            <li>
              <ul style={listItemStyle}>
                <li>
                  The eligibility of the calculations will be based on the
                  attendance.
                </li>
              </ul>
            </li>

            <li>
              <p>
                Employees can track their eligibility and reimbursement status
                from the flexi-benefits section. They also have an option to
                generate separate flexi payslip.
              </p>
            </li>
            <li>
              <p>
                Categories cannot be edited/deleted if already assigned to
                employees. Copyright © 2024 Vibeconnect
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FlexiGeneralSettings;
