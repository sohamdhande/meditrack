import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
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
        // Lazy import Prisma only when actually needed
        const { prisma } = await import('@/lib/prisma');

        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Auth: Missing email or password');
          return null;
        }

        console.log(`🔍 Auth: Looking up user: ${credentials.email}`);
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          console.log(`❌ Auth: User not found: ${credentials.email}`);
          return null;
        }

        console.log(`✅ Auth: User found: ${user.email}`);
        console.log(`🔐 Auth: Comparing passwords...`);

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        console.log(`🔐 Auth: Password match result: ${passwordMatch}`);

        if (!passwordMatch) {
          console.log(`❌ Auth: Password mismatch for ${credentials.email}`);
          return null;
        }

        console.log(`✅ Auth: Authentication successful for ${credentials.email}`);
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  basePath: '/api/auth',
  trustHost: true,
});
