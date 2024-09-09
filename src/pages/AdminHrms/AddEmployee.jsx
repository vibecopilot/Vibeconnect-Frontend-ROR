import React, { useState } from "react";
import AdminHRMS from "./AdminHrms";
import { FaTrash } from "react-icons/fa";
import AddEmployeeDetailsList from "./AddEmployeeDetailsList";
import { GrHelpBook } from "react-icons/gr";
import Select from "react-select";

const paymentOptions = [
  { value: "salary", label: "Salary" },
  { value: "expense", label: "Expense" },
  { value: "offcycle", label: "Off-Cycle" },
];

const AddEmployee = () => {
  const listItemStyle = {
    listStyleType: "disc",
    color: "black",
    fontSize: "14px",
    fontWeight: 500,
  };

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected); // Store the selected options in the state
  };
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    Mobile: "",
    gender: "",
    dob: "",
    bloodGroup: "",
    pan: "",
    aadhar: "",
    maritalStatus: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    fatherName: "",
    motherName: "",
    spouseName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    code: "",
    paymentMode: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  console.log(formData);
  return (
    <div className="flex ml-20">
      <AddEmployeeDetailsList />
      <div className="w-full p-6 bg-white rounded-lg ">
        <h2 className="border-b text-center text-xl border-black mb-6 font-bold mt-2">
          Employee Basic Information
        </h2>
        <div>
          <div className="grid md:grid-cols-3 gap-2 gap-y-4 mt-5">
            <div className="grid gap-2 items-center w-full">
              <label className="block text-sm font-medium text-gray-700">
                First Name*
              </label>
              <input
                type="text"
                className="border border-gray-400 p-2 rounded-md"
                placeholder="First name"
                required
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block text-sm font-medium text-gray-700">
                Last Name*
              </label>
              <input
                type="text"
                className="border border-gray-400 p-2 rounded-md"
                placeholder="Last name"
                required
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block text-sm font-medium text-gray-700">
                Email ID*
              </label>
              <input
                type="email"
                className="border border-gray-400 p-2 rounded-md"
                placeholder="Email"
                required
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block text-sm font-medium text-gray-700">
                Mobile
              </label>
              <input
                type="tel"
                className="border border-gray-400 p-2 rounded-md"
                placeholder="Mobile Number"
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block text-sm font-medium text-gray-700">
                Gender*
              </label>
              <select
                className="border border-gray-400 p-2 rounded-md"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth *
              </label>
              <input
                type="date"
                className="border border-gray-400 p-2 rounded-md"
                required
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block text-sm font-medium text-gray-700">
                Blood Group *
              </label>
              <select
                className="border border-gray-400 p-2 rounded-md"
                required
              >
                <option value="">Select Blood Group</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
                <option value="A-">A-</option>
                <option value="B-">B-</option>
                <option value="AB-">AB-</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
                <option value="O+">O+</option>
              </select>
            </div>

            <div className="grid gap-2 items-center w-full">
              <label className="block text-sm font-medium text-gray-700">
                PAN
              </label>
              <input
                type="text"
                className="border border-gray-400 p-2 rounded-md"
                placeholder="PAN "
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block text-sm font-medium text-gray-700">
                Aadhar No
              </label>
              <input
                type="text"
                className="border border-gray-400 p-2 rounded-md"
                placeholder="Aadhar Number"
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block text-sm font-medium text-gray-700">
                Marital Status
              </label>
              <select className="border border-gray-400 p-2 rounded-md">
                <option value="single">Single</option>
                <option value="married">Married</option>
              </select>
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block text-sm font-medium text-gray-700">
                Emergency Contact Name
              </label>
              <input
                type="text"
                className="border border-gray-400 p-2 rounded-md"
                placeholder="Emergency Contact Name"
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block text-sm font-medium text-gray-700">
                Emergency Contact No.
              </label>
              <input
                type="text"
                className="border border-gray-400 p-2 rounded-md"
                placeholder="Emergency Contact Number"
              />
            </div>
          </div>

          {/* <h3 className="text-xl font-bold mt-6 mb-4">Family Information</h3> */}
          <h2 className="border-b text-center text-xl border-black  mb-6 font-bold mt-2">
            Family Information
          </h2>
          <div className="grid md:grid-cols-3 gap-2 mt-5">
            <div className="grid gap-2 items-center w-full">
              <label className="block text-sm font-medium text-gray-700">
                Father's Name
              </label>
              <input
                type="text"
                className="border border-gray-400 p-2 rounded-md"
                placeholder="Father's Name"
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block text-sm font-medium text-gray-700">
                Mother's Name
              </label>
              <input
                type="text"
                className="border border-gray-400 p-2 rounded-md"
                placeholder="Mother's Name"
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block text-sm font-medium text-gray-700">
                Spouse's Name
              </label>
              <input
                type="text"
                className="border border-gray-400 p-2 rounded-md"
                placeholder="Spouse's Name"
              />
            </div>
          </div>

          {/* <h3 className="text-xl font-bold mt-6 mb-4">Address Information</h3> */}
          <h2 className="border-b text-center text-xl  border-black mb-6 font-bold mt-2">
            Address Information
          </h2>
          <div className="grid md:grid-cols-3 gap-2 mt-5">
            <div className="grid gap-2 items-center w-full">
              <label className="block text-sm font-medium text-gray-700">
                Address Line 1
              </label>
              <input
                type="text"
                className="border border-gray-400 p-2 rounded-md"
                placeholder="Address Line 1"
                maxLength="150"
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block text-sm font-medium text-gray-700">
                Address Line 2
              </label>
              <input
                type="text"
                className="border border-gray-400 p-2 rounded-md"
                placeholder="Address Line 2"
                maxLength="150"
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                className="border border-gray-400 p-2 rounded-md"
                placeholder="Country"
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block text-sm font-medium text-gray-700">
                State/Province
              </label>
              <input
                type="text"
                className="border border-gray-400 p-2 rounded-md"
                placeholder="State/Province"
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                className="border border-gray-400 p-2 rounded-md"
                placeholder="City"
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label className="block text-sm font-medium text-gray-700">
                Zip / Pin Code
              </label>
              <input
                type="text"
                className="border border-gray-400 p-2 rounded-md"
                placeholder="Zip / Pin Code"
              />
            </div>
          </div>

          <h2 className="border-b text-center text-xl border-black mb-6 font-bold mt-2">
            Payment Information
          </h2>
          <div className="grid gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700"
              >
                Payment Type
              </label>
              <Select
                id="paymentType"
                options={paymentOptions}
                isMulti // Enables multiple selection
                value={selectedOptions}
                onChange={handleSelectChange}
                placeholder="Select payment type(s)"
                menuPlacement="top"
              />
            </div>
            <div className="grid lg:grid-cols-3 gap-2">
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">
                  Payment Mode *
                </label>
                <select
                  className="border border-gray-400  p-2  rounded-md"
                  required
                  value={formData.paymentMode}
                  onChange={handleChange}
                  name="paymentMode"
                >
                  <option value="">Select payment Mode</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="bankTransfer">Bank Transfer</option>
                </select>
              </div>
              {formData.paymentMode === "bankTransfer" && (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      name=""
                      id=""
                      className="border border-gray-400  p-2  rounded-md"
                      placeholder="Enter bank name"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Bank Account Number *
                    </label>
                    <input
                      type="text"
                      name=""
                      id=""
                      className="border border-gray-400  p-2  rounded-md"
                      placeholder="Enter bank account no."
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Bank IFSC code *
                    </label>
                    <input
                      type="text"
                      name=""
                      id=""
                      className="border border-gray-400  p-2  rounded-md"
                      placeholder="Enter IFSC"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mt-5"></div>

          <div className="flex gap-5 justify-center items-center my-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <div className="my-4 mx-2 w-fit">
        <div className="flex flex-col   bg-gray-50 rounded-md text-wrap  gap-4 my-2 py-2 pl-5 pr-2 w-[18rem]">
          <div className="flex  gap-4 font-medium">
            <GrHelpBook size={20} />
            <h2>Tool Tips</h2>
          </div>
          <div className=" ">
            {/* <p className="font-medium">Help Center</p> */}
            <ul style={listItemStyle} className="flex flex-col gap-2">
              <li>
                <ul style={listItemStyle}>
                  <li>
                    Add basic employee details such as Name, Email ID, Contact
                    Number, Gender, DoB, PAN and AADHAR Number.{" "}
                  </li>
                </ul>
              </li>
              <li>
                <ul style={listItemStyle}>
                  <li>
                    Add Family Information such as Father's Name, Senior Citizen
                    applicable, Disability Level etc{" "}
                  </li>
                </ul>
              </li>
              <li>
                <ul style={listItemStyle}>
                  <li>Add employee's Payment Information </li>
                </ul>
              </li>

              <li>
                <p>
                  Any custom fields added in Organisation {">"} Organisation
                  Settings {">"} Employee Fields {">"} Personal Details will be
                  reflected on the page{" "}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
