import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "~/server/utils/auth";
import { getSanitizedHeaders } from "~/lib/sanitize-headers";
import { api } from "~/trpc/server";
import { getRedirectDestination } from "~/lib/redirect-utils-server";
import CreateAnalysisClient from "./_components/create-analysis-client";

export const metadata: Metadata = {
  title: "Create Analysis | Parallel",
  description: "Upload photos for facial analysis",
};

export default async function CreateAnalysisPage() {
  // Get session server-side
  const session = await auth.api.getSession({
    headers: await getSanitizedHeaders(),
  });

  // Determine the correct destination upfront to prevent any content from showing
  let destination: string | null = null;
  try {
    destination = await getRedirectDestination(session);
  } catch (error) {
    console.error("Error determining redirect destination (create-analysis):", error);
  }
  
  // If user should be somewhere else, redirect there immediately
  if (destination && destination !== "/create-analysis") {
    console.log(`Create analysis page: redirecting to ${destination}`);
    redirect(destination);
  }

  // User is authenticated, subscribed, and should be on this page
  return <CreateAnalysisClient />;
}
