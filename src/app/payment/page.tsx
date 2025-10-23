import { type Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { auth } from "~/server/utils/auth";
import { api } from "~/trpc/server";
import { getRedirectDestination } from "~/lib/redirect-utils-server";
import { getSanitizedHeaders } from "~/lib/sanitize-headers";
import { BackButton, LogoutButton } from "./_components/payment-buttons";
import Paywall from "./Paywall";
import LandingPaywall from "./LandingPaywall";

export const metadata: Metadata = {
  title: "Payment | Parallel",
  description: "Payment for Parallel",
};

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ fromOnboarding?: string }>;
}) {
  const params = await searchParams;
  
  // Get session server-side
  const session = await auth.api.getSession({
    headers: await getSanitizedHeaders(),
  });

  // If user is coming from onboarding completion, skip redirect logic
  if (params.fromOnboarding === "true") {
    return <LandingPaywall />;
  }

  // Determine the correct destination upfront to prevent redirect loops
  const destination = await getRedirectDestination(session);
  
  // If user should be somewhere else, redirect there
  if (destination !== "/payment") {
    redirect(destination);
  }

  return <LandingPaywall />;
}
