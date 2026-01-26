import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User, NextAuthOptions } from 'next-auth';
import { getBackendUrl } from '@/lib/utils/api';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'select_account',
        },
      },
    }),

    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',

      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      authorize: async (credentials) => {
        try {
          const response = await fetch(`${getBackendUrl()}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const data = await response.json();

          if (!response.ok || !data.success) {
            throw new Error(data.message || 'Incorrect email or password');
          }

          return data.user as unknown as User;
        } catch (error: any) {
          throw new Error(error.message || 'Failed to login');
        }
      },
    }),
  ],

  callbacks: {
      async jwt({ token, user }) {
      if (user) {
        token._id = (user as User & { _id?: { toString(): string } })._id?.toString();
        token.name = user.name;
        token.email = user.email;
        token.image = user.image || user.avatar;
        token.provider = user.provider;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user._id = token._id as string;
        session.user.image = token.image as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.provider = token.provider as string;
      }

      // Create or update user in backend for OAuth users
      if (session.user.email && session.user.name && token.provider !== 'credentials') {
        try {
          await fetch(`${getBackendUrl()}/api/auth/oauth-user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: session.user.email,
              name: session.user.name,
              avatar: session.user.image || '',
              provider: token.provider,
            }),
          });
        } catch (error) {
          console.error('Error syncing OAuth user to backend:', error);
        }
      }

      return session;
    },

    async signIn({ user }) {
      // For OAuth providers, create user in backend
      if (user.provider && user.provider !== 'credentials') {
        try {
          await fetch(`${getBackendUrl()}/api/auth/oauth-user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              avatar: user?.image || user?.avatar || '',
              provider: user.provider,
            }),
          });
        } catch (error) {
          console.error('Error creating OAuth user in backend:', error);
        }
      }
      return true;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
