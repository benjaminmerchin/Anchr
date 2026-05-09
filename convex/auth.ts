import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

// Normalize JWT_PRIVATE_KEY before any auth module reads it.
// Tolerate values that were pasted with extra prefix/suffix (a "Value:"
// label, a leading bullet, stray whitespace) or with newlines stored
// as the literal two-character sequence "\n" or as CRLF.
if (typeof process.env.JWT_PRIVATE_KEY === "string") {
  let key = process.env.JWT_PRIVATE_KEY
    .replace(/\\n/g, "\n")
    .replace(/\r/g, "");
  const pem = key.match(
    /-----BEGIN [A-Z ]+-----[\s\S]*?-----END [A-Z ]+-----/,
  );
  if (pem) {
    key = pem[0];
  }
  process.env.JWT_PRIVATE_KEY = key.trim();
}

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password, Anonymous],
});
