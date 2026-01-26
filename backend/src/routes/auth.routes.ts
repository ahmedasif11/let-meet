import express, { Request, Response } from 'express';
import userModel from '../models/user.model';
import signUpSchema from '../schemas/signUpSchema';
import loginSchema from '../schemas/loginSchema';
import bcrypt from 'bcrypt';
import connectToDB from '../db/db.connect';
import generateOTP from '../utils/generateOTP';
import verifyEmail from '../verification/verify-email';
import { createVerificationToken } from '../utils/generateToken';
import jwt from 'jsonwebtoken';

const router = express.Router();

const OTP_EXPIRY_MINUTES = 5;

// Signup route
router.post('/signup', async (req: Request, res: Response) => {
  try {
    await connectToDB();

    const validation = signUpSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error,
      });
    }

    const { name, email, password } = validation.data;

    const existingUser = await userModel.findOne({ email });

    if (existingUser?.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    const emailVerification = await verifyEmail({
      to: email,
      subject: 'Letmeet - Verification Email',
      name,
      otp,
      otpExpiresAt,
    });

    if (!emailVerification.success) {
      return res.status(500).json({
        success: false,
        message: emailVerification.message,
      });
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
    if (!user || !user._id) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create user',
      });
    }
    const token = createVerificationToken(user._id.toString());

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { token },
    });
  } catch (error) {
    console.log('Signup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

// Verify email route
router.post('/verify-email', async (req: Request, res: Response) => {
  try {
    await connectToDB();
    const { token, otp } = req.body;

    const secret = process.env.EMAIL_VERIFICATION_SECRET;
    if (!secret || secret === 'your_email_verification_secret_here') {
      return res.status(500).json({
        error: 'Email verification is not configured',
      });
    }

    const decoded = jwt.verify(token, secret);
    const { userId } = decoded as { userId: string };

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({
        error: 'Email already verified',
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    return res.status(200).json({
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    return res.status(500).json({
      error: 'Failed to verify email',
    });
  }
});

// Login route (for NextAuth credentials provider)
router.post('/login', async (req: Request, res: Response) => {
  try {
    await connectToDB();

    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error,
      });
    }

    const { email, password } = validation.data;

    const user = await userModel.findOne({ email });

    if (!user || !user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password',
      });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'You signed up with Google/GitHub. Use that to login.',
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.avatar || '',
        provider: user.provider,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

// Resend OTP route
router.post('/resend-otp', async (req: Request, res: Response) => {
  try {
    await connectToDB();
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const secret = process.env.EMAIL_VERIFICATION_SECRET;
    if (!secret || secret === 'your_email_verification_secret_here') {
      return res.status(500).json({
        error: 'Email verification is not configured',
      });
    }

    const decoded = jwt.verify(token, secret);
    const { userId } = decoded as { userId: string };

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({
        error: 'Email already verified',
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Send verification email
    const emailVerification = await verifyEmail({
      to: user.email,
      subject: 'Letmeet - Verification Email',
      name: user.name,
      otp,
      otpExpiresAt,
    });

    if (!emailVerification.success) {
      return res.status(500).json({
        error: emailVerification.message,
      });
    }

    // Update user with new OTP
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    return res.status(200).json({
      message: 'OTP resent successfully',
    });
  } catch (error) {
    console.error('Error resending OTP:', error);
    return res.status(500).json({
      error: 'Failed to resend OTP',
    });
  }
});

// OAuth user creation/update route (for Google/GitHub OAuth)
router.post('/oauth-user', async (req: Request, res: Response) => {
  try {
    await connectToDB();

    const { email, name, avatar, provider } = req.body;

    if (!email || !name || !provider) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      // Update existing user if needed
      if (!existingUser.avatar && avatar) {
        existingUser.avatar = avatar;
        await existingUser.save();
      }
      return res.status(200).json({
        success: true,
        message: 'User already exists',
      });
    }

    // Create new OAuth user
    const newUser = new userModel({
      email,
      name,
      avatar: avatar || '',
      isVerified: true,
      provider,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'OAuth user created successfully',
    });
  } catch (error) {
    console.error('OAuth user creation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

export default router;
