import { NextResponse } from "next/server";
import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isSignInPage = createRouteMatcher(["/sign-in"]);
const isProtected = createRouteMatcher(["/dashboard(.*)"]);

const middleware = process.env.NEXT_PUBLIC_CONVEX_URL
  ? convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
      if (isSignInPage(request) && (await convexAuth.isAuthenticated())) {
        return nextjsMiddlewareRedirect(request, "/dashboard");
      }
      if (isProtected(request) && !(await convexAuth.isAuthenticated())) {
        return nextjsMiddlewareRedirect(request, "/sign-in");
      }
    })
  : () => NextResponse.next();

export default middleware;

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
