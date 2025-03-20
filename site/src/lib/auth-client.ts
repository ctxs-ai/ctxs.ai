import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const useSession = authClient.useSession;

export const signIn = async () => {
  const data = await authClient.signIn.social({
    provider: "github",
    callbackURL: '/weekly/submit'
  })
}

export const signOut = async () => {
  const data = await authClient.signOut()
}