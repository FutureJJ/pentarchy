"use client";

import { useState } from "react";
import WorldMap from "./WorldMap";
import LayerSwitcher from "./LayerSwitcher";
import CountrySheet from "./CountrySheet";
import CitySheet from "./CitySheet";
import { type Layer } from "@/lib/layers";

export default function MapView() {
  const [layer, setLayer] = useState<Layer>("political");
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  return (
    <>
      <div className="relative w-full aspect-[16/9] max-h-[78svh]">
        <Corner pos="tl" />
        <Corner pos="tr" />
        <Corner pos="bl" />
        <Corner pos="br" />
        <WorldMap
          layer={layer}
          selected={selected}
          selectedCity={selectedCity}
          onSelect={(code) => {
            setSelectedCity(null);
            setSelected(code);
          }}
          onSelectCity={(key) => {
            setSelected(null);
            setSelectedCity(key);
          }}
        />
      </div>
      <div className="mt-4 sm:mt-6">
        <LayerSwitcher layer={layer} setLayer={setLayer} />
      </div>
      {selected && !selectedCity && (
        <CountrySheet code={selected} onClose={() => setSelected(null)} />
      )}
      {selectedCity && (
        <CitySheet
          cityKey={selectedCity}
          onClose={() => setSelectedCity(null)}
        />
      )}
    </>
  );
}

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const map = {
    tl: "-top-px -left-px border-l border-t",
    tr: "-top-px -right-px border-r border-t",
    bl: "-bottom-px -left-px border-l border-b",
    br: "-bottom-px -right-px border-r border-b",
  } as const;
  return (
    <span
      aria-hidden
      className={`absolute z-20 w-4 h-4 border-brass ${map[pos]}`}
    />
  );
}
