import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const trendColor = (delta, higherIsBetter = true) => {
  if (delta === 0) return "text-gray-400";
  const good = higherIsBetter ? delta > 0 : delta < 0;
  return good ? "text-emerald-400" : "text-red-400";
};

const TrendBadge = ({ delta, higherIsBetter = true, label }) => {
  const color = trendColor(delta, higherIsBetter);
  const Icon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${color}`}>
      <Icon size={12} />
      {Math.abs(delta).toFixed(1)}{label || "%"}
      <span className="text-gray-500 font-normal">vs prev</span>
    </span>
  );
};

const MetricCard = ({ title, icon: Icon, accent, value, unit = "%", delta, higherIsBetter = true, stats = [], onClick, loading }) => {
  return (
    <button
      onClick={onClick}
      className="text-left w-full bg-[#131720] rounded-xl border border-white/5 hover:border-white/10 transition-all duration-200 overflow-hidden group"
      style={{ borderTop: `2px solid ${accent}` }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: accent + "22" }}>
              <Icon size={16} style={{ color: accent }} />
            </div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider leading-tight">{title}</span>
          </div>
          <span className="text-xs text-gray-600 group-hover:text-gray-400 transition-colors">↗ drill</span>
        </div>

        {loading ? (
          <div className="h-8 w-24 bg-white/5 animate-pulse rounded mb-2" />
        ) : (
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold text-white tabular-nums" style={{ fontFamily: "'SF Mono', monospace" }}>
              {value ?? "—"}
            </span>
            <span className="text-sm text-gray-500 mb-1">{unit}</span>
          </div>
        )}

        {delta !== undefined && !loading && (
          <TrendBadge delta={delta} higherIsBetter={higherIsBetter} />
        )}

        {stats.length > 0 && !loading && (
          <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-3 gap-2">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-xs text-gray-500">{s.label}</div>
                <div className="text-sm font-semibold" style={{ color: s.color || "white" }}>
                  {s.value ?? "—"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </button>
  );
};

export default MetricCard;
