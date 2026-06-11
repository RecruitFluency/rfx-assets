// Athlete profiles modeled on the verified RFX commitment class.
// Imagery comes from the platform's own commitment-edit assets.

export interface RadarAxis {
  label: string;
  value: number; // 0-100
}

export interface TimelinePoint {
  label: string;
  value: number;
}

export interface Athlete {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  image: string;
  sport: string;
  sportId: string;
  position: string;
  classYear: string;
  gradYear: number;
  committed: boolean;
  program: string;
  location: string;
  hometown: string;
  division: string;
  height: string;
  gpa: number;
  nationalRank: number | null;
  matchScore: number; // RFX AI Match Score 0-100
  status: "Committed" | "Evaluating" | "Open" | "Transfer Portal";
  accent: string; // program-flavored accent color
  verified: boolean;
  metrics: { label: string; value: string; unit?: string; pct: number }[];
  radar: RadarAxis[];
  development: TimelinePoint[]; // predictive development curve
  interest: number; // active coach interest count
  scholarshipProbability: number;
  tags: string[];
  bio: string;
}

export const ATHLETES: Athlete[] = [
  {
    id: "foster-hayes",
    name: "Foster Hayes",
    firstName: "Foster",
    lastName: "Hayes",
    image: "/assets/athletes/foster-hayes.jpeg",
    sport: "Men's Soccer",
    sportId: "soccer",
    position: "Attacking Midfielder",
    classYear: "Class of 2025",
    gradYear: 2025,
    committed: true,
    program: "Loyola University Chicago",
    location: "Chicago, IL",
    hometown: "Pittsburgh, PA",
    division: "NCAA D-I",
    height: "5'11\"",
    gpa: 3.8,
    nationalRank: 42,
    matchScore: 96,
    status: "Committed",
    accent: "#8a2432",
    verified: true,
    metrics: [
      { label: "Top Speed", value: "33.1", unit: "km/h", pct: 88 },
      { label: "xG / 90", value: "0.61", pct: 92 },
      { label: "Pass Acc.", value: "87", unit: "%", pct: 87 },
      { label: "Dribble Succ.", value: "74", unit: "%", pct: 81 },
    ],
    radar: [
      { label: "Pace", value: 88 },
      { label: "Vision", value: 93 },
      { label: "Finishing", value: 85 },
      { label: "Press", value: 79 },
      { label: "Passing", value: 90 },
      { label: "IQ", value: 94 },
    ],
    development: [
      { label: "U15", value: 58 },
      { label: "U16", value: 67 },
      { label: "U17", value: 78 },
      { label: "HS Sr", value: 86 },
      { label: "Proj. Yr1", value: 90 },
      { label: "Proj. Yr3", value: 95 },
    ],
    interest: 18,
    scholarshipProbability: 91,
    tags: ["Playmaker", "Set Pieces", "Two-Footed", "Captain"],
    bio: "A press-resistant No. 10 with elite scanning and final-third vision. RFX flagged Foster's progression curve 14 months before his commitment to Loyola.",
  },
  {
    id: "kamden-held",
    name: "Kamden Held",
    firstName: "Kamden",
    lastName: "Held",
    image: "/assets/athletes/kamden-held.jpg",
    sport: "Men's Soccer",
    sportId: "soccer",
    position: "Center Back",
    classYear: "Class of 2025",
    gradYear: 2025,
    committed: true,
    program: "UW–Green Bay",
    location: "Green Bay, WI",
    hometown: "Frisco, TX",
    division: "NCAA D-I",
    height: "6'2\"",
    gpa: 3.6,
    nationalRank: 61,
    matchScore: 94,
    status: "Committed",
    accent: "#1f6b3b",
    verified: true,
    metrics: [
      { label: "Aerial Win", value: "81", unit: "%", pct: 90 },
      { label: "Tackles / 90", value: "3.4", pct: 84 },
      { label: "Pass Acc.", value: "91", unit: "%", pct: 91 },
      { label: "Recover.", value: "11.2", pct: 86 },
    ],
    radar: [
      { label: "Strength", value: 90 },
      { label: "Aerial", value: 92 },
      { label: "Positioning", value: 88 },
      { label: "Build-Up", value: 83 },
      { label: "Pace", value: 76 },
      { label: "Leadership", value: 89 },
    ],
    development: [
      { label: "U15", value: 52 },
      { label: "U16", value: 64 },
      { label: "U17", value: 75 },
      { label: "HS Sr", value: 84 },
      { label: "Proj. Yr1", value: 88 },
      { label: "Proj. Yr3", value: 93 },
    ],
    interest: 14,
    scholarshipProbability: 88,
    tags: ["Ball-Playing CB", "Aerial Dominant", "Vocal Organizer"],
    bio: "A commanding ball-playing center back. RFX's behavioral fit model matched Kamden's organizing profile to Green Bay's high-line system at 94%.",
  },
  {
    id: "nerlyn-munoz",
    name: "Nerlyn Muñoz",
    firstName: "Nerlyn",
    lastName: "Muñoz",
    image: "/assets/athletes/nerlyn-munoz.jpeg",
    sport: "Women's Soccer",
    sportId: "soccer",
    position: "Winger",
    classYear: "Class of 2025",
    gradYear: 2025,
    committed: true,
    program: "Roosevelt University",
    location: "Chicago, IL",
    hometown: "Chicago, IL",
    division: "NAIA",
    height: "5'5\"",
    gpa: 4.0,
    nationalRank: 10,
    matchScore: 98,
    status: "Committed",
    accent: "#1f6b3b",
    verified: true,
    metrics: [
      { label: "Top Speed", value: "31.8", unit: "km/h", pct: 91 },
      { label: "Goals / 90", value: "0.72", pct: 95 },
      { label: "Take-Ons", value: "6.1", pct: 93 },
      { label: "Chances", value: "3.8", pct: 89 },
    ],
    radar: [
      { label: "Pace", value: 94 },
      { label: "Dribbling", value: 95 },
      { label: "Finishing", value: 88 },
      { label: "Crossing", value: 84 },
      { label: "Work Rate", value: 92 },
      { label: "Flair", value: 90 },
    ],
    development: [
      { label: "U15", value: 61 },
      { label: "U16", value: 72 },
      { label: "U17", value: 82 },
      { label: "HS Sr", value: 90 },
      { label: "Proj. Yr1", value: 93 },
      { label: "Proj. Yr3", value: 97 },
    ],
    interest: 26,
    scholarshipProbability: 96,
    tags: ["National Top 10", "Elite Dribbler", "4.0 GPA", "Game-Breaker"],
    bio: "A nationally ranked No. 10 winger and 4.0 scholar. RFX's academic-athletic fit engine surfaced Roosevelt as her optimal pathway across 38 programs.",
  },
  {
    id: "efoe-attisso",
    name: "Efoe Attisso",
    firstName: "Efoe",
    lastName: "Attisso",
    image: "/assets/athletes/efoe-attisso.jpeg",
    sport: "Men's Soccer",
    sportId: "soccer",
    position: "Box-to-Box Mid",
    classYear: "Class of 2025",
    gradYear: 2025,
    committed: true,
    program: "USC Upstate",
    location: "Spartanburg, SC",
    hometown: "Lomé, Togo",
    division: "NCAA D-I",
    height: "6'0\"",
    gpa: 3.5,
    nationalRank: 55,
    matchScore: 93,
    status: "Committed",
    accent: "#0a7d3c",
    verified: true,
    metrics: [
      { label: "Distance / 90", value: "12.4", unit: "km", pct: 94 },
      { label: "Duels Won", value: "63", unit: "%", pct: 86 },
      { label: "Prog. Carries", value: "8.7", pct: 88 },
      { label: "Interceptions", value: "2.9", pct: 82 },
    ],
    radar: [
      { label: "Engine", value: 95 },
      { label: "Power", value: 88 },
      { label: "Passing", value: 82 },
      { label: "Tackling", value: 85 },
      { label: "Drive", value: 90 },
      { label: "Composure", value: 80 },
    ],
    development: [
      { label: "U15", value: 55 },
      { label: "U16", value: 66 },
      { label: "U17", value: 77 },
      { label: "HS Sr", value: 85 },
      { label: "Proj. Yr1", value: 89 },
      { label: "Proj. Yr3", value: 94 },
    ],
    interest: 12,
    scholarshipProbability: 87,
    tags: ["International", "Engine", "Box-to-Box", "High Ceiling"],
    bio: "An international box-to-box engine from Togo. RFX's international pathway module mapped Efoe's eligibility and fit to USC Upstate's midfield rebuild.",
  },
  {
    id: "patrick-bohan",
    name: "Patrick Bohan",
    firstName: "Patrick",
    lastName: "Bohan",
    image: "/assets/athletes/patrick-bohan.jpg",
    sport: "Men's Soccer",
    sportId: "soccer",
    position: "Full Back",
    classYear: "Class of 2025",
    gradYear: 2025,
    committed: true,
    program: "John Carroll University",
    location: "University Heights, OH",
    hometown: "Cleveland, OH",
    division: "NCAA D-III",
    height: "5'10\"",
    gpa: 3.9,
    nationalRank: null,
    matchScore: 91,
    status: "Committed",
    accent: "#1b3b6f",
    verified: true,
    metrics: [
      { label: "Sprints / 90", value: "42", pct: 89 },
      { label: "Crosses", value: "4.6", pct: 83 },
      { label: "Tackles", value: "3.1", pct: 82 },
      { label: "Pass Acc.", value: "85", unit: "%", pct: 85 },
    ],
    radar: [
      { label: "Stamina", value: 90 },
      { label: "Overlap", value: 87 },
      { label: "Defending", value: 82 },
      { label: "Crossing", value: 84 },
      { label: "Pace", value: 85 },
      { label: "Discipline", value: 91 },
    ],
    development: [
      { label: "U15", value: 50 },
      { label: "U16", value: 62 },
      { label: "U17", value: 74 },
      { label: "HS Sr", value: 83 },
      { label: "Proj. Yr1", value: 87 },
      { label: "Proj. Yr3", value: 91 },
    ],
    interest: 9,
    scholarshipProbability: 84,
    tags: ["Two-Way FB", "3.9 GPA", "Relentless Motor"],
    bio: "A two-way full back with a relentless overlap. RFX matched Patrick's academic profile and motor to John Carroll's possession identity.",
  },
  {
    id: "kruz-held",
    name: "Kruz Held",
    firstName: "Kruz",
    lastName: "Held",
    image: "/assets/athletes/kruz-held.jpg",
    sport: "Men's Soccer",
    sportId: "soccer",
    position: "Striker",
    classYear: "Class of 2026",
    gradYear: 2026,
    committed: true,
    program: "University of Portland",
    location: "Portland, OR",
    hometown: "Frisco, TX",
    division: "NCAA D-I",
    height: "6'1\"",
    gpa: 3.7,
    nationalRank: 33,
    matchScore: 95,
    status: "Committed",
    accent: "#4b2e83",
    verified: true,
    metrics: [
      { label: "Goals / 90", value: "0.83", pct: 96 },
      { label: "Shots / 90", value: "4.2", pct: 90 },
      { label: "Aerial Win", value: "68", unit: "%", pct: 85 },
      { label: "Hold-Up", value: "79", unit: "%", pct: 87 },
    ],
    radar: [
      { label: "Finishing", value: 94 },
      { label: "Movement", value: 91 },
      { label: "Strength", value: 86 },
      { label: "Hold-Up", value: 87 },
      { label: "Pace", value: 84 },
      { label: "Composure", value: 90 },
    ],
    development: [
      { label: "U15", value: 60 },
      { label: "U16", value: 70 },
      { label: "U17", value: 80 },
      { label: "HS Jr", value: 88 },
      { label: "Proj. Yr1", value: 92 },
      { label: "Proj. Yr3", value: 96 },
    ],
    interest: 21,
    scholarshipProbability: 93,
    tags: ["Clinical 9", "Target Man", "Class of '26", "Pilots Pipeline"],
    bio: "A clinical center forward with elite movement in the box. RFX's predictive model projected Kruz's Year-3 ceiling inside the West Coast Conference.",
  },
  {
    id: "catelyn-demoor",
    name: "Catelyn De Moor",
    firstName: "Catelyn",
    lastName: "De Moor",
    image: "/assets/athletes/catelyn-demoor.jpg",
    sport: "Women's Soccer",
    sportId: "soccer",
    position: "Midfielder",
    classYear: "Class of 2025",
    gradYear: 2025,
    committed: true,
    program: "Baylor University",
    location: "Waco, TX",
    hometown: "Dallas, TX",
    division: "NCAA D-I",
    height: "5'7\"",
    gpa: 3.85,
    nationalRank: 19,
    matchScore: 97,
    status: "Committed",
    accent: "#154734",
    verified: true,
    metrics: [
      { label: "Pass Acc.", value: "89", unit: "%", pct: 90 },
      { label: "Prog. Passes", value: "7.9", pct: 92 },
      { label: "Distance", value: "11.8", unit: "km", pct: 90 },
      { label: "Key Passes", value: "2.7", pct: 88 },
    ],
    radar: [
      { label: "Vision", value: 92 },
      { label: "Engine", value: 90 },
      { label: "Passing", value: 91 },
      { label: "Press", value: 85 },
      { label: "Set Pieces", value: 87 },
      { label: "IQ", value: 93 },
    ],
    development: [
      { label: "U15", value: 59 },
      { label: "U16", value: 70 },
      { label: "U17", value: 81 },
      { label: "HS Sr", value: 89 },
      { label: "Proj. Yr1", value: 92 },
      { label: "Proj. Yr3", value: 96 },
    ],
    interest: 24,
    scholarshipProbability: 95,
    tags: ["Power 5", "Deep-Lying Maestro", "Set Pieces", "Top 20"],
    bio: "A Power-5 caliber deep-lying midfielder. RFX's program comparison engine ranked Baylor as her top fit on style, academics, and development trajectory.",
  },
];

export const getAthlete = (id: string) => ATHLETES.find((a) => a.id === id);

// Lightweight showcase imagery used in the storytelling reel.
export const SHOWCASE_IMAGES = [
  { src: "/assets/athletes/academy-duo.jpeg", caption: "Academy Pipeline · Live Tracking" },
  { src: "/assets/athletes/roster-trio.jpeg", caption: "Multi-Program Commit Class" },
  { src: "/assets/stadium-hero.webp", caption: "Matchday Telemetry · 60fps Capture" },
];
