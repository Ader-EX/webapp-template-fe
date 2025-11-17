"use client";

import type * as React from "react";
import { Users, Briefcase, FileText, LayoutDashboard, Settings } from "lucide-react";

import { Sidebar } from "@/components/ui/sidebar";
import {
  SidebarHeader as SidebarHeaderWrapper,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import ConditionalSidebarHeader from "./ConditionalSidebarHeader";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Users", url: "/users", icon: Users },
    { title: "Consulting Manager", url: "/consulting-manager", icon: Briefcase },
    { title: "Project Experience", url: "/project-experience", icon: FileText },
    // { title: "Settings", url: "/settings", icon: Settings },s
  ];

  const user = {
    name: "User",
    email: "user@example.com",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeaderWrapper>
        <ConditionalSidebarHeader />
      </SidebarHeaderWrapper>

      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
