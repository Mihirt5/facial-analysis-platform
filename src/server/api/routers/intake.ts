import { z } from "zod";
import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { userIntake, user } from "~/server/db/schema";
import {
  ETHNICITY_OPTIONS,
  AESTHETIC_FOCUS_OPTIONS,
  TREATMENT_OPTIONS,
  AGE_OPTIONS,
} from "~/types/intake";
import { countries } from "country-data-list";

// Extract valid country codes from country-data-list
const countryData = (countries as { all?: unknown[] }).all;
const validCountryCodes = Array.isArray(countryData)
  ? countryData
      .filter(
        (country): country is { alpha3: string; status: string } =>
          typeof country === "object" &&
          country !== null &&
          "alpha3" in country &&
          "status" in country &&
          typeof country.alpha3 === "string" &&
          typeof country.status === "string",
      )
      .filter((country) => country.status !== "deleted")
      .map((country) => country.alpha3)
  : [];

const intakeDataSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  ageBracket: z.enum(AGE_OPTIONS),
  country: z.string().refine((code) => validCountryCodes.includes(code), {
    message: "Invalid country code",
  }),
  ethnicities: z.array(z.enum(ETHNICITY_OPTIONS)).min(1),
  ethnicityOther: z.string().optional().default(""),
  focus: z.enum(AESTHETIC_FOCUS_OPTIONS),
  focusOther: z.string().optional().default(""),
  treatments: z.array(z.enum(TREATMENT_OPTIONS)).min(1),
  treatmentsOther: z.string().optional().default(""),
});

export const intakeRouter = createTRPCRouter({
  getMine: protectedProcedure.query(async ({ ctx }) => {
    const existing = await ctx.db.query.userIntake.findFirst({
      where: (ui, { eq }) => eq(ui.userId, ctx.session.user.id),
    });

    return existing ?? null;
  }),

  upsert: protectedProcedure
    .input(
      z.object({
        data: intakeDataSchema,
        completed: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("=== INTAKE UPSERT MUTATION CALLED ===");
      console.log("Intake upsert - input data:", input);
      
      try {
        // Test database connection first
        console.log("Testing database connection...");
        const testQuery = await ctx.db.query.user.findFirst({
          where: (u, { eq }) => eq(u.id, "test"),
        });
        console.log("Database connection test completed");
        
        // Check if user exists in database
        const userExists = await ctx.db.query.user.findFirst({
          where: (u, { eq }) => eq(u.id, ctx.session.user.id),
        });
        
        if (!userExists) {
          console.error("User not found in database:", ctx.session.user.id);
          
          // Create the user record in the database
          const newUser = await ctx.db.insert(user).values({
            id: ctx.session.user.id,
            name: ctx.session.user.name || "Unknown User",
            email: ctx.session.user.email || "",
            emailVerified: false,
            image: ctx.session.user.image || null,
            createdAt: new Date(),
          }).returning();
          
        }
      } catch (error) {
        console.error("Database error in intake upsert:", error);
        console.error("Error details:", {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          name: error instanceof Error ? error.name : undefined,
        });
        throw error;
      }

      try {
        const existing = await ctx.db.query.userIntake.findFirst({
          where: (ui, { eq }) => eq(ui.userId, ctx.session.user.id),
        });

        console.log("Intake upsert - existing record:", !!existing);

        const now = new Date();

        if (!existing) {
          const newId = `intake_${Date.now()}_${Math.random()
            .toString(36)
            .slice(2, 10)}`;
          console.log("Creating new intake record with ID:", newId);
          
          const insertData = {
            id: newId,
            userId: ctx.session.user.id,
            firstName: input.data.firstName,
            lastName: input.data.lastName,
            ageBracket: input.data.ageBracket,
            country: input.data.country,
            ethnicities: input.data.ethnicities,
            ethnicityOther: input.data.ethnicityOther,
            focus: input.data.focus,
            focusOther: input.data.focusOther,
            treatments: input.data.treatments,
            treatmentsOther: input.data.treatmentsOther,
            createdAt: now,
            updatedAt: now,
          };
          
          console.log("Insert data:", insertData);
          
          const created = await ctx.db
            .insert(userIntake)
            .values(insertData)
            .returning();

          console.log("Created intake record:", created[0]);
          return created[0];
        }

        // If already exists, update the existing user intake
        console.log("Updating existing intake record");
        
        const updateData = {
          firstName: input.data.firstName,
          lastName: input.data.lastName,
          ageBracket: input.data.ageBracket,
          country: input.data.country,
          ethnicities: input.data.ethnicities,
          ethnicityOther: input.data.ethnicityOther,
          focus: input.data.focus,
          focusOther: input.data.focusOther,
          treatments: input.data.treatments,
          treatmentsOther: input.data.treatmentsOther,
          updatedAt: now,
        };
        
        console.log("Update data:", updateData);
        
        const updated = await ctx.db
          .update(userIntake)
          .set(updateData)
          .where(eq(userIntake.userId, ctx.session.user.id))
          .returning();

        console.log("Updated intake record:", updated[0]);
        return updated[0];
      } catch (error) {
        console.error("Error in intake upsert operation:", error);
        console.error("Error details:", {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          name: error instanceof Error ? error.name : undefined,
        });
        throw error;
      }
    }),
});
