import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/table/Table";
import { BsEye } from "react-icons/bs";
import { Filter } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import AssetNav from "../../components/navbars/AssetNav";
import TablePagination from "@mui/material/TablePagination";
import { API_URL, getVibeBackground } from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";

const PPMTask = () => {
  const [tasks, setTasks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedImage, setSelectedImage] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    pending: 0,
    overdue: 0,
    complete: 0,
  });

  const token = getItemInLocalStorage("TOKEN");

  /* ---------------- FETCH TASK ---------------- */
  const fetchPPMTask = async () => {
    try {
      let url = `https://admin.vibecopilot.ai/activities.json?q[checklist_ctype_eq]=ppm&token=${token}&page=${
        page + 1
      }&per_page=${rowsPerPage}`;

      if (searchText) {
        url += `&q[asset_name_or_checklist_name_cont]=${searchText}`;
      }

      if (selectedStatus !== "all") {
        url += `&q[status_eq]=${selectedStatus}`;
      }

      if (selectedMonth) {
        const start = new Date(selectedMonth + "-01");
        const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

        url += `&q[start_time_gteq]=${start.toISOString()}`;
        url += `&q[start_time_lteq]=${end.toISOString()}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      const activities =
        data.activities?.filter((a) => a.asset_name) || [];

      setTasks(activities);
      setTotal(data.total_count || 0);
    } catch (error) {
      toast.error("Failed to fetch tasks");
      console.log(error);
    }
  };

  /* ---------------- STATUS COUNT ---------------- */
  const fetchStatusCounts = async () => {
    try {
      let url = `https://admin.vibecopilot.ai/activities.json?q[checklist_ctype_eq]=ppm&token=${token}&per_page=10000`;
      const res = await fetch(url);
      const data = await res.json();

      const allTasks = data.activities?.filter((a) => a.asset_name) || [];

      const counts = { all: allTasks.length, pending: 0, overdue: 0, complete: 0 };

      allTasks.forEach((task) => {
        const status = task.status?.toLowerCase();
        if (status === "pending") counts.pending++;
        else if (status === "overdue") counts.overdue++;
        else if (status === "complete") counts.complete++;
      });

      setStatusCounts(counts);
    } catch (error) {
      console.log(error);
    }
  };

  /* ---------------- BACKGROUND ---------------- */
  const getBackground = async () => {
    try {
      const user_id = getItemInLocalStorage("VIBEUSERID");
      const data = await getVibeBackground(user_id);

      if (data?.success) {
        setSelectedImage(API_URL + data.data.image);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    fetchPPMTask();
  }, [page, rowsPerPage, selectedStatus, selectedMonth, searchText]);

  useEffect(() => {
    fetchStatusCounts();
    getBackground();
  }, []);

  /* ---------------- HANDLERS ---------------- */
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPage(0);
  };

  const clearFilter = () => {
    setSelectedMonth("");
    setPage(0);
    setShowFilter(false);
  };

  /* ---------------- TABLE ---------------- */
  const columns = [
    {
      name: "View",
      cell: (row) => (
        <Link to={`/assets/routine-task-details/${row.asset_id}/${row.id}`}>
          <BsEye size={15} />
        </Link>
      ),
    },
    { name: "Asset Name", selector: (row) => row.asset_name },
    { name: "Checklist", selector: (row) => row.checklist_name },
    { name: "Status", selector: (row) => row.status },
    { name: "Assigned To", selector: (row) => row.assigned_to_name },
    { name: "Start Time", selector: (row) => row.start_time },
    { name: "Created On", selector: (row) => row.created_at },
  ];

  return (
    <section
      className="flex"
      style={{ background: `url(${selectedImage}) no-repeat center/cover` }}
    >
      <Navbar />

      <div className="p-4 w-full flex flex-col">
        <AssetNav />

        {/* FILTERS */}
        <div className="flex gap-3 my-3 flex-wrap">
          <input
            type="text"
            placeholder="Search Asset / Checklist"
            className="border p-2 rounded w-80"
            value={searchText}
            onChange={handleSearch}
          />

          <button
            onClick={() => setShowFilter(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* STATUS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["all", "pending", "overdue", "complete"].map((status) => (
            <div
              key={status}
              onClick={() => {
                setSelectedStatus(status);
                setPage(0);
              }}
              className={`cursor-pointer p-4 rounded shadow text-center ${
                selectedStatus === status ? "bg-indigo-600 text-white" : "bg-gray-100"
              }`}
            >
              <p className="capitalize">{status}</p>
              <p className="font-bold">{statusCounts[status]}</p>
            </div>
          ))}
        </div>

        {/* TABLE */}
        <Table columns={columns} data={tasks} isPagination={false} />

        {/* PAGINATION */}
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />

        {/* FILTER MODAL */}
        {showFilter && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
            <div className="bg-white p-5 rounded w-80">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border p-2 w-full"
              />

              <div className="flex justify-end gap-2 mt-3">
                <button onClick={clearFilter} className="bg-red-500 text-white px-3 py-1 rounded">
                  Clear
                </button>
                <button onClick={() => setShowFilter(false)} className="bg-gray-500 text-white px-3 py-1 rounded">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PPMTask;