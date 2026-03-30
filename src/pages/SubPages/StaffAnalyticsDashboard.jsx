/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getStaffDashboard } from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import DetailPopup from "../../components/DetailPopup";
import { FaSpinner, FaChevronDown } from "react-icons/fa";
import toast from "react-hot-toast";
import { RiPieChartFill } from "react-icons/ri";
import {
  AiOutlineAreaChart,
  AiOutlineBarChart,
  AiOutlineLineChart,
} from "react-icons/ai";
import { PiChartBarHorizontal } from "react-icons/pi";

/* ── Palette ────────────────────────────────────────────────────────────── */
const PALETTE = [
  "#1D4ED8","#10B981","#F59E0B","#EF4444","#8B5CF6",
  "#06B6D4","#EC4899","#84CC16","#F97316","#14B8A6",
  "#0EA5E9","#6366F1",
];

const STAT_CONFIG = [
  { key: "total",         title: "Total Staff",    accent: PALETTE[0]  },
  { key: "active",        title: "Active",          accent: PALETTE[1]  },
  { key: "inactive",      title: "Inactive",        accent: PALETTE[6]  },
  { key: "approved",      title: "Approved",        accent: PALETTE[4]  },
  { key: "pending",       title: "Pending",         accent: PALETTE[2]  },
  // { key: "in_date_range", title: "In Date Range",   accent: PALETTE[5]  },
  { key: "today_in",      title: "Today In",        accent: PALETTE[9]  },
  { key: "today_out",     title: "Today Out",       accent: PALETTE[7]  },
  { key: "total_in",      title: "Total In",        accent: PALETTE[10] },
  { key: "total_out",     title: "Total Out",       accent: PALETTE[3]  },
];

/* ── Tab icon map ───────────────────────────────────────────────────────── */
const TAB_ICONS = {
  by_work_type:        "🔧",
  by_vendor:           "🏢",
  by_status_type:      "📋",
  by_in_out:           "🔄",
  by_attendance_today: "📅",
  by_created_by:       "👤",
  hourly:              "📈",
  monthly:             "📆",
};

/* ── Helpers ────────────────────────────────────────────────────────────── */
const formatDateForApi = (isoDate) => {
  if (!isoDate) return null;
  const [y, m, d] = isoDate.split("-");
  if (!y || !m || !d) return null;
  return `${d}/${m}/${y}`;
};

