import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "../../hooks/useInteractions";

// A magnetic, broadcast-style cursor: an outer reticle that eases toward the
// pointer plus a precise inner dot. Expands over interactive targets.
export function CustomCursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);
  const hasFinePointer = useMediaQuery("(pointer: fine)");

  useEffect(() => {
    if (!hasFinePointer) return;
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pos };

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }
      const el = e.target as HTMLElement;
      const interactive = !!el.closest(
        "a, button, [data-cursor], input, .cursor-pointer, [role='button']"
      );
      setHovering(interactive);
    };

    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    let raf = 0;
    const tick = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      cancelAnimationFrame(raf);
    };
  }, [hasFinePointer]);

  if (!hasFinePointer) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <div
        ref={ring}
        className="absolute -ml-5 -mt-5 h-10 w-10 rounded-full border transition-[width,height,opacity,border-color] duration-200"
        style={{
          borderColor: hovering ? "rgba(46,80,212,0.9)" : "rgba(212,212,216,0.35)",
          width: hovering ? 56 : 40,
          height: hovering ? 56 : 40,
          marginLeft: hovering ? -28 : -20,
          marginTop: hovering ? -28 : -20,
          boxShadow: hovering ? "0 0 24px -4px rgba(46,80,212,0.7)" : "none",
          opacity: down ? 0.5 : 1,
        }}
      />
      <div
        ref={dot}
        className="absolute -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-electric-bright"
        style={{ boxShadow: "0 0 12px rgba(46,80,212,0.9)" }}
      />
    </div>
  );
}
