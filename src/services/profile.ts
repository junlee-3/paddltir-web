import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { auth, storage } from "../firebase";

const MAX_FILE_SIZE_MB = 2;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export async function uploadProfilePhoto(
  userId: string,
  file: File
): Promise<void> {
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    throw new Error(`Image must be smaller than ${MAX_FILE_SIZE_MB}MB`);
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Image must be JPEG, PNG, GIF, or WebP");
  }

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `avatar_${Date.now()}.${ext}`;
  const storageRef = ref(storage, `users/${userId}/${filename}`);

  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("Not authenticated");
  }
  await updateProfile(currentUser, { photoURL: downloadURL });
}
