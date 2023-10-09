import { FastifyPluginCallback } from "fastify"
import { prisma } from "../../utils/prisma.js"
import sharp from "sharp"



export const V1_GAMES: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.get("/games", async (req, reply) =>
    reply.send(await prisma.game.findMany({ include: { images: true } })),
  )

  fastify.get<{ Params: { id: string } }>("/games/[id]", async (req, reply) =>
    reply.send(
      await prisma.game.findUnique({
        include: { images: true },
        where: { id: req.params?.id ?? "" },
      }),
    ),
  )

  fastify.post("/games", async (req, reply) => {
    const files = req.files()

    for await (const file of files) {
      sharp(await file.toBuffer()).webp().toFile()
    }
  })

  // fastify.addHook("onError", async (req, reply, error) => {
  //   error.
  // })

  done()
}
