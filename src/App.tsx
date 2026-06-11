import { Suspense, lazy, useState } from "react";
import { CustomCursor } from "./components/ui/CustomCursor";
import { Navbar } from "./components/ui/Navbar";
import { ScrollProgress } from "./components/ui/ScrollProgress";
import { Hero } from "./components/sections/Hero";
import { LiveTicker } from "./components/sections/LiveTicker";
import { TrustBar } from "./components/sections/TrustBar";
import { MatchingEngine } from "./components/sections/MatchingEngine";
import { SportsCoverage } from "./components/sections/SportsCoverage";
import { AthleteShowcase } from "./components/sections/AthleteShowcase";
import { CoachWarRoom } from "./components/sections/CoachWarRoom";
import { AIEngine } from "./components/sections/AIEngine";
import { Storytelling } from "./components/sections/Storytelling";
import { CallToAction } from "./components/sections/CallToAction";
import { Footer } from "./components/ui/Footer";
import { AthleteModal } from "./components/sections/AthleteModal";
import type { Athlete } from "./data/athletes";

// The athlete-universe canvas is heavy (Three.js). Lazy-load it so the
// HTML/CSS shell paints instantly and the WebGL streams in behind the hero.
const AthleteUniverse = lazy(() =>
  import("./components/three/AthleteUniverse").then((m) => ({
    default: m.AthleteUniverse,
  }))
);

export default function App() {
  const [activeAthlete, setActiveAthlete] = useState<Athlete | null>(null);

  return (
    <div className="relative min-h-screen overflow-clip bg-carbon">
      <CustomCursor />
      <ScrollProgress />
      <Navbar />

      {/* Fixed 3D universe backdrop — sits behind the hero & first fold */}
      <Suspense fallback={null}>
        <AthleteUniverse />
      </Suspense>

      <main className="relative z-10">
        <Hero />
        <LiveTicker />
        <TrustBar />
        <MatchingEngine />
        <AthleteShowcase onOpen={setActiveAthlete} />
        <SportsCoverage />
        <CoachWarRoom />
        <AIEngine />
        <Storytelling />
        <CallToAction />
      </main>

      <Footer />

      <AthleteModal athlete={activeAthlete} onClose={() => setActiveAthlete(null)} />
    </div>
  );
}
