const arcPath = (cx, cy, r, startDeg, endDeg) => {
  const toRad = (d) => ((d - 90) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startDeg));
  const y1 = cy + r * Math.sin(toRad(startDeg));
  const x2 = cx + r * Math.cos(toRad(endDeg));
  const y2 = cy + r * Math.sin(toRad(endDeg));
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
};

const scoreColor = (v) => {
  if (v >= 80) return "#34d399";
  if (v >= 60) return "#facc15";
  return "#f87171";
};

const HealthGauge = ({ value = 0, size = 160, label = "", sublabel = "" }) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const stroke = size * 0.085;
  const filled = Math.min(Math.max(value, 0), 100);
  const endDeg = -150 + (filled / 100) * 300;
  const color = scoreColor(filled);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size * 0.78} viewBox={`0 0 ${size} ${size * 0.78}`}>
        {/* Track */}
        <path
          d={arcPath(cx, cy, r, -150, 150)}
          fill="none"
          stroke="#1e2435"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* Value arc */}
        {filled > 0 && (
          <path
            d={arcPath(cx, cy, r, -150, endDeg)}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
          />
        )}
        {/* Center text */}
        <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize={size * 0.22} fontWeight="700" fontFamily="monospace">
          {filled.toFixed(0)}
        </text>
        <text x={cx} y={cy + size * 0.13} textAnchor="middle" fill="#6b7280" fontSize={size * 0.08}>
          /100
        </text>
      </svg>
      {label && <div className="text-sm font-semibold text-white mt-1 text-center leading-tight">{label}</div>}
      {sublabel && <div className="text-xs text-gray-500 mt-0.5 text-center">{sublabel}</div>}
    </div>
  );
};

export default HealthGauge;
