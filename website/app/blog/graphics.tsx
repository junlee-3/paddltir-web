/* ---------------------------------------------------------------------------
   Post graphics, shared by the /blog index cards and the posts themselves.
   Each states its post's one idea concretely (real labels, real figures) in
   the Clinical system: hairline zinc, mono labels, vermillion as the accent.
--------------------------------------------------------------------------- */

const MONO = "font-mono";

function Tick({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="8" fill="#fa520f" />
      <path
        d={`M ${cx - 3.5} ${cy} l 2.5 2.8 l 4.5 -5.4`}
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function Cross({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="8" fill="none" stroke="#e4e4e7" strokeWidth="1" />
      <path
        d={`M ${cx - 3} ${cy - 3} l 6 6 M ${cx + 3} ${cy - 3} l -6 6`}
        stroke="#a1a1aa"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </g>
  );
}

/** Deductions — a claims checklist: three real claims ticked, one refused. */
export function DeductionsGraphic({ className = "h-auto w-full max-w-[300px]" }: { className?: string }) {
  const rows = [
    { label: "Preferred side set", note: "left / right", ok: true },
    { label: "Weight recorded", note: "for trim", ok: true },
    { label: "Sweep assigned", note: "heat ready", ok: true },
    { label: "Empty mid seats", note: "fill before load", ok: false },
  ];
  return (
    <svg viewBox="0 0 300 164" className={className} fill="none" aria-hidden="true">
      {rows.map((r, i) => {
        const y = 22 + i * 40;
        return (
          <g key={r.label}>
            {r.ok ? <Tick cx={16} cy={y} /> : <Cross cx={16} cy={y} />}
            <text x={36} y={y + 4} className={MONO} fontSize="12.5" fill={r.ok ? "#52525b" : "#a1a1aa"}>
              {r.label}
            </text>
            <text x={292} y={y + 4} textAnchor="end" className={MONO} fontSize="11" fill="#a1a1aa">
              {r.note}
            </text>
            {i < rows.length - 1 && (
              <line x1={0} y1={y + 20} x2={300} y2={y + 20} stroke="#f4f4f5" strokeWidth="1" />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** Race weekend — three heats as a tiny schedule, plus the first start. */
export function BasGraphic({ className = "h-auto w-full max-w-[300px]" }: { className?: string }) {
  const rows = [
    { label: "H1", desc: "Open 200m", value: "22 paddlers" },
    { label: "H2", desc: "Mixed 500m", value: "20 paddlers" },
    { label: "H3", desc: "Women 200m", value: "18 paddlers" },
  ];
  return (
    <svg viewBox="0 0 300 164" className={className} fill="none" aria-hidden="true">
      {rows.map((r, i) => {
        const y = 10 + i * 36;
        return (
          <g key={r.label}>
            <rect x={0} y={y} width={34} height={22} rx="6" fill="#f4f4f5" stroke="#d4d4d8" strokeWidth="1" />
            <text x={17} y={y + 15} textAnchor="middle" className={MONO} fontSize="11" fill="#52525b">
              {r.label}
            </text>
            <text x={48} y={y + 15} className={MONO} fontSize="11.5" fill="#a1a1aa">
              {r.desc}
            </text>
            <text x={292} y={y + 15} textAnchor="end" className={MONO} fontSize="12" fill="#52525b">
              {r.value}
            </text>
            <line x1={0} y1={y + 31} x2={300} y2={y + 31} stroke="#f4f4f5" strokeWidth="1" />
          </g>
        );
      })}
      <text x={0} y={140} className={MONO} fontSize="11" fill="#a1a1aa">
        Race weekend
      </text>
      <rect x={198} y={124} width={94} height={24} rx="12" fill="#fff3ec" stroke="#ffd9c4" strokeWidth="1" />
      <text x={245} y={139.5} textAnchor="middle" className={MONO} fontSize="10.5" fill="#c2410c">
        START 09:40
      </text>
    </svg>
  );
}

/** Balance check — two lines clear, one flagged, band on LOW. */
export function AuditGraphic({ className = "h-auto w-full max-w-[300px]" }: { className?: string }) {
  const rows = [
    { label: "Left vs right mass", note: "matches", flag: false },
    { label: "Drummer + sweep set", note: "ready", flag: false },
    { label: "Fore-aft trim", note: "move L3 aft", flag: true },
  ];
  const bandY = 138;
  const seg = 296 / 3;
  return (
    <svg viewBox="0 0 300 168" className={className} fill="none" aria-hidden="true">
      {rows.map((r, i) => {
        const y = 18 + i * 34;
        return (
          <g key={r.label}>
            {r.flag ? (
              <g>
                <circle cx={14} cy={y} r="8" fill="#fa520f" />
                <text x={14} y={y + 3.5} textAnchor="middle" className={MONO} fontSize="11" fill="#ffffff">!</text>
              </g>
            ) : (
              <g>
                <circle cx={14} cy={y} r="8" fill="#f4f4f5" stroke="#d4d4d8" strokeWidth="1" />
                <path
                  d={`M ${14 - 3.5} ${y} l 2.5 2.8 l 4.5 -5.4`}
                  stroke="#a1a1aa"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            )}
            <text x={32} y={y + 4} className={MONO} fontSize="12" fill={r.flag ? "#3f3f46" : "#52525b"}>
              {r.label}
            </text>
            <text x={292} y={y + 4} textAnchor="end" className={MONO} fontSize="10.5" fill={r.flag ? "#c2410c" : "#a1a1aa"}>
              {r.note}
            </text>
          </g>
        );
      })}
      {/* risk band with the marker resting on LOW */}
      <rect x={2} y={bandY} width={296} height={10} rx={5} fill="#f4f4f5" />
      <line x1={2 + seg} y1={bandY - 3} x2={2 + seg} y2={bandY + 13} stroke="#e4e4e7" strokeWidth="1" />
      <line x1={2 + 2 * seg} y1={bandY - 3} x2={2 + 2 * seg} y2={bandY + 13} stroke="#e4e4e7" strokeWidth="1" />
      <circle cx={2 + seg / 2} cy={bandY + 5} r="4.5" fill="#fa520f" />
      <text x={2 + seg / 2} y={bandY + 26} textAnchor="middle" className={MONO} fontSize="9.5" fill="#c2410c">LOW</text>
      <text x={2 + 1.5 * seg} y={bandY + 26} textAnchor="middle" className={MONO} fontSize="9.5" fill="#a1a1aa">MED</text>
      <text x={2 + 2.5 * seg} y={bandY + 26} textAnchor="middle" className={MONO} fontSize="9.5" fill="#a1a1aa">HIGH</text>
    </svg>
  );
}

/** Spreadsheet vs crew tool — the stale sheet crossed out, the locked heat ready. */
export function AiAnswersGraphic({ className = "h-auto w-full max-w-[300px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 150" className={className} fill="none" aria-hidden="true">
      {/* stale sheet */}
      <rect x={2} y={8} width={296} height={54} rx="9" fill="none" stroke="#e4e4e7" strokeWidth="1" />
      <g>
        <circle cx={24} cy={35} r="8" fill="none" stroke="#e4e4e7" strokeWidth="1" />
        <path d="M 21 32 l 6 6 M 27 32 l -6 6" stroke="#a1a1aa" strokeWidth="1.4" strokeLinecap="round" />
      </g>
      <text x={42} y={31} className={MONO} fontSize="12" fill="#a1a1aa" textDecoration="line-through">
        Sheet · Mixed_v7_FINAL
      </text>
      <text x={42} y={49} className={MONO} fontSize="10" fill="#a1a1aa">
        last edit unknown
      </text>
      {/* locked heat */}
      <rect x={2} y={78} width={296} height={54} rx="9" fill="#ffffff" stroke="#ffd9c4" strokeWidth="1" />
      <g>
        <circle cx={24} cy={105} r="8" fill="#fa520f" />
        <path d="M 20.5 105 l 2.5 2.8 l 4.5 -5.4" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <text x={42} y={101} className={MONO} fontSize="12" fill="#3f3f46">
        Mixed 500 · heat locked
      </text>
      <text x={42} y={119} className={MONO} fontSize="10" fill="#c2410c">
        trim checked · seats filled
      </text>
    </svg>
  );
}

/** Memory — yesterday's heat forgotten vs a saved lineup. */
export function AbnGraphic({ className = "h-auto w-full max-w-[300px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 150" className={className} fill="none" aria-hidden="true">
      {/* forgotten */}
      <rect x={2} y={10} width={138} height={128} rx="9" fill="#f4f4f5" stroke="#d4d4d8" strokeWidth="1" />
      <text x={16} y={34} className={MONO} fontSize="10" fill="#a1a1aa">YESTERDAY</text>
      <line x1={16} y1={46} x2={126} y2={46} stroke="#e4e4e7" strokeWidth="1" />
      <line x1={16} y1={64} x2={110} y2={64} stroke="#d4d4d8" strokeWidth="1" />
      <line x1={16} y1={80} x2={118} y2={80} stroke="#d4d4d8" strokeWidth="1" />
      <text x={16} y={110} className={MONO} fontSize="10" fill="#52525b">who sat where</text>
      <g>
        <circle cx={118} cy={106} r="7" fill="none" stroke="#a1a1aa" strokeWidth="1" />
        <path d="M 115 103 l 6 6 M 121 103 l -6 6" stroke="#a1a1aa" strokeWidth="1.4" strokeLinecap="round" />
      </g>
      {/* saved */}
      <rect x={160} y={10} width={138} height={128} rx="9" fill="#ffffff" stroke="#ffd9c4" strokeWidth="1" />
      <text x={174} y={34} className={MONO} fontSize="10" fill="#a1a1aa">SAVED HEAT</text>
      <line x1={174} y1={46} x2={284} y2={46} stroke="#e4e4e7" strokeWidth="1" />
      <text x={174} y={68} className={MONO} fontSize="12" fill="#3f3f46">Open 200</text>
      <line x1={174} y1={80} x2={276} y2={80} stroke="#e4e4e7" strokeWidth="1" />
      <text x={174} y={110} className={MONO} fontSize="10" fill="#52525b">lineup kept</text>
      <text x={284} y={110} textAnchor="end" className={MONO} fontSize="12" fill="#fa520f">✓</text>
    </svg>
  );
}

/** Crew weights — totals that drive trim. */
export function DepreciationGraphic({ className = "h-auto w-full max-w-[300px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 164" className={className} fill="none" aria-hidden="true">
      {/* boat outline */}
      <rect x={105} y={10} width={90} height={58} rx="6" fill="#f4f4f5" stroke="#d4d4d8" strokeWidth="1" />
      <rect x={112} y={17} width={76} height={44} rx="3" fill="#ffffff" stroke="#e4e4e7" strokeWidth="1" />
      <rect x={92} y={70} width={116} height={6} rx="3" fill="#e4e4e7" />
      {/* weight tag */}
      <rect x={176} y={2} width={62} height={22} rx="11" fill="#ffffff" stroke="#ffd9c4" strokeWidth="1" />
      <text x={207} y={16.5} textAnchor="middle" className={MONO} fontSize="11" fill="#c2410c">
        1,420 kg
      </text>
      {/* arrow down */}
      <line x1={150} y1={86} x2={150} y2={108} stroke="#fa520f" strokeWidth="1.5" />
      <path d="M 145 104 L 150 110.5 L 155 104" stroke="#fa520f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* outcome */}
      <text x={150} y={132} textAnchor="middle" className={MONO} fontSize="13" fill="#3f3f46">
        Trim: slightly bow-light
      </text>
      <text x={150} y={152} textAnchor="middle" className={MONO} fontSize="10.5" fill="#a1a1aa">
        move two seats aft before race
      </text>
    </svg>
  );
}
