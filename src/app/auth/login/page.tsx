'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session && status === 'authenticated') {
      router.push('/');
    }
  }, [session, status, router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await signIn('credentials', {
        email,
        password,
        callbackUrl: '/',
      });
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = () => {
    signIn('google', {
      callbackUrl: '/',
    });
  };

  const handleGithubLogin = () => {
    signIn('github', {
      callbackUrl: '/',
    });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (session && status === 'authenticated') {
    router.push('/');
    return null;
  }

  return (
    <main className="bg-background">
      <div className="flex justify-center items-center h-screen">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Choose your preferred login method
            </CardDescription>
            <CardAction>
              <Button variant="link" asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
            </form>
            <div className="flex flex-col gap-2 mt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
              >
                <FaGoogle className="w-4 h-4 mr-2" />
                Login with Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGithubLogin}
              >
                <FaGithub className="w-4 h-4 mr-2" />
                Login with Github
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <p className="text-sm text-gray-500 text-center">
              By logging in, you agree to our terms of service and privacy
              policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
