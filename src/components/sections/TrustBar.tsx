import { StatCounter } from "../ui/StatCounter";

export function TrustBar() {
  return (
    <section className="relative z-10 py-16 md:py-20">
      <div className="rfx-container">
        <div className="glass carbon-texture rounded-3xl px-6 py-10 md:px-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <StatCounter value={2700000} suffix="+" label="Vectorized Athletes" accent="#2e8bff" />
            <StatCounter value={14820} label="Programs Mapped" accent="#ffce4d" />
            <StatCounter value={94.2} decimals={1} suffix="%" label="Match Precision" accent="#27e0a4" />
            <StatCounter value={20} suffix="+" label="Sports Covered" accent="#ff2d3f" />
          </div>
          <div className="mt-10 hairline" />
          <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-widest text-silver-dim/70">
            Trusted intelligence across NCAA · NAIA · JUCO · International pathways
          </p>
        </div>
      </div>
    </section>
  );
}
