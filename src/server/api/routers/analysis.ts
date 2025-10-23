import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import {
  createTRPCRouter,
  protectedProcedure,
  subscribedProcedure,
} from "~/server/api/trpc";
import { analysis, photoSubmission } from "~/server/db/schema";
import {
  getAllSectionKeys,
  ANALYSIS_STRUCTURE,
} from "~/lib/analysis-structure";

export const analysisRouter = createTRPCRouter({
  // Submit photos without creating an analysis (admins will convert later)
  submitPhotos: protectedProcedure
    .input(
      z.object({
        frontPicture: z.string().url(),
        leftPicture: z.string().url(),
        rightPicture: z.string().url(),
        leftSidePicture: z.string().url(),
        rightSidePicture: z.string().url(),
        hairlinePicture: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.photoSubmission.findFirst({
        where: (ps, { eq }) => eq(ps.userId, ctx.session.user.id),
      });
      const now = new Date();
      if (!existing) {
        const id = `submission_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
        const created = await ctx.db
          .insert(photoSubmission)
          .values({
            id,
            userId: ctx.session.user.id,
            frontPicture: input.frontPicture,
            leftPicture: input.leftPicture,
            rightPicture: input.rightPicture,
            leftSidePicture: input.leftSidePicture,
            rightSidePicture: input.rightSidePicture,
            hairlinePicture: input.hairlinePicture ?? null,
            status: "pending",
            createdAt: now,
            updatedAt: now,
          })
          .returning({ id: photoSubmission.id });
        return { id: created[0]?.id };
      }
      const updated = await ctx.db
        .update(photoSubmission)
        .set({
          frontPicture: input.frontPicture,
          leftPicture: input.leftPicture,
          rightPicture: input.rightPicture,
          leftSidePicture: input.leftSidePicture,
          rightSidePicture: input.rightSidePicture,
          hairlinePicture: input.hairlinePicture ?? null,
          status: "pending",
          updatedAt: now,
        })
        .where(eq(photoSubmission.userId, ctx.session.user.id))
        .returning({ id: photoSubmission.id });
      return { id: updated[0]?.id };
    }),

  // Check if user has a pending submission (treat as uploaded photos)
  hasPendingSubmission: protectedProcedure.query(async ({ ctx }) => {
    const submission = await ctx.db.query.photoSubmission.findFirst({
      where: (ps, { eq }) => eq(ps.userId, ctx.session.user.id),
    });
    return { hasPending: !!submission };
  }),
  create: subscribedProcedure
    .input(
      z.object({
        frontPicture: z.string().url(),
        leftPicture: z.string().url(),
        rightPicture: z.string().url(),
        leftSidePicture: z.string().url(),
        rightSidePicture: z.string().url(),
        hairlinePicture: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Enforce that the user has a completed intake before creating an analysis
      const intake = await ctx.db.query.userIntake.findFirst({
        where: (userIntake, { eq }) =>
          eq(userIntake.userId, ctx.session.user.id),
      });

      if (!intake) {
        throw new Error("User intake not completed");
      }

      // Check if user already has an analysis
      const existingAnalysis = await ctx.db.query.analysis.findFirst({
        where: (analysis, { eq }) => eq(analysis.userId, ctx.session.user.id),
      });

      if (existingAnalysis) {
        throw new Error("User already has an analysis. Only one analysis per user is allowed.");
      }

      const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const newAnalysis = await ctx.db
        .insert(analysis)
        .values({
          id: analysisId,
          frontPicture: input.frontPicture,
          leftPicture: input.leftPicture,
          rightPicture: input.rightPicture,
          leftSidePicture: input.leftSidePicture,
          rightSidePicture: input.rightSidePicture,
          hairlinePicture: input.hairlinePicture || null,
          userId: ctx.session.user.id,
        })
        // Return only columns guaranteed to exist across environments
        .returning({ id: analysis.id });

      return newAnalysis[0];
    }),

  // Get the first analysis for the current user (safe select)
  getFirstAnalysis: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select({
        id: analysis.id,
        createdAt: analysis.createdAt,
        status: analysis.status,
        morphUrl: analysis.morphUrl,
        frontPicture: analysis.frontPicture,
        leftPicture: analysis.leftPicture,
        rightPicture: analysis.rightPicture,
        leftSidePicture: analysis.leftSidePicture,
        rightSidePicture: analysis.rightSidePicture,
        hairlinePicture: analysis.hairlinePicture,
      })
      .from(analysis)
      .where(eq(analysis.userId, ctx.session.user.id))
      .orderBy(desc(analysis.createdAt))
      .limit(1);

    return rows[0] ?? null;
  }),

  // Get all analyses for the current user
  getUserAnalyses: protectedProcedure.query(async ({ ctx }) => {
    const userAnalyses = await ctx.db.query.analysis.findMany({
      where: (analysis, { eq }) => eq(analysis.userId, ctx.session.user.id),
      orderBy: (analysis, { desc }) => [desc(analysis.createdAt)],
    });

    return userAnalyses;
  }),

  // SAFE endpoints that only select known-good columns to avoid runtime errors
  // when production database schema is missing optional columns like morph_variations
  hasAnyAnalysisSafe: protectedProcedure.query(async ({ ctx }) => {
    // Production debugging
    if (process.env.NODE_ENV === "production") {
      console.log("[ANALYSIS] hasAnyAnalysisSafe called for user:", ctx.session.user.id);
    }

    const rows = await ctx.db
      .select({ id: analysis.id })
      .from(analysis)
      .where(eq(analysis.userId, ctx.session.user.id))
      .limit(1);

    const result = { hasAnalysis: rows.length > 0 };
    
    if (process.env.NODE_ENV === "production") {
      console.log("[ANALYSIS] hasAnyAnalysisSafe result:", result);
    }

    return result;
  }),

  getFirstAnalysisSafe: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select({ id: analysis.id, createdAt: analysis.createdAt, status: analysis.status })
      .from(analysis)
      .where(eq(analysis.userId, ctx.session.user.id))
      .orderBy(desc(analysis.createdAt))
      .limit(1);

    return rows[0] ?? null;
  }),

  // Check if analysis is complete
  checkAnalysisCompletion: protectedProcedure
    .input(z.object({ analysisId: z.string() }))
    .query(async ({ ctx, input }) => {
      const analysisRecord = await ctx.db.query.analysis.findFirst({
        where: (analysis, { eq, and }) =>
          and(
            eq(analysis.id, input.analysisId),
            eq(analysis.userId, ctx.session.user.id),
          ),
      });

      if (!analysisRecord) {
        throw new Error("Analysis not found or access denied");
      }

      return {
        status: analysisRecord.status,
        analysisId: analysisRecord.id,
      };
    }),

  // Get analysis structure with content for user view
  getAnalysisWithContent: protectedProcedure
    .input(z.object({ analysisId: z.string() }))
    .query(async ({ ctx, input }) => {
      // First verify the analysis belongs to the user
      const analysisRows = await ctx.db
        .select({
          id: analysis.id,
          status: analysis.status,
          frontPicture: analysis.frontPicture,
          leftPicture: analysis.leftPicture,
          rightPicture: analysis.rightPicture,
          leftSidePicture: analysis.leftSidePicture,
          rightSidePicture: analysis.rightSidePicture,
          hairlinePicture: analysis.hairlinePicture,
          createdAt: analysis.createdAt,
        })
        .from(analysis)
        .where(eq(analysis.id, input.analysisId))
        .limit(1);

      const analysisRecord = analysisRows[0] ?? null;

      if (!analysisRecord) {
        throw new Error("Analysis not found or access denied");
      }

      // Allow viewing content when analysis is ready or complete (but not while in progress)
      const canViewContent =
        analysisRecord.status === "complete" || analysisRecord.status === "ready";

      // Get existing content for this analysis (only if complete)
      const existingContent = canViewContent
        ? await ctx.db.query.analysisSectionContent.findMany({
            where: (content, { eq }) => eq(content.analysisId, input.analysisId),
          })
        : [];

      // Convert to map for easy lookup (empty if not complete)
      const contentMap = new Map(
        existingContent.map((content) => [content.sectionKey, content]),
      );

      // Also create structured data with additional features
      const structure = ANALYSIS_STRUCTURE.map((subtab) => {
        // Get additional features for this subtab
        const subtabContent = contentMap.get(subtab.key);

        return {
          ...subtab,
          additionalFeatures: subtabContent
            ? {
                id: subtabContent.id,
                text: subtabContent.additionalFeatures,
                updatedAt: subtabContent.updatedAt,
              }
            : null,
          sections: subtab.sections.map((section) => {
            const content = contentMap.get(section.key);
            return {
              ...section,
              content: content
                ? {
                    id: content.id,
                    image: content.image,
                    explanation: content.explanation,
                    updatedAt: content.updatedAt,
                  }
                : null,
            };
          }),
        };
      });

      return {
        analysis: analysisRecord,
        structure,
        hasContent: existingContent.length > 0,
      };
    }),
});
