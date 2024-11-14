"use server";

import { redirect } from "next/navigation";
import { createClient } from "../supabase/SupabaseServer";

export const signInAction = async (email: string, password: string) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error.message;
  }

  redirect("/");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect("/");
};
