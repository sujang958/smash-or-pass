import { FastifyPluginCallback } from "fastify"
import { prisma } from "../../utils/prisma.js"
import sharp from "sharp"
import { join } from "path"
import { outputFile } from "fs-extra"
import { BadRequestError } from "../../utils/errors.js"
import { newGameBody } from "../../types/games.js"

export const toImgPath = (path: string) => join(process.env.FILE_PATH!, path)

export const V1_GAMES: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.get("/games", async (req, reply) =>
    reply.send(await prisma.game.findMany({ include: { images: true } })),
  )

  fastify.get<{ Params: { id: string } }>("/games/:id", async (req, reply) =>
    reply.send(
      await prisma.game.findUniqueOrThrow({
        include: { images: true },
        where: { id: req.params?.id ?? "" },
      }),
    ),
  )

  fastify.post("/games/new", async (req, reply) => {
    const body = newGameBody.parse(req.body)

    const files = req.files()

    if ((await files.next()).done)
      throw new BadRequestError("There must be more than zero files")

    const game = await prisma.game.create({
      data: { ...body },
    })

    const buffers: Buffer[] = []

    for await (const file of files) buffers.push(await file.toBuffer())

    const compressed = await Promise.all(
      buffers.map(async (buffer) => await sharp(buffer).webp().toBuffer()),
    )

    await prisma.$transaction(
      compressed.map((img, i) => {
        outputFile(toImgPath(`${game.id}/${i}.webp`), img)
        return prisma.image.create({
          data: {
            pass: 0,
            smash: 0,
            path: `/imgs/${game.id}/${i}.webp`,
            game: { connect: { id: game.id } },
            name: game.name,
          },
        })
      }),
    )

    return await prisma.game.findUnique({ where: { id: game.id } })
  })

  done()
}
