import { useState } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { SPORTS, DIVISIONS, type SportCategory } from "../../data/sports";
import { useReveal } from "../../hooks/useInteractions";
import { cn } from "../../lib/utils";

const FILTERS: ("All" | SportCategory)[] = [
  "All",
  "Team",
  "Individual",
  "Combat",
  "Aquatic",
  "Emerging",
];

export function SportsCoverage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const { ref, visible } = useReveal<HTMLDivElement>();

  const sports = SPORTS.filter((s) => filter === "All" || s.category === filter);

  return (
    <section id="sports" className="relative z-10 scroll-mt-24 py-24 md:py-32">
      <div className="rfx-container">
        <SectionHeader
          eyebrow="Sport-Agnostic Architecture"
          title="Every sport."
          accent="No exceptions."
          description="From football stadiums to esports arenas, RFX treats every collegiate sport as first-class. One intelligence layer, infinitely adaptable."
        />

        {/* division legend */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {DIVISIONS.map((d) => (
            <span key={d.id} className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-silver-dim">
              <span className="h-2 w-2 rounded-full" style={{ background: d.color, boxShadow: `0 0 8px ${d.color}` }} />
              {d.label}
            </span>
          ))}
        </div>

        {/* category filters */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              data-cursor
              className={cn(
                "rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-all",
                filter === f
                  ? "border-electric/60 bg-electric/15 text-white"
                  : "border-white/10 text-silver-dim hover:border-white/25 hover:text-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* sports grid */}
        <div
          ref={ref}
          className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        >
          {sports.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-white/8 bg-graphite-2/60 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-electric/40",
                visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              )}
              style={{ transitionDelay: `${(i % 10) * 50}ms` }}
            >
              <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-electric/10 blur-2xl transition-opacity duration-500 group-hover:bg-electric/25" />
              <div className="text-3xl transition-transform duration-500 group-hover:scale-110">{s.icon}</div>
              <div className="mt-3 font-display text-base font-600 text-white">{s.name}</div>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-mono text-[10px] text-silver-dim">{s.athletes} athletes</span>
                <span className="font-mono text-[10px] text-electric-bright">{s.programs}▸</span>
              </div>
              {/* hover sweep line */}
              <div className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 bg-gradient-to-r from-electric via-plasma to-velocity transition-transform duration-500 group-hover:scale-x-100" />
            </div>
          ))}
        </div>

        <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-widest text-silver-dim/70">
          + all emerging & adaptive collegiate sports
        </p>
      </div>
    </section>
  );
}
