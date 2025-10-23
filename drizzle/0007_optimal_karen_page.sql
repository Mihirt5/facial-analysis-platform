CREATE TABLE "parallel_user_intake" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "parallel_user_intake_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "parallel_user_intake" ADD CONSTRAINT "parallel_user_intake_user_id_parallel_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."parallel_user"("id") ON DELETE cascade ON UPDATE no action;