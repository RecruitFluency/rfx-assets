import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { cn } from "../../lib/utils";

const LINKS = [
  { label: "Athletes", href: "#athletes" },
  { label: "Matching Engine", href: "#engine" },
  { label: "Sports", href: "#sports" },
  { label: "Coach War Room", href: "#warroom" },
  { label: "RFX Intelligence", href: "#ai" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header id="top" className="fixed inset-x-0 top-0 z-[80]">
      <div
        className={cn(
          "transition-all duration-500",
          scrolled
            ? "glass-strong border-b border-white/[0.06]"
            : "bg-transparent"
        )}
      >
        <nav className="rfx-container flex h-16 items-center justify-between">
          <Logo />

          <div className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative rounded-full px-4 py-2 text-sm text-silver-dim transition-colors hover:text-white"
              >
                {l.label}
                <span className="absolute inset-x-4 -bottom-0.5 h-px scale-x-0 bg-electric transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a href="#engine" className="hidden text-sm text-silver-dim transition-colors hover:text-white sm:block">
              Sign in
            </a>
            <a href="#cta" className="btn-primary !px-5 !py-2.5 text-sm">
              Request Access
            </a>
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-silver lg:hidden"
            >
              <div className="flex flex-col gap-1">
                <span className={cn("h-0.5 w-5 bg-current transition", open && "translate-y-1.5 rotate-45")} />
                <span className={cn("h-0.5 w-5 bg-current transition", open && "opacity-0")} />
                <span className={cn("h-0.5 w-5 bg-current transition", open && "-translate-y-1.5 -rotate-45")} />
              </div>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "glass-strong overflow-hidden border-b border-white/[0.06] transition-[max-height] duration-500 lg:hidden",
          open ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="rfx-container flex flex-col gap-1 py-4">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-base text-silver transition-colors hover:bg-white/5 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
