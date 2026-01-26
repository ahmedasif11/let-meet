'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getBackendUrl } from '@/lib/utils/api';

function VerifyEmailContent() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const otpFromUrl = searchParams.get('otp');

  useEffect(() => {
    if (otpFromUrl) {
      setDevOtp(otpFromUrl);
      const otpArray = otpFromUrl.split('').slice(0, 6);
      const newOtp = Array(6).fill('');
      otpArray.forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      setOtp(newOtp);
    }
  }, [otpFromUrl]);

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

      const response = await fetch(`${getBackendUrl()}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, otp: otpCode }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Email verified successfully!');
        router.push('/auth/login?verified=true');
      } else {
        toast.error(data.message || data.error || 'Verification failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      // Note: resend-otp endpoint needs to be implemented in backend if needed
      const response = await fetch(`${getBackendUrl()}/api/auth/resend-otp`, {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md p-4 sm:p-6 space-y-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">Verify Your Email</h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Please enter the 6-digit code sent to your email
          </p>
          {devOtp && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                Development Mode
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
              Your OTP: <span className="font-mono font-bold text-lg">{devOtp}</span>
              </p>
            </div>
          )}
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
              className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl focus:ring-2 focus:ring-blue-500"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
            />
          ))}
        </div>

        <Button
          className="w-full h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
          onClick={() => handleVerify()}
          disabled={otp.some((digit) => !digit) || isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </span>
          ) : (
            'Verify Email'
          )}
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

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-[400px] p-6 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Loading...</h1>
          </div>
        </Card>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
