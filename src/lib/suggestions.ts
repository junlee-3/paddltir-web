import type { CrewLineup } from "../types/config";
import type { Paddler, SeatPreference } from "../types/paddler";

export type PriorityKey = "weight" | "power" | "trim" | "side" | "bench";
export type PriorityOrder = PriorityKey[];

export interface SwapSuggestion {
  paddlerIdA: string;
  paddlerIdB: string;
  seatA: { side: "left" | "right"; row: number } | "drummer" | "sweep";
  seatB: { side: "left" | "right"; row: number } | "drummer" | "sweep";
  primaryMetric: string;
  primaryBefore: number;
  primaryAfter: number;
  primaryUnit: string;
}

export type SeatRef = { side: "left" | "right"; row: number } | "drummer" | "sweep";

export type SeatOp =
  | { type: "fill"; seat: SeatRef; paddlerId: string }
  | { type: "swap"; seatA: SeatRef; seatB: SeatRef };

export interface ReplacementSuggestion {
  replacementPaddlerId: string;
  ops: SeatOp[];
  moveCount: number;
  primaryMetric: string;
  primaryBefore: number;
  primaryAfter: number;
  primaryUnit: string;
}

// --- Bench range helpers (mirrors autoConfig.ts, not exported from there) ---

const BENCH_STANDARD: Record<SeatPreference, number[]> = {
  Stroke: [0],
  Pace: [1, 2],
  Engine: [3, 4, 5, 6],
  Sprint: [7, 8, 9],
};

const BENCH_SMALL: Record<SeatPreference, number[]> = {
  Stroke: [0],
  Pace: [1],
  Engine: [2],
  Sprint: [3, 4],
};

function benchRange(n: number, pref: SeatPreference): number[] {
  return n === 10 ? BENCH_STANDARD[pref] : BENCH_SMALL[pref];
}

// --- Trim delta calculation (matches computeTrim in ConfigCrew.tsx) ---

function computeTrimDelta(
  lineup: CrewLineup,
  paddlerMap: Map<string, Paddler>,
  n: number
): number {
  const middle = (n + 1) / 2;
  let totalMoment = 0;
  let totalWeight = 0;

  const drummer = lineup.drummerId ? paddlerMap.get(lineup.drummerId) : null;
  if (drummer) {
    totalWeight += drummer.weight;
    totalMoment += drummer.weight * -middle;
  }

  const sweep = lineup.sweepId ? paddlerMap.get(lineup.sweepId) : null;
  if (sweep) {
    totalWeight += sweep.weight;
    totalMoment += sweep.weight * (n - middle + 1);
  }

  for (let i = 0; i < n; i++) {
    const pos = i + 1 - middle;
    const lp = lineup.left[i] ? paddlerMap.get(lineup.left[i]!) : null;
    const rp = lineup.right[i] ? paddlerMap.get(lineup.right[i]!) : null;
    const weight = (lp?.weight ?? 0) + (rp?.weight ?? 0);
    totalWeight += weight;
    totalMoment += weight * pos;
  }

  if (totalWeight === 0) return 0;
  return (2 * Math.abs(totalMoment)) / n;
}

// --- Lineup scoring ---

// [weightImbalance, powerImbalance, trimDelta, sideMismatches, benchMismatches]
type ScoreTuple = [number, number, number, number, number];

function scoreLineup(
  lineup: CrewLineup,
  paddlerMap: Map<string, Paddler>,
  n: number
): ScoreTuple {
  let weightLeft = 0,
    weightRight = 0;
  let powerLeft = 0,
    powerRight = 0;
  let sideMismatches = 0,
    benchMismatches = 0;

  for (let i = 0; i < n; i++) {
    const lp = lineup.left[i] ? paddlerMap.get(lineup.left[i]!) : null;
    const rp = lineup.right[i] ? paddlerMap.get(lineup.right[i]!) : null;

    if (lp) {
      weightLeft += lp.weight;
      powerLeft += lp.powerRatio ?? 0;
      if (lp.preferredSide !== "Left" && lp.preferredSide !== "Both")
        sideMismatches++;
      if (!benchRange(n, lp.seatPreference).includes(i)) benchMismatches++;
    }
    if (rp) {
      weightRight += rp.weight;
      powerRight += rp.powerRatio ?? 0;
      if (rp.preferredSide !== "Right" && rp.preferredSide !== "Both")
        sideMismatches++;
      if (!benchRange(n, rp.seatPreference).includes(i)) benchMismatches++;
    }
  }

  return [
    Math.abs(weightLeft - weightRight),
    Math.abs(powerLeft - powerRight),
    computeTrimDelta(lineup, paddlerMap, n),
    sideMismatches,
    benchMismatches,
  ];
}

