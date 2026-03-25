import React, { useEffect, useState } from "react";
import {
  getServicesRoutineList,
  getSoftServiceStatus,
} from "../../api";
import Table from "../../components/table/Table";
import { Link } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import Services from "../Services";
import Navbar from "../../components/Navbar";
import * as XLSX from "xlsx";
import { DNA } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { Pagination } from "antd";

const ServicesTask = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [filteredRoutineData, setFilteredRoutineData] = useState([]);
  const [routines, setRoutines] = useState([]);

  const [searchRoutineText, setSearchRoutineText] = useState("");

  const [pageNo, setPageNo] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");

  const themeColor = useSelector((state) => state.theme.color);

  /* ================= DATE FORMAT ================= */
  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* ================= TABLE ================= */
  const routineColumn = [
    {
      name: "Action",
      cell: (row) => (
        <Link to={`/service/checklist/${row.soft_service_id}/${row.id}`}>
          <BsEye size={15} />
        </Link>
      ),
    },
    {
      name: "Service Name",
      selector: (row) => row.soft_service_name,
      sortable: true,
    },
    {
      name: "Checklist Name",
      selector: (row) => row.checklist_name,
      sortable: true,
      width: "400px",
    },
    {
      name: "Start Date",
      selector: (row) => dateFormat(row.start_time),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
    },
    {
      name: "Assigned To",
      selector: (row) => row.assigned_to_name,
    },
  ];

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    try {
      let response;

      if (selectedStatus === "all") {
        response = await getServicesRoutineList(
          pageNo,
          perPage,
          startDate,
          endDate
        );
      } else {
        response = await getSoftServiceStatus(
          selectedStatus,
          startDate,
          endDate
        );
      }

      const data = response.data.activities.filter(
        (item) => item.soft_service_name
      );

      setFilteredRoutineData(data);
      setRoutines(data);
      setTotal(response.data.total_pages || 0);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageNo, perPage, selectedStatus, startDate, endDate]);

  /* ================= STATUS FILTER ================= */
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setPageNo(1);
  };

  /* ================= SEARCH ================= */
  const handleRoutineSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchRoutineText(value);

    if (!value) {
      setFilteredRoutineData(routines);
      return;
    }

    const filtered = routines.filter((item) =>
      [
        item.soft_service_name,
        item.checklist_name,
        item.status,
        item.assigned_to_name,
      ]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );

    setFilteredRoutineData(filtered);
  };

  /* ================= DATE FILTER ================= */
  const handleApplyDateFilter = () => {
    setPageNo(1);
    fetchData();
  };

  const handleClearDateFilter = () => {
    setStartDate("");
    setEndDate("");
    setPageNo(1);
  };

  /* ================= EXPORT ================= */
  const exportToExcel = () => {
    const exportData = filteredRoutineData.map((row) => ({
      "Service Name": row.soft_service_name,
      "Checklist Name": row.checklist_name,
      "Start Date": dateFormat(row.start_time),
      Status: row.status,
      "Assigned To": row.assigned_to_name,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const blob = new Blob([buffer]);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Service_Task.xlsx";
    link.click();
  };

  /* ================= PAGINATION ================= */
  const handlePageChange = (page, pageSize) => {
    setPageNo(page);
    setPerPage(pageSize);
  };

  return (
    <section className="flex">
      <Navbar />

      <div className="p-4 w-full mx-3 flex flex-col">
        <Services />

        {/* ================= STATUS CARDS ================= */}
        <div className="grid grid-cols-4 gap-3 my-4">
          {["all", "pending", "complete", "overdue"].map((status) => (
            <div
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`cursor-pointer p-4 rounded-lg text-center border ${
                selectedStatus === status
                  ? "border-blue-500 bg-blue-100"
                  : "border-gray-300"
              }`}
            >
              <p className="capitalize">{status}</p>
            </div>
          ))}
        </div>

        {/* ================= FILTER ================= */}
        <div className="flex gap-2 my-3">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded"
          />

          <button
            onClick={handleApplyDateFilter}
            style={{ background: themeColor }}
            className="text-white px-4 rounded"
          >
            Apply
          </button>

          <button
            onClick={handleClearDateFilter}
            className="bg-red-500 text-white px-4 rounded"
          >
            Clear
          </button>

          <button
            onClick={exportToExcel}
            className="bg-green-500 text-white px-4 rounded"
          >
            Export ({filteredRoutineData.length})
          </button>
        </div>

        {/* ================= SEARCH ================= */}
        <input
          type="text"
          placeholder="Search..."
          value={searchRoutineText}
          onChange={handleRoutineSearch}
          className="border p-2 rounded w-96 mb-3"
        />

        {/* ================= TABLE ================= */}
        {filteredRoutineData.length ? (
          <>
            <Table
              columns={routineColumn}
              data={filteredRoutineData}
              pagination={false}
            />

            <div className="flex justify-end mt-3">
              <Pagination
                current={pageNo}
                total={total}
                pageSize={perPage}
                onChange={handlePageChange}
                showSizeChanger
              />
            </div>
          </>
        ) : (
          <div className="flex justify-center">
            <DNA height={120} width={120} />
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesTask;