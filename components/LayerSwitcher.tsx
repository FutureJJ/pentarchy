"use client";

import { LAYERS, type Layer } from "@/lib/layers";
import ScrollHint from "./ScrollHint";

export default function LayerSwitcher({
  layer,
  setLayer,
}: {
  layer: Layer;
  setLayer: (l: Layer) => void;
}) {
  const active = LAYERS.find((l) => l.id === layer)!;
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2 mono text-[10px] text-ash uppercase tracking-widest">
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ background: active.accent }}
        />
        <span className="text-ink-soft">{active.label}</span>
        <span aria-hidden>·</span>
        <span>{active.hint}</span>
      </div>
      <ScrollHint>
        <div className="inline-flex gap-1.5 min-w-full py-0.5">
          {LAYERS.map((l) => {
            const isActive = l.id === layer;
            return (
              <button
                key={l.id}
                onClick={() => setLayer(l.id)}
                className="group relative flex-shrink-0 px-3 sm:px-4 py-2 mono text-[10px] sm:text-xs uppercase tracking-widest border transition-colors"
                style={{
                  borderColor: isActive ? l.accent : "var(--color-bone-line)",
                  color: isActive ? l.accent : "var(--color-ink-soft)",
                  background: isActive ? "var(--color-bone)" : "transparent",
                }}
                aria-pressed={isActive}
              >
                {l.label}
                {isActive && (
                  <span
                    className="absolute -bottom-px left-3 right-3 h-px"
                    style={{ background: l.accent }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </ScrollHint>
    </div>
  );
}
