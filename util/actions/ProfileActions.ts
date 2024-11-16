"use server";

import { createClient } from "../supabase/SupabaseServer";
import { revalidateCurrentUser } from "./CurrentUserAction";

export const uploadProfilePictureAction = async (
  user_id: string,
  path: string,
  file: File,
  base64: string
) => {
  const supabase = await createClient();

  const { data: _prev_file_path } = await supabase
    .from("users")
    .select("*")
    .eq("id", user_id)
    .single();

  if (_prev_file_path?.profile_picture_path) {
    const { data: _delete_data, error: _delete_error } = await supabase.storage
      .from("profile_pictures")
      .remove([_prev_file_path.profile_picture_path]);
  }

  const { data, error } = await supabase.storage
    .from("profile_pictures")
    .upload(path, file);

  if (error) {
    throw error.message;
  }

  if (data) {
    await supabase
      .from("users")
      .update({
        profile_base64_img: base64,
        profile_picture_path: data.path,
      })
      .eq("id", user_id);

    revalidateCurrentUser();
  }
};

export const updateFirstAndLastname = async (
  user_id: string,
  first_name: string,
  last_name: string
) => {
  const supabase = await createClient();

  await supabase
    .from("users")
    .update({
      first_name: first_name,
      last_name: last_name,
    })
    .eq("id", user_id);

  revalidateCurrentUser();
};
