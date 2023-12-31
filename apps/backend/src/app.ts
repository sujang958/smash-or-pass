import "dotenv/config"

import fastify from "fastify"
import cors from "@fastify/cors"
import multipart from "@fastify/multipart"

import V1 from "v1/v1.js"

if (!process.env.PORT || !process.env.FILE_PATH) process.exit(1)

const app = fastify({ logger: true }) // In WSL, when http2 enabled, response 글자 깨짐

app.register(import("@fastify/rate-limit"), {
  global: false,
  max: 60 * 10,
  timeWindow: "1 minute",
})
app.register(cors)
app.register(multipart, {
  attachFieldsToBody: "keyValues",
  limits: { fileSize: (4.096e9 / 4) * 128, fieldSize: 4.096e6 },
})
app.register(V1, { prefix: "/v1" })

app
  .listen({ port: Number(process.env.PORT) })
  .then((v) => console.log(v, "Listening"))
