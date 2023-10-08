import "dotenv/config"

import fastify from "fastify"
import multipart from "@fastify/multipart"
import { saveImage } from "./utils/fs.js"
import sharp from "sharp"

const app = fastify({ http2: true, logger: true })

app.register(multipart, { limits: { fileSize: 4.096e9, fieldSize: 4.096e6 } })

app.get("/", async (req, reply) => {
  const files = req.files()
  const promises = []

  let i = 0
  for await (const file of files) {
    promises.push(
      saveImage({
        path: i,
        content: await sharp(await file.toBuffer())
          .webp()
          .toBuffer(),
      }),
    )
  }
})

app
  .listen({ port: Number(process.env.PORT) })
  .then((v) => console.log(v, "Listening", process.env.PORT))
