import React, { useEffect, useMemo, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getTicketDashboard, getTicketStatusDownload } from "../api";
import { useSelector } from "react-redux";
import { DNA } from "react-loader-spinner";
import { FaDownload, FaChevronDown } from "react-icons/fa";
import toast from "react-hot-toast";
import { RiPieChartFill } from "react-icons/ri";
import {
  AiOutlineAreaChart,
  AiOutlineBarChart,
  AiOutlineLineChart,
} from "react-icons/ai";
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

/** Highlight color you wanted earlier */
const HIGHLIGHT_LIGHT = "#93C5FD";

const chartIcon = (type) => {
  switch (type) {
    case "pie":
      return <RiPieChartFill />;
    case "bar":
      return <PiChartBarHorizontal />;
    case "column":
      return <AiOutlineBarChart />;
    case "line":
      return <AiOutlineLineChart />;
    case "area":
      return <AiOutlineAreaChart />;
    default:
      return <RiPieChartFill />;
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
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: it.color }}
          />
          <span className="text-gray-800 font-semibold">
            {it.label}:{" "}
            <span className="font-semibold text-gray-900">
              {it.value}
              {it.unit ? ` ${it.unit}` : ""}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
};

const ChartTypeMenu = ({ value, onChange, allowBar = false }) => {
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
    ...(allowBar ? [{ key: "bar", label: "Bar" }] : []),
    { key: "column", label: "Column" },
    { key: "line", label: "Line" },
    { key: "area", label: "Area" },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="h-9 w-10 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 relative grid place-items-center"
        title="Change chart type"
      >
        <span className="text-base">{chartIcon(value)}</span>
        <FaChevronDown className="absolute right-1 bottom-1 text-[10px] opacity-70" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl border border-gray-200 bg-white shadow-lg z-20 overflow-hidden">
          {items.map((it) => (
            <button
              key={it.key}
              type="button"
              onClick={() => {
                onChange(it.key);
                setOpen(false);
              }}
              className={[
                "w-full px-3 py-2 text-sm flex items-center gap-2",
                "hover:bg-gray-50",
                value === it.key ? "bg-gray-50 font-semibold" : "",
              ].join(" ")}
            >
              <span className="text-base">{chartIcon(it.key)}</span>
              <span>{it.label}</span>
            </button>
          ))}
        </div>
      )}
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
  allowBar,
  downloading,
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
            allowBar={allowBar}
          />

          <button
            type="button"
            onClick={onDownload}
            className="h-9 w-10 grid place-items-center rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
            title={downloading ? "Downloading..." : "Download"}
          >
            <FaDownload className="text-sm" />
          </button>
        </div>
      </div>

      <LegendRow items={legendItems} />

      <div className="mt-2">{children}</div>

      {footerText ? (
        <ndiv className="mt-2 text-center text-sm">
          <span className={footerColor}>
            {footerArrow} {footerText}
          </span>
        </ndiv>
      ) : null}
    </div>
  );
};

/** -------------------- chart option builder -------------------- */
const safeObj = (v) => (v && typeof v === "object" ? v : {});

const sortEntries = (data, order = "descending") => {
  const obj = safeObj(data);
  return Object.entries(obj)
    .map(([k, v]) => [k, Number(v) || 0])
    .sort((a, b) =>
      order === "descending" ? b[1] - a[1] : a[1] - b[1]
    );
};

const normLabel = (v) => String(v ?? "").trim().toLowerCase();

const buildOptions = ({
  title,
  data,
  type,
  themeColor,
  order = "descending",
  showDataLabels = true,
  pieLabel = "{point.name}: {point.percentage:.1f}%",
  yTitle = null,
  palette = CHART_PALETTE,
  pointColorFn, // optional override per label
}) => {
  const entries = sortEntries(data, order);
  const categories = entries.map(([k]) => k);
  const values = entries.map(([, v]) => v);

  const isPie = type === "pie";
  const hcType =
    type === "line" ? "spline" : type === "area" ? "areaspline" : type;

  const isBarOrColumn = type === "bar" || type === "column";

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

  const seriesData = isPie
    ? categories.map((name, i) => ({
        name,
        y: values[i],
        color: pointColorFn
          ? pointColorFn(name, i, values[i])
          : palette[i % palette.length],
      }))
    : isBarOrColumn
    ? categories.map((name, i) => ({
        y: values[i],
        color: pointColorFn
          ? pointColorFn(name, i, values[i])
          : palette[i % palette.length],
      }))
    : values;

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

    xAxis: isPie
      ? undefined
      : {
          categories,
          lineColor: "#E5E7EB",
          tickColor: "#E5E7EB",
          labels: { style: { color: "#6B7280", fontSize: "12px" } },
          title: { text: null },
        },
    yAxis: isPie
      ? undefined
      : {
          min: 0,
          title: { text: yTitle },
          gridLineColor: "#E5E7EB",
          gridLineDashStyle: "Dash",
          labels: { style: { color: "#6B7280", fontSize: "12px" } },
        },

    tooltip: isPie
      ? {
          backgroundColor: "#FFFFFF",
          borderColor: "#E5E7EB",
          borderRadius: 10,
          shadow: false,
          pointFormat: "<b>{point.y}</b> ({point.percentage:.1f}%)",
        }
      : {
          backgroundColor: "#FFFFFF",
          borderColor: "#E5E7EB",
          borderRadius: 10,
          shadow: false,
          pointFormat: "<b>{point.y}</b>",
        },

    plotOptions: {
      pie: {
        allowPointSelect: false,
        cursor: "pointer",
        dataLabels: { enabled: showDataLabels, format: pieLabel },
      },

      column: {
        borderRadius: 10,
        pointPadding: 0.12,
        groupPadding: 0.22,
        dataLabels: {
          enabled: showDataLabels,
          formatter: function () {
            return `${this.y}`;
          },
          style: { textOutline: "none", fontSize: "10px" },
        },
      },

      bar: {
        dataLabels: {
          enabled: showDataLabels,
          formatter: function () {
            return `${this.y}`;
          },
          style: { textOutline: "none", fontSize: "10px" },
        },
      },

      series: {
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
    },

    series: [
      isPie
        ? { name: title, colorByPoint: true, data: seriesData }
        : {
            name: title,
            color: seriesColor, // for line/area (and fallback)
            data: seriesData,
            fillColor: areaFill,
          },
    ],
  };
};

