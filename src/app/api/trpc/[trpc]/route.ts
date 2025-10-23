import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

import { env } from "~/env";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
export const runtime = "nodejs";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (req: NextRequest) => {
  // Build a minimal, ASCII-safe Headers object to avoid ByteString errors
  // Some incoming headers (from extensions or proxies) can contain non-ASCII characters
  // which will throw when passed to better-auth's session handler.
  const sanitized = new Headers();
  
  // Pass only required headers for auth/session resolution
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    sanitized.set("cookie", cookieHeader);
  }
  
  // Identify TRPC source for observability
  sanitized.set("x-trpc-source", "react");
  
  return createTRPCContext({
    headers: sanitized,
  });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : undefined,
  });

export { handler as GET, handler as POST };
