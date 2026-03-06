import React, { useEffect, useMemo, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getServicesTaskList, getSoftServiceDownload, getSoftServiceStatus } from "../api";
import DetailPopup from "./DetailPopup";
import { useSelector } from "react-redux";
import { DNA } from "react-loader-spinner";
import { FaDownload, FaChevronDown } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  AiOutlineAreaChart,
  AiOutlineBarChart,
  AiOutlineLineChart,
} from "react-icons/ai";
import { RiPieChartFill } from "react-icons/ri";
import { PiChartBarHorizontal } from "react-icons/pi";

/** ✅ Multi-color palette (used across all charts) */
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

/** =========================
 *  Screenshot UI building blocks
 *  ========================= */
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
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: it.color }}
          />
          <span className="text-gray-800 font-semibold">
            {it.label}:{" "}
            <span className="font-semibold text-gray-900">
              {it.value ?? 0}
              {it.unit ? ` ${it.unit}` : ""}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
};

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

const ChartTypeMenu = ({ value, onChange, includeBar = false }) => {
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
    ...(includeBar ? [{ key: "bar", label: "Bar" }] : []),
    { key: "column", label: "Column" },
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

const ChartCard = ({
  title,
  subtitle,
  trendPercent = null,
  trendDirection = "down",
  legendItems = [],
  footerText = "",
  footerDirection = "down",
  onDownload,
  chartType,
  setChartType,
  includeBar = false,
  children,
}) => {
  const footerArrow = footerDirection === "up" ? "↑" : "↓";
  const footerColor =
    footerDirection === "up" ? "text-red-600" : "text-emerald-700";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[18px] font-bold text-gray-900 truncate">{title}</p>
          {subtitle ? (
            <p className="text-sm text-gray-500 truncate mt-1">{subtitle}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <TrendPill percent={trendPercent} direction={trendDirection} />
          <ChartTypeMenu
            value={chartType}
            onChange={setChartType}
            includeBar={includeBar}
          />
          <IconBtn onClick={onDownload} title="Download">
            <FaDownload className="text-sm" />
          </IconBtn>
        </div>
      </div>

      <LegendRow items={legendItems} />

      <div className="mt-2">{children}</div>

      {footerText ? (
        <div className="mt-2 text-center text-sm">
          <span className={footerColor}>
            {footerArrow} {footerText}
          </span>
        </div>
      ) : null}
    </div>
  );
};

/** =========================
 *  Highcharts builders
 *  ========================= */
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

/** ✅ PIE supports palette for multi colors */
const buildPieOptions = ({ title, data, colorsMap, palette = CHART_PALETTE }) => ({
  chart: { type: "pie", backgroundColor: "transparent", height: 280 },
  title: { text: null },
  tooltip: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 10,
    shadow: false,
    pointFormat: "{point.name}: <b>{point.y}</b>",
  },
  plotOptions: {
    series: { ...baseNoSelect },
    pie: {
      ...baseNoSelect,
      innerSize: "55%",
      borderWidth: 0,
      allowPointSelect: false,
      cursor: "pointer",
      dataLabels: { enabled: true, format: "<b>{point.name}</b>: {point.y}" },
    },
  },
  series: [
    {
      name: title,
      colorByPoint: true,
      data: Object.keys(data || {}).map((k, i) => ({
        name: k,
        y: Number(data?.[k]) || 0,
        color: colorsMap?.[k] || palette[i % palette.length],
      })),
    },
  ],
  legend: { enabled: false },
  credits: { enabled: false },
  exporting: { enabled: false },
});

/** ✅ XY supports colorByPoint + palette for bar/column */
const buildXYOptions = ({
  title,
  type,
  categories,
  values,
  themeColor,
  colorByPoint = false,
  palette = CHART_PALETTE,
}) => {
  const hcType =
    type === "line" ? "spline" : type === "area" ? "areaspline" : type;

  // pick a “series” color for line/area
  const seriesColor = themeColor || palette[0];

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

  const dataPoints = values.map((v, i) => {
    const y = Number(v) || 0;
    if (!colorByPoint) return y;
    return { y, color: palette[i % palette.length] };
  });

  return {
    chart: {
      type: hcType,
      backgroundColor: "transparent",
      height: 280,
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

/** =========================
 *  Main Component
 *  ========================= */
const SoftServiceHighCharts = () => {
  const [byStatus, setByStatus] = useState({});
  const [byBuilding, setByBuilding] = useState({});
  const [byFloor, setByFloor] = useState({});
  const [byUnit, setByUnit] = useState({});
  const [detailPopup, setDetailPopup] = useState({
    open: false,
    title: "",
    records: [],
    loading: false,
  });
  const onStatusPointClickRef = useRef(null);

  useSelector((state) => state.theme.color); // keep if needed

  const [statusType, setStatusType] = useState("column");
  const [buildingType, setBuildingType] = useState("line");
  const [floorType, setFloorType] = useState("area");
  const [unitType, setUnitType] = useState("column");

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const resp = await getServicesTaskList();
        setByStatus(resp?.data?.by_status || {});
        setByBuilding(resp?.data?.by_building || {});
        setByFloor(resp?.data?.by_floor || {});
        setByUnit(resp?.data?.by_unit || {});
      } catch (e) {
        console.log("Error fetching soft service info:", e);
      }
    };
    fetchInfo();
  }, []);

  const handleStatusPointClick = async (statusName) => {
    if (!statusName) return;
    setDetailPopup({ open: true, title: `Soft Services: ${statusName}`, records: [], loading: true });
    try {
      const res = await getSoftServiceStatus(statusName, null, null);
      const list = res?.data?.activities ?? res?.data ?? [];
      setDetailPopup({
        open: true,
        title: `Soft Services: ${statusName}`,
        records: Array.isArray(list) ? list : [],
        loading: false,
      });
    } catch (err) {
      console.error("Soft service drill error:", err);
      toast.error("Failed to load task details");
      setDetailPopup((p) => ({ ...p, loading: false }));
    }
  };

  useEffect(() => {
    onStatusPointClickRef.current = handleStatusPointClick;
  });

  const handleDownload = async () => {
    const toastId = toast.loading("Downloading Please Wait");
    try {
      const response = await getSoftServiceDownload();
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: response.headers["content-type"] })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Soft_Service_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss(toastId);
      toast.success("Soft Service downloaded successfully");
    } catch (error) {
      toast.dismiss(toastId);
      console.error("Error downloading Soft Service:", error);
      toast.error("Something went wrong, please try again");
    }
  };

  /** optional: keep explicit status colors for pie legends if you want */
  const statusColors = useMemo(
    () => ({
      overdue: "#EF4444",
      complete: "#10B981",
      pending: "#F59E0B",
      inprogress: "#3B82F6",
      in_progress: "#3B82F6",
      open: "#6366F1",
    }),
    []
  );

  const topTwoLegend = (obj, colorsMap) => {
    const entries = toSortedEntries(obj, "desc").slice(0, 2);
    return entries.map(([label, value], idx) => ({
      label,
      value,
      color:
        colorsMap?.[label] ||
        CHART_PALETTE[idx % CHART_PALETTE.length] ||
        "#1D4ED8",
    }));
  };

  const calcTrendFromTotals = (obj) => {
    const total = Object.values(obj || {}).reduce(
      (s, v) => s + (Number(v) || 0),
      0
    );
    if (!Number.isFinite(total)) return { pct: null, dir: "down" };
    return { pct: 0, dir: "down" };
  };

  /** ✅ For Column/Bar: multi-color bars
   *  For Line/Area: single color (palette[0]) */
  const shouldColorByPoint = (type) => type === "column" || type === "bar";

  const statusOptions = useMemo(() => {
    let options;
    if (statusType === "pie") {
      options = buildPieOptions({
        title: "Soft Services by Status",
        data: byStatus,
        colorsMap: statusColors,
        palette: CHART_PALETTE,
      });
      options.plotOptions = options.plotOptions || {};
      options.plotOptions.pie = { ...(options.plotOptions.pie || {}), point: { events: { click: function () { onStatusPointClickRef.current?.(this.name); } } } };
    } else {
      const entries = toSortedEntries(byStatus, "desc");
      options = buildXYOptions({
        title: "Soft Services by Status",
        type: statusType,
        categories: entries.map(([k]) => k),
        values: entries.map(([, v]) => v),
        themeColor: CHART_PALETTE[0],
        colorByPoint: shouldColorByPoint(statusType),
        palette: CHART_PALETTE,
      });
      options.plotOptions = options.plotOptions || {};
      options.plotOptions.series = { ...(options.plotOptions.series || {}), point: { events: { click: function () { onStatusPointClickRef.current?.(this.name); } } } };
    }
    return options;
  }, [byStatus, statusType, statusColors]);

  const buildingOptions = useMemo(() => {
    if (buildingType === "pie") {
      return buildPieOptions({
        title: "Soft Services by Building",
        data: byBuilding,
        palette: CHART_PALETTE,
      });
    }
    const entries = toSortedEntries(byBuilding, "desc");
    return buildXYOptions({
      title: "Soft Services by Building",
      type: buildingType,
      categories: entries.map(([k]) => k),
      values: entries.map(([, v]) => v),
      themeColor: CHART_PALETTE[0],
      colorByPoint: shouldColorByPoint(buildingType),
      palette: CHART_PALETTE,
    });
  }, [byBuilding, buildingType]);

  const floorOptions = useMemo(() => {
    if (floorType === "pie") {
      return buildPieOptions({
        title: "Soft Services by Floor",
        data: byFloor,
        palette: CHART_PALETTE,
      });
    }
    const entries = toSortedEntries(byFloor, "desc");
    return buildXYOptions({
      title: "Soft Services by Floor",
      type: floorType,
      categories: entries.map(([k]) => k),
      values: entries.map(([, v]) => v),
      themeColor: CHART_PALETTE[0],
      colorByPoint: shouldColorByPoint(floorType),
      palette: CHART_PALETTE,
    });
  }, [byFloor, floorType]);

  const unitOptions = useMemo(() => {
    if (unitType === "pie") {
      return buildPieOptions({
        title: "Soft Services by Unit",
        data: byUnit,
        palette: CHART_PALETTE,
      });
    }
    const entries = toSortedEntries(byUnit, "desc");
    const limited = entries.length > 25 ? entries.slice(0, 25) : entries;

    return buildXYOptions({
      title:
        entries.length > 25
          ? "Soft Services by Unit (Top 25)"
          : "Soft Services by Unit",
      type: unitType,
      categories: limited.map(([k]) => k),
      values: limited.map(([, v]) => v),
      themeColor: CHART_PALETTE[0],
      colorByPoint: shouldColorByPoint(unitType),
      palette: CHART_PALETTE,
    });
  }, [byUnit, unitType]);

  const Loading = () => (
    <div className="h-[320px] flex items-center justify-center">
      <DNA visible height="120" width="120" ariaLabel="dna-loading" />
    </div>
  );

  const statusTrend = calcTrendFromTotals(byStatus);
  const buildingTrend = calcTrendFromTotals(byBuilding);
  const floorTrend = calcTrendFromTotals(byFloor);

  return (
    <div className="w-full px-3 pb-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Soft Services"
          subtitle="By Status"
          trendPercent={statusTrend.pct}
          trendDirection={statusTrend.dir}
          onDownload={handleDownload}
          chartType={statusType}
          setChartType={setStatusType}
          includeBar={false}
        >
          {byStatus && Object.keys(byStatus).length ? (
            <HighchartsReact highcharts={Highcharts} options={statusOptions} />
          ) : (
            <Loading />
          )}
        </ChartCard>

        <ChartCard
          title="Soft Services"
          subtitle="By Building"
          trendPercent={buildingTrend.pct}
          trendDirection={buildingTrend.dir}
          onDownload={handleDownload}
          chartType={buildingType}
          setChartType={setBuildingType}
          includeBar={true}
        >
          {byBuilding && Object.keys(byBuilding).length ? (
            <HighchartsReact
              highcharts={Highcharts}
              options={buildingOptions}
            />
          ) : (
            <Loading />
          )}
        </ChartCard>

        <ChartCard
          title="Soft Services"
          subtitle="By Floor"
          trendPercent={floorTrend.pct}
          trendDirection={floorTrend.dir}
          onDownload={handleDownload}
          chartType={floorType}
          setChartType={setFloorType}
          includeBar={true}
        >
          {byFloor && Object.keys(byFloor).length ? (
            <HighchartsReact highcharts={Highcharts} options={floorOptions} />
          ) : (
            <Loading />
          )}
        </ChartCard>
      </div>

      <div className="mt-6">
        <ChartCard
          title="Soft Services"
          subtitle="By Unit"
          footerText={
            Object.keys(byUnit || {}).length > 25 ? "Showing top 25 units" : ""
          }
          footerDirection="down"
          onDownload={handleDownload}
          chartType={unitType}
          setChartType={setUnitType}
          includeBar={false}
        >
          {byUnit && Object.keys(byUnit).length ? (
            <HighchartsReact highcharts={Highcharts} options={unitOptions} />
          ) : (
            <Loading />
          )}
        </ChartCard>
      </div>

      <DetailPopup
        isOpen={detailPopup.open}
        onClose={() => setDetailPopup((p) => ({ ...p, open: false }))}
        title={detailPopup.title}
        subtitle={`${detailPopup.records.length} record(s)`}
        records={detailPopup.records}
        loading={detailPopup.loading}
        columns={[
          { key: "checklist_name", label: "Checklist", accessor: (r) => r.checklist?.name ?? r.checklist_name ?? "—" },
          { key: "status", label: "Status", accessor: (r) => r.status ?? "—" },
          { key: "start_time", label: "Start", accessor: (r) => r.start_time },
          { key: "assigned_to", label: "Assigned To", accessor: (r) => r.assigned_to_name ?? r.assigned_to ?? "—" },
          { key: "soft_service", label: "Service", accessor: (r) => (r.soft_service?.name ?? r.soft_service_name ?? "—") },
        ]}
      />
    </div>
  );
};

export default SoftServiceHighCharts;
