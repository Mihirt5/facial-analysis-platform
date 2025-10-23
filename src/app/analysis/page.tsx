import { type Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/server/utils/auth";
import { api } from "~/trpc/server";
import { getRedirectDestination } from "~/lib/redirect-utils-server";
import { getSanitizedHeaders } from "~/lib/sanitize-headers";
import AnalysisClient from "./_components/analysis-client";

export const metadata: Metadata = {
  title: "Analysis | Parallel",
  description: "View your facial analysis results",
};

export const dynamic = "force-dynamic";

export default async function AnalysisPage() {
  // Get session server-side
  const session = await auth.api.getSession({
    headers: await getSanitizedHeaders(),
  });
  
  // Get user agent for device detection
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";

  // Determine the correct destination upfront to prevent any content from showing
  let destination: string | null = null;
  try {
    destination = await getRedirectDestination(session, "/analysis", userAgent);
  } catch (error) {
    console.error("Error determining redirect destination (analysis page):", error);
  }
  
  // If user should be somewhere else, redirect there immediately
  if (destination && destination !== "/analysis") {
    console.log(`Analysis page: redirecting to ${destination}`);
    redirect(destination);
  }

  // User is authenticated, subscribed, and should be on this page
  return <AnalysisClient />;
}
