import { Resend } from 'resend';

let resendInstance: Resend | null = null;
let initialized = false;

export function getResend(): Resend | null {
  if (initialized) {
    return resendInstance;
  }

  initialized = true;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    const maskedKey = resendApiKey.length > 10 
      ? resendApiKey.substring(0, 10) + '...' 
      : '***';
    console.log('✅ RESEND_API_KEY found:', maskedKey);
  } else {
    console.log('⚠️  RESEND_API_KEY not found in environment variables');
  }

  const isValidKey = resendApiKey && 
    resendApiKey.trim() !== '' && 
    resendApiKey.trim() !== 'your_resend_api_key_here' &&
    resendApiKey.trim().startsWith('re_');

  if (isValidKey) {
    resendInstance = new Resend(resendApiKey.trim());
    console.log('✅ Resend email service initialized successfully');
    return resendInstance;
  } else {
    if (resendApiKey) {
      console.log('⚠️  Resend API key found but invalid format (should start with "re_")');
    } else {
      console.log('⚠️  Resend email service not initialized - using dev mode');
    }
    return null;
  }
}
