'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Video, Users, Link as LinkIcon, Copy, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import generateRandomId from '@/lib/utils/generateRandomId';
import { ThemeToggle } from '@/components/theme';

type View = 'landing' | 'start' | 'join';

export function MeetLanding() {
  const router = useRouter();
  const [view, setView] = useState<View>('landing');
  const [roomIdInput, setRoomIdInput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleStartNewCall = () => {
    const newRoomId = generateRandomId();
    router.push(`/meet?roomId=${newRoomId}&action=start`);
  };

  const handleJoinCall = () => {
    if (roomIdInput.trim()) {
      // Extract room ID from URL if full link is pasted
      let roomId = roomIdInput.trim();
      try {
        const url = new URL(roomId);
        const params = new URLSearchParams(url.search);
        roomId = params.get('roomId') || roomId;
      } catch {
        // Not a URL, use as-is
      }
      router.push(`/meet?roomId=${roomId}&action=join`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Video className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Let Meet
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Start or join a video meeting
          </p>
        </div>

        {view === 'landing' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleStartNewCall}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Video className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle>Start a new meeting</CardTitle>
                </div>
                <CardDescription>
                  Create a new meeting room and invite others
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="lg">
                  Start Meeting
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setView('join')}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle>Join a meeting</CardTitle>
                </div>
                <CardDescription>
                  Enter a meeting ID or link to join
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="lg">
                  Join Meeting
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {view === 'join' && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle>Join a Meeting</CardTitle>
                </div>
                <CardDescription>
                  Paste the meeting link or enter the meeting ID
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Meeting Link or ID</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://yoursite.com/meet?roomId=xxx or just the room ID"
                      value={roomIdInput}
                      onChange={(e) => setRoomIdInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleJoinCall();
                        }
                      }}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You can paste the full meeting link or just the room ID
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setView('landing')}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleJoinCall}
                    disabled={!roomIdInput.trim()}
                  >
                    Join Meeting
                  </Button>
                </div>
              </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
