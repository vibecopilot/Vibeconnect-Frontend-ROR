import { useEffect, useState } from "react";
import { X, AlertTriangle, CheckCircle, Clock, WrenchIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import dashboardApi from "../api/dashboardApi.js";

const STATUS_COLOR = {
  operational: "#34d399",
  maintenance:  "#facc15",
  critical:     "#f87171",
  offline:      "#6b7280",
};

const STATUS_ICON = {
  operational: CheckCircle,
  maintenance:  WrenchIcon,
  critical:     AlertTriangle,
  offline:      Clock,
};

const SystemDrawer = ({ open, onClose, category, accent = "#34d399" }) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab,     setTab]     = useState("overview");

  useEffect(() => {
    if (!open || !category) return;
    setTab("overview");
    setData(null);
    setLoading(true);
    dashboardApi
      .get("/api/v1/grouped_dashboard/asset_drill.json", { params: { category } })
      .then((r) => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [open, category]);

  if (!open) return null;

  const s = data?.summary;

  const chartData = s
    ? [
        { name: "Operational", value: s.operational || 0, color: STATUS_COLOR.operational },
        { name: "Maintenance",  value: s.maintenance  || 0, color: STATUS_COLOR.maintenance },
        { name: "Critical",     value: s.critical     || 0, color: STATUS_COLOR.critical },
        { name: "Offline",      value: s.offline      || 0, color: STATUS_COLOR.offline },
      ]
    : [];

  const records = data?.records || [];

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60" onClick={onClose} />
      <div className="w-full max-w-xl bg-[#0f1218] border-l border-white/10 flex flex-col overflow-hidden">

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b border-white/10"
          style={{ borderLeftColor: accent, borderLeftWidth: 3 }}
        >
          <div>
            <h2 className="text-base font-semibold text-white">{category} — System View</h2>
            <p className="text-xs text-gray-500 mt-0.5">Level 2 · Asset breakdown</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 px-5">
          {["overview", "assets"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-2.5 px-3 text-xs font-medium capitalize border-b-2 transition-all ${
                tab === t
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-white/5 animate-pulse rounded-lg" />
              ))}
            </div>
          )}

          {!loading && !data && (
            <p className="text-gray-500 text-sm text-center mt-10">No data available for {category}.</p>
          )}

          {!loading && data && tab === "overview" && (
            <>
              {/* Summary tiles */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: "Total Assets",  value: s?.total,       color: "#9ca3af" },
                  { label: "Health %",      value: s ? `${((s.operational / s.total) * 100).toFixed(0)}%` : "—", color: accent },
                  { label: "Operational",   value: s?.operational, color: STATUS_COLOR.operational },
                  { label: "Critical",      value: (s?.critical || 0) + (s?.offline || 0), color: STATUS_COLOR.critical },
                ].map((item) => (
                  <div key={item.label} className="bg-[#131720] rounded-lg p-3 border border-white/5">
                    <div className="text-xl font-bold tabular-nums" style={{ color: item.color }}>
                      {item.value ?? "—"}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Status bar chart */}
              {chartData.some((d) => d.value > 0) && (
                <div className="bg-[#131720] rounded-lg border border-white/5 p-4 mb-4">
                  <p className="text-xs text-gray-500 mb-3">Status Distribution</p>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} barSize={28}>
                        <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{ background: "#0b0d11", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e5e7eb", fontSize: 12 }}
                          cursor={{ fill: "rgba(255,255,255,0.03)" }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Status count pills */}
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(STATUS_COLOR).map(([status, color]) => {
                  const count = s?.[status] || 0;
                  const Icon = STATUS_ICON[status];
                  return (
                    <div
                      key={status}
                      className="flex items-center gap-2.5 bg-[#131720] rounded-lg p-3 border border-white/5"
                    >
                      <Icon size={14} style={{ color }} />
                      <div>
                        <div className="text-sm font-semibold text-white tabular-nums">{count}</div>
                        <div className="text-[10px] text-gray-500 capitalize">{status}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {!loading && data && tab === "assets" && (
            <div className="space-y-2">
              {records.length === 0 && (
                <p className="text-gray-500 text-sm text-center mt-10">No assets found.</p>
              )}
              {records.slice(0, 100).map((a) => {
                const status = a.active === false || a.active === 0
                  ? "offline"
                  : a.critical
                  ? "critical"
                  : a.breakdown
                  ? "maintenance"
                  : "operational";
                const scolor = STATUS_COLOR[status];
                const Icon = STATUS_ICON[status];
                return (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 bg-[#131720] rounded-lg px-3 py-2.5 border border-white/5"
                  >
                    <Icon size={13} style={{ color: scolor }} className="flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-white truncate">{a.name}</div>
                      <div className="text-[10px] text-gray-500 truncate">
                        {a.asset_number && <span className="mr-2">{a.asset_number}</span>}
                        {a.location}
                      </div>
                    </div>
                    <span
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded capitalize flex-shrink-0"
                      style={{ color: scolor, background: scolor + "18" }}
                    >
                      {status}
                    </span>
                  </div>
                );
              })}
              {records.length > 100 && (
                <p className="text-xs text-gray-600 text-center pt-2">Showing 100 of {records.length}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemDrawer;
