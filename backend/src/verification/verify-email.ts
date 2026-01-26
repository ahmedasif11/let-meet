import { resend } from '../config/resend.config';
import { render } from '@react-email/render';
import VerificationEmail from '../email/verification-email';

async function verifyEmail({
  to,
  subject,
  name,
  otp,
  otpExpiresAt,
}: {
  to: string;
  subject: string;
  name: string;
  otp: string;
  otpExpiresAt: Date;
}) {
  try {
    if (!resend) {
      console.warn('Resend API key not configured. Email sending is disabled.');
      console.log(`[DEV MODE] Verification email would be sent to ${to} with OTP: ${otp}`);
      return {
        success: true,
        message: 'Verification email sent successfully (dev mode)',
      };
    }

    const emailHtml = await render(
      VerificationEmail({ name, otp, otpExpiresAt })
    );

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html: emailHtml,
    });

    return {
      success: true,
      message: 'Verification email sent successfully',
    };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return {
      success: false,
      message: 'Error sending verification email',
    };
  }
}

export default verifyEmail;
