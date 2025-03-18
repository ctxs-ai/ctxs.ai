import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

const signIn = async () => {
  const data = await authClient.signIn.social({
    provider: "github"
  })
}