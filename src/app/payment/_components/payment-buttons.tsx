"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export function CheckoutButton({ label = "Checkout - $19" }: { label?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Pre-check status so we can route subscribed users immediately
  const { data: subscriptionStatus } = api.subscription.isSubscribed.useQuery();
  const { data: existingAnalysis } = api.analysis.getFirstAnalysis.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Allow refetch on mount to get fresh data
  });

  const destinationForSubscribed = existingAnalysis?.id ? "/analysis" : "/create-analysis";

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);

      // If already subscribed (per DB), route to the right page
      if (subscriptionStatus?.isSubscribed) {
        window.location.href = destinationForSubscribed;
        return;
      }

      const origin = typeof window !== "undefined" ? window.location.origin : "";

      // Otherwise, initiate Stripe checkout (Better Auth client) with absolute URLs
      console.log("🔍 Payment Debug - Initiating subscription upgrade:", {
        plan: "basic",
        successUrl: `${origin}${destinationForSubscribed}`,
        cancelUrl: `${origin}/payment`,
        currentSubscriptionStatus: subscriptionStatus
      });
      
      await authClient.subscription.upgrade({
        plan: "basic",
        successUrl: `${origin}${destinationForSubscribed}`,
        cancelUrl: `${origin}/payment`,
      });
    } catch (error: unknown) {
      // If Stripe/better-auth reports an existing subscription or no-change, route accordingly
      const message = error instanceof Error ? error.message : String(error);
      
      console.error("🔍 Payment Debug - Subscription upgrade error:", {
        error: error,
        message: message,
        subscriptionStatus: subscriptionStatus,
        errorType: error instanceof Error ? error.constructor.name : typeof error
      });
      
      if (
        message.includes("no changes to confirm") ||
        message.includes("Cannot update the subscription") ||
        message.includes("No such customer") ||
        message.includes("resource_missing")
      ) {
        // Clear the session cache and redirect to force a fresh session
        console.log("Clearing session cache due to invalid Stripe customer ID");
        
        try {
          // Try to clear the Stripe customer data from the server
          await fetch("/api/auth/subscription/clear-stripe-data", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (clearError) {
          console.log("Failed to clear Stripe data:", clearError);
        }
        
        await authClient.signOut();
        // Redirect to onboarding to get a fresh session
        window.location.href = "/mobile/onboarding";
        return;
      }

      console.error("Error initiating Stripe checkout:", error);
      alert("There was an error processing your subscription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="w-full bg-gradient-to-r from-[#4a4a4a] via-[#8a8a8a] to-[#4a4a4a] text-white border-0 hover:from-[#5a5a5a] hover:via-[#9a9a9a] hover:to-[#5a5a5a] transition-all duration-200 py-3 rounded-lg font-medium disabled:opacity-50"
      onClick={handleSubscribe}
      disabled={isLoading}
    >
      {isLoading ? "Processing..." : label}
    </Button>
  );
}

export function LogoutButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="w-full text-sm"
      onClick={async () => {
        await authClient.signOut();
        router.push("/auth");
      }}
    >
      Wrong account? Logout
    </Button>
  );
}

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="w-full text-sm"
      onClick={() => router.push("/")}
    >
      ← Go back to home
    </Button>
  );
}
