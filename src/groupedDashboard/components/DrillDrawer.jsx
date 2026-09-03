import { X } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from "recharts";

const COLORS = ["#34d399", "#facc15", "#f87171", "#60a5fa", "#a78bfa", "#fb923c"];

const DrillDrawer = ({ open, onClose, title, accent, data, type }) => {
  if (!open) return null;

  const renderContent = () => {
    if (!data?.summary) return <p className="text-gray-400 text-sm">No data available.</p>;

    const s = data.summary;

    // Build chart + table based on metric type
    if (type === "ticket_sla") {
      const chart = [
        { name: "Within SLA", value: s.within_sla || 0, color: "#34d399" },
        { name: "At Risk", value: s.at_risk || 0, color: "#facc15" },
        { name: "Breached", value: s.breached || 0, color: "#f87171" },
      ];
      const records = data.records?.within_sla || [];
      return <BreakdownView chart={chart} records={records} keys={["ref_no", "description", "status_name", "created_at"]} />;
    }

    if (type === "ppm") {
      const chart = [
        { name: "Completed", value: s.completed || 0, color: "#34d399" },
        { name: "Pending", value: s.pending || 0, color: "#60a5fa" },
        { name: "Overdue", value: s.overdue || 0, color: "#f87171" },
        { name: "Missed", value: s.missed || 0, color: "#facc15" },
      ];
      return <BreakdownView chart={chart} records={[]} />;
    }

    if (type === "asset") {
      const chart = [
        { name: "Operational", value: s.operational || 0, color: "#34d399" },
        { name: "Maintenance", value: s.maintenance || 0, color: "#facc15" },
        { name: "Critical", value: s.critical || 0, color: "#fb923c" },
        { name: "Offline", value: s.offline || 0, color: "#f87171" },
      ];
      const records = data.records?.operational || [];
      return <BreakdownView chart={chart} records={records} keys={["name", "asset_type", "location"]} />;
    }

    if (type === "workforce") {
      const chart = [
        { name: "Present", value: s.present || 0, color: "#34d399" },
        { name: "Absent", value: s.absent || 0, color: "#f87171" },
      ];
      return <BreakdownView chart={chart} records={[]} />;
    }

    if (type === "vendor") {
      const chart = [
        { name: "Compliant", value: s.compliant || 0, color: "#34d399" },
        { name: "At Risk", value: s.at_risk || 0, color: "#facc15" },
        { name: "Non-Compliant", value: s.non_compliant || 0, color: "#f87171" },
      ];
      const records = [
        ...(data.records?.at_risk || []),
        ...(data.records?.non_compliant || []),
      ];
      return <BreakdownView chart={chart} records={records} keys={["name", "status", "end_date"]} />;
    }

    if (type === "compliance") {
      const chart = [
        { name: "Compliant", value: s.compliant || 0, color: "#34d399" },
        { name: "Non-Compliant", value: s.non_compliant || 0, color: "#f87171" },
        { name: "Pending", value: s.pending || 0, color: "#60a5fa" },
      ];
      return <BreakdownView chart={chart} records={[]} />;
    }

    if (type === "visitors") {
      const chart = [
        { name: "Checked In", value: s.checked_in || 0, color: "#34d399" },
        { name: "Checked Out", value: s.checked_out || 0, color: "#60a5fa" },
        { name: "Inside", value: s.currently_inside || 0, color: "#a78bfa" },
      ];
      return <BreakdownView chart={chart} records={[]} />;
    }

    if (type === "resolution") {
      const records = data.records?.complaints || [];
      return (
        <div>
          <div className="mb-4 text-center">
            <div className="text-5xl font-bold text-white mb-1" style={{ fontFamily: "monospace" }}>{s.hours ?? "—"}<span className="text-xl text-gray-400 ml-1">hrs</span></div>
            <div className="text-gray-500 text-sm">avg. resolution time</div>
          </div>
          <RecordsTable records={records} keys={["ref_no", "description", "resolution_time"]} />
        </div>
      );
    }

    return <p className="text-gray-400 text-sm">No breakdown available.</p>;
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50" onClick={onClose} />
      <div className="w-full max-w-lg bg-[#131720] border-l border-white/10 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/10" style={{ borderLeftColor: accent, borderLeftWidth: 3 }}>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const BreakdownView = ({ chart, records, keys }) => (
  <div>
    <div className="h-48 mb-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chart} barSize={32}>
          <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: "#0b0d11", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e5e7eb" }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chart.map((entry, i) => <Cell key={i} fill={entry.color || COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
    <RecordsTable records={records} keys={keys} />
  </div>
);

const RecordsTable = ({ records, keys }) => {
  if (!records || records.length === 0) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs text-left">
        <thead>
          <tr className="border-b border-white/10">
            {keys.map((k) => (
              <th key={k} className="py-2 pr-3 text-gray-500 font-medium capitalize">
                {k.replace(/_/g, " ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.slice(0, 20).map((row, i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-white/5">
              {keys.map((k) => (
                <td key={k} className="py-2 pr-3 text-gray-300 max-w-[120px] truncate">
                  {row[k] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DrillDrawer;
