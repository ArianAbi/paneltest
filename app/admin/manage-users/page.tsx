import AdminCreateUser from "@/app/components/page/manage-user/AdminCreateUser";
import ManageUserTable from "@/app/components/page/manage-user/ManageUserTable";
import { createClient } from "@/util/supabase/SupabaseServer";

export default async function ManageUser() {
  const supabase = await createClient();

  const { data: _users, error: _users_error } = await supabase
    .from("users")
    .select("*")
    .order("role", { ascending: false })
    .order("first_name");

  if (_users_error) {
    throw _users_error.message;
  }

  return (
    <>
      <main className="container mx-auto border border-edge2 rounded-xl p-6">
        <h3>Manage User&apos;s</h3>

        <AdminCreateUser />
        <ManageUserTable users={_users} />
      </main>
    </>
  );
}
