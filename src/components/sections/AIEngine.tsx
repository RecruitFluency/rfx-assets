import { useEffect, useState } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { useReveal } from "../../hooks/useInteractions";
import { cn } from "../../lib/utils";

const CAPABILITIES = [
  { icon: "◎", title: "Predictive Matching", desc: "Vector similarity across 2.7M athlete embeddings." },
  { icon: "↗", title: "Development Forecasting", desc: "Models a 4-year growth trajectory per athlete." },
  { icon: "⬡", title: "Behavioral Fit", desc: "Psychometric + system-style compatibility scoring." },
  { icon: "$", title: "Scholarship Likelihood", desc: "Probabilistic aid modeling against program caps." },
  { icon: "⇄", title: "Transfer Portal Intel", desc: "Real-time portal monitoring and fit alerts." },
  { icon: "◷", title: "Trend Analysis", desc: "Detects recruiting market shifts before they break." },
  { icon: "⊞", title: "Program Comparison", desc: "Side-by-side fit across style, academics, geography." },
  { icon: "✦", title: "Success Projection", desc: "Long-term outcome modeling for every pathway." },
];

// Rotating neural core — orbiting capability satellites around a pulsing brain.
function NeuralCore() {
  const orbits = [
    { r: 92, dur: 26, count: 6, color: "#2e8bff" },
    { r: 132, dur: 38, count: 9, color: "#9d6bff" },
    { r: 172, dur: 52, count: 12, color: "#ff2d3f" },
  ];
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]">
      {/* glow */}
      <div className="absolute inset-0 rounded-full bg-electric/10 blur-3xl" />

      {orbits.map((o, oi) => (
        <div
          key={oi}
          className="absolute inset-0 m-auto rounded-full border border-white/[0.06]"
          style={{
            width: o.r * 2,
            height: o.r * 2,
            animation: `spin ${o.dur}s linear infinite${oi % 2 ? " reverse" : ""}`,
          }}
        >
          {Array.from({ length: o.count }).map((_, i) => {
            const a = (Math.PI * 2 * i) / o.count;
            return (
              <span
                key={i}
                className="absolute h-2 w-2 rounded-full"
                style={{
                  left: `calc(50% + ${Math.cos(a) * o.r}px - 4px)`,
                  top: `calc(50% + ${Math.sin(a) * o.r}px - 4px)`,
                  background: o.color,
                  boxShadow: `0 0 10px ${o.color}`,
                  opacity: 0.4 + (i % 3) * 0.2,
                }}
              />
            );
          })}
        </div>
      ))}

      {/* core */}
      <div className="absolute inset-0 m-auto flex h-32 w-32 items-center justify-center rounded-full">
        <div className="absolute inset-0 animate-pulse-ring rounded-full border border-electric/40" />
        <div className="glass-strong flex h-32 w-32 flex-col items-center justify-center rounded-full border border-electric/30" style={{ boxShadow: "0 0 60px -10px rgba(46,139,255,0.7)" }}>
          <img src="/assets/rfx-logo.png" alt="RFX" className="h-10 w-10 object-contain" />
          <span className="mt-1 font-display text-[11px] font-700 tracking-widest text-white">RFX</span>
          <span className="font-mono text-[7px] uppercase tracking-[0.25em] text-electric-bright">Intelligence</span>
        </div>
      </div>
    </div>
  );
}

export function AIEngine() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [proc, setProc] = useState(918440);

  useEffect(() => {
    const t = setInterval(() => setProc((p) => p + Math.floor(Math.random() * 40 + 5)), 120);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="ai" className="relative z-10 scroll-mt-24 overflow-hidden py-24 md:py-32">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div className="rfx-container">
        <SectionHeader
          eyebrow="RFX Intelligence Engine"
          title="The AI that"
          accent="never stops scouting."
          description="An omnipresent intelligence layer — surfacing connections no human could see, presented as living motion graphics, not static text."
        />

        <div ref={ref} className="mt-16 grid items-center gap-12 lg:grid-cols-2">
          <div className={cn("transition-all duration-1000", visible ? "scale-100 opacity-100" : "scale-90 opacity-0")}>
            <NeuralCore />
            <div className="mt-6 text-center">
              <div className="font-display text-3xl font-700 tabular-nums text-white" style={{ textShadow: "0 0 30px rgba(46,139,255,0.5)" }}>
                {proc.toLocaleString()}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-silver-dim">Matches processed today · live</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {CAPABILITIES.map((c, i) => (
              <div
                key={c.title}
                className={cn(
                  "group rounded-2xl border border-white/8 bg-graphite-2/50 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-electric/40",
                  visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                )}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-electric/15 font-display text-lg text-electric-bright transition-colors group-hover:bg-electric/25">
                  {c.icon}
                </div>
                <h4 className="mt-3 font-display text-sm font-600 text-white">{c.title}</h4>
                <p className="mt-1 text-xs leading-relaxed text-silver-dim">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
