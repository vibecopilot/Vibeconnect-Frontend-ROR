import React, { useEffect, useMemo, useState } from "react";
import { FaDownload, FaCalendarAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { getVisitorAnalytics, getExportVisitors, getVisitorsDashboardDrill } from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import DetailPopup from "../../components/DetailPopup";



const STAT_CONFIG = [
  { key: "total", title: "Total Visitors", subtitle: "All time visitors", accent: "#1D4ED8", drillFilter: "total" },
  { key: "in", title: "Total In", subtitle: "Currently inside", accent: "#10B981", drillFilter: "in" },
  { key: "out", title: "Total Out", subtitle: "Currently out", accent: "#F59E0B", drillFilter: "out" },
  { key: "today", title: "Today's Visitors", subtitle: "Today", accent: "#06B6D4", drillFilter: "today" },
  { key: "today_in", title: "Today's In", subtitle: "Today check-in", accent: "#8B5CF6", drillFilter: "today_in" },
  { key: "today_out", title: "Today's Out", subtitle: "Today check-out", accent: "#EC4899", drillFilter: "today_out" },
  { key: "expected_v", title: "Expected", subtitle: "Pre-registered", accent: "#14B8A6", drillFilter: "expected" },
  { key: "unexpected_v", title: "Unexpected", subtitle: "Walk-in visitors", accent: "#EF4444", drillFilter: "unexpected" },
];

const formatDateForApi = (isoDate) => {
  if (!isoDate) return null;
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return null;
  return `${day}/${month}/${year}`;
};

const IconBtn = ({ onClick, children, title, disabled = false }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    disabled={disabled}
    className={[
      "h-9 w-10 rounded-lg grid place-items-center transition",
      disabled
        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
        : "bg-gray-100 hover:bg-gray-200 text-gray-700",
    ].join(" ")}
  >
    {children}
  </button>
);

const StatCard = ({ title, value, accent, subtitle }) => (
  <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] p-5">
    <div
      className="h-1 w-full rounded-full mb-4"
      style={{ backgroundColor: accent, opacity: 0.9 }}
    />
    <p className="text-[15px] font-bold text-gray-900 truncate">{title}</p>
    {subtitle ? (
      <p className="text-sm text-gray-500 mt-0.5 truncate">{subtitle}</p>
    ) : null}
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

const VisitorsDashboard = () => {
  const siteId = getItemInLocalStorage("SITEID");
  const companyId = getItemInLocalStorage("COMPANYID");
  const isCompany55 = String(companyId) === "55";

  const [rawStats, setRawStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [tempFromDate, setTempFromDate] = useState("");
  const [tempToDate, setTempToDate] = useState("");
  const [showDlModal, setShowDlModal] = useState(false);
  const [dlStart, setDlStart] = useState("");
  const [dlEnd, setDlEnd] = useState("");

  const [detailPopup, setDetailPopup] = useState({
    open: false,
    title: "",
    records: [],
    loading: false,
  });
  const [detailPage, setDetailPage] = useState(1);
  const [detailTotalPages, setDetailTotalPages] = useState(1);
  const [detailFilter, setDetailFilter] = useState({ filterKey: "", title: "" });

  const fetchDrillRecords = async (filterKey, title, page = 1) => {
    setDetailPopup((p) => ({ ...p, open: true, title, loading: true, records: [] }));
    setDetailFilter({ filterKey, title });
    setDetailPage(page);

    try {
      const rangeFrom = formatDateForApi(fromDate);
      const rangeTo = formatDateForApi(toDate);

      const res = await getVisitorsDashboardDrill(
        filterKey,              // count_type  e.g. "total"
        filterKey,              // count_value e.g. "total"
        siteId,
        page,                   // record_page
        rangeFrom || undefined,
        rangeTo || undefined
      );

      const bucket = res?.data?.[filterKey] ?? res?.data ?? {};
      const records = Array.isArray(bucket?.records) ? bucket.records : [];
      const total = bucket?.count ?? bucket?.total ?? records.length;
      const perPage = bucket?.per_page ?? 10;
      const totalPages = perPage > 0 ? Math.max(1, Math.ceil(total / perPage)) : 1;

      setDetailTotalPages(totalPages);
      setDetailPopup({ open: true, title, records, loading: false });

    } catch (err) {
      console.error("Visitor drill error:", err);
      toast.error("Failed to load visitor details");
      setDetailPopup((p) => ({ ...p, loading: false }));
    }
  };

  const handleCardClick = (filterKey, title) => fetchDrillRecords(filterKey, title, 1);

  const onDetailPageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > detailTotalPages) return;
    fetchDrillRecords(detailFilter.filterKey, detailFilter.title, nextPage);
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, siteId]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const rangeFrom = formatDateForApi(fromDate);
      const rangeTo = formatDateForApi(toDate);
      const resp = await getVisitorAnalytics(rangeFrom, rangeTo, siteId);
      setRawStats(resp?.data || {});
    } catch (err) {
      console.error("Error fetching visitors dashboard:", err);
      toast.error("Failed to load visitors dashboard");
    } finally {
      setLoading(false);
    }
  };

  /* Build visible cards from API response; rename expected/unexpected by company */
  const visibleCards = useMemo(() => {
    return STAT_CONFIG
      .filter((cfg) => rawStats[cfg.key] !== undefined)
      .map((cfg) => {
        let title = cfg.title;
        if (cfg.key === "expected_v") title = isCompany55 ? "Planned" : "Expected";
        if (cfg.key === "unexpected_v") title = isCompany55 ? "Unplanned" : "Unexpected";
        return { ...cfg, title, value: rawStats[cfg.key] };
      });
  }, [rawStats, isCompany55]);

  /* ── Download helpers ────────────────────────────────────────────────────── */
  const downloadBlob = (response, filename) => {
    const contentType =
      response?.headers?.["content-type"] ||
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  const handleVisitorsDownload = async ({ mode = "overall", range = null } = {}) => {
    const toastId = toast.loading("Downloading… Please wait");
    try {
      let response;
      if (mode === "date" && range?.start && range?.end) {
        response = await getExportVisitors(range.start, range.end, null);
        downloadBlob(response, `visitors_${range.start}_to_${range.end}.xlsx`);
      } else {
        response = await getExportVisitors();
        const s = new Date();
        const ym = `${s.getFullYear()}${String(s.getMonth() + 1).padStart(2, "0")}${String(s.getDate()).padStart(2, "0")}`;
        downloadBlob(response, `visitors_export_${ym}.xlsx`);
      }
      toast.success("Downloaded successfully");
      setShowDlModal(false);
    } catch (error) {
      console.error("Error downloading visitors report:", error);
      toast.error("Failed to download. Please try again.");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const openDlModal = () => {
    const today = new Date().toISOString().split("T")[0];
    setDlStart(today);
    setDlEnd(today);
    setShowDlModal(true);
  };

  return (
    <div className="w-full px-3 pb-4">
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
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
        <IconBtn title="Download visitors report" onClick={openDlModal}>
          <FaDownload className="text-sm" />
        </IconBtn>
      </div>

      {/* ── Date filter modal ────────────────────────────────────────────────── */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-5">
            <h3 className="text-lg font-semibold text-gray-900">Filter Visitors by Date</h3>
            <p className="text-sm text-gray-500 mt-1">
              Choose start and end date to refresh dashboard.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={tempFromDate}
                  onChange={(e) => setTempFromDate(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  End Date
                </label>
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

      {/* ── Stat cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          : visibleCards.map((cfg) => (
            <div
              key={cfg.key}
              onClick={() => handleCardClick(cfg.drillFilter, cfg.title)}
              className="cursor-pointer"
            >
              <StatCard
                title={cfg.title}
                subtitle={cfg.subtitle}
                value={cfg.value}
                accent={cfg.accent}
              />
            </div>
          ))
        }
      </div>

      <DetailPopup
        isOpen={detailPopup.open}
        onClose={() => setDetailPopup((p) => ({ ...p, open: false }))}
        title={detailPopup.title}
        subtitle={`Page ${detailPage} of ${detailTotalPages}`}
        records={detailPopup.records}
        loading={detailPopup.loading}
        page={detailPage}
        totalPages={detailTotalPages}
        onPageChange={onDetailPageChange}
        columns={[
          { key: "name", label: "Name", accessor: (r) => r.name },
          { key: "contact_no", label: "Mobile", accessor: (r) => r.contact_no },
          { key: "purpose", label: "Purpose", accessor: (r) => r.purpose },
          { key: "coming_from", label: "Coming From", accessor: (r) => r.coming_from },
          { key: "expected_date", label: "Date", accessor: (r) => r.expected_date },
          { key: "visit_type", label: "Type", accessor: (r) => r.visit_type },
          { key: "company_name", label: "Company", accessor: (r) => r.company_name },
        ]}
      />

      {/* ── Download modal ───────────────────────────────────────────────────── */}
      {showDlModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.18)] p-5 relative">
            <button
              onClick={() => setShowDlModal(false)}
              className="absolute top-4 right-4 h-9 w-9 rounded-lg bg-gray-100 hover:bg-gray-200 grid place-items-center text-gray-700"
              title="Close"
            >
              ✕
            </button>

            <p className="text-[18px] font-bold text-gray-900">Download Visitors Report</p>
            <p className="text-sm text-gray-500 mt-1">Download all records or choose a date range.</p>

            <div className="mt-5 rounded-xl border border-gray-100 p-4">
              <p className="font-semibold text-gray-900">Download All Records</p>
              <button
                onClick={() => handleVisitorsDownload({ mode: "overall" })}
                className="mt-3 w-full h-11 rounded-xl bg-gray-900 text-white hover:bg-black transition flex items-center justify-center gap-2"
              >
                <FaDownload /> Download All
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-gray-100 p-4">
              <p className="font-semibold text-gray-900">Download by Date Range</p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={dlStart}
                    onChange={(e) => setDlStart(e.target.value)}
                    className="w-full h-10 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={dlEnd}
                    onChange={(e) => setDlEnd(e.target.value)}
                    className="w-full h-10 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  if (!dlStart || !dlEnd) { toast.error("Please select both dates"); return; }
                  if (new Date(dlStart) > new Date(dlEnd)) { toast.error("Start must be before end"); return; }
                  handleVisitorsDownload({ mode: "date", range: { start: dlStart, end: dlEnd } });
                }}
                disabled={!dlStart || !dlEnd}
                className="mt-4 w-full h-11 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-300 disabled:text-gray-600 transition flex items-center justify-center gap-2"
              >
                <FaCalendarAlt /> Download Date Range
              </button>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowDlModal(false)}
                className="h-10 px-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default VisitorsDashboard;