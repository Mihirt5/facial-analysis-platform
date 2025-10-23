// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations } from "drizzle-orm";
import { pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `parallel_${name}`);

export const analysis = createTable("analysis", (d) => ({
  id: d.text("id").primaryKey(),
  frontPicture: d.text("front_picture").notNull(),
  rightPicture: d.text("right_picture").notNull(),
  leftPicture: d.text("left_picture").notNull(),
  leftSidePicture: d.text("left_side_picture").notNull(),
  rightSidePicture: d.text("right_side_picture").notNull(),
  hairlinePicture: d.text("hairline_picture"),
  userId: d
    .text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  status: d.text("status").notNull().default("in_progress"), // in_progress, ready, complete
  // Morph-related fields
  morphUrl: d.text("morph_url"),
  morphVariations: d.json("morph_variations"),
  morphMetadata: d.json("morph_metadata"),
  morphValidation: d.json("morph_validation"),
  createdAt: d
    .timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: d
    .timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
}));

export const user = createTable("user", (d) => ({
  id: d.text("id").primaryKey(),
  name: d.text("name").notNull(),
  email: d.text("email").notNull().unique(),
  emailVerified: d
    .boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: d.text("image"),
  createdAt: d
    .timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: d
    .timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),

  role: d.text("role").notNull().default("user"), // [user, reviewer, admin]

  stripeCustomerId: d.text("stripe_customer_id"),
}));

export const session = createTable("session", (d) => ({
  id: d.text("id").primaryKey(),
  expiresAt: d.timestamp("expires_at").notNull(),
  token: d.text("token").notNull().unique(),
  createdAt: d.timestamp("created_at").notNull(),
  updatedAt: d.timestamp("updated_at").notNull(),
  ipAddress: d.text("ip_address"),
  userAgent: d.text("user_agent"),
  userId: d
    .text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
}));

export const account = createTable("account", (d) => ({
  id: d.text("id").primaryKey(),
  accountId: d.text("account_id").notNull(),
  providerId: d.text("provider_id").notNull(),
  userId: d
    .text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: d.text("access_token"),
  refreshToken: d.text("refresh_token"),
  idToken: d.text("id_token"),
  accessTokenExpiresAt: d.timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: d.timestamp("refresh_token_expires_at"),
  scope: d.text("scope"),
  password: d.text("password"),
  createdAt: d.timestamp("created_at").notNull(),
  updatedAt: d.timestamp("updated_at").notNull(),
}));

export const verification = createTable("verification", (d) => ({
  id: d.text("id").primaryKey(),
  identifier: d.text("identifier").notNull(),
  value: d.text("value").notNull(),
  expiresAt: d.timestamp("expires_at").notNull(),
  createdAt: d
    .timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: d
    .timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date()),
}));

export const subscription = createTable("subscription", (d) => ({
  id: d.text("id").primaryKey(),
  plan: d.text("plan").notNull(),

  /**
   * The user id
   * Only one active or trialing subscription is supported at a time
   *
   * @see https://www.better-auth.com/docs/plugins/stripe#creating-a-subscription
   */
  referenceId: d.text("reference_id").references(() => user.id),

  stripeCustomerId: d.text("stripe_customer_id"),
  stripeSubscriptionId: d.text("stripe_subscription_id"),
  status: d.text("status"), // incomplete, active

  periodStart: d.timestamp("period_start"),
  periodEnd: d.timestamp("period_end"),
  cancelAtPeriodEnd: d.boolean("cancel_at_period_end"),

  seats: d.integer("seats"),
}));

export const userIntake = createTable("user_intake", (d) => ({
  id: d.text("id").primaryKey(),
  userId: d
    .text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),

  firstName: d.text("first_name").notNull(),
  lastName: d.text("last_name").notNull(),

  ageBracket: d.text("age_bracket").notNull(),

  country: d.text("country").notNull(),

  ethnicities: d.text("ethnicities").array().notNull(),
  ethnicityOther: d.text("ethnicity_other").default(""),

  focus: d.text("focus").notNull(),
  focusOther: d.text("focus_other").default(""),

  treatments: d.text("treatments").array().notNull(),
  treatmentsOther: d.text("treatments_other").default(""),

  createdAt: d
    .timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: d
    .timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
}));

// Analysis section content - stores explanations and images for predefined sections
export const analysisSectionContent = createTable(
  "analysis_section_content",
  (d) => ({
    id: d.text("id").primaryKey(),
    analysisId: d
      .text("analysis_id")
      .notNull()
      .references(() => analysis.id, { onDelete: "cascade" }),

    // Predefined section identifier (e.g., "eye_area_canthal_tilt", "nose_dorsal_profile")
    // For subtab-level additional features, use subtab keys (e.g., "eye_area", "nose", "jaw", "skin")
    sectionKey: d.text("section_key").notNull(),

    // Content for this section
    image: d.text("image"), // The cropped and edited image for this section
    explanation: d.text("explanation"), // The text area content for this section
    additionalFeatures: d.text("additional_features"), // Additional features text for subtabs

    createdAt: d
      .timestamp("created_at")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: d
      .timestamp("updated_at")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
  }),
);

