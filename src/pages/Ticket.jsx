import React, { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import Navbar from "../components/Navbar";
import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";
import {
  getAdminComplaints,
  getAdminExport,
  getAdminPerPageComplaints,
  getComplaints,
  getComplaintsDrill,
  getTicketDashboard,
} from "../api";
import { BsEye } from "react-icons/bs";
import { BiEdit, BiFilterAlt } from "react-icons/bi";
import moment from "moment";
import { getItemInLocalStorage } from "../utils/localStorage";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import Table from "../components/table/Table";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { DNA } from "react-loader-spinner";
import TicketFilterModal from "../containers/modals/TicketFilterModal";
import { IoIosArrowDown } from "react-icons/io";
import { color } from "highcharts";
import { FaInbox } from "react-icons/fa";
const Ticket = () => {

  const siteId = getItemInLocalStorage("SITEID");
  const [filteredData, setFilteredData] = useState([]);
  const [filterSearch, setFilterSearch] = useState([]);

  const [searchText, setSearchText] = useState("");
  const isTypeFilterActive = useRef(false);
  const [edit, setEdit] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [ticketTypeCounts, setTicketTypeCounts] = useState({});
  const [ticketStatusCounts, setTicketStatusCounts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [exportAllTickets, setExportAllTickets] = useState([]);
  const allTicketTypes = ["Complaint", "Request", "Suggestion"];
  // const [filterSearch, setFilter] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterModal, setFilterModal] = useState(false);
  const [hideColumn, setHideColumn] = useState(false);
  const dropdownRef = useRef(null);
  const [showDashboardFilter, setShowDashboardFilter] = useState(false);
  const dashboardRef = useRef(null);

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
    setCurrentPage(1); // reset to first page
  };

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
    { name: "Floor Name", selector: (row) => row.floor_name, sortable: true },
    { name: "Unit Name", selector: (row) => row.unit || row.unit_name, sortable: true },
    {
      name: "Customer Name",
      selector: (row) => row.created_by,
      sortable: true,
    },
    { name: "Category", selector: (row) => row.category_type || row.category, sortable: true },
    {
      name: "Sub Category",
      selector: (row) => row.sub_category,
      sortable: true,
    },
    { name: "Title", selector: (row) => row.heading, sortable: true },
    // {
    //   name: "Description",
    //   selector: (row) => row.text,
    //   sortable: true,
    //   // maxWidth: "500px",
    // },
    {
      name: "Status",
      selector: (row) => {
        const status = row.issue_status || row.status;

        // ✅ Fix mapping for UI
        if (status === "Oh Hold") return "On Hold";
        if (status === "Development Done") return "Completed";

        return status;
      },
      sortable: true,
    }, { name: "Created By", selector: (row) => row.created_by, sortable: true },
    {
      name: "Created On",
      selector: (row) => dateFormat(row.created_at),
      sortable: true,
    },
    { name: "Priority", selector: (row) => row.priority, sortable: true },
    { name: "Assigned To", selector: (row) => row.assigned_to || row.assigned_to, sortable: true },
    { name: "Ticket Type", selector: (row) => row.issue_type || row.complaint_type, sortable: true },
    // {
    //   name: "Response TAT",
    //   selector: (row) => row.response_TAT,
    //   sortable: true,
    // },
    // {
    //   name: "Response Time",
    //   selector: (row) => row.response_time,
    //   sortable: true,
    // },
 
    {
      name: "Total Time",
      selector: (row) => getTimeAgo(row.created_at),
      sortable: true,
    },
  ];

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
    "Response TAT": true,
    "Response Time": true,
    "Resolution TAT": true,
    "Resolution Time": true,
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dashboardRef.current &&
        !dashboardRef.current.contains(event.target)
      ) {
        setShowDashboardFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  //custom style
  const themeColor = useSelector((state) => state.theme.color);
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
        // fontWeight: "bold",
        fontSize: "14px",
      },
    },
  };

  const fetchData = async (page, perPage, search = "", status = "all", filters = {}) => {
    setIsLoading(true);
    try {
      const response = await getAdminComplaints(page, perPage, search, status, filters);

      const complaints = response?.data?.complaints || [];
      const totalCount = response?.data?.count || 0;

      setCurrentPage(page);
      setFilteredData(complaints);
      setComplaints(complaints);
      setTotalRows(totalCount);

      // const statusCounts = complaints.reduce((acc, curr) => {
      //   acc[curr.issue_status] = (acc[curr.issue_status] || 0) + 1;
      //   return acc;
      // }, {});
      // setTicketStatusCounts(statusCounts);

      // const typeCounts = complaints.reduce((acc, curr) => {
      //   acc[curr.issue_type] = (acc[curr.issue_type] || 0) + 1;
      //   return acc;
      // }, {});
      setTicketTypeCounts(typeCounts);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // ❌ Skip normal API if type filter is active
    if (isTypeFilterActive.current) return;
    if (selectedType !== "all") return;

    const apiStatus = getApiStatus(selectedStatus);

    fetchData(currentPage, perPage, searchText, apiStatus, {
      ...filterParams,
    });
  }, [currentPage, perPage, searchText, selectedStatus, filterParams, selectedType]);

  const handleStatusCardClick = (statusKey) => {
    isTypeFilterActive.current = false;   // ✅ allow normal API again

    if (statusKey === "Total Tickets") {
      setSelectedStatus("all");
    } else {
      setSelectedStatus(statusKey);
    }

    setSelectedType("all"); // reset type filter
    setCurrentPage(1);
  };

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

      // ✅ FIX HERE
      const complaints =
        data?.by_type?.[typeKey]?.records || [];

      const totalCount =
        data?.by_type?.[typeKey]?.count || 0;

      setFilteredData(complaints);
      setComplaints(complaints);
      setTotalRows(totalCount);
    } catch (error) {
      console.error("Error fetching type-wise data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const [ticketTypes, setTicketsTypes] = useState({});
  const [statusData, setStatusData] = useState({});

  const allDashboardCards = [
    { key: "Total Tickets", value: statusData.total || 0, color: "border border-blue-300 border-3 bg-blue-100" },
    { key: "Pending", value: statusData.Pending || 0, color: "border border-3 border-red-300 bg-red-100" },
    { key: "On Hold", value: statusData["On Hold"] || statusData["Oh Hold"] || 0, color: "border-cyan-300 border border-3 bg-cyan-100" },
    { key: "Open", value: statusData.Open || 0, color: "border-red-300 border border-3 bg-red-100" },
    { key: "Closed", value: statusData.Closed || 0, color: "border-blue-300 border border-3 bg-blue-100" },
    { key: "Received", value: siteId === 74 ? statusData.Received : statusData.received || 0, color: "border-green-300 border border-3 bg-green-100" },
    { key: "Reopen", value: statusData.Reopen || 0, color: "border-yellow-300 border border-3 bg-yellow-100" },
    { key: "Completed", value: siteId === 74 ? statusData.Completed : statusData["Development Done"] || 0, color: "border-pink-300 border border-3 bg-pink-100" },
    { key: "Work in Progress", value: statusData["Work In Progress"] || statusData["Work in Progress"] || 0, color: "border-purple-300 border border-3 bg-purple-100" },
  ];

  const dashboardCards =
    siteId === 74
      ? allDashboardCards.filter(card =>
        ["Total Tickets", "Pending", "Completed", "Work in Progress", "Received"].includes(card.key)
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
    { key: "Complaint", value: ticketTypes.Complaint || 0, color: "border-red-300 border border-3 bg-red-100" },
    { key: "Suggestion", value: ticketTypes.Suggestion || 0, color: "border-green-300 border border-3 bg-green-100" },
    { key: "Request", value: ticketTypes.Request || 0, color: "border-blue-300 border border-3 bg-blue-100" },
  ];


  const normalizeKeys = (obj = {}) => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const cleanKey = key?.trim()?.toLowerCase();
      acc[cleanKey] = (acc[cleanKey] || 0) + value;
      return acc;
    }, {});
  };



  useEffect(() => {
    const fetchTicketInfo = async () => {
      try {
        const ticketInfoResp = await getTicketDashboard();

        setStatusData({
          ...ticketInfoResp.data.by_status,
          total: ticketInfoResp.data.total,
        });

        setTicketsTypes(ticketInfoResp.data.by_type);
      } catch (error) {
        console.log(error);
      }
    };


    const filterSearchStatus = async () => {
      try {
        const searchAllTickets = await getAdminComplaints();
        const searchResp = searchAllTickets?.data?.complaints;
        setFilterSearch(searchResp);

        console.log(searchResp);
      } catch (error) {
        console.log(error);
      }
    };
    filterSearchStatus();
    fetchTicketInfo();
  }, []);

  const handleNext = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    console.log(currentPage);
  };

  const handlePrevious = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1)); // Ensure currentPage does not go below 1
  };


  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setCurrentPage(1);
  };

  const getApiStatus = (status) => {
    if (status === "all") return "all";

    // 🔥 Handle Completed mapping
    if (status === "Completed") {
      return siteId === 74 ? "Completed" : "Development Done";
    }

    if (status === "On Hold") {
      return "Oh Hold";
    }

    return status;
  };

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

        // ✅ map data (VERY IMPORTANT)
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
        console.error(error);
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

  const statusOptions =
    siteId === 74
      ? [
        { label: "All", value: "all" },
        { label: "Pending", value: "pending" },
        { label: "Received", value: "Received" },
        { label: "Completed", value: "Completed" }, // API value
        { label: "Work in Progress", value: "Work in Progress" },
      ]
      : [
        { label: "All", value: "all" },
        { label: "Open", value: "open" },
        { label: "Closed", value: "closed" },
        { label: "Pending", value: "pending" },
        { label: "Completed", value: "Development Done" }, // API value
      ];


  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
    setIsLoading(true);
    setFilteredData([]);
    // API fetch will run via useEffect; the result updates filteredData and isLoading.
  };

  // const exportAllToExcel = async () => {
  //   try {
  //     const [firstName = "", lastName = ""] = (filterParams.createBy || "").split(" ");

  //     const response = await getAdminExport(
  //       filterParams.category_id,
  //       filterParams.issueStatusId,
  //       filterParams.priorityLevel,
  //       filterParams.assign,
  //       firstName,
  //       lastName,
  //       filterParams.building_id,
  //       filterParams.floor_id,
  //       filterParams.unit_id,
  //       filterParams.startDate,
  //       filterParams.endDate
  //     );

  //     // Create a blob URL and trigger download
  //     const blob = new Blob([response.data], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     });
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", `tickets_export_${new Date().toISOString().split("T")[0]}.xlsx`);
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //     window.URL.revokeObjectURL(url);

  //   } catch (error) {
  //     console.error('Error exporting data:', error);
  //   }
  // };

  const exportAllToExcel = async () => {
    try {
      const apiStatus = getApiStatus(selectedStatus);

      const response = await getAdminExport(
        filterParams,
        searchText,
        apiStatus
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute(
        "download",
        `tickets_export_${new Date().toISOString().split("T")[0]}.xlsx`
      );

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 mb-10 flex-col overflow-hidden">
        {/* DASHBOARD CARDS */}
        <div className="flex flex-col gap-6">
          {/* STATUS CARDS */}
          <div className="flex flex-wrap gap-3 px-4 py-3">
            {/* STATUS CARDS */}
            {dashboardCards
              .filter((item) => dashboardVisibility[item.key])
              .map((item) => (
                <div
                  key={item.key}
                  onClick={() => handleStatusCardClick(item.key)}
                  className={`rounded-xl px-6 py-3 shadow-md text-center min-w-[150px] cursor-pointer hover:scale-105 transition ${item.color}`}
                >
                  <p className="text-sm font-semibold">{item.key}</p>
                  <p className="text-lg font-bold">{item.value}</p>
                </div>
              ))}
            {ticketTypeCards
              .filter((item) => dashboardVisibility[item.key])
              .map((item) => (
                <div
                  key={item.key}
                  onClick={() => handleTypeCardClick(item.key)}
                  className={`rounded-xl px-6 py-3 shadow-md text-center min-w-[150px] cursor-pointer hover:scale-105 transition ${item.color}`}
                >
                  <p className="text-sm font-semibold">{item.key}</p>
                  <p className="text-lg font-bold">{item.value}</p>
                </div>
              ))}
          </div>

        </div>

        <div className="flex justify-between items-center w-full gap-4 flex-wrap mt-6">

          {/* 🔹 LEFT SIDE (Search) */}
          <div className="flex w-full md:w-[40%]">
            <input
              type="text"
              placeholder="Search by Title, Ticket number, Category, Ticket type, Priority or Unit"
              className="border border-gray-400 w-full placeholder:text-xs rounded-lg p-2"
              value={searchText}
              onChange={handleSearch}
            />
          </div>

          {/* 🔹 RIGHT SIDE (Buttons) */}
          <div className="flex gap-2 flex-wrap justify-end w-full md:w-auto">

            <Link
              to={"/tickets/create-ticket"}
              style={{ background: themeColor }}
              className="text-white p-2 rounded-md flex items-center gap-2"
            >
              <PiPlusCircle size={20} />
              Add
            </Link>

            <button
              className="text-white px-4 p-2 flex gap-2 items-center rounded-md"
              style={{ background: themeColor }}
              onClick={() => setFilterModal(!filterModal)}
            >
              <BiFilterAlt />
              Filter
            </button>

            {/* Hide Columns */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setHideColumn(!hideColumn)}
                style={{ background: themeColor }}
                className="text-white px-4 p-2 flex gap-2 items-center rounded-md"
              >
                Hide Columns
                {hideColumn ? <IoIosArrowDown /> : <MdKeyboardArrowRight />}
              </button>

              {hideColumn && (
                <div className="absolute right-0 top-12 bg-white border rounded shadow-md w-64 max-h-64 overflow-y-auto z-10">
                  {Object.keys(columnVisibility).map((column) => (
                    <label key={column}>
                      <div className="flex gap-5 px-3 py-1">
                        <input
                          type="checkbox"
                          checked={columnVisibility[column]}
                          onChange={() => handleCheckboxChange(column)}
                        />
                        <div>{column}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Export */}
            <button
              className="text-white px-4 py-2 rounded"
              onClick={exportAllToExcel}
              style={{ background: themeColor }}
            >
              Export
            </button>

            {/* Dashboard Filter */}
            <div className="relative" ref={dashboardRef}>
              <button
                onClick={() => setShowDashboardFilter(!showDashboardFilter)}
                style={{ background: themeColor }}
                className="text-white px-4 py-2 flex gap-2 items-center rounded-md"
              >
                Dashboard Filter
                {showDashboardFilter ? <IoIosArrowDown /> : <MdKeyboardArrowRight />}
              </button>

              {showDashboardFilter && (
                <div className="absolute right-0 top-12 bg-white border rounded shadow-md w-64 max-h-64 overflow-y-auto z-10">
                  {filteredDashboardKeys.map((item) => (
                    <label key={item}>
                      <div className="flex gap-5 px-3 py-1">
                        <input
                          type="checkbox"
                          checked={dashboardVisibility[item]}
                          onChange={() => handleDashboardCheckboxChange(item)}
                        />
                        <div>{item}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
        <div className="mt-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <DNA
                visible={true}
                height="120"
                width="120"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
              />
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex items-center justify-center h-full py-10">
              <div className="flex flex-col items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-8 py-6 shadow-sm">

                <FaInbox className="text-4xl text-gray-400" />

                <p className="text-gray-600 text-sm font-medium">
                  No submissions here
                </p>

                <p className="text-gray-400 text-xs">
                  Once submissions are available, they will appear here.
                </p>

              </div>
            </div>
          ) : (
            <DataTable
              responsive
              columns={columns.filter((column) => columnVisibility[column.name])}
              data={filteredData}
              customStyles={customStyle}
              fixedHeader
              fixedHeaderScrollHeight="500px"
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              paginationPerPage={perPage}
              paginationDefaultPage={currentPage}
              paginationRowsPerPageOptions={[10, 20, 30, 50]}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handlePerRowsChange}
            />
          )}
          {/* </div> */}

          {/* <div className="flex justify-end m-2 gap-2 items-center">
          <button
            onClick={handlePrevious}
            className=" px-2   disabled:opacity-50 disabled:shadow-none shadow-custom-all-sides rounded-full"
            disabled={currentPage <= 1}
          >
            <MdKeyboardArrowLeft size={30} />
          </button>

          <button
            onClick={handleNext}
            className="px-2 rounded-full shadow-custom-all-sides  disabled:opacity-50 disabled:shadow-none"
            disabled={perPage > totalRows}
          >
            <MdKeyboardArrowRight size={30} />
          </button>
        </div> */}
        </div>
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
          />
        )}
      </div>
    </section>
  );
};

//
export default Ticket;




