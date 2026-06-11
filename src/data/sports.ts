// RFX is sport-agnostic by architecture. Every collegiate sport is a
// first-class citizen — this taxonomy drives filtering, the coverage grid,
// and the matching engine's sport context.

export type SportCategory =
  | "Team"
  | "Individual"
  | "Combat"
  | "Aquatic"
  | "Emerging";

export interface Sport {
  id: string;
  name: string;
  icon: string; // emoji glyph used as a lightweight broadcast bug
  category: SportCategory;
  athletes: string; // marketed pool size
  programs: number;
}

export const SPORTS: Sport[] = [
  { id: "football", name: "Football", icon: "🏈", category: "Team", athletes: "412K", programs: 1240 },
  { id: "basketball", name: "Basketball", icon: "🏀", category: "Team", athletes: "388K", programs: 2100 },
  { id: "soccer", name: "Soccer", icon: "⚽", category: "Team", athletes: "496K", programs: 1880 },
  { id: "baseball", name: "Baseball", icon: "⚾", category: "Team", athletes: "241K", programs: 1640 },
  { id: "softball", name: "Softball", icon: "🥎", category: "Team", athletes: "198K", programs: 1590 },
  { id: "volleyball", name: "Volleyball", icon: "🏐", category: "Team", athletes: "276K", programs: 1720 },
  { id: "track-field", name: "Track & Field", icon: "🏃", category: "Individual", athletes: "354K", programs: 1310 },
  { id: "cross-country", name: "Cross Country", icon: "🥾", category: "Individual", athletes: "188K", programs: 1280 },
  { id: "swimming", name: "Swimming", icon: "🏊", category: "Aquatic", athletes: "142K", programs: 540 },
  { id: "golf", name: "Golf", icon: "⛳", category: "Individual", athletes: "96K", programs: 1490 },
  { id: "tennis", name: "Tennis", icon: "🎾", category: "Individual", athletes: "118K", programs: 1370 },
  { id: "wrestling", name: "Wrestling", icon: "🤼", category: "Combat", athletes: "134K", programs: 460 },
  { id: "lacrosse", name: "Lacrosse", icon: "🥍", category: "Team", athletes: "112K", programs: 720 },
  { id: "field-hockey", name: "Field Hockey", icon: "🏑", category: "Team", athletes: "64K", programs: 310 },
  { id: "gymnastics", name: "Gymnastics", icon: "🤸", category: "Individual", athletes: "38K", programs: 190 },
  { id: "rowing", name: "Rowing", icon: "🚣", category: "Aquatic", athletes: "42K", programs: 280 },
  { id: "hockey", name: "Ice Hockey", icon: "🏒", category: "Team", athletes: "78K", programs: 360 },
  { id: "rugby", name: "Rugby", icon: "🏉", category: "Team", athletes: "54K", programs: 240 },
  { id: "cheer", name: "Cheer", icon: "📣", category: "Team", athletes: "126K", programs: 880 },
  { id: "esports", name: "Esports", icon: "🎮", category: "Emerging", athletes: "204K", programs: 640 },
];

export const DIVISIONS = [
  { id: "d1", label: "NCAA D-I", color: "#2e50d4" },
  { id: "d2", label: "NCAA D-II", color: "#4b6eff" },
  { id: "d3", label: "NCAA D-III", color: "#4b6eff" },
  { id: "naia", label: "NAIA", color: "#cfcfd6" },
  { id: "juco", label: "JUCO", color: "#e11d2a" },
  { id: "intl", label: "International", color: "#2e50d4" },
] as const;

export type DivisionId = (typeof DIVISIONS)[number]["id"];
