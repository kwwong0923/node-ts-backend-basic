import { Router, RequestHandler } from "express";
import { login, register, verifyEmail, forgotPassword, resetPassword } from "../controllers/authentication-controller";
import {
  validateRegisterInput,
  validateVerifyEmailInput,
  validateLoginInput,
  validateForgotPasswordInput,
  validateResetPasswordInput
} from "../middlewares/validation-middleware";

export default (router: Router) => {
  router.post("/auth/register", [validateRegisterInput as RequestHandler], register);
  router.get("/auth/verify-email", [validateVerifyEmailInput as RequestHandler], verifyEmail);
  router.post("/auth/login", [validateLoginInput as RequestHandler], login);
  router.post("/auth/forgot-password", [validateForgotPasswordInput as RequestHandler], forgotPassword);
  router.post("/auth/reset-password",  [validateResetPasswordInput as RequestHandler], resetPassword)
}