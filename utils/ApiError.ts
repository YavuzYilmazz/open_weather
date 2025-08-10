export class ApiError extends Error {
  statusCode: number;
  metadata?: any;

  constructor(statusCode: number, message: string, metadata?: any) {
    super(message);
    this.statusCode = statusCode;
    this.metadata = metadata;
    Error.captureStackTrace(this, this.constructor);
  }
}
