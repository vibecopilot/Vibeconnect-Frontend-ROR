import React, { useState, useRef, useEffect } from "react";
import EmployeeSections from "./EmployeeSections";
import EditEmployeeDirectory from "./EditEmployeeDirectory";
import Table from "../../components/table/Table";
import { PiPlusCircle } from "react-icons/pi";
import { useParams } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import Collapsible from "react-collapsible";
import CustomTrigger from "../../containers/CustomTrigger";
import AddNewCTC from "./AddNewCTC";
import {
  getEmployeeSalaryDetails,
  getHrmsCtcTemplate,
  createEmployeeProfile,
  getEmployeeDetails,
  getCtcProfile,
  deleteCtcProfile,
  getHrmsPayrollSlipDetails,
  getEmployeeAssociations,
  updateCtcProfile,
} from "../../api";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { IoIosArrowDown } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";
import Select from "react-select";
const SectionSalary = () => {
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const [isopen, setisopen] = useState(false);
  const [page, setPage] = useState("table");
  const [isTaxSettingsVisible, setTaxSettingsVisible] = useState(false);
  const [isCTCComponentsVisible, setCTCComponentsVisible] = useState(false);
  const [isEmployerContributionsVisible, setEmployerContributionsVisible] =
    useState(false);
  const [isEmployeeDeductionsVisible, setEmployeeDeductionsVisible] =
    useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // const column = [
  //   { name: "Sr. No.", selector: (row, index) => index + 1, sortable: true },
  //   {
  //     name: "CTC Effective From",
  //     selector: (row) => row.effective_date,
  //     sortable: true,
  //   },
  //   { name: "CTC Effective To", selector: (row) => row.to, sortable: true },
  //   {
  //     name: "Monthly Gross",
  //     selector: (row) => row.monthly_gross_amount && row.monthly_gross_amount,
  //     sortable: true,
  //   },
  //   {
  //     name: "Monthly CTC",
  //     selector: (row) => row.monthly_ctc_amount && row.monthly_ctc_amount,
  //     sortable: true,
  //   },
  //   {
  //     name: "Action",
  //     cell: (row) => (
  //       <div className="flex items-center gap-4">
  //         <button onClick={() => setisopen(true)}>
  //           <BsEye size={15} />
  //         </button>
  //       </div>
  //     ),
  //   },
  // ];

  // const [columns, setColumns] = useState([]);

  const [salaries, setSalaries] = useState([]);
  useEffect(() => {
    const hasMonthlyGross = salaries?.some((row) => row.monthly_gross_amount);
    const hasMonthlyCTC = salaries?.some((row) => row.monthly_ctc_amount);
    const hasAnnuallyCTC = salaries?.some((row) => row.annually_ctc_amount);
    const hasAnnuallyGross = salaries?.some((row) => row.annually_gross_amount);
    console.log(hasMonthlyGross);
    console.log(hasMonthlyCTC);
    console.log(hasAnnuallyCTC);
    console.log(hasAnnuallyGross);
    // const dynamicColumns = [
    //   { name: "Sr. No.", selector: (row, index) => index + 1, sortable: true },
    //   {
    //     name: "CTC Effective From",
    //     selector: (row) => row.effective_date,
    //     sortable: true,
    //   },
    //   {
    //     name: "CTC Effective To",
    //     selector: (row) => row.to,
    //     sortable: true,
    //   },
    //   ...(hasMonthlyGross
    //     ? [
    //         {
    //           name: "Monthly Gross",
    //           selector: (row) => row.monthly_gross_amount,
    //           sortable: true,
    //         },
    //       ]
    //     : []),
    //   ...(hasMonthlyCTC
    //     ? [
    //         {
    //           name: "Monthly CTC",
    //           selector: (row) => row.monthly_ctc_amount,
    //           sortable: true,
    //         },
    //       ]
    //     : []),
    //   ...(hasAnnuallyCTC
    //     ? [
    //         {
    //           name: "Annually CTC",
    //           selector: (row) => row.annually_ctc_amount,
    //           sortable: true,
    //         },
    //       ]
    //     : []),
    //   ...(hasAnnuallyGross
    //     ? [
    //         {
    //           name: "Annually Gross",
    //           selector: (row) => row.annually_gross_amount,
    //           sortable: true,
    //         },
    //       ]
    //     : []),

    //   {
    //     name: "Action",
    //     cell: (row) => (
    //       <div className="flex items-center gap-4">
    //         <button onClick={() => setisopen(true)}>
    //           <BsEye size={15} />
    //         </button>
    //       </div>
    //     ),
    //   },
    // ];

    // setColumns(dynamicColumns);
  }, [salaries]);

  const { id } = useParams();
  console.log("get id ----", id);
  const fetchEmployeeSalary = async () => {
    try {
      const res = await getEmployeeSalaryDetails(id);
      setSalaries(res);
    } catch (error) {
      console.log(error);
    }
  };

  const [ctcTemplate, setCtcTemplate] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [currentEmpId, setCurrentEmpId] = useState();
  const [employeeName, setEmployeeName] = useState("");
  const fetchEmployeeData = async () => {
    try {
      const employeeData = await getEmployeeDetails(id);
      const fullname = `${employeeData.first_name} ${employeeData.last_name}`;
      console.log("employee id", employeeData.id);
      setCurrentEmpId(employeeData.id);
      setEmployeeName(fullname); // Adjust based on your API response structure
    } catch (error) {
      console.error("Error fetching employee data:", error);
      toast.error("Failed to load employee data");
    }
  };
  console.log("emp id from state", currentEmpId);
  useEffect(() => {
    fetchEmployeeData();
  });

  const fetchEmployeeSite = async () => {
    try {
      const res = await getEmployeeAssociations(id);
      fetchCtcTemplates(res[0]?.associated_organization);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCtcTemplates = async (siteId) => {
    try {
      const res = await getHrmsCtcTemplate(hrmsOrgId, siteId);
      console.log("Ctc template", res);
      setCtcTemplate(res.results);
    } catch (error) {
      console.log("Error Geeting the CTC Templates");
      toast.error("Failed to Load Ctc template");
    }
  };
  // getting ctc profile
  const [ctcProfiles, setCtcProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const employeeId = "";

  const fetchCtcProfiles = async () => {
    // setLoading(true);
    try {
      const data = await getCtcProfile(id);
      console.log("table data", data);
      setCtcProfiles(data);
    } catch (error) {
      console.error("Error fetching CTC profiles:", error);
      setCtcProfiles([]);
      // toast.error('Failed to load CTC profiles');
    } finally {
      setLoading(false);
    }
  };

  const [templateDetails, setTemplateDetails] = useState(null);
  const handleViewDetails = async (profile) => {
    try {
      const response = await getHrmsPayrollSlipDetails(profile.ctc_template);
      setTemplateDetails(response);
      setSelectedProfile(profile);
      setisopen(true);
    } catch (error) {
      console.error("Error fetching template details:", error);
      toast.error("Failed to load template details");
    }
  };
  useEffect(() => {
    fetchCtcProfiles();
  }, []);

  useEffect(() => {
    fetchEmployeeSite();
    // fetchCtcTemplates();
  }, []);
  useEffect(() => {
    // if (page === "table") {
    fetchEmployeeSalary(), fetchCtcProfiles();
    // }
  }, []);
  const handleDeleteProfile = async (id) => {
    try {
      await deleteCtcProfile(id);
      fetchCtcProfiles();
      toast.success("Successfully Deleted ");
    } catch (error) {
      console.log("Error deleting records", error);
      toast.error("Unable to delete the Profile");
    }
  };

  // Hiding Coloumns
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleColumnToggle = (columnName) => {
    setSelectedColumns((prev) =>
      prev.includes(columnName)
        ? prev.filter((name) => name !== columnName)
        : [...prev, columnName]
    );
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "80px",
    },
    {
      name: "Employee Name",
      selector: (row) => row.employee_name,
      sortable: true,
      grow: 2,
      width: "350px",
    },
    {
      name: "Created Date",
      selector: (row) => new Date(row.created_date).toLocaleString(),
      sortable: true,
      cell: (row) => (
        <div>
          <span>Date :- {new Date(row.created_date).toLocaleDateString()}</span>
          <br />
          <span>
            Created Time :- {new Date(row.created_date).toLocaleTimeString()}
          </span>
        </div>
      ),
    },
    {
      name: "CTC Template",
      selector: (row) => {
        const template = ctcTemplate.find((t) => t.id === row.ctc_template);
        return template
          ? template.template_name
          : `Template ID: ${row.ctc_template}`;
      },
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <button onClick={() => handleViewDetails(row)}>
            <BsEye size={15} />
          </button>
          <button
            className="text-red-400"
            onClick={() => handleDeleteProfile(row.id)}
          >
            <FaTrash size={15} />
          </button>
        </div>
      ),
      width: "100px",
    },
  ];
  console.log("selectedtemplate", selectedTemplate?.value);
  const handleCreateEmployeeProfile = async () => {
    if (!selectedTemplate) {
      toast.error("Please select a CTC template first");
      return;
    }

    if (!employeeName) {
      toast.error("Employee name not found");
      return;
    }

    try {
      const profileData = {
        employee_name: employeeName,
        employee: parseInt(id),
        ctc_template: selectedTemplate?.value, // Using the template ID from selected value
      };
      if (ctcProfiles.length > 0) {
        await updateCtcProfile(ctcProfiles[0].id, profileData);
      } else {
        await createEmployeeProfile(profileData);
      }
      toast.success("Employee CTC created successfully");
      // setPage("add");
      fetchCtcProfiles();
    } catch (error) {
      console.error("Error creating employee profile:", error);
      toast.error(
        error.response?.data?.message || "Failed to create employee profile"
      );
    }
  };

  const themeColor = useSelector((state) => state.theme.color);

  return (
    <div className="flex flex-col ml-20">
      <EditEmployeeDirectory />

      <div className="flex">
        <div className="">
          <EmployeeSections empId={id} />
        </div>

        {page === "table" && (
          <div className=" w-full mt-5 p-5  rounded-md">
            {/* <Collapsible
              readOnly
              trigger={
                <CustomTrigger isOpen={isOpen}>
                  <h2 className="text-xl font-medium ">Salary Information</h2>
                </CustomTrigger>
              }
              onOpen={() => setIsOpen(true)}
              onClose={() => setIsOpen(false)}
              className="bg-gray-100 my-4 p-2 rounded-md font-bold "
            > */}
            <div className="mx-10 gap-3">
              <label htmlFor="" className="text-[16px] font-bold ">
                Select Ctc Template
              </label>
              <Select
                options={ctcTemplate?.map((template) => ({
                  value: template.id, // This is the template ID
                  label: template.template_name,
                  data: template, // Full template data if needed elsewhere
                }))}
                value={selectedTemplate}
                onChange={setSelectedTemplate}
                placeholder="Please Select A Ctc Template"
                className="basic-single border border-gray-500 rounded-lg my-2 z-40"
                classNamePrefix="select"
              />
              {selectedTemplate && (
                <div className="flex justify-end mt-4">
                  {/* <button
           onClick={() => {
            if (selectedTemplate) {
              setPage("add");
            } else {
              toast.error("Please select a CTC template first");
            }
          }}
            style={{background: themeColor}}
            className="border-2 font-semibold hover:bg-black text-white duration-150 transition-all p-2 rounded-md cursor-pointer text-center flex items-center gap-2 justify-center"
          >
            <PiPlusCircle size={20} />
            Add New CTC
          </button> */}
                  <button
                    onClick={handleCreateEmployeeProfile}
                    style={{ background: themeColor }}
                    className="border-2 font-semibold hover:bg-black text-white duration-150 transition-all p-2 rounded-md cursor-pointer text-center flex items-center gap-2 justify-center"
                  >
                    <PiPlusCircle size={20} />
                    Add New CTC
                  </button>
                </div>
              )}
              <div className="flex items-end">
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{ background: themeColor }}
                    className="px-4 py-2 font-medium text-white rounded-md flex gap-2 items-center justify-center"
                  >
                    Hide Columns
                    {dropdownOpen ? (
                      <IoIosArrowDown />
                    ) : (
                      <MdKeyboardArrowRight />
                    )}
                  </button>
                  {dropdownOpen && (
                    <div className="absolute mt-2 bg-white border rounded shadow-md w-64 max-h-64 overflow-y-auto z-10">
                      {columns.map((column) => (
                        <label
                          key={column.name}
                          className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={!selectedColumns.includes(column.name)}
                            onChange={() => handleColumnToggle(column.name)}
                            className="form-checkbox h-4 w-4 text-blue-600"
                          />
                          <span className="ml-2">{column.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* <p>{ctcProfiles.ctc_template}</p> */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="mt-5">
                <Table
                  columns={columns.filter(
                    (col) => !selectedColumns.includes(col.name)
                  )}
                  data={ctcProfiles.length > 0 ? [ctcProfiles[0]] : []}
                  isPagination={true}
                  noDataComponent={
                    <div className="p-4 text-center">No CTC profiles found</div>
                  }
                />
              </div>
            )}

            <div className="flex justify-end mb-1">
              {/* <button
                  onClick={() => {
                    if (selectedTemplate) {
                      setPage("add");
                    } else {
                      toast.error("Please select a CTC template first");
                    }
                  }}
                  style={{background: themeColor}}
                  className="border-2 font-semibold hover:bg-black text-white duration-150 transition-all p-2 rounded-md  cursor-pointer text-center flex items-center  gap-2 justify-center"
                >
                  <PiPlusCircle size={20} />
                  Add New CTC
                </button> */}
            </div>
            {/* <Table columns={columns} data={salaries} isPagination={true} /> */}
            {/* </Collapsible> */}
          </div>
        )}
        {page === "add" && (
          <AddNewCTC
            setPageChange={setPage}
            empId={id}
            fetchEmployeeSalary={fetchEmployeeSalary}
            selectedTemplate={selectedTemplate?.data}
            fetchCtcProfiles={fetchCtcProfiles}
          />
        )}
        {isopen && templateDetails && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-2/4 max-h-screen overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">CTC Structures Details</h2>
              <div className="mb-4">
                <p>
                  <strong>Template Name:</strong>{" "}
                  {templateDetails.template_name}
                </p>
                <p>
                  <strong>Created Date:</strong>{" "}
                  {new Date(templateDetails.created_date).toLocaleDateString()}
                </p>
              </div>

              {/* Tax and Statutory Settings */}
              <div className="mb-4">
                <p
                  className="cursor-pointer"
                  onClick={() => setTaxSettingsVisible(!isTaxSettingsVisible)}
                >
                  Tax and Statutory Settings {isTaxSettingsVisible ? "-" : "+"}
                </p>
                {isTaxSettingsVisible && (
                  <div className="ml-4">
                    {templateDetails.deductions_details.map(
                      (deduction, index) => (
                        <p key={index}>
                          <strong>{deduction.name}:</strong>{" "}
                          {deduction.value > 0 ? "Yes" : "No"}
                          {deduction.percentage_of_salary > 0 && (
                            <span>
                              {" "}
                              ({deduction.percentage_of_salary}% of salary)
                            </span>
                          )}
                        </p>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* CTC Components */}
              <div className="mb-4">
                <div className="flex justify-between">
                  <p>CTC Components</p>
                  <p>Monthly</p>
                  <p>Yearly</p>
                </div>
                <p
                  className="cursor-pointer"
                  onClick={() =>
                    setCTCComponentsVisible(!isCTCComponentsVisible)
                  }
                >
                  Fixed Allowances Details {isCTCComponentsVisible ? "-" : "+"}
                </p>
                {isCTCComponentsVisible && (
                  <div className="ml-4">
                    <div className="mt-4 space-y-4 w-4/5">
                      <hr />
                      {templateDetails.components_details
                        .filter((comp) => comp.component_type === "fixed")
                        .map((component, index) => (
                          <div key={index} className="flex justify-between">
                            <label className="text-gray-600">
                              {component.name}
                            </label>
                            <div className="flex gap-8">
                              <p>{component.value}</p>
                              <p>{component.value * 12}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Employer Contributions */}
              <div className="mb-4">
                <p
                  className="cursor-pointer"
                  onClick={() =>
                    setEmployerContributionsVisible(
                      !isEmployerContributionsVisible
                    )
                  }
                >
                  Total Employer Statutory Contributions{" "}
                  {isEmployerContributionsVisible ? "-" : "+"}
                </p>
                {isEmployerContributionsVisible && (
                  <div className="ml-4">
                    <div className="mt-4 space-y-4 w-4/5">
                      <hr />
                      {templateDetails.deductions_details
                        .filter((ded) => ded.deduction_type === "employee")
                        .map((deduction, index) => (
                          <div key={index} className="flex justify-between">
                            <label className="text-gray-600">
                              {deduction.name}
                            </label>
                            <div className="flex gap-8">
                              <p>{deduction.value}</p>
                              <p>{deduction.value * 12}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Employee Deductions */}
              <div className="mb-4">
                <p
                  className="cursor-pointer"
                  onClick={() =>
                    setEmployeeDeductionsVisible(!isEmployeeDeductionsVisible)
                  }
                >
                  Total Employee Statutory Deductions{" "}
                  {isEmployeeDeductionsVisible ? "-" : "+"}
                </p>
                {isEmployeeDeductionsVisible && (
                  <div className="ml-4">
                    <div className="mt-4 space-y-4 w-4/5">
                      <hr />
                      {templateDetails.deductions_details
                        .filter((ded) => ded.deduction_type === "fixed")
                        .map((deduction, index) => (
                          <div key={index} className="flex justify-between">
                            <label className="text-gray-600">
                              {deduction.name}
                            </label>
                            <div className="flex gap-8">
                              <p>{deduction.value}</p>
                              <p>{deduction.value * 12}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Consolidated Output */}
              <div>
                <div className="mt-5 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Consolidated output</h2>
                  <p className="text-lg font-semibold ml-20">Monthly</p>
                  <p className="text-lg font-semibold pr-48">Yearly</p>
                </div>
                <div className="w-3/4">
                  {/* Calculate totals */}
                  {(() => {
                    const fixedComponentsTotal =
                      templateDetails.components_details
                        .filter((comp) => comp.component_type === "fixed")
                        .reduce((sum, comp) => sum + comp.value, 0);

                    const variableComponentsTotal =
                      templateDetails.components_details
                        .filter((comp) => comp.component_type === "variable")
                        .reduce((sum, comp) => sum + comp.value, 0);

                    const employerDeductionsTotal =
                      templateDetails.deductions_details
                        .filter((ded) => ded.deduction_type === "fixed")
                        .reduce((sum, ded) => sum + ded.value, 0);

                    const employeeDeductionsTotal =
                      templateDetails.deductions_details
                        .filter((ded) => ded.deduction_type === "variable")
                        .reduce((sum, ded) => sum + ded.value, 0);

                    const grossSalary =
                      fixedComponentsTotal + variableComponentsTotal;
                    const takeHomeSalary =
                      grossSalary - employeeDeductionsTotal;
                    const totalCTC = grossSalary + employerDeductionsTotal;

                    return (
                      <>
                        <div className="mt-5 flex justify-between">
                          <p className="text-gray-600">
                            Total Take Home (excluding Variable)
                          </p>
                          <p className="ml-10">₹{takeHomeSalary.toFixed(2)}</p>
                          <p>₹{(takeHomeSalary * 12).toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-600">
                            Total CTC (excluding Variable & Other Benefits)
                          </p>
                          <p className="mr-6">₹{totalCTC.toFixed(2)}</p>
                          <p>₹{(totalCTC * 12).toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-600">
                            Total CTC (including Variable)
                          </p>
                          <p className="ml-24">
                            ₹{(totalCTC + variableComponentsTotal).toFixed(2)}
                          </p>
                          <p>
                            ₹
                            {(
                              (totalCTC + variableComponentsTotal) *
                              12
                            ).toFixed(2)}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              <button
                onClick={() => setisopen(false)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionSalary;