import { FastifyPluginCallback } from "fastify"
import { V1_GAMES } from "./games.js"

export const V1: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(V1_GAMES)

  done()
}
