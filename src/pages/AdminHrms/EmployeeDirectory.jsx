import React, { useEffect, useRef, useState } from "react";
import { BiEdit } from "react-icons/bi";
import {
  FaChevronDown,
  FaDownload,
  FaIdCard,
  FaSearch,
  FaTable,
  FaTrash,
  FaUpload,
  FaUserEdit,
} from "react-icons/fa";
import DataTable from "react-data-table-component";
import AdminHRMS from "./AdminHrms";
import { Link } from "react-router-dom";
import { PiPlusCircle } from "react-icons/pi";
// import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import InviteEmployeeModal from "./InviteEmployeeModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import convert from "xml-js";
import Select from "react-select";
import {
  deleteHRMSEmployee,
  getAdminAccess,
  getMyHRMSEmployees,
  getMyHRMSEmployeesAllData,
  getHrmsAllEmployeeData,
  getUserDetails,
  hrmsDomain,
  getFullUser,
  getSiteWiseUserDetails,
  getEmployeeJobInfo,
  getAssociatedSites,
  getStatusChanges,
  CreateBulkEmployee,
  getHrmsFilteredEmployeeData,
  getEmployeeAssociations,
  downloadAllEmployeeData,
} from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import toast from "react-hot-toast";
import { error } from "highcharts";
import { Pagination } from "antd";
import Table from "../../components/table/Table";
import { BsFileExcel } from "react-icons/bs";
function EmployeeDirectory() {
  const themeColor = useSelector((state) => state.theme.color);
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [isModalOpen4, setIsModalOpen4] = useState(false);
  const [isModalOpen5, setIsModalOpen5] = useState(false);
  const [isModalOpen6, setIsModalOpen6] = useState(false);
  const [isModalOpen7, setIsModalOpen7] = useState(false);
  const [isModalOpen8, setIsModalOpen8] = useState(false);
  const [isModalOpen9, setIsModalOpen9] = useState(false);
  const [isModalOpen10, setIsModalOpen10] = useState(false);
  const [isModalOpen11, setIsModalOpen11] = useState(false);
  const [employeesData, setEmployeesData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [AllSites, setAllSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [filteredEmployee, setFilteredEmployees] = useState([]);
  const [empfilterData, setEmpFilterData] = useState([]);
  const [siteSearchText, setSiteSearchText] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [isModalOpen12, setIsModalOpen12] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [tableData, setTableData] = useState([]);
  // const [filteredTableData, setFilteredTableData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    count: 0,
    perPage: 10,
  });
  const [allEmployeesData, setAllEmployeesData] = useState([]);

  const fetchTableData = async (page = 1) => {
    try {
      // toast.loading("Loading Employee Data..")
      const res = await getHrmsAllEmployeeData(
        hrmsOrgId,
        page,
        pagination.perPage
      );

      const allSites = await getAssociatedSites(orgId);
      setAllSites(allSites);

      setAllEmployeesData((prev) => {
        const newEmployees = res.results.filter(
          (newEmp) =>
            !prev.some(
              (existingEmp) => existingEmp.employee.id === newEmp.employee.id
            )
        );
        return [...prev, ...newEmployees];
      });

      // For table view: show only current page
      if (viewMode === "table") {
        setTableData(res.results);
      }

      setPagination({
        currentPage: page,
        totalPages: Math.ceil(res.count / pagination.perPage), // Fixed division
        count: res.count,
        perPage: pagination.perPage,
      });
    } catch (error) {
      toast.error("Failed to load employee data");
      console.error("Fetch error:", error);
    }
  };
  useEffect(() => {
    fetchTableData();
  }, []);
  useEffect(() => {
    if (tableData.length === 0) fetchTableData();
  }, [viewMode]);
  const PaginationControls = () => {
    return (
      <div className="flex justify-between items-center mt-4  mb-8 font-semibold text-gray-700">
        {/* <div>
        Showing {pagination.perPage * (pagination.currentPage - 1) + 1} to{" "}
        {Math.min(
          pagination.perPage * pagination.currentPage,
          pagination.count
        )}{" "}
        of {pagination.count} entries
      </div> */}
        <div className="flex gap-1">
          <button
            onClick={() => fetchTableData(1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            First
          </button>
          <button
            onClick={() => fetchTableData(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from(
            { length: Math.min(5, pagination.totalPages) },
            (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.currentPage <= 3) {
                pageNum = i + 1;
              } else if (pagination.currentPage >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => fetchTableData(pageNum)}
                  className={`px-3 py-1 border rounded ${
                    pagination.currentPage === pageNum
                      ? "bg-blue-500 text-white"
                      : ""
                  }`}
                >
                  {pageNum}
                </button>
              );
            }
          )}
          <button
            onClick={() => fetchTableData(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
          {/* <button
          onClick={() => fetchTableData(pagination.totalPages)}
          disabled={pagination.currentPage === pagination.totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Last
        </button> */}
        </div>
        {/* <select
        value={pagination.perPage}
        onChange={(e) => {
          setPagination((prev) => ({
            ...prev,
            perPage: Number(e.target.value),
          }));
          fetchTableData(1);
        }}
        className="border rounded px-2 py-1"
      >
        {[10, 25, 50, 100].map((size) => (
          <option key={size} value={size}>
            Show {size}
          </option>
        ))}
      </select> */}
      </div>
    );
  };
  const handlePageChange = (page) => {
    fetchTableData(page);
  };
  useEffect(() => {
    fetchTableData();
  }, []);
  const employeeColumns = [
    {
      name: "Employee ID",
      selector: (row) => row.employee.id,
      sortable: true,
      width: "120px",
    },
    {
      name: "Name",
      selector: (row) => `${row.employee.first_name} ${row.employee.last_name}`,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center">
          {row.employee.profile_photo ? (
            <img
              src={hrmsDomain + row.employee.profile_photo}
              alt="Profile"
              className="rounded-full h-8 w-8 object-cover mr-2"
            />
          ) : (
            <div
              className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center mr-2"
              style={{ backgroundColor: getRandomColor() }}
            >
              {row.employee.first_name.charAt(0)}
              {row.employee.last_name.charAt(0)}
            </div>
          )}
          <span>
            {row.employee.first_name} {row.employee.last_name}
          </span>
        </div>
      ),
      width: "250px",
    },
    {
      name: "Email",
      selector: (row) => (
        <p className="text-wrap text-xs">{row.employee.email_id}</p>
      ),
      sortable: true,
      width: "220px",
    },
    {
      name: "Mobile",
      selector: (row) => row.employee.mobile,
      sortable: true,
    },
    {
      name: "Site",
      selector: (row) => (
        <p className="text-wrap text-xs">
          {row.employment_info?.associated_organization_name || "N/A"}
        </p>
      ),
      sortable: true,
      width: "180px",
    },

    {
      name: "Status",
      selector: (row) => (row.employee.status ? "Active" : "Inactive"),
      sortable: true,
      cell: (row) => (
        <span
          className={`px-4 py-1 rounded-full text-xs ${
            row.employee.status
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.employee.status ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2 justify-center">
          <Link
            to={`/hrms/employee-directory-Personal/${row.employee.id}`}
            className="text-blue-500 hover:text-blue-700"
          >
            <BiEdit size={16} />
          </Link>
          <button
            onClick={() => handleDeleteModal(row.employee.id)}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrash size={14} />
          </button>
        </div>
      ),
      width: "200px",
    },
  ];

  useEffect(() => {
    const groupedEmployees = allEmployeesData.reduce((acc, employeeData) => {
      const employee = employeeData.employee;
      if (employee && employee.first_name) {
        const firstLetter = employee.first_name[0].toUpperCase();
        if (!acc[firstLetter]) acc[firstLetter] = [];

        const employeeDetails = {
          id: employee.id,
          first_name: employee.first_name,
          last_name: employee.last_name,
          email_id: employee.email_id,
          mobile: employee.mobile,
          status: employee.status,
          profile_photo: employee.profile_photo,
          address_information: employeeData.address_information || null,
          employment_info: employeeData.employment_info || null,
          site_name:
            employeeData.employment_info?.associated_organization_name || null,
          site_id:
            employeeData.employment_info?.associated_organization_id || null,
          family_information: employeeData.family_information || null,
          employee_code: employeeData.employment_info?.employee_code || "",
        };
        acc[firstLetter].push(employeeDetails);
      }
      return acc;
    }, {});
    setEmpFilterData(groupedEmployees);
  }, [allEmployeesData]);

  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const [isSiteDropdownOpen, setIsSiteDropdownOpen] = useState(false);
  const siteDropdownRef = useRef(null);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleSiteClickOutside = (event) => {
      if (
        siteDropdownRef.current &&
        !siteDropdownRef.current.contains(event.target)
      ) {
        setIsSiteDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleSiteClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleSiteClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const alphabet = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`.split("");

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
    // setSelectedEmployee(null);
  };
  const handleAll = () => {
    setSelectedLetter(null);
    // setSelectedEmployee(null);
  };

  const filteredEmployees = selectedLetter
    ? empfilterData[selectedLetter] || []
    : employeesData;

  const [searchText, setSearchText] = useState("");
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);
  };
  const filteredTableData = tableData.filter((employee) => {
    const fullname =
      `${employee.employee.first_name} ${employee.employee.last_name}`.toLowerCase();
    const email = employee.employee.email_id.toLowerCase();
    const mobile = employee.employee.mobile
      ? employee.employee.mobile.toString()
      : "";
    const matchesLetter =
      !selectedLetter ||
      employee.employee.first_name.charAt(0).toUpperCase() === selectedLetter;
    return (
      fullname.includes(searchText) ||
      email.includes(searchText) ||
      mobile.includes(searchText)
    );
  });
  const handleDropdownChange = (e) => {
    // Convert to string to ensure type consistency
    setSelectedSite(e.target.value);
  };
  const handleDownload = async () => {
    try {
      // Fetch XML data based on condition
      const xmlData = !selectedSite
        ? await getFullUser(orgId)
        : await getSiteWiseUserDetails(selectedSite);

      console.log(xmlData);

      // Convert to string if necessary
      const xmlStr =
        typeof xmlData === "string"
          ? xmlData
          : new XMLSerializer().serializeToString(xmlData);

      let dataForExcel;

      // Try to convert XML to JSON
      try {
        const jsonStr = convert.xml2json(xmlStr, {
          compact: true,
          ignoreComment: true,
        });
        const jsonData = JSON.parse(jsonStr);
        dataForExcel =
          jsonData.users && jsonData.users.user
            ? Array.isArray(jsonData.users.user)
              ? jsonData.users.user
              : [jsonData.users.user]
            : [jsonData];
      } catch (conversionError) {
        console.error(
          "XML to JSON conversion failed, using raw XML",
          conversionError
        );
        // Fallback: Put the raw XML into a cell
        dataForExcel = [{ rawXml: xmlStr }];
      }

      // Create Excel workbook from data
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(dataForExcel),
        "Data"
      );

      // Write workbook to binary array and create a Blob
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });

      // Download the Excel file using the anchor method
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };
  function getRandomColor() {
    const colors = [
      "#8B0000",
      "#FF4500",
      "#2E8B57",
      "#4682B4",
      "#6A5ACD",
      "#D2691E",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  const randomColor = getRandomColor();
  const colors = [
    // "#8B0000",
    "#FF4500",
    "#2E8B57",
    "#4682B4",
    "#6A5ACD",
    "#D2691E",
  ];

  function getColorForEmployee(index) {
    return colors[index % colors.length];
  }
  // select mulitple site

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState("");

  const handleDeleteModal = (empId) => {
    setIsDeleteModalOpen(true);
    setEmployeeId(empId);
  };
  const handleDeleteEmployee = async () => {
    try {
      await deleteHRMSEmployee(employeeId);
      setIsDeleteModalOpen(false);
      fetchAllEmployees();
      toast.success("Employee deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const showEmployeeDetails = async (empId) => {
    setEmployeeId(empId);
    try {
      const res = await getUserDetails(empId);
      setSelectedEmployee(res);
    } catch (error) {
      console.log(error);
    }
  };

  // const
  const empId = getItemInLocalStorage("HRMS_EMPLOYEE_ID");
  const orgId = getItemInLocalStorage("HRMSORGID");
  const [roleAccess, setRoleAccess] = useState({});
  useEffect(() => {
    const fetchRoleAccess = async () => {
      try {
        const res = await getAdminAccess(orgId, empId);

        setRoleAccess(res[0]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRoleAccess();
  }, []);

  //Export Employee data

  const handleExport = async () => {
    const toastId = toast.loading("Download report please wait!!!");
    try {
      const res = await downloadAllEmployeeData(orgId);
      const blob = new Blob([res.data], { type: res.headers["content-type"] });

      const link = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      link.href = url;

      link.download = `All Employees.xlsx`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
      toast.dismiss(toastId);
      toast.success("Success");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to download report ❌");
      console.log(error);
    }
  };

  const [selectedUserStatus, setSelectedUserStatus] = useState("all");
  const [isUserStatusDropdownOpen, setIsUserStatusDropdownOpen] =
    useState(false);

  // const handleCheckboxChange = (employeeId, isActive) => {
  //   if (!isActive) return;
  //   console.log(employeeId);

  //   setSelectedEmployees((prev) => {
  //     if (prev.includes(employeeId)) {
  //       return prev.filter((id) => id !== employeeId);
  //     } else {
  //       return [...prev, employeeId];
  //     }
  //   });
  // };

  const handleCheckboxChange = (selectedRows) => {
    const selectedIds = selectedRows.map((row) => row.employee.id);
    setSelectedEmployees(selectedIds);
  };
  useEffect(() => {
    // Show update button if any employees are selected
    console.log(selectedEmployees);
    setShowUpdateButton(selectedEmployees?.length > 0);
  }, [selectedEmployees]);

  const [employeeStatus, setEmployeeStatus] = useState(true);

  const handleStatusUpdate = async () => {
    try {
      if (selectedEmployees.length === 0) return;
      const statusBool =
        employeeStatus === "true"
          ? true
          : employeeStatus === "false"
          ? false
          : employeeStatus;
      const payload = {
        employee_ids: selectedEmployees,
        status: statusBool,
      };

      await getStatusChanges(payload);
      setSelectedEmployees([]);
      setShowUpdateButton(false);
      // Refresh the employee data
      await fetchAllSitesEmployee();
      await fetchTableData();

      // Clear selection

      toast.success("Employee status updated successfully");
    } catch (error) {
      console.error("Error updating employee status:", error);
      toast.error("Failed to update employee status");
    }
  };
  const downloadExcelFile = () => {
    try {
      const link = document.createElement("a");
      link.href = "/sample/Employee_Templates.xlsx";
      link.download = "Employee_Templates.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Error downloading sample file");
      console.log("Download error", error);
    }
  };
  const handleImport = async () => {
    try {
      if (!selectedFile) {
        toast.error("Please select a file to upload");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      toast.loading("Importing employees...");
      const response = await CreateBulkEmployee(formData);
      toast.dismiss();

      if (response.success) {
        toast.success("Employees imported successfully!");
        setIsModalOpen12(false);
        fetchAllSitesEmployee();
      } else {
        toast.success(response.message || "Failed to import employees");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Error importing employees");
      console.error("Import error:", error);
    }
  };

  // new code
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [sites, setSites] = useState([]);
  const fetchAssociatedSites = async () => {
    try {
      const res = await getEmployeeAssociations(empId);
      console.log(res);

      if (Array.isArray(res) && res.length > 0) {
        const associatedSites = res[0].multiple_associated_info || [];

        const allSites = associatedSites.map((site) => ({
          value: site.id,
          label: site.site_name,
        }));

        const sitesWithAllOption = [
          { label: "All Sites", value: null },
          ...allSites,
        ];

        setSites(sitesWithAllOption);
      } else {
        setSites([{ label: "All Sites", value: null }]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAssociatedSites();
  }, []);

  const [filteredEmployeeData, setFilteredEmployeeData] = useState([]);
  const [totalFilteredPage, setTotalFilteredPages] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [status, setStatus] = useState("all");
  const fetchAllSitesEmployee = async () => {
    try {
      toast.loading("Loading data please wait!!");
      const res = await getHrmsFilteredEmployeeData(
        empId,
        pageNumber + 1,
        status,
        selectedSiteId,
        newSearchText
      );

      setFilteredEmployeeData(res.results);
      setTotalFilteredPages(res.total_pages);
      toast.dismiss();
      toast.success("Data loaded successfully!!");
    } catch (error) {
      console.log(error);
      toast.dismiss();
    }
  };

  const [newSearchText, setNewSearchText] = useState("");
  const [resetTrigger, setResetTrigger] = useState(false);

  useEffect(() => {
    fetchAllSitesEmployee();
  }, [pageNumber, selectedSiteId, status, resetTrigger]);

  const handleSearchClick = async () => {
    setPageNumber(0);
    try {
      toast.loading("Loading data please wait!!");
      const isIdSearch = /^\d+$/.test(newSearchText.trim());
      const nameSearch = isIdSearch ? "" : newSearchText.trim();
      const idSearch = isIdSearch ? newSearchText.trim() : "";
      const res = await getHrmsFilteredEmployeeData(
        empId,
        pageNumber + 1,
        status,
        selectedSiteId,
        nameSearch,
        idSearch
      );
      setFilteredEmployeeData(res.results);
      setTotalFilteredPages(res.total_pages);
      toast.dismiss();
      toast.success("Data loaded successfully!!");
    } catch (error) {
      console.error("Search error:", error);
      toast.dismiss();
    }
  };
  const handleResetFilter = async () => {
    setPageNumber(0);
    setNewSearchText("");
    setSelectedSiteId(null);
    try {
      toast.loading("Loading data please wait!!");
      const res = await getHrmsFilteredEmployeeData(
        empId,
        pageNumber + 1,
        "all",
        "",
        // "",
        ""
      );
      setFilteredEmployeeData(res.results);
      setTotalFilteredPages(res.total_pages);
      toast.dismiss();
      toast.success("Data Reset successfully!!");
    } catch (error) {
      console.error("Search error:", error);
      toast.dismiss();
    }
  };

  const [isActionOpen, setIsActionOpen] = useState(false);
  const actionRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionRef.current && !actionRef.current.contains(event.target)) {
        setIsActionOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="w-full h-full">
      <AdminHRMS />
      <div className="flex flex-col ">
        <div className="">
          <header
            style={{ background: themeColor }}
            className="text-white  py-2 ml-20"
          >
            <div className="flex justify-around items-center  gap-2 ">
              <div className="flex ">
                <h1 className=" pl-5 font-bold">Employee Directory</h1>
              </div>
              {/* Dropdown */}
              <div className="flex gap-2">
                <div className="flex items-center space-x-4">
                  {sites.length === 0 ? (
                    <p className="text-grey-500">No site associated</p>
                  ) : (
                    <Select
                      options={sites}
                      onChange={(selectedOption) => {
                        setSelectedSiteId(selectedOption?.value || null);
                      }}
                      noOptionsMessage={() => "No sites Available"}
                      placeholder="Select Site"
                      maxMenuHeight={500}
                      className="z-50 w-96 text-black"
                    />
                  )}
                </div>

                <div className="relative group flex gap-2">
                  <select
                    name=""
                    id=""
                    className="bg-white rounded-md p-2 px-4 border text-black w-full"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="all">All Employees</option>
                    <option value="active">Active Employees</option>
                    <option value="inactive">Inactive Employees</option>
                  </select>

                  {showUpdateButton && viewMode === "table" && (
                    <>
                      <select
                        onChange={(e) =>
                          setEmployeeStatus(e.target.value === "true")
                        }
                        className="rounded-md text-black w-full"
                      >
                        <option value="">Select Status</option>
                        {status === "inactive" && (
                          <option value="true">Activate</option>
                        )}
                        {status === "active" && (
                          <option value="false">Deactivate</option>
                        )}
                      </select>
                      <button
                        onClick={handleStatusUpdate}
                        className="bg-green-400 rounded-md p-2 "
                      >
                        Submit
                      </button>
                    </>
                  )}
                </div>
              </div>
              {/* </div>
              </div> */}

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search by Name"
                  className="border p-2 text-black rounded-md w-64"
                  onChange={(e) => setNewSearchText(e.target.value)}
                  value={newSearchText}
                />
                <button
                  onClick={handleSearchClick}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  <FaSearch />
                </button>
                <button
                  onClick={handleResetFilter}
                  className="bg-gray-100 text-black px-4 py-2 rounded-md"
                >
                  Reset
                </button>

                <div className="relative" ref={actionRef}>
                  <button
                    className="bg-[#4169e1] hover:bg-[#3455b7] text-white px-4 py-2 rounded-md flex items-center transition-colors duration-200"
                    onClick={() => setIsActionOpen(!isActionOpen)}
                  >
                    Actions
                    <FaChevronDown
                      className={`ml-2 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isActionOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50 animate-slideDown">
                      <div className="py-1">
                        {roleAccess?.can_add_employee && (
                          <>
                            <Link
                              to={"/admin/add-employee/basics"}
                              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center transition-colors duration-150 gap-2 "
                            >
                              <PiPlusCircle size={20} />
                              Add Employee
                            </Link>
                            <button
                              onClick={() => setIsModalOpen12(true)}
                              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors duration-150"
                            >
                              <FaUpload />
                              Import Employee
                            </button>
                          </>
                        )}
                        <button
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center transition-colors duration-150 gap-2"
                          onClick={handleExport}
                        >
                          <FaDownload />
                          Export
                        </button>
                        {viewMode === "card" ? (
                          <button
                            onClick={() => setViewMode("table")}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center transition-colors duration-150 gap-2"
                          >
                            <FaTable />
                            Table
                          </button>
                        ) : (
                          <button
                            onClick={() => setViewMode("card")}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center transition-colors duration-150 gap-2"
                          >
                            <FaIdCard />
                            Card
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <div className="relative inline-block text-left"></div>
                  <InviteEmployeeModal
                    isOpen={isModalOpen11}
                    onClose={() => setIsModalOpen11(false)}
                  />
                </div>
              </div>
            </div>
          </header>
        </div>

        <div className="flex h-screen">
          <div
            className={`p-4 flex flex-wrap overflow-y-auto mt-2 ml-20 ${
              viewMode === "table" ? "w-full" : "w-[80%]"
            } `}
          >
            {viewMode === "table" ? (
              <div className=" w-full">
                <Table
                  columns={employeeColumns}
                  data={filteredEmployeeData}
                  pagination={false}
                  selectableRow={status === "all" ? false : true}
                  onSelectedRows={handleCheckboxChange}
                />
                {filteredEmployeeData.length > 0 && (
                  <div
                    className={
                      "w-full flex justify-end border-t rounded-md p-2"
                    }
                  >
                    <Pagination
                      current={pageNumber + 1}
                      total={totalFilteredPage * 10}
                      pageSize={10}
                      onChange={(page) => {
                        setPageNumber(page - 1);
                      }}
                      showSizeChanger={false}
                    />
                  </div>
                )}
              </div>
            ) : (
              <>
                {viewMode === "card" && (
                  <>
                    <div className="flex flex-wrap">
                      {alphabet.map((letter) => (
                        <div key={letter} id={letter} className="w-full">
                          {(selectedLetter === null ||
                            selectedLetter === letter) && (
                            <>
                              {empfilterData[letter]?.length > 0 && (
                                <h2 className="text-xl font-mono font-semibold border-b-2 border-dashed my-4">
                                  <span
                                    style={{ background: themeColor }}
                                    className="p-2 rounded-md text-white px-4"
                                  >
                                    {letter}
                                  </span>
                                </h2>
                              )}
                              <div className="flex flex-wrap">
                                {empfilterData[letter]
                                  ?.filter((employee) => {
                                    const fullName =
                                      `${employee.first_name} ${employee.last_name}`.toLowerCase();
                                    const employeeCode =
                                      employee.employee_code?.toLowerCase() ||
                                      "";
                                    const mobileNumber = employee.mobile
                                      ? employee.mobile.toString()
                                      : "";
                                    const searchTextLower =
                                      searchText.toLowerCase();

                                    const matchesSearch =
                                      fullName.includes(searchTextLower) ||
                                      employeeCode.includes(searchTextLower) ||
                                      mobileNumber.includes(searchTextLower);

                                    const matchesSite = selectedSite
                                      ? String(employee.site_id) ===
                                        String(selectedSite)
                                      : true;
                                    const matchesStatus =
                                      selectedUserStatus === "all" ||
                                      (selectedUserStatus === "active" &&
                                        employee?.status === true) ||
                                      (selectedUserStatus === "inactive" &&
                                        employee?.status === false);

                                    return (
                                      matchesSearch &&
                                      matchesSite &&
                                      matchesStatus
                                    );
                                  })
                                  .map((employee, index) => (
                                    <div
                                      key={employee.id}
                                      style={{
                                        background: themeColor,
                                        color: "white",
                                      }}
                                      className={`${
                                        employeeId === employee.id
                                          ? "bg-gradient-to-r from-yellow-400 via-red-300 to-pink-400 border-2 border-pink-400"
                                          : "bg-gradient-to-r from-yellow-400 via-red-300 to-pink-400 border-2 border-white"
                                      } w-80 p-2 m-2 rounded-xl cursor-pointer`}
                                      onClick={(e) => {
                                        if (
                                          !e.target.closest(
                                            'input[type="checkbox"]'
                                          )
                                        ) {
                                          showEmployeeDetails(employee.id);
                                        }
                                      }}
                                    >
                                      <div className="flex items-center w-full">
                                        <div className="w-32">
                                          {employee?.profile_photo ? (
                                            <img
                                              src={
                                                hrmsDomain +
                                                employee?.profile_photo
                                              }
                                              alt="Profile"
                                              className="rounded-full h-20 w-20 border-4 border-white object-cover mr-4"
                                            />
                                          ) : (
                                            <div
                                              className="bg-gray-300 rounded-full text-xl border-white border-4 text-white h-20 w-20 flex items-center font-medium justify-center mr-4"
                                              style={{
                                                backgroundColor:
                                                  getColorForEmployee(index),
                                              }}
                                            >
                                              {employee.first_name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                              {employee.last_name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                            </div>
                                          )}
                                        </div>
                                        <div className="w-full">
                                          <h2 className="font-semibold">
                                            {employee.first_name}{" "}
                                            {employee.last_name}
                                          </h2>
                                          <div className="flex items-center gap-1 my-1">
                                            <p className="text-sm font-medium text-gray-200">
                                              {employee?.employment_info
                                                ?.employee_code
                                                ? employee?.employment_info
                                                    ?.employee_code
                                                : "not added"}
                                            </p>
                                            <div className="border border-gray-400 h-5" />
                                            <p className="text-sm font-medium text-gray-200">
                                              DOJ:{" "}
                                              {employee?.employment_info
                                                ?.joining_date
                                                ? employee?.employment_info
                                                    ?.joining_date
                                                : "not added"}
                                            </p>
                                          </div>
                                          <p className="text-sm font-medium text-gray-200">
                                            {employee?.employment_info
                                              ?.designation
                                              ? employee?.employment_info
                                                  ?.designation
                                              : "not added"}
                                          </p>
                                          <div className="flex items-center justify-between mt-2">
                                            <p
                                              className={`${
                                                employee?.status
                                                  ? "bg-green-400 text-white"
                                                  : "bg-red-400 text-white"
                                              } font-medium w-fit px-2 my-1 rounded-full`}
                                            >
                                              {employee?.status
                                                ? "Active"
                                                : "Inactive"}
                                            </p>
                                            {(roleAccess?.can_edit_employee ||
                                              roleAccess?.can_delete_employee) && (
                                              <div className="flex gap-2 items-center bg-white p-1 rounded-full px-2">
                                                {roleAccess?.can_edit_employee && (
                                                  <Link
                                                    className="text-blue-500 hover:text-blue-900"
                                                    to={`/hrms/employee-directory-Personal/${employee.id}`}
                                                  >
                                                    <BiEdit size={18} />
                                                  </Link>
                                                )}
                                                {roleAccess?.can_delete_employee && (
                                                  <button
                                                    onClick={() =>
                                                      handleDeleteModal(
                                                        employee.id
                                                      )
                                                    }
                                                    className="text-red-400 hover:text-red-800"
                                                  >
                                                    <FaTrash size={15} />
                                                  </button>
                                                )}
                                                {employee?.status && (
                                                  <div className="">
                                                    <input
                                                      type="checkbox"
                                                      checked={selectedEmployees.includes(
                                                        employee.id
                                                      )}
                                                      onChange={() =>
                                                        handleCheckboxChange(
                                                          employee.id,
                                                          employee?.status
                                                        )
                                                      }
                                                      onClick={(e) =>
                                                        e.stopPropagation()
                                                      }
                                                      className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Pagination controls */}
                    <PaginationControls />
                  </>
                )}
              </>
            )}
          </div>

          {/* Keep your alphabet navigation and details panel */}
          {viewMode !== "table" && (
            <>
              <div className="w-10 bg-white text-black p-4 max-h-fit overflow-y-auto hide-scrollbar mb-2">
                <div className="flex flex-col">
                  <button
                    onClick={handleAll}
                    className="p-1 text-sm font-medium text-gray-500"
                  >
                    All
                  </button>
                  {alphabet.map((letter) => (
                    <button
                      key={letter}
                      onClick={() => handleLetterClick(letter)}
                      className="p-1 text-sm font-medium text-gray-500"
                      title={letter}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-[25rem] max-h-[30rem] p-4 bg-gray-50 m-1 rounded-xl text-gray-600">
                <h1 className="text-2xl font-semibold mb-4">
                  Employee Details
                </h1>
                {Object.keys(selectedEmployee).length > 0 ? (
                  <div className="flex flex-col justify-between gap-10 h-96">
                    {/* Your existing details panel content */}
                    <div className="flex flex-col gap-2 border-b border-dashed border-gray-300">
                      <div className="flex items-center border-b border-dashed border-gray-300 p-1">
                        {selectedEmployee?.employee?.profile_photo ? (
                          <img
                            src={
                              hrmsDomain +
                              selectedEmployee?.employee?.profile_photo
                            }
                            alt="Profile"
                            className="rounded-full h-20 w-20 border-4 border-white object-cover mr-4"
                          />
                        ) : (
                          <div
                            className="bg-gray-300 rounded-full text-white h-16 w-16 flex items-center font-medium justify-center mr-4"
                            style={{
                              background: themeColor,
                            }}
                          >
                            {selectedEmployee?.employee?.first_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                            {selectedEmployee?.employee?.last_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                        )}
                        <div className="flex flex-col gap-1">
                          <h2 className="text-xl font-medium">
                            {selectedEmployee?.employee?.first_name}{" "}
                            {selectedEmployee?.employee?.last_name}
                          </h2>
                          <p className="text-sm font-medium">
                            {selectedEmployee?.employment_info?.designation}
                          </p>
                          <p className="text-sm font-medium">
                            Department :{" "}
                            {selectedEmployee?.employment_info?.department_name}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        <p className="grid grid-cols-2 items-center">
                          <span className="font-medium text-sm">Status :</span>{" "}
                          <span
                            className={`${
                              selectedEmployee?.employee?.status
                                ? "bg-green-400 text-white"
                                : "bg-red-400 text-white"
                            } rounded-full w-fit px-4`}
                          >
                            {selectedEmployee?.employee?.status
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </p>
                        <div className="grid grid-cols-2">
                          <span className="font-medium text-sm">
                            Branch Location :
                          </span>{" "}
                          <span className="font-medium text-xs">
                            <p>
                              {
                                selectedEmployee?.employment_info
                                  ?.branch_location_name
                              }
                            </p>
                          </span>
                        </div>
                        <p className="grid grid-cols-2">
                          <span className="font-medium text-sm">Phone : </span>{" "}
                          <span className="font-medium text-xs">
                            {selectedEmployee?.employee?.mobile}
                          </span>
                        </p>
                        <p className="grid grid-cols-2">
                          <span className="font-medium text-sm">Email :</span>{" "}
                          <span className="font-medium text-xs break-words">
                            {selectedEmployee?.employee?.email_id}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <Link
                        to={`/hrms/employee-directory-Personal/${selectedEmployee?.employee?.id}`}
                        className="border-2 rounded-full w-full text-green-400 border-green-400 mt-2 hover:bg-green-50 fov font-semibold py-1 px-4 flex items-center gap-2 justify-center"
                      >
                        <FaUserEdit /> View Profile
                      </Link>
                      <div className="flex justify-center gap-3">
                        {roleAccess?.can_initiate_separation && (
                          <>
                            {selectedEmployee?.employee?.status && (
                              <Link
                                to={`/hrms/separation/separate-application/resignation/${selectedEmployee?.employee?.id}`}
                                style={{ background: themeColor }}
                                className="bg-black text-white hover:bg-gray-700 w-full text-center py-2 px-4 rounded-full"
                              >
                                Separate
                              </Link>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-600 text-center">
                      Select employee from the list to get employee details.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-sm z-20">
          <div className="bg-white overflow-auto max-h-[70%]  md:w-auto w-96 p-4 px-8 flex flex-col rounded-md gap-5">
            <h2 className="font-medium border-b border-gray-400">
              Do you really want to delete this Employee?
            </h2>
            <div className="flex items-center justify-end gap-2">
              <button
                className="bg-green-400 text-white rounded-full p-1 px-4 font-medium"
                onClick={handleDeleteEmployee}
              >
                Confirm
              </button>
              <button
                className="bg-red-400 text-white rounded-full p-1 px-4 font-medium"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalOpen12 && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
          <div className="bg-white text-black p-5 rounded-md shadow-md w-1/3">
            <h2 className="text-xl font-semibold mb-4">Import Employees</h2>

            <div className="mb-4">
              <p className="font-bold mb-2">Step 1: Download sample template</p>
              <p className="text-sm mb-2">
                Download the sample template to ensure proper formatting.
              </p>
              <button
                onClick={downloadExcelFile}
                style={{ background: themeColor }}
                className="font-semibold py-2 px-4 rounded text-white mt-2"
              >
                Download Sample Template
              </button>
            </div>

            <div className="mb-4">
              <p className="font-bold mb-2">Step 2: Upload your file</p>
              <p className="text-sm mb-2">
                After filling the template, upload it here (Excel files only).
              </p>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
              />
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected file: {selectedFile.name}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsModalOpen12(false)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                style={{ background: themeColor }}
                className="font-semibold py-2 px-4 rounded text-white"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeDirectory;