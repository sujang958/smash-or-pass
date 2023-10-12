import { FastifyPluginCallback } from "fastify"
import { V1_GAMES } from "./games.js"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js"
import { HttpError } from "../../utils/errors.js"

export const V1: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(V1_GAMES) // this doesnt work fuck

  fastify.setErrorHandler((err, req, reply) => {
    console.log(err)

    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code == "P2025")
        return reply.status(404).send({ ok: false, message: "Not Found" })
    } else if (err instanceof HttpError) {
      return reply
        .status(err.httpCode)
        .send({ ok: false, message: err.message })
    }

    return reply.status(500).send({
      ok: false,
      message: "I can't tell what it is. But there is just an error",
    })
  })

  done()
}
