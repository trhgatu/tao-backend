// src/modules/test/test.validation.ts
import { z } from 'zod'

export const testSchema = z.object({
  name: z.string().min(3),
  age: z.number().min(18),
})
