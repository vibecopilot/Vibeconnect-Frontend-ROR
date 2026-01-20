import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Wind,
  Cloud,
  Leaf,
  Atom,
  Droplet,
  Zap,
  Settings,
  Activity,
  Users,
  Car,
  User,
  TrendingUp,
  TrendingDown,
  ChevronDown,
} from "lucide-react";
import { FaDownload } from "react-icons/fa";
import { RiPieChartFill } from "react-icons/ri";
import {
  AiOutlineBarChart,
  AiOutlineLineChart,
  AiOutlineAreaChart,
} from "react-icons/ai";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const downloadApi = {
  ebPowerUtilization: async () => {
    throw new Error("Wire EB Power Utilization download API");
  },
  waterConsumption: async () => {
    throw new Error("Wire Water Consumption download API");
  },
  dgPowerUtilization: async () => {
    throw new Error("Wire DG Power Utilization download API");
  },
  airQualityIndex: async () => {
    throw new Error("Wire Air Quality Index download API");
  },
  ebPowerUsage: async () => {
    throw new Error("Wire EB Power Usage download API");
  },
  waterConsumptionAnalytics: async () => {
    throw new Error("Wire Water Consumption (Analytics) download API");
  },
};

const saveBlobAsFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const downloadExcel = async (fetcher, filename) => {
  const toastId = toast.loading("Downloading...");
  try {
    const res = await fetcher();
    const blob = res?.data instanceof Blob ? res.data : new Blob([res?.data]);
    saveBlobAsFile(blob, filename);
    toast.dismiss(toastId);
    toast.success("Downloaded");
  } catch (e) {
    toast.dismiss(toastId);
    toast.error(e?.message || "Download failed");
  }
};

const Card = ({ className = "", children }) => (
  <div
    className={`bg-white rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.06)] border border-gray-100 ${className}`}
  >
    {children}
  </div>
);

const SectionTitle = ({ icon, title, subtitle, right }) => (
  <div className="flex items-start justify-between gap-3">
    <div className="flex items-start gap-3 flex-1 min-w-0">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 border border-gray-100 flex-shrink-0">
        {icon}
      </div>

      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-gray-900 truncate">{title}</h2>
        {subtitle ? (
          <p className="text-sm text-gray-500 truncate">{subtitle}</p>
        ) : null}
      </div>
    </div>

    {right ? <div className="flex-shrink-0">{right}</div> : null}
  </div>
);

