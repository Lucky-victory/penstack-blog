import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";
export const authClient = createAuthClient({
  plugins: [usernameClient()],
});
export const { useSession: sessionHook } = authClient;
export const useSession = sessionHook;
export const useAuth = () => useSession().data;
