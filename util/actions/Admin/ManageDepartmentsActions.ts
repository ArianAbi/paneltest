"use server";

import { createClient } from "@/util/supabase/SupabaseServer";
import { revalidatePath } from "next/cache";

export async function createDepartmentAction(name: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("department")
    .insert({ name: name });

  if (error) {
    throw error.message;
  }

  revalidatePath("admin/manage-departments");
}

export async function deleteDeparmentAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("department").delete().eq("id", id);

  if (error) {
    throw error.message;
  }

  revalidatePath("admin/manage-departments");
}
