"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import { env } from "~/env";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const apiHost = process.env.NODE_ENV === "production" ? "https://us.i.posthog.com" : "/ingest";
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: apiHost,
      ui_host: "https://us.posthog.com",
      defaults: "2025-05-24",
      capture_exceptions: true,
      debug: process.env.NODE_ENV === "development",
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
