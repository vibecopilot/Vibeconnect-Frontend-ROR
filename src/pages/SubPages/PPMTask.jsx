import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import toast from "react-hot-toast";
import TablePagination from "@mui/material/TablePagination";

import Table from "../../components/table/Table";
import Navbar from "../../components/Navbar";
import AssetNav from "../../components/navbars/AssetNav";

import { API_URL, getPPMTask, getVibeBackground } from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";

const PPMTask = () => {
  const [tasks, setTasks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const [background, setBackground] = useState("");

  const token = getItemInLocalStorage("TOKEN");

  /* -------------------- FETCH TASKS -------------------- */
  const fetchPPMTasks = useCallback(async () => {
    toast.loading("Please wait");

    try {
      const response = await getPPMTask({
        token,
        page,
        rowsPerPage,
        searchText,
        selectedStatus,
      });

      toast.dismiss();

      const activities = (response.data.activities || [])
        .filter((a) => a.asset_name)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setTasks(activities);
      setTotal(response.data.total_count || 0);
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error("Failed to fetch PPM tasks");
    }
  }, [token, page, rowsPerPage, searchText, selectedStatus]);

  useEffect(() => {
    fetchPPMTasks();
  }, [fetchPPMTasks]);

  /* -------------------- SEARCH (DEBOUNCED) -------------------- */
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(0);
      fetchPPMTasks();
    }, 500);

    return () => clearTimeout(delay);
  }, [searchText]);

  /* -------------------- BACKGROUND IMAGE -------------------- */
  useEffect(() => {
    const loadBackground = async () => {
      try {
        const userId = getItemInLocalStorage("VIBEUSERID");
        const res = await getVibeBackground(userId);

        if (res?.success && res?.data?.image) {
          setBackground(API_URL + res.data.image);
        }
      } catch (err) {
        console.error("Background error:", err);
      }
    };

    loadBackground();
  }, []);

  /* -------------------- TABLE CONFIG -------------------- */
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
  ];

  /* -------------------- PAGINATION -------------------- */
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /* -------------------- STATUS FILTER -------------------- */
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setPage(0);
  };

  return (
    <section
      className="flex"
      style={{
        background: background
          ? `url(${background}) no-repeat center center / cover`
          : "none",
      }}
    >
      <Navbar />

      <div className="p-4 w-full flex flex-col">
        <AssetNav />

        {/* FILTER BAR */}
        <div className="flex flex-wrap gap-4 items-center my-3">
          <div className="flex gap-3 border rounded-md p-2">
            {["all", "pending", "complete", "overdue"].map((status) => (
              <label key={status} className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="status"
                  checked={selectedStatus === status}
                  onChange={() => handleStatusChange(status)}
                />
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </label>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search by Asset or Checklist"
            className="border p-2 w-96 rounded-lg"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <Table columns={columns} data={tasks} pagination={false} />

        {/* PAGINATION */}
        <div className="flex justify-end bg-white border-t mt-2">
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            showFirstButton
            showLastButton
          />
        </div>
      </div>
    </section>
  );
};

export default PPMTask;