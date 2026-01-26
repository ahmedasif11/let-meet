import { z } from 'zod';

const signUpSchema = z
  .object({
    name: z.string().min(1, { message: 'Name must be valid' }).max(100, {
      message: 'Name must be less than 100 characters',
    }),
    email: z
      .email({ message: 'Email is required' })
      .regex(
        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
        { message: 'Invalid email address' }
      ),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .max(30, { message: 'Password must be less than 30 characters long' })
      .regex(/^\S*$/, { message: 'Password must not contain spaces' }),

    confirmPassword: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .max(30, { message: 'Password must be less than 30 characters long' })
      .regex(/^\S*$/, { message: 'Password must not contain spaces' }),

    isVerified: z.boolean().default(false),
    avatar: z.string().optional(),
  })

  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export default signUpSchema;
