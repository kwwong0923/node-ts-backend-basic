import { NotFoundError } from "../errors";
import { Request, Response, } from "express";

const notFoundHandlerMiddleware = (req: Request, res: Response): never => {
  const url = req.baseUrl;
  throw new NotFoundError(`The route - <${url}> doesn't not exist`);
}

export default notFoundHandlerMiddleware;