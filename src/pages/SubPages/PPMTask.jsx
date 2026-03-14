import React, { useEffect, useState } from "react";
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

const PPMTask = () => {
  const [tasks, setTasks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const [selectedImage, setSelectedImage] = useState("");

  const token = getItemInLocalStorage("TOKEN");

  /* ---------------- BACKGROUND ---------------- */

  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    pending: 0,
    overdue: 0,
    complete: 0,
  });

  const Get_Background = async () => {
    try {
      const user_id = getItemInLocalStorage("VIBEUSERID");
      const data = await getVibeBackground(user_id);

      if (data.success) {
        setSelectedImage(API_URL + data.data.image);
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* ---------------- FETCH TASKS ---------------- */

  const fetchPPMTask = async () => {
  try {
    let url = `https://admin.vibecopilot.ai/activities.json?q[checklist_ctype_eq]=ppm&token=${token}&page=${page + 1}&per_page=${rowsPerPage}`;

    if (searchText) {
      url += `&q[search_cont]=${searchText}`;
    }

    /* STATUS FILTER FROM API */

    if (selectedStatus !== "all") {
      url += `&q[status_eq]=${selectedStatus}`;
    }

    /* MONTH FILTER */
if (selectedMonth) {
  const start = new Date(selectedMonth + "-01");
  const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

  const startDate = start.toISOString();
  const endDate = new Date(
    end.getFullYear(),
    end.getMonth(),
    end.getDate(),
    23,
    59,
    59
  ).toISOString();

  url += `&q[start_time_gteq]=${startDate}`;
  url += `&q[start_time_lteq]=${endDate}`;
}

    const res = await fetch(url);
    const data = await res.json();

const activities = data.activities?.filter((a) => a.asset_name) || [];
    setTasks(activities);

    setTotal(data.total_count || 0);

  } catch (error) {
    console.log(error);
    toast.error("Failed to fetch tasks");
  }
};
useEffect(() => {
  const delay = setTimeout(() => {
    fetchPPMTask();
  }, 400);

  return () => clearTimeout(delay);
}, [page, rowsPerPage, selectedStatus, selectedMonth, searchText]);

const fetchStatusCounts = async () => {
  try {
    const url = `https://admin.vibecopilot.ai/activities.json?q[checklist_ctype_eq]=ppm&token=${token}&per_page=1000`;

    const res = await fetch(url);
    const data = await res.json();

    const activities = data.activities || [];

    const counts = {
      all: 0,
      pending: 0,
      overdue: 0,
      complete: 0,
    };

    activities.forEach((task) => {
      if (!task.asset_name) return;

      counts.all++;

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

//  useEffect(() => {
//   fetchPPMTask();
// }, [page, rowsPerPage, selectedStatus, selectedMonth]);

useEffect(() => {
  fetchStatusCounts();
}, []);

  useEffect(() => {
    Get_Background();
  }, []);

  /* ---------------- SEARCH ---------------- */

  const handleSearch = (e) => {
    const value = e.target.value;

    setSearchText(value);

    setPage(0);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchPPMTask();
    }, 500);

    return () => clearTimeout(delay);
  }, [searchText]);

  /* ---------------- CLEAR FILTER ---------------- */

  const clearFilter = () => {
    setSelectedMonth("");

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

    {
      name: "Asset Name",
      selector: (row) => row.asset_name,
      sortable: true,
    },

    {
      name: "Checklist",
      selector: (row) => row.checklist_name,
      sortable: true,
    },

    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },

    {
      name: "Assigned To",
      selector: (row) => row.assigned_to_name,
      sortable: true,
    },

    {
      name: "Start Time",
      selector: (row) => row.start_time,
      sortable: true,
    },

    {
      name: "Created On",
      selector: (row) => row.created_at,
      sortable: true,
    },
  ];

  /* ---------------- PAGINATION ---------------- */

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));

    setPage(0);
  };

  return (
    <section
      className="flex"
      style={{
        background: `url(${selectedImage}) no-repeat center/cover`,
      }}
    >
      <Navbar />

      <div className="p-4 w-full flex flex-col">
        <AssetNav />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-4">
          <div
            onClick={() => {
              setSelectedStatus("all");
              setPage(0);
            }}
            className={`cursor-pointer rounded-lg p-4 text-center shadow border 
    ${
      selectedStatus === "all"
        ? "bg-indigo-600 text-white"
        : "bg-indigo-100 border-indigo-400"
    }`}
          >
            <p className="text-sm">All</p>
            <p className="text-xl font-bold">{statusCounts.all}</p>
          </div>

          <div
            onClick={() => {
              setSelectedStatus("pending");
              setPage(0);
            }}
            className={`cursor-pointer rounded-lg p-4 text-center shadow border
    ${
      selectedStatus === "pending"
        ? "bg-yellow-500 text-white"
        : "bg-yellow-100 border-yellow-400"
    }`}
          >
            <p className="text-sm">Pending</p>
            <p className="text-xl font-bold">{statusCounts.pending}</p>
          </div>

          <div
            onClick={() => {
              setSelectedStatus("overdue");
              setPage(0);
            }}
            className={`cursor-pointer rounded-lg p-4 text-center shadow border
    ${
      selectedStatus === "overdue"
        ? "bg-red-500 text-white"
        : "bg-red-100 border-red-400"
    }`}
          >
            <p className="text-sm">Overdue</p>
            <p className="text-xl font-bold">{statusCounts.overdue}</p>
          </div>

          <div
            onClick={() => {
              setSelectedStatus("complete");
              setPage(0);
            }}
            className={`cursor-pointer rounded-lg p-4 text-center shadow border
    ${
      selectedStatus === "complete"
        ? "bg-purple-500 text-white"
        : "bg-purple-100 border-purple-400"
    }`}
          >
            <p className="text-sm">Complete</p>
            <p className="text-xl font-bold">{statusCounts.complete}</p>
          </div>
        </div>

        {/* SEARCH + FILTER */}

        <div className="flex justify-between items-center my-3 flex-wrap gap-3">
          {/* STATUS */}

          {/* <div className="flex gap-3 border p-2 rounded-md bg-white">

            <label>
              <input
                type="radio"
                checked={selectedStatus === "all"}
                onChange={() => { setSelectedStatus("all"); setPage(0); }}
              />
              <span className="ml-1">All</span>
            </label>

            <label>
              <input
                type="radio"
                checked={selectedStatus === "pending"}
                onChange={() => { setSelectedStatus("pending"); setPage(0); }}
              />
              <span className="ml-1">Pending</span>
            </label>

            <label>
              <input
                type="radio"
                checked={selectedStatus === "complete"}
                onChange={() => { setSelectedStatus("complete"); setPage(0); }}
              />
              <span className="ml-1">Completed</span>
            </label>

            <label>
              <input
                type="radio"
                checked={selectedStatus === "overdue"}
                onChange={() => { setSelectedStatus("overdue"); setPage(0); }}
              />
              <span className="ml-1">Overdue</span>
            </label>

          </div> */}

          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search Asset Name or Checklist"
            className="border p-2 w-[400px] rounded-lg border border-gray-300 border-1"
            value={searchText}
            onChange={handleSearch}
          />

          {/* FILTER BUTTON */}

          <button
            onClick={() => setShowFilter(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 fw-bold"
          >
            <Filter className="w-4 h-4 fw-bold" />
            Filter
          </button>
        </div>

        {/* FILTER POPUP */}

        {showFilter && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-lg font-semibold mb-4">Filter by Month</h2>

              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setPage(0);
                }}
                className="border p-2 rounded w-full"
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={clearFilter}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Clear
                </button>

                <button
                  onClick={() => setShowFilter(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TABLE */}

      {tasks.length === 0 ? (
  <div className="bg-white shadow rounded-lg p-10 text-center mt-4">
    <h2 className="text-xl font-semibold text-gray-600">
      No Submission Yet
    </h2>
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
