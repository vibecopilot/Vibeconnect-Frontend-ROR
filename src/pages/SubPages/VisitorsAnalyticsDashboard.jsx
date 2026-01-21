import React, { useEffect, useMemo, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getVisitorDashboard } from "../../api";
import {
  FaSpinner,
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaCar,
  FaTruck,
  FaCalendarAlt,
  FaChevronDown,
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
  "#1D4ED8", // blue
  "#10B981", // emerald
  "#F59E0B", // amber
  "#EF4444", // red 
  "#8B5CF6", // violet
  "#06B6D4", // cyan
  "#EC4899", // pink
  "#84CC16", // lime
  "#F97316", // orange
  "#14B8A6", // teal
  "#0EA5E9", // sky
  "#6366F1", // indigo
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
      : (Number(b[1]) || 0) - (Number(a[1]) || 0)
  );

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
  <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] p-5">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[18px] font-bold text-gray-900 truncate">{title}</p>
        {subtitle ? (
          <p className="text-sm text-gray-500 truncate mt-1">{subtitle}</p>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
    <div className="mt-4">{children}</div>
  </div>
);

const StatCard = ({ title, value, icon, accent = CHART_PALETTE[0], note }) => (
  <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] p-5">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-gray-600">{title}</p>
        <p className="text-3xl font-extrabold text-gray-900 mt-2">
          {Number(value) || 0}
        </p>
        {note ? <p className="text-xs text-gray-500 mt-2">{note}</p> : null}
      </div>
      <div
        className="h-11 w-11 rounded-xl grid place-items-center"
        style={{ backgroundColor: `${accent}1A` }} // ~10% tint
      >
        <span style={{ color: accent }} className="text-xl">
          {icon}
        </span>
      </div>
    </div>
  </div>
);

