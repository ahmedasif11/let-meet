import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      _id: string;
      image: string;
      name: string;
      email: string;
      provider: string;
      image: string;
    } & DefaultSession['user'];
  }

  interface User {
    _id: string;
    image: string;
    name: string;
    email: string;
    provider: string;
    image?: string;
    avatar?: string;
  }

  interface JWT {
    _id: string;
    name: string;
    email: string;
    provider: string;
    image: string;
  }
}
