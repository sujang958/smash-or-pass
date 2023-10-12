export class HttpError extends Error {
  constructor(
    public httpCode: number,
    message: string,
  ) {
    super(message)
  }
}
