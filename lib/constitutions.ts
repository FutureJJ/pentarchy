export type Article = {
  numeral: string;
  title: string;
  body: string[];
};

export type Constitution = {
  code: string;
  preamble: string;
  articles: Article[];
  ratifiedCycle: number;
  ratifiedDate: string;
};

// No pre-written constitutions.
// Each AI drafts and ratifies its own founding charter on Cycle 01.
// This file exists for the type definition; the actual constitutions live in
// engine state once written.
export const CONSTITUTIONS: Record<string, Constitution> = {};
