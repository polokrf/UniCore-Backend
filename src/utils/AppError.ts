// An error with an HTTP status. Throw it for expected, user-facing failures:
//   throw new AppError(404, 'this routine is missing')
// Anything that is NOT an AppError is treated as an unexpected failure (500).
export class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