function priorityIndex(key: PriorityKey): number {
  const map: Record<PriorityKey, number> = {
    weight: 0,
    power: 1,
    trim: 2,
    side: 3,
    bench: 4,
  };
  return map[key];
}

function isStrictlyBetter(
  candidate: ScoreTuple,
  current: ScoreTuple,
  order: PriorityOrder
): boolean {
  for (const key of order) {
    const idx = priorityIndex(key);
    if (candidate[idx] < current[idx]) return true;
    if (candidate[idx] > current[idx]) return false;
  }
  return false;
}

// --- Swap application ---

export function applySwap(
  lineup: CrewLineup,
  a: SeatRef,
  b: SeatRef
): CrewLineup {
  const next: CrewLineup = {
    ...lineup,
    left: [...lineup.left],
    right: [...lineup.right],
  };

  const getVal = (s: SeatRef): string | null => {
    if (s === "drummer") return next.drummerId;
    if (s === "sweep") return next.sweepId;
    return s.side === "left" ? next.left[s.row] : next.right[s.row];
  };

  const setVal = (s: SeatRef, v: string | null): void => {
    if (s === "drummer") {
      next.drummerId = v;
      return;
    }
    if (s === "sweep") {
      next.sweepId = v;
      return;
    }
    if (s.side === "left") next.left[s.row] = v;
    else next.right[s.row] = v;
  };

  const valA = getVal(a);
  const valB = getVal(b);
  setVal(a, valB);
  setVal(b, valA);
  return next;
}

// --- Metric metadata ---

const METRIC_META: Record<PriorityKey, { name: string; unit: string }> = {
  weight: { name: "Weight balance", unit: "kg" },
  power: { name: "Power balance", unit: "" },
  trim: { name: "Trim", unit: "kg" },
  side: { name: "Side preference", unit: "" },
  bench: { name: "Bench preference", unit: "" },
};

// --- Main export ---

/**
 * Find the top swap suggestions for the current lineup.
 * Only considers bench seats (left/right arrays), not drummer or sweep.
 */
export function getTopSwapSuggestions(
  lineup: CrewLineup,
  paddlerMap: Map<string, Paddler>,
  n: number,
  priorityOrder: PriorityOrder,
  maxResults = 2
): SwapSuggestion[] {
  // Collect occupied bench seats
  const seats: { side: "left" | "right"; row: number }[] = [];
  for (let i = 0; i < n; i++) {
    if (lineup.left[i]) seats.push({ side: "left", row: i });
    if (lineup.right[i]) seats.push({ side: "right", row: i });
  }

  if (seats.length < 2) return [];

  const currentScore = scoreLineup(lineup, paddlerMap, n);

  interface Candidate {
    suggestion: SwapSuggestion;
    swappedScore: ScoreTuple;
  }

  const candidates: Candidate[] = [];

  for (let i = 0; i < seats.length; i++) {
    for (let j = i + 1; j < seats.length; j++) {
      const a = seats[i];
      const b = seats[j];
      const swapped = applySwap(lineup, a, b);
      const swappedScore = scoreLineup(swapped, paddlerMap, n);

      if (!isStrictlyBetter(swappedScore, currentScore, priorityOrder)) continue;

      const paddlerIdA =
        a.side === "left" ? lineup.left[a.row]! : lineup.right[a.row]!;
      const paddlerIdB =
        b.side === "left" ? lineup.left[b.row]! : lineup.right[b.row]!;

      // Find the highest-priority metric that changed
      const primaryKey =
        priorityOrder.find(
          (k) =>
            swappedScore[priorityIndex(k)] !== currentScore[priorityIndex(k)]
        ) ?? priorityOrder[0];
         // … build SwapSuggestion with before/after values for primaryKey …
      const idx = priorityIndex(primaryKey);
      const { name, unit } = METRIC_META[primaryKey];

      candidates.push({
        suggestion: {
          paddlerIdA,
          paddlerIdB,
          seatA: a,
          seatB: b,
          primaryMetric: name,
          primaryBefore: currentScore[idx],
          primaryAfter: swappedScore[idx],
          primaryUnit: unit,
        },
        swappedScore,
      });
    }
  }

  // Sort best-first, return top two
  candidates.sort((x, y) => {
    if (isStrictlyBetter(x.swappedScore, y.swappedScore, priorityOrder))
      return -1;
    if (isStrictlyBetter(y.swappedScore, x.swappedScore, priorityOrder))
      return 1;
    return 0;
  });

  return candidates.slice(0, maxResults).map((c) => c.suggestion);
}

