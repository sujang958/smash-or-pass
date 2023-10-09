import "dotenv/config"

import fastify from "fastify"
import multipart from "@fastify/multipart"
import { V1 } from "./routes/v1/v1.js"

if (!process.env.PORT || !process.env.FILE_PATH) process.exit(1)

const app = fastify({ http2: true, logger: true })

app.register(multipart, { limits: { fileSize: 4.096e9, fieldSize: 4.096e6 } })
app.register(V1, { prefix: "/v1" })

app
  .listen({ port: Number(process.env.PORT) })
  .then((v) => console.log(v, "Listening", process.env.PORT))
