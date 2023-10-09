import { FastifyPluginCallback } from "fastify"
import { V1_GAMES } from "./games.js"

export const V1: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(V1_GAMES) // this doesnt work fuck

  fastify.setErrorHandler((err, req, reply) => {
    console.log(err)

    throw err
  })

  done()
}
