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
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to login';
          throw new Error(errorMessage);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in - set user data
      if (user) {
        token._id = (user as User & { _id?: { toString(): string } })._id?.toString();
        token.name = user.name;
        token.email = user.email;
        token.image = user.image || (user as User & { avatar?: string }).avatar;
        
        // Determine provider from account or user object
        if (account?.provider) {
          token.provider = account.provider;
        } else if ((user as User & { provider?: string }).provider) {
          token.provider = (user as User & { provider?: string }).provider;
        } else {
          token.provider = 'credentials';
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user._id = token._id as string;
        session.user.image = (token.image as string) || '';
        session.user.name = (token.name as string) || '';
        session.user.email = (token.email as string) || '';
        session.user.provider = (token.provider as string) || 'credentials';

        // For OAuth users, ensure they're synced to backend (retry if signIn callback failed)
        if (token.provider && token.provider !== 'credentials' && session.user.email && session.user.name) {
          try {
            const response = await fetch(`${getBackendUrl()}/api/auth/oauth-user`, {
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

            const data = await response.json();
            if (response.ok && data.user?._id && !token._id) {
              // Update token with user ID if we got it from backend
              token._id = data.user._id;
              session.user._id = data.user._id;
            }
          } catch (error) {
            // Silently fail - user is already signed in
            console.error('Error syncing OAuth user in session callback:', error);
          }
        }
      }

      return session;
    },

    async signIn({ user, account, profile }) {
      if (account && account.provider !== 'credentials') {
        try {
          const provider = account.provider;
          const email = user.email;
          const profileData = profile as { name?: string; picture?: string; avatar_url?: string } | undefined;
          const name = user.name || profileData?.name || '';
          const avatar = user.image || profileData?.picture || profileData?.avatar_url || '';

          if (!email || !name) {
            console.error('Missing email or name for OAuth user');
            // Still allow sign-in, but log the error
            return true;
          }

          const response = await fetch(`${getBackendUrl()}/api/auth/oauth-user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              name,
              avatar,
              provider,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            console.error('Failed to create/update OAuth user:', data);
            // Still allow sign-in, we'll try to sync in session callback
            return true;
          }

          // Store user ID from backend response if available
          if (data.user?._id) {
            (user as User & { _id?: string })._id = data.user._id;
          }
        } catch (error) {
          console.error('Error creating OAuth user in backend:', error);
          // Still allow sign-in, we'll try to sync in session callback
          return true;
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
