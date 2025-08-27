import jwt from 'jsonwebtoken';

export function createVerificationToken(userId: string): string {
  const secret = process.env.EMAIL_VERIFICATION_SECRET!;
  const token = jwt.sign({ userId }, secret, { expiresIn: '1h' });
  return token;
}
