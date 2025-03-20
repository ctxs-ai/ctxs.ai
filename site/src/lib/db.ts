import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { TURSO_CONNECTION_URL, TURSO_AUTH_TOKEN } from "astro:env/server";

const turso = createClient({
  url: TURSO_CONNECTION_URL!,
  authToken: TURSO_AUTH_TOKEN!,
});

export const db = drizzle(turso);