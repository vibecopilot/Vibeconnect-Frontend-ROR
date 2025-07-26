import React, { useEffect, useState } from "react";
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
    current_page: 1
  });
  const [loading, setLoading] = useState(false);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const orgId = getItemInLocalStorage("HRMSORGID");

  useEffect(() => {
    fetchEventUsers(1);
  }, [perPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Implement search logic here if needed
    // You can debounce this and call API with search parameter
  };

  const handlePerPageChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setPagination(prev => ({ ...prev, current_page: 1 }));
    fetchEventUsers(1, newPerPage);
  };

  const fetchEventUsers = async (page = 1, itemsPerPage = perPage) => {
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
        current_page: responseData.current_page || page
      });
    } catch (error) {
      console.error("Error fetching event users:", error);
      // Set empty data on error
      setEventUsersData([]);
      setPagination({
        total_entries: 0,
        total_pages: 1,
        current_page: 1
      });
    } finally {
      setLoading(false);
    }
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
      accepted: "bg-blue-100 text-blue-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[rsvp] || 'bg-gray-100 text-gray-800'}`}>
        {rsvp?.charAt(0).toUpperCase() + rsvp?.slice(1)}
      </span>
    );
  };

  const handlePageChange = (page) => {
    fetchEventUsers(page, perPage);
  };

  const column = [
    { 
      name: "ID", 
      selector: (row) => row.id, 
      sortable: true,
      width: "80px"
    },
    { 
      name: "User Name", 
      selector: (row) => row.user_name, 
      sortable: true 
    },
    {
      name: "Event ID",
      selector: (row) => row.event_id,
      sortable: true,
      width: "100px"
    },
    {
      name: "RSVP Status",
      selector: (row) => getRSVPStatus(row.rsvp),
      sortable: true,
      width: "120px"
    },
    {
      name: "Created At",
      selector: (row) => dateTimeFormat(row.created_at),
      sortable: true,
      width: "180px"
    },
    {
      name: "Updated At",
      selector: (row) => dateTimeFormat(row.updated_at),
      sortable: true,
      width: "180px"
    },
    {
      name: "Actions",
      cell: (row) => (
        <Link 
          to={row.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800"
        >
          <ImEye size={16} />
        </Link>
      ),
      width: "80px"
    }
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
                Total: {pagination.total_entries} entries | Page {pagination.current_page} of {pagination.total_pages}
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
            pagination
            paginationServer
            paginationTotalRows={pagination.total_entries}
            paginationDefaultPage={pagination.current_page}
            paginationPerPage={perPage}
            paginationRowsPerPageOptions={[5, 10, 20, 50]}
            onChangeRowsPerPage={handlePerPageChange}
            onChangePage={handlePageChange}
          />
          
          {/* Pagination Controls */}
          {pagination.total_pages > 1 && (
            <div className="flex justify-center items-center mt-4 gap-2">
              <button
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page <= 1 || loading}
              >
                Previous
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`px-3 py-1 rounded ${
                      page === pagination.current_page
                        ? 'text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    style={{
                      backgroundColor: page === pagination.current_page ? themeColor : undefined
                    }}
                    onClick={() => handlePageChange(page)}
                    disabled={loading}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page >= pagination.total_pages || loading}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RmbAttendance;
