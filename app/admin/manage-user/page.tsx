import { supabaseAdminClient } from "@/util/supabase/SupabaseClientAdmin";
import AdminCreateUser from "@/Components/page/manage-user/AdminCreateUser";
import ManageUserTable from "@/Components/page/manage-user/ManageUserTable";

export default async function ManageUser() {
  const {
    data: { users },
    error: _user_error,
  } = await supabaseAdminClient.auth.admin.listUsers();

  const { data: _profiles, error: _profile_error } = await supabaseAdminClient
    .from("profiles")
    .select("*");

  if (_profile_error) {
    throw _profile_error.message;
  }

  const allUsers = users.map((user, _i) => {
    const relatedProfileIndex = _profiles.findIndex((value) => {
      return value.id === user.id;
    });
    return { user: user, profile: _profiles[relatedProfileIndex] };
  });

  return (
    <>
      <main className="container mx-auto border border-edge2 rounded-xl p-6">
        <h3>Manage User's</h3>

        <AdminCreateUser />
        <ManageUserTable user={allUsers} />
      </main>
    </>
  );
}
