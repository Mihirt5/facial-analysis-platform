import { stripe } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  APIError,
  createAuthEndpoint,
  originCheck,
  sessionMiddleware,
} from "better-auth/api";
import Stripe from "stripe";
import { z } from "zod";
import { env } from "~/env";
import { db } from "~/server/db";
import {
  account,
  session,
  subscription,
  user,
  verification,
} from "../db/schema";
import { clearStripeDataPlugin } from "./clear-stripe-data-plugin";

const stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
  /**
   * The current_period_start and current_period_end fields have been deprecated in the subscriptions API.
   * @see https://github.com/better-auth/better-auth/issues/2087
   */
  // apiVersion: "2025-06-30.basil",
});

export const customerPortalPlugin = () => {
  return {
    id: "customer-portal-plugin",
    endpoints: {
      customerPortal: createAuthEndpoint(
        "/subscription/portal",
        {
          method: "POST",
          body: z.object({
            returnUrl: z.string().default("/"),
          }),
          use: [
            sessionMiddleware,
            originCheck(
              (ctx: { body: { returnUrl: string } }) => {
                // Allow all origins in production for now to debug
                if (process.env.NODE_ENV === "production") {
                  console.log("[AUTH] originCheck allowing returnUrl:", ctx.body.returnUrl);
                  return "*"; // Allow all origins temporarily
                }
                return ctx.body.returnUrl;
              },
            ),
          ],
        },
        async (ctx) => {
          const { user } = ctx.context.session;

          if (!user.stripeCustomerId) {
            throw new APIError("BAD_REQUEST", {
              message: "No Stripe customer found for this user",
            });
          }

          try {
            const { url } = await stripeClient.billingPortal.sessions.create({
              customer: user.stripeCustomerId as string,
              return_url: ctx.body.returnUrl,
            });

            return ctx.json({
              url,
              redirect: true,
            });
          } catch (error) {
            ctx.context.logger.error("Error creating portal session", error);
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Failed to create customer portal session",
            });
          }
        },
      ),
    },
  };
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      account,
      session,
      user,
      verification,
      subscription,
    },
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 mins
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  defaultRedirects: {
    signIn: "/mobile/onboarding",
    signOut: "/mobile",
  },
  // Add production debugging
  logger: {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    disabled: false,
  },
  // Add error handling for better debugging
  errorHandler: (error: any, { path, method }: { path: string; method: string }) => {
    console.error(`[Better Auth Error] ${method} ${path}:`, error);
    return {
      message: error.message || "An error occurred",
      code: error.code || "INTERNAL_SERVER_ERROR",
    };
  },
  plugins: [
    stripe({
      stripeClient,
      stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "basic",
            priceId: env.STRIPE_PRICE_ID,
          },
        ],
        getCheckoutSessionParams: async (
          {
            user: _user,
            session: _session,
            plan: _plan,
            subscription: _subscription,
          },
          _request,
        ) => {
          return {
            params: {
              allow_promotion_codes: true,
            },
          };
        },
      },
    }),
    customerPortalPlugin(),
    clearStripeDataPlugin(),
  ],
});
