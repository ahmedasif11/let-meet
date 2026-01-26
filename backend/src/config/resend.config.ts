import { Resend } from 'resend';

// Initialize Resend with API key, or null if not set (for development)
// The verify-email function will handle the case when resend is not properly configured
const resendApiKey = process.env.RESEND_API_KEY;

// Only create Resend instance if API key is provided and not a placeholder
export const resend = 
  resendApiKey && 
  resendApiKey.trim() !== '' && 
  resendApiKey !== 'your_resend_api_key_here'
    ? new Resend(resendApiKey.trim())
    : null;
