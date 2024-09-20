import React, { useState } from "react";
import PayrollSettingDetailsList from "./PayrollSettingDetailsList";
const options = [
  { value: "basic", label: "Basic" },
  { value: "hra", label: "HRA" },
  { value: "other", label: "Other" },
  { value: "special", label: "Special" },
  { value: "monthly-retainer-fee", label: "Monthly Retainer Fee" },
];
import { GrHelpBook } from "react-icons/gr";

const LeaveRecovery = () => {
  const [LIN, setLIN] = useState("");
  const [isESIC, setIsESIC] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const listItemStyle = {
    listStyleType: "disc",
    color: "black",
    fontSize: "14px",
    fontWeight: 500,
  };
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDropdownVisible1, setIsDropdownVisible1] = useState(false);

  const handleSelect = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };
  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };
  const toggleDropdown1 = () => {
    setIsDropdownVisible1(!isDropdownVisible1);
  };
  const handleSelectAll = () => {
    if (selectedOptions.length === options.length) {
      setSelectedOptions([]);
    } else {
      setSelectedOptions(options.map((option) => option.value));
    }
  };
  return (
    <div className="flex justify-between gap-4 ml-20">
      <PayrollSettingDetailsList />

      <div className="w-2/3 p-8 bg-white rounded-lg">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold mb-6">
            Leave Encashment & Recovery
          </h2>{" "}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>
        <label htmlFor="">
          How would you like to calculate Leave Encashment?
        </label>

        <div className="mb-4 w-64 relative">
          <button
            className="p-2 border rounded w-full text-left bg-gray-200 hover:bg-gray-300"
            onClick={toggleDropdown}
          >
            Click Here to Select Component
          </button>
          {isDropdownVisible && (
            <div className="absolute z-10 w-full border rounded shadow p-2 mt-2 bg-white">
              <div className="mb-2">
                <button
                  className={`p-2 w-full text-left ${
                    selectedOptions.length === options.length
                      ? "bg-blue-500 text-white"
                      : ""
                  }`}
                  onClick={handleSelectAll}
                >
                  Select all
                </button>
              </div>
              {options.map((option) => (
                <div key={option.value} className="mb-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5"
                      checked={selectedOptions.includes(option.value)}
                      onChange={() => handleSelect(option.value)}
                    />
                    <span className="ml-2">{option.label}</span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            What is the denominator for calculating the Encashment? *
          </label>
          <select
            className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
              !isEditing ? "bg-gray-200" : ""
            }`}
            readOnly={!isEditing}
          >
            <option value="">30</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            In which month do you wish to pay out rollover leave encashment for
            employees? *
          </label>
          <select
            //   value={payoutMonth}
            //   onChange={handlePayoutMonthChange}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
              !isEditing ? "bg-gray-200" : ""
            }`}
            readOnly={!isEditing}
          >
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </div>
        <div className="mb-4 flex flex-col">
          <label htmlFor="">
            {" "}
            How would you like to calculate Leave Recovery?
          </label>
          <button
            className="p-2 border rounded w-64 text-left bg-gray-200 hover:bg-gray-300"
            onClick={toggleDropdown1}
          >
            Click Here to Select Component
          </button>
        </div>
        <div className="mb-4 w-64 relative">
          {isDropdownVisible1 && (
            <div className="absolute z-10 w-full border rounded shadow p-2 mt-2 bg-white">
              <div className="mb-2">
                <button
                  className={`p-2 w-full text-left ${
                    selectedOptions.length === options.length
                      ? "bg-blue-500 text-white"
                      : ""
                  }`}
                  onClick={handleSelectAll}
                >
                  Select all
                </button>
              </div>
              {options.map((option) => (
                <div key={option.value} className="mb-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5"
                      checked={selectedOptions.includes(option.value)}
                      onChange={() => handleSelect(option.value)}
                    />
                    <span className="ml-2">{option.label}</span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            What is the denominator for calculating the Leave Recovery? *
          </label>
          <input
            type="number"
            //   value={recoveryDenominator}
            //   onChange={handleRecoveryDenominatorChange}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
              !isEditing ? "bg-gray-200" : ""
            }`}
            readOnly={!isEditing}
          />
        </div>
      </div>
      <div className="my-4 mx-2 w-fit">
        <div className="flex flex-col bg-gray-50 rounded-md text-wrap  gap-4 my-2 py-2 pl-5 pr-2 w-[18rem]">
          <div className="flex  gap-4 font-medium">
            <GrHelpBook size={20} />
            <h2>Help Center</h2>
          </div>
          <div className="">
            <ul style={listItemStyle} className="flex flex-col gap-2">
              <li>
                <ul style={listItemStyle}>
                  <li>
                    To enable gratuity first select Gratuity in Payroll General
                    Setting What additional components do you want to show in
                    the CTC structure?{" "}
                  </li>{" "}
                </ul>
              </li>
              <li>
                <ul style={listItemStyle}>
                  <li>
                    Then select the require configuration as per your Company
                    Policy{" "}
                  </li>
                </ul>
              </li>
              <li>
                <ul style={listItemStyle}>
                  <li>
                    Based on configuration Gratuity will be calculated
                    automatically for eligible employee at the time of F&F, you
                    can view and pay the calculated value in Settlement and
                    Recovery step while running payroll.
                  </li>
                </ul>
              </li>

              {/* <li>
                  <p>
                    <a href="#" className="text-blue-400">
                      Click Here{" "}
                    </a>
                    You can also set password for your salary register and the password will be suffix (@MMYYYY) with your entered password. E.g. If you enter password as abcd in Payroll Setting then password for salary register for month of April 2022 would be abcd@042022
                  </p>
                </li> */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRecovery;
