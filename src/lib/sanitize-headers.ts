import { headers } from "next/headers";

/**
 * Returns sanitized headers that are safe to pass to better-auth and other libraries.
 * 
 * Some incoming headers (from browser extensions, proxies, or other sources) can contain 
 * non-ASCII characters (like Unicode character 8239 - Narrow No-Break Space) which cause
 * "Cannot convert argument to a ByteString" errors when cloned or manipulated.
 * 
 * This function extracts only the essential headers needed for authentication (cookie)
 * and returns a clean Headers object.
 * 
 * @returns A sanitized Headers object containing only safe, ASCII headers
 */
export async function getSanitizedHeaders(): Promise<Headers> {
  const incoming = await headers();
  const sanitized = new Headers();
  
  // Pass only the cookie header which is needed for session/auth
  const cookieHeader = incoming.get("cookie");
  if (cookieHeader) {
    sanitized.set("cookie", cookieHeader);
  }
  
  return sanitized;
}

/**
 * Synchronous version for use with NextRequest objects in API routes
 * 
 * @param headers - The Headers object from a NextRequest
 * @returns A sanitized Headers object
 */
export function sanitizeHeaders(headers: Headers): Headers {
  const sanitized = new Headers();
  
  // Pass only the cookie header which is needed for session/auth
  const cookieHeader = headers.get("cookie");
  if (cookieHeader) {
    sanitized.set("cookie", cookieHeader);
  }
  
  return sanitized;
}

