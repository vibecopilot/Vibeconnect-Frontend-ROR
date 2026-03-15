import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getStaffDashboard } from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";

/* ── Stat card config – only renders if key exists in API response ─────── */
const STAT_CONFIG = [
  { key: "total",         title: "Total Staff",       subtitle: "All registered staff",   accent: "#1D4ED8" },
  { key: "active",        title: "Active",             subtitle: "Currently active",       accent: "#10B981" },
  { key: "inactive",      title: "Inactive",           subtitle: "Inactive staff",         accent: "#6B7280" },
  { key: "approved",      title: "Approved",           subtitle: "Approved records",       accent: "#8B5CF6" },
  { key: "pending",       title: "Pending",            subtitle: "Pending approval",       accent: "#F59E0B" },
  { key: "in_date_range", title: "In Date Range",      subtitle: "Filtered period",        accent: "#06B6D4" },
  { key: "today_in",      title: "Today's In",         subtitle: "Checked in today",       accent: "#14B8A6" },
  { key: "today_out",     title: "Today's Out",        subtitle: "Checked out today",      accent: "#EC4899" },
  { key: "total_in",      title: "Total In",           subtitle: "Total check-ins",        accent: "#0EA5E9" },
  { key: "total_out",     title: "Total Out",          subtitle: "Total check-outs",       accent: "#EF4444" },
];

const formatDateForApi = (isoDate) => {
  if (!isoDate) return null;
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return null;
  return `${day}/${month}/${year}`;
};

const StatCard = ({ title, value, accent, subtitle }) => (
  <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] p-5">
    <div className="h-1 w-full rounded-full mb-4" style={{ backgroundColor: accent, opacity: 0.9 }} />
    <p className="text-[15px] font-bold text-gray-900 truncate">{title}</p>
    {subtitle ? <p className="text-sm text-gray-500 mt-0.5 truncate">{subtitle}</p> : null}
    <div className="mt-4 text-3xl font-extrabold text-gray-900">
      {Number.isFinite(Number(value)) ? Number(value) : 0}
    </div>
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

const StaffDashboard = () => {
  const siteId = getItemInLocalStorage("SITEID");

  const [rawStats,     setRawStats]     = useState({});
  const [loading,      setLoading]      = useState(true);
  const [filterOpen,   setFilterOpen]   = useState(false);
  const [fromDate,     setFromDate]     = useState("");
  const [toDate,       setToDate]       = useState("");
  const [tempFromDate, setTempFromDate] = useState("");
  const [tempToDate,   setTempToDate]   = useState("");

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, siteId]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const rangeFrom = formatDateForApi(fromDate);
      const rangeTo   = formatDateForApi(toDate);
      const resp      = await getStaffDashboard(siteId, null, null, 1, rangeFrom, rangeTo);
      setRawStats(resp?.data || {});
    } catch (err) {
      console.error("Error fetching staff dashboard:", err);
      toast.error("Failed to load staff dashboard");
    } finally {
      setLoading(false);
    }
  };

  const visibleCards = useMemo(
    () =>
      STAT_CONFIG
        .filter((cfg) => rawStats[cfg.key] !== undefined)
        .map((cfg) => ({ ...cfg, value: rawStats[cfg.key] })),
    [rawStats]
  );

  return (
    <div className="w-full px-3 pb-4">
      {/* ── Top bar ── */}
      <div className="flex flex-wrap items-center justify-end gap-2 mb-4">
        <button
          type="button"
          onClick={() => {
            setTempFromDate(fromDate);
            setTempToDate(toDate);
            setFilterOpen(true);
          }}
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
                type="button"
                onClick={() => setFilterOpen(false)}
                className="h-10 px-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
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
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : visibleCards.map((cfg) => (
              <StatCard
                key={cfg.key}
                title={cfg.title}
                subtitle={cfg.subtitle}
                value={cfg.value}
                accent={cfg.accent}
              />
            ))
        }
      </div>
    </div>
  );
};

export default StaffDashboard;
