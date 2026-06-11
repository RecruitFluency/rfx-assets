import { useRef, useState } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { ATHLETES, type Athlete } from "../../data/athletes";
import { useReveal } from "../../hooks/useInteractions";
import { cn } from "../../lib/utils";

function TiltCard({
  athlete,
  index,
  onOpen,
}: {
  athlete: Athlete;
  index: number;
  onOpen: (a: Athlete) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const { ref: revealRef, visible } = useReveal<HTMLDivElement>();

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (py - 0.5) * -10;
    const ry = (px - 0.5) * 12;
    setStyle({
      transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`,
      ["--mx" as string]: `${px * 100}%`,
      ["--my" as string]: `${py * 100}%`,
    });
  };

  const reset = () =>
    setStyle({ transform: "perspective(900px) rotateX(0) rotateY(0)" });

  return (
    <div
      ref={revealRef}
      className={cn(
        "transition-all duration-700",
        visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      )}
      style={{ transitionDelay: `${(index % 4) * 80}ms` }}
    >
      <button
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        onClick={() => onOpen(athlete)}
        data-cursor
        className="group relative block w-full overflow-hidden rounded-2xl text-left transition-transform duration-200 ease-out will-change-transform"
        style={style}
      >
        <div className="neon-frame absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* image */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
          <img
            src={athlete.image}
            alt={athlete.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/20 to-transparent" />
          <div className="spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" />

          {/* match score ring */}
          <div className="absolute right-3 top-3">
            <div className="glass-strong flex flex-col items-center rounded-xl px-3 py-2">
              <span className="font-mono text-[8px] uppercase tracking-widest text-silver-dim">Match</span>
              <span className="font-display text-xl font-700 leading-none text-white">{athlete.matchScore}</span>
            </div>
          </div>

          {/* verified + status */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {athlete.verified && (
              <span className="flex items-center gap-1 rounded-full bg-electric/20 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-electric-bright backdrop-blur">
                ✓ Verified
              </span>
            )}
            {athlete.nationalRank && athlete.nationalRank <= 25 && (
              <span className="rounded-full bg-gold/20 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-gold backdrop-blur">
                #{athlete.nationalRank} National
              </span>
            )}
          </div>

          {/* bottom info */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="mb-1 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: athlete.accent }} />
              <span className="font-mono text-[9px] uppercase tracking-widest text-silver-dim">
                {athlete.position} · {athlete.division}
              </span>
            </div>
            <h3 className="font-display text-xl font-700 leading-tight text-white">{athlete.name}</h3>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-silver-dim">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"/></svg>
              {athlete.program}
            </div>

            {/* reveal-on-hover stats strip */}
            <div className="mt-3 grid max-h-0 grid-cols-3 gap-2 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
              {athlete.metrics.slice(0, 3).map((m) => (
                <div key={m.label} className="rounded-lg bg-white/5 px-2 py-1.5 text-center">
                  <div className="font-display text-sm font-700 text-white">{m.value}</div>
                  <div className="font-mono text-[7px] uppercase tracking-wide text-silver-dim">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

export function AthleteShowcase({ onOpen }: { onOpen: (a: Athlete) => void }) {
  return (
    <section id="athletes" className="relative z-10 scroll-mt-24 py-24 md:py-32">
      <div className="rfx-container">
        <SectionHeader
          eyebrow="The Commit Class"
          title="Scouting reports,"
          accent="reimagined."
          description="Every profile is a living scouting report — verified metrics, AI match scores, predictive development curves, and interactive radar intelligence. Tap any athlete to open the full report."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ATHLETES.map((a, i) => (
            <TiltCard key={a.id} athlete={a} index={i} onOpen={onOpen} />
          ))}
        </div>

        <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-widest text-silver-dim/70">
          Showing 7 of 2,700,000+ vectorized athletes
        </p>
      </div>
    </section>
  );
}
