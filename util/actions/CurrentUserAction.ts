"use server";

import { cache } from "react";
import { createClient } from "../supabase/SupabaseServer";
import { revalidateTag } from "next/cache";

const getCurrentUserAction = cache(async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw "not authorized";
  }

  const { data: _public_user, error: _public_user_error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!_public_user) {
    throw "failed to fetch the current user";
  }

  return _public_user;
});

async function revalidateCurrentUser() {
  revalidateTag("current-user");
}

export { getCurrentUserAction, revalidateCurrentUser };
