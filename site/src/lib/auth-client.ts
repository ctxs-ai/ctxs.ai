import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const signIn = async () => {
  const data = await authClient.signIn.social({
    provider: "github"
  })
}