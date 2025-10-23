import { relations } from "drizzle-orm/relations";
import { parallelUser, parallelAccount, parallelSession, parallelSubscription, parallelUserIntake, parallelAnalysis, parallelAnalysisSectionContent } from "./schema";

export const parallelAccountRelations = relations(parallelAccount, ({one}) => ({
	parallelUser: one(parallelUser, {
		fields: [parallelAccount.userId],
		references: [parallelUser.id]
	}),
}));

export const parallelUserRelations = relations(parallelUser, ({many}) => ({
	parallelAccounts: many(parallelAccount),
	parallelSessions: many(parallelSession),
	parallelSubscriptions: many(parallelSubscription),
	parallelUserIntakes: many(parallelUserIntake),
	parallelAnalyses: many(parallelAnalysis),
}));

export const parallelSessionRelations = relations(parallelSession, ({one}) => ({
	parallelUser: one(parallelUser, {
		fields: [parallelSession.userId],
		references: [parallelUser.id]
	}),
}));

export const parallelSubscriptionRelations = relations(parallelSubscription, ({one}) => ({
	parallelUser: one(parallelUser, {
		fields: [parallelSubscription.referenceId],
		references: [parallelUser.id]
	}),
}));

export const parallelUserIntakeRelations = relations(parallelUserIntake, ({one}) => ({
	parallelUser: one(parallelUser, {
		fields: [parallelUserIntake.userId],
		references: [parallelUser.id]
	}),
}));

export const parallelAnalysisSectionContentRelations = relations(parallelAnalysisSectionContent, ({one}) => ({
	parallelAnalysis: one(parallelAnalysis, {
		fields: [parallelAnalysisSectionContent.analysisId],
		references: [parallelAnalysis.id]
	}),
}));

export const parallelAnalysisRelations = relations(parallelAnalysis, ({one, many}) => ({
	parallelAnalysisSectionContents: many(parallelAnalysisSectionContent),
	parallelUser: one(parallelUser, {
		fields: [parallelAnalysis.userId],
		references: [parallelUser.id]
	}),
}));