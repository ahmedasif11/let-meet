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
import { Copy, Check, X, Share2 } from 'lucide-react';

interface ShareRoomLinkProps {
  roomId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareRoomLink({ roomId, isOpen, onClose }: ShareRoomLinkProps) {
  const [copied, setCopied] = useState(false);
  
  const roomLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/meet?roomId=${roomId}`
    : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-blue-600" />
              <CardTitle>Share Meeting Link</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Share this link with others to let them join your meeting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Meeting Link</label>
            <div className="flex gap-2">
              <Input
                value={roomLink}
                readOnly
                className="flex-1 font-mono text-sm"
              />
              <Button
                onClick={handleCopy}
                variant={copied ? 'default' : 'outline'}
                size="icon"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Room ID</label>
            <div className="flex gap-2">
              <Input
                value={roomId}
                readOnly
                className="flex-1 font-mono text-sm"
              />
              <Button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(roomId);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  } catch (err) {
                    console.error('Failed to copy:', err);
                  }
                }}
                variant="outline"
                size="icon"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {copied && (
            <p className="text-sm text-green-600 flex items-center gap-1">
              <Check className="h-3 w-3" />
              Copied to clipboard!
            </p>
          )}

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Anyone with this link can join your meeting. Make sure to share it only with people you want to invite.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
