import React, { useEffect, useMemo, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import toast from "react-hot-toast";
import { FaDownload, FaSpinner, FaChevronDown, FaFileExcel, FaFilePdf } from "react-icons/fa";
import {
  AiOutlineBarChart,
  AiOutlineLineChart,
  AiOutlineAreaChart,
} from "react-icons/ai";
import { RiPieChartFill } from "react-icons/ri";
import { FiBriefcase, FiBarChart2 } from "react-icons/fi";
import { TbUsers } from "react-icons/tb";
import { FaRegCalendar } from "react-icons/fa";

import {
  downloadAsset,
  getBreakdownDownload,
  getBreakCount,
  getInUseAssetBreakDown,
  getTotalAssetCount,
  getPPMOverDueCount,
  getPPMCompleteCount,
  getPPMScheduleCount,
  getScheduledDownload,
  getRoutineScheduledDownload,
  getRoutineScheduledCount,
  getRoutineOverdueCount,
  getRoutineCompleteCount,
  getAssetInDownload,
} from "../../api";

/** ---------------- UI Helpers ---------------- */
const CardShell = ({ children, className = "" }) => (
  <div
    className={[
      "bg-white rounded-2xl border border-gray-100",
      "shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
      className,
    ].join(" ")}
  >
    {children}
  </div>
);

const IconBadge = ({ tone = "blue", children }) => {
  const toneMap = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    red: "bg-rose-50 text-rose-700 border-rose-100",
    gray: "bg-gray-50 text-gray-700 border-gray-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
  };
  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "h-10 w-10 rounded-xl border",
        toneMap[tone] || toneMap.gray,
      ].join(" ")}
    >
      {children}
    </span>
  );
};

