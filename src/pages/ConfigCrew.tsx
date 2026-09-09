import { useEffect, useState, useMemo } from "react";
import { Wand2, GripVertical } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import type { Config, CrewLineup, HeatTabId } from "../types/config";
import { getLineupRowCount, reservedIdsKey } from "../types/config";
import type { Paddler } from "../types/paddler";
import type { Gender, Role } from "../types/paddler";
import type { Crewlist } from "../types/crewlist";
import { getConfigById, updateConfig } from "../services/configs";
import { getPaddlers } from "../services/paddlers";
import { getCrewlistById } from "../services/crewlists";
import { runAutoConfig, runPlacePreferredSides } from "../lib/autoConfig";
import {
  getTopSwapSuggestions,
  applySwap,
  getReplacementSuggestions,
  applyReplacement,
} from "../lib/suggestions";
import type {
  PriorityKey,
  PriorityOrder,
  SwapSuggestion,
  ReplacementSuggestion,
  SeatRef,
} from "../lib/suggestions";

const PRIORITY_ITEMS: PriorityKey[] = ["weight", "power", "trim", "side", "bench"];

const DRAG_TYPE_PADDLER = "application/json";

function seatIdToSeatRef(seatId: string): SeatRef | null {
  if (seatId === "drummer") return "drummer";
  if (seatId === "sweep") return "sweep";
  if (seatId.startsWith("left-")) {
    const row = parseInt(seatId.slice(5), 10);
    return Number.isNaN(row) ? null : { side: "left", row };
  }
  if (seatId.startsWith("right-")) {
    const row = parseInt(seatId.slice(6), 10);
    return Number.isNaN(row) ? null : { side: "right", row };
  }
  return null;
}

function emptyReservedByHeat(): Record<HeatTabId, string[]> {
  return { heat1: [], heat2: [], final: [] };
}

/** Compute trim (fore-aft balance) using center-of-mass moment about boat midpoint. */
function computeTrim(
  lineup: CrewLineup,
  paddlerMap: Map<string, Paddler>,
  n: number
): { bowWeight: number; sternWeight: number; trimDelta: number } {
  const middle = (n + 1) / 2;
  let totalMoment = 0;
  let totalWeight = 0;

  const drummer = lineup.drummerId ? paddlerMap.get(lineup.drummerId) : null;
  if (drummer) {
    const w = drummer.weight;
    totalWeight += w;
    totalMoment += w * -middle;
  }

  const sweep = lineup.sweepId ? paddlerMap.get(lineup.sweepId) : null;
  if (sweep) {
    const w = sweep.weight;
    totalWeight += w;
    totalMoment += w * (n - middle + 1);
  }

  for (let i = 0; i < n; i++) {
    const pos = i + 1 - middle;
    const leftP = lineup.left[i] ? paddlerMap.get(lineup.left[i]!) : null;
    const rightP = lineup.right[i] ? paddlerMap.get(lineup.right[i]!) : null;
    const weight = (leftP?.weight ?? 0) + (rightP?.weight ?? 0);
    totalWeight += weight;
    totalMoment += weight * pos;
  }

  if (totalWeight === 0) {
    return { bowWeight: 0, sternWeight: 0, trimDelta: 0 };
  }

  const trimScore = totalMoment / totalWeight;
  const trimDelta = (2 * Math.abs(totalMoment)) / n;
  const half = totalWeight / 2;
  const halfDelta = trimDelta / 2;

  const bowWeight = trimScore <= 0 ? half + halfDelta : half - halfDelta;
  const sternWeight = trimScore <= 0 ? half - halfDelta : half + halfDelta;

  return { bowWeight, sternWeight, trimDelta };
}

const WEIGHT_DELTA_WARN = 10; // kg
const POWER_DELTA_WARN_PCT = 0.1; // warn when L/R power difference is ≥10% of total power
const PREFERRED_MIN = 0.8; // 80%
const TRIM_DELTA_WARN = 50; // kg front/back imbalance (green if ≤50kg, red if over)

interface BoatStats {
  weightLeft: number;
  weightRight: number;
  powerLeft: number;
  powerRight: number;
  weightDelta: number;
  powerDelta: number;
  totalWeight: number;
  totalPower: number;
  preferredSideFraction: number;
  preferredCount: number;
  paddlerCount: number;
  trimBowWeight: number;
  trimSternWeight: number;
  trimDelta: number;
}

function formatSize(size: string): string {
  return size === "standard" ? "Standard" : "Small";
}

function formatCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function preferredSideAbbrev(side: string): string {
  if (side === "Left") return "L";
  if (side === "Right") return "R";
  return "L/R";
}

function roleAbbrev(role: Role): string {
  if (role === "Drummer") return "D";
  if (role === "Sweep") return "S";
  return "";
}

export function paddlerToLabel(p: Paddler): string {
  const name = (p.name || "").trim();
  const role = roleAbbrev(p.role);
  const side = preferredSideAbbrev(p.preferredSide);
  const weight = Math.round(p.weight);
  const parts = [name || "——"];
  if (role) parts.push(role);
  parts.push(side, String(weight));
  return parts.join(" ");
}

function PaddlerTileLabel({ paddler }: { paddler: Paddler }) {
  const name = (paddler.name || "").trim() || "——";
  const role = roleAbbrev(paddler.role);
  const side = preferredSideAbbrev(paddler.preferredSide);
  const weight = Math.round(paddler.weight);
  return (
    <span className="whitespace-pre">
      {name}
      {" "}
      {role && <span className="text-red-600 font-bold">{role}</span>}
      {role && " "}
      <span className="font-bold">{side}</span>
      {" "}
      {weight}
    </span>
  );
}

export function getTileBgClass(gender: Gender): string {
  return gender === "Male"
    ? "bg-green-100 border-green-300"
    : "bg-amber-100 border-amber-300";
}

