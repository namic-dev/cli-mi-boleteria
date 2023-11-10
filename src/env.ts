import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  server: {
    MIBOLETERIA_API_BASE_URL: z
      .string()
      .url()
      .default("https://miboleteria.com.ar"),
  },
  runtimeEnv: process.env,
})
