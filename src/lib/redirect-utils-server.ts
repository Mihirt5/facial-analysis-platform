import "server-only";

import { api } from "~/trpc/server";

export type UserState = {
  hasCompletedIntake: boolean;
  hasActiveSubscription: boolean;
  hasUploadedPhotos: boolean;
};

export type RedirectDestination = 
  | "/mobile/onboarding"
  | "/payment" 
  | "/create-analysis"
  | "/analysis"
  | "/glow-up-protocol"
  | "/mobile"
  | "/auth"
  | "/intake";

/**
 * Server-side version for use in server components
 */
export async function getRedirectDestination(session: any, currentPath?: string, userAgent?: string): Promise<RedirectDestination> {
  // Detect if mobile from user agent
  const isMobile = userAgent ? /mobile|iphone|ipad|ipod|android|blackberry|windows phone/i.test(userAgent.toLowerCase()) : false;
  
  // If no session, go to appropriate landing page
  if (!session?.user) {
    return isMobile ? "/mobile" : "/auth";
  }

  try {
    // Get user state in parallel
    const [userIntake, subscriptionStatus, userAnalyses, pendingSubmission] = await Promise.all([
      api.intake.getMine().catch(() => null),
      api.subscription.isSubscribed().catch(() => ({ isSubscribed: false })),
      api.analysis.getUserAnalyses().catch(() => []),
      api.analysis.hasPendingSubmission().catch(() => ({ hasPending: false })),
    ]);

    const userState: UserState = {
      hasCompletedIntake: !!userIntake,
      hasActiveSubscription: subscriptionStatus.isSubscribed,
      hasUploadedPhotos: (userAnalyses && userAnalyses.length > 0) || !!pendingSubmission?.hasPending
    };

    // Debug logging
    console.log("🔍 Redirect Debug - User State:", {
      userId: session.user.id,
      hasCompletedIntake: userState.hasCompletedIntake,
      hasActiveSubscription: userState.hasActiveSubscription,
      hasUploadedPhotos: userState.hasUploadedPhotos,
      userAnalysesCount: userAnalyses?.length || 0,
      hasPendingSubmission: pendingSubmission?.hasPending || false,
      subscriptionStatus: subscriptionStatus,
      currentPath
    });

    // Determine final destination based on complete state
    if (!userState.hasCompletedIntake) {
      // Send to appropriate onboarding based on device
      const destination = isMobile ? "/mobile/onboarding" : "/intake";
      console.log("🔍 Redirect Debug - No intake completed, going to:", destination);
      return destination;
    }

    if (userState.hasCompletedIntake && !userState.hasActiveSubscription) {
      // User completed onboarding but hasn't paid
      console.log("🔍 Redirect Debug - Intake completed but no subscription, going to: /payment");
      return "/payment";
    }

    if (userState.hasCompletedIntake && userState.hasActiveSubscription) {
      // User has paid - check if they have photos
      if (userState.hasUploadedPhotos) {
        // When on Glow Up Protocol, allow access
        if (currentPath === "/glow-up-protocol") {
          console.log("🔍 Redirect Debug - On glow-up-protocol page, staying: /glow-up-protocol");
          return "/glow-up-protocol";
        }
        // Otherwise send to analysis dashboard
        console.log("🔍 Redirect Debug - Has subscription and photos, going to: /analysis");
        return "/analysis";
      } else {
        // User paid but no photos yet
        console.log("🔍 Redirect Debug - Has subscription but no photos, going to: /create-analysis");
        return "/create-analysis";
      }
    }

    // Fallback
    const fallback = isMobile ? "/mobile" : "/auth";
    console.log("🔍 Redirect Debug - Fallback, going to:", fallback);
    return fallback;
  } catch (error) {
    console.error("Error determining redirect destination:", error);
    return isMobile ? "/mobile" : "/auth";
  }
}
