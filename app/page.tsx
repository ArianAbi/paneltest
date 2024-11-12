import { createClient } from "@/util/supabase/SupabaseServer";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // display another ui if user is not logged in
  if (!user) {
    return <h2>Login to Proceed</h2>;
  }

  const { data: users } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();
  return (
    <div>
      <h2>
        Welcome{" "}
        <span className="font-bold underline underline-offset-2">
          {users?.first_name}
        </span>
      </h2>
    </div>
  );
}
