import { pgTable, text, timestamp, foreignKey, unique, boolean, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const parallelVerification = pgTable("parallel_verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const parallelAccount = pgTable("parallel_account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [parallelUser.id],
			name: "parallel_account_user_id_parallel_user_id_fk"
		}).onDelete("cascade"),
]);

export const parallelSession = pgTable("parallel_session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [parallelUser.id],
			name: "parallel_session_user_id_parallel_user_id_fk"
		}).onDelete("cascade"),
	unique("parallel_session_token_unique").on(table.token),
]);

export const parallelSubscription = pgTable("parallel_subscription", {
	id: text().primaryKey().notNull(),
	plan: text().notNull(),
	referenceId: text("reference_id"),
	stripeCustomerId: text("stripe_customer_id"),
	stripeSubscriptionId: text("stripe_subscription_id"),
	status: text(),
	periodStart: timestamp("period_start", { mode: 'string' }),
	periodEnd: timestamp("period_end", { mode: 'string' }),
	cancelAtPeriodEnd: boolean("cancel_at_period_end"),
	seats: integer(),
}, (table) => [
	foreignKey({
			columns: [table.referenceId],
			foreignColumns: [parallelUser.id],
			name: "parallel_subscription_reference_id_parallel_user_id_fk"
		}),
]);

export const parallelUser = pgTable("parallel_user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").notNull(),
	image: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	stripeCustomerId: text("stripe_customer_id"),
	role: text().default('user').notNull(),
}, (table) => [
	unique("parallel_user_email_unique").on(table.email),
]);

export const parallelUserIntake = pgTable("parallel_user_intake", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	ageBracket: text("age_bracket").notNull(),
	country: text().notNull(),
	ethnicities: text().array().notNull(),
	ethnicityOther: text("ethnicity_other").default(''),
	focus: text().notNull(),
	focusOther: text("focus_other").default(''),
	treatments: text().array().notNull(),
	treatmentsOther: text("treatments_other").default(''),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [parallelUser.id],
			name: "parallel_user_intake_user_id_parallel_user_id_fk"
		}).onDelete("cascade"),
	unique("parallel_user_intake_user_id_unique").on(table.userId),
]);

export const parallelAnalysisSectionContent = pgTable("parallel_analysis_section_content", {
	id: text().primaryKey().notNull(),
	analysisId: text("analysis_id").notNull(),
	sectionKey: text("section_key").notNull(),
	image: text(),
	explanation: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	additionalFeatures: text("additional_features"),
}, (table) => [
	foreignKey({
			columns: [table.analysisId],
			foreignColumns: [parallelAnalysis.id],
			name: "parallel_analysis_section_content_analysis_id_parallel_analysis"
		}).onDelete("cascade"),
]);

export const parallelAnalysis = pgTable("parallel_analysis", {
	id: text().primaryKey().notNull(),
	frontPicture: text("front_picture").notNull(),
	rightPicture: text("right_picture").notNull(),
	leftPicture: text("left_picture").notNull(),
	leftSidePicture: text("left_side_picture").notNull(),
	rightSidePicture: text("right_side_picture").notNull(),
	userId: text("user_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	status: text().default('in_progress').notNull(),
	hairlinePicture: text("hairline_picture"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [parallelUser.id],
			name: "parallel_analysis_user_id_parallel_user_id_fk"
		}).onDelete("cascade"),
]);
