import { createAuthEndpoint } from "better-auth/api";
import { sessionMiddleware } from "better-auth/api";
import { z } from "zod";
import { db } from "~/server/db";
import { user } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const clearStripeDataPlugin = () => {
  return {
    id: "clear-stripe-data-plugin",
    endpoints: {
      clearStripeData: createAuthEndpoint(
        "/subscription/clear-stripe-data",
        {
          method: "POST",
          body: z.object({}),
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const { user: sessionUser } = ctx.context.session;
          
          try {
            // Clear the user's Stripe customer ID
            await db
              .update(user)
              .set({ stripeCustomerId: null })
              .where(eq(user.id, sessionUser.id));
            
            return ctx.json({
              success: true,
              message: "Stripe customer data cleared successfully",
            });
          } catch (error) {
            console.error("Error clearing Stripe data:", error);
            throw new Error("Failed to clear Stripe data");
          }
        },
      ),
    },
  };
};
