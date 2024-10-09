import React, { useEffect, useState } from "react";
import AdminHRMS from "./AdminHrms";
import { FaTrash } from "react-icons/fa";
import AddEmployeeDetailsList from "./AddEmployeeDetailsList";
import { GrHelpBook } from "react-icons/gr";
import { postSalaryGeneralInfo, postTaxStatutory } from "../../api";
import { useSelector } from "react-redux";

const OnboardingSalary = ({ empId }) => {
  const themeColor = useSelector((state) => state.theme.color);
  const [basic, setBasic] = useState(2000);
  const [hra, setHra] = useState(2000);
  const [childEducation, setChildEducation] = useState(1000);
  const [special, setSpecial] = useState(5000);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const total = basic + hra + childEducation + special;
  const [page, setPage] = useState("General Info");
  const [formData, setFormData] = useState({
    effectiveDate: "",
    effectiveDateDiffer: false,
    actualEffectiveDate: "",
    autoSalaryRevisionArrear: false,
    CTCFrequency: "monthly",
    howEnteringAmount: "As_CTC",
    monthlyCTCAmount: "",
    monthlyGrossAmount: "",
    annuallyCTCAmount: "",
    annuallyGrossAmount: "",
    ctcTemplate: "",
  });

  const [taxData, setTaxData] = useState({
    pfDeduction: false,
    providentPension: false,
    employeeProvidentContributionCapped: false,
    employerProvidentCOntributionCapped: false,
    fixedAmtForProvidentFundWage: "",
    pfTemplate: "",
    esicDeduction: false,
    ptDeduction: false,
    lwfDeduction: false,
    gratuityApplicable: false,
    incomeTaxDeduction: false,
    npsDeduction: false,
  });

  const handleChangeTax = async (e) => {
    setTaxData({ ...taxData, [e.target.name]: e.target.value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      ...(name === "effectiveDateDiffer" &&
        !value && { actualEffectiveDate: "" }),
    }));
  };

  useEffect(() => {
    if (!formData.effectiveDateDiffer) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        actualEffectiveDate: "",
      }));
    }
  }, [formData.effectiveDateDiffer]);

  const handleAddGeneralInfo = async () => {
    const postData = new FormData();
    postData.append("effective_date", formData.effectiveDate);
    postData.append(
      "actual_effective_date_differs",
      formData.effectiveDateDiffer
    );
    postData.append("actual_effective_date", formData.actualEffectiveDate);
    postData.append(
      "auto_salary_revision_arrears_required",
      formData.autoSalaryRevisionArrear
    );
    postData.append("monthly_ctc_amount", formData.monthlyCTCAmount);
    postData.append("ctc_frequency", formData.CTCFrequency);
    postData.append("employee_id", empId);
    // postData.append("employee_id", 2);
    postData.append("ctc_amount", formData.monthlyCTCAmount);
    postData.append("annually_ctc_amount", formData.annuallyCTCAmount);
    postData.append("monthly_gross_amount", formData.monthlyGrossAmount);
    postData.append("annually_gross_amount", formData.annuallyGrossAmount);
    postData.append("how_entering_amount", formData.howEnteringAmount);
    try {
      await postSalaryGeneralInfo(postData);
      setPage("Tax and Statutory Setting");
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddTaxStatutory = async () => {
    const postData = new FormData();
    postData.append("pf_deduction", taxData.pfDeduction);
    postData.append("provident_pension_deduction", taxData.providentPension);
    postData.append(
      "epf_contribution_capped",
      taxData.employeeProvidentContributionCapped
    );
    postData.append(
      "employer_epf_contribution_capped",
      taxData.employerProvidentCOntributionCapped
    );
    postData.append(
      "pf_wage_fixed_amount",
      taxData.fixedAmtForProvidentFundWage
    );
    postData.append("pf_template", taxData.pfTemplate);
    postData.append("esic_deduction", taxData.esicDeduction);
    postData.append("pt_deduction", taxData.ptDeduction);
    postData.append("lwf_deduction", taxData.lwfDeduction);
    postData.append("gratuity_applicable", taxData.gratuityApplicable);
    postData.append("income_tax_deduction", taxData.incomeTaxDeduction);
    postData.append("nps_deduction", taxData.npsDeduction);
    postData.append("employee", empId);

    try {
      await postTaxStatutory(postData);

      setPage("CTC Components");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (
      formData.howEnteringAmount !== "As_CTC" ||
      (formData.CTCFrequency !== "monthly" &&
        formData.CTCFrequency !== "Annually")
    ) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        monthlyCTCAmount: "",
        annuallyCTCAmount: "",
      }));
    }

    if (
      formData.howEnteringAmount !== "As Gross Salary" ||
      (formData.CTCFrequency !== "monthly" &&
        formData.CTCFrequency !== "Annually")
    ) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        monthlyGrossAmount: "",
        annuallyGrossAmount: "",
      }));
    }
  }, [formData.howEnteringAmount, formData.CTCFrequency]);

  return (
    <div className="flex w-full">
      {/* <AddEmployeeDetailsList /> */}
      <div className="w-full p-6 bg-white rounded-lg">
        <h2 className="border-b text-center text-xl border-black mb-6 font-bold mt-2">
          Salary
        </h2>
        <div className="w-full mt-10 p-5 border border-gray-300 rounded-md">
          <h2 className="text-2xl font-semibold mb-4">Add New CTC</h2>
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
                  value={formData.effectiveDate}
                  onChange={handleChange}
                  name="effectiveDate"
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
                    name="effectiveDateDiffer"
                    checked={formData.effectiveDateDiffer === true}
                    onChange={() =>
                      setFormData({ ...formData, effectiveDateDiffer: true })
                    }
                    className="mr-2"
                  />
                  <label htmlFor="yes" className="mr-4">
                    Yes
                  </label>
                  <input
                    type="radio"
                    id="no"
                    name="effectiveDateDiffer"
                    checked={formData.effectiveDateDiffer === false}
                    onChange={() =>
                      setFormData({ ...formData, effectiveDateDiffer: false })
                    }
                    className="mr-2"
                  />
                  <label htmlFor="no">No</label>
                </div>
              </div>
              {formData.effectiveDateDiffer && (
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="effectiveDate"
                  >
                    Please select the actual effective date
                  </label>
                  <input
                    type="date"
                    id="actualEffectiveDate"
                    value={formData.actualEffectiveDate}
                    name="actualEffectiveDate"
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              )}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="ctcAmount"
                >
                  Enter CTC Amount frequency
                </label>
                <select
                  id="ctcTemplate"
                  value={formData.CTCFrequency}
                  onChange={handleChange}
                  name="CTCFrequency"
                  className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select CTC Amount frequency</option>
                  <option value="monthly">Monthly</option>
                  <option value="Annually">Annually</option>
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
                  value={formData.ctcTemplate}
                  onChange={handleChange}
                  name="ctcTemplate"
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Select Template
                  </option>
                  <option value="template1">Template 1</option>
                  <option value="template2">Template 2</option>
                  <option value="template3">Template 3</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="ctcTemplate"
                >
                  How are you entering the amount?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="ctcTemplate"
                  value={formData.howEnteringAmount}
                  onChange={handleChange}
                  name="howEnteringAmount"
                  className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="As_CTC">As CTC</option>
                  <option value="As Gross Salary">As Gross Salary</option>
                </select>
              </div>
              {formData.howEnteringAmount === "As_CTC" &&
                formData.CTCFrequency === "monthly" && (
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="ctcTemplate"
                    >
                      Enter Monthly CTC Amount
                    </label>
                    <input
                      type="text"
                      name="monthlyCTCAmount"
                      id=""
                      value={formData.monthlyCTCAmount}
                      onChange={handleChange}
                      placeholder="Enter Monthly CTC Amount"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      pattern="[0-9]*"
                      onKeyDown={(e) => {
                        if (
                          !/[0-9]/.test(e.key) &&
                          e.key !== "Backspace" &&
                          e.key !== "ArrowLeft" &&
                          e.key !== "ArrowRight"
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                )}
              {formData.howEnteringAmount === "As Gross Salary" &&
                formData.CTCFrequency === "monthly" && (
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="ctcTemplate"
                    >
                      Enter Monthly Gross Amount
                    </label>
                    <input
                      type="text"
                      name="monthlyGrossAmount"
                      id=""
                      value={formData.monthlyGrossAmount}
                      onChange={handleChange}
                      placeholder="Enter Monthly Gross Amount"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      pattern="[0-9]*"
                      onKeyDown={(e) => {
                        if (
                          !/[0-9]/.test(e.key) &&
                          e.key !== "Backspace" &&
                          e.key !== "ArrowLeft" &&
                          e.key !== "ArrowRight"
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                )}
              {formData.howEnteringAmount === "As_CTC" &&
                formData.CTCFrequency === "Annually" && (
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="ctcTemplate"
                    >
                      Enter Annually CTC Amount
                    </label>
                    <input
                      type="text"
                      name="annuallyCTCAmount"
                      id=""
                      value={formData.annuallyCTCAmount}
                      onChange={handleChange}
                      placeholder="Enter Annually CTC Amount"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      pattern="[0-9]*"
                      onKeyDown={(e) => {
                        if (
                          !/[0-9]/.test(e.key) &&
                          e.key !== "Backspace" &&
                          e.key !== "ArrowLeft" &&
                          e.key !== "ArrowRight"
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                )}
              {formData.howEnteringAmount === "As Gross Salary" &&
                formData.CTCFrequency === "Annually" && (
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="ctcTemplate"
                    >
                      Enter Annually Gross Amount
                    </label>
                    <input
                      type="text"
                      name="annuallyGrossAmount"
                      id=""
                      value={formData.annuallyGrossAmount}
                      onChange={handleChange}
                      placeholder="Enter Annually Gross Amount"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      pattern="[0-9]*"
                      onKeyDown={(e) => {
                        if (
                          !/[0-9]/.test(e.key) &&
                          e.key !== "Backspace" &&
                          e.key !== "ArrowLeft" &&
                          e.key !== "ArrowRight"
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                )}
              <div className="flex justify-center gap-2">
                <button
                  style={{ background: themeColor }}
                  className="bg-black text-white mb-2 hover:bg-gray-700 font-semibold py-2 px-4 rounded"
                  onClick={handleAddGeneralInfo}
                >
                  Save & Proceed
                </button>
              </div>
            </div>
          )}
          {page === "Tax and Statutory Setting" && (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  PF Deduction <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="pfDeduction"
                      checked={taxData.pfDeduction === true}
                      onChange={() =>
                        setTaxData({ ...taxData, pfDeduction: true })
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="pfDeduction"
                      checked={taxData.pfDeduction === false}
                      onChange={() =>
                        setTaxData({ ...taxData, pfDeduction: false })
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Provident Pension Deduction{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="providentPensionDeduction"
                      checked={taxData.providentPension === true}
                      onChange={() =>
                        setTaxData({ ...taxData, providentPension: true })
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="providentPensionDeduction"
                      checked={taxData.providentPension === false}
                      onChange={() =>
                        setTaxData({ ...taxData, providentPension: false })
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Employee’s PF contribution capped at the PF Ceiling?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="employeePfCapped"
                      checked={
                        taxData.employeeProvidentContributionCapped === true
                      }
                      onChange={() =>
                        setTaxData({
                          ...taxData,
                          employeeProvidentContributionCapped: true,
                        })
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="employeePfCapped"
                      checked={
                        taxData.employeeProvidentContributionCapped === false
                      }
                      onChange={() =>
                        setTaxData({
                          ...taxData,
                          employeeProvidentContributionCapped: false,
                        })
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Employer’s PF contribution capped at the PF Ceiling?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="employerPfCapped"
                      checked={
                        taxData.employerProvidentCOntributionCapped === true
                      }
                      onChange={() =>
                        setTaxData({
                          ...taxData,
                          employerProvidentCOntributionCapped: true,
                        })
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="employerPfCapped"
                      checked={
                        taxData.employerProvidentCOntributionCapped === false
                      }
                      onChange={() =>
                        setTaxData({
                          ...taxData,
                          employerProvidentCOntributionCapped: false,
                        })
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Provident Fund Wage <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="fixedAmtForProvidentFundWage"
                  className="w-full mt-2 p-2 border border-gray-300 rounded"
                  placeholder="Leave blank for no amount"
                  value={taxData.fixedAmtForProvidentFundWage}
                  onChange={handleChangeTax}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  PF Template <span className="text-red-500">*</span>
                </label>
                <select
                  name=""
                  id=""
                  onChange={handleChangeTax}
                  value={taxData.pfTemplate}
                  className="border border-gray-300 mt-1 rounded-md p-2 w-full"
                >
                  <option value="">Select PF Template</option>
                  <option value="temp1">Temp 1</option>
                  <option value="temp2">Temp 2</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  ESIC Deduction <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="esicDeduction"
                      checked={taxData.esicDeduction === true}
                      onChange={() =>
                        setTaxData({ ...taxData, esicDeduction: true })
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="esicDeduction"
                      checked={taxData.esicDeduction === false}
                      onChange={() =>
                        setTaxData({ ...taxData, esicDeduction: false })
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  PT Deduction <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="ptDeduction"
                      checked={taxData.ptDeduction === true}
                      onChange={() =>
                        setTaxData({ ...taxData, ptDeduction: true })
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="ptDeduction"
                      checked={taxData.ptDeduction === false}
                      onChange={() =>
                        setTaxData({ ...taxData, ptDeduction: false })
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  LWF Deduction <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="lwfDeduction"
                      checked={taxData.lwfDeduction === true}
                      onChange={() =>
                        setTaxData({ ...taxData, lwfDeduction: true })
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="lwfDeduction"
                      checked={taxData.lwfDeduction === false}
                      onChange={() =>
                        setTaxData({ ...taxData, lwfDeduction: false })
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Income Tax Deduction <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="incomeTaxDeduction"
                      checked={taxData.incomeTaxDeduction === true}
                      onChange={() =>
                        setTaxData({ ...taxData, incomeTaxDeduction: true })
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="incomeTaxDeduction"
                      checked={taxData.incomeTaxDeduction === false}
                      onChange={() =>
                        setTaxData({ ...taxData, incomeTaxDeduction: false })
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Gratuity Applicable <span className="text-red-400">*</span>
                </label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gratuityApplicable"
                      checked={taxData.gratuityApplicable === true}
                      onChange={() =>
                        setTaxData({ ...taxData, gratuityApplicable: true })
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="gratuityApplicable"
                      checked={taxData.gratuityApplicable === false}
                      onChange={() =>
                        setTaxData({ ...taxData, gratuityApplicable: false })
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  NPS Deduction <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="npsDeduction"
                      checked={taxData.npsDeduction === true}
                      onChange={() =>
                        setTaxData({ ...taxData, npsDeduction: true })
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="npsDeduction"
                      checked={taxData.npsDeduction === false}
                      onChange={() =>
                        setTaxData({ ...taxData, npsDeduction: false })
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>
              <div className=" flex justify-center gap-2">
                <button
                  className=" text-gray-500 mb-2  font-medium py-2 px-4 rounded-md border-2 border-gray-500"
                  onClick={() => setPage("General Info")}
                >
                  Back
                </button>
                <button
                  className="bg-black text-white mb-2 hover:bg-gray-700 font-medium py-2 px-4 rounded-md"
                  onClick={handleAddTaxStatutory}
                >
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
