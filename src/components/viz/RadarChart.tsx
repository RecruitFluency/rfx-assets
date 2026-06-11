import { radarPoints } from "../../lib/utils";
import type { RadarAxis } from "../../data/athletes";

// Broadcast-grade radar/spider chart for athlete attribute profiles.
export function RadarChart({
  axes,
  size = 240,
  accent = "#2e8bff",
}: {
  axes: RadarAxis[];
  size?: number;
  accent?: string;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 34;
  const values = axes.map((a) => a.value);
  const poly = radarPoints(values, radius, cx, cy);
  const full = radarPoints(axes.map(() => 100), radius, cx, cy);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full overflow-visible">
      <defs>
        <radialGradient id={`radar-fill-${accent}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.08" />
        </radialGradient>
      </defs>

      {/* concentric grid rings */}
      {[0.25, 0.5, 0.75, 1].map((r) => (
        <polygon
          key={r}
          points={radarPoints(axes.map(() => r * 100), radius, cx, cy)}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={1}
        />
      ))}

      {/* spokes + labels */}
      {axes.map((a, i) => {
        const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
        const lx = cx + Math.cos(angle) * (radius + 18);
        const ly = cy + Math.sin(angle) * (radius + 18);
        const ex = cx + Math.cos(angle) * radius;
        const ey = cy + Math.sin(angle) * radius;
        return (
          <g key={a.label}>
            <line x1={cx} y1={cy} x2={ex} y2={ey} stroke="rgba(255,255,255,0.06)" />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-silver-dim font-mono"
              style={{ fontSize: 8.5, letterSpacing: 0.5 }}
            >
              {a.label}
            </text>
          </g>
        );
      })}

      {/* data polygon */}
      <polygon
        points={poly}
        fill={`url(#radar-fill-${accent})`}
        stroke={accent}
        strokeWidth={2}
        style={{ filter: `drop-shadow(0 0 8px ${accent}88)` }}
      >
        <animate attributeName="points" from={full} to={poly} dur="0.9s" fill="freeze" calcMode="spline" keySplines="0.22 1 0.36 1" />
      </polygon>

      {/* vertices */}
      {values.map((v, i) => {
        const angle = (Math.PI * 2 * i) / values.length - Math.PI / 2;
        const r = (v / 100) * radius;
        return (
          <circle
            key={i}
            cx={cx + Math.cos(angle) * r}
            cy={cy + Math.sin(angle) * r}
            r={2.5}
            fill="#fff"
            stroke={accent}
            strokeWidth={1.5}
          />
        );
      })}
    </svg>
  );
}
