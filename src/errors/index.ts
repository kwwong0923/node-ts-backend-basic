import { StatusCodes } from "http-status-codes";

// 404 - Not Found Error
export class NotFoundError extends Error {
  public statusCode;

  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = StatusCodes.NOT_FOUND
  }
}

// 400 - Bad Request Error
export class BadRequestError extends Error {
  public statusCode;

  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

// 401 - Unauthorized Error
// Login Fails
export class UnauthenticatedError extends Error {
  public statusCode;

  constructor(message: string) {
    super(message);
    this.name = "UnauthenticatedError";
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

// 403 - UNAUTHENTICATED ERROR
// X -> Admin page/ certain user page
export class UnauthorizedError extends Error {
  public statusCode;

  constructor(message: string) {
    super(message);
    this.name = "Unauthorized";
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}
