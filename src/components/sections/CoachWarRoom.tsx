import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { useReveal } from "../../hooks/useInteractions";
import { seeded, cn } from "../../lib/utils";

/* The recruiting "war room": a coach's live command center. A composite of
 * pipeline, geography, roster gaps, and autonomous AI recommendations. */

const PIPELINE = [
  { label: "Identified", value: 1840, color: "#1c1c20" },
  { label: "Evaluated", value: 612, color: "#243fb0" },
  { label: "Contacted", value: 248, color: "#2e50d4" },
  { label: "Offered", value: 64, color: "#4b6eff" },
  { label: "Committed", value: 11, color: "#4b6eff" },
];

const GAPS = [
  { pos: "Center Back", need: 82, color: "#c20017" },
  { pos: "Striker", need: 64, color: "#cfcfd6" },
  { pos: "Goalkeeper", need: 41, color: "#2e50d4" },
  { pos: "Winger", need: 28, color: "#4b6eff" },
];

const AI_RECS = [
  { name: "Kamden Held", note: "Fills CB gap · 94% behavioral fit", score: 94, accent: "#1f6b3b" },
  { name: "Kruz Held", note: "Elite finisher · closes striker gap", score: 95, accent: "#4b2e83" },
  { name: "C. De Moor", note: "Transfer-ready · system match", score: 97, accent: "#154734" },
];

// A lightweight US-shaped recruiting heat grid.
function HeatGrid({ active }: { active: boolean }) {
  const rand = seeded(77);
  const cols = 16;
  const rows = 8;
  // a crude mask roughly resembling the continental US footprint
  const mask = (c: number, r: number) => {
    if (r === 0 && (c < 2 || c > 13)) return false;
    if (r === 7 && (c < 3 || c > 12)) return false;
    if (c === 0 && r > 4) return false;
    if (c === 15 && r > 5) return false;
    return true;
  };
  const cells: { c: number; r: number; v: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (mask(c, r)) cells.push({ c, r, v: rand() });
    }
  }
  const heat = (v: number) => {
    if (v > 0.86) return "#c20017";
    if (v > 0.7) return "#8a0d16";
    if (v > 0.5) return "#cfcfd6";
    if (v > 0.32) return "#2e50d4";
    return "#18233f";
  };
  return (
    <div
      className="grid gap-1"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
    >
      {Array.from({ length: rows * cols }).map((_, idx) => {
        const c = idx % cols;
        const r = Math.floor(idx / cols);
        const cell = cells.find((x) => x.c === c && x.r === r);
        if (!cell) return <div key={idx} />;
        return (
          <div
            key={idx}
            className="aspect-square rounded-[3px] transition-all duration-700"
            style={{
              background: active ? heat(cell.v) : "#141417",
              opacity: active ? 0.35 + cell.v * 0.65 : 0.3,
              boxShadow: active && cell.v > 0.7 ? `0 0 8px ${heat(cell.v)}` : "none",
              transitionDelay: `${idx * 6}ms`,
            }}
          />
        );
      })}
    </div>
  );
}

