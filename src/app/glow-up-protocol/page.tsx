import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { auth } from "~/server/utils/auth";
import GlowUpProtocolClient from "./_components/glow-up-protocol-client";
import { getSanitizedHeaders } from "~/lib/sanitize-headers";

export const metadata: Metadata = {
  title: "Glow Up Protocol | Parallel",
  description: "Your personalized analysis and morph transformation journey",
};

export default async function GlowUpProtocolPage() {
  // Get session on server side
  const session = await auth.api.getSession({
    headers: await getSanitizedHeaders(),
  });

  // Redirect if not authenticated
  if (!session?.user) {
    redirect("/auth");
  }

  // Note: Glow up protocol is now available to all authenticated users
  // No admin access check required

  return <GlowUpProtocolClient />;
}
