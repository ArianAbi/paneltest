import localFont from "next/font/local";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Toaster } from "@/app/components/ui/toaster";
import { createClient } from "@/util/supabase/SupabaseServer";
import { SidebarProvider, SidebarTrigger } from "@/app/components/ui/sidebar";
import { AppSidebar } from "@/app/components/ui/AppSidebar";
import { Tooltip, TooltipTrigger } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipProvider } from "@/app/components/ui/tooltip";
import TopLoader from "@/app/components/Toploader";
import AdminUsersListContext from "@/app/components/AdminUsersListContext";
import CurrectUserContext from "@/util/CurrentUserContext";
import { Database } from "@/database.types";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  let currenctUser:
    | undefined
    | null
    | Database["public"]["Tables"]["users"]["Row"] = undefined;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: _current_user } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (_current_user) {
      currenctUser = _current_user;
    } else {
      currenctUser = null;
    }
  } else {
    currenctUser = null;
  }

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-svh `}
      >
        <TopLoader />
        <TooltipProvider>
          <CurrectUserContext user={currenctUser}>
            <AdminUsersListContext>
              <Header user={currenctUser} />
              <SidebarProvider defaultOpen={false}>
                <AppSidebar user={currenctUser} />
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
          </CurrectUserContext>
        </TooltipProvider>
      </body>
    </html>
  );
}
