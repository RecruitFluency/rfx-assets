import { cn } from "../../lib/utils";

// RFX wordmark lockup using the circular play-button bug.
export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <a
      href="#top"
      className={cn("group flex items-center gap-3 select-none", className)}
      aria-label="RFX — Recruiting Future Exchange"
    >
      <span className="relative inline-flex h-9 w-9 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-velocity/30 blur-md transition-opacity duration-300 group-hover:opacity-100 opacity-60" />
        <img
          src="/assets/rfx-logo.png"
          alt="RFX"
          className="relative h-9 w-9 object-contain drop-shadow-[0_0_10px_rgba(194,0,23,0.5)]"
        />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-lg font-700 tracking-[0.18em] text-white">
            RFX
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.32em] text-silver-dim">
            Future Exchange
          </span>
        </span>
      )}
    </a>
  );
}
