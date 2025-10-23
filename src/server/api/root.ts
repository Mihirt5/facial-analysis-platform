import { analysisRouter } from "~/server/api/routers/analysis";
import { intakeRouter } from "~/server/api/routers/intake";
import { morphV2Router } from "~/server/api/routers/morph-v2";
import { reviewRouter } from "~/server/api/routers/review";
import { subscriptionRouter } from "~/server/api/routers/subscription";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  analysis: analysisRouter,
  morphV2: morphV2Router,
  review: reviewRouter,
  subscription: subscriptionRouter,
  intake: intakeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
