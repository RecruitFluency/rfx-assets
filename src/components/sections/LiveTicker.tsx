import { ATHLETES } from "../../data/athletes";

// Broadcast-style commitment ticker that loops infinitely.
const FEED = [
  ...ATHLETES.map(
    (a) => `${a.name.toUpperCase()} → ${a.program} · ${a.division} · Match ${a.matchScore}`
  ),
  "TRANSFER PORTAL · 4,182 ACTIVE ENTRIES",
  "RFX INTELLIGENCE · 918,440 MATCHES PROCESSED TODAY",
  "NEW PATHWAY DETECTED · MIDFIELD GAP CLOSED IN 0.4s",
];

export function LiveTicker() {
  const doubled = [...FEED, ...FEED];
  return (
    <div className="relative z-10 border-y border-white/[0.06] bg-black/40 py-3 backdrop-blur">
      <div className="flex items-center gap-4">
        <div className="ml-4 flex shrink-0 items-center gap-2 rounded-full bg-velocity/15 px-3 py-1">
          <span className="h-2 w-2 animate-pulse rounded-full bg-velocity" />
          <span className="font-mono text-[10px] font-700 uppercase tracking-widest text-velocity-bright">
            Live
          </span>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex w-max animate-ticker gap-8 whitespace-nowrap">
            {doubled.map((item, i) => (
              <span key={i} className="flex items-center gap-8 font-mono text-xs text-silver-dim">
                <span className="text-electric-bright">◆</span>
                <span className="tracking-wide">{item}</span>
              </span>
            ))}
          </div>
          {/* edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-carbon to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-carbon to-transparent" />
        </div>
      </div>
    </div>
  );
}
