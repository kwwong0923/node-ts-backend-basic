import { Response } from "express";

type Cookies = {
  res: Response,
  token: string,
  name: string
}

const attachCookiesToResponse = ({ res, token, name }: Cookies) => {
  // Duration of JWT
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie(name, token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    signed: true,
    secure: process.env.NODE_ENV === "production" // true -> only on https
  })
}

export default attachCookiesToResponse;