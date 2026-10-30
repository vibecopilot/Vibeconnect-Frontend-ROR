const scoreColor = (v) => {
  if (v >= 80) return "#34d399";
  if (v >= 60) return "#facc15";
  return "#f87171";
};

const CATEGORY_ICONS = {
  "HVAC":             "❄️",
  "AC":               "❄️",
  "DG":               "⚡",
  "DIGI":             "📟",
  "Elevator":         "🔼",
  "Lift":             "🔼",
  "Fire & Safety":    "🔥",
  "Fire":             "🔥",
  "Water":            "💧",
  "Water & Plumbing": "💧",
  "Plumbing":         "💧",
  "plumbing":         "💧",
  "Electrical":       "⚡",
  "DKG-Electrical":   "⚡",
  "UPS":              "🔋",
  "Panel":            "🔌",
  "Laptop":           "💻",
  "Security":         "🔒",
  "Soft Services":    "🧹",
  "Test":             "🧪",
  "Uncategorized":    "📦",
};

const CategoryCard = ({ category, total, operational, health_percentage, onClick, loading }) => {
  const pct   = health_percentage ?? 0;
  const color = scoreColor(pct);
  const icon  = CATEGORY_ICONS[category] || "⚙️";
  const issues = (total ?? 0) - (operational ?? 0);

  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-[#131720] rounded-xl border border-white/5 hover:border-white/15 transition-all duration-200 overflow-hidden"
    >
      {/* Color top bar */}
      <div className="h-0.5 w-full" style={{ backgroundColor: color }} />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <div>
              <div className="text-xs font-semibold text-white leading-tight">{category}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{total ?? "—"} assets</div>
            </div>
          </div>
          <span className="text-[10px] text-gray-600 group-hover:text-gray-400 transition-colors">→ drill</span>
        </div>

        {/* Health score */}
        {loading ? (
          <div className="h-7 w-16 bg-white/5 animate-pulse rounded mb-2" />
        ) : (
          <div className="flex items-end gap-1.5 mb-2">
            <span className="text-3xl font-bold tabular-nums" style={{ color, fontFamily: "monospace" }}>
              {pct.toFixed(0)}
            </span>
            <span className="text-sm text-gray-500 mb-0.5">%</span>
            <span className="text-xs text-gray-500 mb-0.5 ml-1">health</span>
          </div>
        )}

        {/* Progress bar */}
        <div className="h-1.5 bg-white/5 rounded-full mb-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>

        {/* Stats: operational vs issues */}
        {!loading && (
          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-white/5">
            <div className="text-center">
              <div className="text-xs font-semibold text-emerald-400">{operational ?? "—"}</div>
              <div className="text-[10px] text-gray-600">Operational</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold" style={{ color: issues > 0 ? "#f87171" : "#6b7280" }}>
                {issues}
              </div>
              <div className="text-[10px] text-gray-600">Issues</div>
            </div>
          </div>
        )}
      </div>
    </button>
  );
};

export default CategoryCard;
