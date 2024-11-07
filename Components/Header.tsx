import { signOutAction } from "@/app/actions";
import { createClient } from "@/util/supabase/SupabaseServer";
import Link from "next/link";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <header className="h-[70px] border-b-2 border-edge px-5 py-2 flex justify-between items-center">
        <div>
          <Link
            className="border-2 h-full font-semibold border-gray-400 rounded-xl px-3 py-2 hover:bg-gray-100 hover:border-gray-100 hover:text-black transition-colors"
            href={"/login"}
          >
            Login
          </Link>

          {user && (
            <form className="inline" action={signOutAction}>
              <button
                type="submit"
                className="border-2 font-semibold border-gray-400 rounded-xl px-3 py-2 hover:bg-gray-100 hover:border-gray-100 hover:text-black transition-colors"
              >
                Logout
              </button>
            </form>
          )}
        </div>

        <span>LOGO</span>
      </header>
    </>
  );
}
