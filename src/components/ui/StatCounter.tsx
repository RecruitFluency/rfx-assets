import { useReveal, useCountUp } from "../../hooks/useInteractions";
import { formatNumber } from "../../lib/utils";

// Animated KPI that counts up the first time it scrolls into view.
export function StatCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  label,
  accent = "#2e8bff",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  accent?: string;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const n = useCountUp(value, 1800, visible);
  const display =
    decimals > 0 ? n.toFixed(decimals) : formatNumber(n);

  return (
    <div ref={ref} className="text-center">
      <div
        className="font-display text-4xl font-700 tabular-nums md:text-5xl"
        style={{ color: "#fff", textShadow: `0 0 30px ${accent}55` }}
      >
        {prefix}
        {display}
        <span style={{ color: accent }}>{suffix}</span>
      </div>
      <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-silver-dim">
        {label}
      </div>
    </div>
  );
}
