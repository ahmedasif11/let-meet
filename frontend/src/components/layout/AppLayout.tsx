'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import {
  Video,
  Calendar,
  Users,
  Settings,
  LogOut,
  Home,
  MessageSquare,
  Menu,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!session?.user) {
    return <>{children}</>;
  }

  const user = {
    name: session.user.name || 'User',
    email: session.user.email || '',
    avatar: session.user.image || '',
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/login' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video className="h-6 w-6 text-blue-600" />
          <h1 className="text-lg font-semibold">Let Meet</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Theme Toggle for Desktop - Top Right */}
      <div className="hidden lg:block fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div
        className={`fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-4 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center mb-8">
          <Video className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-xl font-semibold">Let Meet</h1>
        </div>

        <nav className="space-y-2">
          <Button
            variant={pathname === '/dashboard' ? 'default' : 'ghost'}
            className="w-full justify-start"
            asChild
            onClick={() => setSidebarOpen(false)}
          >
            <Link href="/dashboard">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
          </Button>
          <Button
            variant={pathname === '/calendar' ? 'default' : 'ghost'}
            className="w-full justify-start"
            asChild
            onClick={() => setSidebarOpen(false)}
          >
            <Link href="/calendar">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </Link>
          </Button>
          <Button
            variant={pathname?.startsWith('/teams') ? 'default' : 'ghost'}
            className="w-full justify-start"
            asChild
            onClick={() => setSidebarOpen(false)}
          >
            <Link href="/teams">
              <Users className="h-4 w-4 mr-2" />
              Teams
            </Link>
          </Button>
          <Button
            variant={pathname === '/chat' ? 'default' : 'ghost'}
            className="w-full justify-start"
            asChild
            onClick={() => setSidebarOpen(false)}
          >
            <Link href="/chat">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </Link>
          </Button>
          <Button
            variant={pathname === '/settings' ? 'default' : 'ghost'}
            className="w-full justify-start"
            asChild
            onClick={() => setSidebarOpen(false)}
          >
            <Link href="/settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </Button>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar src={user.avatar} alt={user.name} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:ml-64 pt-16 lg:pt-0">{children}</div>
    </div>
  );
}
