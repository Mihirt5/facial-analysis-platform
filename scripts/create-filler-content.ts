#!/usr/bin/env tsx

/**
 * Script to create filler analysis content for testing
 *
 * Usage:
 * npx tsx scripts/create-filler-content.ts <analysis_id>
 *
 * Example:
 * npx tsx scripts/create-filler-content.ts analysis_1234567890_abc123
 */

import { createFillerAnalysisContent } from "../src/utils/create-filler-analysis";

async function main() {
  const analysisId = process.argv[2];

  if (!analysisId) {
    console.error("Please provide an analysis ID as an argument");
    console.log(
      "Usage: npx tsx scripts/create-filler-content.ts <analysis_id>",
    );
    process.exit(1);
  }

  console.log(`Creating filler content for analysis: ${analysisId}`);

  const result = await createFillerAnalysisContent(analysisId);

  if (result.success) {
    console.log("✅ Success!", result.message);
    console.log(`📊 Total sections: ${result.total}`);
    console.log(`🆕 Created: ${result.created}`);
  } else {
    console.error("❌ Error:", result.error);
    process.exit(1);
  }
}

main().catch(console.error);
