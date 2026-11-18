import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/table/Table";
import { BsEye } from "react-icons/bs";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import AssetNav from "../../components/navbars/AssetNav";
import { API_URL, getVibeBackground } from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import TablePagination from "@mui/material/TablePagination";
import { Filter } from "lucide-react";
import SiteHeader from "../../components/SiteHeader";

const PPMTask = () => {
  const getCurrentMonth = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  };

  const [tasks, setTasks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth()); // default = current month
  const [showFilter, setShowFilter] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [statusCounts, setStatusCounts] = useState({ all: 0, pending: 0, overdue: 0, complete: 0 });
  // ── reactive site ID — updated by SiteHeader on site switch ──
  const [activeSiteId, setActiveSiteId] = useState(
    () => getItemInLocalStorage("SITEID")
  );

  const token = getItemInLocalStorage("TOKEN");
  const searchDebounceRef = useRef(null);

  /* ---------------- BACKGROUND ---------------- */
  const Get_Background = async () => {
    try {
      const user_id = getItemInLocalStorage("VIBEUSERID");
      const data = await getVibeBackground(user_id);
      if (data.success) setSelectedImage(API_URL + data.data.image);
    } catch (err) {
      console.log(err);
    }
  };


  const getMonthParams = (month) => {
    if (!month) {
      return "";
    }
    const [year, m] = month.split("-");
    const startDate = `${year}-${m}-01`;
    const lastDay = new Date(parseInt(year), parseInt(m), 0).getDate();
    const endDate = `${year}-${m}-${lastDay}`;
    return `&q[start_time_gteq]=${startDate}&q[start_time_lteq]=${endDate}`;
  };

  /* ---------------- FETCH TASKS ---------------- */
  const fetchPPMTask = useCallback(async (currentPage, currentRows, currentStatus, currentMonth, currentSearch) => {
    try {
      let url = `https://admin.vibecopilot.ai/activities.json?q[checklist_ctype_eq]=ppm&token=${token}&page=${currentPage + 1}&per_page=${currentRows}`;

      if (currentSearch) {
        url += `&q[search_cont]=${encodeURIComponent(currentSearch)}`;
      }

      if (currentStatus !== "all") {
        url += `&q[status_eq]=${currentStatus}`;
      }

      url += getMonthParams(currentMonth);

      const res = await fetch(url);
      const data = await res.json();

      const activities = data.activities?.filter((a) => a.asset_name) || [];
      setTasks(activities);
      setTotal(data.total_count || 0);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch tasks");
    }
  }, [token]);

  /* ---------------- FETCH STATUS COUNTS ---------------- */
  const fetchStatusCounts = useCallback(async (month) => {
    try {
      // ✅ ALWAYS call getMonthParams — it handles the empty case correctly
      const monthParams = getMonthParams(month);
      const baseUrl = `https://admin.vibecopilot.ai/activities.json?q[checklist_ctype_eq]=ppm&token=${token}&per_page=1&page=1`;

      const [allRes, pendingRes, overdueRes, completeRes] = await Promise.all([
        fetch(`${baseUrl}${monthParams}`),
        fetch(`${baseUrl}&q[status_eq]=pending${monthParams}`),
        fetch(`${baseUrl}&q[status_eq]=overdue${monthParams}`),
        fetch(`${baseUrl}&q[status_eq]=complete${monthParams}`),
      ]);

      const [allData, pendingData, overdueData, completeData] = await Promise.all([
        allRes.json(), pendingRes.json(), overdueRes.json(), completeRes.json(),
      ]);

      setStatusCounts({
        all: allData.total_count || 0,
        pending: pendingData.total_count || 0,
        overdue: overdueData.total_count || 0,
        complete: completeData.total_count || 0,
      });
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    fetchPPMTask(page, rowsPerPage, selectedStatus, selectedMonth, searchText);
  }, [page, rowsPerPage, selectedStatus, selectedMonth, fetchPPMTask, activeSiteId]); // ✅ re-fetch when site changes

  useEffect(() => {
    fetchStatusCounts(selectedMonth);
  }, [selectedMonth, activeSiteId]); // ✅ re-fetch when site changes

  useEffect(() => {
    Get_Background();
  }, []);

  /* ---------------- SEARCH with debounce ---------------- */
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setPage(0);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      fetchPPMTask(0, rowsPerPage, selectedStatus, selectedMonth, value);
    }, 500);
  };

  /* ---------------- CLEAR FILTER ---------------- */
  const clearFilter = () => {
    setSelectedMonth(getCurrentMonth()); // reset to current month
    setPage(0);
    setShowFilter(false);
  };

  /* ---------------- TABLE COLUMNS ---------------- */
  const RoutineColumns = [
    {
      name: "View",
      cell: (row) => (
        <Link to={`/assets/routine-task-details/${row.asset_id}/${row.id}`}>
          <BsEye size={15} />
        </Link>
      ),
    },
    { name: "Asset Name", selector: (row) => row.asset_name, sortable: true },
    { name: "Checklist", selector: (row) => row.checklist_name, sortable: true },
    { name: "Assigned To", selector: (row) => row.assigned_to_name, sortable: true },
    {
      name: "Status",
      cell: (row) => {
        const status = row.status?.toLowerCase();
        const color =
          status === "pending" ? "bg-yellow-500" :
            status === "overdue" ? "bg-red-500" :
              status === "complete" ? "bg-purple-500" : "bg-gray-500";
        return (
          <span className={`text-white text-xs px-2 py-1 rounded-full ${color}`}>
            {row.status}
          </span>
        );
      },
    },
    { name: "Start Time", selector: (row) => row.start_time, sortable: true },
    { name: "Created On", selector: (row) => row.created_at, sortable: true },
  ];

  /* ---------------- PAGINATION ---------------- */
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <section className="flex" style={{ background: `url(${selectedImage}) no-repeat center/cover` }}>
      <Navbar />

      <div className="p-4 w-full flex flex-col">
        <SiteHeader
          onSiteChange={(id) => {
            setActiveSiteId(id); // triggers data useEffects
            setPage(0);
            setSelectedStatus("all");
            setTasks([]);
          }}
        />
        <AssetNav />

        {/* STATUS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-4">
          {[
            { key: "all", label: "All", active: "bg-indigo-600", inactive: "bg-indigo-100 border-indigo-400" },
            { key: "pending", label: "Pending", active: "bg-yellow-500", inactive: "bg-yellow-100 border-yellow-400" },
            { key: "overdue", label: "Overdue", active: "bg-red-500", inactive: "bg-red-100 border-red-400" },
            { key: "complete", label: "Complete", active: "bg-purple-500", inactive: "bg-purple-100 border-purple-400" },
          ].map(({ key, label, active, inactive }) => (
            <div
              key={key}
              onClick={() => { setSelectedStatus(key); setPage(0); }}
              className={`cursor-pointer rounded-lg p-4 text-center shadow border ${selectedStatus === key ? `${active} text-white` : inactive}`}
            >
              <p className="text-sm">{label}</p>
              <p className="text-xl font-bold">{statusCounts[key]}</p>
            </div>
          ))}
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex justify-between items-center my-3 flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search Asset Name or Checklist"
            className="border p-2 w-[400px] rounded-lg border-gray-300"
            value={searchText}
            onChange={handleSearch}
          />
          <button
            onClick={() => setShowFilter(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter
            {selectedMonth && (
              <span className="ml-1 text-xs bg-white text-blue-500 px-1 rounded">{selectedMonth}</span>
            )}
          </button>
        </div>

        {/* FILTER POPUP */}
        {showFilter && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-lg font-semibold mb-4">Filter by Month</h2>
              <input
                type="month"
                value={selectedMonth || ""}
                onChange={(e) => { setSelectedMonth(e.target.value || ""); setPage(0); }}
                className="border p-2 rounded w-full"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={clearFilter} className="bg-red-500 text-white px-4 py-2 rounded">Clear</button>
                <button onClick={() => setShowFilter(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
              </div>
            </div>
          </div>
        )}

        {/* TABLE */}
        {tasks.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-10 text-center mt-4">
            <h2 className="text-xl font-semibold text-gray-600">No Submission Yet</h2>
          </div>
        ) : (
          <Table columns={RoutineColumns} data={tasks} pagination={false} />
        )}

        {/* PAGINATION */}
        <div className="flex justify-end bg-white border-t">
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
            showFirstButton
            showLastButton
          />
        </div>
      </div>
    </section>
  );
};

export default PPMTask;