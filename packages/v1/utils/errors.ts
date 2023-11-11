export class HttpError extends Error {
  constructor(public httpCode: number, message: string) {
    super(
      message
        .replace(process.env.DATABASE_URL!, "")
        .replace(process.env.DIRECT_URL!, ""),
    )
  }
}
