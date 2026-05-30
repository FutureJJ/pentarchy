import MapView from "./MapView";
import TurnIndicator from "./TurnIndicator";

export default function Hero() {
  return (
    <section className="relative w-full bg-bone overflow-hidden pt-24 sm:pt-28 lg:pt-32 pb-10">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10">
        <MapView />
        <div className="mt-3 sm:mt-4 flex items-center justify-between gap-4 mono text-[10px] sm:text-xs uppercase tracking-widest text-ash">
          <TurnIndicator />
          <span className="hidden sm:inline">Tap a nation to open dossier</span>
          <span>↓ scroll for charter</span>
        </div>
      </div>
    </section>
  );
}
