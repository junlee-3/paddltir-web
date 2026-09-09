import { supabase } from "../supabase";
import type { Config, ConfigFormData, CrewLineup } from "../types/config";
import { getLineupRowCount } from "../types/config";
import type { Unsubscribe } from "./paddlers";

type ConfigRow = {
  id: string;
  user_id: string;
  crewlist_id: string | null;
  name: string;
  age_division: string;
  size: string;
  category: string;
  reserved_heat1_ids: string[] | null;
  reserved_heat2_ids: string[] | null;
  reserved_final_ids: string[] | null;
  lineup: CrewLineup | null;
  lineup_heat1: CrewLineup | null;
  lineup_heat2: CrewLineup | null;
  lineup_final: CrewLineup | null;
  created_at: string;
};

function normalizeLineup(
  raw:
    | {
        drummerId?: string | null;
        sweepId?: string | null;
        left?: (string | null)[];
        right?: (string | null)[];
      }
    | undefined
    | null,
  size: "small" | "standard"
): CrewLineup {
  const n = getLineupRowCount(size);
  const left = raw?.left?.slice(0, n) ?? Array(n).fill(null);
  const right = raw?.right?.slice(0, n) ?? Array(n).fill(null);
  return {
    drummerId: raw?.drummerId ?? null,
    sweepId: raw?.sweepId ?? null,
    left: [...left, ...Array(n - left.length).fill(null)].slice(0, n),
    right: [...right, ...Array(n - right.length).fill(null)].slice(0, n),
  };
}

function asIdList(raw: unknown): string[] {
  return Array.isArray(raw) ? raw.filter((id): id is string => typeof id === "string") : [];
}

function mapListItem(row: ConfigRow): Config {
  return {
    id: row.id,
    crewlistId: row.crewlist_id ?? undefined,
    name: row.name ?? "",
    ageDivision: row.age_division ?? "",
    size: (row.size as Config["size"]) ?? "standard",
    category: (row.category as Config["category"]) ?? "open",
    reservedHeat1Ids: asIdList(row.reserved_heat1_ids),
    reservedHeat2Ids: asIdList(row.reserved_heat2_ids),
    reservedFinalIds: asIdList(row.reserved_final_ids),
    createdAt: row.created_at,
  };
}

function mapFull(row: ConfigRow): Config {
  const size = (row.size ?? "standard") as "small" | "standard";
  const config = mapListItem(row);
  config.size = size;
  const norm = (raw: unknown) =>
    raw != null ? normalizeLineup(raw as CrewLineup, size) : undefined;
  config.lineupHeat1 = norm(row.lineup_heat1) ?? norm(row.lineup);
  config.lineupHeat2 = norm(row.lineup_heat2);
  config.lineupFinal = norm(row.lineup_final);
  if (row.lineup != null) config.lineup = normalizeLineup(row.lineup, size);
  return config;
}

async function fetchConfigs(userId: string): Promise<Config[]> {
  const { data, error } = await supabase
    .from("configs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as ConfigRow[] | null)?.map(mapListItem) ?? [];
}

export async function getConfigById(userId: string, configId: string): Promise<Config | null> {
  const { data, error } = await supabase
    .from("configs")
    .select("*")
    .eq("user_id", userId)
    .eq("id", configId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapFull(data as ConfigRow);
}

export function getConfigs(
  userId: string,
  onUpdate: (configs: Config[]) => void
): Unsubscribe {
  let cancelled = false;

  const emit = async () => {
    try {
      const configs = await fetchConfigs(userId);
      if (!cancelled) onUpdate(configs);
    } catch (err) {
      console.error("getConfigs", err);
    }
  };

  void emit();

  const channel = supabase
    .channel(`configs:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "configs",
        filter: `user_id=eq.${userId}`,
      },
      () => {
        void emit();
      }
    )
    .subscribe();

  return () => {
    cancelled = true;
    void supabase.removeChannel(channel);
  };
}

export async function addConfig(userId: string, data: ConfigFormData): Promise<string> {
  const { data: row, error } = await supabase
    .from("configs")
    .insert({
      user_id: userId,
      name: data.name,
      age_division: data.ageDivision,
      size: data.size,
      category: data.category,
      crewlist_id: data.crewlistId ?? null,
    })
    .select("id")
    .single();

  if (error) throw error;
  return row.id as string;
}

export async function updateConfig(
  userId: string,
  configId: string,
  updates: Partial<ConfigFormData> & {
    lineup?: CrewLineup;
    lineupHeat1?: CrewLineup;
    lineupHeat2?: CrewLineup;
    lineupFinal?: CrewLineup;
    reservedHeat1Ids?: string[];
    reservedHeat2Ids?: string[];
    reservedFinalIds?: string[];
  }
): Promise<void> {
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.ageDivision !== undefined) payload.age_division = updates.ageDivision;
  if (updates.size !== undefined) payload.size = updates.size;
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.crewlistId !== undefined) payload.crewlist_id = updates.crewlistId;
  if (updates.lineup !== undefined) payload.lineup = updates.lineup;
  if (updates.lineupHeat1 !== undefined) payload.lineup_heat1 = updates.lineupHeat1;
  if (updates.lineupHeat2 !== undefined) payload.lineup_heat2 = updates.lineupHeat2;
  if (updates.lineupFinal !== undefined) payload.lineup_final = updates.lineupFinal;
  if (updates.reservedHeat1Ids !== undefined) payload.reserved_heat1_ids = updates.reservedHeat1Ids;
  if (updates.reservedHeat2Ids !== undefined) payload.reserved_heat2_ids = updates.reservedHeat2Ids;
  if (updates.reservedFinalIds !== undefined) payload.reserved_final_ids = updates.reservedFinalIds;

  const { error } = await supabase
    .from("configs")
    .update(payload)
    .eq("user_id", userId)
    .eq("id", configId);

  if (error) throw error;
}

export async function deleteConfig(userId: string, configId: string): Promise<void> {
  const { error } = await supabase
    .from("configs")
    .delete()
    .eq("user_id", userId)
    .eq("id", configId);

  if (error) throw error;
}

export async function deleteConfigsByCrewlistId(
  userId: string,
  crewlistId: string
): Promise<void> {
  const { error } = await supabase
    .from("configs")
    .delete()
    .eq("user_id", userId)
    .eq("crewlist_id", crewlistId);

  if (error) throw error;
}
