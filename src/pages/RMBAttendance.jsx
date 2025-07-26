import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import DataTable from "react-data-table-component";
import { ImEye } from "react-icons/im";
import { Link } from "react-router-dom";
import Modal from "../containers/modals/Modal";
import Table from "../components/table/Table";
import { useSelector } from "react-redux";
import { getItemInLocalStorage } from "../utils/localStorage";
// Import your API function here
import { RmbAttendance as getRmbAttendanceData } from "../api";

import * as XLSX from "xlsx";
const RmbAttendance = () => {
  const [modal, setModal] = useState(false);
  const [eventUsersData, setEventUsersData] = useState([]);
  const [pagination, setPagination] = useState({
    total_entries: 0,
    total_pages: 1,
    current_page: 1,
  });
  const [loading, setLoading] = useState(false);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const orgId = getItemInLocalStorage("HRMSORGID");

  const fetchEventUsers = useCallback(
    async (page = 1, itemsPerPage = perPage) => {
      setLoading(true);
      try {
        // Call your actual API with pagination
        const response = await getRmbAttendanceData(page, itemsPerPage);
        console.log("API Response:", response.data);

        // Extract data from API response
        const responseData = response.data;

        setEventUsersData(responseData.event_users || []);
        setPagination({
          total_entries: responseData.total_entries || 0,
          total_pages: responseData.total_pages || 1,
          current_page: responseData.current_page || page,
        });
      } catch (error) {
        console.error("Error fetching event users:", error);
        // Set empty data on error
        setEventUsersData([]);
        setPagination({
          total_entries: 0,
          total_pages: 1,
          current_page: 1,
        });
      } finally {
        setLoading(false);
      }
    },
    [perPage]
  );

  useEffect(() => {
    fetchEventUsers(1);
  }, [fetchEventUsers]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Implement search logic here if needed
    // You can debounce this and call API with search parameter
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    fetchEventUsers(1, newPerPage);
  };

  const dateTimeFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getRSVPStatus = (rsvp) => {
    const statusColors = {
      attended: "bg-green-100 text-green-800",
      declined: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-blue-100 text-blue-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusColors[rsvp] || "bg-gray-100 text-gray-800"
        }`}
      >
        {rsvp?.charAt(0).toUpperCase() + rsvp?.slice(1)}
      </span>
    );
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, current_page: page }));
    fetchEventUsers(page);
  };

  const column = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "User Name",
      selector: (row) => row.user_name,
      sortable: true,
    },
    {
      name: "Event ID",
      selector: (row) => row.event_id,
      sortable: true,
      width: "100px",
    },
    {
      name: "RSVP Status",
      selector: (row) => getRSVPStatus(row.rsvp),
      sortable: true,
      width: "120px",
    },
    {
      name: "Created At",
      selector: (row) => dateTimeFormat(row.created_at),
      sortable: true,
      width: "180px",
    },
    {
      name: "Updated At",
      selector: (row) => dateTimeFormat(row.updated_at),
      sortable: true,
      width: "180px",
    },
    // {
    //   name: "Actions",
    //   cell: (row) => (
    //     <Link
    //       to={row.url}
    //       target="_blank"
    //       rel="noopener noreferrer"
    //       className="text-blue-600 hover:text-blue-800"
    //     >
    //       <ImEye size={16} />
    //     </Link>
    //   ),
    //   width: "80px",
    // },
  ];

  document.title = `Event Users - Vibe Connect`;
  const themeColor = useSelector((state) => state.theme.color);

  const exportAllToExcel = async () => {
    const mappedData = eventUsersData.map((user) => ({
      ID: user.id,
      "User Name": user.user_name,
      "Event ID": user.event_id,
      "User ID": user.user_id,
      "RSVP Status": user.rsvp,
      "Created At": dateTimeFormat(user.created_at),
      "Updated At": dateTimeFormat(user.updated_at),
    }));
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileName = "event_users_data.xlsx";
    const ws = XLSX.utils.json_to_sheet(mappedData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
  };
  return (
    <section className="flex ">
      <Navbar />
      <div className="w-full flex md:mx-3 flex-col overflow-hidden">
        <div className=" flex mx-3 flex-col my-5 ">
          <div className="flex md:flex-row flex-col justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search By User Name"
                value={searchTerm}
                onChange={handleSearch}
                className="border-2 p-2 md:w-96 border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-600">
                Total: {pagination.total_entries} entries | Page{" "}
                {pagination.current_page} of {pagination.total_pages}
              </div>
              <button
                className="bg-black w-20 rounded-lg text-white p-2"
                onClick={exportAllToExcel}
                style={{ background: themeColor }}
                disabled={loading}
              >
                {loading ? "Loading..." : "Export"}
              </button>
            </div>
          </div>

          <Table
            columns={column}
            data={eventUsersData}
            progressPending={loading}
            pagination={false}
          />

          {/* Custom Pagination Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
            {/* Rows per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <select
                value={perPage}
                onChange={(e) => handlePerPageChange(parseInt(e.target.value))}
                className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-600">
                {(pagination.current_page - 1) * perPage + 1}-
                {Math.min(
                  pagination.current_page * perPage,
                  pagination.total_entries
                )}{" "}
                of {pagination.total_entries}
              </span>
            </div>

            {/* Page navigation */}
            {pagination.total_pages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page <= 1 || loading}
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {(() => {
                    const pages = [];
                    const currentPage = pagination.current_page;
                    const totalPages = pagination.total_pages;

                    console.log('Current Page:', currentPage, 'Total Pages:', totalPages); // Debug log

                    // Show first page
                    if (currentPage > 3) {
                      pages.push(
                        <button
                          key={1}
                          className={`px-3 py-1 rounded text-sm ${
                            1 === currentPage
                              ? "text-white"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                          style={{
                            backgroundColor: 1 === currentPage ? themeColor : "#e5e7eb",
                          }}
                          onClick={() => handlePageChange(1)}
                          disabled={loading}
                        >
                          1
                        </button>
                      );
                      if (currentPage > 4) {
                        pages.push(
                          <span key="dots1" className="px-2 text-gray-500">
                            ...
                          </span>
                        );
                      }
                    }

                    // Show pages around current page
                    for (
                      let i = Math.max(1, currentPage - 2);
                      i <= Math.min(totalPages, currentPage + 2);
                      i++
                    ) {
                      const isCurrentPage = i === currentPage;
                      pages.push(
                        <button
                          key={i}
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            isCurrentPage
                              ? "text-black shadow-md"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          }`}
                          style={{
                            backgroundColor: isCurrentPage ? themeColor : "#e5e7eb",
                          }}
                          onClick={() => handlePageChange(i)}
                          disabled={loading}
                        >
                          {i}
                        </button>
                      );
                    }

                    // Show last page
                    if (currentPage < totalPages - 2) {
                      if (currentPage < totalPages - 3) {
                        pages.push(
                          <span key="dots2" className="px-2 text-gray-500">
                            ...
                          </span>
                        );
                      }
                      pages.push(
                        <button
                          key={totalPages}
                          className={`px-3 py-1 rounded text-sm ${
                            totalPages === currentPage
                              ? "text-white"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                          style={{
                            backgroundColor: totalPages === currentPage ? themeColor : "#e5e7eb",
                          }}
                          onClick={() => handlePageChange(totalPages)}
                          disabled={loading}
                        >
                          {totalPages}
                        </button>
                      );
                    }

                    return pages;
                  })()}
                </div>

                <button
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={
                    pagination.current_page >= pagination.total_pages || loading
                  }
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RmbAttendance;
