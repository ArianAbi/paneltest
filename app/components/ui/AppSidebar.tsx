"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/components/ui/sidebar";
import { Database } from "@/database.types";
import BuildingsIcon from "@/icons/Buildings";
import ComputerIcon from "@/icons/Computer";
import HomeIcon from "@/icons/Home";
import UserIcon from "@/icons/User";
import Link from "next/link";

export function AppSidebar({
  user,
}: {
  user: Database["public"]["Tables"]["users"]["Row"] | null;
}) {
  const adminItems = [
    {
      title: "Home",
      url: "/",
      icon: <HomeIcon />,
    },
    {
      title: "Manage Users",
      url: "/admin/manage-users",
      icon: <UserIcon />,
    },
    {
      title: "Manage Departments",
      url: "/admin/manage-departments",
      icon: <BuildingsIcon />,
    },
    {
      title: "Manage Projects",
      url: "/admin/manage-projects",
      icon: <ComputerIcon />,
    },
  ];

  const userItems = [
    {
      title: "Home",
      url: "/",
      icon: <HomeIcon />,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm">Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {user && user.role === "admin"
                ? adminItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          {item.icon && item.icon}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                : userItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          {item.icon && item.icon}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              {!user ||
                (user.role != "admin" &&
                  userItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
