import jwt from 'jsonwebtoken';

export function createVerificationToken(userId: string): string {
  const secret = process.env.EMAIL_VERIFICATION_SECRET;
  
  if (!secret || secret === 'your_email_verification_secret_here') {
    throw new Error('EMAIL_VERIFICATION_SECRET is not configured');
  }
  
  const token = jwt.sign({ userId }, secret, { expiresIn: '1h' });
  return token;
}