export function CoachWarRoom() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [tick, setTick] = useState(0);
  const liveRef = useRef(0);

  // simulate live commit-probability counter
  useEffect(() => {
    const t = setInterval(() => {
      liveRef.current = (liveRef.current + 1) % 100;
      setTick((x) => x + 1);
    }, 90);
    return () => clearInterval(t);
  }, []);

  const maxPipe = PIPELINE[0].value;

  return (
    <section id="warroom" className="relative z-10 scroll-mt-24 py-24 md:py-32">
      <div className="rfx-container">
        <SectionHeader
          eyebrow="Coach War Room"
          title="A recruiting"
          accent="command center."
          description="Pipeline visualization, roster gap analysis, geographic heat mapping, and autonomous AI recommendations — every signal a staff needs, rendered live."
        />

        <div ref={ref} className={cn("mt-14 transition-all duration-700", visible ? "opacity-100" : "opacity-0")}>
          {/* top bar */}
          <div className="glass-strong flex flex-wrap items-center justify-between gap-4 rounded-t-3xl border-b border-white/[0.06] px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5"><span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-mint opacity-60" /><span className="h-2.5 w-2.5 rounded-full bg-mint" /></span>
              <span className="font-display text-sm font-600 text-white">RFX War Room</span>
              <span className="chip">Men's Soccer · D-I</span>
            </div>
            <div className="flex items-center gap-5 font-mono text-[10px] uppercase tracking-widest text-silver-dim">
              <span>Class of 2026</span>
              <span className="text-mint">● Synced {String(tick % 60).padStart(2, "0")}s ago</span>
            </div>
          </div>

          <div className="glass grid grid-cols-1 gap-4 rounded-b-3xl p-4 md:p-6 lg:grid-cols-12">
            {/* pipeline funnel */}
            <div className="rounded-2xl border border-white/8 bg-black/30 p-5 lg:col-span-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-silver-dim">Recruiting Pipeline</span>
                <span className="font-mono text-[10px] text-electric-bright">▸ live</span>
              </div>
              <div className="space-y-2">
                {PIPELINE.map((p, i) => (
                  <div key={p.label} className="flex items-center gap-3">
                    <span className="w-20 shrink-0 text-right font-mono text-[10px] uppercase tracking-wide text-silver-dim">{p.label}</span>
                    <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-white/[0.03]">
                      <div
                        className="flex h-full items-center justify-end rounded-md px-2 transition-all duration-1000 ease-out"
                        style={{
                          width: visible ? `${(p.value / maxPipe) * 100}%` : "0%",
                          background: `linear-gradient(90deg, ${p.color}, ${p.color}cc)`,
                          transitionDelay: `${i * 120}ms`,
                          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15)`,
                        }}
                      >
                        <span className="font-display text-xs font-700 text-white">{p.value.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-lg bg-mint/10 px-3 py-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-mint">Conversion</span>
                <span className="font-display text-sm font-700 text-mint">0.60% → optimized 1.4%</span>
              </div>
            </div>

            {/* heat map */}
            <div className="rounded-2xl border border-white/8 bg-black/30 p-5 lg:col-span-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-silver-dim">Recruiting Heat Map</span>
                <span className="font-mono text-[10px] text-velocity-bright">USA</span>
              </div>
              <HeatGrid active={visible} />
              <div className="mt-4 flex items-center justify-between font-mono text-[9px] uppercase tracking-wide text-silver-dim">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-[#18233f]" /> Cold</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-[#2e50d4]" /> Active</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-[#cfcfd6]" /> Warm</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-velocity" /> Hot</span>
              </div>
            </div>

            {/* roster gaps + AI recs */}
            <div className="flex flex-col gap-4 lg:col-span-3">
              <div className="rounded-2xl border border-white/8 bg-black/30 p-5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-silver-dim">Roster Gap Analysis</span>
                <div className="mt-3 space-y-2.5">
                  {GAPS.map((g, i) => (
                    <div key={g.pos}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-silver">{g.pos}</span>
                        <span className="font-mono font-700" style={{ color: g.color }}>{g.need}%</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/5">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: visible ? `${g.need}%` : "0%", background: g.color, transitionDelay: `${i * 100}ms` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-electric/20 bg-electric/[0.05] p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-sm">✦</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-electric-bright">RFX Recommends</span>
                </div>
                <div className="space-y-2">
                  {AI_RECS.map((r) => (
                    <div key={r.name} className="flex items-center gap-2.5 rounded-lg bg-white/[0.03] p-2">
                      <span className="h-7 w-7 shrink-0 rounded-md" style={{ background: r.accent }} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12px] font-600 text-white">{r.name}</div>
                        <div className="truncate font-mono text-[8.5px] text-silver-dim">{r.note}</div>
                      </div>
                      <span className="font-display text-sm font-700 text-white">{r.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
