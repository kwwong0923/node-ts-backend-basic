import dotenv from "dotenv";
dotenv.config();
import "express-async-errors"

import express from "express";
const app = express();

import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";

import { connectDb } from "./db/connect";
import errorHandlerMiddleware from "./middlewares/errorHandler-middleware";
import notFoundHandlerMiddleware from "./middlewares/notFound-middleware";

import router from "./router";
// ----------- MIDDLEWARES ----------
app.use(cors({
  credentials: true,
}));
app.use(compression())
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


app.use("/api/", router());
app.use("*", notFoundHandlerMiddleware);
app.use(errorHandlerMiddleware);

// ----------- LISTENING ----------
const PORT = process.env.PORT || 8964;

async function main() {
  try {
    await connectDb(process.env.MONGO_URL);
    app.listen(PORT, () => {
      console.log(`Server is running at PORT ${PORT}`);
    })
  }
  catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();