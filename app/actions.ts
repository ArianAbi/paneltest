"use server";

import { createClient } from "@/util/supabase/SupabaseServer";
import { redirect } from "next/navigation";

export const signInAction = async (email: string, password: string) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error.message;
  }

  return redirect("/");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
};

export const signUpAction = async (
  name: string,
  email: string,
  password: string
) => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    throw error.message;
  }

  if (!data.user) {
    throw "failed to create user";
  }

  const { error: _profile_error } = await supabase
    .from("profiles")
    .insert({ id: data.user.id, name: name });

  if (_profile_error) {
    throw _profile_error.message;
  }
};
