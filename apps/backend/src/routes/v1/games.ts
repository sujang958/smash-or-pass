import { FastifyPluginCallback } from "fastify"
import { prisma } from "../../utils/prisma.js"
import sharp from "sharp"
import { join } from "path"
import { outputFile } from "fs-extra"
import { newGameBody } from "../../types/games.js"
import { HttpError } from "../../utils/errors.js"
import fastifyMultipart from "@fastify/multipart"

export const toImgPath = (path: string) => join(process.env.FILE_PATH!, path)

export const V1_GAMES: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.get<{ Querystring: { limit: number } }>(
    "/games",
    async (req, reply) =>
      reply.send(
        await prisma.game.findMany({
          include: { images: true },
          orderBy: { createdAt: "asc" },
          take: Number(req.query?.limit) ?? 50,
        }),
      ),
  )

  fastify.get<{ Params: { id: string } }>("/games/:id", async (req, reply) =>
    reply.send(
      await prisma.game.findUniqueOrThrow({
        include: { images: true },
        where: { id: req.params?.id ?? "" },
      }),
    ),
  )

  fastify.post<{ Body: Record<string, any> }>(
    "/games/new",
    { config: { rateLimit: { max: 2, timeWindow: "1 minute" } } },
    async (req, reply) => {
      console.log(req.body)

      const body = newGameBody.parse(req.body)

      const files: Buffer[] = Array.isArray(req.body.files)
        ? req.body.files
        : [req.body.files]

      const game = await prisma.game.create({
        data: { ...body },
      })

      if (files.length > 1024)
        throw new HttpError(400, "The max number of images is 1024")

      const compressed = await Promise.all(
        files.map(async (buffer) => await sharp(buffer).webp().toBuffer()),
      )

      const results = await Promise.allSettled(
        compressed.map((img, i) =>
          outputFile(toImgPath(`${game.id}/${i}.webp`), img),
        ),
      )

      const rejectedIndexes = results
        .map((result, i) => (result.status == "rejected" ? i : null))
        .filter((v): v is number => v !== null)

      if (rejectedIndexes.length >= 1)
        throw new HttpError(
          400,
          `Images at ${rejectedIndexes
            .map((v) => v + 1)
            .join(", ")} got failed`,
        )

      await prisma.$transaction(
        compressed.map((_, i) => {
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

      return reply.send(
        await prisma.game.findUnique({ where: { id: game.id } }),
      )
    },
  )

  done()
}
