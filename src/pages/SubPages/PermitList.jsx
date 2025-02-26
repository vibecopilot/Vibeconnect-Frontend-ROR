import React, { useEffect, useState } from "react";
//import Navbar from "../components/Navbar";
import Table from "../../components/table/Table";
import { ImEye } from "react-icons/im";
import { useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { PiPlusCircle } from "react-icons/pi";

import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import { getPermits } from "../../api";
import { dateFormat, formatTime } from "../../utils/dateUtils";
//import Modal from "../containers/modals/Modal";
const PermitList = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const column = [
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/permit-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
          <Link to={`/admin/edit-permit/${row.id}`}>
            <BiEdit size={15} />
          </Link>
        </div>
      ),
    },

    { name: "ID", selector: (row) => row.id, sortable: true },
    // { name: "Ref No.", selector: (row) => row.ref, sortable: true },
    {
      name: "Permit Type",
      selector: (row) => row.permit_type || "No Type",
      sortable: true,
    },
    { name: "Permit For", selector: (row) => row.permit_for, sortable: true },

    { name: "Created By", selector: (row) => row.name, sortable: true },
    // { name: "Designation", selector: (row) => row.desg, sortable: true },
    { name: "Status", selector: (row) => row.permit_status, sortable: true },
    {
      name: "Building Name",
      selector: (row) => row.building_name,
      sortable: true,
    },
    { name: "Floor Name", selector: (row) => row.floor_name, sortable: true },
    { name: "Unit Name", selector: (row) => row.unit_name, sortable: true },

    {
      name: "Created Date",
      selector: (row) => dateFormat(row.created_at), // Formats date and time
      sortable: true,
    },
    {
      name: "Created On",
      selector: (row) => formatTime(row.created_at), // Formats date and time
      sortable: true,
    },

    {
      name: "Permit Expiry Date",
      selector: (row) =>
        row.expiry_date_and_time ? dateFormat(row.expiry_date_and_time) : " ", // Show a blank space if the value is null or undefined
      sortable: true,
    },
    {
      name: "Permit Expiry Time",
      selector: (row) =>
        row.expiry_date_and_time ? formatTime(row.expiry_date_and_time) : " ", // Show a blank space if the value is null or undefined
      sortable: true,
    },
  ];

  document.title = `Permit - Vibe Connect`;
  const [permits, setPermits] = useState([]);
  const [filteredPermits, setFilteredPermits] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [permitStats, setPermitStats] = useState({
    total_approved: 0,
    total_closed: 0,
    total_drafts: 0,
    total_extended: 0,
    total_open: 0,
    total_permits: 0,
    total_rejected: 0,
  });
  const fetchPermits = async () => {
    try {
      const res = await getPermits();
      const sortedInvData = res.data.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      console.log("sortedInvData:", sortedInvData);
      setPermits(sortedInvData);
      setFilteredPermits(sortedInvData);
      setPermitStats({
        total_approved: sortedInvData[0].total_approved,
        total_closed: sortedInvData[0].total_closed,
        total_drafts: sortedInvData[0].total_drafts,
        total_extended: sortedInvData[0].total_extended,
        total_open: sortedInvData[0].total_open,
        total_permits: sortedInvData[0].total_permits,
        total_rejected: sortedInvData[0].total_rejected,
      });

      console.log("sortedInvData:", sortedInvData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    console.log(searchValue);
    setSearchText(searchValue);
    console.log(permits);

    const filteredResults = permits.filter((item) => {
      // Convert item.id to string (or use empty string if null/undefined)
      const idStr = item.id ? item.id.toString() : "";
      // Use empty string if building_name is null or undefined
      const permit_for = item.permit_for || "";
      return (
        idStr.toLowerCase().includes(searchValue.toLowerCase()) ||
        permit_for.toLowerCase().includes(searchValue.toLowerCase())
      );
    });
    setFilteredPermits(filteredResults);
  };

  useEffect(() => {
    console.log("permitStats:", permitStats);
    fetchPermits();
  }, []);
  return (
    <section className="flex ">
      {/* <Navbar /> */}
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="flex flex-col flex-wrap flex-shrink md:flex-row justify-start gap-2 my-2  ">
          <div className="shadow-xl rounded-full border-4 border-gray-400 w-52   flex flex-col items-center">
            <p className="font-semibold ">Total Permits</p>
            <p className="text-center font-semibold ">
              {permitStats.total_permits}
            </p>
          </div>
          <div className="shadow-xl rounded-full border-4 border-green-400 w-52  px-6 flex flex-col items-center">
            <p className="font-semibold ">Draft Permits</p>
            <p className="text-center font-semibold  ">{permitStats.total_drafts}</p>
          </div>
          <div className="shadow-xl rounded-full border-4 border-red-400 w-52  px-6 flex flex-col items-center">
            <p className="font-semibold ">Open Permits</p>
            <p className="text-center font-semibold  ">{permitStats.total_open}</p>
          </div>

          <div className="shadow-xl rounded-full border-4 border-orange-400 w-52  px-6 flex flex-col items-center">
            <p className="font-semibold">Approved Permits</p>
            <p className="text-center font-semibold  ">{permitStats.total_approved}</p>
          </div>
          <div className="shadow-xl rounded-full border-4 border-indigo-400 w-52  px-6 flex flex-col items-center">
            <p className="font-semibold">Rejected Permits</p>
            <p className="text-center font-semibold  ">{permitStats.total_rejected}</p>
          </div>
          <div className="shadow-xl rounded-full border-4 border-blue-400 w-52  px-6 flex flex-col items-center">
            <p className="font-semibold ">Extended Permits</p>
            <p className="text-center font-semibold ">{permitStats.total_extended}</p>
          </div>
          <div className="shadow-xl rounded-full border-4 border-yellow-400 w-52  px-6 flex flex-col items-center">
            <p className="font-semibold ">Closed Permits</p>
            <p className="text-center font-semibold ">{permitStats.total_closed}</p>
          </div>
        </div>
        <div className=" flex my-2 flex-col">
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Search by Permit for"
              value={searchText}
              onChange={handleSearch}
              className="border p-2 w-96 border-gray-300 rounded-lg"
            />
            <Link
              to={"/admin/permit/add-new-permit"}
              className="border-2 font-semibold   transition-all p-2 rounded-md text-white cursor-pointer text-center flex items-center gap-2 justify-center"
              style={{ background: themeColor }}
            >
              <PiPlusCircle size={20} />
              Add
            </Link>
          </div>
        </div>
        <Table columns={column} data={filteredPermits} />
      </div>
    </section>
  );
};

export default PermitList;
