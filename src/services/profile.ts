import { supabase } from "../supabase";

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
  const path = `${userId}/${filename}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  const downloadURL = data.publicUrl;

  const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
  if (sessionError) throw sessionError;
  if (!sessionData.user) {
    throw new Error("Not authenticated");
  }

  const { error: updateError } = await supabase.auth.updateUser({
    data: { photo_url: downloadURL },
  });
  if (updateError) throw updateError;
}
