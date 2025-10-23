# Database Migration Fix - morph_variations Column Missing

## Problem

Getting this error when submitting analysis:
```
Error submitting analysis: TRPCClientError: column "morph_variations"
```

## Root Cause

The database schema in your code (in `src/server/db/schema.ts`) includes morph-related columns:
- `morph_url`
- `morph_variations` ⚠️ **THIS IS MISSING FROM THE PRODUCTION DATABASE**
- `morph_metadata`
- `morph_validation`

The migration file `drizzle/0016_swift_ricochet.sql` was created on **Oct 11, 2024** and includes these columns, but it hasn't been applied to your production database yet.

## Solution

You need to run the database migrations to add the missing columns. There are two options:

### Option 1: Run Migrations (Recommended for Production)

This will apply all pending migrations in order:

```bash
npm run db:migrate:prod
```

This command runs `src/server/db/migrate.ts` which:
- Connects to your production database using `DATABASE_URL` from your `.env`
- Applies any pending migrations from the `drizzle/` folder
- Specifically will add the missing `morph_variations` column

### Option 2: Push Schema Directly (For Development/Testing)

This directly syncs your schema to the database without using migration files:

```bash
npm run db:push
```

⚠️ **Warning**: This is useful for development but can be risky in production as it bypasses migration history.

## Verification

After running the migration, you can verify it worked by:

1. **Check Drizzle Studio**:
   ```bash
   npm run db:studio
   ```
   Navigate to the `parallel_analysis` table and verify the columns exist.

2. **Test the Analysis Submission**:
   - Try submitting an analysis again
   - The TRPC error should be resolved
   - The morph generation should work

## What the Migration Does

Here's what `drizzle/0016_swift_ricochet.sql` adds to your database:

```sql
ALTER TABLE "parallel_analysis" ADD COLUMN "morph_url" text;
ALTER TABLE "parallel_analysis" ADD COLUMN "morph_variations" json;
ALTER TABLE "parallel_analysis" ADD COLUMN "morph_metadata" json;
ALTER TABLE "parallel_analysis" ADD COLUMN "morph_validation" json;
```

These columns are used for:
- **morph_url**: Stores the URL of the generated morph image
- **morph_variations**: Stores different variations of the morph (JSON)
- **morph_metadata**: Stores metadata about the morph generation (prompt, confidence, method)
- **morph_validation**: Stores validation results for the morph

## Prevention

To avoid this issue in the future:

1. **Always run migrations after pulling new code** that includes schema changes
2. **Check for new migration files** in the `drizzle/` folder
3. **Add migration check to your deployment pipeline**:
   ```bash
   npm run db:migrate:prod && npm run build && npm start
   ```

## Related Files

- Schema definition: `src/server/db/schema.ts` (line 30)
- Migration script: `drizzle/0016_swift_ricochet.sql`
- Prod migration runner: `src/server/db/migrate.ts`
- Usage in code: `src/server/api/routers/morph.ts` (lines 218, 221, 230, 277, 279)

---

**Status**: Ready to apply migration
**Next Step**: Run `npm run db:migrate:prod` to fix the issue

