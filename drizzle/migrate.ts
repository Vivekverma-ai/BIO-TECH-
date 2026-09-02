import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ ERROR: DATABASE_URL environment variable is not defined.");
  process.exit(1);
}

const runMigrations = async () => {
  console.log("⏳ Starting database migrations from ./drizzle/development...");

  const migrationClient = postgres(connectionString, { max: 1, prepare: false });
  const db = drizzle(migrationClient);

  try {
    const migrationsFolder = path.resolve(process.cwd(), "drizzle/development");
    await migrate(db, { migrationsFolder });
    console.log("✅ Migrations applied successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
};

runMigrations();
