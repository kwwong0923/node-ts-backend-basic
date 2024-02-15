import { body, param, query, validationResult, ValidationChain } from "express-validator";
import { NotFoundError, BadRequestError, UnauthenticatedError, UnauthorizedError } from "../errors";
import { Request, Response, NextFunction } from "express"
import { getUserByEmail } from "../models/user-model";


// Basic Function
const withValidationError = (
  validateValues: ValidationChain[]
): unknown => {
  return [
    validateValues,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);

        if (errorMessages[0].startsWith("verification")) {
          throw new UnauthenticatedError(errorMessages.toString());
        }

        if (errorMessages[0].startsWith("user not")) {
          throw new NotFoundError(errorMessages.toString());
        }

        throw new BadRequestError(errorMessages.toString());
      }
      next();
    }
  ]
}

export const validateRegisterInput = withValidationError([
  body("username")
    .notEmpty().withMessage("first Name is required"),
  body("password")
    .notEmpty().withMessage("password is required")
    .isLength({ min: 6 }).withMessage("password must be at least 6 characters long"),
  body("email")
    .notEmpty().withMessage("email is required")
    .isEmail().withMessage("invalid email format")
    .custom(async (email) => {
      const user = await getUserByEmail(email);
      if (user) throw new Error("email has registered before");
    }),
]);

export const validateVerifyEmailInput = withValidationError([
  query("token")
    .notEmpty().withMessage("token is required"),
  query("email")
    .notEmpty().withMessage("email is required")
    .isEmail().withMessage("invalid email format")
    .custom(async (email) => {
      const user = await getUserByEmail(email);
      if (!user) throw new Error("verification failed");
    })
])

export const validateLoginInput = withValidationError([
  body("password")
    .notEmpty().withMessage("password is required")
    .isLength({ min: 6 }).withMessage("password must be at least 6 characters long"),
  body("email")
    .notEmpty().withMessage("email is required")
    .isEmail().withMessage("invalid email format")
    .custom(async (email) => {
      const user = await getUserByEmail(email);
      if (!user) throw new UnauthenticatedError("Login Failed");
    })
])

export const validateForgotPasswordInput = withValidationError([
  body("email")
    .notEmpty().withMessage("email is required")
    .isEmail().withMessage("invalid email format")
    .custom(async (email) => {
      const user = await getUserByEmail(email);
      if (!user) throw new UnauthenticatedError("Login Failed");
    })
])

export const validateResetPasswordInput = withValidationError([
  body("token")
    .notEmpty().withMessage("token is required"),
  body("password")
    .notEmpty().withMessage("password is required")
    .isLength({ min: 6 }).withMessage("password must be at least 6 characters long"),
  body("email")
    .notEmpty().withMessage("email is required")
    .isEmail().withMessage("invalid email format")
    .custom(async (email) => {
      const user = await getUserByEmail(email);
      if (!user) throw new UnauthenticatedError("Login Failed");
    })
])