const formatByLabel = (key) => {
  if (key === "hourly")  return "Hourly Trend";
  if (key === "monthly") return "Monthly Trend";
  return key
    .replace(/^by_/, "")
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const byKeyToCountType = (key) => key.replace(/^by_/, "");

const toSortedEntries = (obj = {}, order = "desc") =>
  Object.entries(obj).sort((a, b) =>
    order === "asc"
      ? (Number(a[1]) || 0) - (Number(b[1]) || 0)
      : (Number(b[1]) || 0) - (Number(a[1]) || 0)
  );

/* ── Mini components ────────────────────────────────────────────────────── */
const baseNoSelect = {
  states: { inactive: { opacity: 1 }, hover: { enabled: true }, select: { enabled: false } },
};

const chartIcon = (type) => {
  switch (type) {
    case "pie":    return <RiPieChartFill className="w-4 h-4" />;
    case "bar":    return <PiChartBarHorizontal className="w-4 h-4" />;
    case "column": return <AiOutlineBarChart className="w-4 h-4" />;
    case "line":   return <AiOutlineLineChart className="w-4 h-4" />;
    case "area":   return <AiOutlineAreaChart className="w-4 h-4" />;
    default:       return <RiPieChartFill className="w-4 h-4" />;
  }
};

const ChartTypeMenu = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const items = [
    { key: "pie",    label: "Pie"    },
    { key: "column", label: "Column" },
    { key: "bar",    label: "Bar"    },
    { key: "line",   label: "Line"   },
    { key: "area",   label: "Area"   },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="h-9 w-10 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 relative grid place-items-center"
        title="Change chart type"
      >
        {chartIcon(value)}
        <FaChevronDown className="absolute right-1 bottom-1 text-[10px] opacity-70" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-gray-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.12)] overflow-hidden z-20">
          {items.map((it) => (
            <button
              key={it.key}
              type="button"
              onClick={() => { onChange(it.key); setOpen(false); }}
              className={[
                "w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50",
                value === it.key ? "bg-gray-50 font-semibold text-gray-900" : "text-gray-700",
              ].join(" ")}
            >
              <span className="text-gray-600">{chartIcon(it.key)}</span>
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Card = ({ title, subtitle, right, children }) => (
  <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] p-5">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[18px] font-bold text-gray-900 truncate">{title}</p>
        {subtitle ? <p className="text-sm text-gray-500 truncate mt-1">{subtitle}</p> : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
    <div className="mt-4">{children}</div>
  </div>
);

const StatCard = ({ title, value, accent }) => (
  <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] p-5">
    <div className="h-1 w-full rounded-full mb-4" style={{ backgroundColor: accent, opacity: 0.9 }} />
    <p className="text-[15px] font-bold text-gray-900 truncate">{title}</p>
    <div className="mt-4 text-3xl font-extrabold text-gray-900">{Number(value) || 0}</div>
  </div>
);

const SkeletonCard = () => (
  <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] p-5 animate-pulse">
    <div className="h-1 w-full rounded-full bg-gray-200 mb-4" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-8 bg-gray-200 rounded w-1/3 mt-4" />
  </div>
);

/* ── Chart builders ─────────────────────────────────────────────────────── */
const buildPieOptions = ({ title, dataMap }) => ({
  chart: { type: "pie", backgroundColor: "transparent", height: 320 },
  title: { text: null },
  tooltip: {
    backgroundColor: "#FFFFFF", borderColor: "#E5E7EB", borderRadius: 10, shadow: false,
    pointFormat: "{point.name}: <b>{point.y}</b> ({point.percentage:.1f}%)",
  },
  plotOptions: {
    series: { ...baseNoSelect },
    pie: {
      ...baseNoSelect,
      innerSize: "55%", borderWidth: 0, allowPointSelect: false, cursor: "pointer",
      dataLabels: {
        enabled: true,
        formatter: function () { return `<b>${this.point.name}</b>: ${this.point.y}`; },
        style: { color: "#111827", textOutline: "none", fontSize: "12px" },
      },
    },
  },
  series: [{
    name: title,
    colorByPoint: true,
    data: Object.entries(dataMap || {}).map(([k, v], i) => ({
      name: k, y: Number(v) || 0, color: PALETTE[i % PALETTE.length],
    })),
  }],
  legend: { enabled: false },
  credits: { enabled: false },
  exporting: { enabled: false },
});

const buildXYOptions = ({ title, type, categories, values, colorByPoint = false }) => {
  const hcType = type === "line" ? "spline" : type === "area" ? "areaspline" : type;
  const seriesColor = PALETTE[0];
  const areaFill = type === "area"
    ? {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [
          [0, Highcharts.color(seriesColor).setOpacity(0.22).get("rgba")],
          [1, Highcharts.color(seriesColor).setOpacity(0).get("rgba")],
        ],
      }
    : undefined;

  return {
    chart: { type: hcType, backgroundColor: "transparent", height: 320, spacing: [8, 8, 8, 8] },
    title: { text: null },
    credits: { enabled: false },
    exporting: { enabled: false },
    legend: { enabled: false },
    xAxis: {
      categories,
      lineColor: "#E5E7EB", tickColor: "#E5E7EB",
      labels: { style: { color: "#6B7280", fontSize: "12px" } },
      title: { text: null },
    },
    yAxis: {
      min: 0, title: { text: null }, gridLineColor: "#E5E7EB", gridLineDashStyle: "Dash",
      labels: { style: { color: "#6B7280", fontSize: "12px" } },
    },
    tooltip: { backgroundColor: "#FFFFFF", borderColor: "#E5E7EB", borderRadius: 10, shadow: false, pointFormat: "<b>{point.y}</b>" },
    plotOptions: {
      series: { ...baseNoSelect, animation: true, lineWidth: 3, marker: type === "line" || type === "area" ? { enabled: true, radius: 4, lineWidth: 2, lineColor: seriesColor, fillColor: "#FFFFFF" } : { enabled: false } },
      column: { borderRadius: 10, pointPadding: 0.12, groupPadding: 0.22 },
      bar:    { borderRadius: 10, pointPadding: 0.12, groupPadding: 0.22 },
    },
    series: [{
      name: title,
      color: seriesColor,
      colorByPoint,
      data: (values || []).map((v, i) => colorByPoint ? { y: Number(v) || 0, color: PALETTE[i % PALETTE.length] } : (Number(v) || 0)),
      fillColor: areaFill,
    }],
  };
};

/* ── Staff detail columns ───────────────────────────────────────────────── */
const STAFF_COLUMNS = [
  { key: "name",        label: "Name",      accessor: (r) => `${r.firstname ?? ""} ${r.lastname ?? ""}`.trim() || r.name || "—" },
  { key: "mobile_no",   label: "Contact",   accessor: (r) => r.mobile_no ?? r.contact_number ?? "—" },
  { key: "vendor_name", label: "Vendor",    accessor: (r) => r.vendor_name ?? r.vendor?.name ?? "—" },
  { key: "work_type",   label: "Work Type", accessor: (r) => r.work_type ?? "—" },
  { key: "status_type", label: "Status",    accessor: (r) => r.status_type ?? "—" },
  { key: "created_at",  label: "Created",   accessor: (r) => r.created_at ?? "—" },
];

/* ══════════════════════════════════════════════════════════════════════════
   Main component
══════════════════════════════════════════════════════════════════════════ */
const StaffAnalyticsDashboard = () => {
  const siteId = getItemInLocalStorage("SITEID");

  const [loading,       setLoading]       = useState(true);
  const [rawStats,      setRawStats]      = useState({});
  const [byData,        setByData]        = useState({});
  const [hourlyData,    setHourlyData]    = useState({});
  const [monthlyData,   setMonthlyData]   = useState({});
  const [selectedChart, setSelectedChart] = useState("");
  const [chartType,     setChartType]     = useState("pie");

  const [filterOpen,   setFilterOpen]   = useState(false);
  const [fromDate,     setFromDate]     = useState("");
  const [toDate,       setToDate]       = useState("");
  const [tempFromDate, setTempFromDate] = useState("");
  const [tempToDate,   setTempToDate]   = useState("");

  const [detailPopup,      setDetailPopup]      = useState({ open: false, title: "", records: [], loading: false });
  const [detailPage,       setDetailPage]       = useState(1);
  const [detailTotalPages, setDetailTotalPages] = useState(1);
  const [detailFilter,     setDetailFilter]     = useState({ byKey: "", countValue: "" });

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, siteId]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const rangeFrom = formatDateForApi(fromDate);
      const rangeTo   = formatDateForApi(toDate);
      const resp      = await getStaffDashboard(siteId, null, null, 1, rangeFrom, rangeTo);
      const apiData   = resp?.data || {};

      setRawStats(apiData);

      /* Extract all by_* keys */
      const newByData = {};
      Object.keys(apiData).forEach((k) => {
        if (k.startsWith("by_") && apiData[k] && typeof apiData[k] === "object") {
          const flat = {};
          Object.entries(apiData[k]).forEach(([name, val]) => {
            flat[name] = typeof val === "object" && val !== null ? (val.count ?? 0) : Number(val) || 0;
          });
          newByData[k] = flat;
        }
      });
      setByData(newByData);
      setHourlyData(apiData.hourly_visits ?? apiData.hourly_trend ?? {});
      setMonthlyData(apiData.monthly_visits ?? apiData.monthly_trend ?? {});

      /* Auto-select first tab */
      setSelectedChart((prev) => {
        if (prev && (newByData[prev] || prev === "hourly" || prev === "monthly")) return prev;
        return Object.keys(newByData)[0] || prev;
      });
    } catch (err) {
      console.error("Staff dashboard error:", err);
      toast.error("Failed to load staff analytics");
    } finally {
      setLoading(false);
    }
  };

  /* ── Drill-down ── */
  const handleChartPointClick = async (byKey, countValue, page = 1) => {
    if (!byKey || !countValue) return;
    const countType = byKeyToCountType(byKey);
    const title     = `${formatByLabel(byKey)}: ${countValue}`;
    const rangeFrom = formatDateForApi(fromDate);
    const rangeTo   = formatDateForApi(toDate);

    setDetailFilter({ byKey, countValue });
    setDetailPage(page);
    setDetailPopup({ open: true, title, records: [], loading: true });

    try {
      const res     = await getStaffDashboard(siteId, countType, countValue, page, rangeFrom, rangeTo);
      const bucket  = res?.data?.[byKey]?.[countValue];
      const records = Array.isArray(bucket?.records) ? bucket.records : [];
      const total   = bucket?.count ?? bucket?.total ?? records.length;
      const perPage = bucket?.per_page ?? 10;
      const pages   = perPage > 0 ? Math.max(1, Math.ceil(total / perPage)) : 1;

      setDetailTotalPages(pages);
      setDetailPopup({ open: true, title, records, loading: false });
    } catch (err) {
      console.error("Staff drill error:", err);
      toast.error("Failed to load staff details.");
      setDetailPopup((p) => ({ ...p, loading: false }));
    }
  };

  const onDetailPageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > detailTotalPages) return;
    handleChartPointClick(detailFilter.byKey, detailFilter.countValue, nextPage);
  };

  /* ── Chart options ── */
  const selectedChartOptions = useMemo(() => {
    let dataMap;
    if (selectedChart === "hourly")       dataMap = hourlyData;
    else if (selectedChart === "monthly") dataMap = monthlyData;
    else                                  dataMap = byData[selectedChart] || {};

    const chartTitle = selectedChart ? formatByLabel(selectedChart) : "";

    const addClickEvents = (options) => {
      if (!options?.plotOptions) return options;
      const clickHandler = function () {
        const itemName = this.name ?? this.category ?? String(this.x ?? "");
        handleChartPointClick(selectedChart, itemName);
      };
      const evt = { events: { click: clickHandler } };
      return {
        ...options,
        plotOptions: {
          ...options.plotOptions,
          series: { ...(options.plotOptions.series || {}), point: { ...(options.plotOptions.series?.point || {}), ...evt } },
          pie:    { ...(options.plotOptions.pie    || {}), point: { ...(options.plotOptions.pie?.point    || {}), ...evt } },
        },
      };
    };

    const order = (selectedChart === "hourly" || selectedChart === "monthly") ? "asc" : "desc";
    let opts;
    if (chartType === "pie") {
      opts = buildPieOptions({ title: chartTitle, dataMap });
    } else {
      const entries = toSortedEntries(dataMap, order);
      opts = buildXYOptions({
        title: chartTitle,
        type: chartType,
        categories: entries.map(([k]) => k),
        values: entries.map(([, v]) => v),
        colorByPoint: chartType === "column" || chartType === "bar",
      });
    }
    return addClickEvents(opts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChart, chartType, byData, hourlyData, monthlyData]);

  /* ── Chart buttons ── */
  const chartButtons = useMemo(
    () => [
      ...Object.keys(byData).map((key) => ({
        id: key, label: formatByLabel(key), icon: TAB_ICONS[key] ?? "📋",
      })),
      { id: "hourly",  label: "Hourly Trend",  icon: "📈" },
      { id: "monthly", label: "Monthly Trend",  icon: "📆" },
    ],
    [byData]
  );

  /* ── Visible stat cards ── */
  const visibleCards = useMemo(
    () => STAT_CONFIG.filter((cfg) => rawStats[cfg.key] !== undefined).map((cfg) => ({ ...cfg, value: rawStats[cfg.key] })),
    [rawStats]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-gray-700 text-4xl" />
      </div>
    );
  }

  return (
    <div className="w-full px-3 pb-4 space-y-6">
      {/* ── Top bar ── */}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => { setTempFromDate(fromDate); setTempToDate(toDate); setFilterOpen(true); }}
          className="h-10 px-4 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
        >
          Filter by Date
        </button>
        <button
          type="button"
          onClick={() => { setFromDate(""); setToDate(""); }}
          className="h-10 px-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
        >
          Clear Filter
        </button>
      </div>

      {/* ── Date filter modal ── */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-5">
            <h3 className="text-lg font-semibold text-gray-900">Filter Staff by Date</h3>
            <p className="text-sm text-gray-500 mt-1">Choose start and end date to refresh dashboard.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
                <input type="date" value={tempFromDate} onChange={(e) => setTempFromDate(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
                <input type="date" value={tempToDate} onChange={(e) => setTempToDate(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <button type="button" onClick={() => setFilterOpen(false)}
                className="h-10 px-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!tempFromDate || !tempToDate) { toast.error("Please select both dates."); return; }
                  setFromDate(tempFromDate);
                  setToDate(tempToDate);
                  setFilterOpen(false);
                }}
                className="h-10 px-4 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {visibleCards.length > 0
          ? visibleCards.map((cfg) => (
              <StatCard key={cfg.key} title={cfg.title} value={cfg.value} accent={cfg.accent} />
            ))
          : Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        }
      </div>

      {/* ── Chart type selector + tab buttons ── */}
      <Card
        title="Staff Analytics"
        subtitle="Select a breakdown type and chart style"
        right={
          <div className="flex items-center gap-2">
            <ChartTypeMenu value={chartType} onChange={setChartType} />
            <button
              type="button"
              title="Refresh"
              onClick={() => fetchDashboard()}
              className="h-9 w-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition grid place-items-center text-gray-700"
            >
              ↻
            </button>
          </div>
        }
      >
        <div className="flex flex-wrap gap-3 mt-1">
          {chartButtons.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedChart(opt.id)}
              className={[
                "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition",
                selectedChart === opt.id
                  ? "bg-gray-900 text-white shadow"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200",
              ].join(" ")}
            >
              <span className="text-base leading-none">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </Card>

      {/* ── Chart ── */}
      {selectedChart && (
        <Card
          title={formatByLabel(selectedChart)}
          subtitle={`Chart type: ${chartType}`}
        >
          <HighchartsReact highcharts={Highcharts} options={selectedChartOptions} />
        </Card>
      )}

      {/* ── Detail popup ── */}
      <DetailPopup
        isOpen={detailPopup.open}
        onClose={() => setDetailPopup((p) => ({ ...p, open: false }))}
        title={detailPopup.title}
        subtitle={`${detailPopup.records.length} record(s)`}
        records={detailPopup.records}
        loading={detailPopup.loading}
        columns={STAFF_COLUMNS}
        page={detailPage}
        totalPages={detailTotalPages}
        onPageChange={onDetailPageChange}
      />
    </div>
  );
};

export default StaffAnalyticsDashboard;
