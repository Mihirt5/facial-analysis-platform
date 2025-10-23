import { auth } from "~/server/utils/auth";
import { toNextJsHandler } from "better-auth/next-js";
export const runtime = "nodejs";

// Wrap better-auth handler to sanitize headers in production
const { GET: rawGET, POST: rawPOST } = toNextJsHandler(auth);

function sanitizeAuthRequestHeaders(incoming: Headers): Headers {
  const h = new Headers();
  // Only include strictly necessary, ASCII-safe headers.
  const cookie = incoming.get("cookie");
  if (cookie) h.set("cookie", cookie);
  const ct = incoming.get("content-type");
  if (ct) h.set("content-type", ct);
  return h;
}

export async function GET(req: Request) {
  const sanitized = sanitizeAuthRequestHeaders(req.headers);
  const wrapped = new Request(req.url, { method: "GET", headers: sanitized });
  return rawGET(wrapped as any);
}

export async function POST(req: Request) {
  const body = await req.arrayBuffer();
  const sanitized = sanitizeAuthRequestHeaders(req.headers);
  const wrapped = new Request(req.url, {
    method: "POST",
    headers: sanitized,
    body,
  });
  return rawPOST(wrapped as any);
}
