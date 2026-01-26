'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Video,
  Copy,
  Check,
  Share2,
  Users,
  ArrowRight,
  Link as LinkIcon,
} from 'lucide-react';

interface CallInfoScreenProps {
  roomId: string;
  onContinue: () => void;
  onCancel: () => void;
}

export function CallInfoScreen({
  roomId,
  onContinue,
  onCancel,
}: CallInfoScreenProps) {
  const [copied, setCopied] = useState(false);
  const [copiedRoomId, setCopiedRoomId] = useState(false);

  const roomLink =
    typeof window !== 'undefined'
      ? `${window.location.origin}/meet?roomId=${roomId}`
      : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(roomLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopiedRoomId(true);
      setTimeout(() => setCopiedRoomId(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Video className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-2xl">Your Meeting is Ready</CardTitle>
              <CardDescription className="text-base mt-1">
                Share this information with your participants
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Meeting Link */}
          <div className="space-y-3">
            <label className="text-sm font-semibold flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Meeting Link
            </label>
            <div className="flex gap-2">
              <Input
                value={roomLink}
                readOnly
                className="flex-1 font-mono text-sm bg-muted"
              />
              <Button
                onClick={handleCopyLink}
                variant={copied ? 'default' : 'outline'}
                size="icon"
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            {copied && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="h-3 w-3" />
                Link copied to clipboard!
              </p>
            )}
          </div>

          {/* Room ID */}
          <div className="space-y-3">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Meeting ID
            </label>
            <div className="flex gap-2">
              <Input
                value={roomId}
                readOnly
                className="flex-1 font-mono text-sm bg-muted"
              />
              <Button
                onClick={handleCopyRoomId}
                variant={copiedRoomId ? 'default' : 'outline'}
                size="icon"
                className="shrink-0"
              >
                {copiedRoomId ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            {copiedRoomId && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="h-3 w-3" />
                Meeting ID copied!
              </p>
            )}
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  How to share
                </p>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                  <li>Copy the meeting link and share it via email, chat, or message</li>
                  <li>Or share just the Meeting ID - participants can enter it when joining</li>
                  <li>Anyone with the link or ID can join your meeting</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={onContinue}
            >
              Continue to Setup
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
