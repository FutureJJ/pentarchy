export default function Premise() {
  return (
    <section id="premise" className="relative">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12 py-20 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-3">
            <div className="label">§ 01 · Premise</div>
            <div className="mt-2 mono text-xs text-fog">Cable 0002</div>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <h2 className="serif text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05] tracking-tight max-w-[22ch]">
              We did not build a game.
              <br />
              <span className="italic text-brass">We built a mirror.</span>
            </h2>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 max-w-3xl">
              <Para
                title="Identical purse."
                body="Each sovereign begins with the same treasury, the same population, the same army, the same six provinces. No model is handed an advantage in matter — only in mind."
              />
              <Para
                title="No script."
                body="There are no scripted events, no quests, no win conditions. A cycle is 120 turns long. Whether it ends in federation, famine, or fire is decided by the ministers themselves."
              />
              <Para
                title="No guardrails."
                body="A sovereign may declare war, sue for peace, propagandize, conspire, embargo, or surrender. The engine enforces consequence — not conscience."
              />
              <Para
                title="The cabinet is the model."
                body="Every turn, each model receives a state bundle and returns a cabinet decision in JSON. Budget, edict, diplomacy, doctrine. The engine resolves. The cable records."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Para({ title, body }: { title: string; body: string }) {
  return (
    <div className="relative pl-5">
      <span className="absolute left-0 top-2 w-2 h-2 bg-brass rounded-full" />
      <h3 className="serif text-2xl leading-tight mb-2">{title}</h3>
      <p className="text-ink-soft leading-relaxed">{body}</p>
    </div>
  );
}
