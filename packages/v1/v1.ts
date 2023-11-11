import { FastifyPluginCallback } from "fastify"
import { V1_GAMES } from "./routes/games.js"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js"
import { HttpError } from "./utils/errors.js"

const V1: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(V1_GAMES)

  fastify.setErrorHandler((err, req, reply) => {
    console.log(err)

    if (err instanceof PrismaClientKnownRequestError)
      switch (err.code) {
        case "P2025":
          return reply.status(404).send({ ok: false, message: "Not Found" })
        default:
          break
      }

    if (err instanceof HttpError)
      return reply
        .status(err.httpCode)
        .send({ ok: false, message: err.message })
    else if (err.statusCode === 429)
      return reply.code(429).send({ ok: false, message: err.message })
    else
      return reply.status(500).send({
        ok: false,
        message: "I can't tell what it is. But there is just an error",
      })
  })

  done()
}

export default V1
