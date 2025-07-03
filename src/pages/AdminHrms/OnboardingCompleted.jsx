import React, { useEffect, useState } from "react";

import Table from "../../components/table/Table";
import { Link } from "react-router-dom";
import { PiPlusCircle } from "react-icons/pi";
import { useSelector } from "react-redux";
import { BsEye } from "react-icons/bs";

import { getItemInLocalStorage } from "../../utils/localStorage";
import { getAdminAccess, getApprovedEmployees } from "../../api";
import toast from "react-hot-toast";
import { dateFormatSTD } from "../../utils/dateUtils";

const OnBoardingCompleted = () => {
  const [employees, setEmployees] = useState([]); // Original data
  const [filteredEmployees, setFilteredEmployees] = useState([]); // Filtered data for the table

  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const approverID = getItemInLocalStorage("APPROVERID");

  // Fetch all employees
  const fetchAllEmployees = async () => {
    try {
      const res = await getApprovedEmployees(approverID);
      const sortedEmployees = res.sort(
        (a, b) => new Date(b.created_date) - new Date(a.created_date)
      );
      setEmployees(sortedEmployees);
      setFilteredEmployees(sortedEmployees);
      console.log(filteredEmployees); // Initialize filtered data
    } catch (error) {
      console.log(error);
    }
  };

  // Handle search functionality
  // const handleSearch = (event) => {
  //   const searchValue = event.target.value.toLowerCase();
  //   setSearchText(searchValue);

  //   if (searchValue.trim() === "") {
  //     // If search input is empty, reset to all employees
  //     setFilteredEmployees(employees);
  //   } else {
  //     // Filter employees based on search input
  //     const filteredResults = employees.filter((employee) =>
  //       employee.employee_name.toLowerCase().includes(searchValue)
  //     );
  //     setFilteredEmployees(filteredResults);
  //   }
  // };

  const [searchText, setSearchText] = useState("");
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);

    if (searchValue.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter((item) =>
        item.employee_name?.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  };

  useEffect(() => {
    fetchAllEmployees();
  }, []);

  const columns = [
    {
      name: "View",
      selector: (row) => (
        <div>
          <Link to={`/admin/employee-directory-Employment/${row.record_id}`}>
            <BsEye />
          </Link>
        </div>
      ),
    },
    {
      name: "Employee Id",
      selector: (row) => row.record_id,
      sortable: true,
    },
    {
      name: "Employee Name",
      selector: (row) => row.employee_name,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.approval_status,
      sortable: true,
    },
    {
      name: "Registered on",
      selector: (row) => dateFormatSTD(row.created_date),
      sortable: true,
    },
  ];

  const themeColor = useSelector((state) => state.theme.color);

  const employeeId = getItemInLocalStorage("HRMS_EMPLOYEE_ID");
  const orgId = getItemInLocalStorage("HRMSORGID");
  const [roleAccess, setRoleAccess] = useState({});

  useEffect(() => {
    const fetchRoleAccess = async () => {
      try {
        const res = await getAdminAccess(orgId, employeeId);
        setRoleAccess(res[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoleAccess();
  }, []);

  return (
    <section className="flex">
      <div className="w-full flex flex-col overflow-hidden">
        <div className="flex justify-between my-2">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by name"
            className="border border-gray-400 w-[30rem] placeholder:text-sm rounded-lg p-2"
            value={searchText}
            onChange={handleSearch} // Call handleSearch on input change
          />
          {roleAccess && roleAccess.can_add_employee && (
            <div className="flex justify-end">
              <Link
                to={"/admin/add-employee/basics"}
                style={{ background: themeColor }}
                className="border-2 font-semibold w-full hover:bg-black hover:text-white duration-150 transition-all border-white p-2 rounded-md text-white cursor-pointer text-center flex items-center gap-2 justify-center"
              >
                <PiPlusCircle size={20} />
                Add Employee
              </Link>
            </div>
          )}
        </div>
        <Table columns={columns} data={filteredEmployees} isPagination={true} />
      </div>
    </section>
  );
};

export default OnBoardingCompleted;