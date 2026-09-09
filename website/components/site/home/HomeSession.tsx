import Link from "next/link";

const GRAPHIC_CLASS = "h-auto w-full max-w-[360px]";

const SESSION_TURNS = [
  {
    graphic: "depreciation" as const,
    question: "How do I write off my new laptop?",
    answer:
      "Anything under $300 is claimed straight away; bigger gear is written down over its effective life. It runs the numbers and shows the rule it used.",
    tool: "Depreciation helper",
    chips: ["ITAA 1997 · Div 40", "s 40-80"],
  },
  {
    graphic: "risk" as const,
    question: "Is anything in my return risky?",
    answer:
      "It checks your return against the risk areas the ATO publishes and shows where you stand. This year you sit comfortably in the low band.",
    tool: "Audit risk check",
    chips: ["PCG 2021/4", "Tax-time toolkit"],
  },
];

/** depreciation_helper — a diminishing-value step-down with a curve over it. */
function DepreciationGraphic() {
  const values = [100, 70, 49, 34, 24, 17];
  const bw = 40;
  const gap = 18;
  const ox = 16;
  const baseY = 150;
  const maxH = 120;
  const width = ox * 2 + values.length * bw + (values.length - 1) * gap;
  const bars = values.map((v, i) => {
    const h = (v / 100) * maxH;
    const x = ox + i * (bw + gap);
    const y = baseY - h;
    return (
      <g key={i}>
        <rect x={x} y={y} width={bw} height={h} rx="4" fill="#f4f4f5" stroke="#d4d4d8" strokeWidth="1" />
        {i === 0 && <rect x={x} y={y} width={bw} height="3" rx="1.5" fill="#fa520f" />}
      </g>
    );
  });
  const curve = values
    .map((v, i) => {
      const h = (v / 100) * maxH;
      const x = ox + i * (bw + gap) + bw / 2;
      const y = baseY - h;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${width} 170`} className={GRAPHIC_CLASS} fill="none" aria-hidden="true">
      {bars}
      <path d={curve} stroke="#d4d4d8" strokeWidth="1.5" strokeDasharray="3 4" />
      <line x1={ox - 4} y1={baseY + 0.5} x2={width - ox + 4} y2={baseY + 0.5} stroke="#e4e4e7" strokeWidth="1" />
    </svg>
  );
}

/** audit_risk_check — a LOW/MED/HIGH gauge with the marker resting on LOW. */
function RiskGraphic() {
  const x0 = 18;
  const w = 324;
  const y = 70;
  const h = 14;
  const seg = w / 3;
  const markerX = x0 + seg / 2;
  return (
    <svg viewBox="0 0 360 130" className={GRAPHIC_CLASS} fill="none" aria-hidden="true">
      <rect x={x0} y={y} width={w} height={h} rx={h / 2} fill="#f4f4f5" />
      <path
        d={`M ${x0 + h / 2} ${y} H ${x0 + seg} V ${y + h} H ${x0 + h / 2} A ${h / 2} ${h / 2} 0 0 1 ${x0 + h / 2} ${y} Z`}
        fill="#fde8df"
      />
      <line x1={x0 + seg} y1={y - 6} x2={x0 + seg} y2={y + h + 6} stroke="#e4e4e7" strokeWidth="1" />
      <line x1={x0 + 2 * seg} y1={y - 6} x2={x0 + 2 * seg} y2={y + h + 6} stroke="#e4e4e7" strokeWidth="1" />
      <line x1={markerX} y1={y - 14} x2={markerX} y2={y + h} stroke="#fa520f" strokeWidth="1.5" />
      <circle cx={markerX} cy={y - 16} r="5" fill="#fa520f" />
      <text x={markerX} y={y + h + 24} textAnchor="middle" className="font-mono" fontSize="11" fill="#fa520f">LOW</text>
      <text x={x0 + 1.5 * seg} y={y + h + 24} textAnchor="middle" className="font-mono" fontSize="11" fill="#a1a1aa">MED</text>
      <text x={x0 + 2.5 * seg} y={y + h + 24} textAnchor="middle" className="font-mono" fontSize="11" fill="#a1a1aa">HIGH</text>
    </svg>
  );
}

function SessionGraphic({ kind }: { kind: "depreciation" | "risk" }) {
  return kind === "depreciation" ? <DepreciationGraphic /> : <RiskGraphic />;
}

export function HomeSession() {
  return (
    <section
      className="mx-auto max-w-6xl px-5 py-20 sm:py-24"
      aria-labelledby="session-h"
    >
      <h2
        id="session-h"
        className="mx-auto text-center text-[clamp(1.6rem,3vw,2.25rem)] font-normal leading-[1.1] tracking-tight1"
      >
        The questions you&apos;d save up for your accountant
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-center text-[15px] leading-relaxed text-zinc-500">
        Every workflow tool runs the numbers and shows the rule it used.
      </p>

      <div className="mt-14 space-y-12 sm:mt-16 sm:space-y-20">
        {SESSION_TURNS.map((turn, i) => (
          <div
            key={turn.question}
            className="reveal-scroll grid items-center gap-6 sm:gap-14 lg:grid-cols-2"
          >
            <div className={`order-2 ${i % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}>
              <div className="tile flex min-h-[180px] items-center justify-center p-6 sm:min-h-[280px] sm:p-12">
                <SessionGraphic kind={turn.graphic} />
              </div>
            </div>
            <div className={`order-1 ${i % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
              <h3 className="max-w-md text-[clamp(1.25rem,2.2vw,1.6rem)] font-normal leading-[1.15] tracking-tight1 text-zinc-900">
                {turn.question}
              </h3>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-zinc-600 sm:text-base">
                {turn.answer}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5" aria-label="Citations">
                {turn.chips.map((c) => (
                  <span key={c} className="chip">
                    <span className="chip-dot" />
                    {c}
                  </span>
                ))}
              </div>
              <p className="mt-3 font-mono text-[0.6875rem] text-zinc-400">
                <Link
                  href="/docs#toolsref-h"
                  className="transition-colors duration-200 hover:text-zinc-600"
                >
                  {turn.tool} →
                </Link>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
