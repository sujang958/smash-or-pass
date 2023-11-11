import { z } from "zod"

export const newGameBody = z.object({
  name: z.string(),
  description: z.string(),
  imageNames: z.array(z.string()),
  files: z.union([z.array(z.any()), z.any()]),
})
