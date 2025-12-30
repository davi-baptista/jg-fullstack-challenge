import z from 'zod';

export const envSchema = z.object({
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  RABBITMQ_URL: z.string(),
  RABBITMQ_NOTIFICATIONS_QUEUE: z.string(),
  RABBITMQ_TASK_EVENTS_QUEUE: z.string()
});

export type Env = z.infer<typeof envSchema>;
