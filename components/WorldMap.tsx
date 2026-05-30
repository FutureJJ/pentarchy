"use client";

import {
  CABLE_ARCS,
  CONTINENTS,
  MAP_HEIGHT,
  MAP_WIDTH,
  SEA_ROUTES,
  provincesFor,
} from "@/lib/worldmap";
import { NATIONS } from "@/lib/nations";
import { CITY_DATA } from "@/lib/cityData";
import { useLiveState } from "@/lib/useLiveState";
import type { Layer } from "@/lib/layers";

type Props = {
  layer: Layer;
  selected: string | null;
  selectedCity: string | null;
  onSelect: (code: string | null) => void;
  onSelectCity: (key: string | null) => void;
};

export default function WorldMap({
  layer,
  selected,
  selectedCity,
  onSelect,
  onSelectCity,
}: Props) {
  const nationByCode = Object.fromEntries(NATIONS.map((n) => [n.code, n]));
  const { data: liveData } = useLiveState(30_000);
  const liveNations = liveData?.state?.nations;

  const showSeaRoutes = layer === "economy" || layer === "political";
  const showCableArcs =
    layer === "diplomacy" || layer === "political";
  const cablesAlwaysOn = layer === "diplomacy";
  const showProvinces = layer !== "fog";
  const showCities = layer !== "fog";
  const showCityLabels =
    layer === "political" || layer === "military" || layer === "order";
  const dimNonSelected = !!selected || !!selectedCity;

  const layerFilter = (() => {
    switch (layer) {
      case "intelligence":
        return "saturate(0.35) brightness(0.96)";
      case "fog":
        return "saturate(0.15) brightness(0.82)";
      default:
        return "none";
    }
  })();

  return (
    <svg
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 w-full h-full"
      aria-label="Pentarchy world map — five sovereign territories"
    >
      <defs>
        <pattern
          id="ocean-hatch"
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="7"
            stroke="#0d0d0c"
            strokeWidth="0.4"
            opacity="0.10"
          />
        </pattern>

        <pattern
          id="ocean-waves"
          width="60"
          height="22"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 0 11 Q 15 4 30 11 T 60 11"
            fill="none"
            stroke="#0d0d0c"
            strokeWidth="0.5"
            opacity="0.07"
          />
          <path
            d="M 0 17 Q 15 10 30 17 T 60 17"
            fill="none"
            stroke="#0d0d0c"
            strokeWidth="0.5"
            opacity="0.04"
          />
        </pattern>

        {NATIONS.map((n) => (
          <pattern
            key={`pat-${n.code}`}
            id={`land-${n.code}`}
            width="9"
            height="9"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(30)"
          >
            <rect width="9" height="9" fill={n.fill} />
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="9"
              stroke={n.fillDeep}
              strokeWidth="0.9"
              opacity="0.42"
            />
            <line
              x1="4.5"
              y1="0"
              x2="4.5"
              y2="9"
              stroke={n.fillDeep}
              strokeWidth="0.35"
              opacity="0.22"
            />
          </pattern>
        ))}

        {CONTINENTS.map((c) => (
          <filter
            key={`shadow-${c.code}`}
            id={`shadow-${c.code}`}
            x="-5%"
            y="-5%"
            width="110%"
            height="110%"
          >
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.3" />
            <feOffset dx="0" dy="2" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.22" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ))}

        {CONTINENTS.map((c) => (
          <clipPath id={`clip-${c.code}`} key={`clip-${c.code}`}>
            <path d={c.mainD} />
          </clipPath>
        ))}
      </defs>

      <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#f4efe6" />
      <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#ocean-waves)" />
      <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#ocean-hatch)" />

      <g
        fill="none"
        stroke="#0d0d0c"
        strokeWidth="0.4"
        opacity="0.07"
      >
        {Array.from({ length: 19 }).map((_, i) => {
          const x = (i / 18) * MAP_WIDTH;
          return <line key={`v-${i}`} x1={x} y1={0} x2={x} y2={MAP_HEIGHT} />;
        })}
        {Array.from({ length: 11 }).map((_, i) => {
          const y = (i / 10) * MAP_HEIGHT;
          return <line key={`h-${i}`} x1={0} y1={y} x2={MAP_WIDTH} y2={y} />;
        })}
      </g>

      {showCableArcs && (
        <g>
          {CABLE_ARCS.map((arc) => (
            <g key={arc.id}>
              <path
                d={arc.d}
                fill="none"
                stroke="#a8763a"
                strokeWidth={cablesAlwaysOn ? 1 : 1.2}
                strokeDasharray="6 8"
                opacity={cablesAlwaysOn ? 0.42 : 0}
              >
                {!cablesAlwaysOn && (
                  <>
                    <animate
                      attributeName="opacity"
                      values="0;0.55;0.55;0"
                      dur="18s"
                      begin={`${arc.delay}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="-280"
                      dur="18s"
                      begin={`${arc.delay}s`}
                      repeatCount="indefinite"
                    />
                  </>
                )}
              </path>
            </g>
          ))}
        </g>
      )}

      <g style={{ filter: layerFilter }}>
        {CONTINENTS.map((c) => {
          const nation = nationByCode[c.code];
          if (!nation) return null;
          const isSelected = selected === c.code;
          const isDim = dimNonSelected && !isSelected;
          const opacity = isDim ? 0.55 : 1;
          const liveN = liveNations?.[c.code as keyof typeof liveNations];
          const livePosture = liveN?.posture.diplomatic ?? "peace";
          const liveGdp = liveN?.economy.gdp ?? 480;
          const economyBoost =
            layer === "economy" ? Math.max(0.55, Math.min(1, liveGdp / 600)) : 1;
          const fillOpacity = layer === "economy" ? economyBoost : 1;
          const borderWidth =
            layer === "military"
              ? livePosture === "war"
                ? 2.6
                : livePosture === "tense"
                  ? 2.0
                  : 1.4
              : 1.4;
          const borderStroke =
            layer === "military" && livePosture === "war"
              ? "#c14a3a"
              : nation.ink;
          return (
            <g
              key={`land-${c.code}`}
              filter={`url(#shadow-${c.code})`}
              style={{ cursor: "pointer", opacity, transition: "opacity 0.3s" }}
              onClick={() => onSelect(isSelected ? null : c.code)}
            >
              <path d={c.d} fill={nation.fill} fillOpacity={fillOpacity} />
              <path d={c.d} fill={`url(#land-${c.code})`} fillOpacity={fillOpacity} />
              <path
                d={c.d}
                fill="none"
                stroke={borderStroke}
                strokeWidth={borderWidth}
                strokeLinejoin="round"
              />
              <path
                d={c.d}
                fill="none"
                stroke="#0d0d0c"
                strokeWidth="0.5"
                strokeLinejoin="round"
                opacity="0.45"
              />
              {isSelected && (
                <path
                  d={c.mainD}
                  fill="none"
                  stroke="#c14a3a"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  opacity="0.85"
                />
              )}
            </g>
          );
        })}
      </g>

      {showSeaRoutes && (
      <g>
        {SEA_ROUTES.map((route) => (
          <g key={route.id}>
            <path
              d={route.d}
              fill="none"
              stroke="#0d0d0c"
              strokeWidth="0.5"
              strokeDasharray="2 6"
              opacity="0.20"
            />
            <g>
              <circle r="3" fill="#0d0d0c">
                <animateMotion
                  dur={`${route.duration}s`}
                  repeatCount="indefinite"
                  rotate="auto"
                  path={route.d}
                />
              </circle>
              <circle r="5.5" fill="#0d0d0c" opacity="0.12">
                <animateMotion
                  dur={`${route.duration}s`}
                  repeatCount="indefinite"
                  path={route.d}
                />
              </circle>
            </g>
          </g>
        ))}
      </g>
      )}

      {showProvinces && (
      <g style={{ filter: layerFilter }}>
        {CONTINENTS.map((c) => {
          const nation = nationByCode[c.code];
          if (!nation) return null;
          const cells = provincesFor(c.code);
          return (
            <g key={`prov-${c.code}`} clipPath={`url(#clip-${c.code})`}>
              {cells.map((cell, i) => (
                <path
                  key={`cell-${c.code}-${i}`}
                  d={cell.d}
                  fill="none"
                  stroke={nation.ink}
                  strokeWidth="0.7"
                  strokeDasharray="3 3"
                  opacity="0.32"
                />
              ))}
            </g>
          );
        })}
      </g>
      )}

      <g style={{ filter: layerFilter }}>
        {CONTINENTS.map((c) => {
          const nation = nationByCode[c.code];
          if (!nation) return null;
          const fontSize = c.code === "GMN" ? 30 : 36;
          const isSelected = selected === c.code;
          const isDim = dimNonSelected && !isSelected;
          const liveN2 = liveNations?.[c.code as keyof typeof liveNations];
          const subtitle =
            layer === "economy"
              ? `GDP ₸${Math.round(liveN2?.economy.gdp ?? 480)}B · ${(liveN2?.economy.unemployment ?? 0.06) > 0.1 ? "STRESSED" : "STABLE"}`
              : layer === "military"
                ? `${Math.round(liveN2?.military.standingArmy ?? 75)}K STANDING · ${(liveN2?.posture.diplomatic ?? "peace").toUpperCase()}`
                : layer === "diplomacy"
                  ? `${nation.steward.provider.toUpperCase()} · ${(liveN2?.posture.diplomatic ?? "peace").toUpperCase()}`
                  : layer === "intelligence"
                    ? `INTEL ${Math.round((liveN2?.posture.intelKnown ?? 0.5) * 100)}% KNOWN`
                    : layer === "fog"
                      ? "·  ·  ·"
                      : `${c.code} · ${(liveN2?.declaredDoctrine && liveN2.declaredDoctrine !== "undeclared" ? liveN2.declaredDoctrine : "undeclared").toUpperCase()}`;
          return (
            <g
              key={`lbl-${c.code}`}
              transform={`translate(${c.center.x} ${c.center.y})`}
              style={{ opacity: isDim ? 0.5 : 1, transition: "opacity 0.3s" }}
            >
              <text
                textAnchor="middle"
                fontFamily="var(--font-display)"
                fontSize={fontSize}
                fill={nation.ink}
                letterSpacing="2.5"
                opacity="0.88"
              >
                {nation.name.toUpperCase()}
              </text>
              <text
                y={22}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="9"
                fill={nation.ink}
                opacity="0.7"
                letterSpacing="2.5"
              >
                {subtitle}
              </text>
            </g>
          );
        })}
      </g>

      {showCities && (
      <g style={{ filter: layerFilter }}>
        {NATIONS.map((nation) => {
          const continent = CONTINENTS.find((cc) => cc.code === nation.code);
          if (!continent) return null;
          const isSelected = selected === nation.code;
          const isDim = dimNonSelected && !isSelected;
          return (
            <g
              key={`cities-${nation.code}`}
              style={{ opacity: isDim ? 0.4 : 1, transition: "opacity 0.3s" }}
            >
              {nation.cities.map((city, i) => {
                const dx = city.x - continent.center.x;
                const right = dx >= 0;
                const labelOffset = right ? 7 : -7;
                const anchor = right ? "start" : "end";
                const showLabel = showCityLabels || isSelected;
                const cityKey = `${nation.code}:${city.name}`;
                const cityData = CITY_DATA[cityKey];
                const isCitySelected = selectedCity === cityKey;
                const crimeHeat = cityData?.crime.total ?? 0;
                const heatColor =
                  crimeHeat > 0.45
                    ? "#c14a3a"
                    : crimeHeat > 0.3
                      ? "#a8763a"
                      : nation.ink;
                const baseDot = layer === "military" ? 3.4 : 2.6;
                const dotSize =
                  layer === "order" ? 3 + crimeHeat * 6 : baseDot;
                const dotFill =
                  layer === "order" ? heatColor : nation.ink;
                return (
                  <g
                    key={`city-${nation.code}-${i}`}
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCity(isCitySelected ? null : cityKey);
                    }}
                  >
                    {layer === "order" && crimeHeat > 0.25 && (
                      <circle
                        cx={city.x}
                        cy={city.y}
                        r={dotSize * 2.4}
                        fill={heatColor}
                        opacity={0.18}
                      />
                    )}
                    {city.capital ? (
                      <g transform={`translate(${city.x} ${city.y})`}>
                        <rect
                          x={-dotSize - 0.8}
                          y={-dotSize - 0.8}
                          width={(dotSize + 0.8) * 2}
                          height={(dotSize + 0.8) * 2}
                          fill={dotFill}
                          stroke="#f4efe6"
                          strokeWidth="1"
                        />
                        <circle r="1.3" fill="#f4efe6" />
                      </g>
                    ) : (
                      <circle
                        cx={city.x}
                        cy={city.y}
                        r={dotSize}
                        fill={dotFill}
                        stroke="#f4efe6"
                        strokeWidth="0.9"
                      />
                    )}
                    {isCitySelected && (
                      <circle
                        cx={city.x}
                        cy={city.y}
                        r={dotSize + 6}
                        fill="none"
                        stroke="#c14a3a"
                        strokeWidth="1.4"
                        strokeDasharray="3 3"
                      />
                    )}
                    {showLabel && (
                      <text
                        x={city.x + labelOffset}
                        y={city.y + 3.5}
                        textAnchor={anchor}
                        fontFamily="var(--font-mono)"
                        fontSize="9"
                        fill={nation.ink}
                        opacity="0.78"
                        letterSpacing="0.5"
                      >
                        {city.name.toUpperCase()}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
      </g>
      )}

      <g
        fontFamily="var(--font-mono)"
        fontSize="9"
        fill="#4a4a45"
        letterSpacing="1"
      >
        {Array.from({ length: 17 }).map((_, i) => {
          const x = (i / 16) * MAP_WIDTH;
          return (
            <g key={`tick-top-${i}`}>
              <line
                x1={x}
                y1={0}
                x2={x}
                y2={i % 4 === 0 ? 12 : 6}
                stroke="#0d0d0c"
                strokeWidth="0.6"
              />
              {i % 4 === 0 && (
                <text x={x + 3} y={22}>
                  {String(i * 10).padStart(3, "0")}
                </text>
              )}
            </g>
          );
        })}
        {Array.from({ length: 9 }).map((_, i) => {
          const y = (i / 8) * MAP_HEIGHT;
          return (
            <g key={`tick-left-${i}`}>
              <line
                x1={0}
                y1={y}
                x2={i % 2 === 0 ? 12 : 6}
                y2={y}
                stroke="#0d0d0c"
                strokeWidth="0.6"
              />
              {i % 2 === 0 && (
                <text x={18} y={y + 11}>
                  {String.fromCharCode(65 + i / 2)}
                </text>
              )}
            </g>
          );
        })}
      </g>

      <g transform={`translate(${MAP_WIDTH - 110}, ${MAP_HEIGHT - 130})`}>
        <circle r="38" fill="#f4efe6" stroke="#0d0d0c" strokeWidth="0.8" />
        <circle r="30" fill="none" stroke="#0d0d0c" strokeWidth="0.35" />
        <g stroke="#0d0d0c" strokeWidth="0.6">
          <line x1="0" y1="-38" x2="0" y2="38" />
          <line x1="-38" y1="0" x2="38" y2="0" />
          <line x1="-27" y1="-27" x2="27" y2="27" opacity="0.45" />
          <line x1="-27" y1="27" x2="27" y2="-27" opacity="0.45" />
        </g>
        <polygon points="0,-38 -5.5,-18 0,-23 5.5,-18" fill="#c14a3a" />
        <polygon points="0,38 -5.5,18 0,23 5.5,18" fill="#0d0d0c" opacity="0.55" />
        <text
          x="0"
          y="-46"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="9"
          letterSpacing="2.5"
          fill="#4a4a45"
        >
          N
        </text>
      </g>

      <g
        transform={`translate(60, ${MAP_HEIGHT - 56})`}
        fontFamily="var(--font-mono)"
        fontSize="9"
        fill="#4a4a45"
        letterSpacing="2"
      >
        <line
          x1="0"
          y1="0"
          x2="220"
          y2="0"
          stroke="#0d0d0c"
          strokeWidth="0.8"
        />
        {[0, 55, 110, 165, 220].map((x, i) => (
          <line
            key={`s-${i}`}
            x1={x}
            y1={i % 2 === 0 ? -5 : -3}
            x2={x}
            y2={i % 2 === 0 ? 5 : 3}
            stroke="#0d0d0c"
            strokeWidth="0.8"
          />
        ))}
        <text x="0" y="20">
          0
        </text>
        <text x="220" y="20">
          2400 LEAGUES
        </text>
        <text x="110" y="-10" textAnchor="middle" fill="#0d0d0c">
          SCALE · TYRRHENIAN
        </text>
      </g>

      <g transform={`translate(${MAP_WIDTH - 280}, 38)`}>
        <text
          fontFamily="var(--font-display)"
          fontSize="22"
          fill="#0d0d0c"
          fontStyle="italic"
        >
          The Pentarchy
        </text>
        <text
          y="18"
          fontFamily="var(--font-mono)"
          fontSize="9"
          fill="#4a4a45"
          letterSpacing="3"
        >
          WORLD CHART · CYCLE 0
        </text>
      </g>

      <rect
        x="2"
        y="2"
        width={MAP_WIDTH - 4}
        height={MAP_HEIGHT - 4}
        fill="none"
        stroke="#0d0d0c"
        strokeWidth="1.2"
        opacity="0.55"
      />
      <rect
        x="14"
        y="14"
        width={MAP_WIDTH - 28}
        height={MAP_HEIGHT - 28}
        fill="none"
        stroke="#0d0d0c"
        strokeWidth="0.4"
        opacity="0.35"
      />
    </svg>
  );
}
