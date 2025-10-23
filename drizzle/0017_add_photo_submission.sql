CREATE TABLE IF NOT EXISTS "parallel_photo_submission" (
  "id" text PRIMARY KEY,
  "user_id" text NOT NULL UNIQUE REFERENCES "parallel_user"("id") ON DELETE CASCADE,
  "front_picture" text NOT NULL,
  "left_picture" text NOT NULL,
  "right_picture" text NOT NULL,
  "left_side_picture" text NOT NULL,
  "right_side_picture" text NOT NULL,
  "hairline_picture" text,
  "status" text NOT NULL DEFAULT 'pending',
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);
