import { signOutAction } from "@/app/actions";
import { createClient } from "@/util/supabase/SupabaseServer";
import { Button } from "./ui/button";
import { buttonVariants } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Link from "next/link";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <header className="h-[70px] border-b-2 border-edge px-5 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {!user && (
            <>
              <Button className="font-semibold" asChild>
                <Link href={"/login"}>Login</Link>
              </Button>
              <Button variant={"ghost"} className="font-semibold">
                <Link href={"/register"}>Register</Link>
              </Button>
            </>
          )}

          {user && (
            <form className="inline border-none" action={signOutAction}>
              <Button
                type="submit"
                className="border-2 font-semibold border-gray-400 rounded-xl px-3 h-full hover:bg-gray-100 hover:border-gray-100 hover:text-black transition-colors"
              >
                Logout
              </Button>
            </form>
          )}
        </div>

        <span>LOGO</span>
      </header>
    </>
  );
}
