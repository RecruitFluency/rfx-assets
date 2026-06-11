import { useMemo, useState } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import {
  computeMatches,
  DEFAULT_INPUTS,
  type MatchInputs,
} from "../../lib/matching";
import { cn } from "../../lib/utils";

/* The interactive centerpiece: adjust an athlete's profile and watch the
 * RFX Matching Engine re-rank program fits in real time, with animated
 * vector pathways radiating from the athlete node to each program. */

interface SliderDef {
  key: keyof MatchInputs;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  accent: string;
}

const SLIDERS: SliderDef[] = [
  { key: "gpa", label: "Academic GPA", min: 2, max: 4, step: 0.05, format: (v) => v.toFixed(2), accent: "#4b6eff" },
  { key: "athletic", label: "Athletic Composite", min: 40, max: 100, step: 1, format: (v) => `${Math.round(v)}`, accent: "#2e50d4" },
  { key: "scholarshipNeed", label: "Scholarship Need", min: 0, max: 100, step: 1, format: (v) => `${Math.round(v)}%`, accent: "#cfcfd6" },
  { key: "academicWeight", label: "Academic Priority", min: 0, max: 100, step: 1, format: (v) => `${Math.round(v)}%`, accent: "#2e50d4" },
  { key: "proximity", label: "Stay Close to Home", min: 0, max: 100, step: 1, format: (v) => `${Math.round(v)}%`, accent: "#c20017" },
];

