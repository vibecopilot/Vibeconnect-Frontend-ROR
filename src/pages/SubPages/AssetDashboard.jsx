import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  FaBuilding,
  FaChevronDown,
  FaChevronUp,
  FaDownload,
  FaSpinner,
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
  getBreakCount,
  getInUseAssetBreakDown,
  getTotalAssetCount,
  getPPMOverDueCount,
  getPPMpendingCount,
  getPPMCompleteCount,
  getPPMOverDueDownload,
  getPPMPendingDownload,
  getPPMcompleteDownload,
  getScheduledDownload,
  getRoutineScheduledDownload,
  getRoutineScheduledCount,
  getRoutineOverdueCount,
  getRoutineCompleteCount,
  getPPMScheduleCount,
  getRoutineOverdueDownload,
  getRoutineCompleteDownload,
  getAssetInDownload,
  getRoutinePendingDownload,
  getRoutinePendingCount,
  getSiteData,
  getTotalAssetCounts,
  getSiteAssetsDashboard,
  getAssetsDashboardSummary,
} from "../../api";
import DetailPopup from "../../components/DetailPopup";

import toast from "react-hot-toast";

/** ✅ Required palette */
const PRIMARY_BLUE = "#1D4ED8";
const LIGHT_BLUE = "#93C5FD";

/** ---------------- helpers ---------------- */
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
    <span
      className={[
        "inline-flex items-center gap-1",
        "px-3 py-1 rounded-full text-sm font-semibold",
        isUp ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700",
      ].join(" ")}
    >
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
  const cls = variants[variant] || variants.neutral;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      title={loading ? "Downloading..." : title}
      className={["h-9 w-9 rounded-xl grid place-items-center transition", "disabled:opacity-60 disabled:cursor-not-allowed", cls].join(" ")}
    >
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
      plotOptions: {
        pie: {
          allowPointSelect: false,
          cursor: "pointer",
          dataLabels: { enabled: true, format: "<b>{point.name}</b>: {point.y}" },
        },
      },
      colors: [PRIMARY_BLUE, LIGHT_BLUE],
      series: [{
        name: seriesName,
        colorByPoint: true,
        data: labels.map((name, i) => ({
          name,
          y: safeValues[i],
          color: i === 0 ? PRIMARY_BLUE : i === 1 ? LIGHT_BLUE : colors?.[i],
        })),
      }],
      credits: { enabled: false },
      exporting: { enabled: false },
    };
  }

  const hcType = type === "line" ? "spline" : type === "area" ? "areaspline" : "column";
  const primary = colors?.[0] || PRIMARY_BLUE;
  const areaFill = type === "area" ? {
    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
    stops: [
      [0, Highcharts.color(primary).setOpacity(0.25).get("rgba")],
      [1, Highcharts.color(primary).setOpacity(0).get("rgba")],
    ],
  } : undefined;

  return {
    chart: { type: hcType, backgroundColor: "transparent", height: 280, spacing: [8, 8, 8, 8] },
    title: { text: null },
    xAxis: {
      categories: labels,
      lineColor: "#E5E7EB",
      tickColor: "#E5E7EB",
      labels: { style: { color: "#6B7280", fontSize: "12px" } },
    },
    yAxis: {
      title: { text: null },
      gridLineColor: "#E5E7EB",
      gridLineDashStyle: "Dash",
      labels: { style: { color: "#6B7280", fontSize: "12px" } },
    },
    tooltip: {
      shared: false,
      backgroundColor: "#FFFFFF",
      borderColor: "#E5E7EB",
      borderRadius: 10,
      shadow: false,
      pointFormat: "<b>{point.y}</b>",
    },
    legend: { enabled: false },
    plotOptions: {
      column: { borderRadius: 10, pointPadding: 0.12, groupPadding: 0.22 },
      series: {
        animation: true,
        lineWidth: 3,
        marker: type === "line" || type === "area"
          ? { enabled: true, radius: 4, lineWidth: 2, lineColor: primary, fillColor: "#FFFFFF" }
          : { enabled: false },
      },
    },
    series: [{
      name: seriesName,
      color: primary,
      colorByPoint: type === "column",
      data: type === "column"
        ? safeValues.map((y, i) => ({ y, color: i === 0 ? PRIMARY_BLUE : i === 1 ? LIGHT_BLUE : primary }))
        : safeValues,
      fillColor: areaFill,
    }],
    credits: { enabled: false },
    exporting: { enabled: false },
  };
};

