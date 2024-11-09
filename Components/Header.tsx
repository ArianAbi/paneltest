"use client";

import { signOutAction } from "@/util/actions/GeneralActions";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Header({ user }: { user: any }) {
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
