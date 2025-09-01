import userModel from '@/models/user.model';
import signUpSchema from '@/schemas/signUpSchema';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectToDB from '@/lib/db/db.connect';
import generateOTP from '@/lib/utils/generateOTP';
import verifyEmail from '@/lib/verification/verify-email';
import { createVerificationToken } from '@/lib/utils/generateToken';

const OTP_EXPIRY_MINUTES = 5;

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const body = await request.json();

    const validation = signUpSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: validation.error,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    const existingUser = await userModel.findOne({ email });

    if (existingUser?.isVerified) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 1000);

    const emailVerification = await verifyEmail({
      to: email,
      subject: 'Letmeet - Verification Email',
      name,
      otp,
      otpExpiresAt,
    });

    if (!emailVerification.success) {
      return NextResponse.json(
        { success: false, message: emailVerification.message },
        { status: 500 }
      );
    }

    if (existingUser && !existingUser.isVerified) {
      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.otp = otp;
      existingUser.otpExpiresAt = otpExpiresAt;
      await existingUser.save();
    } else {
      const newUser = new userModel({
        name,
        email,
        password: hashedPassword,
        isVerified: false,
        otp,
        otpExpiresAt,
        provider: 'credentials',
      });

      await newUser.save();
    }

    const user = await userModel.findOne({ email }).select('_id');
    const token = createVerificationToken(user?._id as string);

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        data: { token },
      },
      { status: 201 }
    );
  } catch (error) {
    console.log('Signup error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
