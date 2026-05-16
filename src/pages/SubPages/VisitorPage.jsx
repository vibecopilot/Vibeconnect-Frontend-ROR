import React, { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";
import Passes from "../Passes";
import { useSelector } from "react-redux";
import Table from "../../components/table/Table";
import {
  domainPrefix,
  getAllVisitorLogs,
  getExpectedVisitor,
  getVisitorApprovals,
  getVisitorHistory,
  postVisitorLogFromDevice,
  postVisitorLogToBackend,
  visitorApproval,
  getSecurityGuardVisitors,
  getSiteData,
  siteChange,
} from "../../api";
import { BsEye } from "react-icons/bs";
import { BiEdit, BiFilterAlt } from "react-icons/bi";
import { formatTime } from "../../utils/dateUtils";
import { getItemInLocalStorage, setItemInLocalStorage } from "../../utils/localStorage";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { FaBuilding } from "react-icons/fa";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import toast from "react-hot-toast";
import image from "/profile.png";
import SelfRegistration from "./SelfRegistration";
import { getBuildings } from "../../api";

const VisitorPage = () => {
  const [page, setPage] = useState("all");
  const themeColor = useSelector((state) => state.theme.color);
  const [selectedVisitor, setSelectedVisitor] = useState("expected");
  const [visitor, setVisitor] = useState([]);
  const [all, setAll] = useState([]);
  const [visitorIn, setVisitorIn] = useState([]);
  const [visitorOut, setVisitorOut] = useState([]);
  const [unexpectedVisitor, setUnexpectedVisitor] = useState([]);
  const [FilteredUnexpectedVisitor, setFilteredUnexpectedVisitor] = useState([]);
  const [expectedVisitor, setExpectedVisitor] = useState([]);
  const [FilteredExpectedVisitor, setFilteredExpectedVisitor] = useState([]);
  const [FilteredApproval, setFilteredApproval] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [histories, setHistories] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [securityVisitors, setSecurityVisitors] = useState([]);

  // Pagination (All / In / Out)
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  // Pagination (Approvals)
  const [approvalPage, setApprovalPage] = useState(1);
  const [approvalRowsPerPage, setApprovalRowsPerPage] = useState(10);
  const [approvalTotalPages, setApprovalTotalPages] = useState(1);
  const [approvalTotalRecords, setApprovalTotalRecords] = useState(0);

  // Pagination (History)
  const [historyPage, setHistoryPage] = useState(1);
  const [historyRowsPerPage, setHistoryRowsPerPage] = useState(10);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyTotalRecords, setHistoryTotalRecords] = useState(0);

  // Filters (All)
  const [showFilters, setShowFilters] = useState(false);
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterMobile, setFilterMobile] = useState("");
  const [filterHost, setFilterHost] = useState("");
  const [filterBuilding, setFilterBuilding] = useState("");
  const [filterFloor, setFilterFloor] = useState("");
  const [filterUnit, setFilterUnit] = useState("");
  const [filterApproval, setFilterApproval] = useState("");

  //Filter(Histories)
  const [historyDateFrom, setHistoryDateFrom] = useState("");
  const [historyDateTo, setHistoryDateTo] = useState("");
  const [historyMobile, setHistoryMobile] = useState("");
  const [historyStatus, setHistoryStatus] = useState("");
  const [buildings, setBuildings] = useState([]);

  // ── Site switcher ──────────────────────────────────────────────────────────
  const [activeSiteId, setActiveSiteId] = useState(() => getItemInLocalStorage("SITEID"));
  const [siteName, setSiteName] = useState("");
  const [siteData, setSiteData] = useState([]);
  const [siteOpen, setSiteOpen] = useState(false);
  const siteDropdownRef = useRef(null);

  // Initialise site name from localStorage
  useEffect(() => {
    const stored = getItemInLocalStorage("SITENAME");
    if (stored) setSiteName(stored);
  }, []);

  // Fetch available sites
  useEffect(() => {
    getSiteData()
      .then((res) => setSiteData(res?.data?.sites || []))
      .catch(console.error);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (siteDropdownRef.current && !siteDropdownRef.current.contains(e.target))
        setSiteOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSiteChange = async (id, name) => {
    try {
      await siteChange(id);
      setItemInLocalStorage("SITEID", id);
      setItemInLocalStorage("SITENAME", name);
      setSiteName(name);
      setActiveSiteId(id);   // ← triggers the data-fetch useEffect
      setSiteOpen(false);
      // Reset pagination so fresh data starts from page 1
      setCurrentPage(1);
      setApprovalPage(1);
      setHistoryPage(1);
    } catch (err) {
      console.error("Site change error:", err);
    }
  };
  // ──────────────────────────────────────────────────────────────────────────

  const webcamRef = useRef(null);

  // Company-specific labels: show "Planned" / "Unplanned Visitors" only for company_id 55
  const companyId = getItemInLocalStorage("COMPANYID");
  const isCompany55 = companyId == 55;
  const expectedVisitorLabel = isCompany55 ? "Planned Visitors" : "Expected visitor";
  const unexpectedVisitorLabel = isCompany55 ? "Unplanned Visitors" : "Unexpected visitor";
  const expectedDateLabel = isCompany55 ? "Planned Date" : "Expected Date";
  const expectedTimeLabel = isCompany55 ? "Planned Time" : "Expected Time";
  const expectedDateRangeLabel = isCompany55 ? "Planned Date Range" : "Expected Date Range";

  const dateFormat = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const dateTimeFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // ✅ helper: safe csv escape
  const csvEscape = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  // ✅ UPDATED: Export ALL Visitor data (All / In / Out) to CSV
  const exportVisitorsToCSV = async () => {
    if (page !== "all" && page !== "Visitor In" && page !== "Visitor Out") {
      toast.error("Export is available for All / Visitor In / Visitor Out");
      return;
    }

    try {
      toast.loading("Preparing export... Please wait");

      let allRows = [];
      let pageNum = 1;
      let hasMoreData = true;
      const itemsPerPage = 1000; // Large page size to minimize API calls

      // Build filters based on current page and selected visitor
      let filters = {};
      if (page === "Visitor In") {
        filters.visitorInOut = "IN";
        if (selectedVisitor === "expected") {
          filters.userTypeNotEq = "security_guard";
        } else {
          filters.userType = "security_guard";
        }
      } else if (page === "Visitor Out") {
        filters.visitorInOut = "OUT";
        if (selectedVisitor === "expected") {
          filters.userTypeNotEq = "security_guard";
        } else {
          filters.userType = "security_guard";
        }
      } else if (page === "all") {
        if (selectedVisitor === "expected") {
          filters.userTypeNotEq = "security_guard";
        } else {
          filters.userType = "security_guard";
        }
      }

      if (filterDateFrom) filters.dateFrom = filterDateFrom;
      if (filterDateTo) filters.dateTo = filterDateTo;
      if (filterMobile) filters.mobile = filterMobile;
      if (filterHost) filters.host = filterHost;

      // Fetch all pages
      while (hasMoreData) {
        const visitorResp = await getExpectedVisitor(pageNum, itemsPerPage, filters);

        let visitorData = [];
        let totalPages = 1;

        if (visitorResp?.data) {
          if (Array.isArray(visitorResp.data)) {
            visitorData = visitorResp.data;
          } else if (visitorResp.data.visitors && Array.isArray(visitorResp.data.visitors)) {
            visitorData = visitorResp.data.visitors;
            totalPages = visitorResp.data.total_pages || 1;
          } else if (visitorResp.data.data && Array.isArray(visitorResp.data.data)) {
            visitorData = visitorResp.data.data;
            totalPages = visitorResp.data.total_pages || 1;
          }
        }

        if (visitorData.length === 0) {
          hasMoreData = false;
        } else {
          // Process and add to allRows
          const processedVisitors = visitorData.map((visitor) => ({
            ...visitor,
            hosts_display:
              visitor.hosts && visitor.hosts.length > 0
                ? visitor.hosts
                  .map((host) => host.full_name || "Unknown")
                  .filter(Boolean)
                  .join(", ")
                : "No Host",
          }));

          allRows = [...allRows, ...processedVisitors];

          // Check if there are more pages
          if (pageNum >= totalPages) {
            hasMoreData = false;
          } else {
            pageNum++;
          }
        }
      }

      toast.dismiss();

      if (!allRows || allRows.length === 0) {
        toast.error("No data to export");
        return;
      }

      const headers = [
        "Visitor Type",
        "Name",
        "Contact No",
        "Purpose",
        "Coming From",
        expectedDateLabel,
        expectedTimeLabel,
        "Vehicle No",
        "Host Approval",
        "Pass Start",
        "Pass End",
        "Status",
        "Created By",
        "Host",
        "Created At",
      ];

      const csvRows = allRows.map((r) => {
        const createdBy = `${r?.created_by_name?.firstname || ""} ${r?.created_by_name?.lastname || ""
          }`.trim();

        return [
          csvEscape(r.visit_type || ""),
          csvEscape(r.name || ""),
          csvEscape(r.contact_no || ""),
          csvEscape(r.purpose || ""),
          csvEscape(r.coming_from || ""),
          csvEscape(r.expected_date || ""),
          csvEscape(r.expected_time ? formatTime(r.expected_time) : ""),
          csvEscape(r.vehicle_number || ""),
          csvEscape(r.skip_host_approval ? "Approved" : "Rejected"),
          csvEscape(r.start_pass ? dateFormat(r.start_pass) : ""),
          csvEscape(r.end_pass ? dateFormat(r.end_pass) : ""),
          csvEscape(r.visitor_in_out || ""),
          csvEscape(createdBy),
          csvEscape(r.hosts_display || (createdBy ? createdBy : "No Host")),
          csvEscape(r.created_at ? dateTimeFormat(r.created_at) : ""),
        ].join(",");
      });

      const fileName =
        page === "all"
          ? `visitors_all_${selectedVisitor}_${new Date().toISOString().split('T')[0]}.csv`
          : page === "Visitor In"
            ? `visitors_in_${selectedVisitor}_${new Date().toISOString().split('T')[0]}.csv`
            : `visitors_out_${selectedVisitor}_${new Date().toISOString().split('T')[0]}.csv`;

      const blob = new Blob([headers.join(",") + "\n" + csvRows.join("\n")], {
        type: "text/csv;charset=utf-8;",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success(`Export successful! Total records: ${allRows.length}`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Export failed. Please try again");
    }
  };

  // ✅ UPDATED: Export ALL History records (fetches all pages)
  const exportHistoryToCSV = async () => {
    try {
      toast.loading("Preparing history export... Please wait");

      let allRows = [];
      let pageNum = 1;
      let hasMoreData = true;
      const itemsPerPage = 1000;

      // Build filters from current history filter state
      const filters = {};
      if (historyDateFrom) filters.dateFrom = historyDateFrom;
      if (historyDateTo) filters.dateTo = historyDateTo;
      if (historyMobile) filters.mobile = historyMobile;
      if (historyStatus === "approved") filters.approved = true;
      else if (historyStatus === "denied") filters.approved = false;

      while (hasMoreData) {
        const res = await getVisitorHistory(pageNum, itemsPerPage, filters);
        const data = res.data;
        const historyData = data.approval_history || [];
        const totalPages = data.total_pages || 1;

        if (historyData.length === 0) {
          hasMoreData = false;
        } else {
          allRows = [...allRows, ...historyData];
          if (pageNum >= totalPages) {
            hasMoreData = false;
          } else {
            pageNum++;
          }
        }
      }

      toast.dismiss();

      if (!allRows || allRows.length === 0) {
        toast.error("No data to export");
        return;
      }

      const headers = ["Name", "Purpose", "Mobile", "Approval Date", "Status"];
      const csvRows = allRows.map((item) =>
        [
          csvEscape(item.name),
          csvEscape(item.purpose),
          csvEscape(item.contactno || item.contact_no),
          csvEscape(item.approval_date ? dateTimeFormat(item.approval_date) : ""),
          csvEscape(item.approved ? "Approved" : "Denied"),
        ].join(",")
      );

      const blob = new Blob([headers.join(",") + "\n" + csvRows.join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", `visitorhistory_${new Date().toISOString().split('T')[0]}.csv`);
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success(`visitor history records exported successfully`);
    } catch (error) {
      console.error("History export error:", error);
      toast.dismiss();
      toast.error("Export failed. Please try again");
    }
  };

  const handleClick = (visitorType) => {
    setSelectedVisitor(visitorType);
    setSearchText("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setCurrentPage(1);
    setApprovalPage(1);
    setHistoryPage(1);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setApprovalPage(1);
    setHistoryPage(1);
    setRefetchTrigger((prev) => prev + 1);
  };

  const handleClearFilters = () => {
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterMobile("");
    setFilterHost("");
    setFilterBuilding("");
    setFilterApproval("");

    setHistoryDateFrom("");
    setHistoryDateTo("");
    setHistoryMobile("");
    setHistoryStatus("");

    setCurrentPage(1);
    setApprovalPage(1);
    setHistoryPage(1);
    setRefetchTrigger((prev) => prev + 1);
  };



  useEffect(() => {
    console.log("Security visitors useEffect running...");

    const fetchSecurityVisitors = async () => {
      try {
        const res = await getSecurityGuardVisitors(1, 10);

        console.log("Security Visitors API:", res);

        let data = [];

        if (Array.isArray(res.data)) {
          data = res.data;
        } else if (res.data.visitors) {
          data = res.data.visitors;
        } else if (res.data.data) {
          data = res.data.data;
        }

        setSecurityVisitors(data);

      } catch (error) {
        console.log("Security visitor API error:", error);
      }
    };

    fetchSecurityVisitors();
  }, []);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const res = await getBuildings(1, 10);

        console.log("Buildings API response:", res.data);

        let buildingData = [];

        if (Array.isArray(res.data)) {
          buildingData = res.data;
        }
        else if (res.data.buildings) {
          buildingData = res.data.buildings;
        }
        else if (res.data.data) {
          buildingData = res.data.data;
        }

        setBuildings(buildingData);

      } catch (error) {
        console.log("Building fetch error:", error);
      }
    };

    fetchBuildings();
  }, []);

  useEffect(() => {
    const fetchExpectedVisitor = async () => {
      try {
        setLoading(true);
        let filters = {};
        if (page === "Visitor In") {
          filters.visitorInOut = "IN";
          if (selectedVisitor === "expected") {
            filters.userTypeNotEq = "security_guard";
          } else {
            filters.userType = "security_guard";
          }
        } else if (page === "Visitor Out") {
          filters.visitorInOut = "OUT";
          if (selectedVisitor === "expected") {
            filters.userTypeNotEq = "security_guard";
          } else {
            filters.userType = "security_guard";
          }
        } else if (page === "all") {
          if (selectedVisitor === "expected") {
            filters.userTypeNotEq = "security_guard";
          } else {
            filters.userType = "security_guard";
          }
        }

        if (filterDateFrom) filters.dateFrom = filterDateFrom;
        if (filterDateTo) filters.dateTo = filterDateTo;
        if (filterMobile) filters.mobile = filterMobile;
        if (filterHost) filters.host = filterHost;
        if (filterBuilding) filters.building_id = filterBuilding;
        if (filterApproval === "approved") {
          filters.skip_host_approval = true;
        } else if (filterApproval === "rejected") {
          filters.skip_host_approval = false;  // explicitly set false — handled in API
        }

        const visitorResp = await getExpectedVisitor(
          currentPage,
          rowsPerPage,
          filters
        );

        let visitorData = [];
        let paginationInfo = {};

        if (visitorResp?.data) {
          if (Array.isArray(visitorResp.data)) {
            visitorData = visitorResp.data;
          } else if (
            visitorResp.data.visitors &&
            Array.isArray(visitorResp.data.visitors)
          ) {
            visitorData = visitorResp.data.visitors;
            paginationInfo = {
              currentPage:
                visitorResp.data.current_page ||
                visitorResp.data.page ||
                currentPage,
              totalPages:
                visitorResp.data.total_pages ||
                Math.ceil(
                  (visitorResp.data.total_count || visitorResp.data.total || 0) /
                  rowsPerPage
                ),
              totalRecords: visitorResp.data.total_count || visitorResp.data.total || 0,
              perPage: visitorResp.data.per_page || rowsPerPage,
            };
          } else if (
            visitorResp.data.data &&
            Array.isArray(visitorResp.data.data)
          ) {
            visitorData = visitorResp.data.data;
            paginationInfo = {
              currentPage:
                visitorResp.data.current_page ||
                visitorResp.data.page ||
                currentPage,
              totalPages:
                visitorResp.data.total_pages ||
                Math.ceil(
                  (visitorResp.data.total_count || visitorResp.data.total || 0) /
                  rowsPerPage
                ),
              totalRecords: visitorResp.data.total_count || visitorResp.data.total || 0,
              perPage: visitorResp.data.per_page || rowsPerPage,
            };
          } else {
            setLoading(false);
            return;
          }
        }

        if (paginationInfo.totalRecords) {
          setTotalPages(paginationInfo.totalPages);
          setTotalRecords(paginationInfo.totalRecords);
        } else {
          setTotalPages(1);
          setTotalRecords(visitorData.length);
        }

        if (visitorData.length === 0) {
          setVisitor([]);
          setAll([]);
          setVisitorIn([]);
          setVisitorOut([]);
          setFilteredData([]);
          setUnexpectedVisitor([]);
          setFilteredUnexpectedVisitor([]);
          setExpectedVisitor([]);
          setFilteredExpectedVisitor([]);
          setLoading(false);
          return;
        }

        const sortedVisitor = visitorData.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        const processedVisitors = sortedVisitor.map((visitor) => ({
          ...visitor,
          hosts_display:
            visitor.hosts && visitor.hosts.length > 0
              ? visitor.hosts
                .map((host) => host.full_name || "Unknown")
                .filter(Boolean)
                .join(", ")
              : "No Host",
        }));

        // keep original array too (used by searchAll)
        setVisitor(processedVisitors);

        if (page === "Visitor In") {
          setVisitorIn(processedVisitors);
          if (selectedVisitor === "expected") {
            setFilteredData(processedVisitors);
            setFilteredExpectedVisitor(processedVisitors);
          } else {
            setUnexpectedVisitor(processedVisitors);
            setFilteredUnexpectedVisitor(processedVisitors);
          }
        } else if (page === "Visitor Out") {
          setVisitorOut(processedVisitors);
        } else if (page === "all") {
          setAll(processedVisitors);
          if (selectedVisitor === "expected") {
            setFilteredExpectedVisitor(processedVisitors);
            setExpectedVisitor(processedVisitors);
          } else {
            setFilteredUnexpectedVisitor(processedVisitors);
            setUnexpectedVisitor(processedVisitors);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching visitor data:", error);
        setLoading(false);
      }
    };

    const fetchVisitorHistory = async () => {
      try {
        const filters = {};

        if (historyDateFrom) filters.dateFrom = historyDateFrom;
        if (historyDateTo) filters.dateTo = historyDateTo;
        if (historyMobile) filters.mobile = historyMobile;

        if (historyStatus) {
          if (historyStatus === "approved") filters.approved = true;
          else if (historyStatus === "denied") filters.approved = false;
        }

        const res = await getVisitorHistory(
          historyPage,
          historyRowsPerPage,
          filters
        );

        const data = res.data;
        const historyData = data.approval_history || [];

        // ✅ store original
        setHistories(historyData);

        // ✅ apply frontend filter ALSO (safe fallback)
        let filtered = historyData;

        if (historyMobile) {
          filtered = filtered.filter((item) =>
            String(item.contact_no || "")
              .toLowerCase()
              .includes(historyMobile.toLowerCase())
          );
        }

        if (historyStatus) {
          filtered = filtered.filter((item) =>
            historyStatus === "approved"
              ? item.approved === true
              : item.approved === false
          );
        }

        if (historyDateFrom) {
          filtered = filtered.filter(
            (item) =>
              new Date(item.approval_date) >= new Date(historyDateFrom)
          );
        }

        if (historyDateTo) {
          filtered = filtered.filter(
            (item) =>
              new Date(item.approval_date) <= new Date(historyDateTo)
          );
        }

        setFilteredHistory(filtered);

        setHistoryTotalPages(data.total_pages || 1);
        setHistoryTotalRecords(data.total_count || filtered.length || 0);
      } catch (error) {
        setFilteredHistory([]);
        setHistoryTotalRecords(0);
      }
    };
    const fetchApprovals = async () => {
      try {
        const approvalResp = await getVisitorApprovals(
          approvalPage,
          approvalRowsPerPage
        );

        let approvalData = [];
        let approvalPaginationInfo = {};

        if (approvalResp?.data) {
          if (Array.isArray(approvalResp.data)) {
            approvalData = approvalResp.data;
            approvalPaginationInfo = {
              totalPages: 1,
              totalRecords: approvalResp.data.length || 0,
            };
          } else if (
            approvalResp.data.visitors &&
            Array.isArray(approvalResp.data.visitors)
          ) {
            approvalData = approvalResp.data.visitors;
            approvalPaginationInfo = {
              totalPages:
                approvalResp.data.total_pages ||
                Math.ceil(
                  (approvalResp.data.total_count || approvalResp.data.total || 0) /
                  approvalRowsPerPage
                ),
              totalRecords: approvalResp.data.total_count || approvalResp.data.total || 0,
            };
          } else if (
            approvalResp.data.data &&
            Array.isArray(approvalResp.data.data)
          ) {
            approvalData = approvalResp.data.data;
            approvalPaginationInfo = {
              totalPages:
                approvalResp.data.total_pages ||
                Math.ceil(
                  (approvalResp.data.total_count || approvalResp.data.total || 0) /
                  approvalRowsPerPage
                ),
              totalRecords: approvalResp.data.total_count || approvalResp.data.total || 0,
            };
          }
        }

        if (approvalPaginationInfo.totalRecords) {
          setApprovalTotalPages(approvalPaginationInfo.totalPages);
          setApprovalTotalRecords(approvalPaginationInfo.totalRecords);
        } else {
          setApprovalTotalPages(1);
          setApprovalTotalRecords(approvalData.length);
        }

        const sortedApproval = approvalData.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setApprovals(sortedApproval);
        setFilteredApproval(sortedApproval);
      } catch (error) {
        setApprovalTotalRecords(0);
        setFilteredApproval([]);
      }
    };

    fetchApprovals();
    fetchExpectedVisitor();
    fetchVisitorHistory();
  }, [
    currentPage,
    rowsPerPage,
    approvalPage,
    approvalRowsPerPage,
    historyPage,
    historyRowsPerPage,
    page,
    selectedVisitor,
    refetchTrigger,
    filterDateFrom,
    filterDateTo,
    filterMobile,
    filterHost,
    filterBuilding,
    filterApproval,
    historyDateFrom,
    historyDateTo,
    historyMobile,
    historyStatus,
    activeSiteId, // ✅ re-fetch whenever the active site changes
  ]);


  const VisitorColumns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/passes/visitors/visitor-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
          <Link to={`/admin/passes/visitors/edit-visitor/${row.id}`}>
            <BiEdit size={15} />
          </Link>
        </div>
      ),
    },
    { name: "ID", selector: (row) => row.id, sortable: true },
    {
      name: "Profile",
      cell: (row) => {
        let profileUrl = "";

        // ✅ Case 1: profile_picture is string (your current API)
        if (typeof row.profile_picture === "string" && row.profile_picture.trim()) {
          profileUrl = domainPrefix + row.profile_picture;
        }

        // ✅ Case 2: profile_picture is object (future-safe)
        else if (row.profile_picture?.url) {
          profileUrl = domainPrefix + row.profile_picture.url;
        }

        // ✅ Case 3: fallback to QR image
        // else if (row.qr_code_image_url) {
        //   profileUrl = domainPrefix + row.qr_code_image_url;
        // }

        return (
          <img
            src={profileUrl || image} // 👈 default fallback
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover cursor-pointer"
            onClick={() => {
              if (profileUrl) window.open(profileUrl, "_blank");
            }}
            onError={(e) => {
              e.target.src = image; // 👈 fallback if broken image
            }}
          />
        );
      },
      sortable: true,
    },
    { name: "Visitor Type", selector: (row) => row.visit_type, sortable: true },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Contact No.", selector: (row) => row.contact_no, sortable: true },
    { name: "Purpose", selector: (row) => row.purpose, sortable: true },
    { name: "Coming from", selector: (row) => row.coming_from, sortable: true },
    { name: expectedDateLabel, selector: (row) => row.expected_date, sortable: true },
    { name: expectedTimeLabel, selector: (row) => row.expected_time, sortable: true },
    { name: "Vehicle No.", selector: (row) => row.vehicle_number, sortable: true },
    {
      name: "Host Approval",
      cell: (row) => {
        const hostApproval = row.hosts?.[0]?.is_approved;

        let status = "Pending";
        let colorClass = "text-yellow-600";

        if (hostApproval === true) {
          status = "Approved";
          colorClass = "text-green-600";
        } else if (hostApproval === false) {
          status = "Rejected";
          colorClass = "text-red-600";
        }

        return (
          <span className={`px-2 py-1 rounded text-sm font-medium ${colorClass}`}>
            {status}
          </span>
        );
      },
      sortable: true,
    },
    {
      name: "Pass Start",
      selector: (row) => (row.start_pass ? dateFormat(row.start_pass) : ""),
      sortable: true,
    },
    {
      name: "Pass End",
      selector: (row) => (row.end_pass ? dateFormat(row.end_pass) : ""),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <div>
          {row.visitor_in_out === "IN" ? (
            <span className="text-red-400">IN</span>
          ) : (
            <span className="text-green-400">{row.visitor_in_out}</span>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Created By",
      selector: (row) =>
        `${row?.created_by_name?.firstname || ""} ${row?.created_by_name?.lastname || ""
          }`.trim(),
      sortable: true,
    },
    {
      name: "Host",
      selector: (row) =>
        row.hosts_display ||
        `${row?.created_by_name?.firstname || ""} ${row?.created_by_name?.lastname || ""
          }`.trim() ||
        "No Host",
      sortable: true,
    },
    {
      name: "Check In",
      selector: (row) =>
        row.visits_log?.[0]?.check_in
          ? dateFormat(row.visits_log[0].check_in)
          : "-",
      sortable: true,
    },

    {
      name: "Check Out",
      selector: (row) =>
        row.visits_log?.[0]?.check_out
          ? dateFormat(row.visits_log[0].check_out)
          : "-",
      sortable: true,
    },

    {
      name: "Created At",
      selector: (row) =>
        row.created_at ? dateFormat(row.created_at) : "-",
      sortable: true,
    },
  ];

  const [searchText, setSearchText] = useState("");


  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchText(e.target.value);

    const filterLogic = (item) =>
      item.name?.toLowerCase().includes(searchValue) ||
      item.vehicle_number?.toLowerCase().includes(searchValue) ||
      item.hosts_display?.toLowerCase().includes(searchValue);

    // 🔁 Reset when search is empty
    if (!searchValue.trim()) {
      if (page === "Visitor In") {
        setFilteredData(visitorIn);
      }
      else if (page === "Visitor Out") {
        setFilteredData(visitorOut);
      }
      else if (page === "all") {
        if (selectedVisitor === "expected") {
          setFilteredExpectedVisitor(expectedVisitor);
        } else {
          setFilteredUnexpectedVisitor(unexpectedVisitor);
        }
      }
      return;
    }

    // 🔎 Filtering Logic (NO user_type filtering anymore)
    if (page === "Visitor In") {
      setFilteredData(visitorIn.filter(filterLogic));
    }
    else if (page === "Visitor Out") {
      setFilteredData(visitorOut.filter(filterLogic));
    }
    else if (page === "all") {
      if (selectedVisitor === "expected") {
        setFilteredExpectedVisitor(expectedVisitor.filter(filterLogic));
      } else {
        setFilteredUnexpectedVisitor(unexpectedVisitor.filter(filterLogic));
      }
    }
  };

  const [searchAll, setSearchAll] = useState("");
  // const handleSearchAll = (e) => {
  //   const searchValue = e.target.value.toLowerCase();
  //   setSearchAll(e.target.value);

  //   if (!searchValue.trim()) {
  //     setFilteredExpectedVisitor(expectedVisitor);
  //     setFilteredUnexpectedVisitor(unexpectedVisitor);
  //     return;
  //   }

  //   const filterLogic = (item) => {
  //     const name = item.name?.toLowerCase() || "";
  //     const host = item.hosts_display?.toLowerCase() || "";
  //     const vehicle = item.vehicle_number?.toLowerCase() || "";
  //     const mobile = String(item.contact_no || "");
  //     const purpose = item.purpose?.toLowerCase() || "";
  //     const coming = item.coming_from?.toLowerCase() || "";

  //     return (
  //       name.includes(searchValue) ||
  //       host.includes(searchValue) ||
  //       vehicle.includes(searchValue) ||
  //       mobile.includes(searchValue) ||
  //       purpose.includes(searchValue) ||
  //       coming.includes(searchValue)
  //     );
  //   };


  //   if (selectedVisitor === "expected") {
  //     const filtered = expectedVisitor.filter((item) =>
  //       item.name?.toLowerCase().includes(searchValue) ||
  //       item.vehicle_number?.toLowerCase().includes(searchValue) ||
  //       item.hosts_display?.toLowerCase().includes(searchValue)
  //     );
  //     setFilteredExpectedVisitor(filtered);
  //   } else {
  //     const filtered = unexpectedVisitor.filter((item) =>
  //       item.name?.toLowerCase().includes(searchValue) ||
  //       item.vehicle_number?.toLowerCase().includes(searchValue) ||
  //       item.hosts_display?.toLowerCase().includes(searchValue)
  //     );
  //     setFilteredUnexpectedVisitor(filtered);
  //   }
  // };


  const handleSearchAll = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchAll(e.target.value);

    // Reset if search empty
    if (!value.trim()) {
      setFilteredExpectedVisitor(expectedVisitor);
      setFilteredUnexpectedVisitor(unexpectedVisitor);
      return;
    }

    const filterLogic = (item) => {
      const name = item.name?.toLowerCase() || "";
      const host = item.hosts_display?.toLowerCase() || "";
      const vehicle = item.vehicle_number?.toLowerCase() || "";
      const mobile = String(item.contact_no || "");
      const purpose = item.purpose?.toLowerCase() || "";
      const coming = item.coming_from?.toLowerCase() || "";

      return (
        name.includes(value) ||
        host.includes(value) ||
        vehicle.includes(value) ||
        mobile.includes(value) ||
        purpose.includes(value) ||
        coming.includes(value)
      );
    };

    if (selectedVisitor === "expected") {
      const filtered = expectedVisitor.filter(filterLogic);
      setFilteredExpectedVisitor(filtered);
    } else {
      const filtered = unexpectedVisitor.filter(filterLogic);
      setFilteredUnexpectedVisitor(filtered);
      console.log("searchAll:", value);
      console.log("FilteredUnexpectedVisitor:", filtered.length);
    }
  };
  const [searchHIstoryText, setSearchHistoryText] = useState("");
  const handleSearchHistory = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchHistoryText(e.target.value);

    if (!searchValue.trim()) {
      // If empty → show all data
      setFilteredHistory(histories);
      return;
    }

    const filteredResults = histories.filter((item) =>
      item.name?.toLowerCase().includes(searchValue) ||
      item.contact_no?.toLowerCase().includes(searchValue)
    );

    setFilteredHistory(filteredResults);
  };
  const [searchApprovalText, setSearchApprovalText] = useState("");
  const handleSearchApproval = (e) => {
    const value = e.target.value;
    setSearchApprovalText(value);

    const search = value.toLowerCase();

    const filtered = approvals.filter((item) => {
      const name = item.name ? item.name.toLowerCase() : "";
      const mobile = item.contact_no ? item.contact_no.toLowerCase() : "";

      return name.includes(search) || mobile.includes(search);
    });

    setFilteredApproval(filtered);
  };
  const historyColumn = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/passes/visitors/visitor-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
        </div>
      ),
    },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Purpose", selector: (row) => row.purpose, sortable: true },
    {
      name: "Mobile no.",
      selector: (row) => row.contact_no || "--",
      sortable: true,
    },
    {
      name: "Check In",
      selector: (row) =>
        row.visitor_logs?.check_in
          ? new Date(row.visitor_logs.check_in).toLocaleString()
          : "--",
    },
    {
      name: "Check Out",
      selector: (row) =>
        row.visitor_logs?.check_out
          ? new Date(row.visitor_logs.check_out).toLocaleString()
          : "--",
    },
    {
      name: "Approval Date",
      selector: (row) => dateTimeFormat(row.approval_date),
      sortable: true,
    },
    {
      name: "Approval",
      selector: (row) =>
        row.approved ? (
          <p className="text-green-400">Approved</p>
        ) : (
          <p className="text-red-400">Denied</p>
        ),
      sortable: true,
    },
  ];

  const handleApproval = async (id, decision) => {
    const approveData = new FormData();
    approveData.append("approve", decision);
    try {
      await visitorApproval(id, approveData);
      setRefetchTrigger((prev) => prev + 1);
      if (decision === true) toast.success("Visitor approved successfully");
      else toast.success("Approval denied");
    } catch (error) {
      console.log(error);
    }
  };

  const approvalColumn = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/passes/visitors/visitor-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
        </div>
      ),
    },

    { name: "Name", selector: (row) => row.name, sortable: true },

    { name: "Purpose", selector: (row) => row.purpose, sortable: true },

    {
      name: expectedDateLabel,
      selector: (row) =>
        row.expected_date ? dateFormat(row.expected_date) : "--",
      sortable: true,
    },

    {
      name: expectedTimeLabel,
      selector: (row) =>
        row.expected_time ? formatTime(row.expected_time) : "--",
      sortable: true,
    },

    // ✅ STATUS COLUMN
    {
      name: "Status",
      cell: (row) => (
        <span
          className={`font-medium ${row.approved ? "text-green-500" : "text-red-500"
            }`}
        >
          {row.approved ? "Approved" : "Denied"}
        </span>
      ),
      sortable: true,
    },

    {
      name: "Approval",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className="text-white bg-green-400 rounded-full p-1"
            onClick={() => handleApproval(row.id, true)}
          >
            <FaCheck size={20} />
          </button>

          <button
            className="text-white bg-red-400 rounded-full p-1"
            onClick={() => handleApproval(row.id, false)}
          >
            <IoClose size={20} />
          </button>
        </div>
      ),
    },
  ];
  document.title = "Passes - Vibe Connect";

  const getVisitorLogData = () => {
    const now = new Date();
    const offsetMinutes = now.getTimezoneOffset();
    const localNow = new Date(now.getTime() - offsetMinutes * 60 * 1000);
    const startTime = new Date(localNow.getTime() - 15 * 60 * 1000);
    const endTime = localNow;
    const formatLogTime = (date) => date.toISOString().slice(0, 19);
    return {
      AcsEventCond: {
        searchID: "3166590d-cdb3-43f3-fvdvfdvdb25e-f6e98a05d359",
        searchResultPosition: 0,
        maxResults: 50,
        major: 0,
        minor: 0,
        startTime: formatLogTime(startTime),
        endTime: formatLogTime(endTime),
      },
    };
  };



  useEffect(() => {
    const postLogs = async () => {
      try {
        const visitorLogData = getVisitorLogData();
        const data = await postVisitorLogFromDevice(visitorLogData);
        await postVisitorLogToBackend(data);
      } catch (err) {
        console.log("Device log fetch failed:", err);
      }
    };

    const intervalId = setInterval(postLogs, 15 * 60 * 1000);
    postLogs();
    return () => clearInterval(intervalId);
  }, []);

  const visitorDeviceLogColumn = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/passes/visitors/visitor-details/${row.employeeno}`}>
            <BsEye size={15} />
          </Link>
        </div>
      ),
    },
    { name: "Sr. no.", selector: (row, index) => index + 1, sortable: true },
    { name: "Name", selector: (row) => row.name, sortable: true },
    {
      name: "Check in",
      selector: (row) => (row.in_time ? dateTimeFormat(row.in_time) : ""),
      sortable: true,
    },
    {
      name: "Check out",
      selector: (row) => (row.out_time ? dateTimeFormat(row.out_time) : null),
      sortable: true,
    },
  ];

  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);

  useEffect(() => {
    const fetchAllVisitorLogs = async () => {
      try {
        const res = await getAllVisitorLogs();
        setFilteredLogs(res.data.data);
        setLogs(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllVisitorLogs();
  }, []);

  const [logSearchText, setLogSearchText] = useState("");
  const handleLogSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setLogSearchText(e.target.value);

    if (!value.trim()) {
      setFilteredLogs(logs);
      return;
    }

    const filtered = logs.filter((item) =>
      item.name?.toLowerCase().includes(value)
    );

    setFilteredLogs(filtered);
  };

  return (
    <div className="visitors-page">
      <section className="flex">
        <Navbar />

        <div className="w-full flex mx-3 flex-col overflow-hidden">
          <header className="px-3 pt-3 mb-3">
            <div
              style={{ background: themeColor }}
              className="w-full rounded-2xl px-4 py-3 flex items-center justify-between gap-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
            >
              <h1 className="text-white font-semibold text-base sm:text-lg">
                Vibe Connect
              </h1>

              <div className="relative" ref={siteDropdownRef}>
                <button
                  type="button"
                  onClick={() => setSiteOpen((v) => !v)}
                  className="cursor-pointer flex items-center gap-2 font-medium px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition text-white"
                >
                  <FaBuilding />
                  <span className="max-w-[160px] sm:max-w-[260px] truncate">
                    {siteName || "Select Site"}
                  </span>
                  {siteOpen ? <MdExpandLess size={22} /> : <MdExpandMore size={22} />}
                </button>

                {siteOpen && (
                  <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-80 w-80 overflow-y-auto z-20 p-2">
                    {siteData.length ? (
                      siteData.map((s) => (
                        <button
                          type="button"
                          key={s.id}
                          onClick={() => handleSiteChange(s.id, s.name)}
                          className={`w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-800 ${String(s.id) === String(activeSiteId)
                            ? "font-semibold bg-gray-50"
                            : ""
                            }`}
                        >
                          <span className="block truncate">{s.name}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">No sites found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </header>

          <Passes />


          <div className="flex w-full m-2">
            <div className="flex w-full md:flex-row flex-col space-x-4 border-b border-gray-400">
              {[
                { key: "all", label: "All" },
                { key: "Visitor In", label: "Visitor In" },
                { key: "Visitor Out", label: "Visitor Out" },
                { key: "approval", label: "Approvals" },
                { key: "History", label: "History" },
                // { key: "logs", label: "Logs" },
                { key: "self-registration", label: "Self-Registration" },
              ].map((t) => (
                <h2
                  key={t.key}
                  className={`p-2 px-4 ${page === t.key
                    ? "text-blue-500 font-medium  shadow-custom-all-sides"
                    : "text-black"
                    } rounded-t-md cursor-pointer text-center text-sm flex items-center justify-center transition-all duration-300`}
                  onClick={() => handlePageChange(t.key)}
                >
                  {t.label}
                </h2>
              ))}
            </div>
          </div>

          {/* ALL */}
          {page === "all" && (
            <div className="flex flex-col gap-3">
              <div className="grid md:grid-cols-3 gap-2 items-center">
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded-md placeholder:text-sm"
                  value={searchAll}
                  onChange={handleSearchAll}
                  placeholder="Search using Visitor name, Host, vehicle number"
                />

                <div className="border md:flex-row flex-col flex p-2 rounded-md text-center border-black">
                  <span
                    className={`md:border-r px-2 border-gray-300 cursor-pointer hover:underline ${selectedVisitor === "expected" ? "text-blue-600 underline" : ""
                      } text-center`}
                    onClick={() => handleClick("expected")}
                  >
                    <span>{expectedVisitorLabel}</span>
                  </span>
                  <span
                    className={`cursor-pointer hover:underline ${selectedVisitor === "unexpected" ? "text-blue-600 underline" : ""
                      } text-center`}
                    onClick={() => handleClick("unexpected")}
                  >
                    &nbsp; <span>{unexpectedVisitorLabel}</span>
                  </span>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="font-semibold border-2 border-black hover:bg-gray-100 duration-150 transition-all p-2 rounded-md cursor-pointer text-center flex items-center gap-2 justify-center"
                  >
                    <BiFilterAlt size={20} />
                    {showFilters ? "Hide Filters" : "Show Filters"}
                  </button>

                  {/* ✅ NEW Export button for visitor data */}
                  <button
                    onClick={exportVisitorsToCSV}
                    className="font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 duration-150 transition-all p-2 rounded-md cursor-pointer text-center flex items-center gap-2 justify-center"
                  >
                    Export
                  </button>

                  <Link
                    to={"/admin/add-new-visitor"}
                    style={{ background: themeColor }}
                    className="font-semibold hover:text-white duration-150 transition-all p-2 rounded-md text-white cursor-pointer text-center flex items-center gap-2 justify-center"
                  >
                    <PiPlusCircle size={20} />
                    Add New Visitor
                  </Link>
                </div>
              </div>


            </div>
          )}

          {/* VISITOR IN */}
          {page === "Visitor In" && (
            <div className="grid md:grid-cols-3 gap-2 items-center">
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-md placeholder:text-sm"
                value={searchText}
                onChange={handleSearch}
                placeholder="Search using Visitor name, Host, vehicle number"
              />

              <div className="border md:flex-row flex-col flex p-2 rounded-md text-center border-black">
                <span
                  className={`md:border-r px-2 border-gray-300 cursor-pointer hover:underline ${selectedVisitor === "expected" ? "text-blue-600 underline" : ""
                    } text-center`}
                  onClick={() => handleClick("expected")}
                >
                  <span>{expectedVisitorLabel}</span>
                </span>
                <span
                  className={`cursor-pointer hover:underline ${selectedVisitor === "unexpected" ? "text-blue-600 underline" : ""
                    } text-center`}
                  onClick={() => handleClick("unexpected")}
                >
                  &nbsp; <span>{unexpectedVisitorLabel}</span>
                </span>
              </div>

              <div className="flex justify-end gap-2">
                {/* ✅ Export button here too */}
                <button
                  onClick={exportVisitorsToCSV}
                  className="font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 duration-150 transition-all p-2 rounded-md cursor-pointer text-center flex items-center gap-2 justify-center"
                >
                  Export
                </button>

                <Link
                  to={"/admin/add-new-visitor"}
                  style={{ background: themeColor }}
                  className="font-semibold hover:text-white duration-150 transition-all p-2 rounded-md text-white cursor-pointer text-center flex items-center gap-2 justify-center"
                >
                  <PiPlusCircle size={20} />
                  Add New Visitor
                </Link>
              </div>
            </div>
          )}

          {/* VISITOR OUT */}
          {page === "Visitor Out" && (
            <div className="flex flex-col gap-2">
              <div className="grid md:grid-cols-3 gap-2 items-center">
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded-md placeholder:text-sm"
                  value={searchText}
                  onChange={handleSearch}
                  placeholder="Search using Visitor name, Host, vehicle number"
                />

                <div className="border md:flex-row flex-col flex p-2 rounded-md text-center border-black">
                  <span
                    className={`md:border-r px-2 border-black cursor-pointer hover:underline ${selectedVisitor === "expected" ? "text-blue-600 underline" : ""
                      } text-center`}
                    onClick={() => handleClick("expected")}
                  >
                    <span>{expectedVisitorLabel}</span>
                  </span>
                  <span
                    className={`cursor-pointer hover:underline ${selectedVisitor === "unexpected" ? "text-blue-600 underline" : ""
                      } text-center`}
                    onClick={() => handleClick("unexpected")}
                  >
                    &nbsp; <span>{unexpectedVisitorLabel}</span>
                  </span>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={exportVisitorsToCSV}
                    className="font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 duration-150 transition-all p-2 rounded-md cursor-pointer text-center flex items-center gap-2 justify-center"
                  >
                    Export
                  </button>
                </div>
              </div>

              <Table
                columns={VisitorColumns}
                data={
                  selectedVisitor === "expected"
                    ? filteredData
                    // : FilteredUnexpectedVisitor
                    : (searchText ? FilteredUnexpectedVisitor : unexpectedVisitor)
                }

                paginationServer
                paginationTotalRows={totalRecords}
                onChangePage={setCurrentPage}
                paginationPerPage={rowsPerPage}
                paginationRowsPerPageOptions={[rowsPerPage]}
              />
            </div>
          )}

          {/* HISTORY */}
          {page === "History" && (
            <div>
              <div className="flex gap-2 mb-2 items-center">
                <input
                  type="text"
                  placeholder="Search using Name or Mobile Number"
                  className="border p-2 rounded-md border-gray-300 w-full placeholder:text-sm"
                  value={searchHIstoryText}
                  onChange={handleSearchHistory}
                />
                <button
                  onClick={() => setShowFilters(true)}
                  className="border px-3 py-2 rounded-md flex items-center gap-1"
                >
                  <BiFilterAlt />
                  Filter
                </button>

                <button
                  onClick={exportHistoryToCSV}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
                >
                  Export
                </button>
              </div>

              <Table
                columns={historyColumn}
                data={filteredHistory}
                paginationServer
                paginationTotalRows={historyTotalRecords}
                onChangePage={setHistoryPage}
                paginationPerPage={historyRowsPerPage}
                paginationRowsPerPageOptions={[historyRowsPerPage]}
              />
            </div>
          )}

          {/* LOGS */}
          {page === "logs" && (
            <div>
              <input
                type="text"
                placeholder="Search using Name "
                className="border p-2 rounded-md border-gray-300 w-full mb-2 placeholder:text-sm"
                value={logSearchText}
                onChange={handleLogSearch}
              />
              <Table columns={visitorDeviceLogColumn} data={filteredLogs} />
            </div>
          )}

          {/* APPROVALS */}
          {page === "approval" && (
            <div>
              <input
                type="text"
                placeholder="Search using Name or Mobile Number"
                className="border p-2 rounded-md border-gray-300 w-full mb-2 placeholder:text-sm"
                value={searchApprovalText}
                onChange={handleSearchApproval}
              />
              <Table
                columns={approvalColumn}
                data={FilteredApproval}
                paginationServer
                paginationTotalRows={approvalTotalRecords}
                onChangePage={setApprovalPage}
                paginationPerPage={approvalRowsPerPage}
                paginationRowsPerPageOptions={[approvalRowsPerPage]}
              />
            </div>
          )}

          {/* SELF REG */}
          {page === "self-registration" && (
            <div>
              <SelfRegistration />
            </div>
          )}

          {/* TABLES FOR ALL / IN */}
          <div className="my-4">
            {selectedVisitor === "expected" && page === "Visitor In" && (
              <Table
                columns={VisitorColumns}
                data={filteredData}
                paginationServer
                paginationTotalRows={totalRecords}
                onChangePage={setCurrentPage}
                paginationPerPage={rowsPerPage}
                paginationRowsPerPageOptions={[rowsPerPage]}
              />
            )}

            {selectedVisitor === "unexpected" && page === "Visitor In" && (
              <Table
                columns={VisitorColumns}
                // data={FilteredUnexpectedVisitor}
                // data={searchText ? FilteredUnexpectedVisitor : unexpectedVisitor}
                data={securityVisitors}
                paginationServer
                paginationTotalRows={totalRecords}
                onChangePage={setCurrentPage}
                paginationPerPage={rowsPerPage}
                paginationRowsPerPageOptions={[rowsPerPage]}
              />
            )}

            {selectedVisitor === "expected" && page === "all" && (
              <Table
                columns={VisitorColumns}
                data={FilteredExpectedVisitor}
                paginationServer
                paginationTotalRows={totalRecords}
                onChangePage={setCurrentPage}
                paginationPerPage={rowsPerPage}
                paginationRowsPerPageOptions={[rowsPerPage]}
              />
            )}

            {selectedVisitor === "unexpected" && page === "all" && (
              <Table
                columns={VisitorColumns}
                data={FilteredUnexpectedVisitor}
                paginationServer
                paginationTotalRows={totalRecords}
                onChangePage={setCurrentPage}
                paginationPerPage={rowsPerPage}
                paginationRowsPerPageOptions={[rowsPerPage]}
              />
            )}
          </div>
        </div>
        {/* ================= FILTER DRAWER POPUP ================= */}
        {showFilters && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              onClick={() => setShowFilters(false)}
            />

            {/* Drawer */}
            <div className="absolute right-6 top-28 w-[360px] bg-white shadow-xl border rounded-lg z-50 p-5">

              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Filter Visitors</h2>
                <button onClick={() => setShowFilters(false)}>
                  <IoClose size={22} />
                </button>
              </div>

              {/* Expected Date Range */}
              <div className="mb-4">
                <label className="text-sm font-medium block mb-2">
                  {expectedDateRangeLabel}
                </label>

                <div className="flex gap-2">
                  <input
                    type="date"
                    value={page === "History" ? historyDateFrom : filterDateFrom}
                    onChange={(e) =>
                      page === "History"
                        ? setHistoryDateFrom(e.target.value)
                        : setFilterDateFrom(e.target.value)
                    }
                    className="border p-2 rounded-md w-full"
                  />

                  <input
                    type="date"
                    value={page === "History" ? historyDateTo : filterDateTo}
                    onChange={(e) =>
                      page === "History"
                        ? setHistoryDateTo(e.target.value)
                        : setFilterDateTo(e.target.value)
                    }
                    className="border p-2 rounded-md w-full"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="mb-4">
                <label className="text-sm font-medium block mb-2">
                  Mobile Number
                </label>

                <input
                  type="text"
                  placeholder="Enter mobile number"
                  value={page === "History" ? historyMobile : filterMobile}
                  onChange={(e) =>
                    page === "History"
                      ? setHistoryMobile(e.target.value)
                      : setFilterMobile(e.target.value)
                  }
                  className="border p-2 rounded-md w-full"
                />
              </div>

              {/* Building */}
              {/* <div className="mb-4">
                <label className="text-sm font-medium block mb-2">
                  Building
                </label>

                <select
                  value={filterBuilding}
                  onChange={(e) => setFilterBuilding(e.target.value)}
                  className="border p-2 rounded-md w-full"
                >
                  <option value="">Select Building</option>

                  {buildings.map((building) => (
                    <option key={building.id} value={building.id}>
                      {building.name}
                    </option>
                  ))}
                </select>
              </div> */}

              {/* Host Approval */}
              <div className="mb-6">
                <label className="text-sm font-medium block mb-2">
                  Host Approval
                </label>

                <select
                  value={page === "History" ? historyStatus : filterApproval}
                  onChange={(e) =>
                    page === "History"
                      ? setHistoryStatus(e.target.value)
                      : setFilterApproval(e.target.value)
                  }
                  className="border p-2 rounded-md w-full"
                >
                  <option value="">All</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleClearFilters}
                  className="w-full border py-2 rounded-md font-medium"
                >
                  Reset
                </button>

                <button
                  onClick={() => {
                    handleApplyFilters();
                    setShowFilters(false);
                  }}
                  style={{ background: themeColor }}
                  className="w-full text-white py-2 rounded-md font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default VisitorPage;