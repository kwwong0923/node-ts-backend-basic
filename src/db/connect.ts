import mongoose from "mongoose";

export const connectDb = async (url: string) => {
  await mongoose.connect(url);
  console.log("Database is connected");
}