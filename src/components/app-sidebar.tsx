"use client";

import { Clipboard } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import pkg from "../../package.json";

const mainItems = [
  {
    title: "Orders",
    url: "/review/orders",
    icon: Clipboard,
  },
];

// const imageTaskItems = [
//   {
//     title: "Image Review",
//     url: "#",
//     icon: Image,
//   },
// ];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>MAIN</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* <SidebarGroup>
          <SidebarGroupLabel>IMAGE TASKS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {imageTaskItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>
      <SidebarFooter>
        <div className="text-center text-[0.6rem] text-gray-500">
          © {new Date().getFullYear()} Parallel Laboratories LLC. v
          {pkg.version}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
