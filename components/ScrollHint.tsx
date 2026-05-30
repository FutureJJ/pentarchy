"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function ScrollHint({
  children,
  fadeColor = "#f4efe6",
}: {
  children: ReactNode;
  fadeColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const atStart = el.scrollLeft <= 2;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      setShowLeft(!atStart);
      setShowRight(!atEnd && el.scrollWidth > el.clientWidth + 2);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="relative">
      <div
        ref={ref}
        className="overflow-x-auto no-scrollbar"
        style={{ scrollBehavior: "smooth" }}
      >
        {children}
      </div>
      <div
        aria-hidden
        className={`pointer-events-none absolute left-0 top-0 bottom-0 w-10 flex items-center justify-start pl-0.5 transition-opacity duration-200 ${
          showLeft ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: `linear-gradient(to right, ${fadeColor} 30%, transparent 100%)`,
        }}
      >
        <span className="mono text-[11px] text-ash leading-none">‹</span>
      </div>
      <button
        aria-label="Scroll right for more"
        onClick={() => ref.current?.scrollBy({ left: 140, behavior: "smooth" })}
        className={`pointer-events-auto absolute right-0 top-0 bottom-0 w-10 flex items-center justify-end pr-0.5 transition-opacity duration-200 ${
          showRight ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{
          background: `linear-gradient(to left, ${fadeColor} 30%, transparent 100%)`,
        }}
        tabIndex={showRight ? 0 : -1}
      >
        <span className="mono text-[11px] text-ash leading-none">›</span>
      </button>
    </div>
  );
}
