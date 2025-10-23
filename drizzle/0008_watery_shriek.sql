ALTER TABLE "parallel_user_intake" ADD COLUMN "first_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "parallel_user_intake" ADD COLUMN "last_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "parallel_user_intake" ADD COLUMN "age_bracket" text NOT NULL;--> statement-breakpoint
ALTER TABLE "parallel_user_intake" ADD COLUMN "country" text NOT NULL;--> statement-breakpoint
ALTER TABLE "parallel_user_intake" ADD COLUMN "ethnicities" text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "parallel_user_intake" ADD COLUMN "ethnicity_other" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "parallel_user_intake" ADD COLUMN "focus" text NOT NULL;--> statement-breakpoint
ALTER TABLE "parallel_user_intake" ADD COLUMN "focus_other" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "parallel_user_intake" ADD COLUMN "treatments" text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "parallel_user_intake" ADD COLUMN "treatments_other" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "parallel_user_intake" DROP COLUMN "data";--> statement-breakpoint
ALTER TABLE "parallel_user_intake" DROP COLUMN "completed";--> statement-breakpoint
ALTER TABLE "parallel_user_intake" DROP COLUMN "version";