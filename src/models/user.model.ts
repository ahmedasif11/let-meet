import { Schema, model, Document, Model } from 'mongoose';
import mongoose from 'mongoose';

interface User extends Document {
  name: string;
  email: string;
  password?: string;
  isVerified: boolean;
  avatar?: string;
  otp?: string;
  otpExpiresAt?: Date;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>(
  {
    name: { type: String, required: [true, 'Name is required'] },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
        'Please enter a valid email address',
      ],
    },

    password: {
      type: String,
      required: false,
    },

    provider: {
      type: String,
      enum: ['credentials', 'google', 'github'],
      required: false,
    },

    isVerified: { type: Boolean, default: false },

    avatar: { type: String, required: false },

    otp: {
      type: String,
      required: false,
      minlength: [6, 'OTP must be 6 characters long'],
      maxlength: [6, 'OTP must be 6 characters long'],
    },

    otpExpiresAt: { type: Date, required: false },
  },
  {
    timestamps: true,
  }
);

const userModel =
  (mongoose.models.User as Model<User>) || model<User>('User', userSchema);

export default userModel;