// Morphs table - stores the 5 generated morph images for each analysis
export const morphs = createTable("morphs", (d) => ({
  id: d.text("id").primaryKey(),
  analysisId: d
    .text("analysis_id")
    .notNull()
    .references(() => analysis.id, { onDelete: "cascade" }),
  
  // The 4 morph types (removed hair)
  overallUrl: d.text("overall_url"),
  eyesUrl: d.text("eyes_url"),
  skinUrl: d.text("skin_url"),
  jawlineUrl: d.text("jawline_url"),
  
  // Metadata
  status: d.text("status").notNull().default("pending"), // pending, processing, complete, failed
  processingStartedAt: d.timestamp("processing_started_at"),
  processingCompletedAt: d.timestamp("processing_completed_at"),
  errorMessage: d.text("error_message"),
  
  createdAt: d
    .timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: d
    .timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
}));

// Recommendations table - stores personalized treatment recommendations
export const recommendations = createTable("recommendations", (d) => ({
  id: d.text("id").primaryKey(),
  analysisId: d
    .text("analysis_id")
    .notNull()
    .unique()
    .references(() => analysis.id, { onDelete: "cascade" }),
  
  // Aesthetics score (0-100)
  aestheticsScore: d.integer("aesthetics_score"),
  
  // Per-section recommendations (JSON arrays)
  eyesRecommendations: d.json("eyes_recommendations"), // Array of recommendation objects
  skinRecommendations: d.json("skin_recommendations"),
  hairRecommendations: d.json("hair_recommendations"),
  jawlineRecommendations: d.json("jawline_recommendations"),
  
  // Analysis insights from Qwen
  detectedConditions: d.json("detected_conditions"), // e.g., ["balding", "acne", "skin_tone_issues"]
  overallAnalysis: d.text("overall_analysis"), // General observations from Qwen
  
  // Metadata
  status: d.text("status").notNull().default("pending"),
  processingStartedAt: d.timestamp("processing_started_at"),
  processingCompletedAt: d.timestamp("processing_completed_at"),
  errorMessage: d.text("error_message"),
  
  createdAt: d
    .timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: d
    .timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
}));

// Relations
export const userRelations = relations(user, ({ many, one }) => ({
  analyses: many(analysis),
  subscription: one(subscription, {
    fields: [user.id],
    references: [subscription.referenceId],
  }),
  intake: one(userIntake, {
    fields: [user.id],
    references: [userIntake.userId],
  }),
}));

export const analysisRelations = relations(analysis, ({ one, many }) => ({
  user: one(user, {
    fields: [analysis.userId],
    references: [user.id],
  }),
  sectionContent: many(analysisSectionContent),
  morphs: one(morphs, {
    fields: [analysis.id],
    references: [morphs.analysisId],
  }),
  recommendations: one(recommendations, {
    fields: [analysis.id],
    references: [recommendations.analysisId],
  }),
}));

export const subscriptionRelations = relations(subscription, ({ one }) => ({
  user: one(user, {
    fields: [subscription.referenceId],
    references: [user.id],
  }),
}));

export const userIntakeRelations = relations(userIntake, ({ one }) => ({
  user: one(user, {
    fields: [userIntake.userId],
    references: [user.id],
  }),
}));

export const analysisSectionContentRelations = relations(
  analysisSectionContent,
  ({ one }) => ({
    analysis: one(analysis, {
      fields: [analysisSectionContent.analysisId],
      references: [analysis.id],
    }),
  }),
);

export const morphsRelations = relations(morphs, ({ one }) => ({
  analysis: one(analysis, {
    fields: [morphs.analysisId],
    references: [analysis.id],
  }),
}));

export const recommendationsRelations = relations(recommendations, ({ one }) => ({
  analysis: one(analysis, {
    fields: [recommendations.analysisId],
    references: [analysis.id],
  }),
}));

// Submissions of user photos (admins will create analyses from these)
export const photoSubmission = createTable("photo_submission", (d) => ({
  id: d.text("id").primaryKey(),
  userId: d
    .text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  frontPicture: d.text("front_picture").notNull(),
  leftPicture: d.text("left_picture").notNull(),
  rightPicture: d.text("right_picture").notNull(),
  leftSidePicture: d.text("left_side_picture").notNull(),
  rightSidePicture: d.text("right_side_picture").notNull(),
  hairlinePicture: d.text("hairline_picture"),
  status: d.text("status").notNull().default("pending"),
  createdAt: d
    .timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: d
    .timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
}));

export const photoSubmissionRelations = relations(photoSubmission, ({ one }) => ({
  user: one(user, {
    fields: [photoSubmission.userId],
    references: [user.id],
  }),
}));
