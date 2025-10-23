import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  ANALYSIS_STRUCTURE,
  getAllSectionKeys,
} from "~/lib/analysis-structure";
import {
  createTRPCRouter,
  protectedProcedure,
  reviewerProcedure,
} from "~/server/api/trpc";
import { analysis, analysisSectionContent, photoSubmission, morphs, recommendations } from "~/server/db/schema";
import { createFillerAnalysisContent } from "~/utils/create-filler-analysis";
import { generateAndStoreAnalysis } from "~/lib/openrouter-analysis-generator";

export const reviewRouter = createTRPCRouter({
  // Delete a single analysis (admin/reviewer only) - only removes analysis content, preserves photos
  deleteAnalysis: reviewerProcedure
    .input(z.object({ analysisId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Delete analysis content but preserve photos
      await ctx.db.transaction(async (tx) => {
        // Delete section content
        await tx.delete(analysisSectionContent).where(eq(analysisSectionContent.analysisId, input.analysisId));
        
        // Delete morphs
        await tx.delete(morphs).where(eq(morphs.analysisId, input.analysisId));
        
        // Delete recommendations
        await tx.delete(recommendations).where(eq(recommendations.analysisId, input.analysisId));
        
        // Reset analysis to initial state but keep photos
        await tx.update(analysis)
          .set({
            status: "in_progress",
            morphUrl: null,
            morphVariations: null,
            morphMetadata: null,
            morphValidation: null,
            updatedAt: new Date(),
          })
          .where(eq(analysis.id, input.analysisId));
      });
      return { success: true };
    }),

  // Bulk delete analyses (admin/reviewer only) - only removes analysis content, preserves photos
  deleteAnalyses: reviewerProcedure
    .input(z.object({ analysisIds: z.array(z.string()).min(1) }))
    .mutation(async ({ ctx, input }) => {
      // Delete analysis content but preserve photos
      await ctx.db.transaction(async (tx) => {
        for (const analysisId of input.analysisIds) {
          // Delete section content
          await tx.delete(analysisSectionContent).where(eq(analysisSectionContent.analysisId, analysisId));
          
          // Delete morphs
          await tx.delete(morphs).where(eq(morphs.analysisId, analysisId));
          
          // Delete recommendations
          await tx.delete(recommendations).where(eq(recommendations.analysisId, analysisId));
          
          // Reset analysis to initial state but keep photos
          await tx.update(analysis)
            .set({
              status: "in_progress",
              morphUrl: null,
              morphVariations: null,
              morphMetadata: null,
              morphValidation: null,
              updatedAt: new Date(),
            })
            .where(eq(analysis.id, analysisId));
        }
      });
      return { success: true, count: input.analysisIds.length };
    }),
  // Get all analyses for review (admin/reviewer only)
  getAllAnalyses: reviewerProcedure.query(async ({ ctx }) => {
    const analyses = await ctx.db.query.analysis.findMany({
      with: {
        user: {
          with: {
            intake: true,
          },
        },
        sectionContent: true, // Include Claude-generated content
      },
      orderBy: (analysis, { desc }) => [desc(analysis.createdAt)],
    });

    return analyses;
  }),

  // Get analyses for a specific user (admin/reviewer only)
  getUserAnalyses: reviewerProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const analyses = await ctx.db.query.analysis.findMany({
        where: (analysis, { eq }) => eq(analysis.userId, input.userId),
        orderBy: (analysis, { desc }) => [desc(analysis.createdAt)],
      });

      return analyses;
    }),

  // Get a specific analysis by ID (admin/reviewer only)
  getAnalysisById: reviewerProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const analysis = await ctx.db.query.analysis.findFirst({
        where: (analysis, { eq }) => eq(analysis.id, input.id),
        with: {
          user: true,
        },
      });

      if (!analysis) {
        throw new Error("Analysis not found");
      }

      return analysis;
    }),

  // Get dashboard stats (admin/reviewer only)
  getDashboardStats: reviewerProcedure.query(async ({ ctx }) => {
    const allAnalyses = await ctx.db.query.analysis.findMany();

    const stats = {
      total: allAnalyses.length,
      inProgress: allAnalyses.filter((a) => a.status === "in_progress").length,
      ready: allAnalyses.filter((a) => a.status === "ready").length,
      completed: allAnalyses.filter((a) => a.status === "complete").length,
    };

    return stats;
  }),

  // Check if current user has reviewer access
  // checkAccess: reviewerProcedure.query(async ({ ctx }) => {
  //   return {
  //     hasAccess: true,
  //     user: ctx.session.user,
  //     role: ctx.user?.role ?? "user",
  //   };
  // }),

  checkAccess: protectedProcedure.query(async ({ ctx }) => {
    const isReviewer = ctx.user?.role === "reviewer";
    const isAdmin = ctx.user?.role === "admin";

    return {
      hasAccess: isReviewer || isAdmin,
      user: ctx.session.user,
      role: ctx.user?.role ?? "user",
    };
  }),

  // Get users with active subscriptions but no analyses (admin/reviewer only)
  getUsersWithSubscriptionsButNoAnalyses: reviewerProcedure.query(
    async ({ ctx }) => {
      // Get all users with their subscriptions and analyses
      const allUsers = await ctx.db.query.user.findMany({
        with: {
          analyses: true,
        },
      });

      // Get all active subscriptions
      const activeSubscriptions = await ctx.db.query.subscription.findMany({
        where: (subscription, { eq }) => eq(subscription.status, "active"),
      });

      // Filter users who have active subscriptions but no analyses
      const usersWithoutAnalyses = allUsers.filter((user) => {
        // Check if user has an active subscription
        const hasActiveSubscription = activeSubscriptions.some(
          (sub) => sub.referenceId === user.id,
        );

        // Check if user has no analyses
        const hasNoAnalyses = user.analyses.length === 0;

        return hasActiveSubscription && hasNoAnalyses;
      });

      // Add subscription data to the filtered users
      return usersWithoutAnalyses.map((user) => {
        const userSubscription = activeSubscriptions.find(
          (sub) => sub.referenceId === user.id,
        );

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          createdAt: user.createdAt,
          subscription: userSubscription ?? null,
        };
      });
    },
  ),

  // Get hitrate # of analyses / # of users
  getHitrate: reviewerProcedure.query(async ({ ctx }) => {
    const allAnalyses = await ctx.db.query.analysis.findMany();
    const allUsers = await ctx.db.query.user.findMany();

    const hitrate = allAnalyses.length / allUsers.length;

    return hitrate;
  }),

  // Get 72-hour hitrate # of analyses created in last 72h / # of users created in last 72h
  get72HourHitrate: reviewerProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const seventyTwoHoursAgo = new Date(now.getTime() - 72 * 60 * 60 * 1000);

    // Get analyses created in the last 72 hours
    const recentAnalyses = await ctx.db.query.analysis.findMany({
      where: (analysis, { gte }) => gte(analysis.createdAt, seventyTwoHoursAgo),
    });

    // Get users created in the last 72 hours
    const recentUsers = await ctx.db.query.user.findMany({
      where: (user, { gte }) => gte(user.createdAt, seventyTwoHoursAgo),
    });

    // Calculate hitrate, handle division by zero
    const hitrate =
      recentUsers.length > 0 ? recentAnalyses.length / recentUsers.length : 0;

    return hitrate;
  }),

  // Create an analysis from a pending photo submission (admin/reviewer only)
  createAnalysisFromSubmission: reviewerProcedure
    .input(z.object({ submissionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const submission = await ctx.db.query.photoSubmission.findFirst({
        where: (ps, { eq }) => eq(ps.id, input.submissionId),
      });

      if (!submission) {
        throw new Error("Photo submission not found");
      }

      // Check if user already has an analysis
      const existing = await ctx.db.query.analysis.findFirst({
        where: (a, { eq }) => eq(a.userId, submission.userId),
      });
      if (existing) {
        return { success: false, message: "User already has an analysis" };
      }

      const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

      await ctx.db.insert(analysis).values({
        id: analysisId,
        userId: submission.userId,
        frontPicture: submission.frontPicture,
        leftPicture: submission.leftPicture,
        rightPicture: submission.rightPicture,
        leftSidePicture: submission.leftSidePicture,
        rightSidePicture: submission.rightSidePicture,
        hairlinePicture: submission.hairlinePicture ?? null,
      });

      // Mark submission as processed
      await ctx.db
        .update(photoSubmission)
        .set({ status: "processed", updatedAt: new Date() })
        .where(eq(photoSubmission.id, input.submissionId));

      return { success: true, analysisId };
    }),

  // Analysis Section Content Management

  // Get analysis structure with content for a specific analysis
  getAnalysisStructure: reviewerProcedure
    .input(z.object({ analysisId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Get existing content for this analysis
      const existingContent =
        await ctx.db.query.analysisSectionContent.findMany({
          where: (content, { eq }) => eq(content.analysisId, input.analysisId),
        });

      // Convert to map for easy lookup
      const contentMap = new Map(
        existingContent.map((content) => [content.sectionKey, content]),
      );

      // Merge with predefined structure
      const structureWithContent = ANALYSIS_STRUCTURE.map((subtab) => {
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

      return structureWithContent;
    }),

  // Update section content (image and/or explanation)
  updateSectionContent: reviewerProcedure
    .input(
      z.object({
        analysisId: z.string(),
        sectionKey: z.string(),
        image: z.string().optional(),
        explanation: z.string().optional(),
        additionalFeatures: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if analysis is complete - prevent editing if it is
      const analysisRecord = await ctx.db.query.analysis.findFirst({
        where: (analysis, { eq }) => eq(analysis.id, input.analysisId),
      });

      if (!analysisRecord) {
        throw new Error("Analysis not found");
      }

      if (analysisRecord.status === "complete") {
        throw new Error("Cannot edit completed analysis");
      }

      // Check if content already exists
      const existing = await ctx.db.query.analysisSectionContent.findFirst({
        where: (content, { and, eq }) =>
          and(
            eq(content.analysisId, input.analysisId),
            eq(content.sectionKey, input.sectionKey),
          ),
      });

      let result;
      if (existing) {
        // Update existing content
        const updated = await ctx.db
          .update(analysisSectionContent)
          .set({
            image: input.image,
            explanation: input.explanation,
            additionalFeatures: input.additionalFeatures,
            updatedAt: new Date(),
          })
          .where(eq(analysisSectionContent.id, existing.id))
          .returning();

        result = updated[0];
      } else {
        // Create new content
        const id = crypto.randomUUID();
        const created = await ctx.db
          .insert(analysisSectionContent)
          .values({
            id,
            analysisId: input.analysisId,
            sectionKey: input.sectionKey,
            image: input.image,
            explanation: input.explanation,
            additionalFeatures: input.additionalFeatures,
          })
          .returning();

        result = created[0];
      }

      // After updating content, recompute readiness based on images only (additional features optional)
      const allSectionKeys = getAllSectionKeys();
      const allSubtabKeys = ANALYSIS_STRUCTURE.map((subtab) => subtab.key);
      const existingContent = await ctx.db.query.analysisSectionContent.findMany({
        where: (content, { eq }) => eq(content.analysisId, input.analysisId),
      });

      const completedSections = existingContent.filter(
        (c) => c.image && c.image.trim() !== "" && !allSubtabKeys.includes(c.sectionKey),
      );
      const completedSectionKeys = completedSections.map((c) => c.sectionKey);
      const allSectionsComplete = allSectionKeys.every((k) => completedSectionKeys.includes(k));

      // Update analysis status based on completion state (but don't downgrade from complete)
      if (analysisRecord.status !== "complete") {
        if (allSectionsComplete && analysisRecord.status === "in_progress") {
          // Mark as ready when everything is complete
          await ctx.db
            .update(analysis)
            .set({
              status: "ready",
              updatedAt: new Date(),
            })
            .where(eq(analysis.id, input.analysisId));
        } else if (!allSectionsComplete && analysisRecord.status === "ready") {
          // Mark as in_progress when incomplete
          await ctx.db
            .update(analysis)
            .set({
              status: "in_progress",
              updatedAt: new Date(),
            })
            .where(eq(analysis.id, input.analysisId));
        }
      }

      return result;
    }),

  // Mark analysis as complete (reviewer only)
  markAnalysisComplete: reviewerProcedure
    .input(z.object({ analysisId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      console.log("markAnalysisComplete called with:", input);
      
      try {
        // Verify analysis exists and is ready
        const analysisRecord = await ctx.db.query.analysis.findFirst({
          where: (analysis, { eq }) => eq(analysis.id, input.analysisId),
        });

        console.log("Found analysis record:", analysisRecord);

        if (!analysisRecord) {
          throw new Error("Analysis not found");
        }

        if (analysisRecord.status !== "ready") {
          throw new Error(`Analysis must be ready before marking complete. Current status: ${analysisRecord.status}`);
        }

        const updated = await ctx.db
          .update(analysis)
          .set({
            status: "complete",
            updatedAt: new Date(),
          })
          .where(eq(analysis.id, input.analysisId))
          .returning();

        console.log("Updated analysis:", updated[0]);
        return updated[0];
      } catch (error) {
        console.error("Error in markAnalysisComplete:", error);
        throw error;
      }
    }),

  // Mark analysis as incomplete (reviewer only) - allows editing again
  markAnalysisIncomplete: reviewerProcedure
    .input(z.object({ analysisId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify analysis exists and is complete
      const analysisRecord = await ctx.db.query.analysis.findFirst({
        where: (analysis, { eq }) => eq(analysis.id, input.analysisId),
      });

      if (!analysisRecord) {
        throw new Error("Analysis not found");
      }

      if (analysisRecord.status !== "complete") {
        throw new Error("Analysis must be complete before marking incomplete");
      }

      const updated = await ctx.db
        .update(analysis)
        .set({
          status: "ready",
          updatedAt: new Date(),
        })
        .where(eq(analysis.id, input.analysisId))
        .returning();

      // After marking as incomplete, compute readiness based on images only
      const allSectionKeys = getAllSectionKeys();
      const allSubtabKeys2 = ANALYSIS_STRUCTURE.map((subtab) => subtab.key);
      const existingContent2 = await ctx.db.query.analysisSectionContent.findMany({
        where: (content, { eq }) => eq(content.analysisId, input.analysisId),
      });
      const completedSections2 = existingContent2.filter(
        (c) => c.image && c.image.trim() !== "" && !allSubtabKeys2.includes(c.sectionKey),
      );
      const completedSectionKeys2 = completedSections2.map((c) => c.sectionKey);
      const allSectionsComplete2 = allSectionKeys.every((k) => completedSectionKeys2.includes(k));

      // If sections are incomplete, mark as in_progress instead of ready
      if (!allSectionsComplete2) {
        const finalUpdated = await ctx.db
          .update(analysis)
          .set({
            status: "in_progress",
            updatedAt: new Date(),
          })
          .where(eq(analysis.id, input.analysisId))
          .returning();

        return finalUpdated[0];
      }

      return updated[0];
    }),

  // Get predefined analysis structure (static)
  getAnalysisStructureDefinition: reviewerProcedure.query(() => {
    return ANALYSIS_STRUCTURE;
  }),

  // Create filler content for testing (admin/reviewer only)
  createFillerContent: reviewerProcedure
    .input(z.object({ analysisId: z.string() }))
    .mutation(async ({ input }) => {
      const result = await createFillerAnalysisContent(input.analysisId);

      if (!result.success) {
        throw new Error(result.error ?? "Failed to create filler content");
      }

      return result;
    }),

  // Generate real analysis using OpenRouter Claude 4.5 (admin/reviewer only)
  // Automatically marks analysis as complete when finished
  generateClaudeAnalysis: reviewerProcedure
    .input(z.object({ analysisId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Get the analysis record with all images
      const analysisRecord = await ctx.db.query.analysis.findFirst({
        where: (a, { eq }) => eq(a.id, input.analysisId),
      });

      if (!analysisRecord) {
        throw new Error('Analysis not found');
      }

      // Generate and store analysis using Claude
      // This function now automatically marks the analysis as complete
      const result = await generateAndStoreAnalysis(input.analysisId, {
        frontPicture: analysisRecord.frontPicture,
        leftPicture: analysisRecord.leftPicture,
        rightPicture: analysisRecord.rightPicture,
        leftSidePicture: analysisRecord.leftSidePicture,
        rightSidePicture: analysisRecord.rightSidePicture,
        hairlinePicture: analysisRecord.hairlinePicture,
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    }),

  // Mark analysis ready (reviewer/admin only) without writing content
  markAnalysisReady: reviewerProcedure
    .input(z.object({ analysisId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const analysisRecord = await ctx.db.query.analysis.findFirst({
        where: (a, { eq }) => eq(a.id, input.analysisId),
      });
      if (!analysisRecord) throw new Error('Analysis not found');
      if (analysisRecord.status === 'complete') return analysisRecord;
      const updated = await ctx.db
        .update(analysis)
        .set({ status: 'ready', updatedAt: new Date() })
        .where(eq(analysis.id, input.analysisId))
        .returning();
      return updated[0];
    }),

  // Create analysis content from MediaPipe processing (reviewer/admin only)
  createAnalysisContent: reviewerProcedure
    .input(z.object({
      analysisId: z.string(),
      content: z.array(z.object({
        sectionKey: z.string(),
        image: z.string(),
        explanation: z.string(),
      })),
      additionalFeatures: z.array(z.object({
        sectionKey: z.string(),
        text: z.string(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify the analysis exists (reviewers/admins can update any analysis)
      const analysisRecord = await ctx.db.query.analysis.findFirst({
        where: (analysis, { eq }) => eq(analysis.id, input.analysisId),
      });

      if (!analysisRecord) {
        throw new Error("Analysis not found or access denied");
      }

      // Upsert content for each section using manual check (no unique composite constraint)
      for (const c of input.content) {
        const existing = await ctx.db.query.analysisSectionContent.findFirst({
          where: (row, { and, eq }) =>
            and(eq(row.analysisId, input.analysisId), eq(row.sectionKey, c.sectionKey)),
        });
        if (existing) {
          await ctx.db
            .update(analysisSectionContent)
            .set({
              image: c.image,
              explanation: c.explanation,
              updatedAt: new Date(),
            })
            .where(eq(analysisSectionContent.id, existing.id));
        } else {
          const contentId = `content_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 9)}`;
          await ctx.db.insert(analysisSectionContent).values({
            id: contentId,
            analysisId: input.analysisId,
            sectionKey: c.sectionKey,
            image: c.image,
            explanation: c.explanation,
          });
        }
      }

      // Upsert additional features for each subtab using manual check
      for (const feature of input.additionalFeatures) {
        const existing = await ctx.db.query.analysisSectionContent.findFirst({
          where: (row, { and, eq }) =>
            and(eq(row.analysisId, input.analysisId), eq(row.sectionKey, feature.sectionKey)),
        });
        if (existing) {
          await ctx.db
            .update(analysisSectionContent)
            .set({
              additionalFeatures: feature.text,
              updatedAt: new Date(),
            })
            .where(eq(analysisSectionContent.id, existing.id));
        } else {
          const featureId = `feature_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 9)}`;
          await ctx.db.insert(analysisSectionContent).values({
            id: featureId,
            analysisId: input.analysisId,
            sectionKey: feature.sectionKey,
            additionalFeatures: feature.text,
          });
        }
      }

      // After saving, recompute completion and update status to ready/in_progress accordingly
      const allSectionKeys = getAllSectionKeys();
      const allSubtabKeys = ANALYSIS_STRUCTURE.map((s) => s.key);

      const existing = await ctx.db.query.analysisSectionContent.findMany({
        where: (content, { eq }) => eq(content.analysisId, input.analysisId),
      });

      const completedSections = existing.filter(
        (c) => c.image && c.image.trim() !== "" && !allSubtabKeys.includes(c.sectionKey),
      );
      const sectionKeys = new Set(completedSections.map((c) => c.sectionKey));
      const allSectionsComplete = allSectionKeys.every((k) => sectionKeys.has(k));

      if (analysisRecord.status !== "complete") {
        if (allSectionsComplete && analysisRecord.status === "in_progress") {
          await ctx.db
            .update(analysis)
            .set({ status: "ready", updatedAt: new Date() })
            .where(eq(analysis.id, input.analysisId));
        } else if (!allSectionsComplete && analysisRecord.status === "ready") {
          await ctx.db
            .update(analysis)
            .set({ status: "in_progress", updatedAt: new Date() })
            .where(eq(analysis.id, input.analysisId));
        }
      }

      return { success: true };
    }),

  // Batch: process simple analysis for pending analyses using front photo (admin/reviewer only)
  processSimpleFrontBatch: reviewerProcedure
    .input(
      z.object({
        analysisIds: z.array(z.string()).optional(), // if omitted, process all in_progress without content
      }).optional()
    )
    .mutation(async ({ ctx, input }) => {
      const idsToProcess = input?.analysisIds;

      // Fetch candidate analyses
      const candidates = idsToProcess && idsToProcess.length > 0
        ? await ctx.db.query.analysis.findMany({
            where: (a, { inArray }) => inArray(a.id, idsToProcess),
          })
        : await ctx.db.query.analysis.findMany({
            where: (a, { eq }) => eq(a.status, "in_progress"),
          });

      const processed: string[] = [];
      const failed: { id: string; error: string }[] = [];

      // Use client-calculated qualitative text for now; store placeholders server-side
      for (const a of candidates) {
        try {
          // Minimal content: seed images only (no additional text)
          const content: { sectionKey: string; image: string; explanation: string }[] = [];
          const additionalFeatures: { sectionKey: string; text: string }[] = [];

          for (const subtab of ANALYSIS_STRUCTURE) {
            // No additional features text
            additionalFeatures.push({ sectionKey: subtab.key, text: "" });
            for (const section of subtab.sections) {
              content.push({
                sectionKey: section.key,
                image: a.frontPicture,
                explanation: "",
              });
            }
          }

          // Upsert content for each section using manual check (no unique composite constraint)
          for (const c of content) {
            const existing = await ctx.db.query.analysisSectionContent.findFirst({
              where: (row, { and, eq }) =>
                and(eq(row.analysisId, a.id), eq(row.sectionKey, c.sectionKey)),
            });
            if (existing) {
              await ctx.db
                .update(analysisSectionContent)
                .set({
                  image: c.image,
                  explanation: c.explanation,
                  updatedAt: new Date(),
                })
                .where(eq(analysisSectionContent.id, existing.id));
            } else {
              const contentId = `content_${Date.now()}_${Math.random()
                .toString(36)
                .substring(2, 9)}`;
              await ctx.db.insert(analysisSectionContent).values({
                id: contentId,
                analysisId: a.id,
                sectionKey: c.sectionKey,
                image: c.image,
                explanation: c.explanation,
              });
            }
          }

          // Upsert additional features for each subtab using manual check
          for (const feature of additionalFeatures) {
            const existing = await ctx.db.query.analysisSectionContent.findFirst({
              where: (row, { and, eq }) =>
                and(eq(row.analysisId, a.id), eq(row.sectionKey, feature.sectionKey)),
            });
            if (existing) {
              await ctx.db
                .update(analysisSectionContent)
                .set({
                  additionalFeatures: feature.text,
                  updatedAt: new Date(),
                })
                .where(eq(analysisSectionContent.id, existing.id));
            } else {
              const contentId = `content_${Date.now()}_${Math.random()
                .toString(36)
                .substring(2, 9)}`;
              await ctx.db.insert(analysisSectionContent).values({
                id: contentId,
                analysisId: a.id,
                sectionKey: feature.sectionKey,
                additionalFeatures: feature.text,
              });
            }
          }

          processed.push(a.id);
        } catch (e: any) {
          failed.push({ id: a.id, error: e?.message || "unknown error" });
        }
      }

      return { processed, failed };
    }),
});
