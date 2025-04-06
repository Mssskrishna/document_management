import express from "express";
import { createServer } from "http";
import cors from "cors";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import * as dotenv from "dotenv";
import studentRouter from "../router/studentRouter";
import authRouter from "../router/authRouter";
import executiveRouter from "../router/executiveRouter";
import { isAuthenticated } from "../middleware/authMiddleware";
import cookieParser from "cookie-parser";
dotenv.config();
// import publicRouter from "../router/publicRouter";
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
const corsOptions = {
  // origin: (_origin: any, callback: (arg0: any, arg1: boolean) => void) => {
  //   // Check if the origin is in the list of allowed origins
  //   callback(null, true);
  // },
  origin: "http://localhost:5173",
  methods: "GET,PUT,POST,OPTIONS", // Specify allowed methods
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(
  cookieSession({
    name: "session",
    keys: ["ksdasdo19ioslk"], // Encryption keys for cookies
    maxAge: 24 * 60 * 60 * 1000, // 1-day session expiration
    httpOnly: true,
    // secure: true, // Set to true in production when using HTTPS
  })
);
app.use("/auth", authRouter);
app.use("/student", isAuthenticated, studentRouter);
app.use("/executive", isAuthenticated, executiveRouter);

const server = createServer(app);
export { app };
export default server;
