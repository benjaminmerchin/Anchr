import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

// Normalize JWT_PRIVATE_KEY in case the value lost its real newlines
// when it was pasted into the Convex env var dashboard. Accept both:
//   - the raw multiline PEM
//   - a single-line PEM where every newline was stored as the literal
//     two-character sequence "\n"
if (typeof process.env.JWT_PRIVATE_KEY === "string") {
  process.env.JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY
    .replace(/\\n/g, "\n")
    .trim();
}

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password, Anonymous],
});
