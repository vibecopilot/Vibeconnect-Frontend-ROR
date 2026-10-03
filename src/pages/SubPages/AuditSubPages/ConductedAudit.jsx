import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Table from "../../../components/table/Table";
import { IoMdPrint } from "react-icons/io";

const ConductedAudit = ({ audits = [] }) => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priority, setPriority] = useState("");


  const columns = [
    {
      name: "Report",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link>
            <IoMdPrint />
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
      name: "Activity Name",
      selector: (row) => row.activity_name,
      sortable: true,
    },
    {
      name: "Audit For",
      selector: (row) => row.audit_for,
      sortable: true,
    },
    {
      name: "Priority",
      selector: (row) => row.priority,
      sortable: true,
    },
    {
      name: "Frequency",
      selector: (row) => row.frequency,
      sortable: true,
    },
    {
      name: "Created Date",
      selector: (row) =>
        row.created_at
          ? new Date(row.created_at).toLocaleDateString()
          : "-", sortable: true,
    },
  ];

  const filteredData = useMemo(() => {
    return audits.filter((audit) => {
      const search = searchText.toLowerCase();

      const matchesSearch =
        audit.activity_name?.toLowerCase().includes(search) ||
        audit.audit_for?.toLowerCase().includes(search);

      // ✅ Priority filter
      const matchesPriority =
        priority === "" ||
        (audit.priority || "").toLowerCase() === priority;

      return matchesSearch && matchesPriority;
    });
  }, [audits, searchText, priority]);

  const handleExport = () => {
    const csv = [
      ["ID", "Activity", "Audit For", "Priority", "Frequency", "Created Date"],
      ...filteredData.map((audit) => [
        audit.id,
        audit.activity_name,
        audit.audit_for,
        audit.priority,
        audit.frequency,
        new Date(audit.created_at).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "conducted_audits.csv";
    a.click();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex md:flex-row md:justify-between flex-col gap-10 my-2">
        <div className="sm:flex grid grid-cols-2 items-center justify-center  gap-4 border border-gray-300 rounded-md px-3 p-2 w-auto">
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                name="priority"
                value=""
                checked={priority === ""}
                onChange={(e) => setPriority(e.target.value)}
              />
              &nbsp;All
            </label>

            <label>
              <input
                type="radio"
                name="priority"
                value="high"
                checked={priority === "high"}
                onChange={(e) => setPriority(e.target.value)}
              />
              &nbsp;High
            </label>

            <label>
              <input
                type="radio"
                name="priority"
                value="medium"
                checked={priority === "medium"}
                onChange={(e) => setPriority(e.target.value)}
              />
              &nbsp;Medium
            </label>

            <label>
              <input
                type="radio"
                name="priority"
                value="low"
                checked={priority === "low"}
                onChange={(e) => setPriority(e.target.value)}
              />
              &nbsp;Low
            </label>
          </div>
        </div>

        <div className="flex gap-2">
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

export default ConductedAudit;