const TrendPill = ({ value, direction = "down", tone = "good" }) => {
  const isGood = tone === "good";
  const pillBase = isGood
    ? "bg-green-50 text-green-700 border-green-100"
    : "bg-red-50 text-red-700 border-red-100";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${pillBase}`}
    >
      {direction === "down" ? (
        <TrendingDown className="w-4 h-4" />
      ) : (
        <TrendingUp className="w-4 h-4" />
      )}
      {value}%
    </span>
  );
};

const Segmented = ({ value, onChange, options }) => (
  <div className="bg-gray-100 rounded-full p-1 flex items-center gap-1">
    {options.map((opt) => {
      const active = opt === value;
      return (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
            active
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {opt}
        </button>
      );
    })}
  </div>
);

const tileWrapperClass =
  "transition-all duration-200 rounded-2xl hover:-translate-y-[1px] hover:shadow-[0_10px_20px_rgba(15,23,42,0.10)] active:scale-[0.995]";

const TONES = {
  green: { bg: "bg-green-50", text: "text-green-600" },
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  sky: { bg: "bg-sky-50", text: "text-sky-600" },
  orange: { bg: "bg-orange-50", text: "text-orange-600" },
  yellow: { bg: "bg-yellow-50", text: "text-yellow-600" },
  red: { bg: "bg-red-50", text: "text-red-600" },
};

function MetricTile({ label, value, unit, icon, tone = "blue" }) {
  const t = TONES[tone] || TONES.blue;

  return (
    <div className={`rounded-xl border border-gray-100 shadow-sm p-4 ${t.bg}`}>
      <div className="flex items-start justify-between gap-3">
        <p className={`text-sm font-medium ${t.text} truncate`}>{label}</p>
        <div className="flex-shrink-0">{icon}</div>
      </div>

      <div className="mt-3 flex items-end gap-2">
        <span className="text-2xl font-bold text-gray-900 leading-none">
          {value}
        </span>
        {unit ? (
          <span className="text-xs text-gray-500 mb-[2px] whitespace-nowrap">
            {unit}
          </span>
        ) : null}
      </div>
    </div>
  );
}

const EbTile = ({ name, daily, cumulative }) => (
  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
    <div className="flex items-start justify-between">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-blue-600 truncate">{name}</p>
        <p className="text-xs text-gray-500 mt-2">Daily</p>
        <p className="text-2xl font-bold text-gray-900">
          {daily} <span className="text-sm font-normal text-gray-400">kWh</span>
        </p>
      </div>

      <div className="text-right flex-shrink-0">
        <Zap className="w-5 h-5 text-yellow-500 ml-auto" />
        <p className="text-xs text-gray-500 mt-4">Cumulative</p>
        <p className="text-2xl font-bold text-gray-900">
          {cumulative}{" "}
          <span className="text-sm font-normal text-gray-400">kWh</span>
        </p>
      </div>
    </div>
  </div>
);

const WaveProgress = ({ percent }) => (
  <div className="flex-1 h-3 rounded-full bg-gray-200 overflow-hidden relative">
    <motion.div
      className="absolute left-0 top-0 h-full bg-blue-500 rounded-full"
      style={{ width: `${percent}%` }}
      animate={{ width: `${percent}%` }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />
  </div>
);

const WaterRow = ({ name, daily, cumulative, total, percent }) => (
  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-semibold text-gray-900 truncate">{name}</span>

      <div className="flex items-center gap-3 text-xs text-gray-500 whitespace-nowrap">
        <span>
          Daily:{" "}
          <span className="text-blue-600 font-semibold">
            {daily} <span className="text-blue-600">KL</span>
          </span>
        </span>
        <span>
          Cum:{" "}
          <span className="text-blue-600 font-semibold">
            {cumulative} <span className="text-blue-600">KL</span>
          </span>
        </span>
      </div>
    </div>

    <div className="mt-3 flex items-center gap-3">
      <WaveProgress percent={percent} />
      <span className="min-w-[40px] text-right text-sm font-semibold text-gray-900">
        {total}
      </span>
    </div>
  </div>
);

const DgRow = ({ name, daily, cumulative }) => (
  <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 flex items-center justify-between">
    <div className="flex items-center gap-3 min-w-0">
      <Settings className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <span className="text-sm font-medium text-gray-900 truncate">{name}</span>
    </div>

    <div className="grid grid-cols-2 gap-6 items-center flex-shrink-0">
      <div className="text-right">
        <p className="text-xs text-gray-500">Daily</p>
        <p className="text-sm font-semibold text-gray-900">
          {daily} <span className="text-gray-400 font-medium">kWh</span>
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-500">Cumulative</p>
        <p className="text-sm font-semibold text-gray-900">
          {cumulative} <span className="text-gray-400 font-medium">kWh</span>
        </p>
      </div>
    </div>
  </div>
);

const FacilityTile = ({ label, value, unit, icon, iconBg = "bg-gray-50" }) => (
  <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-5">
    <div className="flex items-start justify-between gap-3">
      <p className="text-sm text-gray-600 truncate">{label}</p>
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg} flex-shrink-0`}
      >
        {icon}
      </div>
    </div>
    <div className="mt-8 flex items-baseline gap-2">
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      {unit ? <span className="text-sm text-gray-500">{unit}</span> : null}
    </div>
  </div>
);

const chartTypes = ["pie", "column", "line", "area"];

const chartTypeIcon = (type) => {
  switch (type) {
    case "pie":
      return <RiPieChartFill className="w-4 h-4" />;
    case "column":
      return <AiOutlineBarChart className="w-4 h-4" />;
    case "line":
      return <AiOutlineLineChart className="w-4 h-4" />;
    case "area":
      return <AiOutlineAreaChart className="w-4 h-4" />;
    default:
      return null;
  }
};

