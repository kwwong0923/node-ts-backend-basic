import { Request, Response } from "express";
import { createUser, getUserByEmail } from "../models/user-model";
import { hashPassword, comparePassword, random } from "../utils/authentication-utils";
import { sendResetPasswordEmail, sendVerificationEmail } from "../utils/email-utils";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors";
import { createJWT } from "../utils/token-utils";
import attachCookiesToResponse from "../utils/cookie-utils";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const verificationToken = random();

  const user = await createUser({
    email, username,
    authentication: {
      password: await hashPassword(password)
    },
    verification: {
      verificationToken
    }
  })

  await sendVerificationEmail({
    name: user.username,
    email: user.email,
    verificationToken: user.verification.verificationToken,
    origin: process.env.ORIGIN,
  });

  return res.status(StatusCodes.CREATED).json(user);
}

export const verifyEmail = async (req: Request, res: Response) => {
  const { token, email } = req.query;

  const user = await getUserByEmail(<string>email).select("+verification.verificationToken + verification.isVerified");

  if (user.verification.isVerified) {
    throw new BadRequestError("The user had been verified before");
  }

  if (token !== user.verification.verificationToken) {
    throw new UnauthenticatedError("verification failed");
  }

  user.verification.isVerified = true;
  user.verification.verificationToken = null;

  await user.save();

  return res
    .status(StatusCodes.OK)
    .json({ message: `${user.username}'s email is verified` })
    .end();
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await getUserByEmail(email).select("+authentication.password")

  const isValid = user && (await comparePassword(password, user.authentication.password));

  if (!isValid) throw new UnauthenticatedError("invalid credentials");

  // Create JWT
  const token = createJWT({ user })
  user.authentication.sessionToken = token;
  await user.save();

  attachCookiesToResponse({ res, token, name: "USER-TOKEN" });

  return res
    .status(StatusCodes.OK)
    .json(user)
    .end();
}

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await getUserByEmail(email);
  const passwordToken = random();

  await sendResetPasswordEmail({
    name: user.username,
    email: user.email,
    passwordToken,
    origin: process.env.ORIGIN,
  });

  const hashedPasswordToken = await hashPassword(passwordToken);
  user.resetPassword.passwordToken = hashedPasswordToken;
  user.resetPassword.expirationDate = new Date(Date.now() + 1000 * 60 * 60); // 1hr
  await user.save();

  return res
    .status(StatusCodes.OK)
    .json({message: "Reset password email sent"})
    .end();
}

export const resetPassword = async (req: Request, res: Response) => {
  const { email, token, password } = req.body;
  const user = await getUserByEmail(email).select("+authentication.password +resetPassword.passwordToken +resetPassword.expirationDate");
  
  const currentDate = new Date();
  if (user.resetPassword.expirationDate < currentDate) {
    user.resetPassword.passwordToken = null;
    await user.save();
    throw new BadRequestError(
      "the link is expires, please start the process from the beginning"
    );
  }
  if (await comparePassword(token, user.resetPassword.passwordToken)) {
    const newPassword = await hashPassword(password);
    user.authentication.password = newPassword;
    user.resetPassword.passwordToken = null;
    user.resetPassword.expirationDate = null;
    await user.save();
  }
   
  return res
    .status(StatusCodes.OK)
    .json({message: "password reset"})
    .end();
}