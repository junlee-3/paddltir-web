import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Paddler, PaddlerFormData } from "../types/paddler";

const PADDLERS = "paddlers";
const USERS = "users";

function paddlersRef(userId: string) { //private helper - NOT exported
  return collection(db, USERS, userId, PADDLERS);
}

function paddlerRef(userId: string, paddlerId: string) { //private helper - NOT exported
  return doc(db, USERS, userId, PADDLERS, paddlerId);
}

export function getPaddlers( 
  userId: string,
  onUpdate: (paddlers: Paddler[]) => void
): Unsubscribe {
  const q = query(
    paddlersRef(userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const rawPaddlers = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name ?? "",
        weight: data.weight ?? 0,
        ergScore: data.ergScore ?? 0,
        preferredSide: data.preferredSide ?? "Left",
        gender: data.gender ?? "Male",
        seatPreference: data.seatPreference ?? "Stroke",
        role: data.role ?? "Paddler",
        createdAt: data.createdAt,
      };
    });

    const maxScore = Math.max(...rawPaddlers.map((p) => p.ergScore), 0);
    const paddlers: Paddler[] = rawPaddlers.map((p) => ({
      ...p,
      powerRatio: maxScore > 0 ? p.ergScore / maxScore : 0, //derived field
    }));

    onUpdate(paddlers);
  });
}

export async function addPaddler(userId: string, paddler: PaddlerFormData): Promise<string> {
  const docRef = await addDoc(paddlersRef(userId), {
    ...paddler,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updatePaddler(
  userId: string,
  paddlerId: string,
  updates: Partial<PaddlerFormData>
): Promise<void> {
  await updateDoc(paddlerRef(userId, paddlerId), updates);
}

export async function deletePaddler(userId: string, paddlerId: string): Promise<void> {
  await deleteDoc(paddlerRef(userId, paddlerId));
}

export async function deleteAllPaddlers(userId: string): Promise<void> {
  const snapshot = await getDocs(paddlersRef(userId));
  await Promise.all(snapshot.docs.map((d) => deleteDoc(paddlerRef(userId, d.id))));
}
