import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Wind,
  Cloud,
  Leaf,
  Thermometer,
  Droplets,
  Zap,
  Droplet,
  Settings,
  Activity,
  Users,
  Car,
  User,
  TrendingUp,
  TrendingDown,
  ChevronDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/** ---------- Small UI helpers ---------- */
const Card = ({ className = "", children }) => (
  <div
    className={`bg-white rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.06)] border border-gray-100 ${className}`}
  >
    {children}
  </div>
);

/** ✅ FIXED: SectionTitle row-wise (badge aligned, no wrap, responsive safe) */
const SectionTitle = ({ icon, title, subtitle, right }) => (
  <div className="flex items-start justify-between gap-3">
    {/* LEFT SIDE */}
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

    {/* RIGHT SIDE */}
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

/** ✅ Tiles like screenshot (no color changes — only light tinted backgrounds) */
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

/** -------- EB / Water / DG cards (keep existing colors) -------- */
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
    <svg
      className="absolute left-0 top-0 h-full w-full opacity-35"
      viewBox="0 0 120 12"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M0 6 C 10 2, 20 10, 30 6 S 50 10, 60 6 S 80 2, 90 6 S 110 10, 120 6"
        fill="none"
        stroke="white"
        strokeWidth="2"
        animate={{ x: [0, 120, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </svg>
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

/** ---------- Analytics (unchanged) ---------- */
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

const ChartCard = ({
  title,
  subtitle,
  pill,
  legendA,
  legendB,
  labelA,
  labelB,
  children,
  footer,
}) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="text-lg font-bold text-gray-900 truncate">{title}</h3>
        <p className="text-sm text-gray-500 mt-1 truncate">{subtitle}</p>
      </div>
      <div className="flex-shrink-0">
        <TrendPill value={pill.value} direction={pill.direction} tone={pill.tone} />
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

    <div className="mt-4">{children}</div>

    <p className="text-xs text-gray-500 text-center mt-3">{footer}</p>
  </div>
);

function ReadingDashboard() {
  const [timeFilter, setTimeFilter] = useState("Week");
  const [site, setSite] = useState("BKC-Godrej");

  // ✅ hover + click (selected) model/card
  const [activeModel, setActiveModel] = useState(null);

  // helper: class for hover + selected
  const modelClass = (key) =>
    `cursor-pointer transition-all duration-200 rounded-2xl
     hover:-translate-y-[2px] hover:shadow-[0_14px_28px_rgba(15,23,42,0.12)]
     active:scale-[0.99]
     ${
       activeModel === key
         ? "ring-2 ring-blue-500 shadow-[0_14px_28px_rgba(59,130,246,0.20)]"
         : ""
     }`;

  /** ✅ Priority: Indoor Air Quality grid like screenshot */
  const airQualityMetrics = [
    {
      label: "CO₂",
      value: "482",
      unit: "PPM",
      tone: "blue",
      icon: <Leaf className="w-5 h-5 text-green-500" />,
    },
    {
      label: "PM10",
      value: "112",
      unit: "µg/m³",
      tone: "green",
      icon: <Cloud className="w-5 h-5 text-blue-500" />,
    },
    {
      label: "PM2.5",
      value: "97",
      unit: "µg/m³",
      tone: "yellow",
      icon: <Wind className="w-5 h-5 text-blue-500" />,
    },
    {
      label: "TVOC",
      value: "341",
      unit: "ppb",
      tone: "red",
      icon: <Leaf className="w-5 h-5 text-green-500" />,
    },
    {
      label: "Temperature",
      value: "26.25",
      unit: "°C",
      tone: "green",
      icon: <Thermometer className="w-5 h-5 text-orange-500" />,
    },
    {
      label: "Humidity",
      value: "50.9",
      unit: "%",
      tone: "sky",
      icon: <Droplets className="w-5 h-5 text-sky-500" />,
    },
  ];

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
    {
      label: "Ambient Temp",
      value: "30.3",
      unit: "°C",
      icon: <Thermometer className="w-5 h-5 text-orange-600" />,
      iconBg: "bg-orange-50",
    },
    {
      label: "Relative Humidity",
      value: "40",
      unit: "%",
      icon: <Droplets className="w-5 h-5 text-sky-600" />,
      iconBg: "bg-sky-50",
    },
  ];

  const a = useMemo(() => ANALYTICS[timeFilter], [timeFilter]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-9xl mx-auto space-y-6">

        {/* Top Header */}
        <Card className="p-6">
<SectionTitle
  icon={<Wind className="w-6 h-6 text-green-600" />}
  title="Indoor Air Quality"
  subtitle="Real-time environmental monitoring"
  right={
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
      Good
    </motion.span>
  }
/>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 p-2">
            {airQualityMetrics.map((m) => (
              <div
                key={m.label}
                onClick={() => setActiveModel(`air-${m.label}`)}
                className={modelClass(`air-${m.label}`)}
              >
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* EB Power */}
          <Card className="p-6">
            <SectionTitle
              icon={<Zap className="w-6 h-6 text-yellow-600" />}
              title="EB Power Utilization"
              subtitle="High Tension Meters"
            />

            <div className="mt-6 space-y-4">
              {powerMeters.map((m) => (
                <div
                  key={m.name}
                  onClick={() => setActiveModel(`eb-${m.name}`)}
                  className={modelClass(`eb-${m.name}`)}
                >
                  <EbTile name={m.name} daily={m.daily} cumulative={m.cumulative} />
                </div>
              ))}
            </div>
          </Card>

          {/* Water Consumption */}
          <Card className="p-6">
            <SectionTitle
              icon={<Droplet className="w-6 h-6 text-blue-600" />}
              title="Water Consumption"
              subtitle="Daily & Cumulative (KL)"
            />

            <div className="mt-6 space-y-4">
              {waterConsumption.map((w) => (
                <div
                  key={w.name}
                  onClick={() => setActiveModel(`water-${w.name}`)}
                  className={modelClass(`water-${w.name}`)}
                >
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

          {/* DG Power */}
          <Card className="p-6">
            <SectionTitle
              icon={<Settings className="w-6 h-6 text-red-600" />}
              title="DG Power Utilization"
              subtitle="Diesel Generators"
            />

            <div className="mt-6 space-y-3">
              {dgGenerators.map((dg) => (
                <div
                  key={dg.name}
                  onClick={() => setActiveModel(`dg-${dg.name}`)}
                  className={modelClass(`dg-${dg.name}`)}
                >
                  <DgRow name={dg.name} daily={dg.daily} cumulative={dg.cumulative} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 3) Facility Metrics (full width below) */}
        <Card className="p-6">
          <SectionTitle
            icon={<Activity className="w-6 h-6 text-blue-600" />}
            title="Facility Metrics"
            subtitle="Overall building performance"
          />

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {facilityMetrics.map((m) => (
              <div
                key={m.label}
                onClick={() => setActiveModel(`facility-${m.label}`)}
                className={modelClass(`facility-${m.label}`)}
              >
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

        {/* Consumption Analytics (unchanged) */}
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
            <ChartCard
              title="Air Quality Index"
              subtitle="AQI comparison over time"
              pill={a.air.pill}
              labelA={a.labelA}
              labelB={a.labelB}
              legendA={a.air.legendA}
              legendB={a.air.legendB}
              footer={a.air.footer}
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={a.air.data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey={a.air.xKey} tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="a" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="b" fill="#93c5fd" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="EB Power Usage"
              subtitle="kWh consumption trends"
              pill={a.power.pill}
              labelA={a.labelA}
              labelB={a.labelB}
              legendA={a.power.legendA}
              legendB={a.power.legendB}
              footer={a.power.footer}
            >
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={a.power.data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey={a.power.xKey} tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="a" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="b" stroke="#fcd34d" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Water Consumption"
              subtitle="Liters usage analysis"
              pill={a.water.pill}
              labelA={a.labelA}
              labelB={a.labelB}
              legendA={a.water.legendA}
              legendB={a.water.legendB}
              footer={a.water.footer}
            >
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={a.water.data}>
                  <defs>
                    <linearGradient id="fillA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fillB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#93c5fd" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#93c5fd" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey={a.water.xKey} tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="b" stroke="#93c5fd" fill="url(#fillB)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="a" stroke="#0ea5e9" fill="url(#fillA)" strokeWidth={3} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReadingDashboard;
