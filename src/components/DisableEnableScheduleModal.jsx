import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Shared "Disable"/"Enable" popup for scheduled checklists (routine + PPM —
// both are the same Checklist model under the hood, so both list pages use
// this same component). Admin picks a scope, we hand the caller a payload
// matching the backend's disable_schedule / enable_schedule endpoints:
//   { scope: "all" | "upcoming" | "overdue" | "date_range", start_date, end_date }
const SCOPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "overdue", label: "Overdue" },
  { value: "date_range", label: "Selected Date Range" },
];

const DisableEnableScheduleModal = ({ mode, checklistName, onConfirm, onCancel }) => {
  // mode: "disable" | "enable"
  const [scope, setScope] = useState("all");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isDisable = mode === "disable";
  const actionLabel = isDisable ? "Disable" : "Enable";

  const handleConfirm = async () => {
    setError("");

    if (scope === "date_range" && (!startDate || !endDate)) {
      setError("Please select both a start and end date.");
      return;
    }

    const payload = { scope };
    if (scope === "date_range") {
      payload.start_date = startDate.toISOString().split("T")[0];
      payload.end_date = endDate.toISOString().split("T")[0];
    }

    try {
      setSubmitting(true);
      await onConfirm(payload);
    } catch (err) {
      setError(
        err?.response?.data?.error || `Failed to ${actionLabel.toLowerCase()} the schedule.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[420px] shadow-lg relative">
        <button
          className="absolute top-3 right-3 text-[26px] text-gray-500 hover:text-gray-700 transition"
          onClick={onCancel}
        >
          ×
        </button>

        <h2 className="text-lg font-semibold mb-1">
          {actionLabel} Scheduled Checklist
        </h2>
        {checklistName && (
          <p className="text-sm text-gray-500 mb-4 truncate">{checklistName}</p>
        )}

        <div className="flex flex-col gap-2 mb-4">
          {SCOPE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="radio"
                name="schedule-scope"
                value={opt.value}
                checked={scope === opt.value}
                onChange={() => setScope(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>

        {scope === "date_range" && (
          <div className="flex gap-4 mb-4">
            <div className="flex flex-col">
              <label className="text-xs font-semibold mb-1">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setDateRange([date, endDate])}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Start Date"
                className="border p-2 rounded w-36 text-sm"
                dateFormat="dd/MM/yyyy"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-semibold mb-1">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setDateRange([startDate, date])}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="End Date"
                className="border p-2 rounded w-36 text-sm"
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={onCancel}
            disabled={submitting}
            className="border px-4 py-2 rounded text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className={`px-4 py-2 rounded text-sm text-white ${
              isDisable ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"
            } disabled:opacity-60`}
          >
            {submitting ? "Please wait…" : actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisableEnableScheduleModal;
