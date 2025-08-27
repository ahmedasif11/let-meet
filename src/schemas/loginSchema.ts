import { z } from 'zod';

const loginSchema = z.object({
  email: z
    .email({ message: 'Email is required' })
    .regex(
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
      { message: 'Invalid email address' }
    ),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .regex(/^\S*$/, { message: 'Password must not contain spaces' }),
});

export default loginSchema;
