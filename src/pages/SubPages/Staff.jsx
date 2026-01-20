import React, { useEffect, useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import { useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import Table from "../../components/table/Table";
import Navbar from "../../components/Navbar";
import Passes from "../Passes";
import { domainPrefix, getStaff } from "../../api";
import { dateFormat } from "../../utils/dateUtils";
import image from "/profile.png";

const Staff = () => {
  const themeColor = useSelector((state) => state.theme.color);

  // 🧠 State
  const [staffs, setStaffs] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchText, setSearchText] = useState("");

  // 📄 Pagination (DON'T CHANGE - as you requested)
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ CSV helpers
  const csvEscape = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const downloadCSV = (headers, rows, filename) => {
    const content = headers.join(",") + "\n" + rows.join("\n");
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // ✅ Export ALL staff data (fetch all pages from API)
  const exportStaffToCSVAll = async () => {
    try {
      const EXPORT_PER_PAGE = 200; // can increase if backend allows
      let page = 1;
      let allRows = [];
      let totalPagesFromApi = 1;

      // fetch first page
      const firstRes = await getStaff(page, EXPORT_PER_PAGE);
      const firstData = firstRes?.data || {};
      const firstList = Array.isArray(firstData.staffs) ? firstData.staffs : [];
      allRows = allRows.concat(firstList);

      // detect total pages
      if (firstData.total_pages) {
        totalPagesFromApi = firstData.total_pages;
      } else if (firstData.total_count) {
        totalPagesFromApi = Math.ceil(firstData.total_count / EXPORT_PER_PAGE) || 1;
      }

      // fetch remaining pages
      for (page = 2; page <= totalPagesFromApi; page++) {
        const res = await getStaff(page, EXPORT_PER_PAGE);
        const data = res?.data || {};
        const list = Array.isArray(data.staffs) ? data.staffs : [];
        allRows = allRows.concat(list);
      }

      // optional: if search is active, export filtered results
      let exportRows = allRows;
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        exportRows = allRows.filter((item) => {
          const fullName = `${item.firstname} ${item.lastname}`.toLowerCase();
          return (
            fullName.includes(q) ||
            item.unit_name?.toLowerCase().includes(q) ||
            item.mobile_no?.toLowerCase().includes(q)
          );
        });
      }

      if (!exportRows.length) {
        alert("No data to export");
        return;
      }

      const headers = [
        "ID",
        "Name",
        "Unit",
        "Email",
        "Mobile",
        "Work Type",
        "Vendor",
        "From",
        "Till",
        "Status",
        "Profile Picture URL",
      ];

      const rows = exportRows.map((row) => {
        const fullName = `${row.firstname || ""} ${row.lastname || ""}`.trim();
        const profileUrl = row?.profile_picture?.url
          ? domainPrefix + row.profile_picture.url
          : "";

        return [
          csvEscape(row.id),
          csvEscape(fullName),
          csvEscape(row.unit_name || "—"),
          csvEscape(row.email || "—"),
          csvEscape(row.mobile_no || "—"),
          csvEscape(row.work_type || "—"),
          csvEscape(row.vendor_name || "—"),
          csvEscape(row.valid_from ? dateFormat(row.valid_from) : ""),
          csvEscape(row.valid_till ? dateFormat(row.valid_till) : ""),
          csvEscape(row.status ? "Active" : "Inactive"),
          csvEscape(profileUrl),
        ].join(",");
      });

      downloadCSV(headers, rows, "staff_export.csv");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed");
    }
  };

  // 🚀 Fetch Staff (Server Pagination compatible) - unchanged
  const fetchStaff = async (page = 1, perPage = rowsPerPage) => {
    try {
      const res = await getStaff(page, perPage);
      const apiData = res.data;
      const staffList = Array.isArray(apiData.staffs) ? apiData.staffs : [];

      setStaffs(staffList);

      // search active hai toh filter maintain rakho
      if (searchText.trim()) {
        const filtered = staffList.filter((item) => {
          const fullName = `${item.firstname} ${item.lastname}`.toLowerCase();
          return (
            fullName.includes(searchText) ||
            item.unit_name?.toLowerCase().includes(searchText) ||
            item.mobile_no?.toLowerCase().includes(searchText)
          );
        });
        setFilteredStaff(filtered);
      } else {
        setFilteredStaff(staffList);
      }

      setTotalRecords(apiData.total_count || staffList.length);
      setCurrentPage(apiData.current_page || page);
      setTotalPages(apiData.total_pages || 1);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  useEffect(() => {
    fetchStaff(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, rowsPerPage]);

  // 🔍 Search handler - unchanged
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    if (!value.trim()) {
      setFilteredStaff(staffs);
    } else {
      const filtered = staffs.filter((item) => {
        const fullName = `${item.firstname} ${item.lastname}`.toLowerCase();
        return (
          fullName.includes(value) ||
          item.unit_name?.toLowerCase().includes(value) ||
          item.mobile_no?.toLowerCase().includes(value)
        );
      });
      setFilteredStaff(filtered);
    }
  };

  // 🧾 Table Columns - unchanged
  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/passes/staff-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
          <Link to={`/admin/edit-staff/${row.id}`}>
            <BiEdit size={15} />
          </Link>
        </div>
      ),
    },
    {
      name: "Profile",
      selector: (row) =>
        row.profile_picture && row.profile_picture.url ? (
          <img
            src={domainPrefix + row.profile_picture.url}
            alt="Profile"
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={() =>
              window.open(domainPrefix + row.profile_picture.url, "_blank")
            }
          />
        ) : (
          <img src={image} alt="Default" className="w-10 h-10 rounded-full" />
        ),
      sortable: false,
    },
    { name: "ID", selector: (row) => row.id },
    {
      name: "Name",
      selector: (row) => `${row.firstname} ${row.lastname}`,
      sortable: true,
    },
    { name: "Unit", selector: (row) => row.unit_name || "—" },
    { name: "Email", selector: (row) => row.email || "—" },
    { name: "Mobile", selector: (row) => row.mobile_no || "—" },
    { name: "Work Type", selector: (row) => row.work_type || "—" },
    { name: "Vendor", selector: (row) => row.vendor_name || "—" },
    { name: "From", selector: (row) => dateFormat(row.valid_from) },
    { name: "Till", selector: (row) => dateFormat(row.valid_till) },
    {
      name: "Status",
      selector: (row) =>
        row.status ? (
          <p className="text-green-400">Active</p>
        ) : (
          <p className="text-red-400">Inactive</p>
        ),
    },
  ];

  // ✅ KEEP your pagination logic exactly as-is
  const paginatedData = filteredStaff.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden mb-10">
        <Passes />

        {/* 🔍 Search + Add + Export */}
        <div className="flex md:flex-row flex-col gap-5 justify-between my-2">
          <input
            type="text"
            value={searchText}
            onChange={handleSearch}
            className="border border-gray-300 rounded-md w-full px-2 placeholder:text-sm"
            placeholder="Search by name, unit, or mobile"
          />

          <span className="flex gap-4">
            {/* ✅ Export button */}
            <button
              onClick={exportStaffToCSVAll}
              className="border-2 border-blue-600 text-blue-600 font-semibold transition-all p-2 rounded-md hover:bg-blue-50 cursor-pointer text-center flex items-center gap-2 justify-center"
            >
              Export
            </button>

            <Link
              to={"/admin/passes/add-staff"}
              style={{ background: themeColor }}
              className="border-2 font-semibold transition-all p-2 rounded-md text-white cursor-pointer text-center flex items-center gap-2 justify-center"
            >
              <PiPlusCircle size={20} />
              Add
            </Link>
          </span>
        </div>

        {/* 🧾 Staff Table */}
        <Table
          columns={columns}
          data={paginatedData}
          paginationServer
          paginationTotalRows={totalRecords}
          onChangePage={(page) => setCurrentPage(page)}
          onChangeRowsPerPage={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setCurrentPage(1);
          }}
        />
      </div>
    </section>
  );
};

export default Staff;
