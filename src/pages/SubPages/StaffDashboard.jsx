import React, { useEffect, useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { getStaffDashboard } from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import DetailPopup from "../../components/DetailPopup";

/* ── Stat card base config ─────────────────────────────────────────────── */
// Each card simply uses cfg.key to read its value from the API response.
// The API already applies start_date / end_date filtering server-side, so
// today_in and today_in will naturally reflect the selected date range.
const BASE_STAT_CONFIG = [
  { key: "total",     title: "Total Staff",  subtitle: "All registered staff",  accent: "#1D4ED8", countType: "total",     countValue: "total"     },
  { key: "active",    title: "Active",        subtitle: "Currently active",       accent: "#10B981", countType: "active",    countValue: "active"    },
  { key: "inactive",  title: "Inactive",      subtitle: "Inactive staff",         accent: "#6B7280", countType: "inactive",  countValue: "inactive"  },
  { key: "approved",  title: "Approved",      subtitle: "Approved records",       accent: "#8B5CF6", countType: "approved",  countValue: "approved"  },
  { key: "pending",   title: "Pending",       subtitle: "Pending approval",       accent: "#F59E0B", countType: "pending",   countValue: "pending"   },
  { key: "today_in",  title: "Today's In",   subtitle: "Checked in today",       accent: "#14B8A6", countType: "today_in",  countValue: "today_in"  },
  { key: "today_out", title: "Today's Out",  subtitle: "Checked out today",      accent: "#EC4899", countType: "today_out", countValue: "today_out" },
  { key: "total_in",  title: "Total In",     subtitle: "Total check-ins",        accent: "#0EA5E9", countType: "total_in",  countValue: "total_in"  },
  { key: "total_out", title: "Total Out",    subtitle: "Total check-outs",       accent: "#EF4444", countType: "total_out", countValue: "total_out" },
];

/* ── Helpers ────────────────────────────────────────────────────────────── */
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
const StatCard = ({ title, value, accent, subtitle, onClick, isFiltered }) => (
  <div
    onClick={onClick}
    className="rounded-2xl border border-gray-100 bg-white shadow cursor-pointer hover:shadow-lg transition p-5 relative"
  >
    <div className="h-1 w-full rounded-full mb-4" style={{ backgroundColor: accent, opacity: 0.9 }} />
    <p className="text-[15px] font-bold text-gray-900 truncate">{title}</p>
    {subtitle && <p className="text-sm text-gray-500 mt-0.5 truncate">{subtitle}</p>}
    <div className="mt-4 text-3xl font-extrabold text-gray-900">{value}</div>
    {isFiltered && (
      <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
        Range
      </span>
    )}
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

/* ── Bucket extractor ────────────────────────────────────────────────────── */
const isValidBucket = (v) =>
  v && typeof v === "object" && !Array.isArray(v) && Array.isArray(v.records);

const extractBucket = (data, countType, countValue) => {
  if (isValidBucket(data[countValue])) return data[countValue];
  if (isValidBucket(data[countType])) return data[countType];
  if (Array.isArray(data.records)) return data;
  const key = Object.keys(data).find((k) => isValidBucket(data[k]));
  return key ? data[key] : null;
};

/* ── Main component ──────────────────────────────────────────────────────── */
const POPUP_INITIAL = { open: false, title: "", records: [], loading: false, page: 1, totalPages: 1 };

const StaffDashboard = () => {
  const siteId = getItemInLocalStorage("SITEID");

  const [cards, setCards] = useState([]);
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

  /* ── Stats fetch ─────────────────────────────────────────────────────── */
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

      // Build visible cards: each card reads data[cfg.key] directly.
      // The API applies start_date / end_date server-side, so all values
      // (including today_in / today_out) already reflect the chosen range.
      const visible = BASE_STAT_CONFIG
        .filter((cfg) => data[cfg.key] !== undefined)
        .map((cfg) => ({
          ...cfg,
          displayTitle: cfg.title,
          displaySubtitle: cfg.subtitle,
          isFiltered: false,
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

  /* ── Drill-down ─────────────────────────────────────────────────────── */
  const fetchDrillRecords = useCallback(async (countType, countValue, title, page) => {
    setPopup((prev) => ({ ...prev, open: true, title, loading: true, page }));

    try {
      const rangeFrom = formatDateForApi(fromDateRef.current) || undefined;
      const rangeTo = formatDateForApi(toDateRef.current) || undefined;

      // ✅ KEY FIX: Pass `page` directly as the 4th argument (record_page).
      // The API function signature is: (siteId, countType, countValue, page, startDate, endDate)
      // `page` here maps directly to `record_page` in the API params.
      const resp = await getStaffDashboard(
        siteId,
        countType,
        countValue,
        page,      // ✅ FIXED — was hardcoded to 1, now passes the actual page number
        rangeFrom,
        rangeTo
      );

      const data = resp?.data ?? {};
      const bucket = extractBucket(data, countType, countValue);

      const records = bucket?.records ?? [];
      const totalPages = bucket?.total_pages
        ? Number(bucket.total_pages)
        : bucket?.per_page && bucket?.count
          ? Math.ceil(bucket.count / bucket.per_page)
          : 1;

      setPopup({ open: true, title, records, loading: false, page, totalPages });
    } catch (err) {
      console.error("Drill-down error:", err);
      toast.error("Failed to load details");
      setPopup((prev) => ({ ...prev, loading: false }));
    }
  }, [siteId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCardClick = (cfg) => {
    const isFiltered = cfg.filteredKey && isDateFilterActive;

    const countType = isFiltered ? cfg.filteredCountType || cfg.countType : cfg.countType;
    const countValue = isFiltered ? cfg.filteredCountValue || cfg.countValue : cfg.countValue;

    filterRef.current = {
      countType,
      countValue,
      title: cfg.displayTitle || cfg.title,
    };

    fetchDrillRecords(countType, countValue, cfg.displayTitle || cfg.title, 1);
  };

  const onPageChange = (newPage) => {
    const { totalPages } = popupRef.current;
    if (newPage < 1 || newPage > totalPages) return;
    const { countType, countValue, title } = filterRef.current;
    fetchDrillRecords(countType, countValue, title, newPage);
  };

  const closePopup = () => setPopup(POPUP_INITIAL);

  return (
    <div className="w-full px-3 pb-4">

      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-2 mb-4">
        {isDateFilterActive && (
          <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg font-medium">
            📅 {fromDate} → {toDate}
          </span>
        )}
        <button
          onClick={() => { setTempFromDate(fromDate); setTempToDate(toDate); setFilterOpen(true); }}
          className="h-10 px-4 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
        >
          Filter by Date
        </button>
        <button
          onClick={() => { setFromDate(""); setToDate(""); }}
          className="h-10 px-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
        >
          Clear Filter
        </button>
      </div>

      {/* Date Filter Modal */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-5">
            <h3 className="text-lg font-semibold text-gray-900">Filter Staff by Date</h3>
            <p className="text-sm text-gray-500 mt-1">Choose start and end date.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
                <input type="date" value={tempFromDate} onChange={(e) => setTempFromDate(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
                <input type="date" value={tempToDate} onChange={(e) => setTempToDate(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={() => setFilterOpen(false)} className="h-10 px-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!tempFromDate || !tempToDate) { toast.error("Please select both dates"); return; }
                  setFromDate(tempFromDate);
                  setToDate(tempToDate);
                  setFilterOpen(false);
                }}
                className="h-10 px-4 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
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
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : cards.map((cfg) => (
            <StatCard
              key={cfg.key}
              title={cfg.displayTitle || cfg.title}
              subtitle={cfg.displaySubtitle || cfg.subtitle}
              value={cfg.displayCount}
              accent={cfg.accent}
              isFiltered={cfg.isFiltered}
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
            key: "staff_id",
            label: "Staff ID",
            accessor: (r) => <span className="text-xs font-medium text-gray-500">#{r.staff_id ?? "—"}</span>,
          },
          {
            key: "name",
            label: "Staff Details",
            accessor: (r) => (
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">{r.name ?? "—"}</span>
                <span className="text-xs text-gray-500">{r.mobile_no ?? "No mobile"}</span>
              </div>
            ),
          },
          {
            key: "work_type",
            label: "Work Type",
            accessor: (r) => {
              const colors = {
                electrician: "bg-blue-50 text-blue-600",
                plumber: "bg-indigo-50 text-indigo-600",
                housekeeping: "bg-emerald-50 text-emerald-600",
              };
              return (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[r.work_type?.toLowerCase()] || "bg-gray-100 text-gray-600"}`}>
                  {r.work_type ?? "—"}
                </span>
              );
            },
          },
          {
            key: "vendor",
            label: "Vendor",
            accessor: (r) => <span className="text-sm text-gray-700 font-medium">{r.vendor ?? "—"}</span>,
          },
          {
            key: "status_type",
            label: "Status",
            accessor: (r) => {
              const status = r.status_type?.toLowerCase();
              const colorMap = {
                active: "bg-green-100 text-green-700",
                inactive: "bg-gray-200 text-gray-700",
                pending: "bg-yellow-100 text-yellow-700",
                approved: "bg-purple-100 text-purple-700",
              };
              return (
                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${colorMap[status] || "bg-gray-100 text-gray-600"}`}>
                  {status ?? "—"}
                </span>
              );
            },
          },
          {
            key: "validity",
            label: "Validity",
            accessor: (r) => (
              <div className="text-sm text-gray-700 leading-tight">
                <div><span className="text-gray-400 text-xs">From: </span>{r.valid_from ? new Date(r.valid_from).toLocaleDateString("en-IN") : "—"}</div>
                <div><span className="text-gray-400 text-xs">To: </span>{r.valid_till ? new Date(r.valid_till).toLocaleDateString("en-IN") : "—"}</div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default StaffDashboard;