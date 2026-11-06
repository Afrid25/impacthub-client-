import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// Better Auth routes live on the same Next.js origin (/api/auth/[...all]).
// Omitting baseURL lets Better Auth use window.location.origin in the browser
// so it never mismatches the deployed domain.
export const authClient = createAuthClient({
  plugins: [jwtClient()],
});
