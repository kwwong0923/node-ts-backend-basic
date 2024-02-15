import mongoose from "mongoose";

export type ReqUser = {
  _id: mongoose.Types.ObjectId,
  username: string,
  email: string,
  role: string,
}