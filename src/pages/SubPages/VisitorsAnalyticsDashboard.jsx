/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  getStaffCount,
  getRegisteredVehicleDashboard,
  getVisitorAnalytics,
  getVisitorsDrill,
  getVisitorsDashboardDrill,
  getStaffDrill,
  getStaffPunchedInToday,
  getStaffPunchedOutToday,
  getRegisteredVehicle,
} from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import DetailPopup from "../../components/DetailPopup";
import {
  FaSpinner,
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaCar,
  FaCalendarAlt,
  FaChevronDown,
  FaDownload,
  FaFileExcel,
  FaFilePdf,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { RiPieChartFill } from "react-icons/ri";
import {
  AiOutlineAreaChart,
  AiOutlineBarChart,
  AiOutlineLineChart,
} from "react-icons/ai";
import { PiChartBarHorizontal } from "react-icons/pi";

const CHART_PALETTE = [
  "#1D4ED8",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#EC4899",
  "#84CC16",
  "#F97316",
  "#14B8A6",
  "#0EA5E9",
  "#6366F1",
];

const baseNoSelect = {
  states: {
    inactive: { opacity: 1 },
    hover: { enabled: true },
    select: { enabled: false },
  },
};

const toSortedEntries = (obj = {}, order = "desc") =>
  Object.entries(obj).sort((a, b) =>
    order === "asc"
      ? (Number(a[1]) || 0) - (Number(b[1]) || 0)
      : (Number(b[1]) || 0) - (Number(a[1]) || 0),
  );

const normalizeBreakdownPoints = (dataMap = {}) =>
  Object.entries(dataMap).map(([label, rawValue]) => ({
    label,
    value:
      Number(
        rawValue && typeof rawValue === "object"
          ? rawValue.count ?? rawValue.value ?? rawValue.registrations ?? 0
          : rawValue
      ) || 0,
    drillValue: label,
  }));

const normalizeTrendPoints = (data = []) => {
  const rows = Array.isArray(data)
    ? data
    : Object.entries(data || {}).map(([key, value]) => ({
      ...(value && typeof value === "object" ? value : {}),
      key,
    }));

  return rows
    .map((row) => {
      const rawKey = row?.hour ?? row?.month ?? row?.key ?? row?.label ?? "";
      const label = row?.label ?? String(rawKey);
      const value =
        Number(
          row?.registrations ??
          row?.check_ins ??
          row?.check_outs ??
          row?.count ??
          row?.value ??
          0
        ) || 0;

      return {
        label,
        value,
        drillValue: rawKey,
      };
    })
    .filter((point) => point.label !== "");
};

const sortTrendPoints = (points = []) =>
  [...points].sort((a, b) => {
    const aNum = Number(a.drillValue);
    const bNum = Number(b.drillValue);
    if (Number.isFinite(aNum) && Number.isFinite(bNum)) return aNum - bNum;
    return String(a.drillValue).localeCompare(String(b.drillValue));
  });

const IconBtn = ({ onClick, children, title }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className="h-9 w-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition grid place-items-center text-gray-700"
  >
    {children}
  </button>
);

const chartIcon = (type) => {
  switch (type) {
    case "pie":
      return <RiPieChartFill className="w-4 h-4" />;
    case "bar":
      return <PiChartBarHorizontal className="w-4 h-4" />;
    case "column":
      return <AiOutlineBarChart className="w-4 h-4" />;
    case "line":
      return <AiOutlineLineChart className="w-4 h-4" />;
    case "area":
      return <AiOutlineAreaChart className="w-4 h-4" />;
    default:
      return <RiPieChartFill className="w-4 h-4" />;
  }
};

const ChartTypeMenu = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const items = [
    { key: "pie", label: "Pie" },
    { key: "column", label: "Column" },
    { key: "bar", label: "Bar" },
    { key: "line", label: "Line" },
    { key: "area", label: "Area" },
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

      {open ? (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-gray-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.12)] overflow-hidden z-20">
          {items.map((it) => (
            <button
              key={it.key}
              type="button"
              onClick={() => {
                onChange(it.key);
                setOpen(false);
              }}
              className={[
                "w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50",
                value === it.key
                  ? "bg-gray-50 font-semibold text-gray-900"
                  : "text-gray-700",
              ].join(" ")}
            >
              <span className="text-gray-600">{chartIcon(it.key)}</span>
              {it.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const Card = ({ title, subtitle, right, children }) => (
  <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] p-4 sm:p-5 overflow-hidden">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
      <div className="min-w-0">
        <p className="text-base sm:text-[18px] font-bold text-gray-900 break-words">{title}</p>
        {subtitle ? (
          <p className="text-sm text-gray-500 break-words mt-1">{subtitle}</p>
        ) : null}
      </div>
      {right ? <div className="shrink-0 flex justify-start sm:justify-end">{right}</div> : null}
    </div>
    <div className="mt-4">{children}</div>
  </div>
);

const StatCard = ({ title, value, icon, accent = CHART_PALETTE[0], note, onClick }) => (
  <div
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
    onClick={onClick}
    onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    className={[
      "rounded-2xl border border-gray-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] p-5",
      onClick ? "cursor-pointer hover:shadow-lg hover:border-gray-200 transition" : "",
    ].join(" ")}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-gray-600">{title}</p>
        <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2 break-words">
          {Number(value) || 0}
        </p>
        {note ? <p className="text-xs text-gray-500 mt-2">{note}</p> : null}
      </div>
      <div
        className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl grid place-items-center shrink-0"
        style={{ backgroundColor: `${accent}1A` }}
      >
        <span style={{ color: accent }} className="text-xl">
          {icon}
        </span>
      </div>
    </div>
  </div>
);

const buildPieOptions = ({ title, points, palette = CHART_PALETTE }) => {
  return {
    chart: { type: "pie", backgroundColor: "transparent", height: window.innerWidth < 640 ? 260 : 320 },
    title: { text: null },
    tooltip: {
      backgroundColor: "#FFFFFF",
      borderColor: "#E5E7EB",
      borderRadius: 10,
      shadow: false,
      pointFormat: "{point.name}: <b>{point.y}</b> ({point.percentage:.1f}%)",
    },
    plotOptions: {
      series: { ...baseNoSelect },
      pie: {
        ...baseNoSelect,
        innerSize: "55%",
        borderWidth: 0,
        allowPointSelect: false,
        cursor: "pointer",
        dataLabels: {
          enabled: window.innerWidth >= 480,
          formatter: function () {
            return `<b>${this.point.name}</b>: ${this.point.y}`;
          },
          style: { color: "#111827", textOutline: "none", fontSize: "12px" },
        },
      },
    },
    series: [
      {
        name: title,
        colorByPoint: true,
        data: (points || []).map((point, i) => ({
          name: point.label,
          y: Number(point.value) || 0,
          color: palette[i % palette.length],
          custom: { drillValue: point.drillValue ?? point.label },
        })),
      },
    ],
    legend: { enabled: false },
    credits: { enabled: false },
    exporting: { enabled: false },
  };
};

const buildXYOptions = ({
  title,
  type,
  points,
  colorByPoint = false,
  palette = CHART_PALETTE,
}) => {
  const hcType =
    type === "line" ? "spline" : type === "area" ? "areaspline" : type;
  const seriesColor = palette[0];
  const areaFill =
    type === "area"
      ? {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [
          [0, Highcharts.color(seriesColor).setOpacity(0.22).get("rgba")],
          [1, Highcharts.color(seriesColor).setOpacity(0).get("rgba")],
        ],
      }
      : undefined;

  const dataPoints = (points || []).map((point, i) => {
    const y = Number(point.value) || 0;
    const basePoint = {
      y,
      custom: { drillValue: point.drillValue ?? point.label },
    };

    if (!colorByPoint) return basePoint;
    return { ...basePoint, color: palette[i % palette.length] };
  });

  return {
    chart: {
      type: hcType,
      backgroundColor: "transparent",
      height: window.innerWidth < 640 ? 260 : 320,
      spacing: [8, 8, 8, 8],
    },
    title: { text: null },
    credits: { enabled: false },
    exporting: { enabled: false },
    legend: { enabled: false },
    xAxis: {
      categories: (points || []).map((point) => point.label),
      lineColor: "#E5E7EB",
      tickColor: "#E5E7EB",
      labels: {
        style: {
          color: "#6B7280",
          fontSize: window.innerWidth < 640 ? "10px" : "12px",
        },
      },
      title: { text: null },
    },
    yAxis: {
      min: 0,
      title: { text: null },
      gridLineColor: "#E5E7EB",
      gridLineDashStyle: "Dash",
      labels: { style: { color: "#6B7280", fontSize: "12px" } },
    },
    tooltip: {
      backgroundColor: "#FFFFFF",
      borderColor: "#E5E7EB",
      borderRadius: 10,
      shadow: false,
      pointFormat: "<b>{point.y}</b>",
    },
    plotOptions: {
      series: {
        ...baseNoSelect,
        animation: true,
        lineWidth: 3,
        marker:
          type === "line" || type === "area"
            ? {
              enabled: true,
              radius: 4,
              lineWidth: 2,
              lineColor: seriesColor,
              fillColor: "#FFFFFF",
            }
            : { enabled: false },
      },
      column: { borderRadius: 10, pointPadding: 0.12, groupPadding: 0.22 },
      bar: { borderRadius: 10, pointPadding: 0.12, groupPadding: 0.22 },
    },
    series: [
      {
        name: title,
        color: seriesColor,
        colorByPoint,
        data: dataPoints,
        fillColor: areaFill,
      },
    ],
  };
};

const shouldColorByPoint = (type) => type === "column" || type === "bar";

const VisitorsAnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState("");
  const [chartType, setChartType] = useState("pie");

  const chartRef = useRef(null);

  const downloadSingleChartPdf = async (fileName) => {
    const toastId = toast.loading("Generating chart PDF...");
    try {
      if (!chartRef?.current) { toast.error("Chart not found"); return; }
      const canvas = await html2canvas(chartRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = 190;
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 15, width, height);
      pdf.save(`${fileName}.pdf`);
      toast.dismiss(toastId);
      toast.success("Chart PDF downloaded");
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error("Chart PDF download failed");
    }
  };

  const exportCurrentChartCsv = () => {
    const entries =
      selectedChart === "hourly"
        ? sortTrendPoints(normalizeTrendPoints(hourlyData))
        : selectedChart === "monthly"
          ? sortTrendPoints(normalizeTrendPoints(monthlyData))
          : normalizeBreakdownPoints(byData[selectedChart] || {});

    if (!entries.length) { toast.error("No data to export"); return; }

    const rows = [["Category", "Count"], ...entries.map((point) => [point.label, Number(point.value) || 0])];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedChart || "visitors_chart"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported as CSV");
  };
  const [filterOpen, setFilterOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [tempFromDate, setTempFromDate] = useState("");
  const [tempToDate, setTempToDate] = useState("");
  const [byData, setByData] = useState({});
  const [hourlyData, setHourlyData] = useState({});
  const [monthlyData, setMonthlyData] = useState({});
  const [detailPopup, setDetailPopup] = useState({
    open: false,
    title: "",
    records: [],
    loading: false,
    columns: null,
  });
  const [detailPage, setDetailPage] = useState(1);
  const [detailTotalPages, setDetailTotalPages] = useState(1);
  const [detailFilter, setDetailFilter] = useState({ byKey: "", countValue: "", countType: "" });

  const [staffData, setStaffData] = useState({
    total: 0,
    in: 0,
    out: 0,
    today_in: 0,
    today_out: 0,
  });

  const [vehicleData, setVehicleData] = useState({
    total: 0,
    in: 0,
    out: 0,
    today_in: 0,
    today_out: 0,
  });

  const [dashboardData, setDashboardData] = useState({
    total: 0,
    today: 0,
    today_in: 0,
    today_out: 0,
    in: 0,
    out: 0,
    expected: 0,
    unexpected: 0,
    staff_total: 0,
    staff_in: 0,
    staff_out: 0,
    vehicles: 0,
    delivery_breakdown: {},
    purpose_breakdown: {},
    hourly_visits: {},
    monthly_visits: {},
    visitor_type_breakdown: {},
    weekly_trend: {},
  });

  const siteId = getItemInLocalStorage("SITEID");
  const companyId = getItemInLocalStorage("COMPANYID");
  const isCompany55 = companyId == 55;
  const expectedLabel = isCompany55 ? "Planned" : "Expected";
  const unexpectedLabel = isCompany55 ? "Unplanned" : "Unexpected";

  const formatDateForApi = (isoDate) => {
    if (!isoDate) return null;
    const [year, month, day] = isoDate.split("-");
    if (!year || !month || !day) return null;
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    fetchVisitorAnalytics();
    fetchStaffAnalytics();
    fetchVehicleAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, siteId]);

  const fetchVisitorAnalytics = async (retry = 0) => {
    try {
      setLoading(true);
      setDashboardData({
        total: 0,
        today: 0,
        today_in: 0,
        today_out: 0,
        in: 0,
        out: 0,
        expected: 0,
        unexpected: 0,
        staff_total: 0,
        staff_in: 0,
        staff_out: 0,
        vehicles: 0,
        delivery_breakdown: {},
        purpose_breakdown: {},
        hourly_visits: {},
        monthly_visits: {},
        visitor_type_breakdown: {},
        weekly_trend: {},
      });

      const rangeFrom = formatDateForApi(fromDate);
      const rangeTo = formatDateForApi(toDate);
      const response = await getVisitorAnalytics(rangeFrom, rangeTo, siteId);
      const apiData = response?.data || {};

      setDashboardData({
        total: apiData.total ?? 0,
        today: apiData.today ?? 0,
        today_in: apiData.today_in ?? 0,
        today_out: apiData.today_out ?? 0,
        in: apiData.in ?? 0,
        out: apiData.out ?? 0,
        expected: apiData.expected_v ?? apiData.expected ?? 0,
        unexpected: apiData.unexpected_v ?? apiData.unexpected ?? 0,
        staff_total: apiData.staff_total ?? 0,
        staff_in: apiData.staff_in ?? 0,
        staff_out: apiData.staff_out ?? 0,
        vehicles: apiData.vehicles ?? 0,
        delivery_breakdown: {},
        purpose_breakdown: {},
        hourly_visits: {},
        monthly_visits: {},
        visitor_type_breakdown: {},
        weekly_trend: {},
      });

      /* ── Extract all by_* keys from API → chart tabs ─────────────────────── */
      const newByData = {};
      Object.keys(apiData).forEach((k) => {
        if (k.startsWith("by_") && apiData[k] && typeof apiData[k] === "object") {
          /* Flatten: values may be plain counts or nested {count, records} objects */
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

      /* Auto-select first tab on first load */
      setSelectedChart((prev) => {
        if (prev && (newByData[prev] || prev === "hourly" || prev === "monthly")) return prev;
        const firstKey = Object.keys(newByData)[0];
        return firstKey || prev;
      });
    } catch (error) {
      if (retry < 1) {
        setTimeout(() => fetchVisitorAnalytics(retry + 1), 150);
      } else {
        console.error("Error fetching visitor analytics:", error);
        toast.error("Failed to load visitor analytics");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffAnalytics = async () => {
    try {
      const res = await getStaffCount(siteId);
      const api = res?.data || {};
      setStaffData({
        total: api.total_count ?? 0,
        in: api.total_staff_in ?? 0,
        out: api.total_staff_out ?? 0,
        today_in: api.todays_in ?? 0,
        today_out: api.todays_out ?? 0,
      });
    } catch (err) {
      console.error("Staff API error", err);
      toast.error("Failed to load staff data");
    }
  };

  const fetchVehicleAnalytics = async () => {
    try {
      const res = await getRegisteredVehicleDashboard(siteId);
      const api = res?.data || {};
      setVehicleData({
        total: api.total_count ?? 0,
        in: api.total_in ?? 0,
        out: api.total_out ?? 0,
        today_in: api.todays_in ?? 0,
        today_out: api.todays_out ?? 0,
      });
    } catch (err) {
      console.error("Vehicle API error", err);
      toast.error("Failed to load vehicle data");
    }
  };

  const handleChartPointClick = async (byKey, countValue, page = 1) => {
    if (!byKey || countValue === undefined || countValue === null || countValue === "") return;

    const countType = byKeyToCountType(byKey);
    const title = `${formatByLabel(byKey)}: ${countValue}`;
    const rangeFrom = formatDateForApi(fromDate);
    const rangeTo = formatDateForApi(toDate);

    setDetailFilter({ byKey, countValue });
    setDetailPage(page);
    setDetailPopup({ open: true, title, records: [], loading: true, columns: visitorColumns });

    try {
      const res = await getVisitorsDashboardDrill(countType, countValue, siteId, page, rangeFrom, rangeTo);
      const responseData = res?.data ?? {};
      const bucket = responseData?.[byKey]?.[countValue] ?? responseData?.[byKey] ?? responseData?.[countValue] ?? responseData;
      const records = Array.isArray(bucket?.records) ? bucket.records : Array.isArray(bucket) ? bucket : [];
      const total = bucket?.count ?? bucket?.total ?? records.length;
      const perPage = bucket?.per_page ?? 10;
      const pages = bucket?.total_pages ?? (perPage > 0 ? Math.max(1, Math.ceil(total / perPage)) : 1);

      setDetailTotalPages(pages);
      setDetailPopup({ open: true, title, records, loading: false, columns: visitorColumns });
    } catch (err) {
      console.error("Chart drill error", err);
      toast.error("Failed to load details.");
      setDetailPopup((p) => ({ ...p, loading: false }));
    }
  };

  const onDetailPageChange = async (nextPage) => {
    if (nextPage < 1 || nextPage > detailTotalPages) return;
    if (detailFilter.byKey === "__stat__") {
      await handleStatClick(detailFilter.countType, detailFilter.countValue, detailPopup.title, nextPage);
    } else {
      await handleChartPointClick(detailFilter.byKey, detailFilter.countValue, nextPage);
    }
  };

  // ─── Column definitions ───────────────────────────────────────────────────

  const visitorColumns = [
    { key: "name", label: "Name", accessor: (r) => r.name },
    {
      key: "company_name",
      label: "Company",
      accessor: (r) =>
        r.company_name,
    },
    { key: "contact_no", label: "Contact", accessor: (r) => r.contact_no },
    { key: "purpose", label: "Purpose", accessor: (r) => r.purpose },
    { key: "visit_type", label: "Type", accessor: (r) => r.visit_type },
    { key: "created_at", label: "Created", accessor: (r) => r.created_at },
  ];

  const staffColumns = [
    {
      key: "name",
      label: "Name",
      accessor: (r) =>
        `${r.firstname ?? ""} ${r.lastname ?? ""}`.trim() || "—",
    },
    {
      key: "mobile_no",
      label: "Contact",
      accessor: (r) => r.mobile_no ?? r.contact_number ?? r.contact_no ?? "—",
    },
    {
      key: "vendor_name",
      label: "Vendor",
      accessor: (r) => r.vendor_name ?? r.vendor?.name ?? "—",
    },
    {
      key: "work_type",
      label: "Work Type",
      accessor: (r) => r.work_type ?? "—",
    },
    {
      key: "status_type",
      label: "Status",
      accessor: (r) => r.status_type ?? "—",
    },
    {
      key: "created_at",
      label: "Created",
      accessor: (r) => r.created_at,
    },
  ];

  // For punched in / punched out — attendance record shape
  const punchedStaffColumns = [
    {
      key: "name",
      label: "Name",
      accessor: (r) =>
        r.attendance_of_name ??
        r.staff_name ??
        (`${r.firstname ?? ""} ${r.lastname ?? ""}`.trim() || "—"),
    },
    {
      key: "contact",
      label: "Contact",
      accessor: (r) => r.staff_number ?? r.mobile_no ?? "—",
    },
    {
      key: "work_type",
      label: "Work Type",
      accessor: (r) => r.staff_work_type ?? r.work_type ?? "—",
    },
    {
      key: "punched_in_at",
      label: "Punched In",
      accessor: (r) => {
        const time =
          r.today_attendance?.punched_in_at ??
          r.attendances?.[0]?.punched_in_at;

        return time ? new Date(time).toLocaleString() : "—";
      },
    },
    {
      key: "punched_out_at",
      label: "Punched Out",
      accessor: (r) => {
        const time =
          r.today_attendance?.punched_out_at ??
          r.attendances?.[0]?.punched_out_at;

        return time ? new Date(time).toLocaleString() : "—";
      },
    },
  ];

  const vehicleColumns = [
    {
      key: "vehicle_number",
      label: "Vehicle No",
      accessor: (r) => r.vehicle_number ?? "—",
    },
    {
      key: "owner_name",
      label: "Owner",
      accessor: (r) => {
        const user = r.user_name || r.created_by_name;
        return user
          ? `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim()
          : "—";
      },
    },
    {
      key: "slot_name",
      label: "Slot",
      accessor: (r) => r.slot_name ?? "—",
    },
    {
      key: "vehicle_type",
      label: "Type",
      accessor: (r) =>
        `${r.vehicle_category ?? ""} ${r.vehicle_type ?? ""}`.trim() || "—",
    },
    {
      key: "status",
      label: "Status",
      accessor: (r) => r.approved ?? (r.status ? "Active" : "Inactive") ?? "—",
    },
    {
      key: "created_at",
      label: "Created",
      accessor: (r) =>
        r.created_at
          ? new Date(r.created_at).toLocaleString()
          : "—",
    },
  ];

  const handleVehicleClick = async (title) => {
    setDetailPopup({
      open: true,
      title,
      records: [],
      loading: true,
      columns: vehicleColumns,
    });

    try {
      const res = await getRegisteredVehicle({ site_id: siteId });

      const list = res?.data?.registered_vehicles ?? res?.data ?? [];

      setDetailPopup({
        open: true,
        title,
        records: Array.isArray(list) ? list : [],
        loading: false,
        columns: vehicleColumns,
      });
    } catch (err) {
      console.error("Vehicle drill error:", err);
      toast.error("Failed to load vehicle details");
      setDetailPopup((p) => ({ ...p, loading: false }));
    }
  };

  // ─── Click handlers ───────────────────────────────────────────────────────

  const handleStatClick = async (countType, countValue, title, page = 1) => {
    setDetailPopup({ open: true, title, records: [], loading: true, columns: visitorColumns });
    setDetailFilter({ byKey: "__stat__", countType, countValue });
    setDetailPage(page);
    try {
      const rangeFrom = formatDateForApi(fromDate);
      const rangeTo = formatDateForApi(toDate);
      const res = await getVisitorsDashboardDrill(
        countType,
        countValue,
        siteId,
        page,
        rangeFrom || undefined,
        rangeTo || undefined
      );
      const responseData = res?.data ?? {};
      let bucket;
      if (countType === 'total' || countType === 'today') {
        bucket = responseData[countType];
      } else {
        const groupKey = `by_${countType}`;
        bucket =
          responseData?.[groupKey]?.[countValue] ??
          responseData?.[groupKey] ??
          responseData;
      }
      const records = Array.isArray(bucket?.records) ? bucket.records : [];
      const total = bucket?.count ?? bucket?.total ?? records.length;
      const perPage = bucket?.per_page ?? 10;
      const totalPages = bucket?.total_pages ?? (perPage > 0 ? Math.max(1, Math.ceil(total / perPage)) : 1);
      setDetailTotalPages(totalPages);
      setDetailPopup({ open: true, title, records, loading: false, columns: visitorColumns });
    } catch (err) {
      console.error("Drill fetch error:", err);
      toast.error("Failed to load details");
      setDetailPopup((p) => ({ ...p, loading: false }));
    }
  };

  const handleStaffClick = async (type, title) => {
    setDetailPopup({ open: true, title, records: [], loading: true, columns: staffColumns });
    try {
      let res;
      let records = [];
      let columns = staffColumns;

      if (type === "total") {
        res = await getStaffDrill(siteId, 100);
        const list = res?.data?.staffs ?? res?.data ?? [];
        records = Array.isArray(list) ? list : [];
        columns = staffColumns;
      } else if (type === "in") {
        res = await getStaffPunchedInToday(siteId);
        const list =
          res?.data?.staffs ??
          res?.data?.attendances ??
          res?.data ??
          [];
        records = Array.isArray(list) ? list : [];
        columns = punchedStaffColumns;
      } else {
        res = await getStaffPunchedOutToday(siteId);
        const list =
          res?.data?.staffs ??
          res?.data?.attendances ??
          res?.data ??
          [];
        records = Array.isArray(list) ? list : [];
        columns = punchedStaffColumns;
      }

      setDetailPopup({ open: true, title, records, loading: false, columns });
    } catch (err) {
      console.error("Staff drill error:", err);
      toast.error("Failed to load staff details");
      setDetailPopup((p) => ({ ...p, loading: false }));
    }
  };

  /* ── Helpers ─────────────────────────────────────────────────────────────── */

  /** "by_visit_type" → "Visit Type" */
  const formatByLabel = (key) => {
    if (key === "hourly") return "Hourly Trend";
    if (key === "monthly") return "Monthly Trend";
    return key.replace(/^by_/, "").split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  /** Derive count_type from a by_* key: "by_visit_type" → "visit_type" */
  const byKeyToCountType = (key) => key.replace(/^by_/, "");

  /** Icon for each chart tab */
  const getTabIcon = (key) => {
    const map = {
      by_in_out: "🔄",
      by_entry_type: "🚪",
      by_visit_type: "👤",
      by_purpose: "📝",
      by_frequency: "📊",
      by_created_by: "👥",
      hourly: "📈",
      monthly: "📅",
    };
    return map[key] ?? "📋";
  };

  /* ── Generic chart options (by_* tabs + hourly/monthly) ──────────────────── */
  const selectedChartPoints = useMemo(() => {
    if (selectedChart === "hourly") return sortTrendPoints(normalizeTrendPoints(hourlyData));
    if (selectedChart === "monthly") return sortTrendPoints(normalizeTrendPoints(monthlyData));

    return toSortedEntries(byData[selectedChart] || {}, "desc").map(([label, rawValue]) => ({
      label,
      value:
        Number(
          rawValue && typeof rawValue === "object"
            ? rawValue.count ?? rawValue.value ?? rawValue.registrations ?? 0
            : rawValue
        ) || 0,
      drillValue: label,
    }));
  }, [selectedChart, byData, hourlyData, monthlyData]);

  const selectedChartOptions = useMemo(() => {
    const chartTitle = selectedChart ? formatByLabel(selectedChart) : "";

    const addClickEvents = (options) => {
      if (!options?.plotOptions) return options;
      const clickHandler = function () {
        const itemName =
          this.options?.custom?.drillValue ??
          this.name ??
          this.category ??
          String(this.x ?? "");
        handleChartPointClick(selectedChart, itemName);
      };
      const evt = { events: { click: clickHandler } };
      return {
        ...options,
        plotOptions: {
          ...options.plotOptions,
          series: { ...(options.plotOptions.series || {}), point: { ...(options.plotOptions.series?.point || {}), ...evt } },
          pie: { ...(options.plotOptions.pie || {}), point: { ...(options.plotOptions.pie?.point || {}), ...evt } },
        },
      };
    };

    let options;
    if (chartType === "pie") {
      options = buildPieOptions({
        title: chartTitle,
        points: selectedChart === "hourly" || selectedChart === "monthly"
          ? selectedChartPoints.filter((point) => point.value > 0)
          : selectedChartPoints,
      });
    } else {
      options = buildXYOptions({
        title: chartTitle,
        type: chartType,
        points: selectedChartPoints,
        colorByPoint: shouldColorByPoint(chartType),
      });
    }
    return addClickEvents(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChart, chartType, selectedChartPoints]);

  /* ── Chart buttons: dynamic by_* from API + always-on hourly/monthly ─────── */
  const chartButtons = useMemo(
    () => [
      ...Object.keys(byData).map((key) => ({
        id: key,
        label: formatByLabel(key),
        icon: getTabIcon(key),
      })),
      { id: "hourly", label: "Hourly Trend", icon: "📈" },
      { id: "monthly", label: "Monthly Trend", icon: "📅" },
    ],
    [byData],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-gray-700 text-4xl" />
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 pb-4 space-y-4 sm:space-y-6 overflow-x-hidden">
      {/* ── Top bar ── */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            setTempFromDate(fromDate);
            setTempToDate(toDate);
            setFilterOpen(true);
          }}
          className="h-10 w-full sm:w-auto px-4 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
        >
          Filter by Date
        </button>
        <button
          type="button"
          onClick={() => { setFromDate(""); setToDate(""); }}
          className="h-10 w-full sm:w-auto px-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
        >
          Clear Filter
        </button>
      </div>

      {/* ── Date filter modal ── */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-4 sm:p-5">
            <h3 className="text-lg font-semibold text-gray-900">Filter Visitors by Date</h3>
            <p className="text-sm text-gray-500 mt-1">
              Choose start and end date to refresh dashboard.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={tempFromDate}
                  onChange={(e) => setTempFromDate(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={tempToDate}
                  onChange={(e) => setTempToDate(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="h-10 w-full sm:w-auto px-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!tempFromDate || !tempToDate) {
                    toast.error("Please select both start and end dates.");
                    return;
                  }
                  setFromDate(tempFromDate);
                  setToDate(tempToDate);
                  setFilterOpen(false);
                }}
                className="h-10 w-full sm:w-auto px-4 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Visitor stat cards (dynamic – all API fields) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[
          { key: "total", title: "Total Visitors", note: "All time visitors", accent: CHART_PALETTE[0], icon: <FaUsers />, countType: "total", countValue: "All" },
          { key: "in", title: "Total In", note: "Currently inside", accent: CHART_PALETTE[1], icon: <FaUserCheck />, countType: "in_out", countValue: "IN" },
          { key: "out", title: "Total Out", note: "Currently out", accent: CHART_PALETTE[2], icon: <FaUserClock />, countType: "in_out", countValue: "OUT" },
          { key: "today", title: "Today's Activities", note: "Today", accent: CHART_PALETTE[5], icon: <FaUsers />, countType: "today", countValue: "All" },
          { key: "today_in", title: "Today's In", note: "Today check-in", accent: CHART_PALETTE[6], icon: <FaUserCheck />, countType: "in_out", countValue: "IN" },
          { key: "today_out", title: "Today's Out", note: "Today check-out", accent: CHART_PALETTE[3], icon: <FaUserClock />, countType: "in_out", countValue: "OUT" },
          { key: "expected", title: expectedLabel, note: "Pre-registered", accent: CHART_PALETTE[9], icon: <FaUserClock />, countType: "entry_type", countValue: "Expected" },
          { key: "unexpected", title: unexpectedLabel, note: "Walk-in visitors", accent: CHART_PALETTE[4], icon: <FaUsers />, countType: "entry_type", countValue: "Unexpected" },
        ]
          .filter(({ key }) => dashboardData[key] !== undefined)
          .map(({ key, title, note, accent, icon, countType, countValue }) => (
            <StatCard
              key={key}
              title={title}
              value={dashboardData[key]}
              icon={icon}
              accent={accent}
              note={note}
              onClick={countType && countValue ? () => handleStatClick(countType, countValue, title) : undefined}
            />
          ))
        }
        {/* <StatCard
          title="Total Vehicles"
          value={vehicleData.total}
          icon={<FaCar />}
          accent={CHART_PALETTE[8]}
          onClick={() => handleVehicleClick("Total Vehicles")}
        /> */}
      </div>

      {/* ── Chart selector ── */}
      <Card
        title="Analytics"
        subtitle="Choose a chart and chart type"
        right={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <ChartTypeMenu value={chartType} onChange={setChartType} />
            <IconBtn title="Refresh" onClick={() => fetchVisitorAnalytics(0)}>↻</IconBtn>
          </div>
        }
      >
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {chartButtons.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedChart(opt.id)}
              className={[
                "whitespace-nowrap flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition",
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
      <Card
        title={selectedChart ? formatByLabel(selectedChart) : "Chart"}
        subtitle={`Chart type: ${chartType}`}
        right={
          <div className="flex items-center gap-2">
            {/* <button
              type="button"
              title="Export in Excel"
              onClick={exportCurrentChartCsv}
              className="h-9 w-10 grid place-items-center rounded-lg bg-green-50 text-green-700 hover:bg-green-100"
            >
              <FaFileExcel className="text-sm" />
            </button> */}
            <button type="button" title="Export Chart PDF" onClick={() => downloadSingleChartPdf(selectedChart || "Visitors_Chart")} className="h-10 min-w-[44px] px-4  bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-lg flex items-center gap-2 hover:opacity-90 transition">
              <FaDownload className="text-sm" />
            </button>
          </div>
        }
      >
        <div ref={chartRef} className="w-full min-w-0 overflow-x-auto">
          <div className="min-w-[280px]">
            <HighchartsReact highcharts={Highcharts} options={selectedChartOptions} />
          </div>
        </div>
      </Card>

      {/* ── Staff & vehicle stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* <StatCard
          title="Staff Total"
          value={staffData.total}
          icon={<FaUsers />}
          accent={CHART_PALETTE[5]}
          onClick={() => handleStaffClick("total", "Staff Total")}
        />
        <StatCard
          title="Punched In Today"
          value={staffData.today_in}
          icon={<FaUserCheck />}
          accent={CHART_PALETTE[1]}
          note="Checked in today"
          onClick={() => handleStaffClick("in", "Punched In Today")}
        />
        <StatCard
          title="Punched Out Today"
          value={staffData.today_out}
          icon={<FaUserClock />}
          accent={CHART_PALETTE[3]}
          note="Checked out today"
          onClick={() => handleStaffClick("out", "Punched Out Today")}
        /> 
      <StatCard
        title="Total Vehicles"
        value={vehicleData.total}
        icon={<FaCar />}
        accent={CHART_PALETTE[8]}
        onClick={() => handleVehicleClick("Total Vehicles")}
      /> */}
      </div>

      {/* ── Detail popup ── */}
      <DetailPopup
        isOpen={detailPopup.open}
        onClose={() => setDetailPopup((p) => ({ ...p, open: false }))}
        title={detailPopup.title}
        subtitle={`${detailPopup.records.length} record(s)`}
        records={detailPopup.records}
        loading={detailPopup.loading}
        columns={detailPopup.columns || visitorColumns}
        page={detailPage}
        totalPages={detailTotalPages}
        onPageChange={onDetailPageChange}
      />
    </div>
  );
};

export default VisitorsAnalyticsDashboard;
