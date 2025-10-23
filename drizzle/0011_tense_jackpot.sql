CREATE TABLE "parallel_analysis_section_content" (
	"id" text PRIMARY KEY NOT NULL,
	"analysis_id" text NOT NULL,
	"section_key" text NOT NULL,
	"image" text,
	"explanation" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
DROP TABLE "parallel_analysis_sections" CASCADE;--> statement-breakpoint
DROP TABLE "parallel_analysis_subtabs" CASCADE;--> statement-breakpoint
ALTER TABLE "parallel_analysis_section_content" ADD CONSTRAINT "parallel_analysis_section_content_analysis_id_parallel_analysis_id_fk" FOREIGN KEY ("analysis_id") REFERENCES "public"."parallel_analysis"("id") ON DELETE cascade ON UPDATE no action;