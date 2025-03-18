import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, user, account, session, verification } from "astro:db";

export const auth = betterAuth({
  baseURL: import.meta.env.BETTER_AUTH_URL,
  secret: import.meta.env.BETTER_AUTH_SECRET,
  socialProviders: {
    github: {
      clientId: import.meta.env.GITHUB_CLIENT_ID as string,
      clientSecret: import.meta.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: { user, account, session, verification },
  })
});