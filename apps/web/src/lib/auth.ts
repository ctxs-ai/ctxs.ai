import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Account, Session, User, Verification } from "@/db/schema";
import { createAuthMiddleware } from "better-auth/api";
import { BETTER_AUTH_URL, BETTER_AUTH_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "astro:env/server";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
  baseURL: BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,
  socialProviders: {
    github: {
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/callback")) {
        // Get the github username from the user's account
        const userId = ctx.context.newSession?.user.id;
        const [account] = await db.select().from(Account).where(eq(Account.userId, userId!));
        const ghToken = account.accessToken;
        const { login } = await fetch(`https://api.github.com/user`, {
          headers: {
            Authorization: `Bearer ${ghToken}`,
          },
        }).then((res) => res.json());
        await db.update(User).set({ githubUserName: login }).where(eq(User.id, userId!));
      }
    }),
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: User,
      account: Account,
      session: Session,
      verification: Verification
    },
  })
});