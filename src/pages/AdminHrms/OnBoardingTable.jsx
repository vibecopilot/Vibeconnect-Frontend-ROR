import React, { useEffect, useState } from "react";

import Table from "../../components/table/Table";
import { Link } from "react-router-dom";
import { PiPlusCircle } from "react-icons/pi";
import { FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { BsEye } from "react-icons/bs";
import {
  getAdminAccess,
  getApprovalNotifications,
  getEmployeeDetails,
  postApproveOrRejectEmployee,
} from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { dateFormat, dateFormatSTD } from "../../utils/dateUtils";
import OnboardingEmployeeDetail from "./Onbording/OnboardingEmployeeDetail";
import { SearchSharp } from "react-ionicons";

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

  const handleGrantApproval = async (notiId, decision) => {
    setGrantId(notiId);
    try {
      const payload = {
        approver_id: approverID,
        action: decision,
      };
      await postApproveOrRejectEmployee(notiId, payload);
      fetchApprovalNotification();
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      name: "View",
      selector: (row) => (
        <div>
          <button
            onClick={() => handleEmployeeDetailsModal(row.record_id, row.id)}
          >
            <BsEye />
          </button>
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
          {roleAccess?.can_approve_reject_onboarding_request && (
            <>
              <button
                className="bg-green-400 text-white rounded-full p-1 px-4"
                onClick={() =>
                  handleEmployeeDetailsModal(row.record_id, row.id)
                }
              >
                <FaCheck />
              </button>
              <button
                className="bg-red-400 text-white rounded-full p-1 px-4"
                onClick={() => handleGrantApproval(row.id, "reject")}
              >
                <MdClose size={20} />
              </button>
            </>
          )}
        </div>
      ),
      sortable: true,
    },
  ];

  const themeColor = useSelector((state) => state.theme.color);
  const [openDetailsModal, setDetailsModal] = useState(false);
  const [emplId, setEmplId] = useState("");
  const [grantId, setGrantId] = useState("");
  const handleEmployeeDetailsModal = async (id, grant) => {
    setGrantId(grant);
    setEmplId(id);
    setDetailsModal(true);
    // fetchEmployeeDetails(id);
  };

  const empId = getItemInLocalStorage("APPROVERID");
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
  const [searchText, setSearchText] = useState("");
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);

    if (searchValue.trim() === "") {
      setFilteredNotifications(notifications);
    } else {
      const filtered = notifications.filter((item) =>
        item.employee_name?.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredNotifications(filtered);
    }
  };

  return (
    <section className="flex">
      <div className=" w-full flex  flex-col overflow-hidden">
        <div className=" flex justify-between my-2">
          <input
            type="text"
            placeholder="Search by name "
            className="border border-gray-400 w-[30rem] placeholder:text-sm rounded-lg p-2"
            value={searchText}
            name="searchText"
            onChange={handleSearch}
          />
          {roleAccess?.can_add_employee && (
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
        <Table
          columns={columns}
          data={filteredNotifications}
          isPagination={true}
        />
      </div>
      {openDetailsModal && (
        <OnboardingEmployeeDetail
          setDetailsModal={() => setDetailsModal(false)}
          empId={emplId}
          grantId={grantId}
          fetchApprovalNotification={fetchApprovalNotification}
        />
      )}
    </section>
  );
};

export default OnBoardingTable;