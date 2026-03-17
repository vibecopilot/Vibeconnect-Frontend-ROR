import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { PiPlusCircle } from "react-icons/pi";
import { useSelector } from "react-redux";
import { getIncidents } from "../api";
import { dateFormatSTD } from "../utils/dateUtils";

const Incidents = () => {
  const themeColor = useSelector((state) => state.theme.color);

  const [incidents, setIncidents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const perPage = 10;

  const columns = [
    {
      name: "View",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/incidents-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
          <Link to={`/admin/edit-incidents/${row.id}`}>
            <BiEdit size={15} />
          </Link>
        </div>
      ),
    },
    { name: "ID", selector: (row) => row.id, sortable: true },
    {
      name: "Building",
      selector: (row) => row.building_name,
      sortable: true,
    },
    {
      name: "Incident Time",
      selector: (row) => dateFormatSTD(row.time_and_date),
      sortable: true,
    },
    {
      name: "Level",
      selector: (row) => row.incident_level,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.primary_incident_category,
      sortable: true,
    },
    {
      name: "Sub Category",
      selector: (row) => row.primary_incident_sub_category,
      sortable: true,
    },
    {
      name: "Support Required",
      selector: (row) => (row.support_required ? "Yes" : "No"),
      sortable: true,
    },
    {
      name: "Current Status",
      selector: (row) => row.status,
      sortable: true,
    },
  ];

  const fetchIncidents = async (pageNo = 1) => {
    try {
      const res = await getIncidents(pageNo);
      setIncidents(res.data?.incidents || []);
      setTotalRecords(res.data?.total_count || 0);
    } catch (error) {
      console.error("Failed to fetch incidents:", error);
    }
  };

  useEffect(() => {
    fetchIncidents(page);
  }, [page]);

  document.title = "VC - Incidents";

  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex m-2 flex-col overflow-hidden">
        <div className="flex flex-col sm:flex-row md:justify-between my-2 gap-2">
          <input
            type="text"
            placeholder="Search"
            className="border p-2 w-full border-gray-300 rounded-lg"
            disabled
          />

          <Link
            to="/admin/add-incidents"
            style={{ background: themeColor }}
            className="font-semibold text-white px-4 p-2 flex gap-2 items-center rounded-md"
          >
            <PiPlusCircle /> Add
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={incidents}
          pagination
          paginationServer
          paginationTotalRows={totalRecords}
          paginationPerPage={perPage}
          onChangePage={(page) => setPage(page)}
          highlightOnHover
          responsive
           persistTableHead
        />
      </div>
    </section>
  );
};

export default Incidents;
