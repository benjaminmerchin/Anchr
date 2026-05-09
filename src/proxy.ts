import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isHomePage = createRouteMatcher(["/"]);
const isSignInPage = createRouteMatcher(["/sign-in"]);
const isProtected = createRouteMatcher(["/dashboard(.*)"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const authed = await convexAuth.isAuthenticated();

  // Authenticated users skip the marketing site and the sign-in form.
  if (authed && (isHomePage(request) || isSignInPage(request))) {
    return nextjsMiddlewareRedirect(request, "/dashboard");
  }

  if (!authed && isProtected(request)) {
    return nextjsMiddlewareRedirect(request, "/sign-in");
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
