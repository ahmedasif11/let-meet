'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function VerifyEmail() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  if (!token) {
    router.push('/auth/signup');
  }

  useEffect(() => {
    const firstInput = document.getElementById('otp-0');
    firstInput?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    const pastedText = e.clipboardData
      .getData('text')
      .replace(/[^a-zA-Z0-9]/g, '');

    const pastedDigits = pastedText.slice(0, 6).split('');

    const newOtp = Array(6).fill('');
    for (let i = 0; i < pastedDigits.length; i++) {
      newOtp[i] = pastedDigits[i];
    }
    setOtp(newOtp);

    if (pastedDigits.length === 6) {
      handleVerify(newOtp.join(''));
    } else {
      const nextInput = document.getElementById(`otp-${pastedDigits.length}`);
      nextInput?.focus();
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[a-zA-Z0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    if (index === 5 && value) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (otpString?: string) => {
    try {
      setIsLoading(true);
      const otpCode = otpString || otp.join('');

      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, otp: otpCode }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Email verified successfully!');
        router.push('/auth/login');
      } else {
        toast.error(data.message || 'Verification failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('OTP resent successfully!');
        setResendTimer(60);
      } else {
        toast.error(data.message || 'Failed to resend OTP');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px] p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Verify Your Email</h1>
          <p className="text-gray-500">
            Please enter the 6-digit code sent to your email
          </p>
        </div>

        <div className="flex gap-2 justify-center">
          {otp.map((digit, index) => (
            <Input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={1}
              aria-label={`Digit ${index + 1}`}
              className="w-12 h-12 text-center text-xl focus:ring-2 focus:ring-blue-500"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
            />
          ))}
        </div>

        <Button
          className="w-full"
          onClick={() => handleVerify()}
          disabled={otp.some((digit) => !digit) || isLoading}
        >
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">
            Didn&apos;t receive the code?
          </p>
          {resendTimer > 0 ? (
            <p className="text-sm">Resend code in {resendTimer} seconds</p>
          ) : (
            <Button
              variant="link"
              className="text-sm"
              onClick={handleResendOtp}
            >
              Resend Code
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
