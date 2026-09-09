import type { Timestamp } from "firebase/firestore";

export type PreferredSide = "Left" | "Right" | "Both";
export type Gender = "Male" | "Female";
export type SeatPreference = "Stroke" | "Pace" | "Engine" | "Sprint";
export type Role = "Drummer" | "Sweep" | "Paddler";

export interface Paddler {
  id?: string;
  name: string;
  weight: number;
  ergScore: number;
  powerRatio: number; // Derived: ergScore / max(ergScores) in roster
  preferredSide: PreferredSide;
  gender: Gender;
  seatPreference: SeatPreference;
  role: Role;
  createdAt?: Timestamp;
}

export interface PaddlerFormData {
  name: string;
  weight: number;
  ergScore: number;
  preferredSide: PreferredSide;
  gender: Gender;
  seatPreference: SeatPreference;
  role: Role;
}

export const PREFERRED_SIDES: PreferredSide[] = ["Left", "Right", "Both"];
export const GENDERS: Gender[] = ["Male", "Female"];
export const SEAT_PREFERENCES: SeatPreference[] = ["Stroke", "Pace", "Engine", "Sprint"];
export const ROLES: Role[] = ["Drummer", "Sweep", "Paddler"];

export const defaultPaddlerForm: PaddlerFormData = {
  name: "",
  weight: 0,
  ergScore: 0,
  preferredSide: "Left",
  gender: "Male",
  seatPreference: "Stroke",
  role: "Paddler",
};
