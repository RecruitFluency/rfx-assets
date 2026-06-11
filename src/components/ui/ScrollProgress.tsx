import { useEffect, useState } from "react";

// A thin telemetry rail at the top of the viewport tracking scroll depth.
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      setProgress(Math.min(1, Math.max(0, scrolled)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[90] h-[2px] bg-white/[0.04]">
      <div
        className="h-full origin-left"
        style={{
          transform: `scaleX(${progress})`,
          background: "linear-gradient(90deg,#2e50d4,#2e50d4 50%,#c20017)",
          boxShadow: "0 0 12px rgba(46,80,212,0.7)",
          transition: "transform 0.1s linear",
        }}
      />
    </div>
  );
}