function emptyLineup(size: "small" | "standard"): CrewLineup {
  const n = getLineupRowCount(size);
  return {
    drummerId: null,
    sweepId: null,
    left: Array(n).fill(null),
    right: Array(n).fill(null),
  };
}

function lineupContains(lineup: CrewLineup, paddlerId: string): boolean {
  if (lineup.drummerId === paddlerId) return true;
  if (lineup.sweepId === paddlerId) return true;
  if (lineup.left.some((id) => id === paddlerId)) return true;
  if (lineup.right.some((id) => id === paddlerId)) return true;
  return false;
}

interface ConfigCrewProps {
  userId: string;
}

export default function ConfigCrew({ userId }: ConfigCrewProps) {
  const { configId } = useParams<{ configId: string }>();
  const navigate = useNavigate();
  const [config, setConfig] = useState<Config | null>(null);
  const [crewlist, setCrewlist] = useState<Crewlist | null>(null);
  const [paddlers, setPaddlers] = useState<Paddler[]>([]);
  const [lineups, setLineups] = useState<Record<HeatTabId, CrewLineup> | null>(null);
  const [activeTab, setActiveTab] = useState<HeatTabId>("heat1");
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);
  // Tap-to-place for touch devices (mobile/tablet) - works alongside drag-and-drop on desktop
  const [touchSelection, setTouchSelection] = useState<
    { type: "roster"; paddlerId: string } | { type: "seat"; seatId: string } | null
  >(null);
  // Suggestions feature
  const [priorityOrder, setPriorityOrder] = useState<PriorityOrder>([...PRIORITY_ITEMS]);
  const [hoveredSuggestionIdx, setHoveredSuggestionIdx] = useState<number | null>(null);
  const [reservedByHeat, setReservedByHeat] = useState<Record<HeatTabId, string[]>>(
    emptyReservedByHeat
  );
  const [lastVacatedSeat, setLastVacatedSeat] = useState<SeatRef | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    seatId: string;
    paddlerId: string;
  } | null>(null);

  useEffect(() => {
    if (!configId) {
      navigate("/configs", { replace: true });
      return;
    }
    let cancelled = false;
    getConfigById(userId, configId).then((c) => {
      if (cancelled) return;
      setConfig(c);
      if (c) {
        const empty = emptyLineup(c.size);
        setLineups({
          heat1: c.lineupHeat1 ?? c.lineup ?? empty,
          heat2: c.lineupHeat2 ?? empty,
          final: c.lineupFinal ?? empty,
        });
        setReservedByHeat({
          heat1: c.reservedHeat1Ids ?? [],
          heat2: c.reservedHeat2Ids ?? [],
          final: c.reservedFinalIds ?? [],
        });
      } else {
        setLineups(null);
        setReservedByHeat(emptyReservedByHeat());
      }
    });
    return () => {
      cancelled = true;
    };
  }, [userId, configId, navigate]);

  const lineup = lineups ? lineups[activeTab] : null;
  const lineupKey = activeTab === "heat1" ? "lineupHeat1" : activeTab === "heat2" ? "lineupHeat2" : "lineupFinal";
  const reservedIds = reservedByHeat[activeTab];
  const reservedSet = useMemo(() => new Set(reservedIds), [reservedIds]);
  const reservedKey = reservedIdsKey(activeTab);

  useEffect(() => {
    setLastVacatedSeat(null);
    setContextMenu(null);
  }, [activeTab]);

  useEffect(() => {
    if (!lineup || !lastVacatedSeat) return;
    if (lastVacatedSeat === "drummer") {
      if (lineup.drummerId) setLastVacatedSeat(null);
      return;
    }
    if (lastVacatedSeat === "sweep") {
      if (lineup.sweepId) setLastVacatedSeat(null);
      return;
    }
    const occupied =
      lastVacatedSeat.side === "left"
        ? lineup.left[lastVacatedSeat.row]
        : lineup.right[lastVacatedSeat.row];
    if (occupied) setLastVacatedSeat(null);
  }, [lineup, lastVacatedSeat]);
  useEffect(() => {
    const unsub = getPaddlers(userId, setPaddlers);
    return () => unsub();
  }, [userId]);

  useEffect(() => {
    if (!config?.crewlistId) {
      setCrewlist(null);
      return;
    }
    let cancelled = false;
    getCrewlistById(userId, config.crewlistId).then((cl) => {
      if (cancelled) return;
      setCrewlist(cl);
    });
    return () => {
      cancelled = true;
    };
  }, [userId, config?.crewlistId]);

  const paddlerMap = useMemo(() => {
    const m = new Map<string, Paddler>();
    paddlers.forEach((p) => {
      if (p.id) m.set(p.id, p);
    });
    return m;
  }, [paddlers]);

  const availablePaddlers = useMemo(() => {
    if (!lineup) return [];
    const base = paddlers.filter(
      (p) => p.id && !lineupContains(lineup, p.id) && !reservedSet.has(p.id)
    );
    if (crewlist && crewlist.memberIds && crewlist.memberIds.length > 0) {
      const memberSet = new Set(crewlist.memberIds);
      return base.filter((p) => p.id && memberSet.has(p.id));
    }
    // Legacy configs without crewlistId fall back to full roster
    return base;
  }, [paddlers, lineup, crewlist, reservedSet]);

  const reservedPaddlers = useMemo(() => {
    if (!lineup) return [];
    const base = paddlers.filter(
      (p) => p.id && reservedSet.has(p.id) && !lineupContains(lineup, p.id)
    );
    if (crewlist && crewlist.memberIds && crewlist.memberIds.length > 0) {
      const memberSet = new Set(crewlist.memberIds);
      return base.filter((p) => p.id && memberSet.has(p.id));
    }
    return base;
  }, [paddlers, lineup, crewlist, reservedSet]);

  const filteredRoster = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return availablePaddlers;
    return availablePaddlers.filter((p) =>
      p.name.toLowerCase().includes(q)
    );
  }, [availablePaddlers, searchQuery]);

  const filteredReserved = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return reservedPaddlers;
    return reservedPaddlers.filter((p) =>
      p.name.toLowerCase().includes(q)
    );
  }, [reservedPaddlers, searchQuery]);

  const boatStats = useMemo((): BoatStats => {
    const n = config ? getLineupRowCount(config.size) : 10;
    const empty: BoatStats = {
      weightLeft: 0,
      weightRight: 0,
      powerLeft: 0,
      powerRight: 0,
      weightDelta: 0,
      powerDelta: 0,
      totalWeight: 0,
      totalPower: 0,
      preferredSideFraction: 0,
      preferredCount: 0,
      paddlerCount: 0,
      trimBowWeight: 0,
      trimSternWeight: 0,
      trimDelta: 0,
    };
    if (!lineup || !paddlerMap.size) return empty;

    let weightLeft = 0;
    let weightRight = 0;
    let powerLeft = 0;
    let powerRight = 0;
    let preferredCount = 0;
    let paddlerCount = 0;

    for (const id of lineup.left) {
      if (!id) continue;
      const p = paddlerMap.get(id);
      if (!p) continue;
      weightLeft += p.weight;
      powerLeft += p.powerRatio ?? 0;
      paddlerCount += 1;
      if (p.preferredSide === "Left" || p.preferredSide === "Both")
        preferredCount += 1;
    }
    for (const id of lineup.right) {
      if (!id) continue;
      const p = paddlerMap.get(id);
      if (!p) continue;
      weightRight += p.weight;
      powerRight += p.powerRatio ?? 0;
      paddlerCount += 1;
      if (p.preferredSide === "Right" || p.preferredSide === "Both")
        preferredCount += 1;
    }

    let totalWeight = weightLeft + weightRight;
    let totalPower = powerLeft + powerRight;

    const drummer = lineup.drummerId
      ? paddlerMap.get(lineup.drummerId)
      : null;
    const sweep = lineup.sweepId ? paddlerMap.get(lineup.sweepId) : null;
    if (drummer) {
      totalWeight += drummer.weight;
      totalPower += drummer.powerRatio ?? 0;
    }
    if (sweep) {
      totalWeight += sweep.weight;
      totalPower += sweep.powerRatio ?? 0;
    }

    const weightDelta = Math.abs(weightLeft - weightRight);
    const powerDelta = Math.abs(powerLeft - powerRight);
    const preferredSideFraction =
      paddlerCount > 0 ? preferredCount / paddlerCount : 0;

    const trim = computeTrim(lineup, paddlerMap, n);

    return {
      weightLeft,
      weightRight,
      powerLeft,
      powerRight,
      weightDelta,
      powerDelta,
      totalWeight,
      totalPower,
      preferredSideFraction,
      preferredCount,
      paddlerCount,
      trimBowWeight: trim.bowWeight,
      trimSternWeight: trim.sternWeight,
      trimDelta: trim.trimDelta,
    };
  }, [lineup, paddlerMap, config]);

  const suggestions = useMemo((): SwapSuggestion[] => {
    if (!lineup || !config) return [];
    return getTopSwapSuggestions(
      lineup,
      paddlerMap,
      getLineupRowCount(config.size),
      priorityOrder,
      2
    );
  }, [lineup, paddlerMap, config, priorityOrder]);

  const replacementSuggestions = useMemo((): ReplacementSuggestion[] => {
    if (!lineup || !config || !lastVacatedSeat) return [];
    if (lastVacatedSeat === "drummer" || lastVacatedSeat === "sweep") return [];
    const candidates = availablePaddlers
      .filter((p) => p.id && (p.role === "Paddler" || p.role === "Drummer"))
      .map((p) => p.id!);
    if (candidates.length === 0) return [];
    return getReplacementSuggestions(
      lineup,
      lastVacatedSeat,
      candidates,
      paddlerMap,
      getLineupRowCount(config.size),
      priorityOrder,
      3,
      2
    );
  }, [lineup, config, lastVacatedSeat, availablePaddlers, paddlerMap, priorityOrder]);

  const handleApplySuggestion = (s: SwapSuggestion) => {
    if (!lineup) return;
    persistLineup(applySwap(lineup, s.seatA, s.seatB));
  };

  const handleApplyReplacement = (s: ReplacementSuggestion) => {
    if (!lineup) return;
    persistLineup(applyReplacement(lineup, s));
    setLastVacatedSeat(null);
  };

  const persistReservedIds = async (nextIds: string[]) => {
    if (!configId) return;
    const previous = reservedByHeat[activeTab];
    setReservedByHeat((prev) => ({ ...prev, [activeTab]: nextIds }));
    setSaving(true);
    try {
      await updateConfig(userId, configId, { [reservedKey]: nextIds });
    } catch (err) {
      console.error(err);
      setReservedByHeat((prev) => ({ ...prev, [activeTab]: previous }));
      alert("Failed to update reserve status.");
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAsReserve = async (seatId: string, paddlerId: string) => {
    if (!lineup || !config || !configId || !lineups) return;
    setContextMenu(null);
    const vacated = seatIdToSeatRef(seatId);
    const nextLineup = setSeat(lineup, seatId, null);
    const nextReserved = reservedIds.includes(paddlerId)
      ? reservedIds
      : [...reservedIds, paddlerId];

    const previousLineup = lineups[activeTab];
    const previousReserved = reservedByHeat[activeTab];
    setLineups((prev) => (prev ? { ...prev, [activeTab]: nextLineup } : null));
    setReservedByHeat((prev) => ({ ...prev, [activeTab]: nextReserved }));
    setLastVacatedSeat(vacated);
    setSaving(true);
    try {
      await updateConfig(userId, configId, {
        [lineupKey]: nextLineup,
        [reservedKey]: nextReserved,
      });
    } catch (err) {
      console.error(err);
      setLineups((prev) =>
        prev ? { ...prev, [activeTab]: previousLineup } : null
      );
      setReservedByHeat((prev) => ({
        ...prev,
        [activeTab]: previousReserved,
      }));
      setLastVacatedSeat(null);
      alert("Failed to mark paddler as reserve.");
    } finally {
      setSaving(false);
    }
  };

  const handleClearReserve = (paddlerId: string) => {
    const nextIds = reservedIds.filter((id) => id !== paddlerId);
    void persistReservedIds(nextIds);
  };

  const handleSeatContextMenu = (
    e: React.MouseEvent,
    seatId: string
  ) => {
    if (!lineup) return;
    const paddlerId = getPaddlerAtSeat(lineup, seatId);
    if (!paddlerId) return;
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      seatId,
      paddlerId,
    });
  };

  const handleClearConfig = () => {
    if (!config || !lineup) return;
    const filled = [
      lineup.drummerId,
      lineup.sweepId,
      ...lineup.left,
      ...lineup.right,
    ].filter(Boolean).length;
    if (filled === 0) return;
    if (!confirm("Clear everyone from the boat back to the roster? This cannot be undone.")) return;
    persistLineup(emptyLineup(config.size));
  };

  const handleAutoconfig = () => {
    if (!lineup || !config || !lineup.drummerId || !lineup.sweepId) return;
    const toPlace = availablePaddlers.filter(
      (p) => p.role === "Paddler" || p.role === "Drummer"
    );
    const newLineup = runAutoConfig(
      lineup,
      paddlerMap,
      toPlace,
      config
    );
    persistLineup(newLineup);
  };

  const handlePlacePreferredSides = () => {
    if (!lineup || !config || !lineup.drummerId || !lineup.sweepId) return;
    const toPlace = availablePaddlers.filter(
      (p) => p.role === "Paddler" || p.role === "Drummer"
    );
    const newLineup = runPlacePreferredSides(
      lineup,
      paddlerMap,
      toPlace,
      config
    );
    persistLineup(newLineup);
  };

  const persistLineup = async (newLineup: CrewLineup) => {
    if (!configId || !config || !lineups) return;
    const previous = lineups[activeTab];
    setLineups((prev) => (prev ? { ...prev, [activeTab]: newLineup } : null));
    setSaving(true);
    try {
      await updateConfig(userId, configId, { [lineupKey]: newLineup });
    } catch (err) {
      console.error(err);
      setLineups((prev) => (prev ? { ...prev, [activeTab]: previous } : null));
      alert("Failed to save crew.");
    } finally {
      setSaving(false);
    }
  };

  const getPaddlerAtSeat = (l: CrewLineup, seat: string): string | null => {
    if (seat === "drummer") return l.drummerId;
    if (seat === "sweep") return l.sweepId;
    const n = config ? getLineupRowCount(config.size) : 10;
    if (seat.startsWith("left-")) {
      const i = parseInt(seat.slice(5), 10);
      return i >= 0 && i < n ? l.left[i] : null;
    }
    if (seat.startsWith("right-")) {
      const i = parseInt(seat.slice(6), 10);
      return i >= 0 && i < n ? l.right[i] : null;
    }
    return null;
  };

  const setSeat = (
    l: CrewLineup,
    seatId: string,
    paddlerId: string | null
  ): CrewLineup => {
    const next = { ...l, left: [...l.left], right: [...l.right] };
    if (!config) return next;
    const n = getLineupRowCount(config.size);
    if (seatId === "drummer") next.drummerId = paddlerId;
    else if (seatId === "sweep") next.sweepId = paddlerId;
    else if (seatId.startsWith("left-")) {
      const i = parseInt(seatId.slice(5), 10);
      if (i >= 0 && i < n) next.left[i] = paddlerId;
    } else if (seatId.startsWith("right-")) {
      const i = parseInt(seatId.slice(6), 10);
      if (i >= 0 && i < n) next.right[i] = paddlerId;
    }
    return next;
  };

  const handleDropOnSeat = (seatId: string, e: React.DragEvent) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData(DRAG_TYPE_PADDLER);
    if (!raw || !lineup || !config) return;
    let data: { paddlerId?: string } | { fromSeat?: string };
    try {
      data = JSON.parse(raw);
    } catch {
      return;
    }
    const paddlerId = "paddlerId" in data ? data.paddlerId : null;
    const fromSeat = "fromSeat" in data ? data.fromSeat : null;

    let next: CrewLineup;

    if (fromSeat) {
      // Dragging from boat seat to another boat seat
      if (fromSeat === seatId) return; // same seat, no-op
      const movingPaddlerId = getPaddlerAtSeat(lineup, fromSeat);
      if (!movingPaddlerId) return;
      const targetPaddlerId = getPaddlerAtSeat(lineup, seatId);
      // Swap: target gets moving paddler, fromSeat gets target's paddler (or null)
      next = setSeat(lineup, fromSeat, targetPaddlerId);
      next = setSeat(next, seatId, movingPaddlerId);
    } else if (paddlerId) {
      // Dragging from roster: place paddler (replaces occupant if any)
      if (reservedSet.has(paddlerId)) return;
      next = setSeat(lineup, seatId, paddlerId);
    } else {
      return;
    }
    persistLineup(next);
  };

  const handleDropOnRoster = (e: React.DragEvent) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData(DRAG_TYPE_PADDLER);
    if (!raw || !lineup || !configId) return;
    let data: { paddlerId?: string } | { fromSeat?: string };
    try {
      data = JSON.parse(raw);
    } catch {
      return;
    }
    const fromSeat = "fromSeat" in data ? data.fromSeat : null;
    if (!fromSeat || !lineup) return;
    const n = getLineupRowCount(config!.size);
    const next = { ...lineup, left: [...lineup.left], right: [...lineup.right] };
    if (fromSeat === "drummer") next.drummerId = null;
    else if (fromSeat === "sweep") next.sweepId = null;
    else if (fromSeat.startsWith("left-")) {
      const i = parseInt(fromSeat.slice(5), 10);
      if (i >= 0 && i < n) next.left[i] = null;
    } else if (fromSeat.startsWith("right-")) {
      const i = parseInt(fromSeat.slice(6), 10);
      if (i >= 0 && i < n) next.right[i] = null;
    }
    persistLineup(next);
  };

  // Tap-to-place handlers for touch devices
  const handleRosterPaddlerTap = (paddlerId: string) => {
    setTouchSelection((prev) =>
      prev?.type === "roster" && prev.paddlerId === paddlerId ? null : { type: "roster", paddlerId }
    );
  };

  const handleSeatTap = (seatId: string) => {
    if (!lineup || !config) return;
    const fromSeat = touchSelection?.type === "seat" ? touchSelection.seatId : null;
    const paddlerId = touchSelection?.type === "roster" ? touchSelection.paddlerId : null;

    if (fromSeat) {
      if (fromSeat === seatId) {
        setTouchSelection(null);
        return;
      }
      const movingPaddlerId = getPaddlerAtSeat(lineup, fromSeat);
      if (!movingPaddlerId) return;
      const targetPaddlerId = getPaddlerAtSeat(lineup, seatId);
      const next = setSeat(lineup, fromSeat, targetPaddlerId);
      persistLineup(setSeat(next, seatId, movingPaddlerId));
      setTouchSelection(null);
    } else if (paddlerId) {
      if (reservedSet.has(paddlerId)) {
        setTouchSelection(null);
        return;
      }
      const next = setSeat(lineup, seatId, paddlerId);
      persistLineup(next);
      setTouchSelection(null);
    } else {
      const occupant = getPaddlerAtSeat(lineup, seatId);
      if (occupant) setTouchSelection({ type: "seat", seatId });
    }
  };

  const handleRemoveFromBoatTap = () => {
    if (touchSelection?.type !== "seat" || !lineup || !config) return;
    const n = getLineupRowCount(config.size);
    const next = { ...lineup, left: [...lineup.left], right: [...lineup.right] };
    const seatId = touchSelection.seatId;
    if (seatId === "drummer") next.drummerId = null;
    else if (seatId === "sweep") next.sweepId = null;
    else if (seatId.startsWith("left-")) {
      const i = parseInt(seatId.slice(5), 10);
      if (i >= 0 && i < n) next.left[i] = null;
    } else if (seatId.startsWith("right-")) {
      const i = parseInt(seatId.slice(6), 10);
      if (i >= 0 && i < n) next.right[i] = null;
    }
    persistLineup(next);
    setTouchSelection(null);
  };

  if (!configId) return null;
  if (config === null) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading config...</p>
      </div>
    );
  }
  if (!config) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Config not found.</p>
      </div>
    );
  }
  if (!lineups) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const n = getLineupRowCount(config.size);
  const lineupSafe = lineup ?? emptyLineup(config.size);

  const heatOptions: { id: HeatTabId; label: string }[] = [
    { id: "heat1", label: "Heat 1" },
    { id: "heat2", label: "Heat 2" },
    { id: "final", label: "Final" },
  ];

  return (
    <div className="flex flex-col h-full">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{config.name}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {config.ageDivision} · {formatSize(config.size)} · {formatCategory(config.category)}
          </p>
          {saving && (
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Saving...</p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as HeatTabId)}
            className="text-sm border border-slate-200 rounded-sm px-3 py-2 bg-white text-slate-700 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-sm"
          >
            {heatOptions.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleClearConfig}
            disabled={
              !lineup ||
              ![lineup.drummerId, lineup.sweepId, ...lineup.left, ...lineup.right].some(Boolean)
            }
            className="px-4 py-2 bg-white border border-red-200 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed text-red-600 rounded-sm text-sm font-medium transition-colors shadow-sm"
          >
            Clear Config
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
        {/* Left: Boat */}
        <div className="flex flex-col border border-slate-200 rounded-sm shadow-sm bg-white p-4 sm:p-6 overflow-x-auto">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-6 border-b border-slate-100 pb-2">Crew Layout</h2>
          {touchSelection?.type === "roster" && (
            <p className="text-xs text-slate-600 mb-3">Tap a seat to place</p>
          )}
          <div className="flex flex-col items-center gap-2 min-w-max mx-auto px-2">
            {/* Drummer */}
            <div
              data-seat="drummer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleSeatTap("drummer")}
              onClick={() => handleSeatTap("drummer")}
              onContextMenu={(e) => handleSeatContextMenu(e, "drummer")}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropOnSeat("drummer", e)}
              className={`relative w-full max-w-[140px] min-h-[44px] border rounded-sm flex items-center justify-center overflow-hidden cursor-pointer touch-manipulation select-none ${
                touchSelection?.type === "seat" && touchSelection.seatId === "drummer"
                  ? "border-slate-900 border-2 bg-slate-100 ring-2 ring-slate-900 ring-offset-1"
                  : "border-dashed border-slate-300 bg-slate-50/50"
              }`}
            >
              {lineupSafe.drummerId && paddlerMap.get(lineupSafe.drummerId) ? (
                <BoatTile
                  paddler={paddlerMap.get(lineupSafe.drummerId)!}
                  seatId="drummer"
                />
              ) : (
                <span className="text-xs text-gray-400">Drummer</span>
              )}
            </div>
            {/* 2 x N grid */}
            <div className="flex gap-2 sm:gap-4">
              <div className="flex flex-col gap-2">
                {Array.from({ length: n }, (_, i) => (
                  <div
                    key={`left-${i}`}
                    data-seat={`left-${i}`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleSeatTap(`left-${i}`)}
                    onClick={() => handleSeatTap(`left-${i}`)}
                    onContextMenu={(e) => handleSeatContextMenu(e, `left-${i}`)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropOnSeat(`left-${i}`, e)}
                    className={`relative w-[140px] min-h-[44px] border rounded-sm flex items-center justify-center overflow-hidden cursor-pointer touch-manipulation select-none ${
                      touchSelection?.type === "seat" && touchSelection.seatId === `left-${i}`
                        ? "border-slate-900 border-2 bg-slate-100 ring-2 ring-slate-900 ring-offset-1"
                        : "border-dashed border-slate-300 bg-slate-50/50"
                    }`}
                  >
                    {lineupSafe.left[i] && paddlerMap.get(lineupSafe.left[i]!) ? (
                      <BoatTile
                        paddler={paddlerMap.get(lineupSafe.left[i]!)!}
                        seatId={`left-${i}`}
                      />
                    ) : (
                      <span className="text-xs text-gray-400">L {i + 1}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {Array.from({ length: n }, (_, i) => (
                  <div
                    key={`right-${i}`}
                    data-seat={`right-${i}`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleSeatTap(`right-${i}`)}
                    onClick={() => handleSeatTap(`right-${i}`)}
                    onContextMenu={(e) => handleSeatContextMenu(e, `right-${i}`)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropOnSeat(`right-${i}`, e)}
                    className={`relative w-[140px] min-h-[44px] border rounded-sm flex items-center justify-center overflow-hidden cursor-pointer touch-manipulation select-none ${
                      touchSelection?.type === "seat" && touchSelection.seatId === `right-${i}`
                        ? "border-slate-900 border-2 bg-slate-100 ring-2 ring-slate-900 ring-offset-1"
                        : "border-dashed border-slate-300 bg-slate-50/50"
                    }`}
                  >
                    {lineupSafe.right[i] && paddlerMap.get(lineupSafe.right[i]!) ? (
                      <BoatTile
                        paddler={paddlerMap.get(lineupSafe.right[i]!)!}
                        seatId={`right-${i}`}
                      />
                    ) : (
                      <span className="text-xs text-gray-400">R {i + 1}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Sweep */}
            <div
              data-seat="sweep"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleSeatTap("sweep")}
              onClick={() => handleSeatTap("sweep")}
              onContextMenu={(e) => handleSeatContextMenu(e, "sweep")}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropOnSeat("sweep", e)}
              className={`relative w-full max-w-[140px] min-h-[44px] border rounded-sm flex items-center justify-center overflow-hidden cursor-pointer touch-manipulation select-none ${
                touchSelection?.type === "seat" && touchSelection.seatId === "sweep"
                  ? "border-slate-900 border-2 bg-slate-100 ring-2 ring-slate-900 ring-offset-1"
                  : "border-dashed border-slate-300 bg-slate-50/50"
              }`}
            >
              {lineupSafe.sweepId && paddlerMap.get(lineupSafe.sweepId) ? (
                <BoatTile
                  paddler={paddlerMap.get(lineupSafe.sweepId)!}
                  seatId="sweep"
                />
              ) : (
                <span className="text-xs text-gray-400">Sweep</span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Roster + Crew Controls */}
        <div className="flex flex-col gap-4 min-h-0">
          {/* Roster - dynamic height by content */}
          <div
            className="flex flex-col border border-slate-200 rounded-sm shadow-sm bg-white p-4 sm:p-6 flex-shrink-0 w-full"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropOnRoster}
          >
            {touchSelection?.type === "seat" && (
              <button
                type="button"
                onClick={handleRemoveFromBoatTap}
                className="w-full mb-4 py-2 px-3 text-sm font-medium rounded-sm border-2 border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 touch-manipulation"
              >
                Remove from boat
              </button>
            )}
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-100 pb-2">Roster</h2>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-sm mb-4 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
            <div className="flex flex-wrap gap-2 content-start max-h-[280px] overflow-auto">
              {filteredRoster.length === 0 && filteredReserved.length === 0 ? (
                <p className="text-sm text-gray-500">
                  {availablePaddlers.length === 0 && reservedPaddlers.length === 0
                    ? "All paddlers are in the crew."
                    : "No matching paddlers."}
                </p>
              ) : (
                <>
                  {filteredRoster.map((p) => (
                    <div
                      key={p.id}
                      draggable
                      onClick={() => handleRosterPaddlerTap(p.id!)}
                      onDragStart={(e) => {
                        e.dataTransfer.setData(
                          DRAG_TYPE_PADDLER,
                          JSON.stringify({ paddlerId: p.id })
                        );
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      className={`flex px-3 py-2 rounded-sm border text-sm font-medium cursor-grab active:cursor-grabbing shrink-0 touch-manipulation ${
                        touchSelection?.type === "roster" && touchSelection.paddlerId === p.id
                          ? "ring-2 ring-slate-900 ring-offset-1"
                          : ""
                      } ${getTileBgClass(p.gender)}`}
                    >
                      <PaddlerTileLabel paddler={p} />
                    </div>
                  ))}
                  {filteredReserved.map((p) => (
                    <div
                      key={`reserved-${p.id}`}
                      className={`flex items-center gap-2 px-3 py-2 rounded-sm border text-sm font-medium shrink-0 opacity-80 ${getTileBgClass(p.gender)}`}
                    >
                      <PaddlerTileLabel paddler={p} />
                      <span className="text-[10px] uppercase tracking-wide font-semibold text-slate-600 bg-slate-200/80 px-1.5 py-0.5 rounded-sm">
                        Out
                      </span>
                      <button
                        type="button"
                        onClick={() => handleClearReserve(p.id!)}
                        className="text-[10px] font-medium text-slate-700 underline underline-offset-2 hover:text-slate-900"
                      >
                        Clear
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Crew Controls */}
          <CrewControlsTelemetry
            stats={boatStats}
            canAutoconfig={
              !!(
                lineupSafe.drummerId &&
                lineupSafe.sweepId
              )
            }
            onAutoconfig={handleAutoconfig}
            onPlacePreferredSides={handlePlacePreferredSides}
          />

          {/* Suggestions */}
          <SuggestionsPanel
            suggestions={suggestions}
            replacementSuggestions={replacementSuggestions}
            paddlerMap={paddlerMap}
            priorityOrder={priorityOrder}
            onPriorityChange={setPriorityOrder}
            onApply={handleApplySuggestion}
            onApplyReplacement={handleApplyReplacement}
            onHover={setHoveredSuggestionIdx}
          />
        </div>
      </div>

      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setContextMenu(null)}
            onContextMenu={(e) => {
              e.preventDefault();
              setContextMenu(null);
            }}
          />
          <div
            className="fixed z-50 min-w-[160px] rounded-sm border border-slate-200 bg-white shadow-md py-1"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              type="button"
              className="w-full text-left px-3 py-2 text-sm text-slate-800 hover:bg-slate-100"
              onClick={() =>
                void handleMarkAsReserve(contextMenu.seatId, contextMenu.paddlerId)
              }
            >
              Mark as reserve
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function CrewControlsTelemetry({
  stats,
  canAutoconfig,
  onAutoconfig,
  onPlacePreferredSides,
}: {
  stats: BoatStats;
  canAutoconfig: boolean;
  onAutoconfig: () => void;
  onPlacePreferredSides: () => void;
}) {
  const powerDeltaWarn =
    stats.totalPower > 0 &&
    stats.powerDelta / stats.totalPower >= POWER_DELTA_WARN_PCT;
  const weightDeltaWarn = stats.weightDelta > WEIGHT_DELTA_WARN;
  const trimDeltaWarn = stats.trimDelta > TRIM_DELTA_WARN;
  const preferredIssue =
    stats.paddlerCount > 0 && stats.preferredSideFraction < PREFERRED_MIN;

  const trimIssueText =
    stats.trimDelta > 0
      ? stats.trimBowWeight > stats.trimSternWeight
        ? `${Math.round(stats.trimDelta)} kg FRONT HEAVY`
        : `${Math.round(stats.trimDelta)} kg BACK HEAVY`
      : "Balanced";

  const weightIssueText =
    stats.weightDelta > 0
      ? stats.weightLeft > stats.weightRight
        ? `${Math.round(stats.weightDelta)} kg LEFT HEAVY`
        : `${Math.round(stats.weightDelta)} kg RIGHT HEAVY`
      : "Balanced";

  const powerPct =
    stats.totalPower > 0
      ? Math.round((stats.powerDelta / stats.totalPower) * 100)
      : 0;
  const powerIssueText = powerDeltaWarn
    ? stats.powerLeft > stats.powerRight
      ? `${powerPct}% LEFT STRONG`
      : `${powerPct}% RIGHT STRONG`
    : stats.powerDelta > 0
      ? `${powerPct}% delta`
      : "Balanced";

  const okClass = "text-emerald-600";
  const warnClass = "text-red-600 font-medium";

  return (
    <div className="rounded-sm border border-slate-200 bg-white p-4 sm:p-6 flex-shrink-0 shadow-sm">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-100 pb-2">Crew Controls</h2>
      <button
        type="button"
        onClick={onAutoconfig}
        disabled={!canAutoconfig}
        title={
          canAutoconfig
            ? "Auto-place paddlers for optimal balance"
            : "Assign drummer and sweep first"
        }
        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-sm bg-slate-900 text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors mb-2 shadow-sm"
      >
        <Wand2 className="w-4 h-4" strokeWidth={1.5} />
        Autoconfig
      </button>
      <button
        type="button"
        onClick={onPlacePreferredSides}
        disabled={!canAutoconfig}
        title={
          canAutoconfig
            ? "Place all paddlers on preferred side and bench (ignores weight)"
            : "Assign drummer and sweep first"
        }
        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-sm border border-slate-200 bg-white text-slate-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors mb-6 shadow-sm"
      >
        Place on Preferred Sides
      </button>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
        {/* Weight L vs R */}
        <div className="space-y-0.5">
          <div className="text-gray-500 text-xs font-medium">Weight</div>
          <div className="text-gray-900 flex gap-2">
            <span>L: {Math.round(stats.weightLeft)} kg</span>
            <span className="text-gray-400">|</span>
            <span>R: {Math.round(stats.weightRight)} kg</span>
          </div>
        </div>
        {/* Weight issue */}
        <div className="space-y-0.5">
          <div className="text-gray-500 text-xs font-medium">Weight balance</div>
          <div className={weightDeltaWarn ? warnClass : okClass}>
            {weightIssueText}
          </div>
        </div>
        {/* Power L vs R */}
        <div className="space-y-0.5 col-span-2">
          <div className="text-gray-500 text-xs font-medium">Power (ratio sum)</div>
          <div className="text-gray-900 flex gap-2">
            <span>L: {stats.powerLeft.toFixed(2)}</span>
            <span className="text-gray-400">|</span>
            <span>R: {stats.powerRight.toFixed(2)}</span>
          </div>
        </div>
        {/* Power issue */}
        <div className="space-y-0.5">
          <div className="text-gray-500 text-xs font-medium">Power balance</div>
          <div className={powerDeltaWarn ? warnClass : okClass}>
            {powerIssueText}
          </div>
        </div>
        {/* Preferred side */}
        <div className="space-y-0.5">
          <div className="text-gray-500 text-xs font-medium">Preferred side</div>
          <div className={preferredIssue ? warnClass : okClass}>
            {stats.paddlerCount > 0
              ? `${stats.preferredCount}/${stats.paddlerCount} (${Math.round(stats.preferredSideFraction * 100)}%)`
              : "—"}
          </div>
        </div>
        {/* Trim */}
        <div className="space-y-0.5 col-span-2">
          <div className="text-gray-500 text-xs font-medium">Trim</div>
          <div className={trimDeltaWarn ? warnClass : okClass}>
            {trimIssueText}
          </div>
        </div>
        {/* Total weight */}
        <div className="space-y-0.5">
          <div className="text-gray-500 text-xs font-medium">Total weight</div>
          <div className="text-gray-900">{Math.round(stats.totalWeight)} kg</div>
        </div>
        {/* Total power */}
        <div className="space-y-0.5">
          <div className="text-gray-500 text-xs font-medium">Total power</div>
          <div className="text-gray-900">{stats.totalPower.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

function BoatTile({
  paddler,
  seatId,
}: {
  paddler: Paddler;
  seatId: string;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(
          DRAG_TYPE_PADDLER,
          JSON.stringify({ fromSeat: seatId })
        );
        e.dataTransfer.effectAllowed = "move";
      }}
      title={paddlerToLabel(paddler)}
      className={`absolute inset-0 flex items-center justify-center rounded-sm border text-xs font-medium cursor-grab active:cursor-grabbing px-2 min-w-0 ${getTileBgClass(paddler.gender)}`}
    >
      <span className="truncate min-w-0 text-center max-w-full">
        <PaddlerTileLabel paddler={paddler} />
      </span>
    </div>
  );
}

const PRIORITY_LABELS: Record<PriorityKey, string> = {
  weight: "Weight Balance",
  power: "Power Balance",
  trim: "Trim",
  side: "Side Preference",
  bench: "Bench Preference",
};

function fmtMetric(value: number, unit: string): string {
  if (unit === "kg") return `${Math.round(value)} kg`;
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(2);
}

function SuggestionsPanel({
  suggestions,
  replacementSuggestions,
  paddlerMap,
  priorityOrder,
  onPriorityChange,
  onApply,
  onApplyReplacement,
  onHover,
}: {
  suggestions: SwapSuggestion[];
  replacementSuggestions: ReplacementSuggestion[];
  paddlerMap: Map<string, Paddler>;
  priorityOrder: PriorityOrder;
  onPriorityChange: (order: PriorityOrder) => void;
  onApply: (s: SwapSuggestion) => void;
  onApplyReplacement: (s: ReplacementSuggestion) => void;
  onHover: (idx: number | null) => void;
}) {
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleDragStart = (idx: number) => setDraggingIdx(idx);

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };

  const handleDrop = (targetIdx: number) => {
    if (draggingIdx === null || draggingIdx === targetIdx) {
      setDraggingIdx(null);
      setDragOverIdx(null);
      return;
    }
    const next = [...priorityOrder];
    const [item] = next.splice(draggingIdx, 1);
    next.splice(targetIdx, 0, item);
    onPriorityChange(next);
    setDraggingIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDraggingIdx(null);
    setDragOverIdx(null);
  };

  const hasAny =
    replacementSuggestions.length > 0 || suggestions.length > 0;

  return (
    <div className="rounded-sm border border-slate-200 bg-white p-4 sm:p-6 flex-shrink-0 shadow-sm">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-100 pb-2">
        Suggestions
      </h2>

      {/* Priority ranker */}
      <div className="mb-4">
        <p className="text-xs text-slate-500 mb-2">Drag to reorder priority:</p>
        <div className="flex flex-col gap-1">
          {priorityOrder.map((key, idx) => (
            <div
              key={key}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={() => handleDrop(idx)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-sm cursor-grab select-none transition-colors ${
                dragOverIdx === idx && draggingIdx !== idx
                  ? "border-slate-400 bg-slate-100"
                  : "border-slate-200 bg-slate-50"
              } ${draggingIdx === idx ? "opacity-40" : ""}`}
            >
              <GripVertical className="w-3.5 h-3.5 text-slate-400 shrink-0" strokeWidth={1.5} />
              <span className="text-xs font-medium text-slate-700">
                {idx + 1}. {PRIORITY_LABELS[key]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {!hasAny ? (
        <p className="text-sm text-slate-500">No improvements found.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {replacementSuggestions.map((s, idx) => {
            const name = paddlerMap.get(s.replacementPaddlerId)?.name ?? "?";
            const swapCount = s.moveCount - 1;
            const detail =
              swapCount <= 0
                ? "Fill vacant seat"
                : `Fill + ${swapCount} swap${swapCount === 1 ? "" : "s"}`;
            return (
              <div
                key={`repl-${idx}`}
                className="border border-slate-200 rounded-sm p-3 bg-slate-50 hover:bg-sky-50 hover:border-sky-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-sky-700 mb-0.5">
                      Replacement
                    </p>
                    <p className="text-xs font-medium text-slate-800 truncate">
                      Seat {name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {detail} · {s.moveCount} move{s.moveCount === 1 ? "" : "s"}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {s.primaryMetric}:{" "}
                      {fmtMetric(s.primaryBefore, s.primaryUnit)} →{" "}
                      {fmtMetric(s.primaryAfter, s.primaryUnit)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onApplyReplacement(s)}
                    className="shrink-0 text-xs px-2.5 py-1 rounded-sm bg-slate-900 text-white font-medium hover:bg-slate-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            );
          })}
          {suggestions.map((s, idx) => {
            const nameA = paddlerMap.get(s.paddlerIdA)?.name ?? "?";
            const nameB = paddlerMap.get(s.paddlerIdB)?.name ?? "?";
            return (
              <div
                key={`swap-${idx}`}
                onMouseEnter={() => onHover(idx)}
                onMouseLeave={() => onHover(null)}
                className="border border-slate-200 rounded-sm p-3 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate">
                      Swap {nameA} ↔ {nameB}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {s.primaryMetric}:{" "}
                      {fmtMetric(s.primaryBefore, s.primaryUnit)} →{" "}
                      {fmtMetric(s.primaryAfter, s.primaryUnit)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onApply(s)}
                    className="shrink-0 text-xs px-2.5 py-1 rounded-sm bg-slate-900 text-white font-medium hover:bg-slate-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
