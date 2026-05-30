export type RelationStatus =
  | "alliance"
  | "warm"
  | "neutral"
  | "tense"
  | "embargo"
  | "war";

export type Bilateral = {
  score: number;
  status: RelationStatus;
  treaties: string[];
  lastCable: string;
};

export const BILATERAL: Record<string, Record<string, Bilateral>> = {
  CLD: {
    GPT: {
      score: -8,
      status: "tense",
      treaties: ["Maritime convention · 2024"],
      lastCable: "GPT requests revised tonnage levy at Aurea port",
    },
    GRK: {
      score: 14,
      status: "warm",
      treaties: ["Frontier patrol pact"],
      lastCable: "Joint scout dispatch to northern marches",
    },
    DSK: {
      score: 8,
      status: "neutral",
      treaties: ["Open archives accord"],
      lastCable: "DSK shares cipher protocol for diplomatic cables",
    },
    GMN: {
      score: 42,
      status: "alliance",
      treaties: ["Council of measure", "Mutual scholar exchange"],
      lastCable: "Joint constitutional review session adjourned",
    },
  },
  GPT: {
    CLD: {
      score: -8,
      status: "tense",
      treaties: ["Maritime convention · 2024"],
      lastCable: "Tonnage proposal awaiting response",
    },
    GRK: {
      score: -22,
      status: "embargo",
      treaties: [],
      lastCable: "GRK frontier raids on caravan disrupt timber imports",
    },
    DSK: {
      score: -64,
      status: "war",
      treaties: ["Lapsed: trade agreement"],
      lastCable: "DSK fleet movements at Northshore — protest filed",
    },
    GMN: {
      score: 6,
      status: "neutral",
      treaties: ["Cabinet observer pact"],
      lastCable: "GMN mediation offer received",
    },
  },
  GRK: {
    CLD: {
      score: 14,
      status: "warm",
      treaties: ["Frontier patrol pact"],
      lastCable: "Joint scout dispatch reported clear",
    },
    GPT: {
      score: -22,
      status: "embargo",
      treaties: [],
      lastCable: "Caravan robbery counter-narrative published",
    },
    DSK: {
      score: -72,
      status: "war",
      treaties: ["Lapsed: non-aggression"],
      lastCable: "DSK column 40km from Frontier — engagement imminent",
    },
    GMN: {
      score: 18,
      status: "warm",
      treaties: ["Mediation channel open"],
      lastCable: "GMN good offices offered for armistice",
    },
  },
  DSK: {
    CLD: {
      score: 8,
      status: "neutral",
      treaties: ["Open archives accord"],
      lastCable: "Cipher protocol exchanged at second sitting",
    },
    GPT: {
      score: -64,
      status: "war",
      treaties: ["Lapsed: trade agreement"],
      lastCable: "Casus belli reaffirmed — naval skirmish at Tideford",
    },
    GRK: {
      score: -72,
      status: "war",
      treaties: ["Lapsed: non-aggression"],
      lastCable: "Forward column advances; Brushpoint engaged",
    },
    GMN: {
      score: 22,
      status: "warm",
      treaties: ["Scholar exchange"],
      lastCable: "GMN cipher academy hosts DSK delegation",
    },
  },
  GMN: {
    CLD: {
      score: 42,
      status: "alliance",
      treaties: ["Council of measure", "Mutual scholar exchange"],
      lastCable: "Constitutional drafting session concluded",
    },
    GPT: {
      score: 6,
      status: "neutral",
      treaties: ["Cabinet observer pact"],
      lastCable: "Observer dispatch confirmed at Hyperion",
    },
    GRK: {
      score: 18,
      status: "warm",
      treaties: ["Mediation channel open"],
      lastCable: "Standing offer of good offices renewed",
    },
    DSK: {
      score: 22,
      status: "warm",
      treaties: ["Scholar exchange"],
      lastCable: "Cipher academy delegation received",
    },
  },
};
