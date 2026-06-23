import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";

import {
  FaBuilding,
  FaChevronDown,
  FaChevronUp,
  FaDownload,
  FaSpinner,
  FaFileExcel,
  FaFilePdf,
} from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import {
  AiOutlineBarChart,
  AiOutlineLineChart,
  AiOutlineAreaChart,
} from "react-icons/ai";
import { RiPieChartFill } from "react-icons/ri";
import { FiBarChart2, FiAlertTriangle, FiBriefcase } from "react-icons/fi";
import { TbUsers } from "react-icons/tb";
import { FaRegCheckCircle, FaRegCalendar, FaSyncAlt } from "react-icons/fa";

import {
  downloadAsset,
  getBreakdownDownload,
  getAssetInDownload,
  getPPMOverDueDownload,
  getPPMPendingDownload,
  getPPMcompleteDownload,
  getScheduledDownload,
  getRoutineScheduledDownload,
  getRoutineOverdueDownload,
  getRoutineCompleteDownload,
  getRoutinePendingDownload,
  getSiteData,
  getSiteAssetsDashboard,
  getAssetsDashboardSummary,
} from "../../api";
import DetailPopup from "../../components/DetailPopup";
import toast from "react-hot-toast";

const PRIMARY_BLUE = "#1D4ED8";
const LIGHT_BLUE = "#93C5FD";

/* ── helpers ──────────────────────────────────────────────────────────── */
const chartIcon = (type) => {
  switch (type) {
    case "pie": return <RiPieChartFill />;
    case "column": return <AiOutlineBarChart />;
    case "line": return <AiOutlineLineChart />;
    case "area": return <AiOutlineAreaChart />;
    default: return <RiPieChartFill />;
  }
};

const TrendPill = ({ percent, direction = "down" }) => {
  if (percent === null || percent === undefined) return null;
  const isUp = direction === "up";
  return (
    <span className={["inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold",
      isUp ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"].join(" ")}>
      <span className="text-base leading-none">{isUp ? "↗" : "↘"}</span>
      {Math.abs(Number(percent) || 0).toFixed(1)}%
    </span>
  );
};

const LegendRow = ({ items = [] }) => {
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-6 mt-3">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-2 text-sm">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: it.color }} />
          <span className="text-gray-800 font-semibold">
            {it.label}: <span className="font-semibold text-gray-900">{it.value}{it.unit ? ` ${it.unit}` : ""}</span>
          </span>
        </div>
      ))}
    </div>
  );
};

const DownloadIconButton = ({ onClick, loading = false, title = "Download", variant = "neutral" }) => {
  const variants = {
    primary: "bg-[#93C5FD]/70 text-[#1D4ED8] hover:bg-[#93C5FD]/90",
    blue: "bg-blue-100 text-blue-600 hover:bg-blue-200",
    green: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
    yellow: "bg-amber-100 text-amber-800 hover:bg-amber-200",
    red: "bg-rose-100 text-rose-700 hover:bg-rose-200",
    teal: "bg-teal-100 text-teal-700 hover:bg-teal-200",
    pink: "bg-pink-100 text-pink-700 hover:bg-pink-200",
    neutral: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  };
  return (
    <button type="button" onClick={onClick} disabled={loading} title={loading ? "Downloading..." : title}
      className={["h-9 w-9 rounded-xl grid place-items-center transition disabled:opacity-60 disabled:cursor-not-allowed",
        variants[variant] || variants.neutral].join(" ")}>
      {loading ? <FaSpinner className="animate-spin text-sm" /> : <FaDownload className="text-sm" />}
    </button>
  );
};

