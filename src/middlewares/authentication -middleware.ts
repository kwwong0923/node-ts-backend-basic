import { Request, Response, NextFunction } from "express";
import { get, merge } from "lodash";
import { getUserBySessionToken } from "../models/user-model";
import { UnauthenticatedError } from "../errors";
import { createJWT, verifyJWT } from "../utils/token-utils";
import attachCookiesToResponse from "../utils/cookie-utils";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const sessionToken = req.signedCookies["USER-TOKEN"];
  if (!sessionToken) throw new UnauthenticatedError("Authentication invalid")

  const user = await getUserBySessionToken(sessionToken);

  if (!user) throw new UnauthenticatedError("Authentication invalid")

  try {
    verifyJWT(sessionToken);
    // renew the token
    const newToken = createJWT({ user });
    attachCookiesToResponse({
      res,
      token: newToken,
      name: "USER-TOKEN"
    });
    user.authentication.sessionToken = newToken;
    await user.save();
    
    merge(req, { user });
    next();
  }
  catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
}

export const isOwner = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const currentUserId = get(req, "user._id") as string;

  if (!currentUserId) throw new UnauthenticatedError("Authentication invalid");

  if (currentUserId.toString() !== id) throw new UnauthenticatedError("Authentication invalid");

  return next();
}