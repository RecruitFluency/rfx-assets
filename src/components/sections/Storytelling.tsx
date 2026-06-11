import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "../../lib/utils";

gsap.registerPlugin(ScrollTrigger);

/* The narrative arc — a recruiting journey told like a sports documentary.
 * A glowing spine draws itself as the user scrolls; each chapter parallaxes
 * its imagery and reveals its copy. */

const CHAPTERS = [
  { phase: "01", title: "Talent", copy: "It starts with raw ability — captured, verified, and vectorized into the network.", img: "/assets/founder-dark.jpeg", accent: "#2e50d4" },
  { phase: "02", title: "Potential", copy: "RFX models what an athlete will become, not just what they are today.", img: "/assets/athletes/academy-duo.jpeg", accent: "#2e50d4" },
  { phase: "03", title: "Discovery", copy: "The right coach finds the right athlete — out of millions, in milliseconds.", img: "/assets/stadium-hero.webp", accent: "#4b6eff" },
  { phase: "04", title: "Connection", copy: "Vectorized pathways light up. Behavioral, academic, and athletic fit align.", img: "/assets/athletes/roster-trio.jpeg", accent: "#cfcfd6" },
  { phase: "05", title: "Opportunity", copy: "Scholarship probabilities resolve. The pathway becomes a real decision.", img: "/assets/athletes/nerlyn-munoz.jpeg", accent: "#e11d2a" },
  { phase: "06", title: "Commitment", copy: "Talent meets opportunity. A commitment is made — and the legacy begins.", img: "/assets/athletes/foster-hayes.jpeg", accent: "#c20017" },
];

export function Storytelling() {
  const root = useRef<HTMLDivElement>(null);
  const spine = useRef<SVGPathElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // draw the spine in sync with scroll
      if (spine.current) {
        const len = spine.current.getTotalLength();
        gsap.set(spine.current, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(spine.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 60%",
            end: "bottom 80%",
            scrub: 0.6,
          },
        });
      }

      // reveal each chapter
      gsap.utils.toArray<HTMLElement>(".chapter").forEach((el) => {
        const img = el.querySelector(".chapter-img") as HTMLElement;
        const copy = el.querySelectorAll(".chapter-anim");
        gsap.from(copy, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 78%" },
        });
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -8, scale: 1.12 },
            {
              yPercent: 8,
              scale: 1.12,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="story" ref={root} className="relative z-10 scroll-mt-24 py-24 md:py-32">
      <div className="rfx-container">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-velocity" />
            <span className="eyebrow !text-velocity-bright">The RFX Journey</span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-velocity" />
          </div>
          <h2 className="font-display text-[clamp(1.9rem,5vw,3.4rem)] font-800 leading-[1.05] tracking-[-0.02em] text-white">
            Every athlete has a path.
            <br />
            <span className="text-gradient-fire">We illuminate it.</span>
          </h2>
        </div>

        <div className="relative">
          {/* spine */}
          <svg className="absolute left-1/2 top-0 hidden h-full w-4 -translate-x-1/2 md:block" preserveAspectRatio="none" viewBox="0 0 4 1000">
            <line x1="2" y1="0" x2="2" y2="1000" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <path
              ref={spine}
              d="M2,0 L2,1000"
              stroke="url(#spineGrad)"
              strokeWidth="2.5"
              fill="none"
            />
            <defs>
              <linearGradient id="spineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2e50d4" />
                <stop offset="50%" stopColor="#2e50d4" />
                <stop offset="100%" stopColor="#c20017" />
              </linearGradient>
            </defs>
          </svg>

          <div className="space-y-16 md:space-y-28">
            {CHAPTERS.map((c, i) => (
              <div
                key={c.phase}
                className={cn(
                  "chapter grid items-center gap-8 md:grid-cols-2 md:gap-16",
                  i % 2 === 1 && "md:[direction:rtl]"
                )}
              >
                {/* image */}
                <div className="relative overflow-hidden rounded-3xl [direction:ltr]">
                  <div className="aspect-[4/3] overflow-hidden rounded-3xl">
                    <img src={c.img} alt={c.title} loading="lazy" className="chapter-img h-full w-full scale-110 object-cover" />
                  </div>
                  <div className="absolute inset-0 rounded-3xl" style={{ background: `linear-gradient(160deg, transparent, ${c.accent}22)`, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }} />
                  <div className="absolute left-4 top-4 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest backdrop-blur" style={{ background: `${c.accent}22`, color: c.accent }}>
                    Phase {c.phase}
                  </div>
                </div>

                {/* copy */}
                <div className="[direction:ltr]">
                  <div className="chapter-anim font-mono text-sm tracking-widest" style={{ color: c.accent }}>{c.phase}</div>
                  <h3 className="chapter-anim mt-2 font-display text-4xl font-700 text-white md:text-5xl">{c.title}</h3>
                  <p className="chapter-anim mt-4 max-w-md text-base leading-relaxed text-silver-dim">{c.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
