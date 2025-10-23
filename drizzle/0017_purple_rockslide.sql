CREATE TABLE "parallel_morphs" (
	"id" text PRIMARY KEY NOT NULL,
	"analysis_id" text NOT NULL,
	"overall_url" text,
	"eyes_url" text,
	"skin_url" text,
	"jawline_url" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"processing_started_at" timestamp,
	"processing_completed_at" timestamp,
	"error_message" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parallel_photo_submission" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"front_picture" text NOT NULL,
	"left_picture" text NOT NULL,
	"right_picture" text NOT NULL,
	"left_side_picture" text NOT NULL,
	"right_side_picture" text NOT NULL,
	"hairline_picture" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "parallel_photo_submission_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "parallel_recommendations" (
	"id" text PRIMARY KEY NOT NULL,
	"analysis_id" text NOT NULL,
	"aesthetics_score" integer,
	"eyes_recommendations" json,
	"skin_recommendations" json,
	"hair_recommendations" json,
	"jawline_recommendations" json,
	"detected_conditions" json,
	"overall_analysis" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"processing_started_at" timestamp,
	"processing_completed_at" timestamp,
	"error_message" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "parallel_morphs" ADD CONSTRAINT "parallel_morphs_analysis_id_parallel_analysis_id_fk" FOREIGN KEY ("analysis_id") REFERENCES "public"."parallel_analysis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parallel_photo_submission" ADD CONSTRAINT "parallel_photo_submission_user_id_parallel_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."parallel_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parallel_recommendations" ADD CONSTRAINT "parallel_recommendations_analysis_id_parallel_analysis_id_fk" FOREIGN KEY ("analysis_id") REFERENCES "public"."parallel_analysis"("id") ON DELETE cascade ON UPDATE no action;