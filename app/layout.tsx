"use client";

import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { createContext, useEffect, useState } from "react";
import { createClient } from "@/util/supabase/SupabaseClient";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/AppSidebar";
import { Tooltip, TooltipTrigger } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import TopLoader from "@/components/Toploader";
import AdminUsersListContext from "@/components/AdminUsersListContext";

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
        .from("users")
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-svh `}
      >
        <TopLoader />
        <TooltipProvider>
          <RoleContext.Provider value={role}>
            <AdminUsersListContext>
              <Header user={user} />
              <SidebarProvider defaultOpen={false}>
                <AppSidebar isAdmin={role === "admin" ? true : false} />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarTrigger className="ml-2" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <span>Menu</span>
                  </TooltipContent>
                </Tooltip>
                <div className="py-8 w-full prose prose-invert prose-img:my-0 prose-a:no-underline max-w-full">
                  <main className="container mx-auto">{children}</main>
                </div>
                <Toaster />
              </SidebarProvider>
              <Footer />
            </AdminUsersListContext>
          </RoleContext.Provider>
        </TooltipProvider>
      </body>
    </html>
  );
}
