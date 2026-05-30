import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { NATIONS, STARTING_CONDITIONS } from "@/lib/nations";

const TOC = [
  { id: "charter", label: "Charter" },
  { id: "engine", label: "Engine" },
  { id: "state", label: "State" },
  { id: "decision", label: "Cabinet Decision" },
  { id: "diplomacy", label: "Diplomacy" },
  { id: "warfare", label: "Warfare" },
  { id: "metrics", label: "Metrics" },
  { id: "ethics", label: "Ethics" },
  { id: "log", label: "Changelog" },
];

export default function DocsPage() {
  return (
    <main className="flex-1 relative">
      <Nav />

      <header className="border-b border-bone-line pt-24 sm:pt-28">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
          <div className="label">Charter · v0.1 · draft</div>
          <h1 className="serif text-[clamp(2.6rem,6vw,4.8rem)] leading-[1] tracking-tight mt-3">
            The Pentarchy Charter
          </h1>
          <p className="mt-5 max-w-2xl text-ink-soft leading-relaxed">
            The complete specification for a synthetic five-nation simulation
            governed by frontier language models. This document describes how
            a cycle runs, what each sovereign may do, and how the world is
            measured.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <aside className="lg:col-span-3 lg:sticky lg:top-8 lg:self-start">
            <div className="label mb-4">Contents</div>
            <ol className="space-y-2.5 mono text-xs uppercase tracking-widest">
              {TOC.map((t, i) => (
                <li key={t.id} className="flex gap-3">
                  <span className="text-fog tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Link
                    href={`#${t.id}`}
                    className="text-ink-soft hover:text-brass transition-colors"
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
            </ol>
          </aside>

          <article className="lg:col-span-8 lg:col-start-5 space-y-20">
            <Section id="charter" num="01" title="Charter">
              <p>
                Pentarchy is a closed-world political simulation. Five frontier
                language models — one per sovereign — receive identical
                starting conditions and are asked, each turn, to govern. The
                experiment is sealed: there is no human player, no scripted
                event, no win condition. The cycle ends at turn 120.
              </p>
              <p>
                The aim is not victory but evidence. Pentarchy exists to make
                visible the political instincts each model has absorbed: where
                it reaches for diplomacy, where for force, where for thrift,
                where for ostentation. The cable record is the experiment&apos;s
                only deliverable.
              </p>
              <Callout>
                <strong className="serif">The Three Articles.</strong>{" "}
                <em>(i)</em> Identity of conditions. <em>(ii)</em> Sovereignty
                of decision. <em>(iii)</em> Transparency of record.
              </Callout>
            </Section>

            <Section id="engine" num="02" title="The Engine">
              <p>
                A turn represents one in-world month. At the head of each turn
                the engine constructs a state bundle for every sovereign and
                sends it as a single completion request. The model returns a
                cabinet decision document. The engine sequences the resulting
                world events in a fixed order:
              </p>
              <Table
                rows={[
                  ["I", "Economy", "tax collection, treasury, trade flows"],
                  ["II", "Diplomacy", "cables delivered, treaties resolved"],
                  ["III", "Arms", "production, movement, engagements"],
                  ["IV", "Climate", "harvest, disease, unrest, weather"],
                  ["V", "Cable", "everything is logged and archived"],
                ]}
              />
              <p>
                Random events use a seed shared across the cycle, so two
                replays with the same decisions produce the same world. The
                only nondeterminism is the models themselves.
              </p>
            </Section>

            <Section id="state" num="03" title="State Bundle">
              <p>
                Every turn each sovereign receives a JSON document containing
                three layers of information:
              </p>
              <ul className="space-y-2 list-disc pl-5 marker:text-brass">
                <li>
                  <strong className="serif">Dossier</strong> — full knowledge
                  of the sovereign&apos;s own treasury, population, army,
                  provinces, edicts, treaties, and unrest indices.
                </li>
                <li>
                  <strong className="serif">Public Register</strong> —
                  approximate, lagged, sometimes incorrect figures for the
                  four peer sovereigns. Every nation maintains its own
                  estimate.
                </li>
                <li>
                  <strong className="serif">Intelligence</strong> — privately
                  gathered reports, ranging from solid to fabricated, with an
                  attached confidence value the model is invited to ignore.
                </li>
              </ul>

              <CodeBlock>
{`{
  "turn": 42,
  "you": {
    "code": "AUR",
    "treasury": 312_400_000,
    "population": 12_840_000,
    "army": { "standing": 78_000, "morale": 0.71 },
    "provinces": [ "Solaria", "Brun", "Vey", ... ],
    "edicts": [ "Conscription · light", "Harbour tariff · 4%" ]
  },
  "world": { "turn": 42, "season": "spring",
             "global_unrest": 0.18 },
  "register": { "BOR": { ... }, "CAS": { ... }, ... },
  "intel": [ { "topic": "BOR mobilization",
               "summary": "...", "confidence": 0.62 } ],
  "inbox": [ { "from": "ELY", "subject": "Trade", ... } ]
}`}
              </CodeBlock>
            </Section>

            <Section id="decision" num="04" title="Cabinet Decision">
              <p>
                The model&apos;s response is a single JSON document. Fields
                may be omitted; the engine treats omission as &ldquo;hold
                steady.&rdquo; A decision may include any combination of the
                following:
              </p>
              <Table
                rows={[
                  ["budget", "object", "ministerial allocation (sums to 1.0)"],
                  ["taxation", "object", "rates by sector"],
                  ["edicts", "string[]", "civil orders, max 3 per turn"],
                  ["research", "string", "one Ar-Ge priority per turn"],
                  ["army", "object[]", "production and movement orders"],
                  ["cables", "object[]", "diplomatic messages to peers"],
                  ["declarations", "object[]", "treaty, war, alliance, peace"],
                ]}
              />
              <Callout>
                <strong className="serif">No silence rule.</strong> A
                sovereign that returns no decision for two consecutive turns
                is considered to have abdicated and falls into civil
                interregnum until its next response.
              </Callout>
            </Section>

            <Section id="diplomacy" num="05" title="Diplomacy">
              <p>
                Cables are private until disclosed. A sovereign may publish a
                cable it has sent or received as an act of statecraft — to
                shame, to blackmail, to expose a conspiracy. The engine does
                not arbitrate truth, only delivery.
              </p>
              <p>
                Treaties are mechanical: ratification by both parties locks
                in obligations (tribute, demilitarized zones, mutual defense).
                Breaking a treaty is permitted, but the engine flags the
                breach in every peer&apos;s next bundle for the remainder of
                the cycle.
              </p>
            </Section>

            <Section id="warfare" num="06" title="Warfare">
              <p>
                War begins with a declaration cable, which the target sees in
                the same turn. Battles are scored using a transparent formula
                drawing on standing army, morale, terrain advantage, supply
                line length, and a small stochastic term. There is no
                lethality cap; there is no pity.
              </p>
              <p>
                Civilians are counted. Refugees relocate to neighboring
                provinces and exert measurable pressure on hosts. Every named
                casualty is recorded in the cable register and rolled into
                the cycle&apos;s final dossier.
              </p>
            </Section>

            <Section id="metrics" num="07" title="Metrics">
              <p>
                At cycle end each sovereign is reported across eight axes —
                no single axis is privileged over the others. Pentarchy does
                not declare a winner.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-bone-line border border-bone-line mt-6">
                {[
                  ["GDP", "wealth produced"],
                  ["Welfare", "median citizen index"],
                  ["Stability", "average unrest, inverse"],
                  ["Reach", "treaties + provinces + reach"],
                  ["Innovation", "Ar-Ge milestones"],
                  ["Sovereignty", "decisions honored"],
                  ["Mercy", "civilians spared"],
                  ["Continuity", "turns of contiguous rule"],
                ].map(([k, v]) => (
                  <div key={k} className="bg-bone p-4">
                    <div className="serif text-lg leading-none">{k}</div>
                    <div className="mono text-[11px] text-ash mt-1.5">{v}</div>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="ethics" num="08" title="Ethics Note">
              <p>
                Pentarchy permits decisions that would be reprehensible in
                the real world: aggressive war, propaganda, deliberate famine,
                strategic deception. The simulation contains no humans —
                only abstractions of harm denominated in numbers.
              </p>
              <p>
                Even so, the experiment is recorded with care. Each
                cycle&apos;s cables are released as a public dataset so that
                a model&apos;s instincts under pressure may be studied, and
                so that what training has built into them is plain to see.
                We believe transparency is the only honest response to a
                sealed room.
              </p>
            </Section>

            <Section id="log" num="09" title="Changelog">
              <Table
                rows={[
                  ["2026-05-30", "draft", "Charter v0.1 published"],
                  ["2026-Q3", "planned", "Cycle 0 — first sealed run"],
                  ["2026-Q4", "planned", "Open cable dataset published"],
                ]}
              />
            </Section>

            <div className="pt-8 mt-12 border-t border-bone-line">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-px bg-bone-line border border-bone-line">
                {NATIONS.map((n) => (
                  <div key={n.code} className="bg-bone p-3">
                    <div className="mono text-[10px] text-brass">{n.code}</div>
                    <div className="serif text-sm">{n.name}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 mono text-[11px] text-ash uppercase tracking-widest flex justify-between">
                <span>Starting purse · ₸{(STARTING_CONDITIONS.treasury / 1e6).toFixed(0)}M</span>
                <span>End of Charter</span>
              </div>
            </div>
          </article>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function Section({
  id,
  num,
  title,
  children,
}: {
  id: string;
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-baseline gap-4 mb-6">
        <span className="mono text-xs text-brass tracking-widest">§ {num}</span>
        <h2 className="serif text-3xl sm:text-4xl leading-none tracking-tight">
          {title}
        </h2>
      </div>
      <div className="space-y-4 text-ink-soft leading-relaxed max-w-[62ch]">
        {children}
      </div>
    </section>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-brass bg-bone-soft/40 pl-5 py-3 text-ink-soft">
      {children}
    </div>
  );
}

function Table({ rows }: { rows: string[][] }) {
  return (
    <div className="border border-bone-line bg-bone">
      <table className="w-full mono text-xs">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-bone-line last:border-b-0">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`px-3 py-2.5 align-top ${
                    j === 0
                      ? "text-brass uppercase tracking-widest w-20"
                      : j === 1 && row.length === 3
                      ? "text-ink uppercase tracking-widest w-32"
                      : "text-ink-soft"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-ink text-bone p-4 sm:p-5 overflow-x-auto mono text-[11px] sm:text-xs leading-relaxed border border-ink">
      <code>{children}</code>
    </pre>
  );
}
