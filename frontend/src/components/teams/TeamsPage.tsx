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
import { Input } from '@/components/ui/input';
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
  Search,
  MoreVertical,
  UserPlus,
  Edit,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'member';
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  avatar: string;
  members: TeamMember[];
  isAdmin: boolean;
}

export function TeamsPage() {
  const user = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
  };

  const [teams] = useState<Team[]>([
    {
      id: '1',
      name: 'Product Development',
      description: 'Core product development team',
      memberCount: 8,
      avatar:
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=40&h=40&fit=crop&crop=face',
      isAdmin: true,
      members: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@gmail.com',
          avatar:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
          role: 'admin',
          status: 'online',
        },
        {
          id: '2',
          name: 'Alice Johnson',
          email: 'alice.johnson@gmail.com',
          avatar:
            'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
          role: 'member',
          status: 'online',
        },
        {
          id: '3',
          name: 'Bob Smith',
          email: 'bob.smith@gmail.com',
          avatar:
            'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop&crop=face',
          role: 'member',
          status: 'away',
          lastSeen: '2 hours ago',
        },
      ],
    },
    {
      id: '2',
      name: 'Marketing Team',
      description: 'Digital marketing and growth',
      memberCount: 5,
      avatar:
        'https://images.unsplash.com/photo-1551434678-e076c223a692?w=40&h=40&fit=crop&crop=face',
      isAdmin: false,
      members: [
        {
          id: '4',
          name: 'Sarah Wilson',
          email: 'sarah.wilson@gmail.com',
          avatar:
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
          role: 'admin',
          status: 'online',
        },
      ],
    },
  ]);

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateTeam = () => {
    // Handle team creation
    console.log('Creating new team');
  };

  const handleJoinTeam = () => {
    // Handle joining team
    console.log('Joining team');
  };

  const handleStartCall = (teamId: string) => {
    // Handle starting team call
    console.log('Starting call for team:', teamId);
  };

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-4">
        <div className="flex items-center mb-8">
          <Video className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-xl font-semibold">VideoConnect</h1>
        </div>

        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/dashboard">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </Button>
          <Button variant="default" className="w-full justify-start">
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold">Teams</h2>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleJoinTeam}>
                <UserPlus className="h-4 w-4 mr-2" />
                Join Team
              </Button>
              <Button onClick={handleCreateTeam}>
                <Plus className="h-4 w-4 mr-2" />
                Create Team
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">
            Manage your teams and collaborate with members
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Teams List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Teams</h3>
            {filteredTeams.map((team) => (
              <Card
                key={team.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTeam?.id === team.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedTeam(team)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={team.avatar}
                      alt={team.name}
                      className="h-12 w-12"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{team.name}</h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {team.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {team.memberCount} members
                        </Badge>
                        {team.isAdmin && (
                          <Badge variant="secondary" className="text-xs">
                            Admin
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartCall(team.id);
                        }}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Team Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Team Details</h3>
            {selectedTeam ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={selectedTeam.avatar}
                      alt={selectedTeam.name}
                      className="h-16 w-16"
                    />
                    <div>
                      <CardTitle>{selectedTeam.name}</CardTitle>
                      <CardDescription>
                        {selectedTeam.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Members ({selectedTeam.memberCount})
                      </span>
                      {selectedTeam.isAdmin && (
                        <Button variant="outline" size="sm">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Member
                        </Button>
                      )}
                    </div>

                    <div className="space-y-3">
                      {selectedTeam.members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <Avatar src={member.avatar} alt={member.name} />
                              <div
                                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                                  member.status === 'online'
                                    ? 'bg-green-500'
                                    : member.status === 'away'
                                      ? 'bg-yellow-500'
                                      : 'bg-gray-400'
                                }`}
                              />
                            </div>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {member.email}
                              </p>
                              {member.lastSeen && (
                                <p className="text-xs text-muted-foreground">
                                  Last seen {member.lastSeen}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                member.role === 'admin'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {member.role}
                            </Badge>
                            {selectedTeam.isAdmin && member.id !== user.id && (
                              <div className="flex space-x-1">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-2 pt-4 border-t">
                      <Button className="flex-1">
                        <Video className="h-4 w-4 mr-2" />
                        Start Team Call
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Team Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium mb-2">Select a Team</h4>
                  <p className="text-muted-foreground">
                    Choose a team from the list to view details and manage
                    members
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