const buildTwoMetricOptions = ({ type, labels, values, colors = [], seriesName }) => {
  const safeValues = (values || []).map((v) => Number(v) || 0);
  if (type === "pie") {
    return {
      chart: { type: "pie", backgroundColor: "transparent", height: 280 },
      title: { text: null },
      tooltip: { pointFormat: "{point.name}: <b>{point.y}</b>" },
      plotOptions: { pie: { allowPointSelect: false, cursor: "pointer", dataLabels: { enabled: true, format: "<b>{point.name}</b>: {point.y}" } } },
      colors: [PRIMARY_BLUE, LIGHT_BLUE],
      series: [{ name: seriesName, colorByPoint: true, data: labels.map((name, i) => ({ name, y: safeValues[i], color: i === 0 ? PRIMARY_BLUE : LIGHT_BLUE })) }],
      credits: { enabled: false }, exporting: { enabled: false },
    };
  }
  const hcType = type === "line" ? "spline" : type === "area" ? "areaspline" : "column";
  const primary = colors?.[0] || PRIMARY_BLUE;
  const areaFill = type === "area" ? {
    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
    stops: [[0, Highcharts.color(primary).setOpacity(0.25).get("rgba")], [1, Highcharts.color(primary).setOpacity(0).get("rgba")]],
  } : undefined;
  return {
    chart: { type: hcType, backgroundColor: "transparent", height: 280, spacing: [8, 8, 8, 8] },
    title: { text: null },
    xAxis: { categories: labels, lineColor: "#E5E7EB", tickColor: "#E5E7EB", labels: { style: { color: "#6B7280", fontSize: "12px" } } },
    yAxis: { title: { text: null }, gridLineColor: "#E5E7EB", gridLineDashStyle: "Dash", labels: { style: { color: "#6B7280", fontSize: "12px" } } },
    tooltip: { shared: false, backgroundColor: "#FFFFFF", borderColor: "#E5E7EB", borderRadius: 10, shadow: false, pointFormat: "<b>{point.y}</b>" },
    legend: { enabled: false },
    plotOptions: {
      column: { borderRadius: 10, pointPadding: 0.12, groupPadding: 0.22 },
      series: { animation: true, lineWidth: 3, marker: type === "line" || type === "area" ? { enabled: true, radius: 4, lineWidth: 2, lineColor: primary, fillColor: "#FFFFFF" } : { enabled: false } },
    },
    series: [{ name: seriesName, color: primary, colorByPoint: type === "column", data: type === "column" ? safeValues.map((y, i) => ({ y, color: i === 0 ? PRIMARY_BLUE : LIGHT_BLUE })) : safeValues, fillColor: areaFill }],
    credits: { enabled: false }, exporting: { enabled: false },
  };
};

const DownloadMenu = ({ onExcelDownload, onChartDownload }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(!open)}
        className="h-9 w-10 grid place-items-center rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
        title="Download Options">
        <FaDownload className="text-sm" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-50 overflow-hidden">
          <button onClick={() => { onExcelDownload(); setOpen(false); }}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 font-medium flex items-center gap-2 text-sm">
            <FaFileExcel className="text-green-600" /> Download Excel
          </button>
          <button onClick={() => { onChartDownload(); setOpen(false); }}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 font-medium flex items-center gap-2 text-sm">
            <FaFilePdf className="text-red-500" /> Download Chart
          </button>
        </div>
      )}
    </div>
  );
};

