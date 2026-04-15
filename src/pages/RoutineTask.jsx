import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../components/table/Table";
import { BsEye } from "react-icons/bs";
import { API_URL, getRoutineTaskStatus, getVibeBackground, exportRoutineTasks } from "../api";
import toast from "react-hot-toast";
import { getItemInLocalStorage } from "../utils/localStorage";
import Navbar from "../components/Navbar";
import AssetNav from "../components/navbars/AssetNav";

const RoutineTask = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  

  const formatInputDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const [startDate, setStartDate] = useState(formatInputDate(today));
  const [endDate, setEndDate] = useState(formatInputDate(tomorrow));

  // const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    pending: 0,
    overdue: 0,
    complete: 0,
  });

  /* ---------------------- STATUS OPTIONS ---------------------- */

  const statusOptions = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "overdue", label: "Overdue" },
    { key: "complete", label: "Complete" },
  ];

  /* ---------------------- DATE FORMAT ---------------------- */

  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* ---------------------- BUILD COUNTS ---------------------- */

  const buildCounts = (counts) => {
    const pending = counts?.pending || 0;
    const overdue = counts?.overdue || 0;
    const complete = counts?.complete || 0;

    return {
      pending,
      overdue,
      complete,
      all: pending + overdue + complete,
    };
  };

  /* ---------------------- FETCH DATA ---------------------- */

 /* ---------------------- FETCH DATA ---------------------- */

const fetchTasks = async (
  status = null,
  start = null,
  end = null,
  page = 1,
  per_page = 10
) => {
  try {
    setIsLoading(true);

    const data = await getRoutineTaskStatus(status, start, end, page, per_page);

    const activities = data?.activities || [];

    // store full list
    setTasks(activities);

    // show same list initially
    setFilteredData(activities);

    // counts should come from full list
    setStatusCounts(calculateStatusCounts(activities));

  } catch (error) {
    toast.error("Failed to load activities");
  } finally {
    setIsLoading(false);
  }
};

  /* ---------------------- INITIAL LOAD ---------------------- */

  useEffect(() => {
    fetchTasks(null, startDate, endDate);
  }, []);

  /* ---------------------- SEARCH ---------------------- */

  const handleSearch = (e) => {
  const value = e.target.value.toLowerCase();
  setSearchText(value);

  const filtered = tasks.filter(
    (item) =>
      item.asset_name?.toLowerCase().includes(value) ||
      item.checklist_name?.toLowerCase().includes(value) ||
      item.assigned_to_name?.toLowerCase().includes(value)
  );

  setFilteredData(filtered);
  // setStatusCounts(calculateStatusCounts(filtered));
};

  /* ---------------------- STATUS FILTER ---------------------- */

  const handleStatusChange = (statusKey) => {
  setSelectedStatus(statusKey);

  if (statusKey === "all") {
    setFilteredData(tasks);
  } else {
    const filtered = tasks.filter(
      (item) => item.status?.toLowerCase() === statusKey
    );

    setFilteredData(filtered);
  }
};
  /* ---------------------- DATE FILTER ---------------------- */

  const handleDateFilter = () => {
    fetchTasks(
      selectedStatus === "all" ? null : selectedStatus,
      startDate || null,
      endDate || null,
    );
  };

  /* ---------------------- CLEAR FILTER ---------------------- */

 const handleClearFilters = () => {
  setStartDate(formatInputDate(today));
  setEndDate(formatInputDate(tomorrow));
  setSelectedStatus("all");
  setSearchText("");

  fetchTasks(null, formatInputDate(today), formatInputDate(tomorrow));
};

  const calculateStatusCounts = (data) => {
  const counts = {
    all: data.length,
    pending: 0,
    overdue: 0,
    complete: 0,
  };

  data.forEach((item) => {
    const status = item.status?.toLowerCase();

    if (status === "pending") counts.pending += 1;
    if (status === "overdue") counts.overdue += 1;
    if (status === "complete") counts.complete += 1;
  });

  return counts;
};
  /* ---------------------- EXPORT ---------------------- */

