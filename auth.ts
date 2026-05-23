import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// Runtime validation — log env state on cold start
console.log("[AUTH_ENV]", {
  AUTH_SECRET: !!process.env.AUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  DATABASE_URL: !!process.env.DATABASE_URL,
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV !== 'production',
  session: { strategy: 'jwt' },
  trustHost: true,
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Lazy import to avoid Edge Runtime issues
          const { prisma } = await import('@/lib/prisma');
          const bcrypt = (await import('bcryptjs')).default;

          console.log("[AUTH] authorize() called for:", credentials?.email);

          if (!credentials?.email || !credentials?.password) {
            console.log("[AUTH] Missing email or password");
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          console.log("[AUTH] User found:", !!user);

          if (!user) return null;

          console.log("[AUTH] Hash exists:", !!user.password);

          const passwordMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          console.log("[AUTH] bcrypt match:", passwordMatch);

          if (!passwordMatch) return null;

          const result = {
            id: user.id,
            email: user.email,
            name: user.name,
          };
          console.log("[AUTH] authorize() returning user:", result.email);
          return result;
        } catch (error) {
          console.error("[AUTH_ERROR] authorize() threw:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("[JWT_CALLBACK]", { token, user })
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      console.log("[SESSION_CALLBACK]", { session, token })
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      return session
    }
  },
});
