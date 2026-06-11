import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { usePointer } from "../../hooks/useInteractions";

const FLOATERS = [
  { label: "Live Athletes", value: "2.7M", accent: "#2e50d4", x: "8%", y: "26%", delay: 0 },
  { label: "Programs", value: "14,820", accent: "#cfcfd6", x: "82%", y: "20%", delay: 0.15 },
  { label: "AI Matches / day", value: "918K", accent: "#4b6eff", x: "86%", y: "62%", delay: 0.3 },
  { label: "Avg Match Score", value: "94.2", accent: "#c20017", x: "6%", y: "66%", delay: 0.45 },
];

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const pointer = usePointer();
  const [matchPulse, setMatchPulse] = useState(94.2);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.8 })
        .from(
          ".hero-line",
          { yPercent: 120, opacity: 0, duration: 1.1, stagger: 0.12 },
          "-=0.4"
        )
        .from(".hero-sub", { y: 24, opacity: 0, duration: 0.9 }, "-=0.6")
        .from(".hero-cta", { y: 18, opacity: 0, duration: 0.7, stagger: 0.08 }, "-=0.5")
        .from(".hero-floater", { scale: 0.6, opacity: 0, duration: 0.8, stagger: 0.12 }, "-=0.7")
        .from(".hero-scroll", { opacity: 0, duration: 0.8 }, "-=0.2");
    }, root);
    return () => ctx.revert();
  }, []);

  // Continuously nudge the "live" avg match score for a telemetry feel.
  useEffect(() => {
    const t = setInterval(() => {
      setMatchPulse((v) => {
        const next = v + (Math.random() - 0.5) * 0.4;
        return Math.min(96.8, Math.max(92.5, next));
      });
    }, 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      ref={root}
      id="hero"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pt-24"
    >
      <div className="rfx-container relative z-10 text-center">
        <div className="hero-eyebrow mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-electric-bright" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-mega text-silver">
            AI Recruiting Intelligence Network
          </span>
        </div>

        <h1 className="mx-auto max-w-5xl font-display text-[clamp(2.6rem,8vw,6.2rem)] font-800 leading-[0.95] tracking-[-0.03em]">
          <span className="block overflow-hidden">
            <span className="hero-line block text-gradient-steel">Where Talent</span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-line block text-gradient-fire">Meets Opportunity.</span>
          </span>
        </h1>

        <p className="hero-sub mx-auto mt-7 max-w-2xl text-balance text-base text-silver-dim md:text-lg">
          The world's first AI-powered recruiting intelligence network connecting
          athletes and coaches through predictive matching — across every
          collegiate sport, division, and pathway on earth.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a href="#athletes" className="hero-cta btn-primary" data-cursor>
            Explore Athletes
          </a>
          <a href="#sports" className="hero-cta btn-ghost" data-cursor>
            Discover Programs
          </a>
          <a href="#ai" className="hero-cta btn-fire" data-cursor>
            See The AI Engine
          </a>
          <a href="#story" className="hero-cta btn-ghost group" data-cursor>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] transition group-hover:bg-electric">
              ▶
            </span>
            Watch Demo
          </a>
        </div>

        {/* divisions ribbon */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-widest text-silver-dim/70">
          {["NCAA D-I", "D-II", "D-III", "NAIA", "JUCO", "International"].map((d) => (
            <span key={d} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-electric/70" />
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* Floating telemetry cards with subtle pointer parallax */}
      {FLOATERS.map((f, i) => (
        <div
          key={f.label}
          className="hero-floater pointer-events-none absolute hidden md:block"
          style={{
            left: f.x,
            top: f.y,
            transform: `translate(-50%,-50%) translate(${pointer.x * (i % 2 ? 18 : -18)}px, ${pointer.y * (i % 2 ? -12 : 14)}px)`,
          }}
        >
          <div className="glass animate-float rounded-2xl px-4 py-3" style={{ animationDelay: `${f.delay}s` }}>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: f.accent, boxShadow: `0 0 10px ${f.accent}` }} />
              <span className="font-mono text-[9px] uppercase tracking-widest text-silver-dim">
                {f.label}
              </span>
            </div>
            <div className="mt-1 font-display text-2xl font-700 text-white tabular-nums">
              {f.label === "Avg Match Score" ? matchPulse.toFixed(1) : f.value}
            </div>
          </div>
        </div>
      ))}

      {/* Scroll cue */}
      <div className="hero-scroll absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
        <span className="font-mono text-[10px] uppercase tracking-mega text-silver-dim">
          Scroll to enter the network
        </span>
        <div className="mx-auto mt-2 h-9 w-5 rounded-full border border-white/15 p-1">
          <span className="mx-auto block h-2 w-1 animate-bounce rounded-full bg-electric-bright" />
        </div>
      </div>
    </section>
  );
}