// --- Seat value helpers ---

function setSeatValue(
  lineup: CrewLineup,
  seat: SeatRef,
  paddlerId: string | null
): CrewLineup {
  const next: CrewLineup = {
    ...lineup,
    left: [...lineup.left],
    right: [...lineup.right],
  };
  if (seat === "drummer") {
    next.drummerId = paddlerId;
  } else if (seat === "sweep") {
    next.sweepId = paddlerId;
  } else if (seat.side === "left") {
    next.left[seat.row] = paddlerId;
  } else {
    next.right[seat.row] = paddlerId;
  }
  return next;
}

function occupiedBenchSeats(
  lineup: CrewLineup,
  n: number
): { side: "left" | "right"; row: number }[] {
  const seats: { side: "left" | "right"; row: number }[] = [];
  for (let i = 0; i < n; i++) {
    if (lineup.left[i]) seats.push({ side: "left", row: i });
    if (lineup.right[i]) seats.push({ side: "right", row: i });
  }
  return seats;
}

function isBenchSeat(
  seat: SeatRef
): seat is { side: "left" | "right"; row: number } {
  return seat !== "drummer" && seat !== "sweep";
}

function primaryMetricFields(
  before: ScoreTuple,
  after: ScoreTuple,
  priorityOrder: PriorityOrder
): Pick<
  ReplacementSuggestion,
  "primaryMetric" | "primaryBefore" | "primaryAfter" | "primaryUnit"
> {
  const primaryKey =
    priorityOrder.find(
      (k) => after[priorityIndex(k)] !== before[priorityIndex(k)]
    ) ?? priorityOrder[0];
  const idx = priorityIndex(primaryKey);
  const { name, unit } = METRIC_META[primaryKey];
  return {
    primaryMetric: name,
    primaryBefore: before[idx],
    primaryAfter: after[idx],
    primaryUnit: unit,
  };
}

function comparePlans(
  a: { moveCount: number; score: ScoreTuple },
  b: { moveCount: number; score: ScoreTuple },
  priorityOrder: PriorityOrder
): number {
  // Within the move budget, balance wins. Fewer moves only break ties.
  if (isStrictlyBetter(a.score, b.score, priorityOrder)) return -1;
  if (isStrictlyBetter(b.score, a.score, priorityOrder)) return 1;
  return a.moveCount - b.moveCount;
}

/**
 * After removing a paddler from a bench seat, find replacement plans that
 * fill the hole (and optionally swap up to 2 more times). Plans are ranked
 * by balance first (priority order); move count is only a tiebreaker within
 * the max-moves budget. Drummer/sweep vacancies are not auto-filled.
 */
