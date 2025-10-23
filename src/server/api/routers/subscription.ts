import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const subscriptionRouter = createTRPCRouter({
  /**
   * Check if the current user has an active subscription
   */
  isSubscribed: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user) {
      console.log("🔍 Subscription Debug - No session, returning not subscribed");
      return {
        isSubscribed: false,
        subscription: null,
      };
    }
    
    // First, let's see what subscriptions exist for this user
    const allSubscriptions = await ctx.db.query.subscription.findMany({
      where: (subscription, { eq }) => eq(subscription.referenceId, ctx.session!.user.id),
    });
    
    console.log("🔍 Subscription Debug - All subscriptions for user:", {
      userId: ctx.session.user.id,
      subscriptions: allSubscriptions.map(sub => ({
        id: sub.id,
        status: sub.status,
        plan: sub.plan,
        periodStart: sub.periodStart,
        periodEnd: sub.periodEnd
      }))
    });
    
    // Check for active or trialing subscriptions (Stripe uses both statuses)
    const activeSubscription = await ctx.db.query.subscription.findFirst({
      where: (subscription, { eq, and, or }) =>
        and(
          // We can safely ! here as we already checked for ctx.session?.user
          eq(subscription.referenceId, ctx.session!.user.id),
          or(
            eq(subscription.status, "active"),
            eq(subscription.status, "trialing"),
            eq(subscription.status, "past_due") // Also include past_due as they still have access
          ),
        ),
    });

    console.log("🔍 Subscription Debug - Active subscription found:", {
      userId: ctx.session.user.id,
      hasActiveSubscription: !!activeSubscription,
      activeSubscription: activeSubscription ? {
        id: activeSubscription.id,
        status: activeSubscription.status,
        plan: activeSubscription.plan
      } : null
    });

    return {
      isSubscribed: !!activeSubscription,
      subscription: activeSubscription ?? null,
    };
  }),

  /**
   * Get an estimated turnaround date relative to the user's subscription start.
   * We define the estimate as 25 days after the subscription periodStart.
   * Returns daysUntil (min 0) and the estimatedDate if available.
   */
  estimatedTurnaround: protectedProcedure.query(async ({ ctx }) => {
    const activeSubscription = await ctx.db.query.subscription.findFirst({
      where: (subscription, { eq, and, or }) =>
        and(
          eq(subscription.referenceId, ctx.session.user.id),
          or(
            eq(subscription.status, "active"),
            eq(subscription.status, "trialing"),
            eq(subscription.status, "past_due")
          ),
        ),
      orderBy: (subscription, { desc }) => [desc(subscription.periodStart)],
    });

    // Default: if no subscription, surface a generic 25-day estimate
    if (!activeSubscription?.periodStart) {
      return {
        isSubscribed: false as const,
        estimatedDate: null as Date | null,
        daysUntil: 25,
      };
    }

    const periodStart = new Date(activeSubscription.periodStart);
    const estimatedDate = new Date(
      periodStart.getTime() + 25 * 24 * 60 * 60 * 1000,
    );
    const now = new Date();
    const diffMs = estimatedDate.getTime() - now.getTime();
    const daysUntil = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    return {
      isSubscribed: true as const,
      estimatedDate,
      daysUntil,
    };
  }),

  /**
   * Get the current user's subscription details
   */
  // getSubscription: protectedProcedure.query(async ({ ctx }) => {
  //   const userSubscription = await ctx.db.query.subscription.findFirst({
  //     where: (subscription, { eq }) =>
  //       eq(subscription.referenceId, ctx.session.user.id),
  //     orderBy: (subscription, { desc }) => [desc(subscription.periodStart)],
  //   });

  //   return userSubscription ?? null;
  // }),
});
