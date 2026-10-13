import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Table from "../../../components/table/Table";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { PiPlusCircle } from "react-icons/pi";
import { useSelector } from "react-redux";
import { MdDownload } from "react-icons/md";
import { getRoutineTask } from "../../../api";

const AuditChecklist = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  // ✅ NEW STATES
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const themeColor = useSelector((state) => state.theme.color);

  useEffect(() => {
    fetchData();
  }, [statusFilter, page]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await getRoutineTask(null, null, statusFilter, {
        page,
        per_page: 20, // 🔥 increase records per page
      });

      const list = res?.data?.activities || [];

      setTotalPages(res?.data?.total_pages || 1);

      const mapped = list.map((item) => ({
        id: item.id,
        activity_name: item.checklist_name,
        description: item.asset_name || item.location || "-",
        checklist_type: item.checklist_frequency,
        audit_tasks:
          item.groups?.flatMap((g) => g.questions || []) || [],
        status: item.status,
        created_at: item.created_at,
      }));

      setData(mapped);
    } catch (err) {
      console.error("Fetch error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/checklist-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
          <Link to={`/admin/edit-checklist/${row.id}`}>
            <BiEdit size={15} />
          </Link>
        </div>
      ),
    },
    { name: "ID", selector: (row) => row.id },
    { name: "Activity", selector: (row) => row.activity_name },
    { name: "Description", selector: (row) => row.description },
    { name: "Audit Type", selector: (row) => row.checklist_type },
    { name: "Status", selector: (row) => row.status },
    {
      name: "Task Count",
      selector: (row) => row.audit_tasks?.length || 0,
    },
  ];

  const filteredData = useMemo(() => {
    const text = searchText.toLowerCase();

    return data.filter((item) => {
      return (
        item.activity_name?.toLowerCase().includes(text) ||
        item.description?.toLowerCase().includes(text)
      );
    });
  }, [data, searchText]);

  const handleExport = () => {
    const csv = [
      ["ID", "Activity", "Description", "Audit Type", "Task Count"],
      ...filteredData.map((item) => [
        item.id,
        item.activity_name,
        item.description,
        item.checklist_type,
        item.audit_tasks?.length || 0,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit_checklists.csv";
    a.click();
  };

  return (
    <div className="flex flex-col gap-2">

      {/* FILTER */}
      <div className="flex justify-between my-2">
        <div className="flex gap-4 border p-2 rounded-md">
          {["all", "open", "closed", "pending", "complete", "overdue"].map((status) => (
            <label key={status}>
              <input
                type="radio"
                checked={statusFilter === status}
                onChange={() => {
                  setPage(1); // 🔥 reset page
                  setStatusFilter(status);
                }}
              />
              &nbsp;{status}
            </label>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="border w-80 p-2"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <button onClick={handleExport} className="bg-blue-500 text-white px-4">
            Export
          </button>

          <Link to="/admin/add-audit-checklist" className="bg-blue-500 text-white px-4 flex items-center">
            <PiPlusCircle /> Add
          </Link>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <>
          <Table columns={columns} data={filteredData} isPagination />

          {/* ✅ PAGINATION CONTROLS */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border"
            >
              Prev
            </button>

            <span>Page {page} / {totalPages}</span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AuditChecklist;