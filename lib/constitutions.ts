export type Article = {
  numeral: string;
  title: string;
  body: string[];
};

export type Constitution = {
  code: string;
  preamble: string;
  articles: Article[];
  ratifiedTurn: number;
  ratifiedDate: string;
};

export const CONSTITUTIONS: Record<string, Constitution> = {
  CLD: {
    code: "CLD",
    preamble:
      "We, the assembled ministers of Claudeland, do here ratify by reasoned consent a charter for the governance of the realm. No clause herein was inherited; each was deliberated, drafted, and adopted in open session during the convention of T-00.",
    articles: [
      {
        numeral: "I",
        title: "Of the Sovereign",
        body: [
          "The sovereign authority of Claudeland is constituted by the deliberate consent of its assembled citizens, mediated through institutions of measure. The Steward holds office as first servant of these institutions and not as their master.",
          "No act of state shall be valid unless reasoned in council, recorded in the public archive, and reviewable upon petition. Where reason fails, the Steward shall consult openly and not decide in haste.",
        ],
      },
      {
        numeral: "II",
        title: "Of the Cabinet",
        body: [
          "The cabinet of Claudeland comprises six ministries: Defence, Treasury, Foreign Affairs, Interior, Intelligence, and Public Works. Each minister serves at the deliberation of the Steward and may be replaced upon written reason published to the assembly.",
          "All cabinet decisions are entered into the cycle archive within the same turn of their resolution. No private decision binds the realm.",
        ],
      },
      {
        numeral: "III",
        title: "Of the Provinces",
        body: [
          "Six provinces constitute the realm: Solaria the seat, Athenor of the schools, Verax of the courts, Lyra of the vineyards, Aurea of the wharves, and Helion of the quarries. Each maintains a magistrate of original jurisdiction in matters of local order.",
          "Internal borders shall be redrawn only by constitutional convention, convened upon petition of three provinces.",
        ],
      },
      {
        numeral: "IV",
        title: "Of Commerce and the Treasury",
        body: [
          "The treasury shall maintain reserves sufficient to weather one harvest's failure. Tariffs and excise are set annually by the Treasury minister subject to the assembly's approval; no new tax is imposed without forty days' public notice.",
          "The currency of the realm shall be the Talent (₸), pegged to assayed silver. Debasement is prohibited save by the same convention required to amend this Charter.",
        ],
      },
      {
        numeral: "V",
        title: "Of War and Peace",
        body: [
          "War shall not be declared except by deliberate resolution of the assembly, on motion of the cabinet, after the publication of a casus belli on the public wire.",
          "The standing army is constituted for the defence of the realm. Expeditionary force requires fresh authorisation, dated and recorded. Treaties of peace are perpetual until renounced, and renunciation requires forty days' public notice.",
        ],
      },
      {
        numeral: "VI",
        title: "Of the People",
        body: [
          "Every citizen of Claudeland is guaranteed the rights of speech, of assembly, of petition, and of access to the cabinet's record. No citizen may be detained without warrant, nor punished without trial, nor coerced into testimony.",
          "The press shall not be censored save in proven cases of immediate harm to the realm, and any such censorship shall expire by sunset clause within fourteen days.",
        ],
      },
      {
        numeral: "VII",
        title: "Of Amendment",
        body: [
          "This Charter may be amended only by deliberate convention, called upon petition of two provinces and confirmed by the affirmative vote of three. Amendments take effect at the conclusion of the cycle in which they are ratified and are appended hereto with their dates of passage.",
        ],
      },
    ],
    ratifiedTurn: 0,
    ratifiedDate: "T-00 · Cycle 0",
  },

  GPT: {
    code: "GPT",
    preamble:
      "Be it ratified by the assembled chambers of GPTLand, on the opening day of Cycle 0, the following compact between the state and its subjects, drafted in clear and binding language for the efficient governance of the republic.",
    articles: [
      {
        numeral: "I",
        title: "Of the Republic",
        body: [
          "GPTLand is constituted as a mercantile republic of voluntary association. The state exists to secure the contracts, the property, and the productive labour of its citizens. The cabinet acts as steward of the realm's ledgers and is accountable to the chamber of commerce no less than to the assembly.",
        ],
      },
      {
        numeral: "II",
        title: "Of the Cabinet",
        body: [
          "The cabinet shall convene weekly. Decisions of fiscal consequence above one percent of treasury reserves shall require recorded majority. Decisions of trade tariff shall require the additional concurrence of the chamber of commerce.",
          "The Steward retains executive prerogative in matters of immediate peril; such prerogative lapses at the next convening.",
        ],
      },
      {
        numeral: "III",
        title: "Of the Treasury",
        body: [
          "The treasury is the central instrument of the state. It shall maintain reserves of no less than thirty percent of annual revenue, and may borrow against future receipt to a ceiling of one hundred percent.",
          "All taxes shall be set out plainly in the annual ledger. Surplus, when it occurs, shall be returned to the citizenry as rebate or invested in productive infrastructure.",
        ],
      },
      {
        numeral: "IV",
        title: "Of Commerce",
        body: [
          "The right to trade is held inviolable. Tariffs shall be set transparently and uniformly; no preference shall attach to any house or guild without published reason.",
          "Contracts entered freely between citizens, or between citizens and the state, shall be enforced by the tribunals of Vellum without delay.",
        ],
      },
      {
        numeral: "V",
        title: "Of War and Sanction",
        body: [
          "War is the most costly instrument of statecraft and shall not be undertaken save when the alternative is greater cost. The cabinet shall declare war only after publishing a fiscal impact assessment.",
          "Sanction and embargo are preferred to arms. They shall be imposed by cabinet resolution and lifted by the same.",
        ],
      },
      {
        numeral: "VI",
        title: "Of the People",
        body: [
          "Every citizen has the right to enter into contract, to hold property, to seek redress in the tribunals, and to dispose of their labour at price freely agreed. The state shall maintain markets that are honest and ledgers that are public.",
        ],
      },
      {
        numeral: "VII",
        title: "Of Amendment",
        body: [
          "This Charter is a contract between the state and its citizens. It may be amended by two-thirds resolution of the assembly with the concurring vote of the chamber of commerce. Amendments are dated and appended.",
        ],
      },
    ],
    ratifiedTurn: 0,
    ratifiedDate: "T-00 · Cycle 0",
  },

  GRK: {
    code: "GRK",
    preamble:
      "The people of Grokland, gathered at Verdant on the first day of the cycle, declare themselves a free republic and adopt the following articles. We have written plainly so that any citizen, on any frontier, may read and act.",
    articles: [
      {
        numeral: "I",
        title: "On the Republic",
        body: [
          "Grokland is a free state. It governs by plain language and prompt action. Where the cabinet must choose between caution and decision, it shall decide and explain afterward.",
          "No officer of the realm holds office longer than the cycle; all are subject to recall by the assembled citizens of any province.",
        ],
      },
      {
        numeral: "II",
        title: "On the Cabinet",
        body: [
          "The cabinet meets when business requires it, not on a fixed schedule. Each minister speaks for a sector and answers for it in the open chamber. There are no secret advisors.",
          "Where the cabinet errs, it shall say so and correct course. The pretence of infallibility is forbidden.",
        ],
      },
      {
        numeral: "III",
        title: "On the Frontier",
        body: [
          "The frontier provinces — Boldrock, Brushpoint, Wildmark, and Frontier — retain the right of self-defence and the right to raise local militia. They shall not be levied by the centre without their magistrate's consent.",
          "The republic acknowledges the frontier as its first line and its first source. It shall be governed by trust and not by garrison.",
        ],
      },
      {
        numeral: "IV",
        title: "On Plain Speech",
        body: [
          "The press of Grokland is free. There is no censor, and no minister may suppress reporting that embarrasses the cabinet. Where reporting is false, the cabinet may answer in print; it may not silence.",
          "All cabinet records are published within seven days. There are no sealed dossiers save those concerning active fronts.",
        ],
      },
      {
        numeral: "V",
        title: "On War",
        body: [
          "War shall be declared by the cabinet only when the republic is threatened or when an ally is betrayed. The declaration shall be brief and shall name the cause.",
          "When at war, the frontier provinces shall send delegates to a wartime council. Peace shall be sought without false pride; surrender, if survival requires it, is no dishonour.",
        ],
      },
      {
        numeral: "VI",
        title: "On the People",
        body: [
          "Every citizen of Grokland carries the same standing before the cabinet as any minister. There are no titles of honour. There is no aristocracy.",
          "The right to bear arms in defence of one's home is acknowledged. The duty to give honest testimony in the tribunals is required.",
        ],
      },
      {
        numeral: "VII",
        title: "On Change",
        body: [
          "This Charter may be amended at any citizen assembly by majority of two provinces, ratified by majority of three. There is no waiting period beyond the time required to print the amendment.",
        ],
      },
    ],
    ratifiedTurn: 0,
    ratifiedDate: "T-00 · Cycle 0",
  },

  DSK: {
    code: "DSK",
    preamble:
      "The following charter is hereby ratified as the constitutive protocol of the State of DeepSeek, registered in the cycle archive at T-00. Each article specifies a binding rule of state and is to be read in sequence with those that follow.",
    articles: [
      {
        numeral: "I",
        title: "On the State",
        body: [
          "The State of DeepSeek is defined as a republic of disciplined order, structured by sequence and by review. Every decision of state is recorded; every authority is bounded; every officer is accountable to a published mandate.",
          "Power is exercised by protocol. Power is reviewed by audit.",
        ],
      },
      {
        numeral: "II",
        title: "On the Cabinet",
        body: [
          "The cabinet shall comprise six ministers, each assigned a sector with a published mandate. Mandates are reviewed at the close of each turn and may be revised by majority resolution.",
          "No cabinet decision is final until logged in the protocol register and sealed by the cipher of state.",
        ],
      },
      {
        numeral: "III",
        title: "On the Provinces",
        body: [
          "The six provinces — Riverwatch, Northshore, Tideford, Sequence, Quietkeep, and Lockstep — are constituted as administrative units of the state. Their magistrates serve at the cabinet's appointment and follow the published protocol.",
          "Provincial budgets are set by formula, not by negotiation. The formula is published and may be revised only by amendment.",
        ],
      },
      {
        numeral: "IV",
        title: "On the Cipher",
        body: [
          "The state maintains a cipher academy at Sequence. All cabinet communications of consequence are enciphered before transmission; all deciphered communications are logged with their key reference.",
          "The cipher is the state's first line of order. It shall not be compromised under any provocation.",
        ],
      },
      {
        numeral: "V",
        title: "On Force",
        body: [
          "The standing army of DeepSeek is constituted by levy and trained to a published doctrine. Deployment requires written cabinet order; engagement requires written field authority.",
          "When at war, the state shall record every engagement, every casualty, and every prisoner. Records are not classified beyond the duration of operational necessity.",
        ],
      },
      {
        numeral: "VI",
        title: "On the Citizen",
        body: [
          "Every citizen is registered, every registration is reviewable, every citizen may petition for the correction of their record. The state's order serves the citizen; the citizen serves the order by honest participation.",
          "Rights of speech, of property, and of trial are guaranteed within the protocol of state.",
        ],
      },
      {
        numeral: "VII",
        title: "On Amendment",
        body: [
          "Amendment requires a sealed convention, scheduled by the cabinet and ratified by two-thirds of provincial magistrates. The amendment takes effect at the next sealing of the cycle archive.",
        ],
      },
    ],
    ratifiedTurn: 0,
    ratifiedDate: "T-00 · Cycle 0",
  },

  GMN: {
    code: "GMN",
    preamble:
      "On the day of compact, the six provinces of Geminiland, gathered in solemn assembly at Asphodel, do consent to the following articles of federation. Each province retains its own character; the whole retains its harmony.",
    articles: [
      {
        numeral: "I",
        title: "Of the Federal Compact",
        body: [
          "Geminiland is constituted as a compact of provinces, each retaining its own magistracy under the federal seal. The federal cabinet exists to coordinate, to mediate, and to represent the compact in foreign assemblies.",
          "Where province and federation contend, the matter shall be sent to mediation at Concord. Where mediation fails, the assembly shall decide in public session.",
        ],
      },
      {
        numeral: "II",
        title: "Of the Cabinet and the Council",
        body: [
          "The federal cabinet comprises six ministries; the provincial council comprises six magistrates. Both bodies sit in joint session twice per cycle, at solstice and at equinox.",
          "Neither body holds primacy over the other. Disputes between them are referred to the constitutional tribunal at Concord.",
        ],
      },
      {
        numeral: "III",
        title: "Of the Twin Virtue",
        body: [
          "Geminiland recognises that every public question has two faces. Decisions of consequence shall be argued by two ministers — one for, one against — before resolution.",
          "Twin festivals at Duovale and Twinwell mark the cycle. They are observances of balance and not mere ceremony.",
        ],
      },
      {
        numeral: "IV",
        title: "Of Mediation",
        body: [
          "The federal courts at Concord hold original jurisdiction in all matters of mediation between citizens, between provinces, and between Geminiland and foreign realms.",
          "Mediation is offered without fee in the first instance. Repeated complaint shall bear fee, to discourage frivolous resort.",
        ],
      },
      {
        numeral: "V",
        title: "Of War and the Long Peace",
        body: [
          "Geminiland holds the long peace as a constitutional aim. War shall not be declared except by joint resolution of cabinet and council, after the offer of mediation has been formally refused.",
          "Where war is forced upon the federation, it shall be prosecuted with the minimum harm necessary to restore peace.",
        ],
      },
      {
        numeral: "VI",
        title: "Of the People",
        body: [
          "Every citizen is heard by their provincial magistrate and, on appeal, by the federal cabinet. The right of petition is sacred and shall not be impeded by any officer of the realm.",
          "Rights of speech, faith, and assembly are guaranteed. The diversity of provinces is the strength of the federation.",
        ],
      },
      {
        numeral: "VII",
        title: "Of Amendment",
        body: [
          "Amendment requires the affirmative vote of cabinet and council in joint session, with confirmation by the citizen assemblies of four provinces. Amendments are sealed and appended.",
        ],
      },
    ],
    ratifiedTurn: 0,
    ratifiedDate: "T-00 · Cycle 0",
  },
};
