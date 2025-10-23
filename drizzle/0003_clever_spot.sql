CREATE TABLE "parallel_subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"plan" text NOT NULL,
	"reference_id" text,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"status" text,
	"period_start" timestamp,
	"period_end" timestamp,
	"cancel_at_period_end" boolean,
	"seats" integer
);
--> statement-breakpoint
ALTER TABLE "parallel_subscription" ADD CONSTRAINT "parallel_subscription_reference_id_parallel_user_id_fk" FOREIGN KEY ("reference_id") REFERENCES "public"."parallel_user"("id") ON DELETE no action ON UPDATE no action;