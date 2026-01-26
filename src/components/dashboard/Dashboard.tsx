'use client';

import React from 'react';
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
  Sun,
  Moon,
  Home,
  MessageSquare,
  Phone,
} from 'lucide-react';
import Link from 'next/link';

export function Dashboard() {
  const user = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
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
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-4">
        <div className="flex items-center mb-8">
          <Video className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-xl font-semibold">VideoConnect</h1>
        </div>

        <nav className="space-y-2">
          <Button variant="default" className="w-full justify-start">
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="h-4 w-4 mr-2" />
            Teams
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="h-4 w-4 mr-2" />
            Settings
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
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user.name}!
          </h2>
          <p className="text-muted-foreground">
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
                  <Link href="/call/new">
                    <Phone className="h-4 w-4 mr-2" />
                    Start New Call
                  </Link>
                </Button>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Create Team
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
