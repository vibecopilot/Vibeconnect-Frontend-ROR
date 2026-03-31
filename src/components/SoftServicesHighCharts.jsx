import React, { useEffect, useMemo, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  getServicesTaskList,
  getSoftServiceDownload,
  getSoftServicesDashboardDrill,
} from "../api";
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

/** Map count_type → nested response key */
const COUNT_TYPE_TO_KEY = {
  floor: "by_floor",
  building: "by_building",
  task_status: "by_task_status",
  assigned_user: "by_assigned_user",
};

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
  Object.entries(obj).sort((a, b) => {
    const va = Number(a[1]?.count ?? a[1]) || 0;
    const vb = Number(b[1]?.count ?? b[1]) || 0;
    return order === "asc" ? va - vb : vb - va;
  });

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
        y: Number(data?.[k]?.count ?? data?.[k]) || 0,
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
  const [byAssignedUser, setByAssignedUser] = useState({});

  const [detailPopup, setDetailPopup] = useState({
    open: false,
    title: "",
    records: [],
    loading: false,
  });
  const [detailPage, setDetailPage] = useState(1);
  const [detailTotalPages, setDetailTotalPages] = useState(1);
  const [detailFilter, setDetailFilter] = useState({
    countType: "",
    countValue: "",
  });

  /* refs for highcharts click handlers */
  const onFloorClickRef = useRef(null);
  const onBuildingClickRef = useRef(null);
  const onStatusClickRef = useRef(null);
  const onUnitClickRef = useRef(null);

  useSelector((state) => state.theme.color);

  const [statusType, setStatusType] = useState("column");
  const [buildingType, setBuildingType] = useState("line");
  const [floorType, setFloorType] = useState("area");
  const [unitType, setUnitType] = useState("column");

  /* ── fetch dashboard summary ── */
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const resp = await getServicesTaskList();
        const d = resp?.data || {};
        setByStatus(d.by_task_status || {});
        setByBuilding(d.by_building || {});
        setByFloor(d.by_floor || {});
        setByAssignedUser(d.by_assigned_user || {});
      } catch (e) {
        console.log("Error fetching soft service info:", e);
      }
    };
    fetchInfo();
  }, []);

  /* ── generic drill-down fetcher ── */
  const fetchDrillDetails = async (countType, countValue, page = 1) => {
    const label =
      countType.charAt(0).toUpperCase() + countType.slice(1);
    const title = `Soft Services – ${label}: ${countValue}`;

    setDetailPopup({ open: true, title, records: [], loading: true });
    setDetailFilter({ countType, countValue });
    setDetailPage(page);

    try {
      const res = await getSoftServicesDashboardDrill(
        countType,
        countValue,
        page,
      );
      const data = res?.data || {};

      /* resolve nested bucket e.g. data.by_floor["Ground Floor"] */
      const groupKey = COUNT_TYPE_TO_KEY[countType];
      const bucket =
        groupKey && data[groupKey]
          ? data[groupKey][countValue] ||
          data[groupKey][countValue?.toLowerCase()] ||
          {}
          : {};

      let records = [];

      if (Array.isArray(bucket?.records)) {
        records = bucket.records;
      } else if (Array.isArray(bucket)) {
        records = bucket;
      } else if (Array.isArray(data?.records)) {
        records = data.records;
      } const totalPages =
        Number(bucket.total_pages) ||
        (bucket.per_page > 0
          ? Math.max(1, Math.ceil((bucket.count || records.length) / bucket.per_page))
          : 1);

      setDetailTotalPages(totalPages);
      setDetailPage(Number(bucket.current_page) || page);
      setDetailPopup({ open: true, title, records, loading: false });
    } catch (err) {
      console.error("Soft service drill error:", err);
      toast.error("Failed to load task details");
      setDetailPopup((p) => ({ ...p, loading: false }));
    }
  };

  const handlePageChange = (nextPage) => {
    if (!detailFilter.countType || !detailFilter.countValue) return;
    if (nextPage < 1 || nextPage > detailTotalPages) return;
    fetchDrillDetails(detailFilter.countType, detailFilter.countValue, nextPage);
  };

  /* keep refs up to date every render */
  useEffect(() => {
    onFloorClickRef.current = (name) => fetchDrillDetails("floor", name, 1);
    onBuildingClickRef.current = (name) => fetchDrillDetails("building", name, 1);
    onStatusClickRef.current = (name) => fetchDrillDetails("task_status", name, 1);
    onUnitClickRef.current = (name) => fetchDrillDetails("assigned_user", name, 1);
  });

  /* ── download ── */
  const handleDownload = async () => {
    const toastId = toast.loading("Downloading Please Wait");
    try {
      const response = await getSoftServiceDownload();
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: response.headers["content-type"] }),
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

  const statusColors = {
    overdue: "#EF4444",
    complete: "#10B981",
    pending: "#F59E0B",
    inprogress: "#3B82F6",
    in_progress: "#3B82F6",
    open: "#6366F1",
  };

  const shouldColorByPoint = (type) => type === "column" || type === "bar";

  const calcTrendFromTotals = (obj) => {
    const total = Object.values(obj || {}).reduce(
      (s, v) => s + (Number(v?.count ?? v) || 0),
      0,
    );
    if (!Number.isFinite(total)) return { pct: null, dir: "down" };
    return { pct: 0, dir: "down" };
  };

  /* ── inject click handler into chart options ── */
  const withClickHandler = (options, handlerRef) => {
    const handler = function () {
      const name = this.name ?? this.category ?? String(this.x ?? "");
      if (!name) return;
      handlerRef.current?.(name);
    };
    return {
      ...options,
      plotOptions: {
        ...options.plotOptions,
        pie: {
          ...(options.plotOptions?.pie || {}),
          point: {
            events: { click: handler },
          },
        },
        series: {
          ...(options.plotOptions?.series || {}),
          point: {
            events: { click: handler },
          },
        },
      },
    };
  };

  /* ── chart options ── */
  const statusOptions = useMemo(() => {
    let options;
    if (statusType === "pie") {
      options = buildPieOptions({
        title: "Soft Services by Task Status",
        data: byStatus,
        colorsMap: statusColors,
        palette: CHART_PALETTE,
      });
    } else {
      const entries = toSortedEntries(byStatus, "desc");
      options = buildXYOptions({
        title: "Soft Services by Task Status",
        type: statusType,
        categories: entries.map(([k]) => k),
        values: entries.map(([, v]) => Number(v?.count ?? v) || 0),
        themeColor: CHART_PALETTE[0],
        colorByPoint: shouldColorByPoint(statusType),
        palette: CHART_PALETTE,
      });
    }
    return withClickHandler(options, onStatusClickRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [byStatus, statusType]);

  const buildingOptions = useMemo(() => {
    let options;
    if (buildingType === "pie") {
      options = buildPieOptions({
        title: "Soft Services by Building",
        data: byBuilding,
        palette: CHART_PALETTE,
      });
    } else {
      const entries = toSortedEntries(byBuilding, "desc");
      options = buildXYOptions({
        title: "Soft Services by Building",
        type: buildingType,
        categories: entries.map(([k]) => k),
        values: entries.map(([, v]) => Number(v?.count ?? v) || 0),
        themeColor: CHART_PALETTE[0],
        colorByPoint: shouldColorByPoint(buildingType),
        palette: CHART_PALETTE,
      });
    }
    return withClickHandler(options, onBuildingClickRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [byBuilding, buildingType]);

  const floorOptions = useMemo(() => {
    let options;
    if (floorType === "pie") {
      options = buildPieOptions({
        title: "Soft Services by Floor",
        data: byFloor,
        palette: CHART_PALETTE,
      });
    } else {
      const entries = toSortedEntries(byFloor, "desc");
      options = buildXYOptions({
        title: "Soft Services by Floor",
        type: floorType,
        categories: entries.map(([k]) => k),
        values: entries.map(([, v]) => Number(v?.count ?? v) || 0),
        themeColor: CHART_PALETTE[0],
        colorByPoint: shouldColorByPoint(floorType),
        palette: CHART_PALETTE,
      });
    }
    return withClickHandler(options, onFloorClickRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [byFloor, floorType]);

  const unitOptions = useMemo(() => {
    let options;
    if (unitType === "pie") {
      options = buildPieOptions({
        title: "Soft Services by Assigned User",
        data: byAssignedUser,
        palette: CHART_PALETTE,
      });
    } else {
      const entries = toSortedEntries(byAssignedUser, "desc");
      const limited = entries.length > 25 ? entries.slice(0, 25) : entries;
      options = buildXYOptions({
        title:
          entries.length > 25
            ? "Soft Services by Assigned User (Top 25)"
            : "Soft Services by Assigned User",
        type: unitType,
        categories: limited.map(([k]) => k),
        values: limited.map(([, v]) => Number(v?.count ?? v) || 0),
        themeColor: CHART_PALETTE[0],
        colorByPoint: shouldColorByPoint(unitType),
        palette: CHART_PALETTE,
      });
    }
    return withClickHandler(options, onUnitClickRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [byAssignedUser, unitType]);

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
          subtitle="By Task Status"
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
          subtitle="By Assigned User"
          footerText={
            Object.keys(byAssignedUser || {}).length > 25 ? "Showing top 25 users" : ""
          }
          footerDirection="down"
          onDownload={handleDownload}
          chartType={unitType}
          setChartType={setUnitType}
          includeBar={false}
        >
          {byAssignedUser && Object.keys(byAssignedUser).length ? (
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
        subtitle={`${detailPopup.records.length} record(s) · Page ${detailPage} of ${detailTotalPages}`}
        records={detailPopup.records}
        loading={detailPopup.loading}
        page={detailPage}
        totalPages={detailTotalPages}
        onPageChange={handlePageChange}
        columns={[
          {
            key: "service_name",
            label: "Service Name",
            accessor: (r) => r.soft_service_name ?? r.name ?? "—",
          },

          {
            key: "checklist_name",
            label: "Checklist",
            accessor: (r) => r.checklist_name ?? "—",
          },

          {
            key: "building_name",
            label: "Building",
            accessor: (r) =>
              r.building_name ??
              r.building ??
              r.site_building ??
              "—",
          },

          {
            key: "floor_name",
            label: "Floor",
            accessor: (r) =>
              r.floor_name ??
              r.floor ??
              r.level_name ??
              "—",
          },

          {
            key: "assigned_user",
            label: "Assigned To",
            accessor: (r) => r.assigned_name || "Unassigned",
          },

          {
            key: "status",
            label: "Status",
            accessor: (r) => {
              const status = r.status ?? "—";
              return (
                <span
                  className={
                    status === "overdue"
                      ? "text-red-600 font-semibold"
                      : status === "complete"
                        ? "text-green-600 font-semibold"
                        : status === "pending"
                          ? "text-yellow-600 font-semibold"
                          : "text-gray-600"
                  }
                >
                  {status}
                </span>
              );
            },
          },
        ]}
      />
    </div>
  );
};

export default SoftServiceHighCharts;