const exportToExcel = async () => {
  try {
    const response = await exportRoutineTasks(
      startDate,
      endDate
    );

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = "routine_tasks_export.xlsx";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Export downloaded successfully");
  } catch (error) {
    console.error("Export error:", error);
    toast.error("Failed to export data");
  }
};
  /* ---------------------- TABLE COLUMNS ---------------------- */

  const RoutineColumns = [
    {
      name: "View",
      cell: (row) => (
        <Link to={`/assets/routine-task-details/${row.asset_id}/${row.id}`}>
          <BsEye size={16} />
        </Link>
      ),
    },
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Asset Name", selector: (row) => row.asset_name, sortable: true },

    {
      name: "Checklist",
      selector: (row) => row.checklist_name,
      width: "350px",
    },

    {
      name: "Start Date",
      selector: (row) => dateFormat(row.start_time),
    },

    {
      name: "Status",
      cell: (row) => {
        const status = row.status.toLowerCase();

        const color =
          status === "pending"
            ? "bg-yellow-500"
            : status === "overdue"
              ? "bg-red-500"
              : status === "complete"
                ? "bg-purple-500"
                : "bg-gray-500";

        return (
          <span
            className={`text-white text-xs px-2 py-1 rounded-full ${color}`}
          >
            {row.status}
          </span>
        );
      },
    },

    {
      name: "Assigned To",
      selector: (row) => row.assigned_to_name,
    },
  ];

  /* ---------------------- BACKGROUND ---------------------- */

  const [bgImage, setBgImage] = useState("");

  const getBackground = async () => {
    const userId = getItemInLocalStorage("VIBEUSERID");

    const data = await getVibeBackground(userId);

    if (data?.success) {
      setBgImage(API_URL + data.data.image);
    }
  };

  useEffect(() => {
    getBackground();
  }, []);

  /* ---------------------- UI ---------------------- */

  return (
    <section
      className="flex"
      style={{
        background: `url(${bgImage}) no-repeat center/cover`,
      }}
    >
      <Navbar />

      <div className="p-4 w-full flex flex-col">
        <AssetNav />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-4 p-6">
          {statusOptions.map((status) => {
            const isActive = selectedStatus === status.key;

            const styles = {
              all: "bg-blue-50 border-blue-500",
              pending: "bg-yellow-50 border-yellow-500",
              overdue: "bg-red-50 border-red-500",
              complete: "bg-purple-50 border-purple-500",
            };

            const activeStyles = {
              all: "bg-blue-500 text-white border-blue-500",
              pending: "bg-yellow-500 text-white border-yellow-500",
              overdue: "bg-red-500 text-white border-red-500",
              complete: "bg-purple-500 text-white border-purple-500",
            };

            return (
              <div
                key={status.key}
                onClick={() => handleStatusChange(status.key)}
                className={`cursor-pointer border rounded-lg p-4 shadow text-center transition
        ${isActive ? activeStyles[status.key] : styles[status.key]}`}
              >
                <div className="text-sm">{status.label}</div>
                <div className="font-bold text-xl">
                  {statusCounts[status.key] || 0}
                </div>
              </div>
            );
          })}
        </div>
        {/* -------- FILTER SECTION -------- */}

        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Search */}
            <input
              type="text"
              placeholder="Search asset , checklist and Assigned to..."
              className="border p-2 rounded w-full md:w-1/3"
              value={searchText}
              onChange={handleSearch}
            />

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
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
                type="button"
                onClick={handleDateFilter}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Apply
              </button>

              <button
                type="button"
                onClick={handleClearFilters}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={exportToExcel}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Export ({filteredData.length})
              </button>
            </div>
          </div>
        </div>

        {/* -------- LOADING -------- */}

        {isLoading && (
          <div className="flex justify-center py-6">
            <div className="animate-spin h-10 w-10 border-b-2 border-blue-500 rounded-full" />
          </div>
        )}

        {/* -------- TABLE -------- */}
 {filteredData.length === 0 ? (
  <div className="bg-white shadow rounded-lg p-10 text-center mt-4">
    <h2 className="text-xl font-semibold text-gray-600">
      No Submission Yet
    </h2>
  </div>
) : (
        <Table columns={RoutineColumns} data={filteredData} isPagination />
)}
      </div>
    </section>
  );
};

export default RoutineTask;