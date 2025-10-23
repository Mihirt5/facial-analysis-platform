"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "~/components/app-sidebar";
import {
  SIDEBAR_LOCALSTORAGE_KEY,
  SidebarInset,
  SidebarProvider,
} from "~/components/ui/sidebar";

export default function SidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [defaultOpen, setDefaultOpen] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only access localStorage on the client side
    const storedState = localStorage.getItem(SIDEBAR_LOCALSTORAGE_KEY);
    setDefaultOpen(storedState === "true");
    setIsLoaded(true);
  }, []);

  // Prevent hydration mismatch by not rendering until we've loaded the state
  if (!isLoaded) {
    return null;
  }
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
