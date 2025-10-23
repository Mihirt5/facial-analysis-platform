"use client";

import {
  BarChart3,
  Settings,
  ScanEye,
  ScanFace,
  Sparkles,
  Eye,
  Square,
  Skull,
  Droplets,
  List,
  HelpCircle,
  ChevronDown,
  Smile,
  Wind,
  Speaker,
  Bone,
  Scissors,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
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
import { ANALYSIS_STRUCTURE } from "~/lib/analysis-structure";
import { useIsMobile } from "~/hooks/use-mobile";

interface AnalysisSidebarProps {
  activeSubtab?: string | null;
}

const subtabIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  overview: BarChart3,
  brow_eye: Eye,
  nose: Wind,
  lips_mouth: Smile,
  cheeks_midface: ScanFace,
  jaw_chin: Skull,
  ears: Speaker,
  skin_texture: Droplets,
  hairline_forehead: Square,
};

export function AnalysisSidebar({ activeSubtab }: AnalysisSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(false);
  const isMobile = useIsMobile();

  const isOnAnalysisPage = pathname === "/analysis";

  // Auto-expand when navigating to analysis page
  useEffect(() => {
    if (isOnAnalysisPage) {
      setIsAnalysisExpanded(true);
    }
  }, [isOnAnalysisPage]);

  // Default to first tab if no active subtab
  const effectiveActiveSubtab = activeSubtab ?? ANALYSIS_STRUCTURE[0]?.key;

  const handleSubtabClick = (subtabKey: string) => {
    router.push(`/analysis?tab=${subtabKey}`);
  };

  const toggleAnalysisExpanded = () => {
    setIsAnalysisExpanded(!isAnalysisExpanded);
  };

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
                {isOnAnalysisPage && !isMobile && (
                  <SidebarMenuSub>
                    {ANALYSIS_STRUCTURE.map((subtab) => {
                      const Icon = subtabIconMap[subtab.key] || List;
                      const isActive = effectiveActiveSubtab === subtab.key;
                      return (
                        <SidebarMenuSubItem key={subtab.key}>
                          <Link href={`/analysis?tab=${subtab.key}`}>
                            <SidebarMenuSubButton asChild isActive={isActive}>
                              <span>
                                <Icon className="h-4 w-4" />
                                <span>{subtab.name}</span>
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
                <SidebarMenuButton className="cursor-not-allowed opacity-50" disabled>
                  <Sparkles />
                  <span>Glow Up Protocol</span>
                  <span className="rounded-md bg-black/3 px-2 py-0.5 text-xs text-gray-500">
                    Coming Soon
                  </span>
                </SidebarMenuButton>
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
