import { auth } from '@/auth';

export const middleware = auth;

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif).*)',
  ],
};
