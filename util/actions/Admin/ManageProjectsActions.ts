"use server";

import { Database } from "@/database.types";
import { ProfilesType } from "@/types/user";
import { createClient } from "@/util/supabase/SupabaseServer";
import { createClientAdmin } from "@/util/supabase/SupabaseServerAdmin";
import { revalidatePath } from "next/cache";

// const t:Database["public"]["Tables"]["project"]["Insert"] = 0

interface ProjectData {
  department: string;
  deadline: any;
  leader: string;
  priority: string;
  started_at: any;
  title: string;
  desciption: string;
  members: string[];
}

export const createProjectAction = async (
  title: string,
  desciption: string,
  deadline: any,
  started_at: any,
  leader: string,
  department: string,
  members: string[],
  priority: string
) => {
  console.log(title);

  const supabase = await createClient();

  const { data: _project, error: _project_error } = await supabase
    .from("project")
    .insert({
      title: title,
      description: desciption,
      department: department,
      priority: priority as any,
      deadline: deadline,
      started_at: started_at,
      progress: 0,
      leader: leader,
    })
    .select("*")
    .single();

  if (_project_error) {
    throw _project_error.message;
  }
  if (!_project) {
    throw "failed to create the project";
  }

  const members_rows = members.map((member) => {
    return { project_id: _project.id, user_id: member, role_in_project: "" };
  });

  const { data: _project_members, error: _project_members_error } =
    await supabase.from("project_members").insert(members_rows);

  if (_project_members_error) {
    throw _project_members_error.message;
  }

  revalidatePath("/admin/manage-projects");
};
