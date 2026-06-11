import { Logo } from "./Logo";

const COLUMNS = [
  {
    title: "Platform",
    links: ["Athlete Profiles", "Matching Engine", "Coach War Room", "RFX Intelligence", "Transfer Portal"],
  },
  {
    title: "Sports",
    links: ["Soccer", "Football", "Basketball", "Volleyball", "All 20+ Sports"],
  },
  {
    title: "Pathways",
    links: ["NCAA D-I / II / III", "NAIA", "JUCO", "International", "Emerging Sports"],
  },
  {
    title: "Company",
    links: ["About RFX", "Careers", "Press", "Privacy", "Contact"],
  },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] bg-carbon">
      <div className="rfx-container py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm text-silver-dim">
              The operating system for the future of athletic recruiting. Where
              talent meets opportunity — across every sport, division, and pathway.
            </p>
            <div className="mt-6 flex gap-2">
              {["X", "IG", "in", "▶"].map((s) => (
                <a
                  key={s}
                  href="#"
                  data-cursor
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 font-mono text-xs text-silver-dim transition-colors hover:border-electric/50 hover:text-white"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-silver-dim">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-silver/80 transition-colors hover:text-white">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 hairline" />

        <div className="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="font-mono text-[11px] uppercase tracking-widest text-silver-dim/60">
            © {new Date().getFullYear()} RFX · Recruiting Future Exchange
          </p>
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-silver-dim/60">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" />
            Intelligence network · operational
          </p>
        </div>
      </div>
    </footer>
  );
}
