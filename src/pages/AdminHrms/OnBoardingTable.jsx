import React, { useEffect, useState } from "react";

import Table from "../../components/table/Table";
import { Link } from "react-router-dom";
import { PiPlusCircle } from "react-icons/pi";
import { FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { BsEye } from "react-icons/bs";
import {
  getApprovalNotifications,
  postApproveOrRejectEmployee,
} from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { dateFormat, dateFormatSTD } from "../../utils/dateUtils";

const OnBoardingTable = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const approverID = getItemInLocalStorage("APPROVERID");
  const fetchApprovalNotification = async () => {
    try {
      const res = await getApprovalNotifications(approverID);
      setNotifications(res.data);
      setFilteredNotifications(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchApprovalNotification();
  }, []);

  const handleGrantApproval = async (notiId,decision) => {
    try {
      const payload = {
        approver_id: approverID,
        action: decision,
      };
      await postApproveOrRejectEmployee(notiId,payload);
      fetchApprovalNotification()
    } catch (error) {
      console.log(error);
    }
  };

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

    {
      name: "Action",
      selector: (row) => (
        <div className="flex gap-2">
          <button className="bg-green-400 text-white rounded-full p-1 px-4" onClick={()=>handleGrantApproval(row.id, "approve")}>
            <FaCheck />
          </button>
          <button className="bg-red-400 text-white rounded-full p-1 px-4" onClick={()=>handleGrantApproval(row.id, "reject")}>
            <MdClose size={20} />
          </button>
        </div>
      ),
      sortable: true,
    },
  ];

  const themeColor = useSelector((state) => state.theme.color);
  return (
    <section className="flex">
      <div className=" w-full flex  flex-col overflow-hidden">
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
        <Table
          columns={columns}
          data={filteredNotifications}
          isPagination={true}
        />
      </div>
    </section>
  );
};

export default OnBoardingTable;
