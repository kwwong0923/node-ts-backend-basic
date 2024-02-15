import { Router } from "express";
import { testServer, throwBadRequest, throwNotFound, throwUnauthenticated, throwUnauthorized, testAuth } from "../controllers/test-controller";
import { isAuthenticated } from "../middlewares/authentication -middleware";
export default (router: Router) => {
  router.get("/test/server", testServer);
  router.get("/test/error/404", throwNotFound);
  router.get("/test/error/400", throwBadRequest);
  router.get("/test/error/403", throwUnauthorized);
  router.get("/test/error/401", throwUnauthenticated);
  router.get("/test/auth", isAuthenticated, testAuth);
}