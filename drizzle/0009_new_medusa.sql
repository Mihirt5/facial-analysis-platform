CREATE TABLE "parallel_analysis_sections" (
	"id" text PRIMARY KEY NOT NULL,
	"subtab_id" text NOT NULL,
	"name" text NOT NULL,
	"display_order" integer NOT NULL,
	"explanation" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parallel_analysis_subtabs" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"display_order" integer NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "parallel_analysis_sections" ADD CONSTRAINT "parallel_analysis_sections_subtab_id_parallel_analysis_subtabs_id_fk" FOREIGN KEY ("subtab_id") REFERENCES "public"."parallel_analysis_subtabs"("id") ON DELETE cascade ON UPDATE no action;