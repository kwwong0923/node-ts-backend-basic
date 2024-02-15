import bcryptjs from "bcryptjs";
import crypto from "crypto";

export const generateSalt = async () => {
  return await bcryptjs.genSalt(10);
}

export const hashPassword = async (password: string) => {
  const salt = await bcryptjs.genSalt(10);
  return await bcryptjs.hash(password, salt);
}

export const comparePassword = async (password: string, hashedPassword: string) => {
  return await bcryptjs.compare(password, hashedPassword);
}

export const random = () => {
  return crypto.randomBytes(128).toString("hex");
}