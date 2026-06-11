<div align="center">

<img src="public/assets/rfx-logo.png" width="96" alt="RFX" />

# RFX — Recruiting Future Exchange

### The operating system for the future of athletic recruiting.

**Where Talent Meets Opportunity.**

The world's first AI-powered recruiting intelligence network — connecting athletes,
coaches, programs, scouts, and agents through vectorized profiles, predictive
analytics, and autonomous recommendations across every collegiate sport.

</div>

---

## ✦ What this is

A premium, cinematic, sport-agnostic recruiting platform front end. It is engineered
to feel like the intersection of Nike Future Lab, F1 data intelligence, ESPN broadcast
graphics, Palantir, and modern gaming UI — a live recruiting **command center**, not a
website.

The experience is built around the **RFX Matching Engine**: an AI-driven, sport-agnostic
architecture that connects athletes and programs through vector-based fit scoring.

## ✦ Experience highlights

| Section | What it does |
| --- | --- |
| **Athlete Universe (3D)** | A full-screen WebGL field of thousands of glowing athlete nodes wired by dynamic recruiting pathways. Pointer-reactive camera, GPU particles, custom GLSL shaders. |
| **Cinematic Hero** | Kinetic GSAP typography, floating live telemetry, scroll-driven reveals. |
| **Interactive Matching Engine** | Move sliders (GPA, athletic composite, scholarship need, academic priority, proximity) and watch an explainable AI model re-rank program fits live, with animated vector pathways. |
| **Athlete Scouting Reports** | 3D-tilt commitment cards → full-screen profile modal with radar charts, verified metrics, and predictive development curves. |
| **Sport-Agnostic Coverage** | All 20+ collegiate sports as first-class citizens, filterable by category, across 6 divisions/pathways. |
| **Coach War Room** | A live recruiting command center: pipeline funnel, geographic heat map, roster-gap analysis, and autonomous AI recommendations. |
| **RFX Intelligence Engine** | A rotating neural core orbited by the platform's AI capabilities, with a live match counter. |
| **The RFX Journey** | A documentary-style scroll narrative (Talent → Potential → Discovery → Connection → Opportunity → Commitment) with a self-drawing spine and parallax imagery. |

## ✦ Tech stack

- **React 18 + TypeScript + Vite** — fast, code-split, enterprise-scale shell
- **React Three Fiber + Three.js** — the 3D athlete universe & custom shaders
- **GSAP + ScrollTrigger** — cinematic scroll storytelling & kinetic type
- **Framer Motion** — physics-based UI micro-interactions & modal choreography
- **Tailwind CSS** — the RFX dark-luxury design system (carbon, electric blue, velocity red, championship gold)
- Hand-built SVG data-viz (radar, development curves, pathway graph, heat map) — no charting dependency

## ✦ Design system

Dark luxury aesthetic — deep graphite + carbon-fiber textures, glassmorphism layers,
neon accents, metallic silver highlights. Core palette:

`#05060a carbon` · `#2e8bff electric` · `#ff2d3f velocity` · `#ffce4d gold` · `#9d6bff plasma` · `#27e0a4 mint`

## ✦ Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # typecheck + production build → dist/
npm run preview  # preview the production build
```

## ✦ Project structure

```
src/
├─ components/
│  ├─ three/        # AthleteUniverse — R3F canvas + GLSL shaders
│  ├─ sections/     # Hero, MatchingEngine, AthleteShowcase, CoachWarRoom, AIEngine, Storytelling …
│  ├─ viz/          # RadarChart, DevelopmentCurve (hand-built SVG)
│  └─ ui/           # Navbar, CustomCursor, ScrollProgress, SectionHeader, Footer …
├─ data/            # sports taxonomy, athlete scouting data
├─ lib/             # matching engine model + math/SVG helpers
└─ hooks/           # pointer, reveal-on-scroll, count-up, media-query
```

## ✦ Performance & accessibility

- Heavy 3D + motion libraries are **lazily loaded** and split into separate chunks so the
  HTML/CSS shell paints instantly.
- The universe drops particle counts and DPR on mobile, and honors
  `prefers-reduced-motion` (pauses the WebGL frameloop and disables transitions).
- Semantic markup, keyboard-dismissible modal, SEO + Open Graph metadata.

## ✦ Athlete imagery

Profiles are modeled on RFX's verified commitment class — Foster Hayes (Loyola),
Kamden Held (UW–Green Bay), Nerlyn Muñoz (Roosevelt), Efoe Attisso (USC Upstate),
Patrick Bohan (John Carroll), Kruz Held (Portland), and Catelyn De Moor (Baylor).

---

<div align="center">
<sub>RFX is not a website. RFX is the operating system for the future of athletic recruiting.</sub>
</div>
