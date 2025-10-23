import { z } from "zod";
import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure, reviewerProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { analysis as analysisTable, morphs as morphsTable, recommendations as recommendationsTable } from "~/server/db/schema";
import { gpt5MorphGenerator } from "~/lib/gpt5-morph-generator";
import { gpt5RecommendationGenerator } from "~/lib/qwen-recommendation-generator";

export const morphV2Router = createTRPCRouter({
  // Admin: Generate all 5 morphs for an analysis
  generateMorphsAdmin: reviewerProcedure
    .input(z.object({ analysisId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const analysis = await ctx.db.query.analysis.findFirst({
        where: eq(analysisTable.id, input.analysisId),
      });

      if (!analysis) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Analysis not found" });
      }

      // Check if morphs already exist
      const existing = await ctx.db.query.morphs.findFirst({
        where: eq(morphsTable.analysisId, input.analysisId),
      });

      if (existing) {
        return { success: true, message: "Morphs already exist", morphs: existing };
      }

      // Create morphs record with pending status
      const morphId = `morph_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      await ctx.db.insert(morphsTable).values({
        id: morphId,
        analysisId: input.analysisId,
        status: "processing",
        processingStartedAt: new Date(),
      });

      try {
        // Generate recommendations in parallel with morphs
        const [morphResults, recommendationResults] = await Promise.all([
          gpt5MorphGenerator.generateAllMorphs(analysis.frontPicture),
          gpt5RecommendationGenerator.analyzePhotos(
            analysis.frontPicture,
            analysis.hairlinePicture || analysis.frontPicture,
            analysis.rightSidePicture
          )
        ]);

        // Update morphs table with URLs
        await ctx.db
          .update(morphsTable)
          .set({
            overallUrl: morphResults.overall,
            eyesUrl: morphResults.eyes,
            skinUrl: morphResults.skin,
            jawlineUrl: morphResults.jawline,
            status: "complete",
            processingCompletedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(morphsTable.id, morphId));

        // Create/update recommendations
        const recommendationId = `rec_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        await ctx.db.insert(recommendationsTable).values({
          id: recommendationId,
          analysisId: input.analysisId,
          aestheticsScore: recommendationResults.aestheticsScore,
          eyesRecommendations: recommendationResults.eyes,
          skinRecommendations: recommendationResults.skin,
          hairRecommendations: recommendationResults.hair,
          jawlineRecommendations: recommendationResults.jawline,
          detectedConditions: recommendationResults.detectedConditions,
          overallAnalysis: recommendationResults.overallAnalysis,
          status: "complete",
          processingCompletedAt: new Date(),
        }).onConflictDoUpdate({
          target: recommendationsTable.analysisId,
          set: {
            aestheticsScore: recommendationResults.aestheticsScore,
            eyesRecommendations: recommendationResults.eyes,
            skinRecommendations: recommendationResults.skin,
            hairRecommendations: recommendationResults.hair,
            jawlineRecommendations: recommendationResults.jawline,
            detectedConditions: recommendationResults.detectedConditions,
            overallAnalysis: recommendationResults.overallAnalysis,
            status: "complete",
            processingCompletedAt: new Date(),
            updatedAt: new Date(),
          },
        });

        const successCount = Object.values(morphResults).filter(v => v !== null).length;

        return {
          success: true,
          message: `Generated ${successCount}/4 morphs and personalized recommendations`,
          morphs: morphResults,
          recommendations: recommendationResults,
        };
      } catch (error) {
        // Update status to failed
        await ctx.db
          .update(morphsTable)
          .set({
            status: "failed",
            errorMessage: error instanceof Error ? error.message : "Unknown error",
            updatedAt: new Date(),
          })
          .where(eq(morphsTable.id, morphId));

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate morphs",
        });
      }
    }),

  // Get morphs for an analysis
  getMorphs: protectedProcedure
    .input(z.object({ analysisId: z.string() }))
    .query(async ({ ctx, input }) => {
      const analysis = await ctx.db.query.analysis.findFirst({
        where: (analysis, { eq, and }) =>
          and(eq(analysis.id, input.analysisId), eq(analysis.userId, ctx.session.user.id)),
      });

      if (!analysis) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Analysis not found" });
      }

      const morphs = await ctx.db.query.morphs.findFirst({
        where: eq(morphsTable.analysisId, input.analysisId),
      });

      return morphs || null;
    }),

  // Admin: Generate recommendations only (no morphs)
  generateRecommendationsOnly: reviewerProcedure
    .input(z.object({ analysisId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      console.log(`[RECOMMENDATIONS] Starting recommendations generation for analysis: ${input.analysisId}`);

      // Get analysis data
      const analysis = await ctx.db.query.analysis.findFirst({
        where: (analysis, { eq }) => eq(analysis.id, input.analysisId),
      });

      if (!analysis) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Analysis not found" });
      }

      if (!analysis.frontPicture) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No front picture available" });
      }

      // Check for required photos
      const requiredPhotos = {
        front: analysis.frontPicture,
        hairline: analysis.hairlinePicture || analysis.frontPicture,
        rightSide: analysis.rightSidePicture || analysis.frontPicture
      };

      console.log(`[RECOMMENDATIONS] Photo URLs:`, {
        front: requiredPhotos.front ? '✅' : '❌',
        hairline: requiredPhotos.hairline ? '✅' : '❌', 
        rightSide: requiredPhotos.rightSide ? '✅' : '❌'
      });

      try {
        // Generate recommendations using GPT-5 Image Mini
        console.log(`[RECOMMENDATIONS] Calling GPT-5 Image Mini with photos:`, {
          front: requiredPhotos.front,
          hairline: requiredPhotos.hairline,
          rightSide: requiredPhotos.rightSide
        });

        const recommendationResults = await gpt5RecommendationGenerator.analyzePhotos(
          requiredPhotos.front,
          requiredPhotos.hairline,
          requiredPhotos.rightSide
        );

        // Create/update recommendations in database
        const recommendationId = `rec_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        
        await ctx.db.insert(recommendationsTable).values({
          id: recommendationId,
          analysisId: input.analysisId,
          aestheticsScore: recommendationResults.aestheticsScore,
          eyesRecommendations: recommendationResults.eyes,
          skinRecommendations: recommendationResults.skin,
          hairRecommendations: recommendationResults.hair,
          jawlineRecommendations: recommendationResults.jawline,
          detectedConditions: recommendationResults.detectedConditions,
          overallAnalysis: recommendationResults.overallAnalysis,
          status: "complete",
          processingCompletedAt: new Date(),
        }).onConflictDoUpdate({
          target: recommendationsTable.analysisId,
          set: {
            aestheticsScore: recommendationResults.aestheticsScore,
            eyesRecommendations: recommendationResults.eyes,
            skinRecommendations: recommendationResults.skin,
            hairRecommendations: recommendationResults.hair,
            jawlineRecommendations: recommendationResults.jawline,
            detectedConditions: recommendationResults.detectedConditions,
            overallAnalysis: recommendationResults.overallAnalysis,
            status: "complete",
            processingCompletedAt: new Date(),
            updatedAt: new Date(),
          },
        });

        console.log(`✅ [RECOMMENDATIONS] Completed recommendations generation for analysis: ${input.analysisId}`);
        console.log(`📊 Aesthetics Score: ${recommendationResults.aestheticsScore}`);
        console.log(`🔍 Detected Conditions:`, recommendationResults.detectedConditions);

        return {
          success: true,
          message: `Generated personalized recommendations with aesthetics score: ${recommendationResults.aestheticsScore}`,
          recommendations: recommendationResults,
        };
      } catch (error) {
        console.error(`❌ [RECOMMENDATIONS] Error generating recommendations for analysis: ${input.analysisId}`);
        console.error(`❌ [RECOMMENDATIONS] Error details:`, error);
        console.error(`❌ [RECOMMENDATIONS] Error message:`, error instanceof Error ? error.message : "Unknown error");
        console.error(`❌ [RECOMMENDATIONS] Error stack:`, error instanceof Error ? error.stack : "No stack trace");
        
        // Update status to failed
        try {
          await ctx.db.insert(recommendationsTable).values({
            id: `rec_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            analysisId: input.analysisId,
            status: "failed",
            errorMessage: error instanceof Error ? error.message : "Unknown error",
            processingCompletedAt: new Date(),
          }).onConflictDoUpdate({
            target: recommendationsTable.analysisId,
            set: {
              status: "failed",
              errorMessage: error instanceof Error ? error.message : "Unknown error",
              processingCompletedAt: new Date(),
              updatedAt: new Date(),
            },
          });
        } catch (dbError) {
          console.error(`❌ [RECOMMENDATIONS] Failed to update database with error status:`, dbError);
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to generate recommendations: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
      }
    }),

  // Get recommendations for an analysis
  getRecommendations: protectedProcedure
    .input(z.object({ analysisId: z.string() }))
    .query(async ({ ctx, input }) => {
      const recommendations = await ctx.db.query.recommendations.findFirst({
        where: (recommendations, { eq }) => eq(recommendations.analysisId, input.analysisId),
        with: {
          analysis: {
            columns: { userId: true },
          },
        },
      });

      if (!recommendations) return null;

      // Ensure user has access
      if (recommendations.analysis?.userId !== ctx.session.user.id && ctx.session.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }

      return recommendations;
    }),
});
