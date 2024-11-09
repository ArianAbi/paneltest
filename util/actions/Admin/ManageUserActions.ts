"use server";

import { ProfilesType } from "@/types/user";
import { createClientAdmin } from "@/util/supabase/SupabaseServerAdmin";
import { revalidatePath } from "next/cache";

export const AdminSignUpAction = async (
  name: string,
  email: string,
  password: string,
  employeeType: ProfilesType["employeeType"]
) => {
  const supabase = await createClientAdmin();

  const { data: _create_user_data, error: _create_user_error } =
    await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        name: name,
        role: "user",
      },
    });

  if (_create_user_error) {
    console.log(_create_user_error);

    throw _create_user_error.message;
  }

  if (!_create_user_data.user) {
    throw "failed to create user";
  }

  const { error: _create_profile_error } = await supabase
    .from("profiles")
    .insert({
      id: _create_user_data.user.id,
      name: name,
      employeeType: employeeType,
    });

  if (_create_profile_error) {
    console.log(_create_profile_error);

    throw _create_profile_error.message;
  }

  revalidatePath("/admin/manage-user");
};

export const AdminDeleteAccount = async (id: string) => {
  const supabase = await createClientAdmin();

  const { error: _delete_profile_error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", id);
  const { error: _delete_user_error } = await supabase.auth.admin.deleteUser(
    id
  );

  if (_delete_user_error) {
    console.log(_delete_user_error);

    throw _delete_user_error.message;
  }

  revalidatePath("/admin/manage-user");

  console.log("im called form end");
};
