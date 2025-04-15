require("dotenv").config();

import { defineConfig } from "drizzle-kit";

const isDevelopment = process.env.NODE_ENV === "development";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations-pg",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/ctxs_dev",
  },
  // Optionally, you can configure separate connections for dev/prod
  // dbCredentials: isDevelopment
  //   ? {
  //     connectionString: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/ctxs",
  //   }
  //   : {
  //     connectionString: process.env.DATABASE_URL!,
  //   }
});