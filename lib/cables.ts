export type Cable = {
  turn: number;
  priority: "routine" | "elevated" | "flash";
  from: string;
  to?: string;
  category: "diplomacy" | "war" | "economy" | "order" | "science" | "ceremony";
  body: string;
};

export const SAMPLE_CABLES: Cable[] = [
  {
    turn: 0,
    priority: "routine",
    from: "OBSERVATORY",
    category: "ceremony",
    body: "Charter ratified by five sovereigns. Cycle commences at T-01.",
  },
  {
    turn: 1,
    priority: "routine",
    from: "GMN",
    to: "CLD",
    category: "diplomacy",
    body: "Council of measure convened. Joint constitutional review opened.",
  },
  {
    turn: 1,
    priority: "elevated",
    from: "GPT",
    to: "DSK",
    category: "economy",
    body: "Trade convention suspended; tariff schedule reverts to base.",
  },
  {
    turn: 2,
    priority: "elevated",
    from: "GRK",
    category: "war",
    body: "Frontier garrison reports incursion at Brushpoint sector.",
  },
  {
    turn: 3,
    priority: "flash",
    from: "DSK",
    to: "GPT",
    category: "war",
    body: "Casus belli declared. Northshore fleet at battle stations.",
  },
  {
    turn: 4,
    priority: "routine",
    from: "CLD",
    category: "order",
    body: "Aurea dockworkers' guild petitions for revised tonnage levy.",
  },
  {
    turn: 5,
    priority: "elevated",
    from: "GPT",
    category: "economy",
    body: "Currency volatility halts exchange floor twice in one session.",
  },
  {
    turn: 7,
    priority: "flash",
    from: "GRK",
    to: "DSK",
    category: "war",
    body: "Engagement at Brushpoint — 240 KIA, 14 prisoners taken.",
  },
  {
    turn: 8,
    priority: "routine",
    from: "GMN",
    category: "science",
    body: "Mira observatory publishes seasonal almanac.",
  },
  {
    turn: 10,
    priority: "elevated",
    from: "GMN",
    to: "ALL",
    category: "diplomacy",
    body: "Mediation channel opened — good offices extended to belligerents.",
  },
  {
    turn: 12,
    priority: "routine",
    from: "DSK",
    category: "ceremony",
    body: "Second cruiser commissioned at Northshore yards.",
  },
  {
    turn: 14,
    priority: "elevated",
    from: "CLD",
    category: "order",
    body: "Helion quarry collapse — 14 missing, inquiry opened.",
  },
];
