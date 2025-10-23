-- Migration: Add hairline_picture column to parallel_analysis table
-- This migration adds the missing hairline_picture column to the production database

ALTER TABLE "parallel_analysis" ADD COLUMN IF NOT EXISTS "hairline_picture" text;
