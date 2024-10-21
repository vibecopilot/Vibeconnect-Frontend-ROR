import React from "react";
import AdminHRMS from "./AdminHrms";
import { GrHelpBook } from "react-icons/gr";
import { ImInfo } from "react-icons/im";
import { FaCircleInfo } from "react-icons/fa6";

const Resignation = () => {
  const listItemStyle = {
    listStyleType: "disc",
    color: "gray",
    fontSize: "14px",
    fontWeight: 500,
  };
  return (
    <div className="flex justify-between">
      <AdminHRMS />

      <div className=" ml-20 p-4 w-full">
        <h1 className="text-2xl font-bold ">Resignation Application</h1>
        <p className=" font-semibold border-b">
          Employees who have requested for separation from the organisation are
          located here.
        </p>
        <h1 className="text-2xl font-bold mb-4 mt-2">Resignation Form</h1>
        <form className="space-y-4 mb-10">
          <div className=" border rounded-lg p-2 border-red-50 bg-red-100">
            <p className="font-bold">Basic Information</p>
            <div className="grid md:grid-cols-2 gap-2 text-sm mt-2 ">
              <div className="flex justify-between">
                <label className="block font-medium">Employee Name:</label>

                <p>Mittu Panda</p>
              </div>
              <div className="flex justify-between">
                <label className="block font-medium">Employee Code:</label>

                <p>123</p>
              </div>
              <div className="flex justify-between">
                <label className="block font-medium">Employment Status:</label>

                <p>Confirmed</p>
              </div>
              <div className="flex justify-between">
                <label className="block font-medium">Designation:</label>

                <p>Business & Operations Manager</p>
              </div>
              <div className="flex justify-between">
                <label className="block font-medium">Joining Date:</label>

                <p>02-Sep-2019</p>
              </div>
              <div className="flex justify-between">
                <label className="block font-medium">Branch Location:</label>

                <p>Mumbai; Mumbai; Maharashtra</p>
              </div>
              <div className="flex justify-between">
                <label className="block font-medium">Department:</label>

                <p>Management</p>
              </div>
              <div className="flex justify-between">
                <label className="block font-medium">
                  Supervisor Name & Code:
                </label>

                <p>Praveen Nair - BPC1</p>
              </div>
              <div className="flex justify-between">
                <label className="block font-medium">Submission Date:</label>

                <p>13-Jul-2024</p>
              </div>
            </div>
          </div>
          <p className="font-bold border-b">Resignation Details</p>
          <div className="grid md:grid-cols-2 gap-2 mt-2">
            <div className="grid gap-2 items-center w-full">
              <label className="block font-medium">
                Resignation Applicate Date{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value="2024-07-13"
                className="border border-gray-400 p-2 rounded-md"
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block font-medium">
                Requested Last Working Date{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value="2024-08-11"
                className="border border-gray-400 p-2 rounded-md"
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block font-medium">
                Separation Types and Reasons{" "}
                <span className="text-red-500">*</span>
              </label>
              <select className="border border-gray-400 p-2 rounded-md">
                <option>Please Select</option>
              </select>
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block font-medium">
                FnF Settlement Month <span className="text-red-500">*</span>
              </label>
              <input
                type="month"
                name=""
                id=""
                className="border border-gray-400 p-2 rounded-md"
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block font-medium">Comments:</label>
              <textarea className="border border-gray-400 p-2 rounded-md"></textarea>
            </div>
          </div>
          {/* <p className="font-bold">Additional Details</p>
          <div className="grid md:grid-cols-2 gap-2 mt-2">
            <div className="grid gap-2 items-center w-full">
              <label className="block font-medium">
                Approval Authority for Pending Applications:
              </label>
              <input
                type="text"
                className="border border-gray-400 p-2 rounded-md"
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block font-medium">
                Effective Date of Approval Authority for Pending Application:
              </label>
              <input
                type="date"
                value="2024-08-11"
                className="border border-gray-400 p-2 rounded-md"
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block font-medium">
                Transfer Reporting Supervisor Authority To:
              </label>
              <input
                type="text"
                className="border border-gray-400 p-2 rounded-md"
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block font-medium">
                Effective Date of Transfer Reporting Supervisor Authority To:
              </label>
              <input
                type="date"
                value="2024-08-11"
                className="border border-gray-400 p-2 rounded-md"
              />
            </div> */}
          <div className="grid grid-cols-2">
            <div className="grid gap-2 items-center w-full">
              <label className="block font-medium">Hold Salary?</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="hold_salary"
                    value="yes"
                    className="mr-2"
                  />{" "}
                  Yes
                </label>
                <label className="ml-4">
                  <input
                    type="radio"
                    name="hold_salary"
                    value="no"
                    className="mr-2"
                  />{" "}
                  No
                </label>
              </div>
            </div>
            <div>
              <label className="block font-medium">
                Employee Portal access after the Last working days:
              </label>
              <input
                type="number"
                value="0"
                className="border border-gray-400 p-2 w-full rounded-md"
              />
            </div>
          </div>
          <p className="font-bold border-b">
            Estimated Full & Final Settlement and Recovery
          </p>
          <p className="font-medium bg-gray-400 p-1 rounded-md text-white">
            Leave Encashment/Recovery:
          </p>
          <div className="grid md:grid-cols-2 gap-2">
            <div className="grid gap-2 items-center w-full">
              <label className="block font-medium">
                Total Leave Encashment/Recovery Days (Calculated):
              </label>
              <input
                type="number"
                value="0"
                readOnly
                className="border border-gray-200 p-2 rounded-md bg-gray-200"
                disabled
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block font-medium">
                Total Leave Encashment/Recovery (Calculated):
              </label>
              <input
                type="number"
                value="0"
                readOnly
                className="border border-gray-200 p-2 rounded-md bg-gray-200"
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className=" font-medium flex items-center gap-2 ">
                Overwrite Leave Encashment/Recovery Days{" "}
                <FaCircleInfo title="Enter the leave encashment days which you would like to show in F&F" />
              </label>
              <input
                type="number"
                className="border border-gray-400 p-2 rounded-md"
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="font-medium flex items-center gap-2">
                Overwrite Leave Encashment/Recovery Amount{" "}
                <FaCircleInfo title="Enter the leave encashment amount you would like to pay in F&F" />
              </label>
              <input
                type="number"
                className="border border-gray-400 p-2 rounded-md"
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block font-medium">
                How to calculate Leave encash exemption?
              </label>
              <select
                name=""
                id=""
                className="border border-gray-400 p-2 rounded-md"
              >
                <option value="Manually Enter the Amount while calculating the FNF">
                  Manually Enter the Amount while calculating the FNF
                </option>
                <option value="Automatically calculate as per Government's Limit (300000)F">
                  Automatically calculate as per Government's Limit (300000)
                </option>
              </select>
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block font-medium">
                Leave Encashment Exemption to be paid
              </label>
              <input
                type="number"
                value="0"
                className="border border-gray-400 p-2 rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 items-center w-full">
              <div className="grid gap-2 items-center">
                <label className="block font-medium">
                  Eligible for Gratuity:
                </label>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="gratuity"
                      value="yes"
                      className="mr-2"
                      checked
                    />{" "}
                    Yes
                  </label>
                  <label className="ml-4">
                    <input
                      type="radio"
                      name="gratuity"
                      value="no"
                      className="mr-2"
                    />{" "}
                    No
                  </label>
                </div>
              </div>
              <div className="grid gap-2 items-center w-full">
                <label className="block font-medium">Gratuity Amount:</label>
                <input
                  type="text"
                  value="0"
                  className="border border-gray-200 p-2 rounded-md bg-gray-200"
                />
              </div>
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className=" font-medium flex items-center gap-2">
                Overwrite Gratuity Amount{" "}
                <FaCircleInfo title="Enter the Gratuity amount you would like to pay in F&F" />
              </label>
              <input
                type="number"
                className="border border-gray-400 p-2 rounded-md"
              />
            </div>
          </div>
          <p className="font-medium bg-gray-400 p-1 rounded-md text-white">
            Notice Period Recovery
          </p>
          <div className="grid md:grid-cols-2 gap-2 mt-2">
            <div className="grid gap-2 items-center w-full">
              <label className="block font-medium">
                Served Notice Days <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value="30"
                readOnly
                className="border border-gray-200 p-2 rounded-md bg-gray-200"
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block font-medium">
                Notice Recovery Days <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value="0"
                className="border border-gray-200 p-2 rounded-md bg-gray-200"
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block font-medium">
                Notice Period Recovery Amount
              </label>
              <input
                type="number"
                value="0"
                className="border border-gray-400 p-2 rounded-md"
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="font-medium flex gap-2 items-center">
                Overwrite Notice Period Recovery Amount{" "}
                <FaCircleInfo title="Enter the notice period recovery amount you would like to recover from employee F&F" />
              </label>
              <input
                type="number"
                className="border border-gray-400 p-2 rounded-md"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <button
              type="submit"
              className="bg-blue-500 border-2 border-blue-500 text-white p-2 px-4 rounded-md"
            >
              Submit
            </button>
            <button
              type="submit"
              className="border-red-500 border-2 px-4 p-2 rounded-md text-red-500 "
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <div className="my-4 mx-2 w-fit">
        <div className="flex flex-col bg-gray-50 rounded-md text-wrap  gap-4 my-2 py-2 pl-5 pr-2 w-[18rem]">
          <div className="flex  gap-4 font-medium">
            <GrHelpBook size={20} />
            <h2>Help Center</h2>
          </div>
          <p className="font-bold">Resignation Application Help Section:</p>
          <div className=" ">
            {/* <p className="font-medium">Help Center</p> */}
            <ul style={listItemStyle} className="flex flex-col gap-2">
              <li>
                <ul style={listItemStyle}>
                  <li>
                    Resignation Application allows Admins to initiate voluntary
                    or involuntary resignation applications on behalf of the
                    employees. He can do so in situations like the employee
                    absconding, termination etc. As an Admin you can:{" "}
                  </li>
                </ul>
              </li>
              <li>
                <ul style={listItemStyle}>
                  <li>
                    Define the last working day of the employee, the separation
                    reason, and the FNF settlement Month.{" "}
                  </li>
                </ul>
              </li>
              <li>
                <ul style={listItemStyle}>
                  <li>
                    Decide if you wish to keep the employees' salary on hold and
                    whether the employees' offboarding tasks and exit interviews
                    are required.{" "}
                  </li>
                </ul>
              </li>

              <li>
                <p>
                  {/* <a href="#" className="text-blue-400">
                      Click Here{" "}
                    </a> */}
                  Control the leave encashment/recovery, gratuity eligibility,
                  and notice period recovery.{" "}
                </p>
              </li>
              <li>
                <p>
                  {/* <a href="#" className="text-blue-400">
                      Click Here{" "}
                    </a> */}
                  View/Edit/Cancel Separation Applications{" "}
                </p>
              </li>
              <li>
                <p>
                  {/* <a href="#" className="text-blue-400">
                      Click Here{" "}
                    </a> */}
                  Download FNF Payslip{" "}
                </p>
              </li>
              <li>
                <p>
                  {/* <a href="#" className="text-blue-400">
                      Click Here{" "}
                    </a> */}
                  Download Resignation details{" "}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resignation;
