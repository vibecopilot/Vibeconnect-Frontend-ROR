import React, { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import Navbar from "../components/Navbar";
import SiteHeader from "../components/SiteHeader";
import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";
import {
  getAdminComplaints,
  getAdminExport,
  getComplaintsDrill,
  getTicketDashboard,
} from "../api";

import { BsEye } from "react-icons/bs";
import { BiEdit, BiFilterAlt } from "react-icons/bi";
import moment from "moment";
import { getItemInLocalStorage } from "../utils/localStorage";

import { useSelector } from "react-redux";
import { DNA } from "react-loader-spinner";
import TicketFilterModal from "../containers/modals/TicketFilterModal";

import { IoIosArrowDown } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";

import { FaInbox } from "react-icons/fa";

const Ticket = () => {
  const themeColor = useSelector((state) => state.theme.color);

  // ── reactive site ID — updated by SiteHeader on site switch ──
  const [activeSiteId, setActiveSiteId] = useState(
    () => getItemInLocalStorage("SITEID")
  );

  // keep the plain siteId alias used in the dashboard-card logic below
  const siteId = activeSiteId;

  /* =========================================================
      STATES
  ========================================================= */

  const [filteredData, setFilteredData] = useState([]);
  const [filterSearch, setFilterSearch] = useState([]);

  const [searchText, setSearchText] = useState("");

  const isTypeFilterActive = useRef(false);

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const [ticketTypeCounts, setTicketTypeCounts] = useState({});
  const [ticketStatusCounts, setTicketStatusCounts] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const [complaints, setComplaints] = useState([]);

  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [filterModal, setFilterModal] = useState(false);

  const [hideColumn, setHideColumn] = useState(false);

  const dropdownRef = useRef(null);

  const [showDashboardFilter, setShowDashboardFilter] = useState(false);

  const dashboardRef = useRef(null);

  /* =========================================================
      HELPERS
  ========================================================= */

  const getTimeAgo = (timestamp) => {
    const createdTime = moment(timestamp);
    const now = moment();

    const diff = now.diff(createdTime, "minutes");

    if (diff < 60) {
      return `${diff} minutes ago`;
    } else if (diff < 1440) {
      return `${Math.floor(diff / 60)} hours ago`;
    } else {
      return `${Math.floor(diff / 1440)} days ago`;
    }
  };

  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handlePerRowsChange = async (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  /* =========================================================
      TABLE COLUMNS
  ========================================================= */

  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/tickets/details/${row.id}`}>
            <BsEye size={15} />
          </Link>

          <Link to={`/edit/${row.id}`}>
            <BiEdit size={15} />
          </Link>
        </div>
      ),
    },

    {
      name: "Ticket Number",
      selector: (row) => row.ticket_number,
      sortable: true,
    },

    {
      name: "Building Name",
      selector: (row) => row.building_name,
      sortable: true,
    },

    {
      name: "Floor Name",
      selector: (row) => row.floor_name,
      sortable: true,
    },

    {
      name: "Unit Name",
      selector: (row) => row.unit || row.unit_name,
      sortable: true,
    },

    {
      name: "Customer Name",
      selector: (row) => row.created_by,
      sortable: true,
    },

    {
      name: "Category",
      selector: (row) => row.category_type || row.category,
      sortable: true,
    },

    {
      name: "Sub Category",
      selector: (row) => row.sub_category,
      sortable: true,
    },

    {
      name: "Title",
      selector: (row) => row.heading,
      sortable: true,
    },

    {
      name: "Status",
      selector: (row) => {
        const status = row.issue_status || row.status;

        if (status === "Oh Hold") return "On Hold";

        if (status === "Development Done") return "Completed";

        return status;
      },
      sortable: true,
    },

    {
      name: "Created By",
      selector: (row) => row.created_by,
      sortable: true,
    },

    {
      name: "Created On",
      selector: (row) => dateFormat(row.created_at),
      sortable: true,
    },

    {
      name: "Priority",
      selector: (row) => row.priority,
      sortable: true,
    },

    {
      name: "Assigned To",
      selector: (row) => row.assigned_to,
      sortable: true,
    },

    {
      name: "Ticket Type",
      selector: (row) => row.issue_type || row.complaint_type,
      sortable: true,
    },

    {
      name: "Total Time",
      selector: (row) => getTimeAgo(row.created_at),
      sortable: true,
    },
  ];

  /* =========================================================
      FILTER PARAMS
  ========================================================= */

  const [filterParams, setFilterParams] = useState({
    category_id: "",
    issueStatusId: "",
    priorityLevel: "",
    assign: "",
    createBy: "",
    building_id: "",
    floor_id: "",
    unit_id: "",
    startDate: "",
    endDate: "",
    globalSearch: "",
  });

  /* =========================================================
      DASHBOARD VISIBILITY
  ========================================================= */

  const [dashboardVisibility, setDashboardVisibility] = useState({
    "Total Tickets": true,
    Pending: true,
    "On Hold": true,
    Open: true,
    Closed: true,
    Received: true,
    Reopen: true,
    Completed: true,
    "Work in Progress": true,
    Complaint: true,
    Suggestion: true,
    Request: true,
  });

  const [columnVisibility, setColumnVisibility] = useState({
    Action: true,
    "Ticket Number": true,
    "Building Name": true,
    "Floor Name": true,
    "Unit Name": true,
    "Customer Name": true,
    Category: true,
    "Sub Category": true,
    Title: true,
    Status: true,
    "Created By": true,
    "Created On": true,
    Priority: true,
    "Assigned To": true,
    "Ticket Type": true,
    "Total Time": true,
  });

  const handleCheckboxChange = (column) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const handleDashboardCheckboxChange = (key) => {
    setDashboardVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  /* =========================================================
      CLOSE DROPDOWNS
  ========================================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dashboardRef.current &&
        !dashboardRef.current.contains(event.target)
      ) {
        setShowDashboardFilter(false);
      }

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setHideColumn(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* =========================================================
      TABLE STYLE
  ========================================================= */

  const customStyle = {
    headRow: {
      style: {
        background: themeColor,
        color: "white",
        fontSize: "10px",
      },
    },

    headCells: {
      style: {
        textTransform: "uppercase",
      },
    },

    cells: {
      style: {
        fontSize: "14px",
      },
    },
  };

  /* =========================================================
      FETCH DATA
  ========================================================= */

  const fetchData = async (
    page,
    perPage,
    search = "",
    status = "all",
    filters = {}
  ) => {
    setIsLoading(true);

    try {
      const response = await getAdminComplaints(
        page,
        perPage,
        search,
        status,
        filters
      );

      const complaints = response?.data?.complaints || [];

      const totalCount = response?.data?.count || 0;

      setCurrentPage(page);

      setFilteredData(complaints);

      setComplaints(complaints);

      setTotalRows(totalCount);

      const typeCounts = complaints.reduce((acc, curr) => {
        const type = curr.issue_type || curr.complaint_type;

        acc[type] = (acc[type] || 0) + 1;

        return acc;
      }, {});

      setTicketTypeCounts(typeCounts);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================================================
      FETCH LIST
  ========================================================= */

  useEffect(() => {
    if (isTypeFilterActive.current) return;

    if (selectedType !== "all") return;

    const apiStatus = getApiStatus(selectedStatus);

    fetchData(currentPage, perPage, searchText, apiStatus, {
      ...filterParams,
    });
  }, [
    currentPage,
    perPage,
    searchText,
    selectedStatus,
    filterParams,
    selectedType,
    activeSiteId, // ✅ re-fetch when site changes
  ]);

  /* =========================================================
      STATUS CARD CLICK
  ========================================================= */

  const handleStatusCardClick = (statusKey) => {
    isTypeFilterActive.current = false;

    if (statusKey === "Total Tickets") {
      setSelectedStatus("all");
    } else {
      setSelectedStatus(statusKey);
    }

    setSelectedType("all");

    setCurrentPage(1);
  };

  /* =========================================================
      TYPE CARD CLICK
  ========================================================= */

  const handleTypeCardClick = async (typeKey) => {
    isTypeFilterActive.current = true;

    setSelectedType(typeKey);

    setSelectedStatus("all");

    setCurrentPage(1);

    setIsLoading(true);

    try {
      const response = await getComplaintsDrill(
        "type",
        typeKey,
        siteId,
        1
      );

      const data = response?.data;

      const complaints = data?.by_type?.[typeKey]?.records || [];

      const totalCount = data?.by_type?.[typeKey]?.count || 0;

      setFilteredData(complaints);

      setComplaints(complaints);

      setTotalRows(totalCount);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================================================
      DASHBOARD DATA
  ========================================================= */

  const [ticketTypes, setTicketsTypes] = useState({});
  const [statusData, setStatusData] = useState({});

  const allDashboardCards = [
    {
      key: "Total Tickets",
      value: statusData.total || 0,
      color: "border-blue-300 bg-blue-100",
    },

    {
      key: "Pending",
      value: statusData.Pending || 0,
      color: "border-red-300 bg-red-100",
    },

    {
      key: "On Hold",
      value: statusData["On Hold"] || statusData["Oh Hold"] || 0,
      color: "border-cyan-300 bg-cyan-100",
    },

    {
      key: "Open",
      value: statusData.Open || 0,
      color: "border-red-300 bg-red-100",
    },

    {
      key: "Closed",
      value: statusData.Closed || 0,
      color: "border-blue-300 bg-blue-100",
    },

    {
      key: "Received",
      value:
        siteId === 74
          ? statusData.Received
          : statusData.received || 0,

      color: "border-green-300 bg-green-100",
    },

    {
      key: "Reopen",
      value: statusData.Reopen || 0,
      color: "border-yellow-300 bg-yellow-100",
    },

    {
      key: "Completed",
      value:
        siteId === 74
          ? statusData.Completed
          : statusData["Development Done"] || 0,

      color: "border-pink-300 bg-pink-100",
    },

    {
      key: "Work in Progress",
      value:
        statusData["Work In Progress"] ||
        statusData["Work in Progress"] ||
        0,

      color: "border-purple-300 bg-purple-100",
    },
  ];

  const dashboardCards =
    siteId === 74
      ? allDashboardCards.filter((card) =>
          [
            "Total Tickets",
            "Pending",
            "Completed",
            "Work in Progress",
            "Received",
          ].includes(card.key)
        )
      : allDashboardCards;

  const filteredDashboardKeys =
    siteId === 74
      ? [
          "Total Tickets",
          "Pending",
          "Completed",
          "Work in Progress",
          "Received",
          "Complaint",
          "Suggestion",
          "Request",
        ]
      : Object.keys(dashboardVisibility);

  const ticketTypeCards = [
    {
      key: "Complaint",
      value: ticketTypes.Complaint || 0,
      color: "border-red-300 bg-red-100",
    },

    {
      key: "Suggestion",
      value: ticketTypes.Suggestion || 0,
      color: "border-green-300 bg-green-100",
    },

    {
      key: "Request",
      value: ticketTypes.Request || 0,
      color: "border-blue-300 bg-blue-100",
    },
  ];

  /* =========================================================
      DASHBOARD COUNT
  ========================================================= */

  const fetchDashboardCounts = async (filters = {}) => {
    try {
      const ticketInfoResp = await getTicketDashboard({ filters });

      setStatusData({
        ...ticketInfoResp.data.by_status,
        total: ticketInfoResp.data.total,
      });

      setTicketsTypes(ticketInfoResp.data.by_type);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboardCounts(filterParams);
  }, [filterParams, activeSiteId]); // ✅ re-fetch dashboard counts on site change

  /* =========================================================
      SEARCH
  ========================================================= */

  const handleSearch = (e) => {
    setSearchText(e.target.value);

    setCurrentPage(1);
  };

  /* =========================================================
      API STATUS
  ========================================================= */

  const getApiStatus = (status) => {
    if (status === "all") return "all";

    if (status === "Completed") {
      return siteId === 74
        ? "Completed"
        : "Development Done";
    }

    if (status === "On Hold") {
      return "Oh Hold";
    }

    return status;
  };

  /* =========================================================
      PAGE CHANGE
  ========================================================= */

  const handlePageChange = async (page) => {
    setCurrentPage(page);

    if (selectedType !== "all") {
      setIsLoading(true);

      try {
        const response = await getComplaintsDrill(
          "type",
          selectedType,
          siteId,
          page
        );

        const data = response?.data;

        const complaints =
          data?.by_type?.[selectedType]?.records || [];

        const totalCount =
          data?.by_type?.[selectedType]?.count || 0;

        const formattedData = complaints.map((item) => ({
          ...item,
          issue_type: item.complaint_type,
          issue_status: item.status,
          category_type: item.category,
          unit: item.unit_name,
        }));

        setFilteredData(formattedData);

        setTotalRows(totalCount);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      const apiStatus = getApiStatus(selectedStatus);

      fetchData(page, perPage, searchText, apiStatus, {
        ...filterParams,
      });
    }
  };

  /* =========================================================
      EXPORT
  ========================================================= */

  const exportAllToExcel = async () => {
    try {
      const apiStatus = getApiStatus(selectedStatus);

      const response = await getAdminExport(
        filterParams,
        searchText,
        apiStatus
      );

      const blob = new Blob([response.data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        `tickets_export_${
          new Date().toISOString().split("T")[0]
        }.xlsx`
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  };

  /* =========================================================
      UI
  ========================================================= */

  return (
    <section className="flex bg-gray-50 min-h-screen">
      <Navbar />

      <div className="w-full flex flex-col overflow-hidden pb-10">

        {/* Shared branded header with reactive site-switcher */}
        <SiteHeader
          onSiteChange={(id) => {
            setActiveSiteId(id);       // triggers both data useEffects
            setCurrentPage(1);         // reset to first page
            setSelectedStatus("all");
            setSelectedType("all");
            isTypeFilterActive.current = false;
          }}
        />

        {/* =========================================================
            CONTENT
        ========================================================= */}

        <div className="px-3 sm:px-5 mt-4">

          {/* DASHBOARD CARDS */}

          <div className="flex flex-wrap gap-3 mb-6">
            {dashboardCards
              .filter((item) => dashboardVisibility[item.key])
              .map((item) => (
                <div
                  key={item.key}
                  onClick={() =>
                    handleStatusCardClick(item.key)
                  }
                  className={`rounded-2xl border-2 px-6 py-4 shadow-sm text-center min-w-[150px] cursor-pointer hover:scale-105 transition ${item.color}`}
                >
                  <p className="text-sm font-semibold text-gray-700">
                    {item.key}
                  </p>

                  <p className="text-xl font-bold text-gray-900 mt-1">
                    {item.value}
                  </p>
                </div>
              ))}

            {ticketTypeCards
              .filter((item) => dashboardVisibility[item.key])
              .map((item) => (
                <div
                  key={item.key}
                  onClick={() => handleTypeCardClick(item.key)}
                  className={`rounded-2xl border-2 px-6 py-4 shadow-sm text-center min-w-[150px] cursor-pointer hover:scale-105 transition ${item.color}`}
                >
                  <p className="text-sm font-semibold text-gray-700">
                    {item.key}
                  </p>

                  <p className="text-xl font-bold text-gray-900 mt-1">
                    {item.value}
                  </p>
                </div>
              ))}
          </div>

          {/* SEARCH + BUTTONS */}

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
            <div className="flex justify-between items-center w-full gap-4 flex-wrap">

              {/* SEARCH */}

              <div className="flex w-full md:w-[40%]">
                <input
                  type="text"
                  placeholder="Search by Title, Ticket Number, Category, Priority..."
                  className="border border-gray-300 w-full rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={searchText}
                  onChange={handleSearch}
                />
              </div>

              {/* BUTTONS */}

              <div className="flex gap-2 flex-wrap justify-end w-full md:w-auto">

                <Link
                  to={"/tickets/create-ticket"}
                  style={{ background: themeColor }}
                  className="text-white px-4 py-3 rounded-xl flex items-center gap-2 shadow-sm"
                >
                  <PiPlusCircle size={20} />
                  Add
                </Link>

                <button
                  className="text-white px-4 py-3 flex gap-2 items-center rounded-xl shadow-sm"
                  style={{ background: themeColor }}
                  onClick={() =>
                    setFilterModal(!filterModal)
                  }
                >
                  <BiFilterAlt />
                  Filter
                </button>

                {/* HIDE COLUMNS */}

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() =>
                      setHideColumn(!hideColumn)
                    }
                    style={{ background: themeColor }}
                    className="text-white px-4 py-3 flex gap-2 items-center rounded-xl shadow-sm"
                  >
                    Hide Columns

                    {hideColumn ? (
                      <IoIosArrowDown />
                    ) : (
                      <MdKeyboardArrowRight />
                    )}
                  </button>

                  {hideColumn && (
                    <div className="absolute right-0 top-14 bg-white border rounded-2xl shadow-lg w-64 max-h-64 overflow-y-auto z-10 p-2">
                      {Object.keys(columnVisibility).map(
                        (column) => (
                          <label key={column}>
                            <div className="flex gap-4 px-3 py-2 hover:bg-gray-50 rounded-lg">
                              <input
                                type="checkbox"
                                checked={
                                  columnVisibility[column]
                                }
                                onChange={() =>
                                  handleCheckboxChange(
                                    column
                                  )
                                }
                              />

                              <div className="text-sm">
                                {column}
                              </div>
                            </div>
                          </label>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* EXPORT */}

                <button
                  className="text-white px-4 py-3 rounded-xl shadow-sm"
                  onClick={exportAllToExcel}
                  style={{ background: themeColor }}
                >
                  Export
                </button>

                {/* DASHBOARD FILTER */}

                <div className="relative" ref={dashboardRef}>
                  <button
                    onClick={() =>
                      setShowDashboardFilter(
                        !showDashboardFilter
                      )
                    }
                    style={{ background: themeColor }}
                    className="text-white px-4 py-3 flex gap-2 items-center rounded-xl shadow-sm"
                  >
                    Dashboard Filter

                    {showDashboardFilter ? (
                      <IoIosArrowDown />
                    ) : (
                      <MdKeyboardArrowRight />
                    )}
                  </button>

                  {showDashboardFilter && (
                    <div className="absolute right-0 top-14 bg-white border rounded-2xl shadow-lg w-64 max-h-64 overflow-y-auto z-10 p-2">
                      {filteredDashboardKeys.map((item) => (
                        <label key={item}>
                          <div className="flex gap-4 px-3 py-2 hover:bg-gray-50 rounded-lg">
                            <input
                              type="checkbox"
                              checked={
                                dashboardVisibility[item]
                              }
                              onChange={() =>
                                handleDashboardCheckboxChange(
                                  item
                                )
                              }
                            />

                            <div className="text-sm">
                              {item}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* TABLE */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <DNA
                  visible={true}
                  height="120"
                  width="120"
                  ariaLabel="dna-loading"
                />
              </div>
            ) : filteredData.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-10 py-8 shadow-sm">
                  <FaInbox className="text-5xl text-gray-400" />

                  <p className="text-gray-600 text-sm font-medium">
                    No submissions here
                  </p>

                  <p className="text-gray-400 text-xs">
                    Once submissions are available,
                    they will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <DataTable
                responsive
                columns={columns.filter(
                  (column) =>
                    columnVisibility[column.name]
                )}
                data={filteredData}
                customStyles={customStyle}
                fixedHeader
                fixedHeaderScrollHeight="500px"
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                paginationPerPage={perPage}
                paginationDefaultPage={currentPage}
                paginationRowsPerPageOptions={[
                  10,
                  20,
                  30,
                  50,
                ]}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={
                  handlePerRowsChange
                }
              />
            )}
          </div>

        </div>

        {/* FILTER MODAL */}

        {filterModal && (
          <TicketFilterModal
            onclose={() => setFilterModal(false)}
            fetchData={fetchData}
            currentPage={currentPage}
            perPage={perPage}
            setFilterParams={setFilterParams}
            setSearchText={setSearchText}
            setSelectedStatus={setSelectedStatus}
            setCurrentPage={setCurrentPage}
            filterParams={filterParams}
          />
        )}
      </div>
    </section>
  );
};

export default Ticket;