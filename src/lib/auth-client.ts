import { createAuthClient } from "better-auth/react";
import { stripeClient } from "@better-auth/stripe/client";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "http://localhost:3002",
  plugins: [
    stripeClient({
      subscription: true,
    }),
  ],
});

// Production debugging for auth client
if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  console.log("[AUTH CLIENT] Base URL:", window.location.origin);
  console.log("[AUTH CLIENT] Full URL:", window.location.href);
}

export const signIn = async (callbackURL?: string) => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: callbackURL ?? "/mobile/onboarding",
  });
};

// Export hooks for client-side usage
export const { useSession } = authClient;

export const signOut = async () => {
  await authClient.signOut();
};
