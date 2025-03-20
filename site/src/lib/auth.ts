import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Account, Session, User, Verification } from "@/db/schema";
import { db } from "@/lib/db";

export const auth = betterAuth({
  baseURL: import.meta.env.BETTER_AUTH_URL || process.env.BETTER_AUTH_URL as string,
  secret: import.meta.env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET as string,
  socialProviders: {
    github: {
      clientId: import.meta.env.GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID as string,
      clientSecret: import.meta.env.GITHUB_CLIENT_SECRET || process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: User,
      account: Account,
      session: Session,
      verification: Verification
    },
  })
});