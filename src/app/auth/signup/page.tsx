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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push('/auth/temp'); // Redirect to temp page after signup
    }
  }, [session, router]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await signIn('credentials', {
        email: (e.target as HTMLFormElement).email.value,
        password: (e.target as HTMLFormElement).password.value,
        redirect: false,
      });

      if (response?.error) {
        setError(response.error);
      } else {
        router.push('/auth/temp'); // Redirect to temp page after signup
      }
    } catch (error) {
      setError('An error occurred while signing up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-background">
      <div className="flex justify-center items-center h-screen">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your email below to create an account
            </CardDescription>
            <CardAction>
              <Button variant="link" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                </div>
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
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              Sign Up
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                signIn('google', {
                  callbackUrl: '/auth/temp',
                })
              }
            >
              <FaGoogle className="w-4 h-4 mr-2" />
              Sign Up with Google
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                signIn('github', {
                  callbackUrl: '/auth/temp',
                })
              }
            >
              <FaGithub className="w-4 h-4 mr-2" />
              Sign Up with Github
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
