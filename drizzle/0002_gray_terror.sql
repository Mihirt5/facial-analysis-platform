CREATE TABLE "parallel_analysis" (
	"id" text PRIMARY KEY NOT NULL,
	"front_picture" text NOT NULL,
	"right_picture" text NOT NULL,
	"left_picture" text NOT NULL,
	"left_side_picture" text NOT NULL,
	"right_side_picture" text NOT NULL,
	"status" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "parallel_analysis" ADD CONSTRAINT "parallel_analysis_user_id_parallel_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."parallel_user"("id") ON DELETE cascade ON UPDATE no action;