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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar } from '@/components/ui/avatar';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Video,
} from 'lucide-react';
import { useSession } from 'next-auth/react';

export function SettingsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    meetingReminders: true,
  });
  const [videoSettings, setVideoSettings] = useState({
    defaultCamera: true,
    defaultMic: true,
    noiseCancellation: true,
    hdVideo: true,
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowScreenShare: true,
  });

  const user = {
    name: session?.user?.name || 'User',
    email: session?.user?.email || '',
    avatar: session?.user?.image || '',
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <SettingsIcon className="h-8 w-8 text-blue-600" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar src={user.avatar} alt={user.name} className="h-20 w-20" />
                <div className="flex-1">
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, GIF or PNG. Max size of 2MB
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user.email} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  placeholder="Tell us about yourself"
                  defaultValue=""
                />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, email: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications in browser
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, push: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="meeting-reminders">Meeting Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminded before meetings start
                  </p>
                </div>
                <Switch
                  id="meeting-reminders"
                  checked={notifications.meetingReminders}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, meetingReminders: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Video & Audio Settings
              </CardTitle>
              <CardDescription>
                Configure your video calling preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="default-camera">Camera On by Default</Label>
                  <p className="text-sm text-muted-foreground">
                    Start with camera enabled
                  </p>
                </div>
                <Switch
                  id="default-camera"
                  checked={videoSettings.defaultCamera}
                  onCheckedChange={(checked) =>
                    setVideoSettings({ ...videoSettings, defaultCamera: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="default-mic">Microphone On by Default</Label>
                  <p className="text-sm text-muted-foreground">
                    Start with microphone enabled
                  </p>
                </div>
                <Switch
                  id="default-mic"
                  checked={videoSettings.defaultMic}
                  onCheckedChange={(checked) =>
                    setVideoSettings({ ...videoSettings, defaultMic: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="noise-cancellation">Noise Cancellation</Label>
                  <p className="text-sm text-muted-foreground">
                    Reduce background noise automatically
                  </p>
                </div>
                <Switch
                  id="noise-cancellation"
                  checked={videoSettings.noiseCancellation}
                  onCheckedChange={(checked) =>
                    setVideoSettings({ ...videoSettings, noiseCancellation: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="hd-video">HD Video Quality</Label>
                  <p className="text-sm text-muted-foreground">
                    Use high definition video (uses more bandwidth)
                  </p>
                </div>
                <Switch
                  id="hd-video"
                  checked={videoSettings.hdVideo}
                  onCheckedChange={(checked) =>
                    setVideoSettings({ ...videoSettings, hdVideo: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Control your privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-visibility">Profile Visibility</Label>
                <select
                  id="profile-visibility"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={privacy.profileVisibility}
                  onChange={(e) =>
                    setPrivacy({ ...privacy, profileVisibility: e.target.value })
                  }
                >
                  <option value="public">Public</option>
                  <option value="team">Team Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-online">Show Online Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Let others see when you&apos;re online
                  </p>
                </div>
                <Switch
                  id="show-online"
                  checked={privacy.showOnlineStatus}
                  onCheckedChange={(checked) =>
                    setPrivacy({ ...privacy, showOnlineStatus: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allow-screenshare">Allow Screen Sharing</Label>
                  <p className="text-sm text-muted-foreground">
                    Let others share their screen with you
                  </p>
                </div>
                <Switch
                  id="allow-screenshare"
                  checked={privacy.allowScreenShare}
                  onCheckedChange={(checked) =>
                    setPrivacy({ ...privacy, allowScreenShare: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>
                Manage your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full sm:w-auto">
                Change Password
              </Button>
              <Button variant="outline" className="w-full sm:w-auto">
                Download Data
              </Button>
              <Separator />
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                disabled
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
