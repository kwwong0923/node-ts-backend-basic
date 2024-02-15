import { Router } from "express";
import testRouter from "./test-router";
import authenticationRouter from "./authentication-router";
import userRouter from "./user-router";
const router = Router();

export default (): Router => {
  authenticationRouter(router);
  userRouter(router);
  testRouter(router);
  return router;
}