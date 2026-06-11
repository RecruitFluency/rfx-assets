import { smoothPath } from "../../lib/utils";
import type { TimelinePoint } from "../../data/athletes";

// Predictive development curve. Solid past, dashed AI projection, with a
// confidence band — Formula-1 telemetry energy.
export function DevelopmentCurve({
  data,
  accent = "#2e8bff",
  height = 180,
}: {
  data: TimelinePoint[];
  accent?: string;
  height?: number;
}) {
  const W = 520;
  const H = height;
  const padX = 18;
  const padY = 24;
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;

  const projectionStart = data.findIndex((d) => d.label.toLowerCase().includes("proj"));
  const splitIndex = projectionStart === -1 ? data.length : projectionStart - 1;

  const pts: [number, number][] = data.map((d, i) => [
    padX + (innerW * i) / (data.length - 1),
    padY + innerH - (d.value / 100) * innerH,
  ]);

  const solidPts = pts.slice(0, splitIndex + 1);
  const dashPts = pts.slice(Math.max(0, splitIndex));

  const solidPath = smoothPath(solidPts);
  const dashPath = smoothPath(dashPts);
  const areaPath = `${solidPath} L ${solidPts[solidPts.length - 1][0]} ${H - padY} L ${pts[0][0]} ${H - padY} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full overflow-visible">
      <defs>
        <linearGradient id={`dev-area-${accent}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((g) => (
        <line
          key={g}
          x1={padX}
          x2={W - padX}
          y1={padY + innerH * g}
          y2={padY + innerH * g}
          stroke="rgba(255,255,255,0.05)"
        />
      ))}

      <path d={areaPath} fill={`url(#dev-area-${accent})`} />

      {/* historical (solid) */}
      <path
        d={solidPath}
        fill="none"
        stroke={accent}
        strokeWidth={2.5}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${accent}99)` }}
      >
        <animate attributeName="stroke-dasharray" from="0 1000" to="1000 0" dur="1.2s" fill="freeze" />
      </path>

      {/* projection (dashed) */}
      <path
        d={dashPath}
        fill="none"
        stroke="#fff"
        strokeWidth={2}
        strokeDasharray="5 5"
        strokeOpacity={0.7}
        strokeLinecap="round"
      />

      {/* points + labels */}
      {pts.map((p, i) => {
        const isProj = i > splitIndex;
        return (
          <g key={i}>
            <circle cx={p[0]} cy={p[1]} r={isProj ? 3 : 3.5} fill={isProj ? "#fff" : accent} stroke="#0b0e14" strokeWidth={1.5} />
            <text x={p[0]} y={H - 6} textAnchor="middle" className="fill-silver-dim font-mono" style={{ fontSize: 8 }}>
              {data[i].label}
            </text>
          </g>
        );
      })}

      {/* projection zone label */}
      <text
        x={pts[pts.length - 1][0]}
        y={pts[pts.length - 1][1] - 10}
        textAnchor="end"
        className="fill-white font-mono"
        style={{ fontSize: 8.5, letterSpacing: 1 }}
      >
        AI PROJECTION
      </text>
    </svg>
  );
}
