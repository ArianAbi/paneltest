"use server";

import { createClient } from "@/util/supabase/SupabaseServer";
import { redirect } from "next/navigation";

export const signInAction = async (email: string, password: string) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // if (error) {
  //   return encodedRedirect("error", "/sign-in", error.message);
  // }

  return redirect("/");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
};
