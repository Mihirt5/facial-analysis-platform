"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <Button onClick={handleSignOut} variant="outline" className="px-4 py-2">
      Sign Out
    </Button>
  );
}