import type { Config, CrewLineup } from "../types/config";
import { getLineupRowCount } from "../types/config";
import type { Paddler } from "../types/paddler";
import type { PreferredSide, SeatPreference } from "../types/paddler";

/**
 * Bench mapping from configAlgorithm.py (standard 10 benches):
 * stroke=[0], pace=[1,2], engine=[3,4,5,6], sprint=[7,8,9]
 */
const BENCH_BY_PREFERENCE_STANDARD: Record<SeatPreference, number[]> = {
  Stroke: [0],
  Pace: [1, 2],
  Engine: [3, 4, 5, 6],
  Sprint: [7, 8, 9],
};

const BENCH_BY_PREFERENCE_SMALL: Record<SeatPreference, number[]> = {
  Stroke: [0],
  Pace: [1],
  Engine: [2],
  Sprint: [3, 4],
};

function getBenchRange(n: number, pref: SeatPreference): number[] {
  return n === 10
    ? BENCH_BY_PREFERENCE_STANDARD[pref]
    : BENCH_BY_PREFERENCE_SMALL[pref];
}

/**
 * Fallback bench groups from configAlgorithm.py.
 * Returns list of bench groups in priority order.
 */
function getFallbackBenches(n: number, pref: SeatPreference): number[][] {
  const stroke = getBenchRange(n, "Stroke");
  const pace = getBenchRange(n, "Pace");
  const engine = getBenchRange(n, "Engine");
  const sprint = getBenchRange(n, "Sprint");

  const fallbackMap: Record<SeatPreference, number[][]> = {
    Stroke: [pace, engine, sprint],
    Pace: [stroke, engine, sprint],
    Engine: [pace, sprint, stroke],
    Sprint: [engine, pace, stroke],
  };
  return fallbackMap[pref];
}

/**
 * Build bench priority list: preferred first, then fallback groups, then remaining benches.
 * Matches Python: bench_priority = [preferred] + fallback_list, then add remaining.
 */
function getBenchPriority(n: number, seatPreference: SeatPreference): number[] {
  const preferred = getBenchRange(n, seatPreference);
  const fallbacks = getFallbackBenches(n, seatPreference);

  const allToTry: number[] = [...preferred];
  for (const group of fallbacks) {
    for (const b of group) {
      if (!allToTry.includes(b)) allToTry.push(b);
    }
  }
  for (let i = 0; i < n; i++) {
    if (!allToTry.includes(i)) allToTry.push(i);
  }
  return allToTry;
}

/** Side order: Left=[left,right], Right=[right,left], Both=by current weights. */
function getSideOrder(
  preferredSide: PreferredSide,
  weightLeft: number,
  weightRight: number
): ("left" | "right")[] {
  if (preferredSide === "Left") return ["left", "right"];
  if (preferredSide === "Right") return ["right", "left"];
  return weightLeft <= weightRight ? ["left", "right"] : ["right", "left"];
}

/** Score: (weight_balance, power_balance, -side_matches, -bench_matches). Lower = better. */
interface ConfigScore {
  weightBalance: number;
  powerBalance: number;
  sideMatches: number;
  benchMatches: number;
  tuple: [number, number, number, number];
}

function calculateScore(
  left: (string | null)[],
  right: (string | null)[],
  paddlerMap: Map<string, Paddler>,
  n: number
): ConfigScore {
  let weightLeft = 0;
  let weightRight = 0;
  let powerLeft = 0;
  let powerRight = 0;
  let sideMatches = 0;
  let benchMatches = 0;

  for (let i = 0; i < n; i++) {
    const lp = left[i] ? paddlerMap.get(left[i]!) : null;
    const rp = right[i] ? paddlerMap.get(right[i]!) : null;

    if (lp) {
      weightLeft += lp.weight;
      powerLeft += lp.powerRatio ?? 0;
      if (lp.preferredSide === "Left" || lp.preferredSide === "Both")
        sideMatches += 1;
      if (getBenchRange(n, lp.seatPreference).includes(i)) benchMatches += 1;
    }
    if (rp) {
      weightRight += rp.weight;
      powerRight += rp.powerRatio ?? 0;
      if (rp.preferredSide === "Right" || rp.preferredSide === "Both")
        sideMatches += 1;
      if (getBenchRange(n, rp.seatPreference).includes(i)) benchMatches += 1;
    }
  }

  const weightBalance = Math.abs(weightLeft - weightRight);
  const powerBalance = Math.abs(powerLeft - powerRight);
  const tuple: [number, number, number, number] = [
    weightBalance,
    powerBalance,
    -sideMatches,
    -benchMatches,
  ];
  return { weightBalance, powerBalance, sideMatches, benchMatches, tuple };
}

