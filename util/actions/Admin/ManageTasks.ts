"use server";

import { createClient } from "@/util/supabase/SupabaseServer";
import { revalidatePath } from "next/cache";

export async function addTaskAction(
  project_id: string,
  title: string,
  priority: any,
  deadline: any,
  department: string,
  assigend_to: string,
  status: any,
  description: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("tasks").insert({
    title: title,
    priority: priority,
    deadline: deadline,
    department: department,
    assigend_to: assigend_to,
    status: status,
    project_id: project_id,
    description: description,
  });

  if (error) {
    throw error.message;
  }

  revalidatePath("/admin/manage-projects/tasks/");
}

// export async function deleteDeparmentAction(id: string) {
//   const supabase = await createClient();

//   const { error } = await supabase.from("department").delete().eq("id", id);

//   if (error) {
//     throw error.message;
//   }

//   revalidatePath("admin/manage-departments");
// }
