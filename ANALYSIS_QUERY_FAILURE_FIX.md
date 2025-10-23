# Analysis Query Failure Fix - Root Cause Resolution

## Problem Identified

The user was getting stuck in an infinite loading state with this console output:
```
{isLoadingIntake: true, isLoadingSubscription: true, isLoadingAnalyses: true, hasUserIntake: false, hasSubscriptionStatus: false, …}
<< query #3 analysis.getUserAnalyses Object
```

## Root Cause Analysis

### 1. **Analysis Query Failing**
The `analysis.getUserAnalyses` query was failing due to the missing `morph_variations` column in the database (as documented in `DATABASE_MIGRATION_FIX.md`).

### 2. **Loading State Logic Flaw**
The original logic was:
```typescript
if (!subscriptionStatus || userAnalyses === undefined) {
  console.log("Desktop intake: Still loading user status data...");
  return; // ❌ Gets stuck here forever
}
```

When `userAnalyses` is `undefined` (due to query failure), the condition `userAnalyses === undefined` is always `true`, causing an infinite loop.

### 3. **Error Handling Redirecting to Auth**
When the analysis query failed, the error handling was redirecting users to `/auth` even though they were properly logged in.

## The Fix

### 1. **Made Analysis Query Optional**
```typescript
// Don't wait for analysis query if it fails - use intake and subscription data for routing
const isLoadingUserStatus = isSessionLoading || (!!session?.user && (isLoadingIntake || isLoadingSubscription));
```

**Before**: Waited for all three queries (intake, subscription, analyses)
**After**: Only waits for intake and subscription queries

### 2. **Graceful Analysis Query Failure Handling**
```typescript
// If analysis query failed, assume no analyses exist (don't get stuck waiting)
const hasAnalyses = userAnalyses && userAnalyses.length > 0;
const analysisQueryFailed = analysesError && !userAnalyses;

if (analysisQueryFailed) {
  console.log("Desktop intake: Analysis query failed, assuming no analyses exist", {
    error: analysesError?.message,
  });
}
```

**Logic**: If the analysis query fails, assume the user has no analyses and proceed with routing.

### 3. **Fixed Loading State Check**
```typescript
// Before: Got stuck when userAnalyses was undefined
if (!subscriptionStatus || userAnalyses === undefined) {
  return; // ❌ Infinite loop
}

// After: Only check subscription status
if (!subscriptionStatus) {
  console.log("Desktop intake: Still loading subscription data...");
  return; // ✅ Only waits for subscription
}
```

### 4. **Updated Routing Logic**
```typescript
// Before: Used userAnalyses.length directly
if (userAnalyses.length > 0) {
  // redirect to analysis
}

// After: Use hasAnalyses variable that handles failures
if (hasAnalyses) {
  // redirect to analysis
}
```

## Files Fixed

### 1. **Desktop Intake Client**
**File**: `src/app/intake/_components/desktop-intake-client.tsx`
- ✅ Made analysis query optional in loading state
- ✅ Added graceful failure handling for analysis query
- ✅ Fixed loading state logic to not get stuck
- ✅ Updated routing logic to handle analysis query failures

### 2. **Mobile Onboarding**
**File**: `src/app/mobile/onboarding/page.tsx`
- ✅ Made analysis query optional in loading state
- ✅ Uses existing redirect utility that handles undefined analyses

## Expected Behavior After Fix

### ✅ **Normal Flow (Analysis Query Works)**
1. User completes onboarding → authenticated
2. All queries succeed → proper routing based on actual data
3. User goes to correct page based on their status

### ✅ **Analysis Query Failure Flow**
1. User completes onboarding → authenticated
2. Intake and subscription queries succeed
3. Analysis query fails (due to missing column)
4. App assumes no analyses exist
5. User gets routed based on intake + subscription status
6. **No more infinite loading or redirect to auth**

### ✅ **Console Output (Fixed)**
```
Desktop intake: Analysis query failed, assuming no analyses exist {
  error: "column 'morph_variations' does not exist"
}
Desktop intake: User status loaded {
  hasIntake: true,
  isSubscribed: true,
  hasAnalyses: false,
  analysisCount: 0,
  analysisQueryFailed: true
}
Desktop intake: User has paid but no analysis, redirecting to /create-analysis
```

## Why This Fix Works

### 1. **Resilient to Database Issues**
- Doesn't get stuck when database schema is missing columns
- Gracefully handles query failures
- Continues with available data

### 2. **Proper Error Recovery**
- Assumes safe defaults (no analyses) when query fails
- Doesn't redirect to auth unnecessarily
- Provides clear logging for debugging

### 3. **Maintains User Experience**
- Users can still complete their flow
- No more infinite loading states
- Proper routing based on available data

## Related Issues

This fix also resolves:
- **Infinite loading states** on authenticated pages
- **Unnecessary redirects to auth** when user is logged in
- **Database migration issues** affecting user experience

## Next Steps

1. **Deploy this fix** to production
2. **Run database migration** to add the missing `morph_variations` column
3. **Monitor console logs** to confirm analysis queries work after migration
4. **Remove the graceful failure handling** once database is fixed (optional)

---

**Branch**: `fix-analysis-query-failure`
**Status**: ✅ Ready to deploy
**Build**: ✅ Passing
**TypeScript**: ✅ No errors

This fix addresses the root cause of the infinite loading issue while maintaining a good user experience even when the database schema is incomplete.
