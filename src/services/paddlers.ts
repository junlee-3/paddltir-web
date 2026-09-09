import { supabase } from "../supabase";
import type { Paddler, PaddlerFormData } from "../types/paddler";

export type Unsubscribe = () => void;

type PaddlerRow = {
  id: string;
  user_id: string;
  name: string;
  weight: number;
  erg_score: number;
  preferred_side: string;
  gender: string;
  seat_preference: string;
  role: string;
  created_at: string;
};

function mapRow(row: PaddlerRow): Omit<Paddler, "powerRatio"> {
  return {
    id: row.id,
    name: row.name ?? "",
    weight: row.weight ?? 0,
    ergScore: row.erg_score ?? 0,
    preferredSide: (row.preferred_side as Paddler["preferredSide"]) ?? "Left",
    gender: (row.gender as Paddler["gender"]) ?? "Male",
    seatPreference: (row.seat_preference as Paddler["seatPreference"]) ?? "Stroke",
    role: (row.role as Paddler["role"]) ?? "Paddler",
    createdAt: row.created_at,
  };
}

function withPowerRatio(raw: Omit<Paddler, "powerRatio">[]): Paddler[] {
  const maxScore = Math.max(...raw.map((p) => p.ergScore), 0);
  return raw.map((p) => ({
    ...p,
    powerRatio: maxScore > 0 ? p.ergScore / maxScore : 0,
  }));
}

async function fetchPaddlers(userId: string): Promise<Paddler[]> {
  const { data, error } = await supabase
    .from("paddlers")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return withPowerRatio((data as PaddlerRow[] | null)?.map(mapRow) ?? []);
}

export function getPaddlers(
  userId: string,
  onUpdate: (paddlers: Paddler[]) => void
): Unsubscribe {
  let cancelled = false;

  const emit = async () => {
    try {
      const paddlers = await fetchPaddlers(userId);
      if (!cancelled) onUpdate(paddlers);
    } catch (err) {
      console.error("getPaddlers", err);
    }
  };

  void emit();

  const channel = supabase
    .channel(`paddlers:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "paddlers",
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

export async function addPaddler(userId: string, paddler: PaddlerFormData): Promise<string> {
  const { data, error } = await supabase
    .from("paddlers")
    .insert({
      user_id: userId,
      name: paddler.name,
      weight: paddler.weight,
      erg_score: paddler.ergScore,
      preferred_side: paddler.preferredSide,
      gender: paddler.gender,
      seat_preference: paddler.seatPreference,
      role: paddler.role,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
}

export async function updatePaddler(
  userId: string,
  paddlerId: string,
  updates: Partial<PaddlerFormData>
): Promise<void> {
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.weight !== undefined) payload.weight = updates.weight;
  if (updates.ergScore !== undefined) payload.erg_score = updates.ergScore;
  if (updates.preferredSide !== undefined) payload.preferred_side = updates.preferredSide;
  if (updates.gender !== undefined) payload.gender = updates.gender;
  if (updates.seatPreference !== undefined) payload.seat_preference = updates.seatPreference;
  if (updates.role !== undefined) payload.role = updates.role;

  const { error } = await supabase
    .from("paddlers")
    .update(payload)
    .eq("user_id", userId)
    .eq("id", paddlerId);

  if (error) throw error;
}

export async function deletePaddler(userId: string, paddlerId: string): Promise<void> {
  const { error } = await supabase
    .from("paddlers")
    .delete()
    .eq("user_id", userId)
    .eq("id", paddlerId);

  if (error) throw error;
}

export async function deleteAllPaddlers(userId: string): Promise<void> {
  const { error } = await supabase.from("paddlers").delete().eq("user_id", userId);
  if (error) throw error;
}
