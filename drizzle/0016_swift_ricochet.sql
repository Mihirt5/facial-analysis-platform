ALTER TABLE "parallel_analysis" ADD COLUMN "morph_url" text;--> statement-breakpoint
ALTER TABLE "parallel_analysis" ADD COLUMN "morph_variations" json;--> statement-breakpoint
ALTER TABLE "parallel_analysis" ADD COLUMN "morph_metadata" json;--> statement-breakpoint
ALTER TABLE "parallel_analysis" ADD COLUMN "morph_validation" json;