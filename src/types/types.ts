import type { InferSelectModel } from "drizzle-orm";
import type { analysis, user, userIntake, analysisSectionContent } from "~/server/db/schema";

export type Analysis = InferSelectModel<typeof analysis> & {
  user: InferSelectModel<typeof user> & {
    intake: InferSelectModel<typeof userIntake> | null;
  };
  sectionContent?: InferSelectModel<typeof analysisSectionContent>[];
};
