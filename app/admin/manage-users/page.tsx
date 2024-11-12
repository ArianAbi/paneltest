import { supabaseAdminClient } from "@/util/supabase/SupabaseClientAdmin";
import AdminCreateUser from "@/components/page/manage-user/AdminCreateUser";
import ManageUserTable from "@/components/page/manage-user/ManageUserTable";
import { createClient } from "@/util/supabase/SupabaseServer";

export default async function ManageUser() {
  const supabase = await createClient();

  const { data: _users, error: _users_error } = await supabase
    .from("users")
    .select("*");

  if (_users_error) {
    throw _users_error.message;
  }

  return (
    <>
      <main className="container mx-auto border border-edge2 rounded-xl p-6">
        <h3>Manage User's</h3>

        <AdminCreateUser />
        <ManageUserTable users={_users} />
      </main>
    </>
  );
}
