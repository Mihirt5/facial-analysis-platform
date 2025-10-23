"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { AnalysisSidebar } from "~/components/analysis-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { useIsMobile } from "~/hooks/use-mobile";
import { authClient } from "~/lib/auth-client";
import { api } from "~/trpc/react";

interface AnalysisLayoutProps {
  children: React.ReactNode;
}

// Component that uses useSearchParams - wrapped in Suspense
function SearchParamsProvider({
  children,
}: {
  children: (activeSubtab: string | null) => React.ReactNode;
}) {
  // Stabilize initial render to avoid hook-order/hydration issues
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Determine active subtab based on current route and search params
  const activeSubtab =
    pathname === "/analysis" ? searchParams.get("tab") : null;

  if (!mounted) return null;
  return <>{children(activeSubtab)}</>;
}

function AnalysisLayoutContent({ children }: AnalysisLayoutProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false);
  const {
    data: session,
    isPending: isSessionLoading,
    error: sessionError,
  } = authClient.useSession();
  const { data: isSubscribed, isPending: isSubscribedLoading } =
    api.subscription.isSubscribed.useQuery();

  // Fix hydration mismatch by waiting for component to mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auth check - redirect to auth if not authenticated
  useEffect(() => {
    // Wait for session to load and component to mount
    if (isSessionLoading || isSubscribedLoading || !isMounted) return;

    // Handle session errors or no session
    if (sessionError || !session?.user) {
      router.push("/auth");
      return;
    }

    // Redirect to pricing if not subscribed
    // We have this guard seperate as to not fetch isSubscribed (a protected route)
    if (!isSubscribed) {
      router.push("/pricing");
      return;
    }
  }, [
    session,
    sessionError,
    isSessionLoading,
    isSubscribedLoading,
    isSubscribed,
    isMounted,
    router,
  ]);

  // Don't render until mounted and authenticated to prevent hydration mismatch
  if (!isMounted || isSessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authentication required message if no session
  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <div className="w-8 h-8 text-blue-600">🔐</div>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Authentication Required</h1>
            <p className="text-gray-600 leading-relaxed">
              Please log in to access your analysis.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push("/auth")}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Don't render content if not authenticated (will redirect)
  if (sessionError || !session?.user) {
    return null;
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
          <SidebarProvider open={true}>
            {!isMobile && <AnalysisSidebar activeSubtab={activeSubtab} />}
            <SidebarInset>
              {isMobile && (
                <div className="sticky top-0 z-20 border-b border-gray-200 bg-white p-4">
                  <SidebarTrigger className="focus:ring-orange-primary inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:outline-none focus:ring-inset" />
                </div>
              )}
              <div className="min-h-screen w-full bg-[#fafafa]">
                {children}
              </div>
            </SidebarInset>
            {isMobile && <AnalysisSidebar activeSubtab={activeSubtab} />}
          </SidebarProvider>
        )}
      </SearchParamsProvider>
    </Suspense>
  );
}

export default function AnalysisLayout({ children }: AnalysisLayoutProps) {
  return <AnalysisLayoutContent>{children}</AnalysisLayoutContent>;
}
