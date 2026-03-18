import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/table/Table";
import { BsEye } from "react-icons/bs";
import { API_URL, getVibeBackground } from "../../api";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import AssetNav from "../../components/navbars/AssetNav";
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

  const token = getItemInLocalStorage("TOKEN");

  /* ---------------- FETCH TASK ---------------- */
  const fetchPPMTask = async () => {
    toast.loading("Please wait...");
    try {
      let url = `https://admin.vibecopilot.ai/activities.json?q[checklist_ctype_eq]=ppm&token=${token}&page=${
        page + 1
      }&per_page=${rowsPerPage}`;

      // SEARCH
      if (searchText) {
        url += `&q[asset_name_or_checklist_name_cont]=${searchText}`;
      }

      // STATUS
      if (selectedStatus !== "all") {
        url += `&q[status_eq]=${selectedStatus}`;
      }

      // MONTH FILTER
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

      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to fetch tasks");
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

  /* ---------------- USE EFFECTS ---------------- */
  useEffect(() => {
    fetchPPMTask();
  }, [page, rowsPerPage, selectedStatus, selectedMonth]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchPPMTask();
    }, 500);
    return () => clearTimeout(delay);
  }, [searchText]);

  useEffect(() => {
    getBackground();
  }, []);

  /* ---------------- HANDLERS ---------------- */
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPage(0);
  };

  /* ---------------- TABLE COLUMNS ---------------- */
  const columns = [
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
  ];

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

        {/* FILTERS */}
        <div className="flex flex-wrap gap-3 my-3 items-center">
          <input
            type="text"
            placeholder="Search Asset / Checklist"
            className="border p-2 rounded w-80"
            value={searchText}
            onChange={handleSearch}
          />

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(0);
            }}
            className="border p-2 rounded"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="complete">Completed</option>
            <option value="overdue">Overdue</option>
          </select>

          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              setPage(0);
            }}
            className="border p-2 rounded"
          />
        </div>

        {/* TABLE */}
        <Table columns={columns} data={tasks} isPagination={false} />

        {/* PAGINATION */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            className="px-3 py-1 border rounded mr-2"
          >
            Prev
          </button>

          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default PPMTask;