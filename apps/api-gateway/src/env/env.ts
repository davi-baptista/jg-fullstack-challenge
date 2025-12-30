import z from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3000),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  RABBITMQ_URL: z.string(),
  RABBITMQ_AUTH_QUEUE: z.string(),
  RABBITMQ_TASKS_QUEUE: z.string(),
  RABBITMQ_NOTIFICATIONS_QUEUE: z.string(),
});

export type Env = z.infer<typeof envSchema>;
