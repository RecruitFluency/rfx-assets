import { useReveal } from "../../hooks/useInteractions";
import { cn } from "../../lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  accent,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: React.ReactNode;
  accent?: React.ReactNode;
  description?: string;
  align?: "center" | "left";
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn(
        "max-w-3xl transition-all duration-700",
        align === "center" ? "mx-auto text-center" : "text-left",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      )}
    >
      <div className={cn("mb-4 flex items-center gap-3", align === "center" && "justify-center")}>
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-electric" />
        <span className="eyebrow">{eyebrow}</span>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-electric" />
      </div>
      <h2 className="font-display text-[clamp(1.9rem,5vw,3.4rem)] font-700 leading-[1.05] tracking-[-0.02em] text-white text-balance">
        {title} {accent && <span className="text-gradient-fire">{accent}</span>}
      </h2>
      {description && (
        <p className={cn("mt-5 text-base text-silver-dim md:text-lg", align === "center" && "mx-auto max-w-2xl")}>
          {description}
        </p>
      )}
    </div>
  );
}
