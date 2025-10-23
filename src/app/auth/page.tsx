import { type Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/server/utils/auth";
import { LoginForm } from "~/app/auth/_components/login-form";
import { AuthBackground } from "~/app/auth/_components/auth-background";
import { getRedirectDestination } from "~/lib/redirect-utils-server";
import { getSanitizedHeaders } from "~/lib/sanitize-headers";

export const metadata: Metadata = {
  title: "Auth | Parallel",
  description: "Sign in/up to Parallel",
};

export default async function SignInPage() {
  // Get session server-side
  const session = await auth.api.getSession({
    headers: await getSanitizedHeaders(),
  });
  
  const headersList = await headers();

  // If user is signed in, check their status and redirect to the correct destination
  if (session?.user) {
    // Compute destination in a try/catch, but perform redirect outside the catch
    let destination: string | null = null;
    try {
      const userAgent = headersList.get("user-agent") || "";
      destination = await getRedirectDestination(session, "/auth", userAgent);
      console.log(`Auth page: User is authenticated, redirecting to ${destination}`);
    } catch (error) {
      console.error("Auth page: Error determining redirect destination:", error);
    }
    if (destination && destination !== "/auth") {
      redirect(destination);
    }
  }

  return (
    <div className="min-h-svh bg-[#C0C7D4] p-6 relative overflow-hidden">
      <AuthBackground />

      <div className="relative z-10 mx-auto max-w-md rounded-[5px] border border-[#00000020] bg-white p-6 shadow-sm">
        <div className="mb-6 text-left">
          <h1 className="font-['Inter'] text-2xl font-medium text-Parallel-Main">Sign in to continue</h1>
          <p className="text-[13px] text-[#a0a0a0]">We'll save your onboarding and photos to your account.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