const StatCard = ({
  title,
  value,
  tone = "blue",
  icon,
  onDownload,
  downloading,
}) => {
  const toneChip =
    {
      blue: "bg-blue-50 text-blue-700",
      green: "bg-emerald-50 text-emerald-700",
      amber: "bg-amber-50 text-amber-700",
      red: "bg-rose-50 text-rose-700",
      gray: "bg-gray-50 text-gray-700",
      purple: "bg-purple-50 text-purple-700",
    }[tone] || "bg-gray-50 text-gray-700";

  return (
    <CardShell className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <IconBadge tone={tone}>{icon}</IconBadge>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 break-words">
              {title}
            </h3>
            <div className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900 leading-none break-words">
              {value ?? 0}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onDownload}
          disabled={downloading}
          className={[
            "h-9 w-9 rounded-xl grid place-items-center",
            "bg-gray-100 hover:bg-gray-200 transition",
            "text-gray-700 shrink-0 disabled:opacity-60",
            "focus:outline-none focus:ring-0",
          ].join(" ")}
          title="Download Excel"
        >
          {downloading ? (
            <FaSpinner className="animate-spin text-sm" />
          ) : (
            <FaDownload className="text-sm" />
          )}
        </button>
      </div>

      <div className="mt-3">
        <span
          className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${toneChip}`}
        >
          Count
        </span>
      </div>
    </CardShell>
  );
};

/** -------- screenshot-style header helpers -------- */
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

const chartTypeIcon = (type) => {
  switch (type) {
    case "pie":
      return <RiPieChartFill className="w-4 h-4" />;
    case "BarChart":
      return <AiOutlineBarChart className="w-4 h-4" />;
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
        <div className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-lg z-50 overflow-hidden">
          <button onClick={() => { onExcelDownload(); setOpen(false); }}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 font-medium flex items-center gap-2">
            <FaFileExcel className="text-green-600" /> Download Excel
          </button>
          <button onClick={() => { onChartDownload(); setOpen(false); }}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 font-medium flex items-center gap-2">
            <FaFilePdf className="text-red-500" /> Download Chart
          </button>
        </div>
      )}
    </div>
  );
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

  const items = ["pie", "column", "line", "area"];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-9 w-10 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 relative grid place-items-center"
        title="Change chart type"
      >
        {chartTypeIcon(value)}
        <FaChevronDown className="absolute right-1 bottom-1 text-[10px] opacity-70" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl border border-gray-200 bg-white shadow-lg z-20 overflow-hidden">
          {items.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                onChange(t);
                setOpen(false);
              }}
              className={[
                "w-full px-3 py-2 text-left flex items-center gap-2",
                "hover:bg-gray-50",
                value === t ? "bg-gray-50 font-semibold" : "",
              ].join(" ")}
            >
              <span className="text-gray-800">{chartTypeIcon(t)}</span>
              <span className="text-sm text-gray-700 capitalize">{t}</span>
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
  onExcelDownload,
  onChartDownload,
  chartRef,
  chartType,
  setChartType,
  options,
}) => {
  const footerArrow = footerDirection === "up" ? "↑" : "↓";
  const footerColor = footerDirection === "up" ? "text-red-600" : "text-emerald-700";

  return (
    <CardShell className="p-4 sm:p-5 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base sm:text-[18px] font-bold text-gray-900 break-words">{title}</p>
          {subtitle ? (
            <p className="text-sm text-gray-500 break-words mt-1">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <TrendPill percent={trendPercent} direction={trendDirection} />
          <ChartTypeMenu value={chartType} onChange={setChartType} />
          <DownloadMenu onExcelDownload={onExcelDownload} onChartDownload={onChartDownload} />
        </div>
      </div>
      <LegendRow items={legendItems} />
      <div className="mt-2 overflow-x-auto">
        <div ref={chartRef} className="min-w-[280px]">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </div>
      {footerText ? (
        <div className="mt-2 text-center text-sm">
          <span className={footerColor}>{footerArrow} {footerText}</span>
        </div>
      ) : null}
    </CardShell>
  );
};

/** ---------------- Highcharts option builders (screenshot style) ---------------- */
const baseNoSelect = {
  states: {
    inactive: { opacity: 1 },
    hover: { enabled: true },
    select: { enabled: false },
  },
};

const makeTwoValueOptions = ({
  type,
  aName,
  aVal,
  aColor,
  bName,
  bVal,
  bColor,
  seriesName = "Count",
}) => {
  const A = Number(aVal) || 0;
  const B = Number(bVal) || 0;

  // match screenshot-ish charts
  const hcType =
    type === "line" ? "spline" : type === "area" ? "areaspline" : type;

  const areaFill =
    type === "area"
      ? {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [
          [0, Highcharts.color(aColor).setOpacity(0.25).get("rgba")],
          [1, Highcharts.color(aColor).setOpacity(0).get("rgba")],
        ],
      }
      : undefined;

  const common = {
    chart: {
      type: hcType,
      backgroundColor: "transparent",
      height: window.innerWidth < 640 ? 250 : 280,
      spacing: [8, 8, 8, 8],
    },
    title: { text: null },
    credits: { enabled: false },
    exporting: { enabled: false },
    legend: { enabled: false },
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
              lineColor: aColor,
              fillColor: "#FFFFFF",
            }
            : { enabled: false },
      },
      pie: {
        ...baseNoSelect,
        allowPointSelect: false,
        dataLabels: {
          enabled: window.innerWidth >= 480,
          format: "<b>{point.name}</b>: {point.y}",
          style: { fontSize: window.innerWidth < 640 ? "10px" : "12px", textOutline: "none" },
        },
      },
      column: {
        borderRadius: 10,
        pointPadding: 0.12,
        groupPadding: 0.22,
      },
    },
  };

  // Pie
  if (type === "pie") {
    return {
      ...common,
      tooltip: {
        backgroundColor: "#FFFFFF",
        borderColor: "#E5E7EB",
        borderRadius: 10,
        shadow: false,
        pointFormat: "{point.name}: <b>{point.y}</b>",
      },
      series: [
        {
          name: seriesName,
          colorByPoint: true,
          data: [
            { name: aName, y: A, color: aColor },
            { name: bName, y: B, color: bColor },
          ],
        },
      ],
    };
  }

  // Column / Line / Area (2 categories)
  return {
    ...common,
    xAxis: {
      categories: [aName, bName],
      lineColor: "#E5E7EB",
      tickColor: "#E5E7EB",
      labels: { style: { color: "#6B7280", fontSize: window.innerWidth < 640 ? "10px" : "12px" } },
      title: { text: null },
    },
    yAxis: {
      min: 0,
      title: { text: null },
      gridLineColor: "#E5E7EB",
      gridLineDashStyle: "Dash",
      labels: { style: { color: "#6B7280", fontSize: window.innerWidth < 640 ? "10px" : "12px" } },
    },
    series: [
      {
        name: seriesName,
        color: aColor,
        // per-point colors matter for column
        colorByPoint: type === "column",
        data: [
          { y: A, color: aColor },
          { y: B, color: bColor },
        ],
        fillColor: areaFill,
      },
    ],
  };
};

/** ---------------- Main Component ---------------- */
function ComplianceDashboard() {
  const [breakCount, setBreakCount] = useState(0);
  const [inUseCount, setInUseCount] = useState(0);
  const [totalAssetCount, setTotalAssetCount] = useState(0);

  const [ppmSchedule, setPPMSchedule] = useState(0);
  const [ppmOverDue, setPPMOverDue] = useState(0);
  const [ppmComplete, setPPMComplete] = useState(0);

  const [routineScheduleCount, setRoutineScheduleCount] = useState(0);
  const [routineOverdueCount, setRoutineOverdueCount] = useState(0);
  const [routineCompleteCount, setRoutineCompleteCount] = useState(0);

  // chart types
  const [assetChartType, setAssetChartType] = useState("pie");
  const [ppmChartType, setPPMChartType] = useState("pie");
  const [routineChartType, setRoutineChartType] = useState("pie");

  const assetChartRef = useRef(null);
  const ppmChartRef = useRef(null);
  const routineChartRef = useRef(null);

  const downloadSingleChartPdf = async (ref, fileName) => {
    const toastId = toast.loading("Generating chart PDF...");
    try {
      if (!ref?.current) { toast.error("Chart not found"); return; }
      const canvas = await html2canvas(ref.current, { scale: 2, useCORS: true });
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

  // optional loading flags per card
  const [dl, setDl] = useState({
    total: false,
    breakdown: false,
    scheduled: false,
    inuse: false,
    routine: false,
  });

  /** ---------------- Downloads ---------------- */
  const blobDownload = async (fetcher, filename, key) => {
    const toastId = toast.loading("Downloading Please Wait");
    try {
      setDl((p) => ({ ...p, [key]: true }));
      const response = await fetcher();
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: response.headers?.["content-type"] })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss(toastId);
      toast.success("Downloaded successfully");
    } catch (error) {
      toast.dismiss(toastId);
      console.error(error);
      toast.error("Something went wrong, please try again");
    } finally {
      setDl((p) => ({ ...p, [key]: false }));
    }
  };

  const handleTotalAssetDownload = () =>
    blobDownload(downloadAsset, "Total_Asset_file.xlsx", "total");

  const handleTotalBreakdownDownload = () =>
    blobDownload(getBreakdownDownload, "BreakDown_file.xlsx", "breakdown");

  const handleScheduledDownload = () =>
    blobDownload(getScheduledDownload, "scheduled_file.xlsx", "scheduled");

  const assetInUseDownload = () =>
    blobDownload(getAssetInDownload, "inUse_file.xlsx", "inuse");

  const handleRoutineScheduledDownload = () =>
    blobDownload(
      getRoutineScheduledDownload,
      "routine_scheduled_file.xlsx",
      "routine"
    );

  /** ---------------- Fetch counts ---------------- */
  useEffect(() => {
    const run = async () => {
      try {
        const [
          totalAsset,
          breakC,
          inUse,
          ppmSch,
          ppmOver,
          ppmComp,
          rSch,
          rOver,
          rComp,
        ] = await Promise.all([
          getTotalAssetCount([]),
          getBreakCount([]),
          getInUseAssetBreakDown([]),
          getPPMScheduleCount([]),
          getPPMOverDueCount([]),
          getPPMCompleteCount([]),
          getRoutineScheduledCount([]),
          getRoutineOverdueCount([]),
          getRoutineCompleteCount([]),
        ]);

        setTotalAssetCount(totalAsset?.data?.count ?? 0);
        setBreakCount(breakC?.data?.count ?? 0);
        setInUseCount(inUse?.data?.count ?? 0);

        setPPMSchedule(ppmSch?.data?.count ?? 0);
        setPPMOverDue(ppmOver?.data?.count ?? 0);
        setPPMComplete(ppmComp?.data?.count ?? 0);

        setRoutineScheduleCount(rSch?.data?.count ?? 0);
        setRoutineOverdueCount(rOver?.data?.count ?? 0);
        setRoutineCompleteCount(rComp?.data?.count ?? 0);
      } catch (e) {
        console.log(e);
      }
    };
    run();
  }, []);

  /** ---------------- Chart options ---------------- */
  const optionsTotalCompliance = useMemo(
    () =>
      makeTwoValueOptions({
        type: assetChartType,
        aName: "In Use",
        aVal: inUseCount,
        aColor: "#1D4ED8",
        bName: "Breakdown",
        bVal: breakCount,
        bColor: "#93C5FD",
        seriesName: "Compliance",
      }),
    [assetChartType, inUseCount, breakCount]
  );

  const optionsTotalPPM = useMemo(
    () =>
      makeTwoValueOptions({
        type: ppmChartType,
        aName: "PPM Overdue",
        aVal: ppmOverDue,
        aColor: "#1D4ED8",
        bName: "PPM Complete",
        bVal: ppmComplete,
        bColor: "#93C5FD",
        seriesName: "PPM",
      }),
    [ppmChartType, ppmOverDue, ppmComplete]
  );

  const optionsRoutine = useMemo(
    () =>
      makeTwoValueOptions({
        type: routineChartType,
        aName: "Routine Overdue",
        aVal: routineOverdueCount,
        aColor: "#1D4ED8",
        bName: "Routine Complete",
        bVal: routineCompleteCount,
        bColor: "#93C5FD",
        seriesName: "Routine",
      }),
    [routineChartType, routineOverdueCount, routineCompleteCount]
  );

  /** ---------------- Top Stat cards ---------------- */
  const topCards = [
    {
      title: "Total Open Compliance",
      value: totalAssetCount,
      tone: "blue",
      icon: <FiBriefcase className="w-4 h-4" />,
      onDownload: handleTotalAssetDownload,
      downloading: dl.total,
    },
    {
      title: "In-Progress",
      value: breakCount,
      tone: "red",
      icon: <FiBarChart2 className="w-4 h-4" />,
      onDownload: handleTotalBreakdownDownload,
      downloading: dl.breakdown,
    },
    {
      title: "Completed",
      value: ppmSchedule,
      tone: "green",
      icon: <FaRegCalendar className="w-4 h-4" />,
      onDownload: handleScheduledDownload,
      downloading: dl.scheduled,
    },
    {
      title: "Cancelled",
      value: inUseCount,
      tone: "purple",
      icon: <TbUsers className="w-4 h-4" />,
      onDownload: assetInUseDownload,
      downloading: dl.inuse,
    },
  ];

  return (
    <div className="w-full overflow-x-hidden flex flex-col px-2 sm:px-3">
      {/* ✅ TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topCards.map((c) => (
          <StatCard key={c.title} {...c} />
        ))}
      </div>

      {/* ✅ CHARTS (same screenshot UI) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
        <ChartCard
          title="Total Compliance"
          trendPercent={20.7}
          trendDirection="down"
          footerDirection="down"
          onExcelDownload={handleTotalAssetDownload}
          onChartDownload={() => downloadSingleChartPdf(assetChartRef, "Total_Compliance_Chart")}
          chartRef={assetChartRef}
          chartType={assetChartType}
          setChartType={setAssetChartType}
          options={optionsTotalCompliance}
        />

        <ChartCard
          title="Total PPM"
          trendPercent={21.7}
          trendDirection="down"
          footerDirection="down"
          onExcelDownload={handleScheduledDownload}
          onChartDownload={() => downloadSingleChartPdf(ppmChartRef, "Total_PPM_Chart")}
          chartRef={ppmChartRef}
          chartType={ppmChartType}
          setChartType={setPPMChartType}
          options={optionsTotalPPM}
        />

        <ChartCard
          title="Total Routine Task"
          trendPercent={10.2}
          trendDirection="up"
          footerDirection="up"
          onExcelDownload={handleRoutineScheduledDownload}
          onChartDownload={() => downloadSingleChartPdf(routineChartRef, "Total_Routine_Chart")}
          chartRef={routineChartRef}
          chartType={routineChartType}
          setChartType={setRoutineChartType}
          options={optionsRoutine}
        />
      </div>
    </div>
  );
}

export default ComplianceDashboard;
