import type { Timestamp } from "firebase/firestore";
import type { ConfigSize, ConfigCategory } from "./config";

export interface Crewlist {
  id?: string;
  name: string;
  ageDivision: string;
  size: ConfigSize;
  category: ConfigCategory;
  memberIds: string[];
  createdAt?: Timestamp;
}

export interface CrewlistFormData {
  name: string;
  ageDivision: string;
  size: ConfigSize;
  category: ConfigCategory;
}

export const CREWLIST_AGE_DIVISIONS = [
  "16U",
  "18U",
  "24U",
  "Premier",
  "Senior A",
  "Senior B",
  "Senior C",
];

export const defaultCrewlistForm: CrewlistFormData = {
  name: "",
  ageDivision: "18U",
  size: "standard",
  category: "open",
};

