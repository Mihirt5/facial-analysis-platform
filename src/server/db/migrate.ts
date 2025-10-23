import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import { env } from "~/env";

const main = async () => {
  try {
    const db = drizzle(postgres(env.DATABASE_URL, { max: 1 }));
    console.log("⏳ Running migrations...");
    const start = Date.now();
    await migrate(db, { migrationsFolder: "drizzle" });
    const end = Date.now();
    console.log("✅ Migrations completed in", end - start, "ms");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed");
    console.error(err);
    process.exit(1);
  }
};

void main();
