import { Request, Response } from "express"
import { NotFoundError, BadRequestError, UnauthenticatedError, UnauthorizedError } from "../errors";
import mongoose from "mongoose";
import { ReqUser } from "../types";

export const testServer = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "Hello World" }).end();
}

export const throwNotFound = async (req: Request, res: Response) => {
  throw new NotFoundError("Oh, Not Found");
}

export const throwBadRequest = async (req: Request, res: Response) => {
  throw new BadRequestError("Oh, Bad Request");
}

export const throwUnauthenticated = async (req: Request, res: Response) => {
  throw new UnauthenticatedError("Oh, Unauthenticated");
}

export const throwUnauthorized = async (req: Request, res: Response) => {
  throw new UnauthorizedError("Oh, Unauthorized");
}

export const testAuth = async (req: Request & { user: ReqUser }, res: Response) => {
  return res.status(200).json(req.user);
}