function isScoreBetter(a: ConfigScore, b: ConfigScore): boolean {
  for (let i = 0; i < 4; i++) {
    if (a.tuple[i] < b.tuple[i]) return true;
    if (a.tuple[i] > b.tuple[i]) return false;
  }
  return false;
}

/**
 * Greedy placement: process paddlers in order, place each at best (bench, side).
 * Matches auto_configure_crew from configAlgorithm.py.
 */
function runGreedyPlacement(
  paddlersToPlace: Paddler[],
  lineup: CrewLineup,
  paddlerMap: Map<string, Paddler>,
  n: number
): { left: (string | null)[]; right: (string | null)[] } {
  const left = lineup.left.map((x) => x);
  const right = lineup.right.map((x) => x);
  const maxSeats = n * 2;

  for (const paddler of paddlersToPlace) {
    const pid = paddler.id;
    if (!pid) continue;

    const totalPlaced =
      left.filter((x) => x !== null).length + right.filter((x) => x !== null).length;
    if (totalPlaced >= maxSeats) continue;

    let weightLeft = 0;
    let weightRight = 0;
    for (let i = 0; i < n; i++) {
      const lp = left[i] ? paddlerMap.get(left[i]!) : null;
      const rp = right[i] ? paddlerMap.get(right[i]!) : null;
      if (lp) weightLeft += lp.weight;
      if (rp) weightRight += rp.weight;
    }

    const benchPriority = getBenchPriority(n, paddler.seatPreference);
    const sideOrder = getSideOrder(
      paddler.preferredSide,
      weightLeft,
      weightRight
    );

    let best: { bench: number; side: "left" | "right"; score: ConfigScore } | null = null;

    for (const bench of benchPriority) {
      for (const side of sideOrder) {
        const arr = side === "left" ? left : right;
        if (arr[bench] !== null) continue;

        const testLeft = [...left];
        const testRight = [...right];
        if (side === "left") testLeft[bench] = pid;
        else testRight[bench] = pid;

        const score = calculateScore(testLeft, testRight, paddlerMap, n);
        if (!best || isScoreBetter(score, best.score)) {
          best = { bench, side, score };
        }
      }
    }

    if (best) {
      if (best.side === "left") left[best.bench] = pid;
      else right[best.bench] = pid;
    }
  }

  return { left, right };
}

function preSelectTopN(paddlers: Paddler[], n: number): Paddler[] {
  const sorted = [...paddlers].sort((a, b) => (b.powerRatio ?? 0) - (a.powerRatio ?? 0));
  return sorted.slice(0, n);
}

/** Score for "Place on Preferred" mode: prioritize side and bench, ignore weight. */
function preferredScoreTuple(
  left: (string | null)[],
  right: (string | null)[],
  paddlerMap: Map<string, Paddler>,
  n: number
): [number, number, number, number] {
  const s = calculateScore(left, right, paddlerMap, n);
  return [-s.sideMatches, -s.benchMatches, s.weightBalance, s.powerBalance];
}

function isPreferredScoreBetter(
  a: [number, number, number, number],
  b: [number, number, number, number]
): boolean {
  for (let i = 0; i < 4; i++) {
    if (a[i] < b[i]) return true;
    if (a[i] > b[i]) return false;
  }
  return false;
}

/**
 * Greedy placement prioritizing preferred side and bench over weight.
 */
function runGreedyPlacementPreferred(
  paddlersToPlace: Paddler[],
  lineup: CrewLineup,
  paddlerMap: Map<string, Paddler>,
  n: number
): { left: (string | null)[]; right: (string | null)[] } {
  const left = lineup.left.map((x) => x);
  const right = lineup.right.map((x) => x);
  const maxSeats = n * 2;

  for (const paddler of paddlersToPlace) {
    const pid = paddler.id;
    if (!pid) continue;

    const totalPlaced =
      left.filter((x) => x !== null).length + right.filter((x) => x !== null).length;
    if (totalPlaced >= maxSeats) continue;

    let weightLeft = 0;
    let weightRight = 0;
    for (let i = 0; i < n; i++) {
      const lp = left[i] ? paddlerMap.get(left[i]!) : null;
      const rp = right[i] ? paddlerMap.get(right[i]!) : null;
      if (lp) weightLeft += lp.weight;
      if (rp) weightRight += rp.weight;
    }

    const benchPriority = getBenchPriority(n, paddler.seatPreference);
    const sideOrder = getSideOrder(
      paddler.preferredSide,
      weightLeft,
      weightRight
    );

    let best: {
      bench: number;
      side: "left" | "right";
      score: [number, number, number, number];
    } | null = null;

    for (const bench of benchPriority) {
      for (const side of sideOrder) {
        const arr = side === "left" ? left : right;
        if (arr[bench] !== null) continue;

        const testLeft = [...left];
        const testRight = [...right];
        if (side === "left") testLeft[bench] = pid;
        else testRight[bench] = pid;

        const score = preferredScoreTuple(testLeft, testRight, paddlerMap, n);
        if (!best || isPreferredScoreBetter(score, best.score)) {
          best = { bench, side, score };
        }
      }
    }

    if (best) {
      if (best.side === "left") left[best.bench] = pid;
      else right[best.bench] = pid;
    }
  }

  return { left, right };
}

