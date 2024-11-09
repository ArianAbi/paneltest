"use client";

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { Toaster } from "@/Components/ui/toaster";
import { createContext, useEffect, useState } from "react";
import { createClient } from "@/util/supabase/SupabaseClient";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const RoleContext = createContext<"user" | "admin" | undefined | null>(
  undefined
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [role, setRole] = useState<"user" | "admin" | undefined | null>(
    undefined
  );
  const [user, setUser] = useState<null | any>(null);
  const supabase = createClient();

  useEffect(() => {
    const getCurrentUserRole = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setRole(null);
        return;
      }

      setUser(session.user);

      const { data: _role_data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (!_role_data) {
        setRole(undefined);
        return;
      }

      setRole(_role_data.role);
    };

    getCurrentUserRole();
  }, []);

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-svh prose prose-invert prose-img:my-0 prose-a:no-underline max-w-full`}
      >
        <RoleContext.Provider value={role}>
          <Header user={user} />
          <main className="py-8 w-full">{children}</main>
          <Toaster />
          <Footer />
        </RoleContext.Provider>
      </body>
    </html>
  );
}
