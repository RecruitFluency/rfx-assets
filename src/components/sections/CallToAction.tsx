import { useState } from "react";
import { useReveal } from "../../hooks/useInteractions";
import { cn } from "../../lib/utils";

const PERSONAS = [
  { id: "athlete", label: "Athlete", desc: "Get discovered. Build your verified profile.", icon: "🎯" },
  { id: "coach", label: "Coach", desc: "Run your recruiting war room.", icon: "📋" },
  { id: "scout", label: "Scout / Agent", desc: "Evaluate talent at scale.", icon: "🔭" },
  { id: "program", label: "Program", desc: "Map your entire recruiting operation.", icon: "🏛️" },
];

export function CallToAction() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [persona, setPersona] = useState("athlete");

  return (
    <section id="cta" className="relative z-10 scroll-mt-24 py-24 md:py-32">
      <div className="rfx-container">
        <div
          ref={ref}
          className={cn(
            "relative overflow-hidden rounded-[2rem] transition-all duration-700",
            visible ? "opacity-100" : "opacity-0"
          )}
        >
          {/* founder backdrop */}
          <div className="absolute inset-0">
            <img src="/assets/founder-red.jpeg" alt="" className="h-full w-full object-cover object-right opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-r from-carbon via-carbon/90 to-carbon/40" />
            <div className="absolute inset-0 carbon-texture" />
          </div>

          <div className="relative grid gap-10 p-8 md:grid-cols-2 md:p-14">
            <div>
              <div className="eyebrow !text-velocity-bright">Request Access</div>
              <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.6rem)] font-700 leading-[1.02] tracking-[-0.02em] text-white">
                This is the future
                <br />
                of <span className="text-gradient-fire">recruiting.</span>
              </h2>
              <p className="mt-5 max-w-md text-base text-silver-dim">
                Join the intelligence network rewriting how athletes and programs
                find each other. Early access is rolling out by sport and division.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6">
                <div>
                  <div className="font-display text-2xl font-700 text-white">2.7M+</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-silver-dim">Athletes</div>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <div className="font-display text-2xl font-700 text-white">20+</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-silver-dim">Sports</div>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <div className="font-display text-2xl font-700 text-white">6</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-silver-dim">Divisions</div>
                </div>
              </div>
            </div>

            {/* form card */}
            <div className="glass-strong rounded-3xl p-7">
              <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-silver-dim">I am a…</div>
              <div className="grid grid-cols-2 gap-2">
                {PERSONAS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPersona(p.id)}
                    data-cursor
                    className={cn(
                      "rounded-xl border p-3 text-left transition-all",
                      persona === p.id
                        ? "border-electric/60 bg-electric/10"
                        : "border-white/8 hover:border-white/20"
                    )}
                  >
                    <div className="text-lg">{p.icon}</div>
                    <div className="mt-1 text-sm font-600 text-white">{p.label}</div>
                    <div className="mt-0.5 text-[10px] leading-tight text-silver-dim">{p.desc}</div>
                  </button>
                ))}
              </div>

              <form
                className="mt-5 space-y-3"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="text"
                  placeholder="Full name"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-silver-dim/60 focus:border-electric/60 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-silver-dim/60 focus:border-electric/60 focus:outline-none"
                />
                <button type="submit" className="btn-fire w-full" data-cursor>
                  Claim Early Access →
                </button>
              </form>
              <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-widest text-silver-dim/60">
                No spam. Invitations roll out by sport & division.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
