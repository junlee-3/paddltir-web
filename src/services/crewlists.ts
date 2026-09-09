import { supabase } from "../supabase";
import type { Crewlist, CrewlistFormData } from "../types/crewlist";
import { deleteConfigsByCrewlistId } from "./configs";
import type { Unsubscribe } from "./paddlers";

type CrewlistRow = {
  id: string;
  user_id: string;
  name: string;
  age_division: string;
  size: string;
  category: string;
  member_ids: string[] | null;
  created_at: string;
};

function mapRow(row: CrewlistRow): Crewlist {
  return {
    id: row.id,
    name: row.name ?? "",
    ageDivision: row.age_division ?? "",
    size: (row.size as Crewlist["size"]) ?? "standard",
    category: (row.category as Crewlist["category"]) ?? "open",
    memberIds: Array.isArray(row.member_ids) ? row.member_ids : [],
    createdAt: row.created_at,
  };
}

async function fetchCrewlists(userId: string): Promise<Crewlist[]> {
  const { data, error } = await supabase
    .from("crewlists")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as CrewlistRow[] | null)?.map(mapRow) ?? [];
}

export function getCrewlists(
  userId: string,
  onUpdate: (lists: Crewlist[]) => void
): Unsubscribe {
  let cancelled = false;

  const emit = async () => {
    try {
      const lists = await fetchCrewlists(userId);
      if (!cancelled) onUpdate(lists);
    } catch (err) {
      console.error("getCrewlists", err);
    }
  };

  void emit();

  const channel = supabase
    .channel(`crewlists:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "crewlists",
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

export async function getCrewlistById(
  userId: string,
  crewlistId: string
): Promise<Crewlist | null> {
  const { data, error } = await supabase
    .from("crewlists")
    .select("*")
    .eq("user_id", userId)
    .eq("id", crewlistId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapRow(data as CrewlistRow);
}

export async function addCrewlist(
  userId: string,
  data: CrewlistFormData
): Promise<string> {
  const { data: row, error } = await supabase
    .from("crewlists")
    .insert({
      user_id: userId,
      name: data.name,
      age_division: data.ageDivision,
      size: data.size,
      category: data.category,
      member_ids: [],
    })
    .select("id")
    .single();

  if (error) throw error;
  return row.id as string;
}

export async function updateCrewlist(
  userId: string,
  crewlistId: string,
  updates: Partial<CrewlistFormData> & { memberIds?: string[] }
): Promise<void> {
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.ageDivision !== undefined) payload.age_division = updates.ageDivision;
  if (updates.size !== undefined) payload.size = updates.size;
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.memberIds !== undefined) payload.member_ids = updates.memberIds;

  const { error } = await supabase
    .from("crewlists")
    .update(payload)
    .eq("user_id", userId)
    .eq("id", crewlistId);

  if (error) throw error;
}

export async function deleteCrewlist(
  userId: string,
  crewlistId: string
): Promise<void> {
  await deleteConfigsByCrewlistId(userId, crewlistId);
  const { error } = await supabase
    .from("crewlists")
    .delete()
    .eq("user_id", userId)
    .eq("id", crewlistId);

  if (error) throw error;
}
