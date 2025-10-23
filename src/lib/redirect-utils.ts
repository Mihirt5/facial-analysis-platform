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
  | "/mobile";

/**
 * Client-side version for use in components
 */
export function getClientRedirectDestination(
  userIntake: any,
  subscriptionStatus: any,
  userAnalyses: any[],
  analysisQueryFailed?: boolean
): RedirectDestination {
  const userState: UserState = {
    hasCompletedIntake: !!userIntake,
    hasActiveSubscription: subscriptionStatus?.isSubscribed || false,
    // If analysis query failed, assume they have uploaded photos (they have an analysis record)
    // This is a reasonable assumption since they have intake + subscription
    hasUploadedPhotos: (userAnalyses && userAnalyses.length > 0) || !!analysisQueryFailed
  };

  if (!userState.hasCompletedIntake) {
    return "/mobile/onboarding";
  }

  if (!userState.hasActiveSubscription) {
    return "/payment";
  }

  if (userState.hasUploadedPhotos) {
    return "/analysis";
  } else {
    return "/create-analysis";
  }

  return "/mobile";
}
