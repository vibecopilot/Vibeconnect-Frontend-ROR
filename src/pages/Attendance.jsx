import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import DataTable from "react-data-table-component";
import { ImEye } from "react-icons/im";
import { Link } from "react-router-dom";
import Modal from "../containers/modals/Modal";
import { getAttendance } from "../api";
import Table from "../components/table/Table";
import { useSelector } from "react-redux";
import { getItemInLocalStorage } from "../utils/localStorage"

import * as XLSX from "xlsx";
const Attendance = () => {
  const [modal, setModal] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);

  const orgId = getItemInLocalStorage("HRMSORGID");

useEffect(() => {
  const fetchAttendance = async () => {
    try {
      let allUsers = [];
      let page = 1;
      while (true) {
        const response = await getAttendance(orgId, page);
        allUsers.push(...response.data.results);
        if (!response.data.next) break;
        page++;
      }
      const formattedData = allUsers.flatMap((user) =>
        user.attendance_records.map((record) => ({
          name: `${user.first_name} ${user.last_name}`,
          first_name: user.first_name, // for table
          date: record.date,
          status: record.is_present ? "Present" : "Absent",
          // fallback since API doesn't provide these
          punched_in_at: null,
          punched_out_at: null,
        }))
      );
      setAttendanceData(formattedData);
    } catch (error) {
      console.log(error);
    }
  };

  if (orgId) {
    fetchAttendance();
  }
}, [orgId]);

  const timeFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };
  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const TotalHours = (punchedIn, punchedOut) => {
    const punchedInDate = new Date(punchedIn);
    const punchedOutDate = new Date(punchedOut);
    const diffMs = punchedOutDate - punchedInDate;
    const diffHrs = diffMs / (1000 * 60 * 60);
    return diffHrs.toFixed(2);
  };
  const column = [
    // {
    //   name: "Actions",

    //   selector: (row) => row.action,
    // },

{
  name: "Name",
  selector: (row) => row.name,
  sortable: true,
},
  {
    name: "Date",
    selector: (row) => row.date,
    sortable: true,
  },
  {
    name: "Status",
    selector: (row) => row.status,
    sortable: true,
  },
   {
  name: "Punch In",
  selector: (row) =>
    row.punched_in_at ? timeFormat(row.punched_in_at) : "-",
},
{
  name: "Punch Out",
  selector: (row) =>
    row.punched_out_at ? timeFormat(row.punched_out_at) : "-",
},
{
  name: "Total Hours Worked",
  selector: (row) =>
    row.punched_in_at && row.punched_out_at
      ? TotalHours(row.punched_in_at, row.punched_out_at)
      : "-",
},
  ];

  document.title = `Attendance - Vibe Connect`;
  const themeColor = useSelector((state) => state.theme.color);

  const exportAllToExcel = async () => {
   const mappedData = attendanceData.map((attend) => ({
  Name: attend.name,
  Date: dateFormat(attend.date),
  Status: attend.status,
  "Punch In": attend.punched_in_at
    ? timeFormat(attend.punched_in_at)
    : "-",
  "Punch Out": attend.punched_out_at
    ? timeFormat(attend.punched_out_at)
    : "-",
  "Total Hours Worked":
    attend.punched_in_at && attend.punched_out_at
      ? TotalHours(attend.punched_in_at, attend.punched_out_at)
      : "-",
}));
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileName = "attendance_data.xlsx";
    const ws = XLSX.utils.json_to_sheet(mappedData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
  };
  return (
    <section className="flex ">
      <Navbar />
      <div className="w-full flex md:mx-3 flex-col overflow-hidden">
        {/* <div className="flex  justify-start gap-4 my-5  ">
          <div className="shadow-xl rounded-full border-4 border-gray-400 w-52  px-6 flex flex-col items-center">
            <p className="font-semibold text-lg">Total Employees</p>
            <p className="text-center font-semibold text-lg ">{attendanceData.length}</p>
          </div>
          <div className="shadow-xl rounded-full border-4 border-green-400 w-52  px-6 flex flex-col items-center">
            <p className="font-semibold text-lg">Present</p>
            <p className="text-center font-semibold text-lg ">0</p>
          </div>
          <div className="shadow-xl rounded-full border-4 border-red-400 w-52  px-6 flex flex-col items-center">
            <p className="font-semibold text-lg">Absent</p>
            <p className="text-center font-semibold text-lg ">0</p>
          </div>

          <div className="shadow-xl rounded-full border-4 border-orange-400 w-52  px-6 flex flex-col items-center">
            <p className="font-semibold text-lg">On Leave</p>
            <p className="text-center font-semibold text-lg ">0</p>
          </div>
        </div> */}
        <div className=" flex mx-3 flex-col my-5 ">
          <div className="flex md:flex-row flex-col justify-between items-center">
            <input
              type="text"
              placeholder="Search By Name"
              className="border-2 p-2 md:w-96 border-gray-300 rounded-lg"
            />
            <button
              className="bg-black w-20 rounded-lg text-white p-2 my-5"
              // onClick={() => setModal(true)}
              onClick={exportAllToExcel}
              style={{ background: themeColor }}
            >
              Export
            </button>
          </div>

          <Table columns={column} data={attendanceData} />
        </div>
      </div>
      {/* {modal && <Modal onclose={() => setModal(false)} />} */}
    </section>
  );
};

export default Attendance;
