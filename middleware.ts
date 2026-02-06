import { auth } from "@/lib/auth";

export default auth;

export const config = {
  // Match all routes except static files and api routes that don't need auth
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|manifest.json|.*\\.png$).*)",
  ],
};
