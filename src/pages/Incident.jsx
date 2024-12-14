import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import Table from "../components/table/Table";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { PiPlusCircle } from "react-icons/pi";
import { useSelector } from "react-redux";
import { getIncidents } from "../api";
import { dateFormatSTD } from "../utils/dateUtils";

const Incidents = () => {
  const column = [
    {
      name: "view",

      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/incidents-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
          <Link to={`/admin/edit-incidents`}>
            <BiEdit size={15} />
          </Link>
        </div>
      ),
    },

    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Description", selector: (row) => row.Description, sortable: true },
    // { name: "Site", selector: (row) => row.Site, sortable: true },
    // { name: "Region", selector: (row) => row.Region, sortable: true },
    // { name: "Tower", selector: (row) => row.Tower, sortable: true },
    {
      name: "Incident Time",
      selector: (row) => dateFormatSTD(row.time_and_date),
      sortable: true,
    },
    { name: "Level", selector: (row) => row.Level, sortable: true },
    { name: "Category", selector: (row) => row.Category, sortable: true },
    {
      name: "Sub Category",
      selector: (row) => row.SubCategory,
      sortable: true,
    },
    {
      name: "Support Required",
      selector: (row) => row.SupportRequired,
      sortable: true,
    },
    { name: "Assigned To", selector: (row) => row.AssignedTo, sortable: true },
    {
      name: "Support Required",
      selector: (row) => row.SupportRequired,
      sortable: true,
    },
    {
      name: "CurrentStatus",
      selector: (row) => row.CurrentStatus,
      sortable: true,
    },
  ];

  const data = [
    {
      id: 1,
      ID: 1079,
      Description: "Accident near Main Gate",
      Site: "Time square",
      Region: "",
      IncidentTime: "18/03/2024 3:12 PM",
      Level: "L1",
      Category: "Health and Safety",
      SubCategory: "Injury / Illness",
      SupportRequired: "Yes ",
      AssignedTo: "",
      CurrentStatus: "Pending",
      action: <BsEye />,
    },
  ];
  const themeColor = useSelector((state) => state.theme.color);
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const fetchIncidents = async () => {
    try {
      const res = await getIncidents();
      setIncidents(res.data);
      setFilteredIncidents(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchIncidents();
  }, []);
  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex m-2 flex-col overflow-hidden">
        <div className="flex flex-col sm:flex-row md:justify-between my-2 gap-2 ">
          <input
            type="text"
            placeholder="Search"
            className="border p-2 w-full border-gray-300 rounded-lg"
          />
          <Link
            to="/admin/add-incidents"
            style={{ background: themeColor }}
            className=" font-semibold text-white px-4 p-1 flex gap-2 items-center rounded-md"
          >
            <PiPlusCircle /> Add
          </Link>
        </div>
        <div>
          <Table
            columns={column}
            data={filteredIncidents}
            isPagination={true}
          />
        </div>
      </div>
    </section>
  );
};

export default Incidents;
