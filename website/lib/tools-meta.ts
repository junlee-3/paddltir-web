/** Website-facing feature summaries for the docs page. */

export interface ToolMeta {
  name: string;
  /** Human title for display (the mono `name` stays in the example). */
  title: string;
  group: "Lineups" | "Rosters" | "Insights";
  summary: string;
  example: string;
}

export const TOOLS_META: ToolMeta[] = [
  {
    name: "seat_boat",
    title: "Seat the boat",
    group: "Lineups",
    summary: "Place paddlers left and right, set drummer and sweep, and switch small or standard size.",
    example: `seat({ heat: "open_200", size: "standard" })`,
  },
  {
    name: "swap_seats",
    title: "Swap seats",
    group: "Lineups",
    summary: "Move people between seats without rebuilding the whole lineup from scratch.",
    example: `swap({ from: "L3", to: "R5" })`,
  },
  {
    name: "copy_heat",
    title: "Copy a heat",
    group: "Lineups",
    summary: "Duplicate a solid lineup into the next heat, then tweak only what changed.",
    example: `copy_heat({ from: "mixed_500", to: "mixed_200" })`,
  },
  {
    name: "empty_check",
    title: "Empty seat check",
    group: "Lineups",
    summary: "Flag missing seats before you paddle so race-day surprises stay rare.",
    example: `empty_check({ heat: "women_200" })`,
  },
  {
    name: "roster",
    title: "Paddler roster",
    group: "Rosters",
    summary: "Keep names, weight, preferred side, and role in one place your coaches can trust.",
    example: `roster.list({ club: "harbour" })`,
  },
  {
    name: "crewlist",
    title: "Crewlists",
    group: "Rosters",
    summary: "Build the pool available for a race block, then seat boats from that list only.",
    example: `crewlist.create({ name: "Nationals day 1" })`,
  },
  {
    name: "roles",
    title: "Roles",
    group: "Rosters",
    summary: "Mark drummer, sweep, and paddler roles so the right people show up in the right slots.",
    example: `paddler.set_role({ id: "p42", role: "sweep" })`,
  },
  {
    name: "availability",
    title: "Availability",
    group: "Rosters",
    summary: "Track who is in for the weekend so your crewlist matches who will actually race.",
    example: `availability.set({ paddler: "p12", weekend: true })`,
  },
  {
    name: "trim",
    title: "Trim",
    group: "Insights",
    summary: "See fore-aft balance from seated weights so the boat sits where you want it.",
    example: `insights.trim({ heat: "open_500" })`,
  },
  {
    name: "side_balance",
    title: "Side balance",
    group: "Insights",
    summary: "Compare left vs right mass and spot when one gunwale is carrying too much.",
    example: `insights.side_balance({ heat: "mixed_200" })`,
  },
  {
    name: "gap_report",
    title: "Lineup gaps",
    group: "Insights",
    summary: "Surface empty seats, missing sweep, or no drummer before you confirm the heat.",
    example: `insights.gaps({ heat: "open_200" })`,
  },
  {
    name: "compare_heats",
    title: "Compare heats",
    group: "Insights",
    summary: "Stack two lineups side by side when you are deciding who races which distance.",
    example: `insights.compare({ a: "open_200", b: "open_500" })`,
  },
];
