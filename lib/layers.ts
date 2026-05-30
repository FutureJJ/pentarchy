export type Layer =
  | "political"
  | "economy"
  | "military"
  | "order"
  | "diplomacy"
  | "intelligence"
  | "fog";

export const LAYERS: { id: Layer; label: string; accent: string; hint: string }[] = [
  { id: "political", label: "Political", accent: "#a8763a", hint: "Borders, capitals, provinces" },
  { id: "economy", label: "Economy", accent: "#6fa787", hint: "GDP, trade, treasury flows" },
  { id: "military", label: "Military", accent: "#c14a3a", hint: "Armies, garrisons, fronts" },
  { id: "order", label: "Order", accent: "#8a4f2a", hint: "Crime, policing, loyalty" },
  { id: "diplomacy", label: "Diplomacy", accent: "#a37aa0", hint: "Treaties, cables, embassies" },
  { id: "intelligence", label: "Intelligence", accent: "#6c7fb1", hint: "Visibility, fog, espionage" },
  { id: "fog", label: "Fog of War", accent: "#3a342d", hint: "Unmapped frontiers" },
];
