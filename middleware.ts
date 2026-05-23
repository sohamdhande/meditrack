import { auth } from "@/auth";

export const runtime = 'nodejs';

export default auth((req) => {
  console.log("[MIDDLEWARE_AUTH]", req.auth);
});

export const config = {
  matcher: ['/((?!api|_next|favicon.ico|login).*)'],
};