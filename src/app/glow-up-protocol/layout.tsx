"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { GlowUpProtocolSidebar } from "~/components/glow-up-protocol-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { useIsMobile } from "~/hooks/use-mobile";

interface GlowUpProtocolLayoutProps {
  children: React.ReactNode;
}

// Component that uses useSearchParams - wrapped in Suspense
function SearchParamsProvider({
  children,
}: {
  children: (activeSubtab: string | null) => React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Determine active subtab based on current route and search params
  const activeSubtab =
    pathname === "/glow-up-protocol" ? searchParams.get("tab") : null;

  return <>{children(activeSubtab)}</>;
}

function GlowUpProtocolLayoutContent({ children }: GlowUpProtocolLayoutProps) {
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false);

  const localStorageKey = "glow_up_protocol_sidebar_state";

  const [defaultOpen, setDefaultOpen] = useState(true);

  useEffect(() => {
    // Only access localStorage on the client side
    const storedState = localStorage.getItem(localStorageKey);
    setDefaultOpen(storedState === "true");
  }, []);

  // Fix hydration mismatch by waiting for component to mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      }
    >
      <SearchParamsProvider>
        {(activeSubtab) => (
          <SidebarProvider
            defaultOpen={true}
            localStorageKey={localStorageKey}
          >
            {!isMobile && <GlowUpProtocolSidebar activeSubtab={activeSubtab} />}
            <SidebarInset>
              {isMobile && (
                <div className="sticky top-0 z-20 border-b border-gray-200 bg-white p-4">
                  <SidebarTrigger className="focus:ring-orange-primary inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:outline-none focus:ring-inset" />
                </div>
              )}
              <div className="bg-background-muted min-h-screen w-full">
                {children}
              </div>
            </SidebarInset>
            {isMobile && <GlowUpProtocolSidebar activeSubtab={activeSubtab} />}
          </SidebarProvider>
        )}
      </SearchParamsProvider>
    </Suspense>
  );
}

export default function GlowUpProtocolLayout({ children }: GlowUpProtocolLayoutProps) {
  return <GlowUpProtocolLayoutContent>{children}</GlowUpProtocolLayoutContent>;
}
