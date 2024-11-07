import { createClient } from "@/util/supabase/SupabaseServer";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <>
      <main className="container mx-auto my-4">
        <h2>Login to Proceed</h2>
      </main>
    </>
  );
}
