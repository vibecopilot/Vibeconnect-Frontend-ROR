import React, { useState } from "react";
import AdminHRMS from "./AdminHrms";
import { FaTrash } from "react-icons/fa";
import AddEmployeeDetailsList from "./AddEmployeeDetailsList";
import { GrHelpBook } from "react-icons/gr";

const OnboardingSalary = () => {
  const [basic, setBasic] = useState(2000);
  const [hra, setHra] = useState(2000);
  const [childEducation, setChildEducation] = useState(1000);
  const [special, setSpecial] = useState(5000);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const total = basic + hra + childEducation + special;
  const [page, setPage] = useState("General Info");


  return (
    <div className="flex w-full">
      {/* <AddEmployeeDetailsList /> */}
      <div className="w-full p-6 bg-white rounded-lg">
        <h2 className="border-b text-center text-xl border-black mb-6 font-bold mt-2">
          Salary
        </h2>
        <div className=" w-full mt-10 p-5 border border-gray-300 rounded-md">
          {/* <h2 className="text-2xl font-bold mb-6">Salary</h2> */}
          <h2 className="text-2xl font-bold mb-6">Add New CTC</h2>

          <div className=" w-full my-2 flex  overflow-hidden flex-col">
            <div className="flex w-full">
              <div className=" flex gap-2 p-2 pb-0 border-b-2 border-gray-200 w-full">
                <h2
                  className={`p-1 ${
                    page === "General Info" &&
                    `bg-white font-medium text-blue-500 shadow-custom-all-sides`
                  } rounded-t-md px-4 cursor-pointer text-center transition-all duration-300 ease-linear`}
                  onClick={() => setPage("General Info")}
                >
                  General Info
                </h2>
                <h2
                  className={`p-1 ${
                    page === "Tax and Statutory Setting" &&
                    "bg-white font-medium text-blue-500 shadow-custom-all-sides"
                  } rounded-t-md px-4 cursor-pointer transition-all duration-300 ease-linear`}
                  onClick={() => setPage("Tax and Statutory Setting")}
                >
                  Tax and Statutory Setting
                </h2>
                <h2
                  className={`p-1 ${
                    page === "CTC Components" &&
                    "bg-white font-medium text-blue-500 shadow-custom-all-sides"
                  } rounded-t-md px-4 cursor-pointer transition-all duration-300 ease-linear`}
                  onClick={() => setPage("CTC Components")}
                >
                  CTC Components
                </h2>
              </div>
            </div>
          </div>
          {page === "General Info" && (
            <div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="effectiveDate"
                >
                  Select Effective Date for Payroll Processing
                </label>
                <input
                  type="date"
                  id="effectiveDate"
                  //   value={effectiveDate}
                  //   onChange={handleEffectiveDateChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Does the actual effective date of salary differ?
                </label>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="yes"
                    name="effectiveDateDiffers"
                    value="yes"
                    // onChange={handleEffectiveDateDiffersChange}
                    className="mr-2"
                  />
                  <label htmlFor="yes" className="mr-4">
                    Yes
                  </label>
                  <input
                    type="radio"
                    id="no"
                    name="effectiveDateDiffers"
                    value="no"
                    // onChange={handleEffectiveDateDiffersChange}
                    className="mr-2"
                  />
                  <label htmlFor="no">No</label>
                </div>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="ctcAmount"
                >
                  Enter CTC Amount frequency
                </label>
                <select
                  id="ctcTemplate"
                  //   value={ctcTemplate}
                  //   onChange={handleCtcTemplateChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Select CTC Amount frequency
                  </option>
                  <option value="template1">Monthly</option>
                  <option value="template2">Annualy</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="ctcTemplate"
                >
                  Select CTC Template
                </label>
                <select
                  id="ctcTemplate"
                  //   value={ctcTemplate}
                  //   onChange={handleCtcTemplateChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Select Template
                  </option>
                  <option value="template1">Template 1</option>
                  <option value="template2">Template 2</option>
                  <option value="template3">Template 3</option>
                </select>
              </div>

              <div className="flex justify-center gap-2">
                <button className="bg-black text-white mb-2 hover:bg-gray-700 font-semibold py-2 px-4 rounded">
                  Back
                </button>
                <button className="bg-black text-white mb-2 hover:bg-gray-700 font-semibold py-2 px-4 rounded">
                  Save
                </button>
              </div>
            </div>
          )}
          {page === "Tax and Statutory Setting" && (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700">PF Deduction</label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="pfDeduction"
                      value="Yes"
                      className="form-radio"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="pfDeduction"
                      value="No"
                      className="form-radio"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Provident Pension Deduction
                </label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="providentPensionDeduction"
                      value="Yes"
                      className="form-radio"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="providentPensionDeduction"
                      value="No"
                      className="form-radio"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Employee’s PF contribution capped at the PF Ceiling?
                </label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="employeePfCapped"
                      value="Yes"
                      className="form-radio"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="employeePfCapped"
                      value="No"
                      className="form-radio"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Employer’s PF contribution capped at the PF Ceiling?
                </label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="employerPfCapped"
                      value="Yes"
                      className="form-radio"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="employerPfCapped"
                      value="No"
                      className="form-radio"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Provident Fund Wage Amount
                </label>
                <input
                  type="number"
                  name="pfWageAmount"
                  className="w-full mt-2 p-2 border border-gray-300 rounded"
                  placeholder="Leave blank for no amount"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">PF Template</label>
                <input
                  type="text"
                  name="pfTemplate"
                  className="w-full mt-2 p-2 border border-gray-300 rounded"
                  placeholder="Leave blank for default settings"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">ESIC Deduction</label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="esicDeduction"
                      value="Yes"
                      className="form-radio"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="esicDeduction"
                      value="No"
                      className="form-radio"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">PT Deduction</label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="ptDeduction"
                      value="Yes"
                      className="form-radio"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="ptDeduction"
                      value="No"
                      className="form-radio"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">LWF Deduction</label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="lwfDeduction"
                      value="Yes"
                      className="form-radio"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="lwfDeduction"
                      value="No"
                      className="form-radio"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Income Tax Deduction
                </label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="incomeTaxDeduction"
                      value="Yes"
                      className="form-radio"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="incomeTaxDeduction"
                      value="No"
                      className="form-radio"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">NPS Deduction</label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="npsDeduction"
                      value="Yes"
                      className="form-radio"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="npsDeduction"
                      value="No"
                      className="form-radio"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>
              <div className=" flex justify-center gap-2">
                <button className="bg-black text-white mb-2 hover:bg-gray-700 font-semibold py-2 px-4 rounded">
                  Cancel
                </button>
                <button className="bg-black text-white mb-2 hover:bg-gray-700 font-semibold py-2 px-4 rounded">
                  Save & Proceed
                </button>
              </div>
            </div>
          )}
          {page === "CTC Components" && (
            <div>
              <div className="flex justify-between items-center ml-10">
                <h2 className="text-lg font-semibold">Components</h2>
                <p className="text-lg font-semibold ">
                  &nbsp;&nbsp;&nbsp;&nbsp;Monthly
                </p>
                <p className="text-lg font-semibold mr-20">Yearly</p>
              </div>
              <div className="p-6 bg-white shadow-md rounded-md">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Fixed Allowance</h2>
                  <p className="text-lg font-semibold ml-28 pl-24">₹{total}</p>
                  <p className="text-lg font-semibold ml-28">₹{total * 12}</p>
                  <button
                    className="ml-4 text-blue-500 focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    {isOpen ? "∧" : "∨"}
                  </button>
                </div>
                {isOpen && (
                  <div className="mt-4 space-y-4 w-4/5">
                    <hr />
                    <div className="flex justify-between">
                      <label className="text-gray-600">
                        Enter the Amount for Basic
                      </label>
                      <input
                        type="number"
                        className="border w-20 border-gray-400 ml-4 p-2 rounded-md"
                        value={basic}
                        onChange={(e) => setBasic(parseInt(e.target.value))}
                      />
                      <p>{basic * 12}</p>
                    </div>
                    <div className="flex justify-between">
                      <label className="text-gray-600">
                        Enter the Amount for HRA
                      </label>
                      <input
                        type="number"
                        className="border w-20 border-gray-400 ml-4 p-2 rounded-md"
                        value={hra}
                        onChange={(e) => setHra(parseInt(e.target.value))}
                      />
                      <p>{hra * 12}</p>
                    </div>
                    <div className="flex justify-between">
                      <label className="text-gray-600">
                        Enter the Amount for Child Education
                      </label>
                      <input
                        type="number"
                        className="border w-20 border-gray-400 p-2 mr-14 rounded-md"
                        value={childEducation}
                        onChange={(e) =>
                          setChildEducation(parseInt(e.target.value))
                        }
                      />
                      <p>{childEducation * 12}</p>
                    </div>
                    <div className="flex justify-between">
                      <label className="text-gray-600">
                        Enter the Amount for Special
                      </label>
                      <input
                        type="number"
                        className="border w-20 border-gray-400 p-2 rounded-md"
                        value={special}
                        onChange={(e) => setSpecial(parseInt(e.target.value))}
                      />
                      <p>{special * 12}</p>
                    </div>
                  </div>
                )}
                {/* <div className="mt-4">
               <p className="text-gray-600">Total Take Home (excluding Variable): ₹{total}</p>
               <p className="text-gray-600">Total CTC (excluding Variable & Other Benefits): ₹{total}</p>
               <p className="text-gray-600">Total CTC (including Variable): ₹{total}</p>
             </div> */}
              </div>

              <div className="p-6 bg-white shadow-md rounded-md">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">
                    Total Employer Statutory Contributions
                  </h2>
                  <p className="text-lg font-semibold ">₹0</p>
                  <p className="text-lg font-semibold ml-28">₹0</p>
                  <button
                    className="ml-4 text-blue-500 focus:outline-none"
                    onClick={() => setIsOpen1(!isOpen1)}
                  >
                    {isOpen1 ? "∧" : "∨"}
                  </button>
                </div>
                {isOpen1 && (
                  <div className="mt-4 space-y-4 w-4/5">
                    <hr />
                    <div className="flex justify-between">
                      <label className="text-gray-600 ">
                        Employer PF Contribution
                      </label>
                      <p className="ml-4">0</p>
                      <p>0</p>
                    </div>
                    <div className="flex justify-between">
                      <label className="text-gray-600">
                        Employer ESIC Contribution
                      </label>
                      <p className="ml-1">0</p>
                      <p>0</p>
                    </div>
                    <div className="flex justify-between">
                      <label className="text-gray-600">
                        Employer LWF Contribution
                      </label>
                      <p className="">0</p>
                      <p>0</p>
                    </div>
                    <div className="flex justify-between">
                      <label className="text-gray-600">
                        Employer NPS Contribution
                      </label>
                      <p>0</p>
                      <p>0</p>
                    </div>
                  </div>
                )}
               
              </div>

              <div className="p-6 bg-white shadow-md rounded-md">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">
                    Total Employer Statutory Deductions
                  </h2>
                  <p className="text-lg font-semibold ml-4">₹0</p>
                  <p className="text-lg font-semibold ml-28">₹0</p>
                  <button
                    className="ml-4 text-blue-500 focus:outline-none"
                    onClick={() => setIsOpen2(!isOpen2)}
                  >
                    {isOpen2 ? "∧" : "∨"}
                  </button>
                </div>
                {isOpen2 && (
                  <div className="mt-4 space-y-4 w-4/5">
                    <hr />
                    <div className="flex justify-between">
                      <label className="text-gray-600 ">
                        Employer PF Contribution
                      </label>
                      <p className="ml-5">0</p>
                      <p>0</p>
                    </div>
                    <div className="flex justify-between">
                      <label className="text-gray-600">
                        Employer ESIC Contribution
                      </label>
                      <p className="ml-1">0</p>
                      <p>0</p>
                    </div>
                    <div className="flex justify-between">
                      <label className="text-gray-600">
                        Employer LWF Contribution
                      </label>
                      <p className="ml-1">0</p>
                      <p>0</p>
                    </div>
                    <div className="flex justify-between">
                      <label className="text-gray-600">
                        Employer PT Contribution
                      </label>
                      <p className="ml-4">0</p>
                      <p>0</p>
                    </div>
                    <div className="flex justify-between">
                      <label className="text-gray-600">
                        Employer NPS Contribution
                      </label>
                      <p className="ml-2">0</p>
                      <p>0</p>
                    </div>
                  </div>
                )}
                {/* <div className="mt-4">
                 <p className="text-gray-600">Total Take Home (excluding Variable): ₹{total}</p>
                 <p className="text-gray-600">Total CTC (excluding Variable & Other Benefits): ₹{total}</p>
                 <p className="text-gray-600">Total CTC (including Variable): ₹{total}</p>
               </div> */}
              </div>
              <div className="mt-5 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Consolidated output</h2>
                <p className="text-lg font-semibold ml-20">
                  &nbsp;&nbsp;&nbsp;&nbsp;Monthly
                </p>
                <p className="text-lg font-semibold  pr-48">Yearly</p>
              </div>
              <div className="w-3/4">
                <div className="mt-5  flex justify-between">
                  <p className="text-gray-600">
                    Total Take Home (excluding Variable)
                  </p>
                  <p className="ml-10">₹5000</p>
                  <p>₹{5000 * 12}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">
                    Total CTC (excluding Variable & Other Benefits)
                  </p>
                  <p className="mr-6">₹5000</p>
                  <p>₹60000</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">
                    Total CTC (including Variable)
                  </p>
                  <p className="ml-24">₹4562</p>
                  <p>₹{4562 * 12}</p>
                </div>
              </div>
              <div className="mt-10 flex justify-center gap-2">
                <button className="bg-black text-white mb-2 hover:bg-gray-700 font-semibold py-2 px-4 rounded">
                  Cancel
                </button>
                <button className="bg-black text-white mb-2 hover:bg-gray-700 font-semibold py-2 px-4 rounded">
                  Save & Proceed
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      
    </div>
  );
};

export default OnboardingSalary;