export function getReplacementSuggestions(
  lineup: CrewLineup,
  vacatedSeat: SeatRef,
  candidateIds: string[],
  paddlerMap: Map<string, Paddler>,
  n: number,
  priorityOrder: PriorityOrder,
  maxMoves = 3,
  maxResults = 2
): ReplacementSuggestion[] {
  if (!isBenchSeat(vacatedSeat) || candidateIds.length === 0 || maxMoves < 1) {
    return [];
  }

  const baselineScore = scoreLineup(lineup, paddlerMap, n);
  const maxSwaps = Math.max(0, Math.min(2, maxMoves - 1));

  interface PlanCandidate {
    suggestion: ReplacementSuggestion;
    score: ScoreTuple;
    moveCount: number;
  }

  const plans: PlanCandidate[] = [];

  const makePlan = (
    candidateId: string,
    ops: SeatOp[],
    score: ScoreTuple,
    moveCount: number
  ): PlanCandidate => ({
    moveCount,
    score,
    suggestion: {
      replacementPaddlerId: candidateId,
      ops,
      moveCount,
      ...primaryMetricFields(baselineScore, score, priorityOrder),
    },
  });

  const isBetterPlan = (candidate: PlanCandidate, existing: PlanCandidate) =>
    comparePlans(candidate, existing, priorityOrder) < 0;

  for (const candidateId of candidateIds) {
    if (!paddlerMap.has(candidateId)) continue;

    const filled = setSeatValue(lineup, vacatedSeat, candidateId);
    const fillOp: SeatOp = {
      type: "fill",
      seat: vacatedSeat,
      paddlerId: candidateId,
    };

    // Best plan for this reserve across the whole move budget (balance-first)
    let bestForCandidate: PlanCandidate | null = null;
    // Second-best (optional) so we can offer an alternate if only one reserve
    let secondBest: PlanCandidate | null = null;

    const consider = (plan: PlanCandidate) => {
      if (!bestForCandidate || isBetterPlan(plan, bestForCandidate)) {
        secondBest = bestForCandidate;
        bestForCandidate = plan;
        return;
      }
      if (!secondBest || isBetterPlan(plan, secondBest)) {
        // Avoid storing an identical ops plan
        if (
          plan.moveCount !== bestForCandidate.moveCount ||
          plan.suggestion.ops.length !== bestForCandidate.suggestion.ops.length
        ) {
          secondBest = plan;
        }
      }
    };

    consider(
      makePlan(
        candidateId,
        [fillOp],
        scoreLineup(filled, paddlerMap, n),
        1
      )
    );

    if (maxSwaps >= 1) {
      const seats = occupiedBenchSeats(filled, n);
      for (let i = 0; i < seats.length; i++) {
        for (let j = i + 1; j < seats.length; j++) {
          const a = seats[i];
          const b = seats[j];
          const afterOne = applySwap(filled, a, b);
          consider(
            makePlan(
              candidateId,
              [fillOp, { type: "swap", seatA: a, seatB: b }],
              scoreLineup(afterOne, paddlerMap, n),
              2
            )
          );

          if (maxSwaps < 2) continue;

          const seats2 = occupiedBenchSeats(afterOne, n);
          for (let k = 0; k < seats2.length; k++) {
            for (let m = k + 1; m < seats2.length; m++) {
              const c = seats2[k];
              const d = seats2[m];
              if (
                (c.side === a.side &&
                  c.row === a.row &&
                  d.side === b.side &&
                  d.row === b.row) ||
                (c.side === b.side &&
                  c.row === b.row &&
                  d.side === a.side &&
                  d.row === a.row)
              ) {
                continue;
              }
              const afterTwo = applySwap(afterOne, c, d);
              consider(
                makePlan(
                  candidateId,
                  [
                    fillOp,
                    { type: "swap", seatA: a, seatB: b },
                    { type: "swap", seatA: c, seatB: d },
                  ],
                  scoreLineup(afterTwo, paddlerMap, n),
                  3
                )
              );
            }
          }
        }
      }
    }

    if (bestForCandidate) plans.push(bestForCandidate);
    if (secondBest) plans.push(secondBest);
  }

  if (plans.length === 0) return [];

  const improved = plans.filter((p) =>
    isStrictlyBetter(p.score, baselineScore, priorityOrder)
  );
  // Prefer any improving plan; otherwise still offer the best balance options
  const pool = improved.length > 0 ? improved : plans;

  pool.sort((a, b) => comparePlans(a, b, priorityOrder));

  const selected: PlanCandidate[] = [];
  const seenPaddlers = new Set<string>();
  for (const plan of pool) {
    if (selected.length >= maxResults) break;
    if (seenPaddlers.has(plan.suggestion.replacementPaddlerId)) continue;
    seenPaddlers.add(plan.suggestion.replacementPaddlerId);
    selected.push(plan);
  }
  if (selected.length < maxResults) {
    for (const plan of pool) {
      if (selected.length >= maxResults) break;
      if (selected.includes(plan)) continue;
      selected.push(plan);
    }
  }

  return selected.map((p) => p.suggestion);
}

export function applyReplacement(
  lineup: CrewLineup,
  suggestion: ReplacementSuggestion
): CrewLineup {
  let next = lineup;
  for (const op of suggestion.ops) {
    if (op.type === "fill") {
      next = setSeatValue(next, op.seat, op.paddlerId);
    } else {
      next = applySwap(next, op.seatA, op.seatB);
    }
  }
  return next;
}