const ChartTypeMenu = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const items = [
    { key: "pie", label: "Pie" },
    { key: "column", label: "Column" },
    { key: "line", label: "Line" },
    { key: "area", label: "Area" },
  ];
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="h-9 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition flex items-center gap-2 text-gray-800 relative"
        title="Change chart type"
      >
        <span className="text-base">{chartIcon(value)}</span>
        <FaChevronDown className="absolute right-1 bottom-1 text-[10px] opacity-70" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-36 rounded-xl border border-gray-200 bg-white shadow-lg z-20 overflow-hidden">
          {items.map((it) => (
            <button
              key={it.key}
              type="button"
              onClick={() => { onChange(it.key); setOpen(false); }}
              className={["w-full px-3 py-2 text-sm flex items-center gap-2", "hover:bg-gray-50", value === it.key ? "bg-gray-50 font-semibold" : ""].join(" ")}
            >
              <span className="text-base">{chartIcon(it.key)}</span>
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ChartCard = ({ title, subtitle, trendPercent = null, trendDirection = "down", legendItems = [], footerText = "", footerDirection = "down", onDownload, chartType, setChartType, options }) => {
  const footerArrow = footerDirection === "up" ? "↑" : "↓";
  const footerColor = footerDirection === "up" ? "text-red-600" : "text-emerald-700";
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
          <DownloadIconButton onClick={onDownload} variant="primary" />
        </div>
      </div>
      <LegendRow items={legendItems} />
      <div className="mt-2">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
      {footerText ? (
        <div className="mt-2 text-center text-sm">
          <span className={footerColor}>{footerArrow} {footerText}</span>
        </div>
      ) : null}
    </div>
  );
};

/** ---------------- component ---------------- */
function AssetDashboard() {
  const [breakCount, setBreakCount] = useState("");
  const [inUseCount, setInUseCount] = useState("");
  const [totalAssetCount, setTotalAssetCount] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState("");

  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);

  const [activeStartDate, setActiveStartDate] = useState(null);
  const [activeEndDate, setActiveEndDate] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fmtDate = (d) => {
    if (!d) return null;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const [ppmSchedule, setPPMSchedule] = useState("");
  const [ppmOverDue, setPPMOverDue] = useState("");
  const [ppmPending, setPPMPending] = useState("");
  const [ppmComplete, setPPMComplete] = useState("");
  const [routineScheduleCount, setRoutineScheduleCount] = useState("");
  const [routineOverdueCount, setRoutineOverdueCount] = useState("");
  const [routineCompleteCount, setRoutineCompleteCount] = useState("");
  const [routinePendingCount, setRoutinePendingCount] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [assetChartType, setAssetChartType] = useState("pie");
  const [ppmChartType, setPPMChartType] = useState("pie");
  const [routineChartType, setRoutineChartType] = useState("pie");

  /** Single call to site_assets_dashboard.json with dates → populates all stat cards */
  const fetchFilteredSummary = async (startDate, endDate) => {
    try {
      const res = await getAssetsDashboardSummary(startDate, endDate);
      const d = res?.data || {};
      setTotalAssetCount(d.total_assets ?? "");
      setInUseCount(d.assets_in_use ?? "");
      setBreakCount(d.assets_in_breakdown ?? "");
      setPPMSchedule(d.ppm_scheduled ?? "");
      setPPMOverDue(d.ppm_overdue ?? "");
      setPPMComplete(d.ppm_complete ?? "");
      setPPMPending(d.ppm_pending ?? "");
      setRoutineScheduleCount(d.routine_task_scheduled ?? "");
      setRoutineOverdueCount(d.routine_task_overdue ?? "");
      setRoutineCompleteCount(d.routine_task_complete ?? "");
      setRoutinePendingCount(d.routine_task_pending ?? "");
    } catch (err) {
      console.error("Dashboard summary error:", err);
      toast.error("Failed to fetch filtered data");
    }
  };

  /**
   * Date filter ranges:
   *
   *  today   → start = today,           end = today
   *  week    → start = this Sun,         end = today
   *  month   → start = 1st of month,     end = LAST day of month   ✅ FIXED
   *  quarter → start = 1st of quarter,   end = last day of quarter ✅ FIXED
   *  year    → start = Jan 1,            end = Dec 31              ✅ FIXED
   *
   * Previously `end` was always `new Date(today)` for month/year, which sent
   * today's date instead of the full period end — causing wrong API payloads.
   */
  const applyDateFilter = (type) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalise to midnight

    let start = new Date(today);
    let end = new Date(today);

    switch (type) {
      case "today": {
        // start & end are already today
        break;
      }

      case "week": {
        // Sunday = day 0; roll start back to last Sunday
        const dayOfWeek = today.getDay();
        start = new Date(today);
        start.setDate(today.getDate() - dayOfWeek);
        end = new Date(today);
        break;
      }

      case "month": {
        // ✅ FIX: start = first day of month, end = LAST day of month
        // new Date(year, month+1, 0) → day 0 of next month = last day of this month
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      }

      case "quarter": {
        // ✅ FIX: start = first day of quarter, end = last day of quarter
        const quarter = Math.floor(today.getMonth() / 3);
        const quarterStart = quarter * 3;           // 0, 3, 6, or 9
        const quarterEnd = quarterStart + 3;      // 3, 6, 9, or 12
        start = new Date(today.getFullYear(), quarterStart, 1);
        end = new Date(today.getFullYear(), quarterEnd, 0); // day 0 = last day of prev month
        break;
      }

      case "year": {
        // ✅ FIX: start = Jan 1, end = Dec 31
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;
      }

      default:
        return;
    }

    setActiveStartDate(start);
    setActiveEndDate(end);
    fetchFilteredSummary(fmtDate(start), fmtDate(end));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** ---------------- downloads ---------------- */
  const handleTotalAssetDownload = async () => {
    const toastId = toast.loading("Downloading Please Wait");
    try {
      const response = await downloadAsset(fmtDate(activeStartDate), fmtDate(activeEndDate));
      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers["content-type"] }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Total_Asset_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss(toastId);
      toast.success("Asset downloaded successfully");
    } catch {
      toast.dismiss(toastId);
      toast.error("Something went wrong, please try again");
    }
  };

  const handleTotalBreakdownDownload = async () => {
    const toastId = toast.loading("Downloading Please Wait");
    try {
      const response = await getBreakdownDownload(fmtDate(activeStartDate), fmtDate(activeEndDate));
      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers["content-type"] }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "BreakDown_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss(toastId);
      toast.success("BreakDown Asset downloaded successfully");
    } catch {
      toast.dismiss(toastId);
      toast.error("Something went wrong, please try again");
    }
  };

  const assetInUseDownload = async () => {
    const toastId = toast.loading("Downloading Please Wait");
    try {
      const response = await getAssetInDownload(fmtDate(activeStartDate), fmtDate(activeEndDate));
      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers["content-type"] }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "inUse_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss(toastId);
      toast.success("In Use Asset downloaded successfully");
    } catch {
      toast.dismiss(toastId);
      toast.error("Something went wrong, please try again");
    }
  };

  const handleScheduledDownload = async () => {
    const toastId = toast.loading("Downloading Please Wait");
    try {
      const response = await getScheduledDownload(fmtDate(activeStartDate), fmtDate(activeEndDate));
      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers["content-type"] }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "scheduled_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss(toastId);
      toast.success("PPM Scheduled downloaded successfully");
    } catch {
      toast.dismiss(toastId);
      toast.error("Something went wrong, please try again");
    }
  };

  const handlePPMOverDueDownload = async () => {
    const toastId = toast.loading("Downloading Please Wait");
    try {
      const response = await getPPMOverDueDownload(fmtDate(activeStartDate), fmtDate(activeEndDate));
      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers["content-type"] }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ppm_Over_Due_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss(toastId);
      toast.success("PPM Over Due downloaded successfully");
    } catch {
      toast.dismiss(toastId);
      toast.error("Something went wrong, please try again");
    }
  };

  const handlePPMPendingDownload = async () => {
    const toastId = toast.loading("Downloading Please Wait");
    try {
      const response = await getPPMPendingDownload(fmtDate(activeStartDate), fmtDate(activeEndDate));
      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers["content-type"] }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ppm_pending_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss(toastId);
      toast.success("PPM Pending downloaded successfully");
    } catch {
      toast.dismiss(toastId);
      toast.error("Something went wrong, please try again");
    }
  };

  const handlePPMCompleteDownload = async () => {
    const toastId = toast.loading("Downloading Please Wait");
    try {
      const response = await getPPMcompleteDownload(fmtDate(activeStartDate), fmtDate(activeEndDate));
      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers["content-type"] }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ppm_complete_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss(toastId);
      toast.success("PPM Completed downloaded successfully");
    } catch {
      toast.dismiss(toastId);
      toast.error("Something went wrong, please try again");
    }
  };

  const handleRoutineScheduledDownload = async () => {
    const toastId = toast.loading("Downloading Please Wait");
    try {
      const response = await getRoutineScheduledDownload(fmtDate(activeStartDate), fmtDate(activeEndDate));
      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers["content-type"] }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "routine_scheduled_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss(toastId);
      toast.success("Routine Scheduled downloaded successfully");
    } catch {
      toast.dismiss(toastId);
      toast.error("Something went wrong, please try again");
    }
  };

  const handleRoutineOverDueDownload = async () => {
    const toastId = toast.loading("Downloading Please Wait");
    try {
      const response = await getRoutineOverdueDownload(fmtDate(activeStartDate), fmtDate(activeEndDate));
      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers["content-type"] }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "routine_overdue_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss(toastId);
      toast.success("Routine Overdue downloaded successfully");
    } catch {
      toast.dismiss(toastId);
      toast.error("Something went wrong, please try again");
    }
  };

  const handleRoutinePendingDownload = async () => {
    const toastId = toast.loading("Downloading Please Wait");
    try {
      const response = await getRoutinePendingDownload(fmtDate(activeStartDate), fmtDate(activeEndDate));
      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers["content-type"] }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "routine_pending_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss(toastId);
      toast.success("Routine Pending downloaded successfully");
    } catch {
      toast.dismiss(toastId);
      toast.error("Something went wrong, please try again");
    }
  };

  const handleRoutineCompleteDownload = async () => {
    const toastId = toast.loading("Downloading Please Wait");
    try {
      const response = await getRoutineCompleteDownload(fmtDate(activeStartDate), fmtDate(activeEndDate));
      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers["content-type"] }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "routine_complete_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss(toastId);
      toast.success("Routine Complete downloaded successfully");
    } catch {
      toast.dismiss(toastId);
      toast.error("Something went wrong, please try again");
    }
  };

  /** ---------------- sites ---------------- */
  const [site, setSite] = useState(false);
  const [siteData, setSiteData] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const response = await getSiteData();
        setSiteData(response.data.sites || []);
      } catch (error) {
        console.error("Error fetching sites:", error);
      }
    };
    fetchSiteData();
  }, []);

  const handleSelectAll = () => {
    if (selectedSites.length === siteData.length) setSelectedSites([]);
    else setSelectedSites(siteData.map((s) => s.id));
  };
  const handleSiteCheckbox = (id) => {
    setSelectedSites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /** ---------------- individual count fetchers ---------------- */
  const fetchAssetTotalCount = async (startDate, endDate) => {
    try { const res = await getTotalAssetCounts(selectedSites, startDate, endDate); setTotalAssetCount(res.data.count); } catch { }
  };
  const fetchTotalBreakdownCount = async (startDate, endDate) => {
    try { const res = await getBreakCount(selectedSites, startDate, endDate); setBreakCount(res.data.count); } catch { }
  };
  const fetchInUseAssetBreakDownCount = async (startDate, endDate) => {
    try { const res = await getInUseAssetBreakDown(selectedSites, startDate, endDate); setInUseCount(res.data.count); } catch { }
  };
  const fetchPPMScheduleCount = async (startDate, endDate) => {
    try { const res = await getPPMScheduleCount(selectedSites, startDate, endDate); setPPMSchedule(res.data.count); } catch { }
  };
  const fetchPPMOverDueCount = async (startDate, endDate) => {
    try { const res = await getPPMOverDueCount(selectedSites, startDate, endDate); setPPMOverDue(res.data.count); } catch { }
  };
  const fetchPPMpendingCount = async (startDate, endDate) => {
    try { const res = await getPPMpendingCount(selectedSites, startDate, endDate); setPPMPending(res.data.count); } catch { }
  };
  const fetchPPMCompleteCount = async (startDate, endDate) => {
    try { const res = await getPPMCompleteCount(selectedSites, startDate, endDate); setPPMComplete(res.data.count); } catch { }
  };
  const fetchRoutineScheduledCount = async (startDate, endDate) => {
    try { const res = await getRoutineScheduledCount(selectedSites, startDate, endDate); setRoutineScheduleCount(res.data.count); } catch { }
  };
  const fetchRoutineOverdueCount = async (startDate, endDate) => {
    try { const res = await getRoutineOverdueCount(selectedSites, startDate, endDate); setRoutineOverdueCount(res.data.count); } catch { }
  };
  const fetchRoutineCompleteCount = async (startDate, endDate) => {
    try { const res = await getRoutineCompleteCount(selectedSites, startDate, endDate); setRoutineCompleteCount(res.data.count); } catch { }
  };
  const fetchRoutinePendingCount = async (startDate, endDate) => {
    try { const res = await getRoutinePendingCount(selectedSites, startDate, endDate); setRoutinePendingCount(res.data.count); } catch { }
  };

  const fetchAllCounts = (startDate, endDate) => {
    fetchTotalBreakdownCount(startDate, endDate);
    fetchAssetTotalCount(startDate, endDate);
    fetchPPMOverDueCount(startDate, endDate);
    fetchPPMpendingCount(startDate, endDate);
    fetchPPMCompleteCount(startDate, endDate);
    fetchInUseAssetBreakDownCount(startDate, endDate);
    fetchRoutineScheduledCount(startDate, endDate);
    fetchRoutineOverdueCount(startDate, endDate);
    fetchRoutineCompleteCount(startDate, endDate);
    fetchPPMScheduleCount(startDate, endDate);
    fetchRoutinePendingCount(startDate, endDate);
  };

  useEffect(() => {
    fetchAllCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applySelection = () => {
    fetchAllCounts(fmtDate(activeStartDate), fmtDate(activeEndDate));
  };

  const handleClearFilter = () => {
    setActiveStartDate(null);
    setActiveEndDate(null);
    setCustomStartDate(null);
    setCustomEndDate(null);
    setFilterType("");
    setFilterOpen(false);
    fetchAllCounts();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (activeStartDate || activeEndDate) {
      await fetchFilteredSummary(fmtDate(activeStartDate), fmtDate(activeEndDate));
    } else {
      await Promise.allSettled([
        fetchTotalBreakdownCount(),
        fetchAssetTotalCount(),
        fetchPPMOverDueCount(),
        fetchPPMpendingCount(),
        fetchPPMCompleteCount(),
        fetchInUseAssetBreakDownCount(),
        fetchRoutineScheduledCount(),
        fetchRoutineOverdueCount(),
        fetchRoutineCompleteCount(),
        fetchPPMScheduleCount(),
        fetchRoutinePendingCount(),
      ]);
    }
    setRefreshing(false);
  };

  const totalAssetOptions = buildTwoMetricOptions({
    type: assetChartType,
    labels: ["In Use Asset", "Break Down"],
    values: [inUseCount, breakCount],
    colors: [PRIMARY_BLUE, LIGHT_BLUE],
    seriesName: "Asset",
  });
  const totalPPMOptions = buildTwoMetricOptions({
    type: ppmChartType,
    labels: ["PPM Overdue", "PPM Complete"],
    values: [ppmOverDue, ppmComplete],
    colors: [PRIMARY_BLUE, LIGHT_BLUE],
    seriesName: "PPM",
  });
  const totalRoutineOptions = buildTwoMetricOptions({
    type: routineChartType,
    labels: ["Routine Overdue", "Routine Complete"],
    values: [routineOverdueCount, routineCompleteCount],
    colors: [PRIMARY_BLUE, LIGHT_BLUE],
    seriesName: "Routine",
  });

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

  const cardData = [
    { title: "Total Asset", count: totalAssetCount, downloadHandler: handleTotalAssetDownload, icon: <FiBriefcase className="w-4 h-4" />, loading: false },
    { title: "Asset Breakdown", count: breakCount, downloadHandler: handleTotalBreakdownDownload, icon: <FiBarChart2 className="w-4 h-4" />, loading: false },
    { title: "In Use Asset", count: inUseCount, downloadHandler: assetInUseDownload, icon: <TbUsers className="w-4 h-4" />, loading: false },
    { title: "PPM Scheduled", count: ppmSchedule, downloadHandler: handleScheduledDownload, icon: <FaRegCalendar className="w-4 h-4" />, loading: false },
    { title: "PPM Overdue", count: ppmOverDue, downloadHandler: handlePPMOverDueDownload, icon: <FiAlertTriangle className="w-4 h-4" />, loading: false },
    { title: "PPM Complete", count: ppmComplete, downloadHandler: handlePPMCompleteDownload, icon: <FaRegCheckCircle className="w-4 h-4" />, loading: false },
    { title: "Routine Task Scheduled", count: routineScheduleCount, downloadHandler: handleRoutineScheduledDownload, icon: <FaRegCalendar className="w-4 h-4" />, loading: false },
    { title: "Routine Task Overdue", count: routineOverdueCount, downloadHandler: handleRoutineOverDueDownload, icon: <FiAlertTriangle className="w-4 h-4" />, loading: false },
    { title: "Routine Task Complete", count: routineCompleteCount, downloadHandler: handleRoutineCompleteDownload, icon: <FaRegCheckCircle className="w-4 h-4" />, loading: false },
  ];

  const [selectedTitles, setSelectedTitles] = useState(cardData.map((c) => c.title));

  const [assetDetailPopup, setAssetDetailPopup] = useState({ open: false, title: "", records: [], loading: false, page: 1, totalPages: 1 });
  const [activeAssetFilter, setActiveAssetFilter] = useState({ countType: "", countValue: "", title: "" });

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

  const handleCheckboxChange = (title) => {
    setSelectedTitles((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <div className="w-full overflow-hidden flex flex-col">
      {/* Top Controls */}
      <div className="w-full flex items-center justify-between mb-4">

        {/* Left Group */}
        <div className="flex items-center gap-3">
          {/* Site dropdown */}
          <div className="relative">
            <button
              onClick={() => setSite((p) => !p)}
              className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl flex justify-between gap-2 items-center w-60 shadow-sm"
            >
              <span className="flex items-center gap-2"><FaBuilding /> Select site</span>
              {site ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
            </button>

            {site && (
              <div className="absolute left-0 top-12 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 w-60 overflow-y-auto z-10 px-3 py-2 space-y-2">
                <div className="flex items-center space-x-2 px-2">
                  <input
                    type="checkbox"
                    id="selectAll"
                    checked={siteData.length > 0 && selectedSites.length === siteData.length}
                    onChange={handleSelectAll}
                  />
                  <label htmlFor="selectAll" className="cursor-pointer text-sm">Select All</label>
                </div>
                {siteData.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 px-2 py-1 text-sm">
                    <input type="checkbox" checked={selectedSites.includes(s.id)} onChange={() => handleSiteCheckbox(s.id)} />
                    <span className="truncate">{s.name}</span>
                  </label>
                ))}
                <button
                  onClick={() => { applySelection(); setSite(false); }}
                  className="w-full bg-gray-800 text-white py-2 mt-2 rounded-xl hover:bg-gray-900 text-sm"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Assets dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl flex gap-2 items-center shadow-sm"
            >
              <IoSettingsOutline /> Assets
              {isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {isDropdownOpen && (
              <div className="absolute top-12 left-0 w-64 rounded-xl shadow-lg bg-white border border-gray-200 z-10">
                {cardData.map((card) => (
                  <label key={card.title} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTitles.includes(card.title)}
                      onChange={() => handleCheckboxChange(card.title)}
                    />
                    <span className="ml-2 text-sm">{card.title}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Refresh + Filter */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            title="Reload data"
            className="bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-xl flex items-center shadow-sm hover:bg-gray-50 disabled:opacity-50"
          >
            <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
          </button>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen((p) => !p)}
              className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm"
            >
              <FaRegCalendar />
              {activeStartDate
                ? `${fmtDate(activeStartDate)}${activeEndDate ? ` – ${fmtDate(activeEndDate)}` : ""}`
                : "Filter"}
              {filterOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </button>

            {filterOpen && (
              <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-lg w-52 z-30">
                <button onClick={() => { applyDateFilter("today"); setFilterOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-50">Today</button>
                <button onClick={() => { applyDateFilter("week"); setFilterOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-50">This Week</button>
                <button onClick={() => { applyDateFilter("month"); setFilterOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-50">This Month</button>
                <button onClick={() => { applyDateFilter("year"); setFilterOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-50">This Year</button>
                <button onClick={() => setFilterType("custom")} className="block w-full text-left px-4 py-2 hover:bg-gray-50">Custom Range</button>

                {activeStartDate && (
                  <button
                    onClick={handleClearFilter}
                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                  >
                    Clear Filter
                  </button>
                )}

                {filterType === "custom" && (
                  <div className="p-3 border-t">
                    <DatePicker
                      selected={customStartDate}
                      onChange={(date) => setCustomStartDate(date)}
                      placeholderText="Start Date"
                      className="border p-2 w-full rounded mb-2"
                    />
                    <DatePicker
                      selected={customEndDate}
                      onChange={(date) => setCustomEndDate(date)}
                      placeholderText="End Date"
                      className="border p-2 w-full rounded mb-2"
                    />
                    <button
                      onClick={() => {
                        if (customStartDate) {
                          const endD = customEndDate || new Date();
                          setActiveStartDate(customStartDate);
                          setActiveEndDate(endD);
                          fetchFilteredSummary(fmtDate(customStartDate), fmtDate(endD));
                        }
                        setFilterOpen(false);
                      }}
                      className="w-full bg-black text-white py-2 rounded"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-5 mx-3">
        {cardData.map((card) => {
          if (!selectedTitles.includes(card.title)) return null;
          const theme = cardTheme(card.title);
          const isClickable = assetCardToFilter[card.title] !== undefined;
          return (
            <div
              key={card.title}
              role={isClickable ? "button" : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onClick={isClickable ? (e) => { if (!e.target.closest("button")) handleAssetCardClick(card.title); } : undefined}
              onKeyDown={isClickable ? (e) => e.key === "Enter" && handleAssetCardClick(card.title) : undefined}
              className={`${theme.bg} ${theme.text} shadow-custom-all-sides border py-3 px-3 rounded-2xl flex flex-col text-sm font-medium h-32 ${isClickable ? "cursor-pointer hover:shadow-md transition" : ""}`}
            >
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-base text-gray-800">{card.title}</h2>
                <div className="flex items-center gap-2">
                  <span className={theme.text}>{card.icon}</span>
                  <DownloadIconButton onClick={card.downloadHandler} loading={card.loading} variant={theme.dl} />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-start">
                <span className="text-3xl font-semibold text-gray-900">{card.count}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3 chart cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6 mx-3">
        <ChartCard
          title="Total Asset"
          trendPercent={20.7}
          trendDirection="down"
          footerDirection="down"
          onDownload={handleTotalAssetDownload}
          chartType={assetChartType}
          setChartType={setAssetChartType}
          options={totalAssetOptions}
        />
        <ChartCard
          title="Total PPM"
          trendPercent={21.7}
          trendDirection="down"
          footerDirection="down"
          onDownload={handleScheduledDownload}
          chartType={ppmChartType}
          setChartType={setPPMChartType}
          options={totalPPMOptions}
        />
        <ChartCard
          title="Total Routine Task"
          trendPercent={10.2}
          trendDirection="up"
          footerDirection="up"
          onDownload={handleRoutineScheduledDownload}
          chartType={routineChartType}
          setChartType={setRoutineChartType}
          options={totalRoutineOptions}
        />
      </div>

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
              { key: "name", label: "Name", accessor: (r) => r.name ?? "—", width: "100px" },
              { key: "asset_number", label: "Asset No.", accessor: (r) => r.asset_number ?? "—" },
              { key: "building_name", label: "Building", accessor: (r) => r.building_name ?? "—" },
              { key: "floor_name", label: "Floor", accessor: (r) => r.floor_name ?? "—" },
              { key: "unit_name", label: "Unit", accessor: (r) => r.unit_name ?? "—" },
              { key: "asset_group_name", label: "Group", accessor: (r) => r.asset_group_name ?? "—" },
              { key: "vendor_name", label: "Vendor", accessor: (r) => r.vendor_name ?? "—" },
              { key: "breakdown", label: "Breakdown", accessor: (r) => (r.breakdown ? "Yes" : "No") },
            ]
            : [
              { key: "name", label: "Asset Name", accessor: (r) => r.name ?? r.asset_name ?? "—", width: "250px" },
              { key: "checklist_name", label: "Checklist Name", accessor: (r) => r.checklist_name ?? "—", width: "250px" },
              { key: "status", label: "Status", accessor: (r) => r.status ?? "—", width: "250px" },
              {
                key: "assigned_to",
                label: "Assigned To",
                accessor: (r) => {
                  if (Array.isArray(r.assigned_to)) return r.assigned_to.length ? r.assigned_to.join(", ") : "Unassigned";
                  return r.assigned_to_name ?? r.assigned_name ?? "Unassigned";
                },
                gap: "5",
              },
              { key: "start_time", label: "Start Time", accessor: (r) => r.start_time ? new Date(r.start_time).toLocaleDateString("en-IN") : "—" },
              { key: "created_at", label: "Created On", accessor: (r) => r.created_at ? new Date(r.start_time).toLocaleDateString("en-IN") : "—" },
            ]
        }
      />
    </div>
  );
}

export default AssetDashboard;