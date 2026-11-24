import React from "react";

// Shared Active / Disabled / Partially Disabled status badge for the
// Checklist and PPM Checklist (schedule) list pages — used together with
// DisableEnableScheduleModal. `row.active` alone only tells you about a
// full "All" disable; `row.disabled_summary` (batched on the backend, see
// ChecklistsController#load_disabled_summaries) additionally surfaces a
// partial disable (Upcoming / Overdue / a specific date range) that leaves
// the schedule itself active — a plain Active/Disabled flag would hide that
// entirely, which is the actual bug this fixes.
const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const buildTooltip = (summary) => {
  if (!summary || summary.total === 0) return "";
  const parts = [];
  if (summary.overdue > 0) parts.push(`${summary.overdue} overdue`);
  if (summary.upcoming > 0) parts.push(`${summary.upcoming} upcoming`);

  const noun = summary.total === 1 ? "occurrence" : "occurrences";
  let text = `${summary.total} ${noun} disabled`;
  if (parts.length) text += ` (${parts.join(", ")})`;

  const start = formatDate(summary.min_date);
  const end = formatDate(summary.max_date);
  if (start && end) text += ` — ${start} to ${end}`;

  return text;
};

const ScheduleStatusBadge = ({ row }) => {
  if (row.active === false) {
    return <span className="text-red-500 font-medium">Disabled</span>;
  }

  const summary = row.disabled_summary;
  if (summary && summary.total > 0) {
    return (
      <span
        className="text-amber-600 font-medium cursor-help border-b border-dotted border-amber-600"
        title={buildTooltip(summary)}
      >
        Partially Disabled
      </span>
    );
  }

  return <span className="text-green-600 font-medium">Active</span>;
};

export default ScheduleStatusBadge;
