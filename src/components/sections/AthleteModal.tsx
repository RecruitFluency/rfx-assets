import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Athlete } from "../../data/athletes";
import { RadarChart } from "../viz/RadarChart";
import { DevelopmentCurve } from "../viz/DevelopmentCurve";

// Full-screen scouting report. Cinematic entrance, glassmorphism, and the
// athlete's complete intelligence package.
export function AthleteModal({
  athlete,
  onClose,
}: {
  athlete: Athlete | null;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = athlete ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [athlete, onClose]);

  return (
    <AnimatePresence>
      {athlete && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-carbon/80 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            className="glass-strong relative z-10 grid max-h-[90vh] w-full max-w-5xl overflow-hidden overflow-y-auto rounded-3xl md:grid-cols-[0.85fr_1.15fr]"
            initial={{ scale: 0.92, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 240 }}
          >
            {/* close */}
            <button
              onClick={onClose}
              data-cursor
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-silver transition-colors hover:border-velocity hover:text-white"
              aria-label="Close"
            >
              ✕
            </button>

            {/* hero portrait */}
            <div className="relative min-h-[280px] overflow-hidden md:min-h-full">
              <img src={athlete.image} alt={athlete.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/30 to-transparent md:bg-gradient-to-r" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-electric/20 px-3 py-1 backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-electric-bright" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-electric-bright">
                    {athlete.status}
                  </span>
                </div>
                <h3 className="font-display text-3xl font-700 leading-none text-white">{athlete.name}</h3>
                <p className="mt-1 text-sm text-silver-dim">
                  {athlete.position} · {athlete.sport}
                </p>
              </div>
            </div>

            {/* report body */}
            <div className="p-6 md:p-8">
              {/* headline metrics */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { k: "Match", v: athlete.matchScore, accent: "#2e50d4" },
                  { k: "GPA", v: athlete.gpa.toFixed(2), accent: "#4b6eff" },
                  { k: "Rank", v: athlete.nationalRank ? `#${athlete.nationalRank}` : "—", accent: "#cfcfd6" },
                  { k: "Aid Prob", v: `${athlete.scholarshipProbability}%`, accent: "#c20017" },
                ].map((m) => (
                  <div key={m.k} className="rounded-xl border border-white/8 bg-white/[0.03] p-3 text-center">
                    <div className="font-display text-xl font-700 text-white" style={{ textShadow: `0 0 18px ${m.accent}55` }}>
                      {m.v}
                    </div>
                    <div className="mt-0.5 font-mono text-[8px] uppercase tracking-widest text-silver-dim">{m.k}</div>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-sm leading-relaxed text-silver-dim">{athlete.bio}</p>

              {/* radar + commit */}
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-silver-dim">Attribute Radar</div>
                  <div className="aspect-square">
                    <RadarChart axes={athlete.radar} accent={athlete.accent === "#1b3b6f" ? "#2e50d4" : "#2e50d4"} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-silver-dim">Verified Metrics</div>
                  <div className="space-y-2.5">
                    {athlete.metrics.map((m) => (
                      <div key={m.label}>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-silver-dim">{m.label}</span>
                          <span className="font-mono font-700 text-white">
                            {m.value}
                            {m.unit ? ` ${m.unit}` : ""}
                          </span>
                        </div>
                        <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/5">
                          <div className="h-full rounded-full bg-gradient-to-r from-electric to-electric-bright" style={{ width: `${m.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {athlete.tags.map((t) => (
                      <span key={t} className="chip">{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* development curve */}
              <div className="mt-6">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-silver-dim">Predictive Development Curve</span>
                  <span className="chip !text-mint">+{athlete.development[athlete.development.length - 1].value - athlete.development[3].value} proj. growth</span>
                </div>
                <div className="h-44 rounded-xl border border-white/8 bg-black/30 p-2">
                  <DevelopmentCurve data={athlete.development} accent="#2e50d4" />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button className="btn-primary flex-1" data-cursor>Add to Pipeline</button>
                <button className="btn-ghost" data-cursor>Compare</button>
                <button className="btn-ghost" data-cursor>Share Report</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