const ChartTypeMenu = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const items = [{ key: "pie", label: "Pie" }, { key: "column", label: "Column" }, { key: "line", label: "Line" }, { key: "area", label: "Area" }];
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((p) => !p)}
        className="h-9 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition flex items-center gap-2 text-gray-800 relative" title="Change chart type">
        <span className="text-base">{chartIcon(value)}</span>
        <FaChevronDown className="absolute right-1 bottom-1 text-[10px] opacity-70" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-36 rounded-xl border border-gray-200 bg-white shadow-lg z-20 overflow-hidden">
          {items.map((it) => (
            <button key={it.key} type="button" onClick={() => { onChange(it.key); setOpen(false); }}
              className={["w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50", value === it.key ? "bg-gray-50 font-semibold" : ""].join(" ")}>
              <span className="text-base">{chartIcon(it.key)}</span>{it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ChartCard = ({ title, subtitle, trendPercent = null, trendDirection = "down", onExcelDownload, onChartDownload, chartRef, chartType, setChartType, options }) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[18px] font-bold text-gray-900 truncate">{title}</p>
          {subtitle ? <p className="text-sm text-gray-500 truncate mt-1">{subtitle}</p> : null}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <TrendPill percent={trendPercent} direction={trendDirection} />
          <ChartTypeMenu value={chartType} onChange={setChartType} />
          <DownloadMenu onExcelDownload={onExcelDownload} onChartDownload={onChartDownload} />
        </div>
      </div>
      <div className="mt-2">
        <div ref={chartRef}>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </div>
    </div>
  );
};

/* ── main component ───────────────────────────────────────────────────── */

// ✅ All counts start at 0 — filled by a single API call
const DEFAULT_COUNTS = {
  total_assets: 0,
  assets_in_use: 0,
  assets_in_breakdown: 0,
  ppm_scheduled: 0,
  ppm_overdue: 0,
  ppm_complete: 0,
  ppm_pending: 0,
  routine_task_scheduled: 0,
  routine_task_overdue: 0,
  routine_task_complete: 0,
  routine_task_pending: 0,
};

function AssetDashboard() {
  // ✅ Single state object replaces 11 individual useState calls
  const [counts, setCounts] = useState(DEFAULT_COUNTS);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [activeStartDate, setActiveStartDate] = useState(null);
  const [activeEndDate, setActiveEndDate] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [assetChartType, setAssetChartType] = useState("pie");
  const [ppmChartType, setPPMChartType] = useState("pie");
  const [routineChartType, setRoutineChartType] = useState("pie");

  const assetChartRef = useRef(null);
  const ppmChartRef = useRef(null);
  const routineChartRef = useRef(null);

  const downloadSingleChartPdf = async (ref, fileName) => {
    const toastId = toast.loading("Generating chart PDF...");
    try {
      if (!ref?.current) { toast.dismiss(toastId); toast.error("Chart not found"); return; }
      const canvas = await html2canvas(ref.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW - 20;
      const imgH = (canvas.height * imgW) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, (pageH - imgH) / 2, imgW, imgH);
      pdf.save(`${fileName}.pdf`);
      toast.dismiss(toastId);
      toast.success("Chart PDF downloaded");
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error("Chart PDF download failed");
    }
  };

  const [site, setSite] = useState(false);
  const [siteData, setSiteData] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);

  const [assetDetailPopup, setAssetDetailPopup] = useState({ open: false, title: "", records: [], loading: false, page: 1, totalPages: 1 });
  const [activeAssetFilter, setActiveAssetFilter] = useState({ countType: "", countValue: "", title: "" });

  /* date formatter */
  const fmtDate = (d) => {
    if (!d) return null;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  // ✅ ONE function, ONE API call — maps all keys from the response
  const fetchAllCounts = async (startDate = null, endDate = null) => {
    try {
      const res = await getAssetsDashboardSummary(startDate, endDate);
      const d = res?.data || {};

      setCounts({
        total_assets: d.total_assets ?? 0,
        assets_in_use: d.assets_in_use ?? 0,
        assets_in_breakdown: d.assets_in_breakdown ?? 0,
        ppm_scheduled: d.ppm_scheduled ?? 0,
        ppm_overdue: d.ppm_overdue ?? 0,
        ppm_complete: d.ppm_complete ?? 0,
        ppm_pending: d.ppm_pending ?? 0,
        routine_task_scheduled: d.routine_task_scheduled ?? 0,
        routine_task_overdue: d.routine_task_overdue ?? 0,
        routine_task_complete: d.routine_task_complete ?? 0,
        routine_task_pending: d.routine_task_pending ?? 0,
      });
    } catch (err) {
      console.error("Dashboard summary error:", err);
      toast.error("Failed to fetch dashboard data");
    }
  };

  useEffect(() => { fetchAllCounts(); }, []);

  /* date filter */
  const applyDateFilter = (type) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let start = new Date(today);
    let end = new Date(today);

    switch (type) {
      case "today": break;
      case "week": { start.setDate(today.getDate() - today.getDay()); break; }
      case "month": { start = new Date(today.getFullYear(), today.getMonth(), 1); end = new Date(today.getFullYear(), today.getMonth() + 1, 0); break; }
      case "quarter": { const q = Math.floor(today.getMonth() / 3) * 3; start = new Date(today.getFullYear(), q, 1); end = new Date(today.getFullYear(), q + 3, 0); break; }
      case "year": { start = new Date(today.getFullYear(), 0, 1); end = new Date(today.getFullYear(), 11, 31); break; }
      default: return;
    }
    setActiveStartDate(start);
    setActiveEndDate(end);
    fetchAllCounts(fmtDate(start), fmtDate(end));
  };

  const handleClearFilter = () => {
    setActiveStartDate(null); setActiveEndDate(null);
    setCustomStartDate(null); setCustomEndDate(null);
    setFilterType(""); setFilterOpen(false);
    fetchAllCounts();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllCounts(fmtDate(activeStartDate), fmtDate(activeEndDate));
    setRefreshing(false);
  };

  /* sites */
  useEffect(() => {
    getSiteData().then((res) => setSiteData(res.data.sites || [])).catch(console.error);
  }, []);
  useEffect(() => {
    const onOut = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false); };
    document.addEventListener("mousedown", onOut);
    return () => document.removeEventListener("mousedown", onOut);
  }, []);
  const handleSelectAll = () => setSelectedSites(selectedSites.length === siteData.length ? [] : siteData.map((s) => s.id));
  const handleSiteCheckbox = (id) => setSelectedSites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const applySelection = () => fetchAllCounts(fmtDate(activeStartDate), fmtDate(activeEndDate));

  /* downloads — shared helper */
  const mkDownload = (apiFn, filename, label) => async () => {
    const id = toast.loading("Downloading Please Wait");
    try {
      const res = await apiFn(fmtDate(activeStartDate), fmtDate(activeEndDate));
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a"); a.href = url; a.download = filename;
      document.body.appendChild(a); a.click(); a.remove(); window.URL.revokeObjectURL(url);
      toast.dismiss(id); toast.success(`${label} downloaded successfully`);
    } catch { toast.dismiss(id); toast.error("Something went wrong, please try again"); }
  };

  const handleTotalAssetDownload = mkDownload(downloadAsset, "Total_Asset_file.xlsx", "Total Asset");
  const handleTotalBreakdownDownload = mkDownload(getBreakdownDownload, "BreakDown_file.xlsx", "Asset Breakdown");
  const assetInUseDownload = mkDownload(getAssetInDownload, "inUse_file.xlsx", "In Use Asset");
  const handleScheduledDownload = mkDownload(getScheduledDownload, "scheduled_file.xlsx", "PPM Scheduled");
  const handlePPMOverDueDownload = mkDownload(getPPMOverDueDownload, "ppm_Over_Due_file.xlsx", "PPM Overdue");
  const handlePPMPendingDownload = mkDownload(getPPMPendingDownload, "ppm_pending_file.xlsx", "PPM Pending");
  const handlePPMCompleteDownload = mkDownload(getPPMcompleteDownload, "ppm_complete_file.xlsx", "PPM Complete");
  const handleRoutineScheduledDownload = mkDownload(getRoutineScheduledDownload, "routine_scheduled_file.xlsx", "Routine Scheduled");
  const handleRoutineOverDueDownload = mkDownload(getRoutineOverdueDownload, "routine_overdue_file.xlsx", "Routine Overdue");
  const handleRoutinePendingDownload = mkDownload(getRoutinePendingDownload, "routine_pending_file.xlsx", "Routine Pending");
  const handleRoutineCompleteDownload = mkDownload(getRoutineCompleteDownload, "routine_complete_file.xlsx", "Routine Complete");

  /* ── Chart-specific Excel export helpers ────────────────────────────── */

  /** Fetch ALL pages of records for a given countType from the drill-down API.
   *  Handles two possible response shapes:
   *    (A) nested  → res.data[countType].records   (e.g. res.data.ppm_overdue.records)
   *    (B) flat    → res.data.records
   */
  const fetchAllPages = async (countType) => {
    const allRecords = [];
    let page = 1;
    while (true) {
      const res = await getSiteAssetsDashboard(countType, countType, page, fmtDate(activeStartDate), fmtDate(activeEndDate));
      const data = res?.data || {};

      // Shape (A): nested under countType key
      const nested = data[countType];
      const isNestedObj = nested && typeof nested === "object" && !Array.isArray(nested);
      const bucket = isNestedObj ? nested : data;

      const records = Array.isArray(bucket.records) ? bucket.records : [];
      // Debug — check browser DevTools console if records still appear empty
      console.log(`[fetchAllPages] ${countType} page=${page}`, {
        dataKeys: Object.keys(data),
        bucketKeys: Object.keys(bucket),
        recordCount: records.length,
        totalPages: bucket.total_pages,
      });

      allRecords.push(...records);
      const totalPages = Number(bucket.total_pages) || 1;
      if (page >= totalPages || records.length === 0) break;
      page++;
    }
    console.log(`[fetchAllPages] ${countType} TOTAL records:`, allRecords.length);
    return allRecords;
  };

  /**
   * Build and trigger an xlsx download with two sheets:
   *   Sheet 1 – "Summary"  : count totals per slice
   *   Sheet 2 – "Records"  : all detailed rows (with a Status column prepended)
   */
  const exportChartToXlsx = (summaryRows, detailRows, filename) => {
    const wb = XLSX.utils.book_new();

    // Sheet 1 — Summary
    const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

    // Sheet 2 — Details (only if records exist)
    if (detailRows.length > 0) {
      const wsDetails = XLSX.utils.json_to_sheet(detailRows);
      XLSX.utils.book_append_sheet(wb, wsDetails, "Records");
    }

    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Flatten an ASSET record (assets_in_use / assets_in_breakdown).
   * API fields: name, asset_number, building_name, floor_name, unit_name,
   *             asset_group_name, vendor_name, breakdown
   */
  const flattenAssetRecord = (r, status) => ({
    "Status": status,
    "Asset Name": r.name ?? "—",
    "Asset No.": r.asset_number ?? "—",
    "Building": r.building_name ?? "—",
    "Floor": r.floor_name ?? "—",
    "Unit": r.unit_name ?? "—",
    "Group": r.asset_group_name ?? "—",
    "Vendor": r.vendor_name ?? "—",
    "Breakdown": r.breakdown !== undefined ? (r.breakdown ? "Yes" : "No") : "—",
    "Created On": r.created_at ? new Date(r.created_at).toLocaleDateString("en-IN") : "—",
  });

  /**
   * Flatten an ACTIVITY record (ppm_overdue, ppm_complete,
   *                              routine_task_overdue, routine_task_complete).
   * API fields: asset_name (or name), checklist_name, status,
   *             assigned_to / assigned_to_name, start_time, created_at
   */
  const flattenActivityRecord = (r, status) => ({
    "Status": status,
    "Asset Name": r.asset_name ?? r.name ?? "—",
    "Checklist": r.checklist_name ?? "—",
    "Assigned To": Array.isArray(r.assigned_to)
      ? (r.assigned_to.join(", ") || "Unassigned")
      : (r.assigned_to_name ?? r.assigned_name ?? "Unassigned"),
    "Start Time": r.start_time ? new Date(r.start_time).toLocaleDateString("en-IN") : "—",
    "Created On": r.created_at ? new Date(r.created_at).toLocaleDateString("en-IN") : "—",
  });

  /* ── Total Asset chart download ──────────────────────────────────────── */
  const handleAssetChartDownload = async () => {
    const id = toast.loading("Preparing Asset report…");
    try {
      const [inUseRecs, breakdownRecs] = await Promise.all([
        fetchAllPages("assets_in_use"),
        fetchAllPages("assets_in_breakdown"),
      ]);

      const summaryRows = [
        { "Category": "In Use Asset", "Count": counts.assets_in_use },
        { "Category": "Asset Breakdown", "Count": counts.assets_in_breakdown },
        { "Category": "Total", "Count": counts.assets_in_use + counts.assets_in_breakdown },
      ];
      const detailRows = [
        ...inUseRecs.map((r) => flattenAssetRecord(r, "In Use")),
        ...breakdownRecs.map((r) => flattenAssetRecord(r, "Breakdown")),
      ];

      exportChartToXlsx(summaryRows, detailRows, "Total_Asset_Chart.xlsx");
      toast.dismiss(id);
      toast.success("Asset report downloaded");
    } catch (err) {
      console.error(err);
      toast.dismiss(id);
      toast.error("Failed to download Asset report");
    }
  };

  /* ── Total PPM chart download ─────────────────────────────────────────── */
  const handlePPMChartDownload = async () => {
    const id = toast.loading("Preparing PPM report…");
    try {
      const [overdueRecs, completeRecs] = await Promise.all([
        fetchAllPages("ppm_overdue"),
        fetchAllPages("ppm_complete"),
      ]);

      const summaryRows = [
        { "Category": "PPM Overdue", "Count": counts.ppm_overdue },
        { "Category": "PPM Complete", "Count": counts.ppm_complete },
        { "Category": "Total", "Count": counts.ppm_overdue + counts.ppm_complete },
      ];
      const detailRows = [
        ...overdueRecs.map((r) => flattenActivityRecord(r, "Overdue")),
        ...completeRecs.map((r) => flattenActivityRecord(r, "Complete")),
      ];

      exportChartToXlsx(summaryRows, detailRows, "Total_PPM_Chart.xlsx");
      toast.dismiss(id);
      toast.success("PPM report downloaded");
    } catch (err) {
      console.error(err);
      toast.dismiss(id);
      toast.error("Failed to download PPM report");
    }
  };

  /* ── Total Routine Task chart download ───────────────────────────────── */
  const handleRoutineChartDownload = async () => {
    const id = toast.loading("Preparing Routine Task report…");
    try {
      const [overdueRecs, completeRecs] = await Promise.all([
        fetchAllPages("routine_task_overdue"),
        fetchAllPages("routine_task_complete"),
      ]);

      const summaryRows = [
        { "Category": "Routine Overdue", "Count": counts.routine_task_overdue },
        { "Category": "Routine Complete", "Count": counts.routine_task_complete },
        { "Category": "Total", "Count": counts.routine_task_overdue + counts.routine_task_complete },
      ];
      const detailRows = [
        ...overdueRecs.map((r) => flattenActivityRecord(r, "Overdue")),
        ...completeRecs.map((r) => flattenActivityRecord(r, "Complete")),
      ];

      exportChartToXlsx(summaryRows, detailRows, "Total_Routine_Chart.xlsx");
      toast.dismiss(id);
      toast.success("Routine Task report downloaded");
    } catch (err) {
      console.error(err);
      toast.dismiss(id);
      toast.error("Failed to download Routine Task report");
    }
  };

  /* ✅ Card definitions now read from counts state */
  const cardData = [
    { title: "Total Asset", count: counts.total_assets, downloadHandler: handleTotalAssetDownload, icon: <FiBriefcase className="w-4 h-4" /> },
    { title: "Asset Breakdown", count: counts.assets_in_breakdown, downloadHandler: handleTotalBreakdownDownload, icon: <FiBarChart2 className="w-4 h-4" /> },
    { title: "In Use Asset", count: counts.assets_in_use, downloadHandler: assetInUseDownload, icon: <TbUsers className="w-4 h-4" /> },
    { title: "PPM Scheduled", count: counts.ppm_scheduled, downloadHandler: handleScheduledDownload, icon: <FaRegCalendar className="w-4 h-4" /> },
    { title: "PPM Overdue", count: counts.ppm_overdue, downloadHandler: handlePPMOverDueDownload, icon: <FiAlertTriangle className="w-4 h-4" /> },
    { title: "PPM Complete", count: counts.ppm_complete, downloadHandler: handlePPMCompleteDownload, icon: <FaRegCheckCircle className="w-4 h-4" /> },
    { title: "Routine Task Scheduled", count: counts.routine_task_scheduled, downloadHandler: handleRoutineScheduledDownload, icon: <FaRegCalendar className="w-4 h-4" /> },
    { title: "Routine Task Overdue", count: counts.routine_task_overdue, downloadHandler: handleRoutineOverDueDownload, icon: <FiAlertTriangle className="w-4 h-4" /> },
    { title: "Routine Task Complete", count: counts.routine_task_complete, downloadHandler: handleRoutineCompleteDownload, icon: <FaRegCheckCircle className="w-4 h-4" /> },
  ];

  const [selectedTitles, setSelectedTitles] = useState(cardData.map((c) => c.title));

  const cardTheme = (title) => {
    switch (title) {
      case "Total Asset": return { bg: "bg-blue-50", text: "text-blue-500", dl: "blue" };
      case "Asset Breakdown": return { bg: "bg-green-50", text: "text-green-500", dl: "green" };
      case "In Use Asset": return { bg: "bg-yellow-50", text: "text-yellow-600", dl: "yellow" };
      case "PPM Scheduled": return { bg: "bg-blue-50", text: "text-blue-500", dl: "blue" };
      case "PPM Overdue": return { bg: "bg-red-50", text: "text-red-500", dl: "red" };
      case "PPM Complete": return { bg: "bg-teal-50", text: "text-teal-600", dl: "teal" };
      case "Routine Task Scheduled": return { bg: "bg-blue-50", text: "text-blue-500", dl: "blue" };
      case "Routine Task Overdue": return { bg: "bg-pink-50", text: "text-pink-500", dl: "pink" };
      case "Routine Task Complete": return { bg: "bg-green-50", text: "text-green-600", dl: "green" };
      default: return { bg: "bg-gray-50", text: "text-gray-500", dl: "neutral" };
    }
  };

  /* drill-down */
  const assetCardToFilter = {
    "Total Asset": { countType: "total_assets", countValue: "total_assets" },
    "Asset Breakdown": { countType: "assets_in_breakdown", countValue: "assets_in_breakdown" },
    "In Use Asset": { countType: "assets_in_use", countValue: "assets_in_use" },
    "PPM Scheduled": { countType: "ppm_scheduled", countValue: "ppm_scheduled" },
    "PPM Overdue": { countType: "ppm_overdue", countValue: "ppm_overdue" },
    "PPM Complete": { countType: "ppm_complete", countValue: "ppm_complete" },
    "Routine Task Scheduled": { countType: "routine_task_scheduled", countValue: "routine_task_scheduled" },
    "Routine Task Overdue": { countType: "routine_task_overdue", countValue: "routine_task_overdue" },
    "Routine Task Complete": { countType: "routine_task_complete", countValue: "routine_task_complete" },
  };

  const fetchAssetDrillRecords = async (countType, countValue, title, page = 1) => {
    setAssetDetailPopup((prev) => ({ ...prev, open: true, title, records: [], loading: true, page }));
    setActiveAssetFilter({ countType, countValue, title });
    try {
      const res = await getSiteAssetsDashboard(countType, countValue, page, fmtDate(activeStartDate), fmtDate(activeEndDate));
      const data = res?.data || {};
      const bucket = data[countType] || {};
      const records = Array.isArray(bucket.records) ? bucket.records : [];
      const totalPages =
        Number(bucket.total_pages) ||
        (bucket.per_page > 0 ? Math.max(1, Math.ceil((bucket.count || records.length) / bucket.per_page)) : 1);
      setAssetDetailPopup({ open: true, title, records, loading: false, page: Number(bucket.current_page) || page, totalPages });
    } catch (err) {
      console.error("Asset drill error:", err);
      toast.error("Failed to load asset list");
      setAssetDetailPopup((p) => ({ ...p, loading: false }));
    }
  };

  const handleAssetCardClick = (cardTitle) => {
    const filter = assetCardToFilter[cardTitle];
    if (!filter) return;
    fetchAssetDrillRecords(filter.countType, filter.countValue, cardTitle, 1);
  };

  const onAssetPageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > assetDetailPopup.totalPages) return;
    fetchAssetDrillRecords(activeAssetFilter.countType, activeAssetFilter.countValue, activeAssetFilter.title, nextPage);
  };

  const handleCheckboxChange = (title) =>
    setSelectedTitles((prev) => prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]);

  /* chart options */
  const totalAssetOptions = buildTwoMetricOptions({ type: assetChartType, labels: ["In Use Asset", "Break Down"], values: [counts.assets_in_use, counts.assets_in_breakdown], colors: [PRIMARY_BLUE, LIGHT_BLUE], seriesName: "Asset" });
  const totalPPMOptions = buildTwoMetricOptions({ type: ppmChartType, labels: ["PPM Overdue", "PPM Complete"], values: [counts.ppm_overdue, counts.ppm_complete], colors: [PRIMARY_BLUE, LIGHT_BLUE], seriesName: "PPM" });
  const totalRoutineOptions = buildTwoMetricOptions({ type: routineChartType, labels: ["Routine Overdue", "Routine Complete"], values: [counts.routine_task_overdue, counts.routine_task_complete], colors: [PRIMARY_BLUE, LIGHT_BLUE], seriesName: "Routine" });

  return (
    <div className="w-full overflow-hidden flex flex-col">
      {/* Top Controls */}
      <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Site dropdown */}
          <div className="relative">
            <button onClick={() => setSite((p) => !p)}
              className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl flex justify-between gap-2 items-center w-full sm:w-60 shadow-sm">
              <span className="flex items-center gap-2"><FaBuilding /> Select site</span>
              {site ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
            </button>
            {site && (
              <div className="absolute left-0 top-12 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 w-full sm:w-60 overflow-y-auto z-10">
                <div className="flex items-center space-x-2 px-2">
                  <input type="checkbox" id="selectAll" checked={siteData.length > 0 && selectedSites.length === siteData.length} onChange={handleSelectAll} />
                  <label htmlFor="selectAll" className="cursor-pointer text-sm">Select All</label>
                </div>
                {siteData.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 px-2 py-1 text-sm">
                    <input type="checkbox" checked={selectedSites.includes(s.id)} onChange={() => handleSiteCheckbox(s.id)} />
                    <span className="truncate">{s.name}</span>
                  </label>
                ))}
                <button onClick={() => { applySelection(); setSite(false); }} className="w-full bg-gray-800 text-white py-2 mt-2 rounded-xl hover:bg-gray-900 text-sm">Apply</button>
              </div>
            )}
          </div>

          {/* Assets visibility dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen((p) => !p)}
              className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl flex gap-2 items-center shadow-sm">
              <IoSettingsOutline /> Assets {isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {isDropdownOpen && (
              <div className="absolute top-12 left-0 w-full sm:w-64 rounded-xl shadow-lg bg-white border border-gray-200 z-10">
                {cardData.map((card) => (
                  <label key={card.title} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" checked={selectedTitles.includes(card.title)} onChange={() => handleCheckboxChange(card.title)} />
                    <span className="ml-2 text-sm">{card.title}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Refresh + Filter */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <button onClick={handleRefresh} disabled={refreshing} title="Reload data"
            className="bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-xl flex items-center shadow-sm hover:bg-gray-50 disabled:opacity-50">
            <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
          </button>

          <div className="relative inline-block">
            <button onClick={() => setFilterOpen((p) => !p)}
              className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
              <FaRegCalendar />
              {activeStartDate ? `${fmtDate(activeStartDate)}${activeEndDate ? ` – ${fmtDate(activeEndDate)}` : ""}` : "Filter"}
              {filterOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </button>
            {filterOpen && (
  <div
    className="
      absolute top-full mt-2 left-0
      w-48 sm:w-52
      bg-white
      border border-gray-200
      rounded-lg
      shadow-xl
      z-[9999]
      overflow-hidden
    "
  >
    {[
      ["today", "Today"],
      ["week", "This Week"],
      ["month", "This Month"],
      ["quarter", "This Quarter"],
      ["year", "This Year"],
    ].map(([k, label]) => (
      <button
        key={k}
        onClick={() => {
          applyDateFilter(k);
          setFilterOpen(false);
        }}
        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100"
      >
        {label}
      </button>
    ))}

    <button
      onClick={() => setFilterType("custom")}
      className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100"
    >
      Custom Range
    </button>

    {activeStartDate && (
      <button
        onClick={handleClearFilter}
        className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50"
      >
        Clear Filter
      </button>
    )}

    {filterType === "custom" && (
      <div className="border-t p-3">
        <DatePicker
          selected={customStartDate}
          onChange={setCustomStartDate}
          placeholderText="Start Date"
          className="w-full border rounded p-2 mb-2"
        />

        <DatePicker
          selected={customEndDate}
          onChange={setCustomEndDate}
          placeholderText="End Date"
          className="w-full border rounded p-2 mb-2"
        />

        <Button
          className="w-full"
          onClick={() => {
            if (customStartDate) {
              const endD = customEndDate || new Date();
              setActiveStartDate(customStartDate);
              setActiveEndDate(endD);
              fetchAllCounts(
                fmtDate(customStartDate),
                fmtDate(endD)
              );
            }
            setFilterOpen(false);
          }}
        >
          Apply
        </Button>
      </div>
    )}
  </div>
)}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mx-2 sm:mx-3">
        {cardData.map((card) => {
          if (!selectedTitles.includes(card.title)) return null;
          const theme = cardTheme(card.title);
          const isClickable = !!assetCardToFilter[card.title];
          return (
            <div key={card.title}
              role={isClickable ? "button" : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onClick={isClickable ? (e) => { if (!e.target.closest("button")) handleAssetCardClick(card.title); } : undefined}
              onKeyDown={isClickable ? (e) => e.key === "Enter" && handleAssetCardClick(card.title) : undefined}
              className={`${theme.bg} ${theme.text} shadow-custom-all-sides border py-3 px-3 rounded-2xl flex flex-col text-sm font-medium min-h-[130px] ${isClickable ? "cursor-pointer hover:shadow-md transition" : ""}`}>
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-base text-gray-800">{card.title}</h2>
                <div className="flex items-center gap-2">
                  <span className={theme.text}>{card.icon}</span>
                  <DownloadIconButton onClick={card.downloadHandler} variant={theme.dl} />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-start">
                {/* ✅ Correct count from single API */}
                <span className="text-3xl font-semibold text-gray-900">{card.count}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 my-6 mx-2 sm:mx-3">
        <ChartCard title="Total Asset" trendPercent={20.7} trendDirection="down"
          onExcelDownload={handleAssetChartDownload}
          onChartDownload={() => downloadSingleChartPdf(assetChartRef, "Total_Asset_Chart")}
          chartRef={assetChartRef}
          chartType={assetChartType} setChartType={setAssetChartType} options={totalAssetOptions} />
        <ChartCard title="Total PPM" trendPercent={21.7} trendDirection="down"
          onExcelDownload={handlePPMChartDownload}
          onChartDownload={() => downloadSingleChartPdf(ppmChartRef, "Total_PPM_Chart")}
          chartRef={ppmChartRef}
          chartType={ppmChartType} setChartType={setPPMChartType} options={totalPPMOptions} />
        <ChartCard title="Total Routine Task" trendPercent={10.2} trendDirection="up"
          onExcelDownload={handleRoutineChartDownload}
          onChartDownload={() => downloadSingleChartPdf(routineChartRef, "Total_Routine_Chart")}
          chartRef={routineChartRef}
          chartType={routineChartType} setChartType={setRoutineChartType} options={totalRoutineOptions} />
      </div>

      {/* Detail Popup */}
      <DetailPopup
        isOpen={assetDetailPopup.open}
        onClose={() => setAssetDetailPopup((p) => ({ ...p, open: false }))}
        title={assetDetailPopup.title}
        subtitle={`Page ${assetDetailPopup.page} of ${assetDetailPopup.totalPages}`}
        records={assetDetailPopup.records}
        loading={assetDetailPopup.loading}
        page={assetDetailPopup.page}
        totalPages={assetDetailPopup.totalPages}
        onPageChange={onAssetPageChange}
        columns={
          ["total_assets", "assets_in_use", "assets_in_breakdown"].includes(activeAssetFilter.countType)
            ? [
              { key: "name", label: "Name", accessor: (r) => r.name ?? "—" },
              { key: "asset_number", label: "Asset No.", accessor: (r) => r.asset_number ?? "—" },
              { key: "building_name", label: "Building", accessor: (r) => r.building_name ?? "—" },
              { key: "floor_name", label: "Floor", accessor: (r) => r.floor_name ?? "—" },
              { key: "unit_name", label: "Unit", accessor: (r) => r.unit_name ?? "—" },
              { key: "asset_group_name", label: "Group", accessor: (r) => r.asset_group_name ?? "—" },
              { key: "vendor_name", label: "Vendor", accessor: (r) => r.vendor_name ?? "—" },
              { key: "breakdown", label: "Breakdown", accessor: (r) => (r.breakdown ? "Yes" : "No") },
            ]
            : [
              { key: "name", label: "Asset Name", accessor: (r) => r.name ?? r.asset_name ?? "—" },
              { key: "checklist_name", label: "Checklist Name", accessor: (r) => r.checklist_name ?? "—" },
              { key: "status", label: "Status", accessor: (r) => r.status ?? "—" },
              { key: "assigned_to", label: "Assigned To", accessor: (r) => Array.isArray(r.assigned_to) ? (r.assigned_to.length ? r.assigned_to.join(", ") : "Unassigned") : (r.assigned_to_name ?? r.assigned_name ?? "Unassigned") },
              { key: "start_time", label: "Start Time", accessor: (r) => r.start_time ? new Date(r.start_time).toLocaleDateString("en-IN") : "—" },
              { key: "created_at", label: "Created On", accessor: (r) => r.created_at ? new Date(r.created_at).toLocaleDateString("en-IN") : "—" },
            ]
        }
      />
    </div>
  );
}

export default AssetDashboard;