const buildPieOptions = ({ title, dataMap, colorsMap, palette = CHART_PALETTE }) => {
  const keys = Object.keys(dataMap || {});
  return {
    chart: { type: "pie", backgroundColor: "transparent", height: 320 },
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
          enabled: true,
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
        data: keys.map((k, i) => ({
          name: k,
          y: Number(dataMap?.[k]) || 0,
          color: colorsMap?.[k] || palette[i % palette.length],
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
  categories,
  values,
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

  const dataPoints = (values || []).map((v, i) => {
    const y = Number(v) || 0;
    if (!colorByPoint) return y;
    return { y, color: palette[i % palette.length] };
  });

  return {
    chart: {
      type: hcType,
      backgroundColor: "transparent",
      height: 320,
      spacing: [8, 8, 8, 8],
    },
    title: { text: null },
    credits: { enabled: false },
    exporting: { enabled: false },
    legend: { enabled: false },

    xAxis: {
      categories,
      lineColor: "#E5E7EB",
      tickColor: "#E5E7EB",
      labels: { style: { color: "#6B7280", fontSize: "12px" } },
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
      column: {
        borderRadius: 10,
        pointPadding: 0.12,
        groupPadding: 0.22,
      },
      bar: {
        borderRadius: 10,
        pointPadding: 0.12,
        groupPadding: 0.22,
      },
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
  const [selectedChart, setSelectedChart] = useState("visitor_type");
  const [chartType, setChartType] = useState("pie");
  const [dashboardData, setDashboardData] = useState({
    total: 0,
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

  useEffect(() => {
    fetchVisitorAnalytics();
  }, []);

  const fetchVisitorAnalytics = async (retry = 0) => {
    try {
      setLoading(true);
      const response = await getVisitorDashboard();

      const apiData = response?.data || {};

      const data = {
        total: apiData.total ?? 0,
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
        delivery_breakdown: apiData.delivery_breakdown ?? apiData.delivery_by_platform ?? {},
        purpose_breakdown:
          apiData.purpose_breakdown ??
          {
            Meeting: apiData.meeting_count ?? 0,
            Delivery: apiData.delivery_count ?? 0,
            Interview: apiData.interview_count ?? 0,
            "Site Visit": apiData.site_visit_count ?? 0,
            Maintenance: apiData.maintenance_count ?? 0,
            Other: apiData.other_count ?? 0,
          },
        hourly_visits: apiData.hourly_visits ?? apiData.hourly_trend ?? {},
        monthly_visits: apiData.monthly_visits ?? apiData.monthly_trend ?? {},
        visitor_type_breakdown: apiData.visitor_type_breakdown ?? apiData.by_visitor_type ?? {},
        weekly_trend: apiData.weekly_trend ?? {},
      };

      setDashboardData(data);
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

  const visitorTypeMap = useMemo(() => {
    const m = dashboardData.visitor_type_breakdown || {};
    const hasBreakdown = Object.keys(m).length > 0;

    if (hasBreakdown) return m;

    return {
      Expected: dashboardData.expected ?? 0,
      Unexpected: dashboardData.unexpected ?? 0,
    };
  }, [dashboardData.visitor_type_breakdown, dashboardData.expected, dashboardData.unexpected]);

  const inOutMap = useMemo(
    () => ({
      "Currently In": dashboardData.in ?? 0,
      "Currently Out": dashboardData.out ?? 0,
    }),
    [dashboardData.in, dashboardData.out]
  );

  const staffMap = useMemo(
    () => ({
      "Staff In": dashboardData.staff_in ?? 0,
      "Staff Out": dashboardData.staff_out ?? 0,
    }),
    [dashboardData.staff_in, dashboardData.staff_out]
  );

  const deliveryMap = useMemo(
    () => dashboardData.delivery_breakdown || {},
    [dashboardData.delivery_breakdown]
  );

  const purposeMap = useMemo(
    () => dashboardData.purpose_breakdown || {},
    [dashboardData.purpose_breakdown]
  );

  const hourlyMap = useMemo(
    () => dashboardData.hourly_visits || {},
    [dashboardData.hourly_visits]
  );

  const monthlyMap = useMemo(
    () => dashboardData.monthly_visits || {},
    [dashboardData.monthly_visits]
  );

  const selectedChartOptions = useMemo(() => {
    if (selectedChart === "visitor_type") {
      if (chartType === "pie") {
        return buildPieOptions({
          title: "Visitor Type Distribution",
          dataMap: visitorTypeMap,
          colorsMap: {
            Expected: "#F59E0B",
            Unexpected: "#EAB308",
          },
        });
      }
      const entries = toSortedEntries(visitorTypeMap, "desc");
      return buildXYOptions({
        title: "Visitor Type Distribution",
        type: chartType,
        categories: entries.map(([k]) => k),
        values: entries.map(([, v]) => v),
        colorByPoint: shouldColorByPoint(chartType),
      });
    }

    if (selectedChart === "in_out") {
      return buildPieOptions({
        title: "Visitor In/Out Status",
        dataMap: inOutMap,
        colorsMap: { "Currently In": "#3B82F6", "Currently Out": "#8B5CF6" },
      });
    }

    if (selectedChart === "staff") {
      return buildPieOptions({
        title: "Staff In/Out Distribution",
        dataMap: staffMap,
        colorsMap: { "Staff In": "#10B981", "Staff Out": "#EF4444" },
      });
    }

    if (selectedChart === "delivery") {
      const entries = toSortedEntries(deliveryMap, "desc");
      return buildXYOptions({
        title: "Delivery Visitors by Platform",
        type: "column",
        categories: entries.map(([k]) => k),
        values: entries.map(([, v]) => v),
        colorByPoint: true,
      });
    }

    if (selectedChart === "purpose") {
      const entries = toSortedEntries(purposeMap, "desc");
      return buildXYOptions({
        title: "Visitor Purpose Distribution",
        type: "bar",
        categories: entries.map(([k]) => k),
        values: entries.map(([, v]) => v),
        colorByPoint: true,
      });
    }

    if (selectedChart === "hourly") {
      const entries = toSortedEntries(hourlyMap, "asc");
      return buildXYOptions({
        title: "Hourly Visitor Trend (Today)",
        type: "area",
        categories: entries.map(([k]) => k),
        values: entries.map(([, v]) => v),
        colorByPoint: false,
      });
    }

    if (selectedChart === "monthly") {
      const entries = toSortedEntries(monthlyMap, "asc");
      return buildXYOptions({
        title: "Monthly Visitor Trend (Current Year)",
        type: "column",
        categories: entries.map(([k]) => k),
        values: entries.map(([, v]) => v),
        colorByPoint: true,
      });
    }

    return buildPieOptions({
      title: "Visitor Type Distribution",
      dataMap: visitorTypeMap,
    });
  }, [
    selectedChart,
    chartType,
    visitorTypeMap,
    inOutMap,
    staffMap,
    deliveryMap,
    purposeMap,
    hourlyMap,
    monthlyMap,
  ]);

  const chartButtons = [
    { id: "visitor_type", label: "Visitor Type", icon: "📊" },
    { id: "in_out", label: "In/Out Status", icon: "🔄" },
    { id: "staff", label: "Staff Distribution", icon: "👥" },
    { id: "delivery", label: "Delivery Platforms", icon: "📦" },
    { id: "purpose", label: "Visit Purpose", icon: "📝" },
    { id: "hourly", label: "Hourly Trend", icon: "📈" },
    { id: "monthly", label: "Monthly Trend", icon: "📅" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-gray-700 text-4xl" />
      </div>
    );
  }

  return (
    <div className="w-full px-3 pb-4 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Visitors"
          value={dashboardData.total}
          icon={<FaUsers />}
          accent={CHART_PALETTE[0]}
          note="All time visitors"
        />
        <StatCard
          title="Total In"
          value={dashboardData.in}
          icon={<FaUserCheck />}
          accent={CHART_PALETTE[1]}
          note="Currently inside"
        />
        <StatCard
          title="Total Out"
          value={dashboardData.out}
          icon={<FaUserClock />}
          accent={CHART_PALETTE[2]}
          note="Checked out"
        />
        <StatCard
          title="Expected"
          value={dashboardData.expected}
          icon={<FaUserClock />}
          accent={CHART_PALETTE[9]}
          note="Pre-registered visitors"
        />
        <StatCard
          title="Unexpected"
          value={dashboardData.unexpected}
          icon={<FaUsers />}
          accent={CHART_PALETTE[4]}
          note="Walk-in visitors"
        />
      </div>

      <Card
        title="Analytics"
        subtitle="Choose a chart and chart type"
        right={
          <div className="flex items-center gap-2">
            <ChartTypeMenu value={chartType} onChange={setChartType} />
            <IconBtn
              title="Refresh"
              onClick={() => fetchVisitorAnalytics(0)}
            >
              ↻
            </IconBtn>
          </div>
        }
      >
        <div className="flex flex-wrap gap-2">
          {chartButtons.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedChart(opt.id)}
              className={[
                "px-4 py-2 rounded-xl text-sm font-semibold transition",
                selectedChart === opt.id
                  ? "bg-gray-900 text-white shadow"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200",
              ].join(" ")}
            >
              <span className="mr-2">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </Card>

      <Card
        title="Chart"
        subtitle={
          selectedChart === "visitor_type"
            ? `Chart Type: ${chartType}`
            : "Overview"
        }
      >
        <HighchartsReact highcharts={Highcharts} options={selectedChartOptions} />
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
        <StatCard
          title="Today's In"
          value={dashboardData.today_in}
          icon={<FaCalendarAlt />}
          accent={CHART_PALETTE[1]}
        />
        <StatCard
          title="Today's Out"
          value={dashboardData.today_out}
          icon={<FaCalendarAlt />}
          accent={CHART_PALETTE[3]}
        />
        <StatCard
          title="Staff Total"
          value={dashboardData.staff_total}
          icon={<FaUsers />}
          accent={CHART_PALETTE[5]}
        />
        <StatCard
          title="Staff In"
          value={dashboardData.staff_in}
          icon={<FaUserCheck />}
          accent={CHART_PALETTE[1]}
        />
        <StatCard
          title="Staff Out"
          value={dashboardData.staff_out}
          icon={<FaUserClock />}
          accent={CHART_PALETTE[3]}
        />
        <StatCard
          title="Total Vehicles"
          value={dashboardData.vehicles}
          icon={<FaCar />}
          accent={CHART_PALETTE[8]}
        />
      </div>
    </div>
  );
};

export default VisitorsAnalyticsDashboard;
