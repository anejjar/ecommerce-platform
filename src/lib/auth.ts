import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './prisma';
import { compare } from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/admin/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
        };
      }

      // Validate session hasn't been invalidated
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { sessionsInvalidatedAt: true, role: true },
        });

        if (dbUser) {
          // Check if JWT was issued before sessions were invalidated
          if (dbUser.sessionsInvalidatedAt) {
            const tokenIssuedAt = token.iat ? token.iat * 1000 : 0; // Convert to milliseconds
            const invalidatedAt = new Date(dbUser.sessionsInvalidatedAt).getTime();

            if (tokenIssuedAt < invalidatedAt) {
              // Session has been invalidated - return null to force re-login
              return null as any;
            }
          }

          // Update role in token if it changed
          token.role = dbUser.role;
        } else {
          // User no longer exists
          return null as any;
        }
      }

      return token;
    },
    async session({ session, token }) {
      // If token is null, session is invalid
      if (!token) {
        return null as any;
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        },
      };
    },
  },
};
