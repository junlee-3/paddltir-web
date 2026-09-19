export type PreferredSide = "Left" | "Right" | "Both";
export type Gender = "Male" | "Female" | "Non-binary";
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
  roles: Role[];
  createdAt?: string;
}

export interface PaddlerFormData {
  name: string;
  weight: number;
  ergScore: number;
  preferredSide: PreferredSide;
  gender: Gender;
  seatPreference: SeatPreference;
  roles: Role[];
}

export const PREFERRED_SIDES: PreferredSide[] = ["Left", "Right", "Both"];
export const GENDERS: Gender[] = ["Male", "Female", "Non-binary"];
export const SEAT_PREFERENCES: SeatPreference[] = ["Stroke", "Pace", "Engine", "Sprint"];
export const ROLES: Role[] = ["Drummer", "Sweep", "Paddler"];

export const defaultPaddlerForm: PaddlerFormData = {
  name: "",
  weight: 0,
  ergScore: 0,
  preferredSide: "Left",
  gender: "Male",
  seatPreference: "Stroke",
  roles: ["Paddler"],
};

export function hasRole(paddler: { roles: Role[] }, role: Role): boolean {
  return paddler.roles.includes(role);
}

/** Athletes who can sit on bench seats (paddler and/or drummer). */
export function isBenchEligible(paddler: { roles: Role[] }): boolean {
  return hasRole(paddler, "Paddler") || hasRole(paddler, "Drummer");
}

export function formatRoles(roles: Role[]): string {
  return roles.length > 0 ? roles.join(", ") : "—";
}

export function normalizeRoles(value: unknown): Role[] {
  const asArray = Array.isArray(value)
    ? value
    : typeof value === "string" && value.trim()
      ? [value]
      : [];

  const roles = asArray.filter((r): r is Role =>
    ROLES.includes(r as Role)
  );

  return roles.length > 0 ? roles : ["Paddler"];
}
