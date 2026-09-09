import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Crewlist, CrewlistFormData } from "../types/crewlist";
import { deleteConfigsByCrewlistId } from "./configs";

const CREWLISTS = "crewlists";
const USERS = "users";

function crewlistsRef(userId: string) {
  return collection(db, USERS, userId, CREWLISTS);
}

function crewlistRef(userId: string, crewlistId: string) {
  return doc(db, USERS, userId, CREWLISTS, crewlistId);
}

export function getCrewlists(
  userId: string,
  onUpdate: (lists: Crewlist[]) => void
): Unsubscribe {
  const q = query(crewlistsRef(userId), orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const lists: Crewlist[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name ?? "",
        ageDivision: data.ageDivision ?? "",
        size: data.size ?? "standard",
        category: data.category ?? "open",
        memberIds: Array.isArray(data.memberIds) ? data.memberIds : [],
        createdAt: data.createdAt,
      };
    });
    onUpdate(lists);
  });
}

export async function getCrewlistById(
  userId: string,
  crewlistId: string
): Promise<Crewlist | null> {
  const snap = await getDoc(crewlistRef(userId, crewlistId));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    name: data.name ?? "",
    ageDivision: data.ageDivision ?? "",
    size: data.size ?? "standard",
    category: data.category ?? "open",
    memberIds: Array.isArray(data.memberIds) ? data.memberIds : [],
    createdAt: data.createdAt,
  };
}

export async function addCrewlist(
  userId: string,
  data: CrewlistFormData
): Promise<string> {
  const docRef = await addDoc(crewlistsRef(userId), {
    ...data,
    memberIds: [],
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateCrewlist(
  userId: string,
  crewlistId: string,
  updates: Partial<CrewlistFormData> & { memberIds?: string[] }
): Promise<void> {
  await updateDoc(crewlistRef(userId, crewlistId), updates);
}

export async function deleteCrewlist(
  userId: string,
  crewlistId: string
): Promise<void> {
  await deleteConfigsByCrewlistId(userId, crewlistId);
  await deleteDoc(crewlistRef(userId, crewlistId));
}

