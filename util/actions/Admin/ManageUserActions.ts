"use server";

import { ProfilesType } from "@/types/user";
import { createClientAdmin } from "@/util/supabase/SupabaseServerAdmin";
import { revalidatePath } from "next/cache";

export const AdminSignUpAction = async (
  first_name: string,
  last_name: string,
  phone: string,
  email: string,
  password: string,
  employeeType: ProfilesType["employeeType"]
) => {
  const supabase = await createClientAdmin();

  const { data: _create_auth_user_data, error: _create_auth_user_error } =
    await supabase.auth.admin.createUser({
      email: email,
      password: password,
      phone: phone,
      email_confirm: true,
      phone_confirm: true,
    });

  if (_create_auth_user_error) {
    console.log(_create_auth_user_error);

    throw _create_auth_user_error.message;
  }

  if (!_create_auth_user_data.user) {
    throw "failed to create user";
  }

  const { error: _create_public_user_error } = await supabase
    .from("users")
    .insert({
      id: _create_auth_user_data.user.id,
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone: phone,
      employeeType: employeeType,
    });

  if (_create_public_user_error) {
    console.log(_create_public_user_error);

    //if creating a public instance of a user fails delete it on the auth table
    supabase.auth.admin.deleteUser(_create_auth_user_data.user.id);

    throw _create_public_user_error.message;
  }

  revalidatePath("/admin/manage-user");
};

export const AdminDeleteAccount = async (id: string) => {
  const supabase = await createClientAdmin();

  // const { error: _delete_public_user_error } = await supabase
  //   .from("users")
  //   .delete()
  //   .eq("id", id);

  const { error: _delete_user_error } = await supabase.auth.admin.deleteUser(
    id
  );

  if (_delete_user_error) {
    console.log(_delete_user_error);

    throw _delete_user_error.message;
  }

  revalidatePath("/admin/manage-user");
};
