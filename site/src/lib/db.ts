import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

// Create a PostgreSQL client
export let db;

const connectionString = process.env.DATABASE_URL!;

if (process.env.NODE_ENV === "development") {
  // Local development connection
  console.log("[DEV] initializing PostgreSQL db", connectionString);
  const client = postgres(connectionString);
  db = drizzle(client, { schema });
} else {
  console.log("[PROD] initializing PostgreSQL db");
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined in production environment");
  }
  const client = postgres(connectionString);
  db = drizzle(client, { schema });
}
