import { z } from "zod"

export const newGameBody = z.object({
  name: z.string(),
  description: z.string(),
})
