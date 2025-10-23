import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { headers } from "next/headers";
import { cache } from "react";

import { createCaller, type AppRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { createQueryClient } from "./query-client";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  // Build a minimal, ASCII-safe Headers object to avoid ByteString errors
  // Some incoming headers (from extensions or proxies) can contain non-ASCII characters
  // which will throw when cloning via `new Headers(await headers())`.
  const incoming = await headers();
  const sanitized = new Headers();

  // Pass only required headers for auth/session resolution
  const cookieHeader = incoming.get("cookie");
  if (cookieHeader) {
    sanitized.set("cookie", cookieHeader);
  }

  // Identify TRPC source for observability
  sanitized.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: sanitized,
  });
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient
);
