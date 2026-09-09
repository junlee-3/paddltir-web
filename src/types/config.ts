import type { Timestamp } from "firebase/firestore";

export type ConfigSize = "small" | "standard";
export type ConfigCategory = "open" | "women" | "mixed";

export interface CrewLineup {
  drummerId: string | null;
  sweepId: string | null;
  left: (string | null)[];
  right: (string | null)[];
}

export type HeatTabId = "heat1" | "heat2" | "final";

export interface Config {
  id?: string;
  crewlistId?: string;
  name: string;
  ageDivision: string;
  size: ConfigSize;
  category: ConfigCategory;
  /** @deprecated use lineupHeat1 */
  lineup?: CrewLineup;
  lineupHeat1?: CrewLineup;
  lineupHeat2?: CrewLineup;
  lineupFinal?: CrewLineup;
  /** Paddler ids marked out/reserve for each heat (still in crewlist). */
  reservedHeat1Ids?: string[];
  reservedHeat2Ids?: string[];
  reservedFinalIds?: string[];
  createdAt?: Timestamp;
}

export function reservedIdsKey(
  tab: HeatTabId
): "reservedHeat1Ids" | "reservedHeat2Ids" | "reservedFinalIds" {
  if (tab === "heat1") return "reservedHeat1Ids";
  if (tab === "heat2") return "reservedHeat2Ids";
  return "reservedFinalIds";
}

export function getLineupRowCount(size: ConfigSize): 5 | 10 {
  return size === "small" ? 5 : 10;
}

export interface ConfigFormData {
  name: string;
  ageDivision: string;
  size: ConfigSize;
  category: ConfigCategory;
  crewlistId?: string;
}

export const AGE_DIVISIONS = ["16U", "18U", "24U", "Premier", "Senior A", "Senior B", "Senior C"];
export const SIZES: ConfigSize[] = ["small", "standard"];
export const CATEGORIES: ConfigCategory[] = ["open", "women", "mixed"];

export const defaultConfigForm: ConfigFormData = {
  name: "",
  ageDivision: "18U",
  size: "standard",
  category: "open",
};
