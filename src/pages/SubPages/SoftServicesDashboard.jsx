import React, { useEffect, useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import {
  getServicesTaskList,
  getSoftServicesDashboardDrill,
} from "../../api";
import DetailPopup from "../../components/DetailPopup";

/* ── Stat card config (maps to API JSON keys) ──────────────────────────── */
const STAT_CONFIG = [
  // {
  //   key: "total_services",
  //   title: "Total Services",
  //   subtitle: "All soft services",
  //   accent: "#1D4ED8",
  //   countType: "total_services",
  //   countValue: "total_services",
  //   drillable: false,
  // },
  // {
  //   key: "total_checklist",
  //   title: "Total Checklists",
  //   subtitle: "Linked checklists",
  //   accent: "#8B5CF6",
  //   countType: "total_checklist",
  //   countValue: "total_checklist",
  //   drillable: false,
  // },
  {
    key: "total_tasks",
    title: "Total Tasks",
    subtitle: "All tasks",
    accent: "#0EA5E9",
    countType: "total_tasks",
    countValue: "total",
    drillable: true,
  },
  {
    key: "pending_tasks",
    title: "Pending",
    subtitle: "Pending tasks",
    accent: "#F59E0B",
    countType: "task_status",
    countValue: "pending",
    drillable: true,
  },
  {
    key: "completed_tasks",
    title: "Completed",
    subtitle: "Completed tasks",
    accent: "#10B981",
    countType: "task_status",
    countValue: "complete",
    drillable: true,
  },
  {
    key: "overdue_tasks",
    title: "Overdue",
    subtitle: "Overdue tasks",
    accent: "#EF4444",
    countType: "task_status",
    countValue: "overdue",
    drillable: true,
  },
  // {
  //   key: "tasks_performed_today",
  //   title: "Done Today",
  //   subtitle: "Tasks performed today",
  //   accent: "#14B8A6",
  //   countType: "task_status",
  //   countValue: "today",
  //   drillable: false,
  // },
  // {
  //   key: "tasks_due_today",
  //   title: "Due Today",
  //   subtitle: "Tasks due today",
  //   accent: "#EC4899",
  //   countType: "task_status",
  //   countValue: "due_today",
  //   drillable: false,
  // },
  // {
  //   key: "avg_tasks_completed",
  //   title: "Avg Completed",
  //   subtitle: "Avg tasks completed",
  //   accent: "#6366F1",
  //   countType: "task_status",
  //   countValue: "avg_completed",
  //   drillable: false,
  //   isDecimal: true,
  // },
];

/* ── Helpers ───────────────────────────────────────────────────────────── */
const formatDateForApi = (isoDate) => {
  if (!isoDate) return null;
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return null;
  return `${day}/${month}/${year}`;
};

/* ── Sub-components ────────────────────────────────────────────────────── */
const StatCard = ({ title, value, accent, subtitle, onClick, isFiltered, drillable }) => (
  <div
    onClick={drillable ? onClick : undefined}
    className={[
      "rounded-2xl border border-gray-100 bg-white shadow transition p-5 relative",
      drillable ? "cursor-pointer hover:shadow-lg hover:-translate-y-0.5" : "cursor-default",
    ].join(" ")}
    style={{ transition: "box-shadow 0.2s, transform 0.2s" }}
  >
    <div className="h-1 w-full rounded-full mb-4" style={{ backgroundColor: accent, opacity: 0.9 }} />
    <p className="text-[15px] font-bold text-gray-900 truncate">{title}</p>
    {subtitle && <p className="text-sm text-gray-500 mt-0.5 truncate">{subtitle}</p>}
    <div className="mt-4 text-3xl font-extrabold text-gray-900">{value}</div>
    {/* {drillable && (
      <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
        Click
      </span>
    )} */}
    {/* {isFiltered && (
      <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
        Range
      </span>
    )} */}
  </div>
);

const SkeletonCard = () => (
  <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] p-5 animate-pulse">
    <div className="h-1 w-full rounded-full bg-gray-200 mb-4" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
    <div className="h-8 bg-gray-200 rounded w-1/3" />
  </div>
);

/* ── Main component ────────────────────────────────────────────────────── */
const POPUP_INITIAL = { open: false, title: "", records: [], loading: false, page: 1, totalPages: 1 };
const COUNT_TYPE_TO_KEY = {
  task_status: "by_task_status",
  floor: "by_floor",
  building: "by_building",
  assigned_user: "by_assigned_user",
};

const SoftServicesDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const [filterOpen, setFilterOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [tempFromDate, setTempFromDate] = useState("");
  const [tempToDate, setTempToDate] = useState("");

  const [popup, setPopup] = useState(POPUP_INITIAL);
  const popupRef = useRef(POPUP_INITIAL);
  const fromDateRef = useRef(fromDate);
  const toDateRef = useRef(toDate);
  const filterRef = useRef({ countType: "", countValue: "", title: "" });

  useEffect(() => { popupRef.current = popup; }, [popup]);
  useEffect(() => { fromDateRef.current = fromDate; }, [fromDate]);
  useEffect(() => { toDateRef.current = toDate; }, [toDate]);

  const isDateFilterActive = Boolean(fromDate && toDate);

  /* ── Stats fetch ──────────────────────────────────────────────────── */
  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const rangeFrom = formatDateForApi(fromDate);
      const rangeTo = formatDateForApi(toDate);
      const resp = await getServicesTaskList(rangeFrom, rangeTo);
      setStats(resp?.data || {});
    } catch (err) {
      console.error("Error fetching soft services dashboard:", err);
      toast.error("Failed to load soft services dashboard");
    } finally {
      setLoading(false);
    }
  };

  /* ── Drill-down ───────────────────────────────────────────────────── */
  const fetchDrillRecords = useCallback(async (countType, countValue, title, page) => {
    setPopup((prev) => ({ ...prev, open: true, title, loading: true, page }));

    try {
      const rangeFrom = formatDateForApi(fromDateRef.current) || undefined;
      const rangeTo = formatDateForApi(toDateRef.current) || undefined;

      const res = await getSoftServicesDashboardDrill(countType, countValue, page, rangeFrom, rangeTo);
      const data = res?.data || {};

      /* resolve nested bucket */
      const groupKey = COUNT_TYPE_TO_KEY[countType];
      const bucket =
        groupKey && data[groupKey]
          ? data[groupKey][countValue] ||
          data[groupKey][countValue?.toLowerCase()] ||
          {}
          : {};

      let records = [];
      if (Array.isArray(bucket?.records)) records = bucket.records;
      else if (Array.isArray(bucket)) records = bucket;
      else if (Array.isArray(data?.records)) records = data.records;

      const totalPages =
        Number(bucket.total_pages) ||
        (bucket.per_page > 0
          ? Math.max(1, Math.ceil((bucket.count || records.length) / bucket.per_page))
          : 1);

      setPopup({ open: true, title, records, loading: false, page, totalPages });
    } catch (err) {
      console.error("Drill-down error:", err);
      toast.error("Failed to load task details");
      setPopup((prev) => ({ ...prev, loading: false }));
    }
  }, []); // eslint-disable-line

  const handleCardClick = (cfg) => {
    filterRef.current = { countType: cfg.countType, countValue: cfg.countValue, title: cfg.title };
    fetchDrillRecords(cfg.countType, cfg.countValue, cfg.title, 1);
  };

  const onPageChange = (newPage) => {
    const { totalPages } = popupRef.current;
    if (newPage < 1 || newPage > totalPages) return;
    const { countType, countValue, title } = filterRef.current;
    fetchDrillRecords(countType, countValue, title, newPage);
  };

  const closePopup = () => setPopup(POPUP_INITIAL);

  /* ── Build cards from stats ───────────────────────────────────────── */
  const cards = STAT_CONFIG.map((cfg) => ({
    ...cfg,
    displayCount: cfg.isDecimal
      ? (Number(stats[cfg.key]) || 0).toFixed(2)
      : stats[cfg.key] ?? 0,
  }));

  return (
    <div className="w-full px-3 pb-4">

      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-2 mb-4">
        {/* {isDateFilterActive && (
          <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg font-medium">
            📅 {fromDate} → {toDate}
          </span>
        )} */}
        <button
          onClick={() => { setTempFromDate(fromDate); setTempToDate(toDate); setFilterOpen(true); }}
          className="h-10 px-4 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition font-medium text-sm"
        >
          Filter by Date
        </button>
        <button
          onClick={() => { setFromDate(""); setToDate(""); }}
          className="h-10 px-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium text-sm"
        >
          Clear Filter
        </button>
      </div>

      {/* Date Filter Modal */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-5">
            <h3 className="text-lg font-semibold text-gray-900">Filter Soft Services by Date</h3>
            <p className="text-sm text-gray-500 mt-1">Choose start and end date.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
                <input
                  type="date"
                  value={tempFromDate}
                  onChange={(e) => setTempFromDate(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
                <input
                  type="date"
                  value={tempToDate}
                  onChange={(e) => setTempToDate(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <button
                onClick={() => setFilterOpen(false)}
                className="h-10 px-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!tempFromDate || !tempToDate) { toast.error("Please select both dates"); return; }
                  setFromDate(tempFromDate);
                  setToDate(tempToDate);
                  setFilterOpen(false);
                }}
                className="h-10 px-4 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-medium text-sm"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
          : cards.map((cfg) => (
            <StatCard
              key={cfg.key}
              title={cfg.title}
              subtitle={cfg.subtitle}
              value={cfg.displayCount}
              accent={cfg.accent}
              drillable={cfg.drillable}
              isFiltered={isDateFilterActive}
              onClick={() => handleCardClick(cfg)}
            />
          ))}
      </div>

      {/* Detail Popup */}
      <DetailPopup
        isOpen={popup.open}
        onClose={closePopup}
        title={popup.title}
        subtitle={`Page ${popup.page} of ${popup.totalPages}`}
        records={popup.records}
        loading={popup.loading}
        page={popup.page}
        totalPages={popup.totalPages}
        onPageChange={onPageChange}
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
            label: "Block",
            accessor: (r) => r.building_name ?? r.building ?? r.site_building ?? "—",
          },
          {
            key: "floor_name",
            label: "Floor",
            accessor: (r) => r.floor_name ?? r.floor ?? r.level_name ?? "—",
          },
          {
            key: "assigned_user",
            label: "Assigned To",
            accessor: (r) => {
              if (Array.isArray(r.assigned_to)) return r.assigned_to.join(", ");
              return r.assigned_name ?? r.assigned_user ?? "Unassigned";
            },
          },
          {
            key: "status",
            label: "Status",
            accessor: (r) => {
              const status = r.status ?? "—";
              const colorMap = {
                overdue: "text-red-600 bg-red-50",
                complete: "text-green-600 bg-green-50",
                pending: "text-yellow-600 bg-yellow-50",
              };
              return (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorMap[status] || "text-gray-600 bg-gray-100"}`}>
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

export default SoftServicesDashboard;
