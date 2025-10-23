import { NextResponse, type NextRequest } from "next/server";

// Simple mobile user-agent detection suitable for routing decisions
function isMobileUA(ua: string | null): boolean {
  if (!ua) return false;
  const s = ua.toLowerCase();
  return /iphone|ipad|ipod|android|blackberry|windows phone|opera mini|mobile/.test(s);
}

function buildSanitizedRequestHeaders(req: NextRequest): Headers {
  const headers = new Headers();
  // Copy only headers with strictly Latin-1/ASCII values to avoid ByteString errors
  const isLatin1 = (s: string) => {
    for (let i = 0; i < s.length; i++) {
      const code = s.charCodeAt(i);
      if (code > 255) return false;
    }
    return true;
  };

  // Prefer a minimal allowlist but also retain any safe headers dynamically
  req.headers.forEach((value, key) => {
    if (value && isLatin1(value)) {
      headers.set(key, value);
    }
  });

  // Always forward cookie if present (ASCII-safe by spec)
  const cookie = req.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);

  return headers;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const ua = req.headers.get("user-agent");
  const isMobile = isMobileUA(ua);
  const sanitizedHeaders = buildSanitizedRequestHeaders(req);

  // Landing entry points to consider
  const landingEntrypoints = new Set(["/", "/tt", "/yt", "/ig"]);

  // Mobile-only onboarding and mobile-only dashboard steps
  const isMobileOnlyRoute =
    pathname.startsWith("/onboarding/") ||
    pathname.startsWith("/mobile/onboarding") ||
    pathname.startsWith("/mobile/signup") ||
    pathname.startsWith("/mobile/login") ||
    pathname === "/analysis-user-dashboard-mobile" ||
    pathname === "/analysis-user-dashboard-mobile1" ||
    pathname === "/analysis-user-dashboard-mobile2" ||
    pathname === "/analysis-user-dashboard-mobile3" ||
    pathname === "/analysis-user-dashboard-mobile4" ||
    pathname === "/analysis-user-dashboard-mobile5";

  // Allow both mobile and desktop users on /create-analysis
  // The page itself is responsive and works for both

  // If user lands on mobile page from desktop, send to desktop landing
  if (pathname === "/mobile" && !isMobile) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // If user lands on desktop landing (or tt/yt/ig) from mobile, send to mobile landing
  if (landingEntrypoints.has(pathname) && isMobile) {
    const url = req.nextUrl.clone();
    url.pathname = "/mobile";
    return NextResponse.redirect(url);
  }

  // Prevent desktop users from accessing mobile-only onboarding flow
  // EXCEPT allow desktop users to access mobile onboarding (it's responsive)
  if (isMobileOnlyRoute && !isMobile && pathname !== "/mobile/onboarding") {
    const url = req.nextUrl.clone();
    // Send desktop users to classic auth flow; old flow begins at /auth
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  // Pass through sanitized headers to all subsequent route handlers
  return NextResponse.next({ request: { headers: sanitizedHeaders } });
}

// Only run on the marketing landing routes
export const config = {
  matcher: [
    "/",
    "/mobile",
    "/mobile/onboarding",
    "/create-analysis",
    "/tt",
    "/yt",
    "/ig",
    "/onboarding/:path*",
    "/analysis-user-dashboard-mobile",
    "/analysis-user-dashboard-mobile1",
    "/analysis-user-dashboard-mobile2",
    "/analysis-user-dashboard-mobile3",
    "/analysis-user-dashboard-mobile4",
    "/analysis-user-dashboard-mobile5",
  ],
};
