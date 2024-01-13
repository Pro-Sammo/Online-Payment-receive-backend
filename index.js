import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import paymnetRouter from "./routes/payment.js";
import userRoute from "./routes/user.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import ErrorMiddleware from "./utils/error.js";
const app = express();

dotenv.config();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "https://online-payment-receive-frontend.vercel.app",
    credentials: true,
  })
);

app.use("/api/v1", paymnetRouter);
app.use("/api/v1", userRoute);

app.get("/", (req, res, next) => {
  res.json({
    message: "Server is working properly",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

app.use(ErrorMiddleware);