const TicketHighCharts = () => {
  useSelector((state) => state.theme.color);

  // ✅ Each chart gets a different base color (for line/area)
  const chartTheme = {
    status: CHART_PALETTE[0],
    category: CHART_PALETTE[2],
    type: CHART_PALETTE[4],
    floor: CHART_PALETTE[6],
    unit: CHART_PALETTE[8],
  };

  const [statusData, setStatusData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [ticketTypes, setTicketTypes] = useState(null);
  const [floorTickets, setFloorTickets] = useState(null);
  const [unitTickets, setUnitTickets] = useState(null);

  const [statusChartType, setStatusChartType] = useState("pie");
  const [categoryChartType, setCategoryChartType] = useState("bar");
  const [ticketTypeChartType, setTicketTypeChartType] = useState("column");
  const [floorChartType, setFloorChartType] = useState("column");
  const [unitChartType, setUnitChartType] = useState("column");

  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchTicketInfo = async () => {
      try {
        const resp = await getTicketDashboard();
        setStatusData(resp?.data?.by_status || {});
        setCategoryData(resp?.data?.by_category || {});
        setTicketTypes(resp?.data?.by_type || {});
        setFloorTickets(resp?.data?.by_floor || {});
        setUnitTickets(resp?.data?.by_unit || {});
      } catch (error) {
        console.log("Error fetching ticket info:", error);
      }
    };

    fetchTicketInfo();
  }, []);

  const handleTicketStatusDownload = async () => {
    const toastId = toast.loading("Downloading Please Wait...");
    setDownloading(true);
    try {
      const response = await getTicketStatusDownload();
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: response.headers["content-type"] })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ticket_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss(toastId);
      toast.success("Ticket downloaded successfully");
    } catch (error) {
      toast.dismiss(toastId);
      console.error("Error downloading Ticket:", error);
      toast.error("Something went wrong, please try again");
    } finally {
      setDownloading(false);
    }
  };

  /** ✅ Special color rules (with multi-color default) */
  const categoryPointColor = (name, i) =>
    normLabel(name) === normLabel("Housekeeping")
      ? HIGHLIGHT_LIGHT
      : CHART_PALETTE[i % CHART_PALETTE.length];

  const typePointColor = (name, i) =>
    normLabel(name) === normLabel("Suggestion")
      ? HIGHLIGHT_LIGHT
      : CHART_PALETTE[i % CHART_PALETTE.length];

  const floorPointColor = (name, i) =>
    normLabel(name) === normLabel("2")
      ? HIGHLIGHT_LIGHT
      : CHART_PALETTE[i % CHART_PALETTE.length];

  const unitPointColor = (name, i) =>
    normLabel(name) === normLabel("VibeConnect")
      ? HIGHLIGHT_LIGHT
      : CHART_PALETTE[i % CHART_PALETTE.length];

  // ✅ Status colors can be meaningful
  const statusPointColor = (name, i) => {
    const k = normLabel(name);
    if (k === "overdue") return "#EF4444";
    if (k === "complete") return "#10B981";
    if (k === "pending") return "#F59E0B";
    if (k === "open") return "#3B82F6";
    if (k === "inprogress" || k === "in_progress") return "#6366F1";
    return CHART_PALETTE[i % CHART_PALETTE.length];
  };

  // options (memo)
  const statusOptions = useMemo(
    () =>
      buildOptions({
        title: "Tickets by Status",
        data: statusData,
        type: statusChartType,
        themeColor: chartTheme.status,
        palette: CHART_PALETTE,
        order: "descending",
        pointColorFn: statusPointColor, // ✅ multi-color
      }),
    [statusData, statusChartType]
  );

  const categoryOptions = useMemo(
    () =>
      buildOptions({
        title: "Tickets by Category",
        data: categoryData,
        type: categoryChartType,
        themeColor: chartTheme.category,
        palette: CHART_PALETTE,
        order: "descending",
        pointColorFn: categoryPointColor, // ✅ multi-color + highlight
      }),
    [categoryData, categoryChartType]
  );

  const typeOptions = useMemo(
    () =>
      buildOptions({
        title: "Tickets by Type",
        data: ticketTypes,
        type: ticketTypeChartType,
        themeColor: chartTheme.type,
        palette: CHART_PALETTE,
        order: "descending",
        pointColorFn: typePointColor, // ✅ multi-color + highlight
      }),
    [ticketTypes, ticketTypeChartType]
  );

  const floorOptions = useMemo(
    () =>
      buildOptions({
        title: "Tickets by Floor",
        data: floorTickets,
        type: floorChartType,
        themeColor: chartTheme.floor,
        palette: CHART_PALETTE,
        order: "descending",
        pointColorFn: floorPointColor, // ✅ multi-color + highlight
      }),
    [floorTickets, floorChartType]
  );

  const unitOptions = useMemo(
    () =>
      buildOptions({
        title: "Tickets by Unit",
        data: unitTickets,
        type: unitChartType,
        themeColor: chartTheme.unit,
        palette: CHART_PALETTE,
        order: "descending",
        pointColorFn: unitPointColor, // ✅ multi-color + highlight
      }),
    [unitTickets, unitChartType]
  );

  const Loader = () => (
    <div className="flex justify-center items-center py-12">
      <DNA visible={true} height="120" width="120" ariaLabel="dna-loading" />
    </div>
  );

  /** ✅ Legend colors match chart colors (top-2 of sorted order) */
  const legendTopTwo = (obj, colorFn) => {
    const entries = sortEntries(obj, "descending").slice(0, 2);
    return entries.map(([label, value], idx) => ({
      label,
      value,
      color: colorFn ? colorFn(label, idx, value) : CHART_PALETTE[idx],
    }));
    // Note: idx here is rank, not original index; good enough for legend dots.
  };

  return (
    <div className="w-full px-3">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Tickets by Status"
          // subtitle="Overview of ticket lifecycle"
          trendPercent={null}
          trendDirection="down"
          // legendItems={legendTopTwo(statusData, statusPointColor)}
          onDownload={handleTicketStatusDownload}
          chartType={statusChartType}
          setChartType={setStatusChartType}
          allowBar={true}
          downloading={downloading}
        >
          {statusData ? (
            <HighchartsReact highcharts={Highcharts} options={statusOptions} />
          ) : (
            <Loader />
          )}
        </ChartCard>

        <ChartCard
          title="Tickets by Category"
          // subtitle="Where tickets are coming from"
          // legendItems={legendTopTwo(categoryData, categoryPointColor)}
          onDownload={handleTicketStatusDownload}
          chartType={categoryChartType}
          setChartType={setCategoryChartType}
          allowBar={true}
          downloading={downloading}
        >
          {categoryData ? (
            <HighchartsReact highcharts={Highcharts} options={categoryOptions} />
          ) : (
            <Loader />
          )}
        </ChartCard>

        <ChartCard
          title="Tickets by Type"
          // subtitle="Distribution by ticket type"
          // legendItems={legendTopTwo(ticketTypes, typePointColor)}
          onDownload={handleTicketStatusDownload}
          chartType={ticketTypeChartType}
          setChartType={setTicketTypeChartType}
          allowBar={true}
          downloading={downloading}
        >
          {ticketTypes ? (
            <HighchartsReact highcharts={Highcharts} options={typeOptions} />
          ) : (
            <Loader />
          )}
        </ChartCard>

        <ChartCard
          title="Tickets by Floor"
          // subtitle="Floor-wise ticket count"
          // legendItems={legendTopTwo(floorTickets, floorPointColor)}
          onDownload={handleTicketStatusDownload}
          chartType={floorChartType}
          setChartType={setFloorChartType}
          allowBar={true}
          downloading={downloading}
        >
          {floorTickets ? (
            <HighchartsReact highcharts={Highcharts} options={floorOptions} />
          ) : (
            <Loader />
          )}
        </ChartCard>

        <div className="lg:col-span-2">
          <ChartCard
            title="Tickets by Unit"
            // subtitle="Unit-wise ticket count"
            // legendItems={legendTopTwo(unitTickets, unitPointColor)}
            onDownload={handleTicketStatusDownload}
            chartType={unitChartType}
            setChartType={setUnitChartType}
            allowBar={true}
            downloading={downloading}
          >
            {unitTickets ? (
              <HighchartsReact highcharts={Highcharts} options={unitOptions} />
            ) : (
              <Loader />
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default TicketHighCharts;
