// RFX Matching Engine — a transparent, client-side model that mirrors the
// real platform's vector-similarity scoring. Inputs are normalized athlete
// preferences; outputs are ranked program fits with explainable sub-scores.

export interface MatchInputs {
  gpa: number; // 2.0 - 4.0
  athletic: number; // 0 - 100 (composite athletic metric)
  scholarshipNeed: number; // 0 - 100 (0 = none, 100 = full ride required)
  academicWeight: number; // 0 - 100 (how much academics matters to athlete)
  proximity: number; // 0 - 100 (preference to stay close to home)
}

export interface ProgramSeed {
  id: string;
  name: string;
  short: string;
  division: string;
  academicRating: number; // 0-100
  athleticRating: number; // 0-100 required level
  scholarshipCapacity: number; // 0-100 available aid
  distance: number; // 0-100 (0 = local)
  accent: string;
}

export const PROGRAM_SEEDS: ProgramSeed[] = [
  { id: "baylor", name: "Baylor University", short: "BAY", division: "NCAA D-I", academicRating: 88, athleticRating: 94, scholarshipCapacity: 86, distance: 40, accent: "#154734" },
  { id: "portland", name: "University of Portland", short: "POR", division: "NCAA D-I", academicRating: 82, athleticRating: 90, scholarshipCapacity: 74, distance: 78, accent: "#4b2e83" },
  { id: "loyola", name: "Loyola Chicago", short: "LUC", division: "NCAA D-I", academicRating: 84, athleticRating: 86, scholarshipCapacity: 70, distance: 22, accent: "#8a2432" },
  { id: "greenbay", name: "UW–Green Bay", short: "GB", division: "NCAA D-I", academicRating: 76, athleticRating: 84, scholarshipCapacity: 68, distance: 35, accent: "#1f6b3b" },
  { id: "uscupstate", name: "USC Upstate", short: "USC", division: "NCAA D-I", academicRating: 72, athleticRating: 82, scholarshipCapacity: 76, distance: 60, accent: "#0a7d3c" },
  { id: "roosevelt", name: "Roosevelt University", short: "ROO", division: "NAIA", academicRating: 90, athleticRating: 78, scholarshipCapacity: 92, distance: 12, accent: "#1f6b3b" },
  { id: "johncarroll", name: "John Carroll", short: "JCU", division: "NCAA D-III", academicRating: 92, athleticRating: 74, scholarshipCapacity: 40, distance: 18, accent: "#1b3b6f" },
];

export interface MatchResult extends ProgramSeed {
  score: number;
  sub: {
    academic: number;
    athletic: number;
    scholarship: number;
    proximity: number;
  };
}

const sim = (a: number, b: number) => 100 - Math.abs(a - b);

// Compute explainable fit. Weights shift with the athlete's stated priorities
// so the leaderboard reorders live as sliders move.
export function computeMatches(inputs: MatchInputs): MatchResult[] {
  const gpaScore = ((inputs.gpa - 2) / 2) * 100;

  return PROGRAM_SEEDS.map((p) => {
    // Academic fit: athlete GPA vs program academic rating, weighted by how
    // much the athlete cares about academics.
    const academic = Math.round(
      sim(gpaScore, p.academicRating) * (0.55 + inputs.academicWeight / 220)
    );

    // Athletic fit: athlete composite vs the level the program recruits at.
    // Slight reward for being at-or-above the program's bar.
    const overshoot = inputs.athletic >= p.athleticRating ? 6 : 0;
    const athletic = Math.round(sim(inputs.athletic, p.athleticRating) + overshoot);

    // Scholarship fit: does available aid meet the athlete's need?
    const covers = p.scholarshipCapacity >= inputs.scholarshipNeed;
    const scholarship = Math.round(
      covers ? 90 + (p.scholarshipCapacity - inputs.scholarshipNeed) / 10
             : 100 - (inputs.scholarshipNeed - p.scholarshipCapacity)
    );

    // Proximity fit: athlete's desire to stay close vs program distance.
    const proximity = Math.round(
      100 - Math.abs(inputs.proximity - (100 - p.distance)) * 0.8
    );

    const clampPct = (n: number) => Math.max(0, Math.min(100, n));
    const sub = {
      academic: clampPct(academic),
      athletic: clampPct(athletic),
      scholarship: clampPct(scholarship),
      proximity: clampPct(proximity),
    };

    // Composite — academics & athletics carry the most weight, modulated by
    // the athlete's stated priorities.
    const aW = 0.3 + inputs.academicWeight / 500;
    const score = clampPct(
      Math.round(
        sub.athletic * 0.34 +
          sub.academic * aW +
          sub.scholarship * (0.18 + inputs.scholarshipNeed / 600) +
          sub.proximity * (0.12 + inputs.proximity / 800)
      )
    );

    return { ...p, score, sub };
  }).sort((a, b) => b.score - a.score);
}

export const DEFAULT_INPUTS: MatchInputs = {
  gpa: 3.7,
  athletic: 86,
  scholarshipNeed: 60,
  academicWeight: 70,
  proximity: 55,
};