export function MatchingEngine() {
  const [inputs, setInputs] = useState<MatchInputs>(DEFAULT_INPUTS);
  const results = useMemo(() => computeMatches(inputs), [inputs]);
  const top = results[0];

  const update = (key: keyof MatchInputs, value: number) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  // geometry for the radial pathway viz
  const W = 460;
  const H = 460;
  const cx = W / 2;
  const cy = H / 2;
  const shown = results.slice(0, 7);

  return (
    <section id="engine" className="relative z-10 scroll-mt-24 py-24 md:py-32">
      <div className="rfx-container">
        <SectionHeader
          eyebrow="RFX Matching Engine"
          title="Tune the athlete."
          accent="Watch AI rewrite the future."
          description="A live, explainable model. Move any input and vectorized pathways recalculate instantly — surfacing the programs where this athlete fits best on athletics, academics, aid, and geography."
        />

        <div className="mt-16 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)_minmax(0,0.9fr)]">
          {/* ---- Controls ---- */}
          <div className="glass rounded-3xl p-7">
            <div className="mb-6 flex items-center justify-between">
              <span className="eyebrow">Athlete Inputs</span>
              <button
                onClick={() => setInputs(DEFAULT_INPUTS)}
                className="font-mono text-[10px] uppercase tracking-widest text-silver-dim transition-colors hover:text-white"
              >
                ↺ Reset
              </button>
            </div>
            <div className="space-y-6">
              {SLIDERS.map((s) => (
                <div key={s.key}>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm text-silver">{s.label}</label>
                    <span
                      className="font-mono text-sm font-700 tabular-nums"
                      style={{ color: s.accent }}
                    >
                      {s.format(inputs[s.key])}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={inputs[s.key]}
                    onChange={(e) => update(s.key, parseFloat(e.target.value))}
                    className="rfx-range w-full"
                    style={{ ["--accent" as string]: s.accent }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ---- Radial pathway visualization ---- */}
          <div className="relative">
            <div className="neon-frame mx-auto aspect-square w-full max-w-[460px] p-4">
              <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full">
                <defs>
                  <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#4b6eff" />
                    <stop offset="60%" stopColor="#2e50d4" />
                    <stop offset="100%" stopColor="#243fb0" stopOpacity="0.2" />
                  </radialGradient>
                  <filter id="soft">
                    <feGaussianBlur stdDeviation="2.2" />
                  </filter>
                </defs>

                {/* concentric guide rings */}
                {[0.45, 0.7, 0.95].map((r, i) => (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={(W / 2.4) * r}
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeDasharray="2 6"
                  />
                ))}

                {/* pathways + program nodes */}
                {shown.map((p, i) => {
                  const angle = (Math.PI * 2 * i) / shown.length - Math.PI / 2;
                  const radius = (W / 2.4) * (1.02 - p.score / 380);
                  const px = cx + Math.cos(angle) * radius;
                  const py = cy + Math.sin(angle) * radius;
                  const strength = p.score / 100;
                  const isTop = i === 0;
                  return (
                    <g key={p.id}>
                      <line
                        x1={cx}
                        y1={cy}
                        x2={px}
                        y2={py}
                        stroke={isTop ? "#4b6eff" : p.accent}
                        strokeWidth={0.6 + strength * 3.4}
                        strokeOpacity={0.18 + strength * 0.6}
                        style={{ transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)" }}
                      />
                      {/* animated pulse traveling the pathway */}
                      <circle r={isTop ? 3 : 2} fill={isTop ? "#fff" : p.accent}>
                        <animateMotion
                          dur={`${2.4 - strength}s`}
                          repeatCount="indefinite"
                          path={`M${cx},${cy} L${px},${py}`}
                        />
                      </circle>
                      <g style={{ transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)" }}>
                        <circle
                          cx={px}
                          cy={py}
                          r={11 + strength * 9}
                          fill={p.accent}
                          fillOpacity={0.18}
                          filter="url(#soft)"
                        />
                        <circle
                          cx={px}
                          cy={py}
                          r={6 + strength * 6}
                          fill={p.accent}
                          stroke={isTop ? "#fff" : "rgba(255,255,255,0.4)"}
                          strokeWidth={isTop ? 1.5 : 0.75}
                        />
                        <text
                          x={px}
                          y={py - (14 + strength * 8)}
                          textAnchor="middle"
                          className="fill-white font-mono"
                          style={{ fontSize: 9, letterSpacing: 1 }}
                        >
                          {p.short}
                        </text>
                        <text
                          x={px}
                          y={py + 3}
                          textAnchor="middle"
                          className="fill-white font-display"
                          style={{ fontSize: 9, fontWeight: 700 }}
                        >
                          {p.score}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* central athlete node */}
                <circle cx={cx} cy={cy} r="34" fill="url(#coreGlow)" filter="url(#soft)" />
                <circle cx={cx} cy={cy} r="22" fill="#0e0e10" stroke="#4b6eff" strokeWidth="1.5" />
                <text x={cx} y={cy - 2} textAnchor="middle" className="fill-white font-display" style={{ fontSize: 11, fontWeight: 700 }}>
                  ATHLETE
                </text>
                <text x={cx} y={cy + 11} textAnchor="middle" className="fill-electric-bright font-mono" style={{ fontSize: 8 }}>
                  VECTOR · LIVE
                </text>
              </svg>
            </div>
            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-silver-dim/70">
              Pathway thickness = fit strength · pulse speed = match velocity
            </p>
          </div>

          {/* ---- Live leaderboard ---- */}
          <div className="glass rounded-3xl p-7">
            <div className="mb-5 flex items-center justify-between">
              <span className="eyebrow">AI Program Fit · Ranked</span>
              <span className="chip !text-electric-bright">{results.length} mapped</span>
            </div>

            {/* top match callout */}
            <div className="mb-5 rounded-2xl border border-white/10 p-4" style={{ background: `linear-gradient(135deg, ${top.accent}22, transparent)` }}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-silver-dim">Best Fit</span>
                <span className="font-display text-2xl font-700 text-white tabular-nums">{top.score}</span>
              </div>
              <div className="mt-1 font-display text-lg font-600 text-white">{top.name}</div>
              <div className="text-xs text-silver-dim">{top.division}</div>
            </div>

            <div className="space-y-2.5">
              {results.slice(0, 6).map((p, i) => (
                <div
                  key={p.id}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl border border-white/5 px-3 py-2.5 transition-colors hover:border-white/15",
                    i === 0 && "bg-white/[0.03]"
                  )}
                >
                  <span className="w-5 font-mono text-xs text-silver-dim">{i + 1}</span>
                  <span className="h-7 w-7 shrink-0 rounded-md" style={{ background: p.accent, boxShadow: `0 0 14px -2px ${p.accent}` }} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-500 text-white">{p.name}</div>
                    <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${p.score}%`,
                          background: `linear-gradient(90deg, ${p.accent}, #4b6eff)`,
                          transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)",
                        }}
                      />
                    </div>
                  </div>
                  <span className="font-display text-sm font-700 tabular-nums text-white">{p.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