/**
 * Place all paddlers on preferred side and bench regardless of weight balance.
 * Separate from runAutoConfig; prioritizes preferences over balance.
 */
export function runPlacePreferredSides(
  lineup: CrewLineup,
  paddlerMap: Map<string, Paddler>,
  availablePaddlers: Paddler[],
  config: Config
): CrewLineup {
  const n = getLineupRowCount(config.size);
  const maxSeats = n * 2;

  let toPlace = availablePaddlers.filter(
    (p) => p.id && (p.role === "Paddler" || p.role === "Drummer")
  );
  if (toPlace.length > maxSeats) {
    toPlace = preSelectTopN(toPlace, maxSeats);
  }

  const emptyLineup: CrewLineup = {
    drummerId: lineup.drummerId,
    sweepId: lineup.sweepId,
    left: Array(n).fill(null),
    right: Array(n).fill(null),
  };

  const preferredBenchCount = (p: Paddler) =>
    getBenchRange(n, p.seatPreference).length;
  const ordered = [...toPlace].sort(
    (a, b) => preferredBenchCount(a) - preferredBenchCount(b)
  );

  const result = runGreedyPlacementPreferred(
    ordered,
    emptyLineup,
    paddlerMap,
    n
  );

  return {
    drummerId: lineup.drummerId,
    sweepId: lineup.sweepId,
    left: result.left,
    right: result.right,
  };
}

/**
 * Run auto-config matching configAlgorithm.py exactly.
 * Requires drummer and sweep already in lineup.
 */
export function runAutoConfig(
  lineup: CrewLineup,
  paddlerMap: Map<string, Paddler>,
  availablePaddlers: Paddler[],
  config: Config
): CrewLineup {
  const n = getLineupRowCount(config.size);
  const maxSeats = n * 2;

  let toPlace = availablePaddlers.filter(
    (p) => p.id && (p.role === "Paddler" || p.role === "Drummer")
  );
  if (toPlace.length > maxSeats) {
    toPlace = preSelectTopN(toPlace, maxSeats);
  }

  let bestLeft = Array(n).fill(null) as (string | null)[];
  let bestRight = Array(n).fill(null) as (string | null)[];
  let bestScore: ConfigScore | null = null;

  const emptyLineup: CrewLineup = {
    drummerId: lineup.drummerId,
    sweepId: lineup.sweepId,
    left: Array(n).fill(null),
    right: Array(n).fill(null),
  };

  // Use only deterministic orderings (weight, power, combined) so the result
  // is always the same for the same input, matching configAlgorithm.py behavior.
  const orderings: ((paddlers: Paddler[]) => Paddler[])[] = [
    (p) => [...p].sort((a, b) => b.weight - a.weight),
    (p) => [...p].sort((a, b) => (b.powerRatio ?? 0) - (a.powerRatio ?? 0)),
    (p) =>
      [...p].sort(
        (a, b) =>
          b.weight + (b.powerRatio ?? 0) * 50 - (a.weight + (a.powerRatio ?? 0) * 50)
      ),
  ];

  for (const sortFn of orderings) {
    const ordered = sortFn(toPlace);
    const result = runGreedyPlacement(
      ordered,
      emptyLineup,
      paddlerMap,
      n
    );

    const score = calculateScore(result.left, result.right, paddlerMap, n);

    if (!bestScore || isScoreBetter(score, bestScore)) {
      bestScore = score;
      bestLeft = [...result.left];
      bestRight = [...result.right];
    }
  }

  return {
    drummerId: lineup.drummerId,
    sweepId: lineup.sweepId,
    left: bestLeft,
    right: bestRight,
  };
}
