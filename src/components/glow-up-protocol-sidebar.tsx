"use client";

import { BarChart3, Settings, ScanEye, Sparkles, Eye, Bone, Droplets, Scissors } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "~/components/ui/sidebar";
import Link from "next/link";
import pkg from "../../package.json";
import Image from "next/image";

interface GlowUpProtocolSidebarProps {
  activeSubtab?: string | null;
}

const glowUpSubtabs = [
  { key: "eyes", label: "Eyes", icon: Eye },
  { key: "frame", label: "Frame", icon: Bone },
  { key: "skin", label: "Skin", icon: Droplets },
  { key: "hair", label: "Hair", icon: Scissors },
];

export function GlowUpProtocolSidebar({ activeSubtab }: GlowUpProtocolSidebarProps) {
  const pathname = usePathname();
  const isGlowUpProtocolActive = pathname === "/glow-up-protocol";

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader className="mb-2 pl-0">
            <div className="flex items-center space-x-1">
              <Image src="/icon.png" alt="Parallel" width={32} height={32} />
              <span className="">Parallel</span>
            </div>
          </SidebarHeader>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/analysis">
                  <SidebarMenuButton asChild isActive={pathname === "/analysis"}>
                    <span>
                      <BarChart3 />
                      <span>Analysis</span>
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/glow-up-protocol">
                  <SidebarMenuButton asChild isActive={isGlowUpProtocolActive}>
                    <span>
                      <Sparkles />
                      <span>Glow Up Protocol</span>
                    </span>
                  </SidebarMenuButton>
                </Link>
                {isGlowUpProtocolActive && (
                  <SidebarMenuSub>
                    {glowUpSubtabs.map((subtab) => {
                      const Icon = subtab.icon;
                      const isActive = activeSubtab === subtab.key;
                      return (
                        <SidebarMenuSubItem key={subtab.key}>
                          <Link href={`/glow-up-protocol?tab=${subtab.key}`}>
                            <SidebarMenuSubButton asChild isActive={isActive}>
                              <span>
                                <Icon className="h-4 w-4" />
                                <span>{subtab.label}</span>
                              </span>
                            </SidebarMenuSubButton>
                          </Link>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="cursor-not-allowed" disabled>
                  <ScanEye />
                  <span>Biometrics</span>
                  <span className="rounded-md bg-black/3 px-2 py-0.5 text-xs text-gray-500">
                    Coming soon
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/analysis/settings">
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/analysis/settings"}
                  >
                    <span>
                      <Settings />
                      <span>Settings</span>
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
