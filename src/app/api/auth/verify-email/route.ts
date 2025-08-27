import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import userModel from '@/models/user.model';
import connectToDB from '@/lib/db/db.connect';

export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    const { token, otp } = await request.json();

    const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET!);
    const { userId } = decoded as { userId: string };

    const user = await userModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: 'Email already verified' },
        { status: 400 }
      );
    }

    if (user.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
