import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getStaffDashboard } from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import DetailPopup from "../../components/DetailPopup";

/* ── Stat card config ───────────────────────────────────────────────────── */
const STAT_CONFIG = [
  { key: "total",     title: "Total Staff",   subtitle: "All registered staff",  accent: "#1D4ED8", countType: "total",     countValue: "total"     },
  { key: "active",    title: "Active",         subtitle: "Currently active",      accent: "#10B981", countType: "active",     countValue: "active"    },
  { key: "inactive",  title: "Inactive",       subtitle: "Inactive staff",        accent: "#6B7280", countType: "inactive",   countValue: "inactive"  },
  { key: "approved",  title: "Approved",       subtitle: "Approved records",      accent: "#8B5CF6", countType: "approved",   countValue: "approved"  },
  { key: "pending",   title: "Pending",        subtitle: "Pending approval",      accent: "#F59E0B", countType: "pending",    countValue: "pending"   },
  { key: "today_in",  title: "Today's In",     subtitle: "Checked in today",      accent: "#14B8A6", countType: "today_in",   countValue: "today_in"  },
  { key: "today_out", title: "Today's Out",    subtitle: "Checked out today",     accent: "#EC4899", countType: "today_out",  countValue: "today_out" },
  { key: "total_in",  title: "Total In",       subtitle: "Total check-ins",       accent: "#0EA5E9", countType: "total_in",   countValue: "total_in"  },
  { key: "total_out", title: "Total Out",      subtitle: "Total check-outs",      accent: "#EF4444", countType: "total_out",  countValue: "total_out" },
];

const formatDateForApi = (isoDate) => {
  if (!isoDate) return null;
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return null;
  return `${day}/${month}/${year}`;
};

const extractCount = (raw) => {
  if (raw === undefined || raw === null) return 0;
  if (typeof raw === "number") return raw;
  if (typeof raw === "object" && raw !== null) {
    const n = Number(raw.count ?? raw.total ?? 0);
    return Number.isFinite(n) ? n : 0;
  }
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
};

/* ── Sub-components ──────────────────────────────────────────────────────── */
const StatCard = ({ title, value, accent, subtitle }) => (
  <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] p-5">
    <div className="h-1 w-full rounded-full mb-4" style={{ backgroundColor: accent, opacity: 0.9 }} />
    <p className="text-[15px] font-bold text-gray-900 truncate">{title}</p>
    {subtitle && <p className="text-sm text-gray-500 mt-0.5 truncate">{subtitle}</p>}
    <div className="mt-4 text-3xl font-extrabold text-gray-900">{value}</div>
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