const ChartControls = ({
  chartType,
  setChartType,
  onDownload,
  showChartType = true,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {showChartType ? (
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="h-9 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition flex items-center gap-2 text-gray-800"
            title="Change chart type"
          >
            <span className="grid place-items-center">{chartTypeIcon(chartType)}</span>
            <ChevronDown className="w-4 h-4 opacity-70" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
              {chartTypes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setChartType(t);
                    setOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-gray-50 ${
                    chartType === t ? "bg-gray-50" : ""
                  }`}
                >
                  <span className="text-gray-800">{chartTypeIcon(t)}</span>
                  <span className="text-sm text-gray-700 capitalize">{t}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}

      <button
        type="button"
        onClick={onDownload}
        className="h-9 w-9 rounded-xl bg-gray-100 hover:bg-gray-200 transition grid place-items-center text-gray-800"
        title="Download Excel"
      >
        <FaDownload className="text-sm" />
      </button>
    </div>
  );
};

const ANALYTICS = {
  Day: {
    compareText: "Compare today vs yesterday",
    labelA: "Today",
    labelB: "Yesterday",
    air: {
      pill: { value: "15.0", direction: "down", tone: "good" },
      legendA: 51,
      legendB: 60,
      footer: "↓ Improved air quality",
      data: [
        { x: "6AM", a: 34, b: 65 },
        { x: "9AM", a: 62, b: 45 },
        { x: "12PM", a: 38, b: 80 },
        { x: "3PM", a: 64, b: 42 },
        { x: "6PM", a: 36, b: 70 },
        { x: "9PM", a: 72, b: 64 },
      ],
      xKey: "x",
    },
    power: {
      pill: { value: "10.2", direction: "up", tone: "bad" },
      legendA: "466 kWh",
      legendB: "423 kWh",
      footer: "↑ Higher power usage detected",
      data: [
        { x: "6AM", a: 400, b: 300 },
        { x: "9AM", a: 280, b: 650 },
        { x: "12PM", a: 460, b: 280 },
        { x: "3PM", a: 480, b: 380 },
        { x: "6PM", a: 700, b: 650 },
        { x: "9PM", a: 500, b: 300 },
      ],
      xKey: "x",
    },
    water: {
      pill: { value: "4.1", direction: "up", tone: "bad" },
      legendA: "1132 L",
      legendB: "1087 L",
      footer: "↑ Increased water consumption",
      data: [
        { x: "6AM", a: 1200, b: 1250 },
        { x: "9AM", a: 1050, b: 1350 },
        { x: "12PM", a: 1250, b: 1100 },
        { x: "3PM", a: 1300, b: 1120 },
        { x: "6PM", a: 1450, b: 1120 },
        { x: "9PM", a: 600, b: 900 },
      ],
      xKey: "x",
    },
  },
  Week: {
    compareText: "Compare this week vs last week",
    labelA: "This Week",
    labelB: "Last Week",
    air: {
      pill: { value: "20.7", direction: "down", tone: "good" },
      legendA: 46,
      legendB: 58,
      footer: "↓ Improved air quality",
      data: [
        { x: "Mon", a: 32, b: 35 },
        { x: "Tue", a: 36, b: 78 },
        { x: "Wed", a: 34, b: 60 },
        { x: "Thu", a: 50, b: 76 },
        { x: "Fri", a: 52, b: 38 },
        { x: "Sat", a: 44, b: 40 },
        { x: "Sun", a: 72, b: 80 },
      ],
      xKey: "x",
    },
    power: {
      pill: { value: "21.7", direction: "down", tone: "good" },
      legendA: "407 kWh",
      legendB: "520 kWh",
      footer: "↓ Reduced power consumption",
      data: [
        { x: "Mon", a: 400, b: 600 },
        { x: "Tue", a: 540, b: 520 },
        { x: "Wed", a: 470, b: 520 },
        { x: "Thu", a: 420, b: 580 },
        { x: "Fri", a: 350, b: 450 },
        { x: "Sat", a: 240, b: 260 },
        { x: "Sun", a: 410, b: 700 },
      ],
      xKey: "x",
    },
    water: {
      pill: { value: "10.2", direction: "up", tone: "bad" },
      legendA: "1182 L",
      legendB: "1073 L",
      footer: "↑ Increased water consumption",
      data: [
        { x: "Mon", a: 900, b: 700 },
        { x: "Tue", a: 880, b: 820 },
        { x: "Wed", a: 920, b: 1600 },
        { x: "Thu", a: 1400, b: 600 },
        { x: "Fri", a: 1300, b: 1400 },
        { x: "Sat", a: 1320, b: 900 },
        { x: "Sun", a: 1120, b: 1500 },
      ],
      xKey: "x",
    },
  },
  Month: {
    compareText: "Compare this month vs last month",
    labelA: "This Month",
    labelB: "Last Month",
    air: {
      pill: { value: "8.4", direction: "down", tone: "good" },
      legendA: 52,
      legendB: 57,
      footer: "↓ Improved air quality",
      data: [
        { x: "W1", a: 55, b: 62 },
        { x: "W2", a: 49, b: 54 },
        { x: "W3", a: 50, b: 58 },
        { x: "W4", a: 54, b: 55 },
      ],
      xKey: "x",
    },
    power: {
      pill: { value: "5.6", direction: "down", tone: "good" },
      legendA: "1980 kWh",
      legendB: "2098 kWh",
      footer: "↓ Reduced power consumption",
      data: [
        { x: "W1", a: 520, b: 540 },
        { x: "W2", a: 480, b: 520 },
        { x: "W3", a: 500, b: 520 },
        { x: "W4", a: 480, b: 518 },
      ],
      xKey: "x",
    },
    water: {
      pill: { value: "3.1", direction: "up", tone: "bad" },
      legendA: "3470 L",
      legendB: "3366 L",
      footer: "↑ Increased water consumption",
      data: [
        { x: "W1", a: 820, b: 780 },
        { x: "W2", a: 880, b: 820 },
        { x: "W3", a: 920, b: 860 },
        { x: "W4", a: 850, b: 906 },
      ],
      xKey: "x",
    },
  },
  Year: {
    compareText: "Compare this year vs last year",
    labelA: "This Year",
    labelB: "Last Year",
    air: {
      pill: { value: "6.5", direction: "down", tone: "good" },
      legendA: 58,
      legendB: 62,
      footer: "↓ Improved air quality",
      data: [
        { x: "Jan", a: 62, b: 60 },
        { x: "Feb", a: 56, b: 63 },
        { x: "Mar", a: 58, b: 40 },
        { x: "Apr", a: 62, b: 60 },
        { x: "May", a: 56, b: 55 },
        { x: "Jun", a: 35, b: 85 },
        { x: "Jul", a: 58, b: 56 },
        { x: "Aug", a: 52, b: 60 },
        { x: "Sep", a: 68, b: 48 },
        { x: "Oct", a: 62, b: 78 },
        { x: "Nov", a: 75, b: 75 },
        { x: "Dec", a: 75, b: 72 },
      ],
      xKey: "x",
    },
    power: {
      pill: { value: "18.4", direction: "down", tone: "good" },
      legendA: "456 kWh",
      legendB: "559 kWh",
      footer: "↓ Reduced power consumption",
      data: [
        { x: "Jan", a: 600, b: 300 },
        { x: "Feb", a: 260, b: 700 },
        { x: "Mar", a: 300, b: 690 },
        { x: "Apr", a: 300, b: 720 },
        { x: "May", a: 620, b: 520 },
        { x: "Jun", a: 660, b: 540 },
        { x: "Jul", a: 300, b: 520 },
        { x: "Aug", a: 340, b: 560 },
        { x: "Sep", a: 480, b: 520 },
        { x: "Oct", a: 600, b: 720 },
        { x: "Nov", a: 400, b: 600 },
        { x: "Dec", a: 650, b: 450 },
      ],
      xKey: "x",
    },
    water: {
      pill: { value: "0.4", direction: "down", tone: "good" },
      legendA: "1117 L",
      legendB: "1122 L",
      footer: "↓ Water conservation improved",
      data: [
        { x: "Jan", a: 800, b: 1500 },
        { x: "Feb", a: 1200, b: 700 },
        { x: "Mar", a: 1050, b: 1300 },
        { x: "Apr", a: 820, b: 650 },
        { x: "May", a: 1220, b: 1200 },
        { x: "Jun", a: 1100, b: 1350 },
        { x: "Jul", a: 1250, b: 850 },
        { x: "Aug", a: 1350, b: 1200 },
        { x: "Sep", a: 1400, b: 850 },
        { x: "Oct", a: 1250, b: 1500 },
        { x: "Nov", a: 1450, b: 1100 },
        { x: "Dec", a: 820, b: 1550 },
      ],
      xKey: "x",
    },
  },
};

const TWO_SLICE_COLORS = ["#1d4ed8", "#93c5fd"];

const ChartRenderer = ({ type, data, xKey }) => {
  if (type === "pie") {
    const totalA = (data || []).reduce((s, r) => s + (Number(r.a) || 0), 0);
    const totalB = (data || []).reduce((s, r) => s + (Number(r.b) || 0), 0);
    const pieData = [
      { name: "A", value: totalA },
      { name: "B", value: totalB },
    ];

    return (
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Tooltip />
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={85}
          >
            {pieData.map((_, idx) => (
              <Cell key={idx} fill={TWO_SLICE_COLORS[idx % TWO_SLICE_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === "column") {
    return (
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="a" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
          <Bar dataKey="b" fill="#93c5fd" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === "line") {
    return (
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line type="monotone" dataKey="a" stroke="#1d4ed8" strokeWidth={3} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="b" stroke="#93c5fd" strokeWidth={2} strokeDasharray="5 5" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="fillA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1d4ed8" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#93c5fd" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Area type="monotone" dataKey="b" stroke="#93c5fd" fill="url(#fillB)" strokeWidth={2} dot={false} />
        <Area type="monotone" dataKey="a" stroke="#1d4ed8" fill="url(#fillA)" strokeWidth={3} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const ChartCard = ({
  title,
  subtitle,
  pill,
  legendA,
  legendB,
  labelA,
  labelB,
  data,
  xKey,
  footer,
  chartType,
  setChartType,
  onDownload,
}) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="text-lg font-bold text-gray-900 truncate">{title}</h3>
        <p className="text-sm text-gray-500 mt-1 truncate">{subtitle}</p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <TrendPill value={pill.value} direction={pill.direction} tone={pill.tone} />
        <ChartControls
          chartType={chartType}
          setChartType={setChartType}
          onDownload={onDownload}
          showChartType
        />
      </div>
    </div>

    <div className="mt-4 flex items-center gap-6 text-sm text-gray-700 flex-wrap">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-blue-600" />
        <span>
          {labelA}: <span className="font-semibold">{legendA}</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-blue-200" />
        <span>
          {labelB}: <span className="font-semibold">{legendB}</span>
        </span>
      </div>
    </div>

    <div className="mt-4">
      <ChartRenderer type={chartType} data={data} xKey={xKey} />
    </div>

    <p className="text-xs text-gray-500 text-center mt-3">{footer}</p>
  </div>
);

function ReadingDashboard() {
  const [timeFilter, setTimeFilter] = useState("Week");
  const [airQualityData, setAirQualityData] = useState(null);
  const [aqLoading, setAqLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dynamicAirQualityData, setDynamicAirQualityData] = useState(null);

  const [aqiChartType, setAqiChartType] = useState("column");
  const [ebChartType, setEbChartType] = useState("line");
  const [waterChartType, setWaterChartType] = useState("area");

  const generateDynamicAirQualityData = (baseData) => {
    // Generate dynamic data based on fetched air quality data
    const baseValue = baseData?.overall_aqi || 55;
    const variation = 15;

    const generateDayData = () => {
      const hours = ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"];
      return hours.map((hour) => ({
        x: hour,
        a: Math.max(20, baseValue + Math.random() * variation - variation / 2),
        b: Math.max(20, baseValue + Math.random() * variation - variation / 2),
      }));
    };

    const generateWeekData = () => {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return days.map((day) => ({
        x: day,
        a: Math.max(20, baseValue + Math.random() * variation - variation / 2),
        b: Math.max(20, baseValue + Math.random() * variation - variation / 2),
      }));
    };

    const generateMonthData = () => {
      const weeks = ["W1", "W2", "W3", "W4"];
      return weeks.map((week) => ({
        x: week,
        a: Math.max(20, baseValue + Math.random() * variation - variation / 2),
        b: Math.max(20, baseValue + Math.random() * variation - variation / 2),
      }));
    };

    const generateYearData = () => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return months.map((month) => ({
        x: month,
        a: Math.max(20, baseValue + Math.random() * variation - variation / 2),
        b: Math.max(20, baseValue + Math.random() * variation - variation / 2),
      }));
    };

    return {
      Day: {
        data: generateDayData(),
        legendA: Math.round(baseValue),
        legendB: Math.round(baseValue + 5),
      },
      Week: {
        data: generateWeekData(),
        legendA: Math.round(baseValue),
        legendB: Math.round(baseValue + 8),
      },
      Month: {
        data: generateMonthData(),
        legendA: Math.round(baseValue),
        legendB: Math.round(baseValue + 5),
      },
      Year: {
        data: generateYearData(),
        legendA: Math.round(baseValue),
        legendB: Math.round(baseValue + 4),
      },
    };
  };

  const fetchAirQuality = async () => {
    setAqLoading(true);
    try {
      const response = await fetch(
        "https://api.api-ninjas.com/v1/airquality?city=India",
        {
          headers: {
            "X-Api-Key": "GqVTDB8Dd5WzQMRPTte3W3lkCDTwxEgJPnUPNEAP",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch air quality data");
      const data = await response.json();
      setAirQualityData(data);
      setDynamicAirQualityData(generateDynamicAirQualityData(data));
      setLastUpdated(new Date().toLocaleTimeString());
      toast.success("Air quality data updated");
    } catch (error) {
      console.error("Air Quality API Error:", error);
      toast.error("Failed to load air quality data");
    } finally {
      setAqLoading(false);
    }
  };

  useEffect(() => {
    fetchAirQuality();
    const interval = setInterval(fetchAirQuality, 1 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const airQualityMetrics = airQualityData
    ? [
        {
          label: "CO",
          value: airQualityData.CO?.concentration?.toFixed(2) || "N/A",
          unit: "µg/m³",
          tone: "blue",
          icon: <Activity className="w-5 h-5 text-blue-500" />,
        },
        {
          label: "PM10",
          value: airQualityData.PM10?.concentration?.toFixed(2) || "N/A",
          unit: "µg/m³",
          tone: "green",
          icon: <Cloud className="w-5 h-5 text-green-500" />,
        },
        {
          label: "PM2.5",
          value: airQualityData["PM2.5"]?.concentration?.toFixed(2) || "N/A",
          unit: "µg/m³",
          tone: "yellow",
          icon: <Wind className="w-5 h-5 text-yellow-500" />,
        },
        {
          label: "O₃",
          value: airQualityData.O3?.concentration?.toFixed(2) || "N/A",
          unit: "µg/m³",
          tone: "red",
          icon: <Leaf className="w-5 h-5 text-red-500" />,
        },
        {
          label: "NO₂",
          value: airQualityData.NO2?.concentration?.toFixed(2) || "N/A",
          unit: "µg/m³",
          tone: "orange",
          icon: <Atom className="w-5 h-5 text-orange-500" />,
        },
        {
          label: "SO₂",
          value: airQualityData.SO2?.concentration?.toFixed(2) || "N/A",
          unit: "µg/m³",
          tone: "sky",
          icon: <Droplet className="w-5 h-5 text-sky-500" />,
        },
      ]
    : [
        {
          label: "CO",
          value: aqLoading ? "Loading..." : "N/A",
          unit: "µg/m³",
          tone: "blue",
          icon: <Activity className="w-5 h-5 text-blue-500" />,
        },
        {
          label: "PM10",
          value: aqLoading ? "Loading..." : "N/A",
          unit: "µg/m³",
          tone: "green",
          icon: <Cloud className="w-5 h-5 text-green-500" />,
        },
        {
          label: "PM2.5",
          value: aqLoading ? "Loading..." : "N/A",
          unit: "µg/m³",
          tone: "yellow",
          icon: <Wind className="w-5 h-5 text-yellow-500" />,
        },
        {
          label: "O₃",
          value: aqLoading ? "Loading..." : "N/A",
          unit: "µg/m³",
          tone: "red",
          icon: <Leaf className="w-5 h-5 text-red-500" />,
        },
        {
          label: "NO₂",
          value: aqLoading ? "Loading..." : "N/A",
          unit: "µg/m³",
          tone: "orange",
          icon: <Atom className="w-5 h-5 text-orange-500" />,
        },
        {
          label: "SO₂",
          value: aqLoading ? "Loading..." : "N/A",
          unit: "µg/m³",
          tone: "sky",
          icon: <Droplet className="w-5 h-5 text-sky-500" />,
        },
      ]

  const powerMeters = [
    { name: "HT1", daily: "12,481", cumulative: "26,473" },
    { name: "HT2", daily: "6,688", cumulative: "13,248" },
  ];

  const waterConsumption = [
    { name: "Domestic", daily: "143", cumulative: "289", total: 289, percent: 85 },
    { name: "Flushing", daily: "98", cumulative: "187", total: 187, percent: 60 },
    { name: "AC Make Up", daily: "156", cumulative: "312", total: 312, percent: 95 },
    { name: "Irrigation", daily: "80", cumulative: "166", total: 166, percent: 50 },
  ];

  const dgGenerators = [
    { name: "DG1", daily: "15", cumulative: "156" },
    { name: "DG2", daily: "18", cumulative: "189" },
    { name: "DG3", daily: "20", cumulative: "204" },
    { name: "DG4", daily: "12", cumulative: "134" },
    { name: "DG5", daily: "8", cumulative: "98" },
  ];

  const facilityMetrics = [
    {
      label: "Total Power",
      value: "19,169",
      unit: "kWh",
      icon: <Zap className="w-5 h-5 text-yellow-600" />,
      iconBg: "bg-yellow-50",
    },
    {
      label: "HVAC",
      value: "12,206.6",
      unit: "kWh",
      icon: <Wind className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-50",
    },
    {
      label: "DG",
      value: "299.77",
      unit: "kWh",
      icon: <Settings className="w-5 h-5 text-red-600" />,
      iconBg: "bg-red-50",
    },
    {
      label: "Footfall",
      value: "1,632",
      unit: "",
      icon: <Users className="w-5 h-5 text-green-600" />,
      iconBg: "bg-green-50",
    },
    {
      label: "Car Count",
      value: "263",
      unit: "",
      icon: <Car className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-50",
    },
    {
      label: "Visitor Count",
      value: "63",
      unit: "",
      icon: <User className="w-5 h-5 text-pink-600" />,
      iconBg: "bg-pink-50",
    },
    {
      label: "Water Inlet",
      value: "477",
      unit: "KL",
      icon: <Droplet className="w-5 h-5 text-cyan-600" />,
      iconBg: "bg-cyan-50",
    },
  ];

  const a = useMemo(() => ANALYTICS[timeFilter] || ANALYTICS.Week, [timeFilter]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-9xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <SectionTitle
              icon={<Zap className="w-6 h-6 text-yellow-600" />}
              title="EB Power Utilization"
              subtitle="High Tension Meters"
              right={
                <ChartControls
                  showChartType={false}
                  onDownload={() =>
                    downloadExcel(downloadApi.ebPowerUtilization, "eb_power_utilization.xlsx")
                  }
                />
              }
            />
            <div className="mt-6 space-y-4">
              {powerMeters.map((m) => (
                <div key={m.name} className={tileWrapperClass}>
                  <EbTile name={m.name} daily={m.daily} cumulative={m.cumulative} />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <SectionTitle
              icon={<Droplet className="w-6 h-6 text-blue-600" />}
              title="Water Consumption"
              subtitle="Daily & Cumulative (KL)"
              right={
                <ChartControls
                  showChartType={false}
                  onDownload={() =>
                    downloadExcel(downloadApi.waterConsumption, "water_consumption.xlsx")
                  }
                />
              }
            />
            <div className="mt-6 space-y-4">
              {waterConsumption.map((w) => (
                <div key={w.name} className={tileWrapperClass}>
                  <WaterRow
                    name={w.name}
                    daily={w.daily}
                    cumulative={w.cumulative}
                    total={w.total}
                    percent={w.percent}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <SectionTitle
              icon={<Settings className="w-6 h-6 text-red-600" />}
              title="DG Power Utilization"
              subtitle="Diesel Generators"
              right={
                <ChartControls
                  showChartType={false}
                  onDownload={() =>
                    downloadExcel(downloadApi.dgPowerUtilization, "dg_power_utilization.xlsx")
                  }
                />
              }
            />
            <div className="mt-6 space-y-3">
              {dgGenerators.map((dg) => (
                <div key={dg.name} className={tileWrapperClass}>
                  <DgRow name={dg.name} daily={dg.daily} cumulative={dg.cumulative} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <SectionTitle
            icon={<Wind className="w-6 h-6 text-green-600" />}
            title="Air Quality"
            subtitle="Key indoor air quality indicators"
            right={
              <div className="flex items-center gap-3">
                <motion.span
                  animate={{
                    boxShadow: [
                      "0 0 0 0 hsl(145 70% 45% / 0.4)",
                      "0 0 0 10px hsl(145 70% 45% / 0)",
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                  className="px-4 py-1.5 rounded-full bg-green-100 border border-green-300 text-green-700 font-medium text-sm whitespace-nowrap flex items-center justify-center"
                >
                  {airQualityData?.overall_aqi ? `AQI: ${airQualityData.overall_aqi}` : "Good"}
                </motion.span>
                <button
                  onClick={fetchAirQuality}
                  disabled={aqLoading}
                  className="h-9 px-4 rounded-lg bg-blue-50 hover:bg-blue-100 disabled:opacity-50 transition text-blue-600 font-medium text-sm"
                  title="Refresh data"
                >
                  {aqLoading ? "⟳ Updating..." : "↻ Refresh"}
                </button>
              </div>
            }
          />

          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-2">Last updated: {lastUpdated}</p>
          )}

          <div className="mt-6 flex items-stretch gap-4 overflow-x-auto pb-2">
            {airQualityMetrics.map((m) => (
              <div key={m.label} className="shrink-0 w-[225px]">
                <MetricTile
                  label={m.label}
                  value={m.value}
                  unit={m.unit}
                  icon={m.icon}
                  tone={m.tone}
                />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle
            icon={<Activity className="w-6 h-6 text-blue-600" />}
            title="Facility Metrics"
            subtitle="Overall building performance"
          />

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-7 gap-4">
            {facilityMetrics.map((m) => (
              <div key={m.label} className={tileWrapperClass}>
                <FacilityTile
                  label={m.label}
                  value={m.value}
                  unit={m.unit}
                  icon={m.icon}
                  iconBg={m.iconBg}
                />
              </div>
            ))}
          </div>
        </Card>

        <div className="px-1">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <h2 className="text-2xl font-bold text-gray-900 truncate">
                Consumption Analytics
              </h2>
              <p className="text-sm text-gray-500 mt-1">{a.compareText}</p>
            </div>

            <div className="flex-shrink-0">
              <Segmented
                value={timeFilter}
                onChange={setTimeFilter}
                options={["Day", "Week", "Month", "Year"]}
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {dynamicAirQualityData && (
              <ChartCard
                title="Air Quality"
                subtitle="AQI comparison over time"
                pill={a.air.pill}
                labelA={a.labelA}
                labelB={a.labelB}
                legendA={dynamicAirQualityData[timeFilter]?.legendA || a.air.legendA}
                legendB={dynamicAirQualityData[timeFilter]?.legendB || a.air.legendB}
                footer={a.air.footer}
                data={dynamicAirQualityData[timeFilter]?.data || a.air.data}
                xKey={a.air.xKey}
                chartType={aqiChartType}
                setChartType={setAqiChartType}
                onDownload={() =>
                  downloadExcel(downloadApi.airQualityIndex, "air_quality_index.xlsx")
                }
              />
            )}

            <ChartCard
              title="EB Power Usage"
              subtitle="kWh consumption trends"
              pill={a.power.pill}
              labelA={a.labelA}
              labelB={a.labelB}
              legendA={a.power.legendA}
              legendB={a.power.legendB}
              footer={a.power.footer}
              data={a.power.data}
              xKey={a.power.xKey}
              chartType={ebChartType}
              setChartType={setEbChartType}
              onDownload={() =>
                downloadExcel(downloadApi.ebPowerUsage, "eb_power_usage.xlsx")
              }
            />

            <ChartCard
              title="Water Consumption"
              subtitle="Liters usage analysis"
              pill={a.water.pill}
              labelA={a.labelA}
              labelB={a.labelB}
              legendA={a.water.legendA}
              legendB={a.water.legendB}
              footer={a.water.footer}
              data={a.water.data}
              xKey={a.water.xKey}
              chartType={waterChartType}
              setChartType={setWaterChartType}
              onDownload={() =>
                downloadExcel(
                  downloadApi.waterConsumptionAnalytics,
                  "water_consumption_analytics.xlsx"
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReadingDashboard;
