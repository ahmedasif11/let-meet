'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Video,
  Calendar,
  Users,
  Settings,
  LogOut,
  Plus,
  Clock,
  Home,
  MessageSquare,
  Phone,
  Menu,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { ThemeToggle } from '@/components/theme';

export function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = {
    id: session.user._id || '',
    name: session.user.name || 'User',
    email: session.user.email || '',
    avatar: session.user.image || '',
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/login' });
  };

  const recentCalls = [
    {
      id: '1',
      title: 'Team Standup',
      participants: ['Alice', 'Bob', 'Charlie'],
      time: '2 hours ago',
      duration: '45 min',
      type: 'video',
    },
    {
      id: '2',
      title: 'Client Presentation',
      participants: ['Sarah', 'Mike'],
      time: 'Yesterday',
      duration: '1h 30min',
      type: 'video',
    },
    {
      id: '3',
      title: 'Quick Sync',
      participants: ['David'],
      time: '2 days ago',
      duration: '15 min',
      type: 'audio',
    },
  ];

  const upcomingMeetings = [
    {
      id: '1',
      title: 'Product Review',
      time: 'Today, 3:00 PM',
      participants: 5,
    },
    {
      id: '2',
      title: 'All Hands',
      time: 'Tomorrow, 10:00 AM',
      participants: 12,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
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

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-4 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 mb-8">
          <Video className="h-8 w-8 text-blue-600 shrink-0" />
          <h1 className="text-xl font-semibold truncate">Let Meet</h1>
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

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed top bar for main content: theme toggle only, so it never overlaps page content */}
      <div className="hidden lg:flex fixed top-0 right-0 left-64 h-12 border-b border-border bg-background/95 backdrop-blur z-30 items-center justify-end px-4">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 pt-16 lg:pt-12 p-4 sm:p-6">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Welcome back, {user.name}!
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Here&apos;s what&apos;s happening with your calls today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Start a call or schedule a meeting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href="/meet">
                    <Phone className="h-4 w-4 mr-2" />
                    Start New Call
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/calendar">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/teams">
                    <Users className="h-4 w-4 mr-2" />
                    Create Team
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Calls */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Calls</CardTitle>
                <CardDescription>
                  Your recent video and audio calls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCalls.map((call) => (
                    <div
                      key={call.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-full ${call.type === 'video' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}
                        >
                          {call.type === 'video' ? (
                            <Video className="h-4 w-4" />
                          ) : (
                            <Phone className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{call.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {call.participants.join(', ')} • {call.duration}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {call.time}
                        </p>
                        <Badge variant="outline" className="mt-1">
                          {call.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Meetings</CardTitle>
              <CardDescription>
                Meetings scheduled for today and tomorrow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-orange-100 text-orange-600">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">{meeting.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {meeting.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">
                        {meeting.participants} participants
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