/* ── Main component ──────────────────────────────────────────────────────── */
const StaffDashboard = () => {
  const siteId = getItemInLocalStorage("SITEID");

  /* Dashboard summary state */
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Date filter state */
  const [filterOpen, setFilterOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [tempFromDate, setTempFromDate] = useState("");
  const [tempToDate, setTempToDate] = useState("");

  /* Detail popup state */
  const [detailPopup, setDetailPopup] = useState({
    open: false,
    title: "",
    records: [],
    loading: false,
  });
  const [detailPage, setDetailPage] = useState(1);
  const [detailTotalPages, setDetailTotalPages] = useState(1);
  const [detailFilter, setDetailFilter] = useState({ countType: "", countValue: "", title: "" });

  /* ── Fetch summary counts ─────────────────────────────────────────────── */
  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, siteId]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const rangeFrom = formatDateForApi(fromDate);
      const rangeTo = formatDateForApi(toDate);

      const resp = await getStaffDashboard(siteId, null, null, 1, rangeFrom, rangeTo);
      const data = resp?.data || {};

      const visible = STAT_CONFIG
        .filter((cfg) => data[cfg.key] !== undefined)
        .map((cfg) => ({
          ...cfg,
          displayCount: extractCount(data[cfg.key]),
        }));

      setCards(visible);
    } catch (err) {
      console.error("Error fetching staff dashboard:", err);
      toast.error("Failed to load staff dashboard");
    } finally {
      setLoading(false);
    }
  };

  /* ── Fetch drill-down records ─────────────────────────────────────────── */
  const fetchDrillRecords = async (countType, countValue, title, page = 1) => {
    setDetailPopup({ open: true, title, records: [], loading: true });
    setDetailFilter({ countType, countValue, title });
    setDetailPage(page);

    try {
      const rangeFrom = formatDateForApi(fromDate);
      const rangeTo = formatDateForApi(toDate);

      const resp = await getStaffDashboard(
        siteId,
        countType,
        countValue,
        page,
        rangeFrom || undefined,
        rangeTo || undefined
      );

      const data = resp?.data ?? {};

      // Handle both flat and nested response structures
      const bucket = data[countValue] ?? data[countType] ?? data ?? {};
      const records = Array.isArray(bucket?.records) ? bucket.records : [];
      const total = bucket?.count ?? bucket?.total ?? records.length;
      const perPage = bucket?.per_page ?? 10;
      const totalPgs = perPage > 0 ? Math.max(1, Math.ceil(total / perPage)) : 1;

      setDetailTotalPages(totalPgs);
      setDetailPopup({
        open: true,
        title,
        records,
        loading: false,
      });
    } catch (err) {
      console.error("[StaffDashboard] drill error:", err);
      toast.error("Failed to load staff details");
      setDetailPopup((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleCardClick = (cfg) => {
    fetchDrillRecords(cfg.countType, cfg.countValue, cfg.title, 1);
  };

  const onDetailPageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > detailTotalPages) return;
    fetchDrillRecords(
      detailFilter.countType,
      detailFilter.countValue,
      detailFilter.title,
      nextPage
    );
  };

  const closeDetailPopup = () => {
    setDetailPopup({ open: false, title: "", records: [], loading: false });
    setDetailPage(1);
    setDetailTotalPages(1);
  };

  /* ── Render ───────────────────────────────────────────────────────────── */
  return (
    <div className="w-full px-3 pb-4">
      {/* Top bar */}
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
          onClick={() => {
            setFromDate("");
            setToDate("");
          }}
          className="h-10 px-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
        >
          Clear Filter
        </button>
      </div>

      {/* Date filter modal */}
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

      {/* Stat cards - Made clickable like in VisitorsDashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : cards.map((cfg) => (
              <div
                key={cfg.key}
                onClick={() => handleCardClick(cfg)}
                className="cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform duration-150"
              >
                <StatCard
                  title={cfg.title}
                  subtitle={cfg.subtitle}
                  value={cfg.displayCount}
                  accent={cfg.accent}
                />
              </div>
            ))}
      </div>

      {/* Detail popup */}
      <DetailPopup
        isOpen={detailPopup.open}
        onClose={closeDetailPopup}
        title={detailPopup.title}
        subtitle={`Page ${detailPage} of ${detailTotalPages}`}
        records={detailPopup.records}
        loading={detailPopup.loading}
        page={detailPage}
        totalPages={detailTotalPages}
        onPageChange={onDetailPageChange}
        columns={[
          { key: "staff_id",    label: "Staff ID",   accessor: (r) => r.staff_id    },
          { key: "name",        label: "Name",        accessor: (r) => r.name        },
          { key: "mobile_no",   label: "Mobile",      accessor: (r) => r.mobile_no   },
          { key: "work_type",   label: "Work Type",   accessor: (r) => r.work_type   },
          { key: "vendor",      label: "Vendor",      accessor: (r) => r.vendor      },
          { key: "status_type", label: "Status",      accessor: (r) => r.status_type },
          {
            key: "valid_from",
            label: "Valid From",
            accessor: (r) => (r.valid_from ? new Date(r.valid_from).toLocaleDateString("en-IN") : "—"),
          },
          {
            key: "valid_till",
            label: "Valid Till",
            accessor: (r) => (r.valid_till ? new Date(r.valid_till).toLocaleDateString("en-IN") : "—"),
          },
        ]}
      />
    </div>
  );
};

export default StaffDashboard;