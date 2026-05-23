export { auth as middleware } from "@/auth"

export const config = {
  // matcher for routes to protect, or just exclude statics.
  // For now, let's keep it simple and just export the auth middleware.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
}