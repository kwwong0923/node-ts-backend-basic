import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";


const errorHandlerMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode: number = (err as any).statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const errorMessage: string = err.message || "Something went wrong, please try again later";

  return res.status(statusCode).json({ message: errorMessage });
};

export default errorHandlerMiddleware;