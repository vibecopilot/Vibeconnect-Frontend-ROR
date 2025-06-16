import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { postSalaryGeneralInfo, postTaxStatutory } from "../../api";
import SalaryAccordion from "./Components/SalaryAccordion";

const AddNewCTC = ({
  setPageChange,
  empId,
  fetchEmployeeSalary,
  selectedTemplate,
}) => {
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
    monthlySalary: 0, 
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
  // handling data from the selectedTemplate
  useEffect(() => {
    console.log("selected Template data", selectedTemplate);
  }, [selectedTemplate]);
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
      fetchEmployeeSalary();
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

  // const [fixedAllowanceItems, setFixedAllowanceItems] = useState([
  //   { label: "Enter the Amount for Basic", monthly: 2500, yearly: 30000 },
  //   {
  //     label: "Enter the Amount for Conveyance Allowance",
  //     monthly: 1600,
  //     yearly: 19200,
  //   },
  //   { label: "Enter the Amount for HRA", monthly: 900, yearly: 10800 },
  //   { label: "Enter the Amount for Medical", monthly: 0, yearly: 0 },
  //   { label: "Enter the Amount for Special Allowance", monthly: 0, yearly: 0 },
  //   { label: "Enter the Amount for Allowance", monthly: 0, yearly: 0 },
  // ]);

  // const totalMonthly = fixedAllowanceItems.reduce(
  //   (sum, item) => sum + item.monthly,
  //   0
  // );
  // const totalYearly = fixedAllowanceItems.reduce(
  //   (sum, item) => sum + item.yearly,
  //   0
  // );

  // const handleMonthlyChange = (index, value) => {
  //   const updatedItems = [...fixedAllowanceItems];
  //   updatedItems[index].monthly = Number(value); // Update the monthly value
  //   // Update yearly value based on new monthly input, assuming 12 months in a year
  //   updatedItems[index].yearly = Number(value) * 12;
  //   setFixedAllowanceItems(updatedItems);
  // };

  // const outputData = [
  //   {
  //     description: "Total Take Home (excluding Variable)",
  //     monthly: "₹ 5,000",
  //     yearly: "₹ 60,000",
  //   },
  //   {
  //     description: "Total CTC (excluding Variable & Other Benefits)",
  //     monthly: "₹ 5,000",
  //     yearly: "₹ 60,000",
  //   },
  //   {
  //     description: "Total CTC (including Variable)",
  //     yearly: "₹ 60,000",
  //   },
  // ];

  //  Calculation of the ctc as per allowance and deduction
  // state for allowance
  const [fixedAllowanceItems, setFixedAllowanceItems] = useState([]);
  const [variableAllowanceItems, setVariableAllowanceItems] = useState([]);
  // state for deduction
  const [fixedDeductionItems, setFixedDeductionItems] = useState([]);
  const [variableDeductionItems, setVariableDeductionItems] = useState([]);

  const [totalFixedMonthly, setTotalFixedMonthly] = useState(0);
  const [totalVariableMonthly, setTotalVariableMonthly] = useState(0);
  const [totalFixedDeductionMonthly, setTotalFixedDeductionMonthly] =
    useState(0);
  const [totalVariableDeductionMonthly, setTotalVariableDeductionMonthly] =
    useState(0);
  const [totalMonthly, setTotalMonthly] = useState(0);
  const [totalYearly, setTotalYearly] = useState(0);
  const [totalDeductionMonthly, setTotalDeductionMonthly] = useState(0);
  const [totalDeductionYearly, setTotalDeductionYearly] = useState(0);
  const [netTakeHomeMonthly, setNetTakeHomeMonthly] = useState(0);
  const [netTakeHomeYearly, setNetTakeHomeYearly] = useState(0);
  useEffect(() => {
    if (
      selectedTemplate?.components_details &&
      selectedTemplate?.deductions_details
    ) {
       const monthlySalary = formData.monthlySalary || 0;
      const fixedAllowances = selectedTemplate.components_details.filter(
        (comp) => comp.component_type === "fixed"
      );
      const variableAllowances = selectedTemplate.components_details.filter(
        (comp) => comp.component_type === "variable"
      );

      const fixedDeductions = selectedTemplate.deductions_details.filter(
        (ded) => ded.deduction_type === "fixed"
      );
      const variableDeductions = selectedTemplate.deductions_details.filter(
        (ded) => ded.deduction_type === "variable"
      );
      // const formattedFixed = fixed.map(item =>({
      //   label: item.name,
      //   monthly: item.value || 0,
      //   yearly: (item.value || 0) * 12,
      //   percentage: item.percentage_of_ctc || 0
      // }))
      const formattedFixedAllowances = selectedTemplate.components_details
      .filter(comp => comp.component_type === "fixed")
      .map(item => ({
        id: item.id,
        label: item.name,
        monthly: item.value || 0,
        yearly: (item.value || 0) * 12,
        percentage: item.percentage_of_ctc || 0,
      }));
      const totalFixedValue = fixedAllowances.reduce(
        (sum, item) => sum + (item.value || 0),
        0
      );
     const formattedVariableAllowances = selectedTemplate.components_details
      .filter(comp => comp.component_type === "variable")
      .map(item => {
        const monthlyValue = monthlySalary * (item.percentage_of_ctc / 100);
        return {
          id: item.id,
          label: item.name,
          monthly: monthlyValue,
          yearly: monthlyValue * 12,
          percentage: item.percentage_of_ctc || 0,
        };
      });

      const formattedFixedDeductions = selectedTemplate.deductions_details
      .filter(ded => ded.deduction_type === "fixed")
      .map(item => ({
        id: item.id,
        label: item.name,
        monthly: item.value || 0,
        yearly: (item.value || 0) * 12,
        percentage: item.percentage_of_salary || 0,
      }));
      const totalFixedDeductionValue = formattedFixedDeductions.reduce(
        (sum, item) => sum + item.monthly,
        0
      );
      const formattedVariableDeductions = selectedTemplate.deductions_details
      .filter(ded => ded.deduction_type === "variable")
      .map(item => {
        const monthlyValue = monthlySalary * (item.percentage_of_salary / 100);
        return {
          id: item.id,
          label: item.name,
          monthly: monthlyValue,
          yearly: monthlyValue * 12,
          percentage: item.percentage_of_salary || 0,
        };
      });

     setFixedAllowanceItems(formattedFixedAllowances);
    setVariableAllowanceItems(formattedVariableAllowances);
    setFixedDeductionItems(formattedFixedDeductions);
    setVariableDeductionItems(formattedVariableDeductions);

          const fixedAllowanceTotal = formattedFixedAllowances.reduce(
      (sum, item) => sum + item.monthly, 0);
    const variableAllowanceTotal = formattedVariableAllowances.reduce(
      (sum, item) => sum + item.monthly, 0);
    const fixedDeductionTotal = formattedFixedDeductions.reduce(
      (sum, item) => sum + item.monthly, 0);
    const variableDeductionTotal = formattedVariableDeductions.reduce(
      (sum, item) => sum + item.monthly, 0);

      // setTotalFixedMonthly(fixedAllowanceTotal);
      // setTotalVariableMonthly(variableAllowanceTotal);
      // setTotalFixedDeductionMonthly(fixedDeductionTotal);
      // setTotalVariableDeductionMonthly(variableDeductionTotal);

      const grossMonthly = monthlySalary + fixedAllowanceTotal + variableAllowanceTotal;
    const totalDeduction = fixedDeductionTotal + variableDeductionTotal;
    const netTakeHome = grossMonthly - totalDeduction;

      setTotalFixedMonthly(fixedAllowanceTotal);
    setTotalVariableMonthly(variableAllowanceTotal);
    setTotalFixedDeductionMonthly(fixedDeductionTotal);
    setTotalVariableDeductionMonthly(variableDeductionTotal);
    setTotalMonthly(grossMonthly);
    setTotalYearly(grossMonthly * 12);
    setTotalDeductionMonthly(totalDeduction);
    setTotalDeductionYearly(totalDeduction * 12);
    setNetTakeHomeMonthly(netTakeHome);
    setNetTakeHomeYearly(netTakeHome * 12);
    }
  }, [selectedTemplate , formData.monthlySalary]);

  const handleMonthlyChange = (index, value, type, isFixed = true) => {
    if (type === "fixed-allowance") {
      const updatedItems = [...fixedAllowanceItems];
      updatedItems[index].monthly = Number(value);
      updatedItems[index].yearly = Number(value) * 12;
      setFixedAllowanceItems(updatedItems);

      // Recalculate totals
      const newFixedTotal = updatedItems.reduce(
        (sum, item) => sum + item.monthly,
        0
      );
      setTotalFixedMonthly(newFixedTotal);

      // Recalculate variable amounts based on new fixed total
      const updatedVariableAllowances = variableAllowanceItems.map((item) => {
        const monthlyValue = newFixedTotal * (item.percentage / 100);
        return {
          ...item,
          monthly: monthlyValue,
          yearly: monthlyValue * 12,
        };
      });

      setVariableAllowanceItems(updatedVariableAllowances);
      const newVariableTotal = updatedVariableAllowances.reduce(
        (sum, item) => sum + item.monthly,
        0
      );
      setTotalVariableMonthly(newVariableTotal);

      const updatedVariableDeductions = variableDeductionItems.map((item) => {
        const monthlyValue = newFixedTotal * (item.percentage / 100);
        return {
          ...item,
          monthly: monthlyValue,
          yearly: monthlyValue * 12,
        };
      });

      setVariableDeductionItems(updatedVariableDeductions);
      const newVariableDeductionTotal = updatedVariableDeductions.reduce(
        (sum, item) => sum + item.monthly,
        0
      );
      setTotalVariableDeductionMonthly(newVariableDeductionTotal);

      const grossMonthly = newFixedTotal + newVariableTotal;
      const totalDeduction =
        totalFixedDeductionMonthly + newVariableDeductionTotal;

      setTotalMonthly(grossMonthly);
      setTotalYearly(grossMonthly * 12);
      setTotalDeductionMonthly(totalDeduction);
      setTotalDeductionYearly(totalDeduction * 12);
      setNetTakeHomeMonthly(grossMonthly - totalDeduction);
      setNetTakeHomeYearly((grossMonthly - totalDeduction) * 12);
    } else if (type === "fixed-deduction") {
      const updatedItems = [...fixedDeductionItems];
      updatedItems[index].monthly = Number(value);
      updatedItems[index].yearly = Number(value) * 12;
      setFixedDeductionItems(updatedItems);

      // Recalculate totals
      const newFixedDeductionTotal = updatedItems.reduce(
        (sum, item) => sum + item.monthly,
        0
      );
      setTotalFixedDeductionMonthly(newFixedDeductionTotal);

      const totalDeduction =
        newFixedDeductionTotal + totalVariableDeductionMonthly;
      setTotalDeductionMonthly(totalDeduction);
      setTotalDeductionYearly(totalDeduction * 12);
      setNetTakeHomeMonthly(totalMonthly - totalDeduction);
      setNetTakeHomeYearly((totalMonthly - totalDeduction) * 12);
    }
  };
  const outputData = [
  {
    description: "Basic Salary",
    monthly: `₹ ${formData.monthlySalary.toLocaleString()}`,
    yearly: `₹ ${(formData.monthlySalary * 12).toLocaleString()}`,
  },
  {
    description: "Total Allowances",
    monthly: `₹ ${(totalFixedMonthly + totalVariableMonthly).toLocaleString()}`,
    yearly: `₹ ${((totalFixedMonthly + totalVariableMonthly) * 12).toLocaleString()}`,
  },
  {
    description: "Gross Salary",
    monthly: `₹ ${totalMonthly.toLocaleString()}`,
    yearly: `₹ ${totalYearly.toLocaleString()}`,
  },
  {
    description: "Total Deductions",
    monthly: `₹ ${totalDeductionMonthly.toLocaleString()}`,
    yearly: `₹ ${totalDeductionYearly.toLocaleString()}`,
  },
  {
    description: "Net Take Home Salary",
    monthly: `₹ ${netTakeHomeMonthly.toLocaleString()}`,
    yearly: `₹ ${netTakeHomeYearly.toLocaleString()}`,
  },
];

  const handleSaveCTCComponents = async () => {
    try {
      const ctcData = {
        employee_id: empId,
        fixed_allowances: fixedAllowanceItems,
        variable_allowances: variableAllowanceItems,
        fixed_deductions: fixedDeductionItems,
        variable_deductions: variableDeductionItems,
        total_monthly: totalMonthly,
        total_yearly: totalYearly,
        total_deduction_monthly: totalDeductionMonthly,
        total_deduction_yearly: totalDeductionYearly,
        net_take_home_monthly: netTakeHomeMonthly,
        net_take_home_yearly: netTakeHomeYearly,
      };

      setPageChange("table");
    } catch (error) {
      onsole.error("Failed to save CTC components:", error);
    }
  };
  return (
    <div className="flex items-center justify-between w-full mb-5">
      <div className="flex w-full px-4">
        <div className="flex w-full">
          <div className="w-full p-2 bg-white rounded-lg">
            <div className="w-full rounded-md">
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
                    {/* <h2
                      className={`p-1 ${
                        page === "Tax and Statutory Setting" &&
                        "bg-white font-medium text-blue-500 shadow-custom-all-sides"
                      } rounded-t-md px-4 cursor-pointer transition-all duration-300 ease-linear`}
                      onClick={() => setPage("Tax and Statutory Setting")}
                    >
                      Tax and Statutory Setting
                    </h2> */}
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
                // <div>
                //   <div className="mb-4">
                //     <label
                //       className="block text-gray-700 text-sm font-bold mb-2"
                //       htmlFor="effectiveDate"
                //     >
                //       Select Effective Date for Payroll Processing
                //     </label>
                //     <input
                //       type="date"
                //       id="effectiveDate"
                //       value={formData.effectiveDate}
                //       onChange={handleChange}
                //       name="effectiveDate"
                //       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                //     />
                //   </div>
                //   <div className="mb-4">
                //     <label className="block text-gray-700 text-sm font-bold mb-2">
                //       Does the actual effective date of salary differ?
                //     </label>
                //     <div className="flex items-center">
                //       <input
                //         type="radio"
                //         id="yes"
                //         name="effectiveDateDiffer"
                //         checked={formData.effectiveDateDiffer === true}
                //         onChange={() =>
                //           setFormData({
                //             ...formData,
                //             effectiveDateDiffer: true,
                //           })
                //         }
                //         className="mr-2"
                //       />
                //       <label htmlFor="yes" className="mr-4">
                //         Yes
                //       </label>
                //       <input
                //         type="radio"
                //         id="no"
                //         name="effectiveDateDiffer"
                //         checked={formData.effectiveDateDiffer === false}
                //         onChange={() =>
                //           setFormData({
                //             ...formData,
                //             effectiveDateDiffer: false,
                //           })
                //         }
                //         className="mr-2"
                //       />
                //       <label htmlFor="no">No</label>
                //     </div>
                //   </div>
                //   {formData.effectiveDateDiffer && (
                //     <div className="mb-4">
                //       <label
                //         className="block text-gray-700 text-sm font-bold mb-2"
                //         htmlFor="effectiveDate"
                //       >
                //         Please select the actual effective date
                //       </label>
                //       <input
                //         type="date"
                //         id="actualEffectiveDate"
                //         value={formData.actualEffectiveDate}
                //         name="actualEffectiveDate"
                //         onChange={handleChange}
                //         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                //       />
                //     </div>
                //   )}
                //   <div className="mb-4">
                //     <label
                //       className="block text-gray-700 text-sm font-bold mb-2"
                //       htmlFor="ctcAmount"
                //     >
                //       Enter CTC Amount frequency
                //     </label>
                //     <select
                //       id="ctcTemplate"
                //       value={formData.CTCFrequency}
                //       onChange={handleChange}
                //       name="CTCFrequency"
                //       className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                //     >
                //       <option value="">Select CTC Amount frequency</option>
                //       <option value="monthly">Monthly</option>
                //       <option value="Annually">Annually</option>
                //     </select>
                //   </div>

                //   <div className="mb-4">
                //     <label
                //       className="block text-gray-700 text-sm font-bold mb-2"
                //       htmlFor="ctcTemplate"
                //     >
                //       Select CTC Template
                //     </label>
                //     <select
                //       id="ctcTemplate"
                //       value={formData.ctcTemplate}
                //       onChange={handleChange}
                //       name="ctcTemplate"
                //       className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                //     >
                //       <option value="" disabled>
                //         Select Template
                //       </option>
                //       <option value="template1">Template 1</option>
                //       <option value="template2">Template 2</option>
                //       <option value="template3">Template 3</option>
                //     </select>
                //   </div>
                //   <div className="mb-4">
                //     <label
                //       className="block text-gray-700 text-sm font-bold mb-2"
                //       htmlFor="ctcTemplate"
                //     >
                //       How are you entering the amount?{" "}
                //       <span className="text-red-500">*</span>
                //     </label>
                //     <select
                //       id="ctcTemplate"
                //       value={formData.howEnteringAmount}
                //       onChange={handleChange}
                //       name="howEnteringAmount"
                //       className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                //     >
                //       <option value="As_CTC">As CTC</option>
                //       <option value="As Gross Salary">As Gross Salary</option>
                //     </select>
                //   </div>
                //   {formData.howEnteringAmount === "As_CTC" &&
                //     formData.CTCFrequency === "monthly" && (
                //       <div className="mb-4">
                //         <label
                //           className="block text-gray-700 text-sm font-bold mb-2"
                //           htmlFor="ctcTemplate"
                //         >
                //           Enter Monthly CTC Amount
                //         </label>
                //         <input
                //           type="text"
                //           name="monthlyCTCAmount"
                //           id=""
                //           value={formData.monthlyCTCAmount}
                //           onChange={handleChange}
                //           placeholder="Enter Monthly CTC Amount"
                //           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                //           pattern="[0-9]*"
                //           onKeyDown={(e) => {
                //             if (
                //               !/[0-9]/.test(e.key) &&
                //               e.key !== "Backspace" &&
                //               e.key !== "ArrowLeft" &&
                //               e.key !== "ArrowRight"
                //             ) {
                //               e.preventDefault();
                //             }
                //           }}
                //         />
                //       </div>
                //     )}
                //   {formData.howEnteringAmount === "As Gross Salary" &&
                //     formData.CTCFrequency === "monthly" && (
                //       <div className="mb-4">
                //         <label
                //           className="block text-gray-700 text-sm font-bold mb-2"
                //           htmlFor="ctcTemplate"
                //         >
                //           Enter Monthly Gross Amount
                //         </label>
                //         <input
                //           type="text"
                //           name="monthlyGrossAmount"
                //           id=""
                //           value={formData.monthlyGrossAmount}
                //           onChange={handleChange}
                //           placeholder="Enter Monthly Gross Amount"
                //           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                //           pattern="[0-9]*"
                //           onKeyDown={(e) => {
                //             if (
                //               !/[0-9]/.test(e.key) &&
                //               e.key !== "Backspace" &&
                //               e.key !== "ArrowLeft" &&
                //               e.key !== "ArrowRight"
                //             ) {
                //               e.preventDefault();
                //             }
                //           }}
                //         />
                //       </div>
                //     )}
                //   {formData.howEnteringAmount === "As_CTC" &&
                //     formData.CTCFrequency === "Annually" && (
                //       <div className="mb-4">
                //         <label
                //           className="block text-gray-700 text-sm font-bold mb-2"
                //           htmlFor="ctcTemplate"
                //         >
                //           Enter Annually CTC Amount
                //         </label>
                //         <input
                //           type="text"
                //           name="annuallyCTCAmount"
                //           id=""
                //           value={formData.annuallyCTCAmount}
                //           onChange={handleChange}
                //           placeholder="Enter Annually CTC Amount"
                //           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                //           pattern="[0-9]*"
                //           onKeyDown={(e) => {
                //             if (
                //               !/[0-9]/.test(e.key) &&
                //               e.key !== "Backspace" &&
                //               e.key !== "ArrowLeft" &&
                //               e.key !== "ArrowRight"
                //             ) {
                //               e.preventDefault();
                //             }
                //           }}
                //         />
                //       </div>
                //     )}
                //   {formData.howEnteringAmount === "As Gross Salary" &&
                //     formData.CTCFrequency === "Annually" && (
                //       <div className="mb-4">
                //         <label
                //           className="block text-gray-700 text-sm font-bold mb-2"
                //           htmlFor="ctcTemplate"
                //         >
                //           Enter Annually Gross Amount
                //         </label>
                //         <input
                //           type="text"
                //           name="annuallyGrossAmount"
                //           id=""
                //           value={formData.annuallyGrossAmount}
                //           onChange={handleChange}
                //           placeholder="Enter Annually Gross Amount"
                //           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                //           pattern="[0-9]*"
                //           onKeyDown={(e) => {
                //             if (
                //               !/[0-9]/.test(e.key) &&
                //               e.key !== "Backspace" &&
                //               e.key !== "ArrowLeft" &&
                //               e.key !== "ArrowRight"
                //             ) {
                //               e.preventDefault();
                //             }
                //           }}
                //         />
                //       </div>
                //     )}
                //   <div className="flex justify-center gap-2">
                //     <button
                //       className="border border-red-500 text-red-500 rounded px-4"
                //       onClick={() => setPageChange("table")}
                //     >
                //       Cancel
                //     </button>
                //     <button
                //       style={{ background: themeColor }}
                //       className="bg-black text-white hover:bg-gray-700 font-semibold py-2 px-4 rounded"
                //       onClick={handleAddGeneralInfo}
                //     >
                //       Save & Proceed
                //     </button>
                //   </div>
                // </div>
                <div>
                  {selectedTemplate && (
                    <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                      <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Selected CTC Template
                        </h3>
                      </div>

                      <div className="p-4">
                        <div className=" mb-4">
                          <div className="bg-gray-50 p-3 rounded-md text-left flex items-center  gap-5 text-xl mb-5">
                            <p className=" font-medium text-gray-500  ">
                              Template Name:-{" "}
                            </p>
                            <p className=" font-semibold text-xl text capitalize">
                              {selectedTemplate.template_name}
                            </p>
                          </div>
                          <div>
                            <label className="block text-gray-700 font-bold mb-2">
                              Enter Monthly Salary (₹)
                            </label>
                            <input
                              type="text"
                              value={formData.monthlySalary}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  monthlySalary:
                                    parseFloat(e.target.value) || 0,
                                })
                              }
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="Enter monthly salary amount"
                            />
                          </div>
                          <div className="bg-gray-50 p-3 rounded-md text-left flex items-center gap-5 text-xl mb-5">
                            <p className="font-medium text-gray-500">
                              Allowance Details:-{" "}
                            </p>
                            <div className="bg-gray-50 p-3 rounded-md">
                              <div className="overflow-x-auto">
                                <table className="w-full">
                                  <thead className="">
                                    <tr className="text-left border-b border-gray-200 ">
                                      <th className="pb-2 pr-[5rem]">
                                        Allowance Name
                                      </th>
                                      <th className="pb-2  text-right pr-[5rem]">
                                        Amount
                                      </th>
                                      <th className="pb-2 text-right pr-[5rem]">
                                        Percentage %
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {selectedTemplate.components_details.map(
                                      (component, index) => (
                                        <tr
                                          key={index}
                                          className="border-b border-gray-200 last:border-0"
                                        >
                                          <td className="py-2 pr-4">
                                            {component.name ||
                                              component.component_name}
                                          </td>
                                          <td className="py-2 pr-4 ">
                                            ₹
                                            {component.value
                                              ? component.value.toLocaleString()
                                              : "0"}
                                          </td>
                                          <td className="py-2 ">
                                            {component.percentage_of_ctc || "0"}
                                            %
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                          {/* deduction details */}
                          <div className="bg-gray-50 p-3 rounded-md text-left flex items-center gap-5 text-xl mb-5">
                            <p className="font-medium text-gray-500">
                              Deduction Details:-{" "}
                            </p>
                            <div className="bg-gray-50 p-3 rounded-md">
                              <div className="overflow-x-auto">
                                <table className="w-full">
                                  <thead className="">
                                    <tr className="text-left border-b border-gray-200 ">
                                      <th className="pb-2 pr-[5rem]">
                                        Deduction Name
                                      </th>
                                      <th className="pb-2  text-right pr-[5rem]">
                                        Amount
                                      </th>
                                      <th className="pb-2 text-right pr-[5rem]">
                                        Percentage %
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {selectedTemplate.deductions_details.map(
                                      (component, index) => (
                                        <tr
                                          key={index}
                                          className="border-b border-gray-200 last:border-0"
                                        >
                                          <td className="py-2 pr-4">
                                            {component.name ||
                                              component.component_name}
                                          </td>
                                          <td className="py-2 pr-4 ">
                                            ₹
                                            {component.value
                                              ? component.value.toLocaleString()
                                              : "0"}
                                          </td>
                                          <td className="py-2 ">
                                            {component.percentage_of_salary ||
                                              "0"}
                                            %
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end">
        <button
          style={{ background: themeColor }}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          onClick={() => {
            if (formData.monthlySalary > 0) {
              setPage("CTC Components");
            } else {
              toast.error("Please enter a valid monthly salary");
            }
          }}
        >
          View CTC Breakdown
        </button>
      </div>
                        </div>

                        {/* Components Card */}
                        {/* <div className="mb-4">
                           <div className="bg-green-50 px-3 py-2 rounded-t-md border-b border-green-100">
                             <h4 className="font-medium text-green-800">Components</h4>
                           </div>
                           <div className="border border-t-0 border-gray-200 rounded-b-md">
                             {selectedTemplate.components_details.map((component, index) => (
                               <div 
                                 key={index} 
                                 className={`p-3 flex justify-between items-center ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                               >
                                 <span className="font-medium">{component.name || component.component_name}</span>
                                 <span className="text-blue-600 font-semibold">₹{component.monthly_amount}/month</span>
                               </div>
                             ))}
                             <div className="p-3 bg-gray-100 flex justify-between items-center border-t border-gray-200">
                               <span className="font-bold">Total Components</span>
                               <span className="text-blue-600 font-bold">
                                 ₹{selectedTemplate.components_details.reduce((sum, comp) => sum + (comp.monthly_amount || 0), 0)}/month
                               </span>
                             </div>
                           </div>
                         </div> */}

                        {/* Deductions Card */}
                        {/* <div className="mb-4">
                           <div className="bg-purple-50 px-3 py-2 rounded-t-md border-b border-purple-100">
                             <h4 className="font-medium text-purple-800">Deductions</h4>
                           </div>
                           <div className="border border-t-0 border-gray-200 rounded-b-md">
                             {selectedTemplate.deductions_details.map((deduction, index) => (
                               <div 
                                 key={index} 
                                 className={`p-3 flex justify-between items-center ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                               >
                                 <span className="font-medium">{deduction.name || deduction.deduction_name}</span>
                                 <span className="text-red-600 font-semibold">₹{deduction.monthly_amount}/month</span>
                               </div>
                             ))}
                             <div className="p-3 bg-gray-100 flex justify-between items-center border-t border-gray-200">
                               <span className="font-bold">Total Deductions</span>
                               <span className="text-red-600 font-bold">
                                 ₹{selectedTemplate.deductions_details.reduce((sum, ded) => sum + (ded.monthly_amount || 0), 0)}/month
                               </span>
                             </div>
                           </div>
                         </div> */}

                        {/* Summary Card */}
                        {/* <div className="bg-blue-50 p-4 rounded-md">
                           <h4 className="font-semibold text-blue-800 mb-2">CTC Summary</h4>
                           <div className="grid grid-cols-2 gap-4">
                             <div>
                               <p className="text-sm text-gray-600">Monthly CTC</p>
                               <p className="text-xl font-bold">
                                 ₹{selectedTemplate.components_details.reduce((sum, comp) => sum + (comp.monthly_amount || 0), 0)}
                               </p>
                             </div>
                             <div>
                               <p className="text-sm text-gray-600">Annual CTC</p>
                               <p className="text-xl font-bold">
                                 ₹{selectedTemplate.components_details.reduce((sum, comp) => sum + (comp.monthly_amount || 0), 0) * 12}
                               </p>
                             </div>
                             <div>
                               <p className="text-sm text-gray-600">Monthly Take-home</p>
                               <p className="text-xl font-bold text-green-600">
                                 ₹{selectedTemplate.components_details.reduce((sum, comp) => sum + (comp.monthly_amount || 0), 0) - 
                                  selectedTemplate.deductions_details.reduce((sum, ded) => sum + (ded.monthly_amount || 0), 0)}
                               </p>
                             </div>
                             <div>
                               <p className="text-sm text-gray-600">Annual Take-home</p>
                               <p className="text-xl font-bold text-green-600">
                                 ₹{(selectedTemplate.components_details.reduce((sum, comp) => sum + (comp.monthly_amount || 0), 0) - 
                                   selectedTemplate.deductions_details.reduce((sum, ded) => sum + (ded.monthly_amount || 0), 0)) * 12}
                               </p>
                             </div>
                           </div>
                         </div> */}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* {page === "Tax and Statutory Setting" && (
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
                            taxData.employeeProvidentContributionCapped ===
                            false
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
                            taxData.employerProvidentCOntributionCapped ===
                            false
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
                      Provident Fund Wage{" "}
                      <span className="text-red-500">*</span>
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
                      Income Tax Deduction{" "}
                      <span className="text-red-500">*</span>
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
                            setTaxData({
                              ...taxData,
                              incomeTaxDeduction: false,
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
                      Gratuity Applicable{" "}
                      <span className="text-red-400">*</span>
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
                            setTaxData({
                              ...taxData,
                              gratuityApplicable: false,
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
                      className="border border-red-500 text-red-500 rounded px-4"
                      onClick={() => setPageChange("table")}
                    >
                      Cancel
                    </button>
                    <button
                      className=" text-gray-500   font-medium py-2 px-4 rounded-md border-2 border-gray-500"
                      onClick={() => setPage("General Info")}
                    >
                      Back
                    </button>
                    <button
                      className="bg-black text-white  hover:bg-gray-700 font-medium py-2 px-4 rounded-md"
                      onClick={handleAddTaxStatutory}
                    >
                      Save & Proceed
                    </button>
                  </div>
                </div>
              )} */}
              {page === "CTC Components" && (
                <div>
                  <div className="w-full mx-auto p-4">
                    <div className="flex items-center mb-2 border-b">
                      <h2 className="text-lg font-semibold w-1/2">
                        Components
                      </h2>
                      <div className="flex w-1/2">
                        <p className="text-lg font-semibold w-1/3 text-center">
                          Monthly
                        </p>
                        <p className="text-lg font-semibold w-1/3 text-right">
                          Yearly
                        </p>
                        <span className="w-1/3"></span>
                      </div>
                    </div>

                    {/* <SalaryAccordion
                      title="Fixed Allowance"
                      items={fixedAllowanceItems}
                      totalMonthly={totalMonthly}
                      totalYearly={totalYearly}
                      onMonthlyChange={handleMonthlyChange}
                    /> */}
                    {/* Allowance */}
                    <SalaryAccordion
                      title="Fixed Allowances"
                      items={fixedAllowanceItems}
                      totalMonthly={totalFixedMonthly}
                      totalYearly={totalFixedMonthly * 12}
                      onMonthlyChange={(index, value) =>
                        handleMonthlyChange(index, value, "fixed-allowance")
                      }
                    />

                    <SalaryAccordion
                      title="Variable Allowances"
                      items={variableAllowanceItems}
                      totalMonthly={totalVariableMonthly}
                      totalYearly={totalVariableMonthly * 12}
                      isPercentageBased={true}
                    />

                    <SalaryAccordion
                      title="Other Benefits"
                      items={[]}
                      totalMonthly={0}
                      totalYearly={0}
                    />
                    {/* <SalaryAccordion
                      title="Other Benefits"
                      items={[]}
                      totalMonthly={0}
                      totalYearly={0}
                    /> */}
                    <SalaryAccordion
                      title="Flexi Benefits"
                      items={[]}
                      totalMonthly={0}
                      totalYearly={0}
                    />
                    <SalaryAccordion
                      title="Total Employer Statutory Contributions"
                      items={[]}
                      totalMonthly={0}
                      totalYearly={0}
                    />
                    <SalaryAccordion
                      title="Total Employee Statutory Deductions"
                      items={[]}
                      totalMonthly={0}
                      totalYearly={0}
                    />

                    {/* <SalaryAccordion
                      title="Fixed Deductions"
                      items={[]}
                      totalMonthly={0}
                      totalYearly={0}
                    /> */}
                    {/* deduction */}
                    <SalaryAccordion
                      title="Fixed Deductions"
                      items={fixedDeductionItems}
                      totalMonthly={totalFixedDeductionMonthly}
                      totalYearly={totalFixedDeductionMonthly * 12}
                      onMonthlyChange={(index, value) =>
                        handleMonthlyChange(index, value, "fixed-deduction")
                      }
                      isDeduction={true}
                    />

                    <SalaryAccordion
                      title="Variable Deductions"
                      items={variableDeductionItems}
                      totalMonthly={totalVariableDeductionMonthly}
                      totalYearly={totalVariableDeductionMonthly * 12}
                      isPercentageBased={true}
                      isDeduction={true}
                    />
                    {/* <SalaryAccordion
                      title="Variable Allowances"
                      items={[]}
                      totalMonthly={0}
                      totalYearly={0}
                    /> */}
                    {/* <SalaryAccordion
                      title="Variable Deductions"
                      items={[]}
                      totalMonthly={0}
                      totalYearly={0}
                    /> */}
                  </div>
                  <table className="w-full bg-gray-50 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left p-3 font-semibold text-blue-500">
                          Consolidated Output
                        </th>
                        <th className="text-right p-3 font-semibold text-gray-600">
                          Monthly
                        </th>
                        <th className="text-right p-3 font-semibold text-gray-600">
                          Yearly
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {outputData.map((row, index) => (
                        <tr key={index} className="border-t border-gray-200">
                          <td className="p-3 text-gray-700">
                            {row.description}
                          </td>
                          <td className="p-3 text-right text-gray-700">
                            {row.monthly}
                          </td>
                          <td className="p-3 text-right text-gray-700">
                            {row.yearly}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-10 flex justify-center gap-2">
                    <button
                      className="border border-red-500 text-red-500 rounded px-4"
                      onClick={() => setPageChange("table")}
                    >
                      Cancel
                    </button>
                    <button
                      className=" text-gray-500  font-medium py-2 px-4 rounded-md border-2 border-gray-500"
                      onClick={() => setPage("General Info")}
                    >
                      Back
                    </button>
                    <button
                      style={{ background: themeColor }}
                      className="bg-black text-white hover:bg-gray-700 font-semibold py-2 px-4 rounded"
                      onClick={handleSaveCTCComponents}
                    >
                      Save & Proceed
                    </button>
                  </div>
                </div>
                // <div></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddNewCTC;
