import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Table from "../../../components/table/Table";
import { BsEye } from "react-icons/bs";
import { PiPlusCircle } from "react-icons/pi";
import { getAudits } from "../../../api";
// ✅ use API file

const ScheduledAudit = () => {
  const [audits, setAudits] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ fetch on mount + priority change
  useEffect(() => {
    fetchAudits();
  }, [priority]);

  const fetchAudits = async () => {
    try {
      setLoading(true);

      const params = {
        page: 1,
        per_page: 10,
      };

      // ✅ VERY IMPORTANT FIX
      if (priority) {
        params["q[priority_eq]"] = priority;
      }

      const res = await getAudits(params);

      const data = res?.data;

      const list =
        data?.audits || data?.data || data?.results || data || [];

      setAudits(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setAudits([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/scheduled-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
        </div>
      ),
    },
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Activity", selector: (row) => row.activity_name, sortable: true },
    { name: "Audit For", selector: (row) => row.audit_for, sortable: true },
    { name: "Frequency", selector: (row) => row.frequency, sortable: true },
    { name: "Priority", selector: (row) => row.priority, sortable: true },
    {
      name: "Start Date",
      selector: (row) =>
        row.start_from ? new Date(row.start_from).toLocaleDateString() : "-",
    },
    {
      name: "End Date",
      selector: (row) =>
        row.end_at ? new Date(row.end_at).toLocaleDateString() : "-",
    },
  ];

  // ✅ search only (priority handled by API)
  const filteredData = useMemo(() => {
    const text = searchText.toLowerCase();

    return audits.filter((audit) => {
      return (
        audit.activity_name?.toLowerCase().includes(text) ||
        audit.audit_for?.toLowerCase().includes(text) ||
        audit.description?.toLowerCase().includes(text)
      );
    });
  }, [audits, searchText]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex md:flex-row md:justify-between flex-col gap-10 my-2">

        {/* ✅ Priority Filter */}
        <div className="border border-gray-300 rounded-md px-3 p-2">
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

        {/* Actions */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-400 w-96 rounded-lg p-2"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Link
            to={"/admin/audit/schedule-audit"}
            className="border-2 font-semibold hover:bg-black hover:text-white duration-300 border-black p-2 rounded-md flex items-center gap-2"
          >
            <PiPlusCircle size={20} />
            Add
          </Link>


        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading audits...
        </div>
      ) : (
        <Table columns={columns} data={filteredData} isPagination />
      )}
    </div>
  );
};

export default ScheduledAudit;