import React, { useEffect, useState } from "react";

import Table from "../../components/table/Table";
import { Link } from "react-router-dom";
import { PiPlusCircle } from "react-icons/pi";
import { useSelector } from "react-redux";
import { BsEye } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { getMyHRMSEmployees, getMyHRMSEmployeesAllData } from "../../api";
import toast from "react-hot-toast";
import { dateFormatSTD } from "../../utils/dateUtils";

const OnBoardingCompleted = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const fetchAllEmployees = async () => {
    try {
      toast.loading("Loading employees Please wait!");
      const res = await getMyHRMSEmployees(hrmsOrgId);
      const sortedEmployees = res.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      setEmployees(sortedEmployees);
      setFilteredEmployees(sortedEmployees);
      toast.dismiss();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
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
          <Link to={"/admin/edit-employee/basics"}>
            <BsEye />
          </Link>
        </div>
      ),
    },
    {
      name: "Employee Id",
      selector: (row) => row.id,
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

    // {
    //   name: "Action",
    //   selector: (row) => (
    //     <div className="flex gap-2">
    //       <button className="bg-green-400 text-white rounded-full p-1 px-4" onClick={()=>handleGrantApproval(row.id, "approve")}>
    //         <FaCheck />
    //       </button>
    //       <button className="bg-red-400 text-white rounded-full p-1 px-4" onClick={()=>handleGrantApproval(row.id, "reject")}>
    //         <MdClose size={20} />
    //       </button>
    //     </div>
    //   ),
    //   sortable: true,
    // },
  ];

  const data = [
    {
      Name: "person 1",
      Location: "Mittu Panda",
      City: "Completed",
      State: "Completed",
      Label: "5/5/2024",
      Country: "Activated",
      Leave_Days: "0 out of 0 letters",
    },
  ];
  const themeColor = useSelector((state) => state.theme.color);

  return (
    <section className="flex">
      <div className=" w-full flex flex-col overflow-hidden">
        <div className=" flex justify-between my-2">
          <input
            type="text"
            placeholder="Search by name "
            className="border border-gray-400 w-[30rem] placeholder:text-sm rounded-lg p-2"
            //   value={searchText}
            //   onChange={handleSearch}
          />
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
        </div>
        <Table columns={columns} data={filteredEmployees} isPagination={true} />
      </div>
    </section>
  );
};

export default OnBoardingCompleted;
