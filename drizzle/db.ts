import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import * as schema from "./schema";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("DATABASE_URL is not set. Database queries may fail at runtime.");
}

declare global {
  // eslint-disable-next-line no-var
  var __dbClient: postgres.Sql | undefined;
}

const client =
  globalThis.__dbClient ??
  postgres(connectionString || "", {
    prepare: false,
    max: process.env.NODE_ENV === "production" ? 10 : 1,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__dbClient = client;
}

export const db = drizzle(client, { schema });
export * from "./schema";
