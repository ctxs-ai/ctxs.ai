require("dotenv").config();

import { defineConfig } from "drizzle-kit";

const isDevelopment = process.env.NODE_ENV === "development";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: isDevelopment ? "sqlite" : "turso",
  dbCredentials: isDevelopment
    ? {
      url: "file:./dev.db",
    }
    : {
      url: process.env.TURSO_CONNECTION_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    },
});
// export default defineConfig({
//   schema: "./src/db/schema.ts",
//   out: "./migrations",
//   dialect: "sqlite",
//   dbCredentials: {
//     url: "file:sqlite.db",
//   },
// });