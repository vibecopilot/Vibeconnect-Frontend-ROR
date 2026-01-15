import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Table from "../../../components/table/Table";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { PiPlusCircle } from "react-icons/pi";
import { useSelector } from "react-redux";

const AuditChecklist = ({ audits = [] }) => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Activity",
      selector: (row) => row.activity_name,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Audit Type",
      selector: (row) => row.checklist_type,
      sortable: true,
    },
    {
      name: "Task Count",
      selector: (row) => row.audit_tasks?.length || 0,
      sortable: true,
    },
  ];

  const filteredData = useMemo(() => {
    return audits.filter((audit) => {
      const matchesSearch =
        audit.activity_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        audit.description?.toLowerCase().includes(searchText.toLowerCase());

      return matchesSearch;
    });
  }, [audits, searchText]);

  const handleExport = () => {
    const csv = [
      ["ID", "Activity", "Description", "Audit Type", "Task Count"],
      ...filteredData.map((audit) => [
        audit.id,
        audit.activity_name,
        audit.description,
        audit.checklist_type,
        audit.audit_tasks?.length || 0,
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

  const themeColor = useSelector((state) => state.theme.color);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex md:flex-row md:justify-between flex-col gap-10 my-2">
        <div className="sm:flex grid grid-cols-2 items-center justify-center  gap-4 border border-gray-300 rounded-md px-3 p-2 w-auto">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="all"
              name="status"
              checked={statusFilter === "all"}
              onChange={() => setStatusFilter("all")}
            />
            <label htmlFor="all" className="text-sm">
              All
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="open"
              name="status"
              checked={statusFilter === "open"}
              onChange={() => setStatusFilter("open")}
            />
            <label htmlFor="open" className="text-sm">
              Open
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="closed"
              name="status"
              checked={statusFilter === "closed"}
              onChange={() => setStatusFilter("closed")}
            />
            <label htmlFor="closed" className="text-sm">
              Closed
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="pending"
              name="status"
              checked={statusFilter === "pending"}
              onChange={() => setStatusFilter("pending")}
            />
            <label htmlFor="pending" className="text-sm">
              Pending
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="completed"
              name="status"
              checked={statusFilter === "completed"}
              onChange={() => setStatusFilter("completed")}
            />
            <label htmlFor="completed" className="text-sm">
              Completed
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={"/admin/add-audit-checklist"}
            className={`border-2 font-semibold hover:bg-black hover:text-white duration-300 transition-all border-black p-2 rounded-md text-black cursor-pointer text-center flex items-center gap-2 justify-center`}
          >
            <PiPlusCircle size={20} />
            Add
          </Link>
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-400 w-96 placeholder:text-xs rounded-lg p-2"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button
            onClick={handleExport}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Export
          </button>
        </div>
      </div>
      <Table columns={columns} data={filteredData} isPagination={true} />
    </div>
  );
};

export default AuditChecklist;
