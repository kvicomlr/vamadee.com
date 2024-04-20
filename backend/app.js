import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

//Routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";


//Configurations
const app = express();
// Use Helmet!

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message:
    "We have received too many request from this IP. Please try after one hour.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
dotenv.config();
const Port = process.env.PORT;

//Middlewares
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(helmet());
app.use("/api", limiter);
app.use(cookieParser());
app.use(express.json({ limit: "10kb" })); // BodyParser
app.use(express.urlencoded({ extended: true })); // allow data from frontend forms
app.use(mongoSanitize());

app.use("/api/v1/auths", authRoutes);
app.use("/api/v1/users", userRoutes);


app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

//Database
const connect = async () => {
  try {
    await mongoose.connect(process.env.mongoDB);
    console.log(`3. Backend Server is connected to MongoDB successfully!`);
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("connected", () => {
  console.log(
    "2. Backend Server has successfuly initiated connection to MongoDB!"
  );
});

////Backend Server Connection Here
app.listen(Port, () => {
  connect();
  console.log(`1. Application has successfully started on port: ${Port}`);
});
