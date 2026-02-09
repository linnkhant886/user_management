import { z } from 'zod';

export const createAdminUserSchema = z.object({
  name: z.string().min(2, { message: "Minimum 2 characters" }).max(100).trim(),
  username: z.string()
    .min(4, { message: 'Username အနည်းဆုံး ၄ လုံး' })
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username မှာ စာလုံး၊ ဂဏန်း၊ underscore ပဲ သုံးလို့ရတယ်' })
    .trim(),
  email: z.string().email({ message: 'မမှန်ကန်တဲ့ email' }).optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().max(255).optional().nullable(),
  password: z.string().min(6, { message: 'Password အနည်းဆုံး ၆ လုံး' }),
  gender: z.boolean().optional().nullable(),
  isActive: z.boolean().default(true),
  roleId: z.number().int().positive({ message: 'Role ID လိုအပ်တယ်' }),
});

