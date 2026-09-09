import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  orderBy,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Config, ConfigFormData, CrewLineup } from "../types/config";
import { getLineupRowCount } from "../types/config";

const CONFIGS = "configs";
const USERS = "users";

function configsRef(userId: string) {
  return collection(db, USERS, userId, CONFIGS);
}

function configRef(userId: string, configId: string) {
  return doc(db, USERS, userId, CONFIGS, configId);
}

function normalizeLineup(
  raw: { drummerId?: string | null; sweepId?: string | null; left?: (string | null)[]; right?: (string | null)[] } | undefined,
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

export async function getConfigById(userId: string, configId: string): Promise<Config | null> {
  const snap = await getDoc(configRef(userId, configId));
  if (!snap.exists()) return null;
  const data = snap.data();
  const size = (data.size ?? "standard") as "small" | "standard";
  const asIdList = (raw: unknown): string[] =>
    Array.isArray(raw) ? raw.filter((id): id is string => typeof id === "string") : [];
  const config: Config = {
    id: snap.id,
    crewlistId: data.crewlistId,
    name: data.name ?? "",
    ageDivision: data.ageDivision ?? "",
    size,
    category: data.category ?? "open",
    reservedHeat1Ids: asIdList(data.reservedHeat1Ids),
    reservedHeat2Ids: asIdList(data.reservedHeat2Ids),
    reservedFinalIds: asIdList(data.reservedFinalIds),
    createdAt: data.createdAt,
  };
  const norm = (raw: unknown) => (raw != null ? normalizeLineup(raw as CrewLineup, size) : undefined);
  config.lineupHeat1 = norm(data.lineupHeat1) ?? norm(data.lineup);
  config.lineupHeat2 = norm(data.lineupHeat2);
  config.lineupFinal = norm(data.lineupFinal);
  if (data.lineup != null) config.lineup = normalizeLineup(data.lineup, size);
  return config;
}

export function getConfigs(
  userId: string,
  onUpdate: (configs: Config[]) => void
): Unsubscribe {
  const q = query(
    configsRef(userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const configs: Config[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      const asIdList = (raw: unknown): string[] =>
        Array.isArray(raw) ? raw.filter((id): id is string => typeof id === "string") : [];
      return {
        id: docSnap.id,
        crewlistId: data.crewlistId,
        name: data.name ?? "",
        ageDivision: data.ageDivision ?? "",
        size: data.size ?? "standard",
        category: data.category ?? "open",
        reservedHeat1Ids: asIdList(data.reservedHeat1Ids),
        reservedHeat2Ids: asIdList(data.reservedHeat2Ids),
        reservedFinalIds: asIdList(data.reservedFinalIds),
        createdAt: data.createdAt,
      };
    });
    onUpdate(configs);
  });
}

export async function addConfig(userId: string, data: ConfigFormData): Promise<string> {
  const docRef = await addDoc(configsRef(userId), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
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
  await updateDoc(configRef(userId, configId), updates);
}

export async function deleteConfig(userId: string, configId: string): Promise<void> {
  await deleteDoc(configRef(userId, configId));
}

export async function deleteConfigsByCrewlistId(
  userId: string,
  crewlistId: string
): Promise<void> {
  const q = query(
    configsRef(userId),
    where("crewlistId", "==", crewlistId)
  );
  const snapshot = await getDocs(q);
  await Promise.all(snapshot.docs.map((d) => deleteDoc(configRef(userId, d.id))));
}
