import React, { useEffect, useMemo, useState } from "react";
import { FaDownload, FaCalendarAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { getVisitorDashboard, getExportVisitors } from "../../api";

const CHART_PALETTE = [
  "#1D4ED8", 
  "#10B981", 
  "#F59E0B", 
  "#EF4444", 
  "#8B5CF6", 
  "#06B6D4",
];

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

const StatCard = ({
  title,
  value,
  accent = CHART_PALETTE[0],
  action,
  subtitle,
}) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] p-5">
      <div
        className="h-1 w-full rounded-full"
        style={{ backgroundColor: accent, opacity: 0.9 }}
      />
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[16px] font-bold text-gray-900 truncate">{title}</p>
          {subtitle ? (
            <p className="text-sm text-gray-500 truncate mt-1">{subtitle}</p>
          ) : null}
        </div>
        <div className="shrink-0">{action}</div>
      </div>

      <div className="mt-6 flex items-center justify-center">
        <span className="text-3xl font-extrabold text-gray-900">
          {Number.isFinite(Number(value)) ? Number(value) : 0}
        </span>
      </div>
    </div>
  );
};

const VisitorsDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    today_in: 0,
    today_out: 0,
    in: 0,
    out: 0,
  });

  const [loading, setLoading] = useState(true);

  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const getTodayDate = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    let alive = true;

    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const resp = await getVisitorDashboard();
        if (!alive) return;

        setStats({
          total: resp?.data?.total ?? 0,
          today_in: resp?.data?.today_in ?? 0,
          today_out: resp?.data?.today_out ?? 0,
          in: resp?.data?.in ?? 0,
          out: resp?.data?.out ?? 0,
        });
      } catch (err) {
        console.error("Error fetching visitors dashboard:", err);
        toast.error("Failed to load visitors dashboard");
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchDashboard();
    return () => {
      alive = false;
    };
  }, []);

  const downloadBlob = (response, filename) => {
    const contentType =
      response?.headers?.["content-type"] ||
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: contentType })
    );

    const link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  const handleVisitorsDownload = async ({
    mode = "overall", 
    range = null, 
    filterType = null, 
    label = "Visitors",
  } = {}) => {
    const toastId = toast.loading("Downloading… Please wait");
    try {
      let response;

      if (mode === "date" && range?.start && range?.end) {
        response = await getExportVisitors(range.start, range.end, null);
        downloadBlob(
          response,
          `visitors_${range.start}_to_${range.end}.xlsx`
        );
      } else if (mode === "filter" && filterType) {
        response = await getExportVisitors(null, null, filterType);
        downloadBlob(response, `${label.toLowerCase().replace(/\s+/g, "_")}.xlsx`);
      } else {
        response = await getExportVisitors();
        const stamp = new Date();
        const y = stamp.getFullYear();
        const m = String(stamp.getMonth() + 1).padStart(2, "0");
        const d = String(stamp.getDate()).padStart(2, "0");
        downloadBlob(response, `visitors_export_${y}${m}${d}.xlsx`);
      }

      toast.success("Downloaded successfully");
      setShowDownloadModal(false);
    } catch (error) {
      console.error("Error downloading visitors report:", error);
      toast.error("Failed to download. Please try again.");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const openDownloadModal = () => {
    const today = getTodayDate();
    setStartDate(today);
    setEndDate(today);
    setShowDownloadModal(true);
  };

  const handleDateRangeDownload = () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Start date must be before end date");
      return;
    }

    handleVisitorsDownload({
      mode: "date",
      range: { start: startDate, end: endDate },
    });
  };

  const filterTypeMap = useMemo(
    () => ({
      "Total In": "total_in",
      "Total Out": "total_out",
      "Today's In": "today_in",
      "Today's Out": "today_out",
    }),
    []
  );

  const handleGenericDownload = (label) => {
    const filterType = filterTypeMap[label];
    if (!filterType) return;

    handleVisitorsDownload({
      mode: "filter",
      filterType,
      label,
    });
  };

  return (
    <div className="w-full px-3 pb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Visitors"
          subtitle="Overall count"
          value={loading ? 0 : stats.total}
          accent={CHART_PALETTE[0]}
          action={
            <IconBtn
              onClick={openDownloadModal}
              title="Download (overall / date range)"
              disabled={loading}
            >
              <FaDownload className="text-sm" />
            </IconBtn>
          }
        />

        <StatCard
          title="Total In"
          subtitle="Overall"
          value={loading ? 0 : stats.in}
          accent={CHART_PALETTE[1]}
          action={
            <IconBtn
              onClick={() => handleGenericDownload("Total In")}
              title="Download Total In report"
              disabled={loading}
            >
              <FaDownload className="text-sm" />
            </IconBtn>
          }
        />

        <StatCard
          title="Total Out"
          subtitle="Overall"
          value={loading ? 0 : stats.out}
          accent={CHART_PALETTE[2]}
          action={
            <IconBtn
              onClick={() => handleGenericDownload("Total Out")}
              title="Download Total Out report"
              disabled={loading}
            >
              <FaDownload className="text-sm" />
            </IconBtn>
          }
        />

        <StatCard
          title="Today's In"
          subtitle="Today"
          value={loading ? 0 : stats.today_in}
          accent={CHART_PALETTE[3]}
          action={
            <IconBtn
              onClick={() => handleGenericDownload("Today's In")}
              title="Download Today's In report"
              disabled={loading}
            >
              <FaDownload className="text-sm" />
            </IconBtn>
          }
        />

        <StatCard
          title="Today's Out"
          subtitle="Today"
          value={loading ? 0 : stats.today_out}
          accent={CHART_PALETTE[4]}
          action={
            <IconBtn
              onClick={() => handleGenericDownload("Today's Out")}
              title="Download Today's Out report"
              disabled={loading}
            >
              <FaDownload className="text-sm" />
            </IconBtn>
          }
        />
      </div>

      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.18)] p-5 relative">
            <button
              onClick={() => setShowDownloadModal(false)}
              className="absolute top-4 right-4 h-9 w-9 rounded-lg bg-gray-100 hover:bg-gray-200 grid place-items-center text-gray-700"
              title="Close"
            >
              ✕
            </button>

            <p className="text-[18px] font-bold text-gray-900">
              Download Visitors Report
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Download all records or choose a date range.
            </p>

            <div className="mt-5 rounded-xl border border-gray-100 p-4">
              <p className="font-semibold text-gray-900">Download All Records</p>
              <p className="text-sm text-gray-500 mt-1">
                Exports complete visitors report.
              </p>
              <button
                onClick={() => handleVisitorsDownload({ mode: "overall" })}
                className="mt-3 w-full h-11 rounded-xl bg-gray-900 text-white hover:bg-black transition flex items-center justify-center gap-2"
              >
                <FaDownload />
                Download
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-gray-100 p-4">
              <p className="font-semibold text-gray-900">Download by Date Range</p>
              <p className="text-sm text-gray-500 mt-1">
                Select start and end dates.
              </p>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-10 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-10 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                onClick={handleDateRangeDownload}
                disabled={!startDate || !endDate}
                className="mt-4 w-full h-11 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-300 disabled:text-gray-600 transition flex items-center justify-center gap-2"
              >
                <FaCalendarAlt />
                Download Date Range
              </button>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowDownloadModal(false)}
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
