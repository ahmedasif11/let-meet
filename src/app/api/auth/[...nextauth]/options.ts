import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectToDB from '@/lib/db/db.connect';
import userModel from '@/models/user.model';
import bcrypt from 'bcrypt';
import { User, NextAuthOptions } from 'next-auth';

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
          await connectToDB();

          const user = await userModel.findOne({ email: credentials?.email });

          if (!user || !user.isVerified) {
            throw new Error('Incorrect email or password');
          }

          if (!user.password) {
            throw new Error(
              'You signed up with Google/GitHub. Use that to login.'
            );
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials?.password as string,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error('Incorrect email or password');
          }

          return user as unknown as User;
        } catch {
          throw new Error('Failed to login');
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

      if (session.user._id && session.user.email && session.user.name) {
        await connectToDB();

        const existingUser = await userModel.findOne({
          email: session.user.email,
        });

        if (!existingUser) {
          const newUser = new userModel({
            email: session.user.email,
            name: session.user.name,
            avatar: session.user.image || '',
            isVerified: true,
            provider: session.user.provider,
          });

          await newUser.save();
        }
      }

      return session;
    },

    async signIn({ user }) {
      await connectToDB();
      const existingUser = await userModel.findOne({ email: user.email });
      if (!existingUser) {
        await userModel.create({
          name: user.name,
          email: user.email,
          isVerified: true,
          provider: user.provider,
          avatar: user?.image || user?.avatar || '',
        });
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
