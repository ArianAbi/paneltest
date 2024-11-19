import localFont from "next/font/local";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Toaster } from "@/app/components/ui/toaster";
import { SidebarProvider, SidebarTrigger } from "@/app/components/ui/sidebar";
import { AppSidebar } from "@/app/components/ui/AppSidebar";
import { Tooltip, TooltipTrigger } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipProvider } from "@/app/components/ui/tooltip";
import TopLoader from "@/app/components/Toploader";
import AdminUsersListContext from "@/app/components/AdminUsersListContext";
import CurrectUserContextProvider from "@/util/CurrentUserContext";
import { getCurrentUserFromCookieAction } from "@/util/actions/CurrentUserAction";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import NotificationProvider from "./components/ContextProvider/Notification/NotificationProvider";

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
  const currenctUser = await getCurrentUserFromCookieAction();

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} md:pl-12 antialiased flex flex-col min-h-svh `}
      >
        <TopLoader />
        <TooltipProvider>
          <CurrectUserContextProvider user={currenctUser}>
            <AdminUsersListContext>
              <NotificationProvider>
                <Header user={currenctUser} />
              </NotificationProvider>

              <SidebarProvider defaultOpen={false}>
                <AppSidebar user={currenctUser} />

                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarTrigger className="ml-2 block md:hidden" />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <span>Menu</span>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="py-8 w-full prose prose-invert prose-img:my-0 prose-a:no-underline max-w-full">
                  <main className="container mx-auto">{children}</main>
                </div>
                <Toaster />
              </SidebarProvider>
              <Footer />
            </AdminUsersListContext>
          </CurrectUserContextProvider>
        </TooltipProvider>
        <div>
          <SonnerToaster />
        </div>
      </body>
    </html>
  );
}
