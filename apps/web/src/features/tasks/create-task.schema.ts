import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(50, 'Título muito longo'),

  description: z
    .string()
    .optional(),

  status: z.enum([
    'TODO',
    'IN_PROGRESS',
    'REVIEW',
    'DONE',
  ]),

  priority: z.enum([
    'LOW',
    'MEDIUM',
    'HIGH',
    'URGENT',
  ]),
})

export type CreateTaskFormData = z.infer<
  typeof createTaskSchema
>
